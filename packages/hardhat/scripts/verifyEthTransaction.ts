import flareLib = require("@flarenetwork/flare-periphery-contract-artifacts");
import "dotenv/config";
import { run } from "hardhat";
import fs  from "fs";
import { TransactionResponse } from "ethers";
import hardhat, { ethers } from "hardhat";
import { IStateConnector } from "../typechain-types";
// import sleep from "../../lib/utils";

// import { requestVerification, sleep } from "../../lib/utils";
// import { EthereumPaymentCollectorContract, FallbackContractContract, FallbackContractInstance } from "../../typechain-types";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// const { EVM_VERIFIER_URL, ATTESTATION_API_KEY, ATTESTATION_URL } = process.env;

const EVM_VERIFIER_URL = "https://evm-verifier.flare.network";
const ATTESTATION_API_KEY = "123456";
const ATTESTATION_URL = "https://attestation-coston.flare.network";

interface EVMRequestBody {
  transactionHash: string;
  requiredConfirmations: string;
  provideInput: boolean;
  listEvents: boolean;
  logIndices: number[];
}

export async function requestVerification(address: string, args: any[], repeat: number = 5) {
  for (let j = 0; j < repeat; j++) {
    try {
      await run("verify:verify", {
        address: address,
        constructorArguments: args,
      });
      break;
    } catch (e) {}
    await sleep(5000);
  }
}

function toHex(data: string): string {
  var result = "";
  for (var i = 0; i < data.length; i++) {
    result += data.charCodeAt(i).toString(16);
  }
  return "0x" + result.padEnd(64, "0");
}
async function requestMerkleProof(scRound: number, txID: string) {
  const attestationRequest = await prepareAttestationRequest("EVMTransaction", "eth", "testETH", {
    transactionHash: txID,
    requiredConfirmations: "1",
    provideInput: true,
    listEvents: true,
    logIndices: [],
  });

  const attestationProof = {
    roundId: Number(scRound),
    requestBytes: attestationRequest.abiEncodedRequest,
  };
  const response = await fetch(`${ATTESTATION_URL}/attestation-client/api/proof/get-specific-proof`, {
    method: "POST",
    headers: { "X-API-KEY": ATTESTATION_API_KEY as string, "Content-Type": "application/json" },
    body: JSON.stringify(attestationProof),
  });

  // Verified attestation proof from verifiers API endpoint.
  const responseData = await response.json();
  return responseData;
}

async function prepareAttestationRequest(
  attestationType: string,
  network: string,
  sourceId: string,
  requestBody: EVMRequestBody,
): Promise<any> {
  const response = await fetch(`${EVM_VERIFIER_URL}/verifier/${network}/${attestationType}/prepareRequest`, {
    method: "POST",
    headers: { "X-API-KEY": ATTESTATION_API_KEY as string, "Content-Type": "application/json" },
    body: JSON.stringify({
      attestationType: toHex(attestationType),
      sourceId: toHex(sourceId),
      requestBody: requestBody,
    }),
  });
  const data = await response.json();
  return data;
}

async function executeStateConnectorProof(txs: string[]) {
  const stateConnector = (await ethers.getContractAt(
    flareLib.nameToAbi("IStateConnector", "coston").data,
    flareLib.nameToAddress("StateConnector", "coston"),
  )) as unknown as IStateConnector;

  const responses = await Promise.all(
    txs.map(async tx => {
      const req = await prepareAttestationRequest("EVMTransaction", "eth", "testETH", {
        transactionHash: tx,
        requiredConfirmations: "1",
        provideInput: true,
        listEvents: true,
        logIndices: [],
      });
      return req["abiEncodedRequest"];
    }),
  );

  console.log("Responses: ", responses);

  // Call to the StateConnector protocol to provide attestation.

  const sc_txs = [];
  for (const response of responses) {
    const tx = await stateConnector.requestAttestations(response);
    sc_txs.push(tx);
  }
  await Promise.all(
    sc_txs.map(async tx => {
      tx.wait();
    }),
  );

  // Get constants from State connector smart contract
  const BUFFER_TIMESTAMP_OFFSET = Number(await stateConnector.BUFFER_TIMESTAMP_OFFSET());
  const BUFFER_WINDOW = Number(await stateConnector.BUFFER_WINDOW());

  await Promise.all(
    sc_txs.map(async tx => {
      return await tx.wait();
    }),
  );

  const rounds = await Promise.all(
    sc_txs.map(async tx => {
      // Get block number of the block containing contract call
      const blockNumber = tx.blockNumber;
      console.log("Block number: ", blockNumber);
      const block = await ethers.provider.getBlock(blockNumber as number);
      // Calculate roundId
      const roundId = Math.floor((block!.timestamp - BUFFER_TIMESTAMP_OFFSET) / BUFFER_WINDOW);
      // console.log("scRound:", roundId);
      return roundId;
    }),
  );
  console.log(
    "Rounds: ",
    rounds.map(r => r.toString()),
  );

  // Wait until the round is confirmed
  while (Number(await stateConnector.lastFinalizedRoundId()) < rounds[rounds.length - 1]) {
    console.log(
      "Waiting for the round to be confirmed",
      await stateConnector.lastFinalizedRoundId(),
      rounds[rounds.length - 1],
    );
    await sleep(20000);
  }

  console.log("Round confirmed, getting proof");
  // Get the proof
  const proofs = await Promise.all(
    txs.map(async tx => {
      return await requestMerkleProof(rounds[0], tx);
    }),
  );

  //   const onChainCollector = await EthereumPaymentCollector.new();
  //   await requestVerification(onChainCollector.address, []);

  console.log("Proofs: ", proofs);

  for (const proof of proofs) {
    const txData = {
      data: proof?.data?.response,
      merkleProof: proof.data.merkleProof,
    };
    console.log(JSON.stringify(txData, null, 2));
    // save on evmProof2.json
    await fs.writeFileSync("evmProof2.json", JSON.stringify(txData, null, 2));
    // await onChainCollector.collectPayment(txData);
  }
}

async function main() {
  await executeStateConnectorProof([
    // "0x0613fc75cc5f4e22294dbfe5bb575d7fc714efe0de94beda59b423b0a2225587",
    // "0x12ed6a48e594fcab55d54c184edbd7c22c19874ecf0be6239044bb44d387f758"
    // "0xb856e15aff227b00c13cc443c9f1fe4d519f3233e863b48c2c542cd2ceebe891"
    // "0x21d630a9cd452ea35fec23724f7cfba55da0140c36140df103f06b20896c1246"
    "0x57fd8a6490e0ad2500c949de82370d265b2ad761c1f5af6921f3c476411cc9b9"
  ]);
}

main().then(() => process.exit(0));
