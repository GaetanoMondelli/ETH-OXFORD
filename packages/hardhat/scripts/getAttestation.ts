const FLARE_CONTRACTS = "@flarenetwork/flare-periphery-contract-artifacts";
const FLARE_RPC = "https://coston-api.flare.network/ext/C/rpc";
const ATTESTATION_PROVIDER_URL = "https://attestation-coston.aflabs.net";
const ATTESTATION_PROVIDER_API_KEY = "123456";
const FLARE_CONTRACT_REGISTRY_ADDR = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";
import { ethers } from "ethers";
const PRIVATE_KEY = "1294695293f333466d699cca83fce35cf2c3dd960fd35a93d44ae548835c9b32";

function encodeAttestationName(attestationTypeName: string) {
  if (typeof attestationTypeName !== "string") {
    throw new Error(`Attestation type name must be a string. Provided value ${attestationTypeName}`);
  }
  if (attestationTypeName.startsWith("0x") || attestationTypeName.startsWith("0X")) {
    throw new Error(
      `Attestation type name must not start with '0x'. Provided value '${attestationTypeName}'. Possible confusion with hex encoding.`,
    );
  }
  const bytes = ethers.toUtf8Bytes(attestationTypeName);
  if (bytes.length > 32) {
    throw new Error(`Attestation type name ${attestationTypeName} is too long`);
  }
  return ethers.zeroPadBytes(bytes, 32);
}

function toHex(data: string) {
  var result = "";
  for (var i = 0; i < data.length; i++) {
    result += data.charCodeAt(i).toString(16);
  }
  return result;
}

const BTC_TRANSACTION_ID = "0x" + "62e7bd97d7b835484a760f3a81b2521f90170e9719b2a42dc084c8d4c5ad5a47";

async function prepareRequest() {
  const provider = new ethers.JsonRpcProvider(FLARE_RPC);

  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  const requestData = {
    attestationType: encodeAttestationName("Payment"),
    sourceId: encodeAttestationName("testBTC"),
    requestBody: {
      transactionId: BTC_TRANSACTION_ID,
      inUtxo: "1",
      utxo: "0x1",
    },
  };

  const response = await fetch(`${ATTESTATION_PROVIDER_URL}/verifier/btc/Payment/prepareRequest`, {
    method: "POST",
    headers: {
      "X-API-KEY": ATTESTATION_PROVIDER_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
  const encodedAttestationRequest = await response.json();
  console.log("Prepared request:", encodedAttestationRequest);

  // 3. Access Contract Registry
  const flare = await import(FLARE_CONTRACTS);
  const flareContractRegistry = new ethers.Contract(
    FLARE_CONTRACT_REGISTRY_ADDR,
    flare.nameToAbi("FlareContractRegistry", "coston").data,
    provider,
  );

  // 4. Retrieve the State Connector Contract Address
  const stateConnectorAddress = await flareContractRegistry.getContractAddressByName("StateConnector");
  const stateConnector = new ethers.Contract(
    stateConnectorAddress,
    flare.nameToAbi("StateConnector", "coston2").data,
    signer,
  );

  const attestationTx = await stateConnector.requestAttestations(encodedAttestationRequest.abiEncodedRequest);
  const receipt = await attestationTx.wait();
  const block = await provider.getBlock(receipt.blockNumber);
  const roundOffset = await stateConnector.BUFFER_TIMESTAMP_OFFSET();
  const roundDuration = await stateConnector.BUFFER_WINDOW();
  const submissionRoundID = block ? Number((BigInt(block.timestamp || 0) - roundOffset) / roundDuration) : -1;

  console.log("  Attestation submitted in round", submissionRoundID);

  var prevFinalizedRoundID = 0;
  setTimeout(async function poll() {
    const lastFinalizedRoundID = Number(await stateConnector.lastFinalizedRoundId());
    if (prevFinalizedRoundID != lastFinalizedRoundID) {
      console.log("  Last finalized round is", lastFinalizedRoundID);
      prevFinalizedRoundID = lastFinalizedRoundID;
    }
    if (lastFinalizedRoundID < submissionRoundID) {
      setTimeout(poll, 10000);
      return;
    }

    // 8. Retrieve Proof
    const proofRequest = {
      roundId: submissionRoundID,
      requestBytes: encodedAttestationRequest.abiEncodedRequest,
    };

    const ATTESTATION_ENDPOINT = `${ATTESTATION_PROVIDER_URL}/attestation-client/api/proof/` + `get-specific-proof`;

    console.log("Retrieving proof from attestation provider...");
    try {
      const providerResponse = await fetch(ATTESTATION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": ATTESTATION_PROVIDER_API_KEY,
        },
        body: JSON.stringify(proofRequest),
      });
      console.log(providerResponse);
      const proof = await providerResponse.json();
      if (proof.status !== "OK") {
        console.log("Received error:", proof);
        return;
      }
      console.log("  Received Merkle proof:", proof.data.merkleProof);
      // 9. Send Proof to Verifier Contract
      // Unpacked attestation proof to be used in a Solidity contract.
      const fullProof = {
        merkleProof: proof.data.merkleProof,
        data: {
          ...proof.data,
          ...proof.data.request,
          ...proof.data.response,
          status: proof.status,
        },
      };
      console.log("  Received proof:", proof);
      console.log("  Received full proof:", fullProof);
    
      const { isValid } = fullProof.data.responseBody;

      console.log("Sending the proof for verification...");
      const paymentVerifier = new ethers.Contract(
        flare.nameToAddress("IPaymentVerification", "coston"),
        flare.nameToAbi("IPaymentVerification", "coston").data,
        signer,
      );
      const isVerified = await paymentVerifier.verifyPayment(fullProof);
      console.log("  Attestation result:", isVerified);

      // 10. Check if Address is Valid
      if (isVerified) {
        console.log(
          isValid
            ? "Attestation providers agree that the address is valid."
            : "Attestation providers agree that the address is invalid.",
        );
      } else {
        console.log("Could not verify attestation. Validity of address is unknown.");
      }
    } catch (e) {
      console.log("Error:", e);
    }
  }, 10000);
}

// const network = "btc";
// const rawAttestationRequest = {
//   attestationType: encodeAttestationName("AddressValidity"),
//   sourceId: encodeAttestationName(`test${network.toUpperCase()}`),
//   requestBody: {
//     addressStr: "47f6a9846351cb4e9289ab75fe7f9be014047509f9aea3393bd164add1030def:1",
//   },
// };
// const VERIFICATION_ENDPOINT =
//   `${ATTESTATION_PROVIDER_URL}/verifier/${network.toLowerCase()}` + `/AddressValidity/prepareRequest`;

// const verifierResponse = await fetch(VERIFICATION_ENDPOINT, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "X-API-KEY": ATTESTATION_PROVIDER_API_KEY,
//   },
//   body: JSON.stringify(rawAttestationRequest),
// });
// const encodedAttestationRequest = await verifierResponse.json();
// if (encodedAttestationRequest.status !== "VALID") {
//   console.log("Received error:", encodedAttestationRequest);
//   return;
// }
// console.log("Received encoded attestation request:", encodedAttestationRequest.abiEncodedRequest);
// }

prepareRequest();
