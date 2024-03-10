"use client";

import React, { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { displayTxResult } from "~~/app/debug/_components/contract";
import { getParsedError } from "~~/utils/scaffold-eth";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

export function CollateralVaultView({ bundleId }: { bundleId: string }) {
  const contractsData = getAllContracts();
  const [data, setData] = useState<any>();

  const { isFetching, refetch } = useContractRead({
    address: contractsData["Broker"].address,
    functionName: "getVaultOverview",
    abi: contractsData["Broker"].abi,
    args: [bundleId],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      console.log(parsedErrror);
    },
  });

  useEffect(() => {
    async function fetchData() {
      if (isFetching) {
        return;
      }
      if (refetch) {
        const { data } = await refetch();
        setData(data);
      }
    }
    fetchData();
  }, [bundleId]);

  return (
    <div>
      <h1>Collateral Vault</h1>
      <p>Bundle ID: {bundleId}</p>
      {/* <button
        onClick={async () => {
          const { data } = await refetch();
          setData(data);
          console.log(data);
        }}
        disabled={isFetching}
      >
        getOwner
      </button> */}
      {isFetching && <p>Loading...</p>}
      {data !== null && data !== undefined && (
        <>
          {/* <p>{displayTxResult(data)}</p> */}
          <p>Owner</p>
          <p>{displayTxResult(data[0])}</p>
          <p>Collateral (FLR)</p>
          <p>{displayTxResult(data[1])}</p>
          <p>Synthtic (testBTC)</p>
          <p>{Number(displayTxResult(data[2]))/1000000000000000000}</p>
          <p>Mint Prize</p>
          <p>{Number(displayTxResult(data[3]))/100000} $</p>
          <p>Collateral Ratio</p>
          <p>{displayTxResult(data[4])}</p>

        </>
      )}
      <br></br>
    </div>
  );
}
