// import { DebugContracts } from "./_components/DebugContracts";
"use client";

import { useEffect, useState } from "react";
import { TxReceipt, displayTxResult } from "../debug/_components/contract";
import { CollateralVaultView } from "./_components/CollateralVault";
import { MatrixView } from "./_components/MatrixView";
import "./index.css";
import { BigNumber } from "@ethersproject/bignumber";
import type { NextPage } from "next";
import { TransactionReceipt } from "viem";
import { useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

const Broker: NextPage = () => {
  const initialCollateralAmount = 1;

  const collateralAmount = BigNumber.from(initialCollateralAmount).mul(BigNumber.from(10).pow(18));
  const collateralAmountFee = collateralAmount.mul(2).div(100).add(collateralAmount);

  const contractsData = getAllContracts();
  const [bundleId, setBundleId] = useState<string>("1");
  const [resultFee, setResultFee] = useState<any>();
  const [resultOV, setResultOV] = useState<any>();
  const [txValue, setTxValue] = useState<string | bigint>("");
  const writeTxn = useTransactor();
  const { chain } = useNetwork();

  const { targetNetwork } = useTargetNetwork();
  const writeDisabled = !chain || chain?.id !== targetNetwork.id;

  const { isFetching, refetch } = useContractRead({
    address: contractsData["Broker"].address,
    functionName: "fee",
    abi: contractsData["Broker"].abi,
    args: [],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      notification.error(parsedErrror);
    },
  });

  const {
    data: result,
    isLoading,
    writeAsync,
  } = useContractWrite({
    address: contractsData["Broker"].address,
    functionName: "openVault",
    abi: contractsData["Broker"].abi,
    args: ["testBTC", collateralAmount.toString(), 1],
  });

  const handleWrite = async () => {
    if (writeAsync) {
      try {
        const makeWriteWithParams = () => writeAsync({ value: BigInt(collateralAmountFee.toString()) });
        await writeTxn(makeWriteWithParams);
        // onChange();
      } catch (e: any) {
        const message = getParsedError(e);
        notification.error(message);
      }
    }
  };

  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
  const { data: txResult } = useWaitForTransaction({
    hash: result?.hash,
  });
  useEffect(() => {
    setDisplayedTxResult(txResult);
  }, [txResult]);

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          color: "black",
          width: "800px",
        }}
        className="card"
      >
        <h1 className="text-4xl my-0">Example {bundleId}</h1>
        <MatrixView setBundleId={setBundleId} bundleId={bundleId} bundles={[]} />

        <p>Test call</p>

        <button className="btn btn-secondary btn-sm" disabled={writeDisabled || isLoading} onClick={handleWrite}>
          {isLoading && <span className="loading loading-spinner loading-xs"></span>}
          Send 💸
        </button>
        {txResult ? (
          <div className="flex-grow basis-0">
            {displayedTxResult ? <TxReceipt txResult={displayedTxResult} /> : null}
          </div>
        ) : null}

        <br></br>
        <CollateralVaultView bundleId={bundleId} />
      </div>
    </>
  );
};

export default Broker;
