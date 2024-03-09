"use client";

import React, { useState } from "react";
import { useContractRead } from "wagmi";
import { displayTxResult } from "~~/app/debug/_components/contract";
import { getParsedError } from "~~/utils/scaffold-eth";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

export function CollateralVaultView({ bundleId }: { bundleId: Array<any> }) {
  const contractsData = getAllContracts();
    const [data, setData] = useState<any>();

  const { isFetching, refetch } = useContractRead({
    address: contractsData["Broker"].address,
    functionName: "fee",
    abi: contractsData["Broker"].abi,
    args: [],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      console.log(parsedErrror);
    },
  });

  return (
    <div>
      <h2>Collateral Vault</h2>
      <p>Bundle ID: {bundleId}</p>
      <button
        onClick={async () => {
          const { data } = await refetch();
          setData(data);
          console.log(data);
        }}
        disabled={isFetching}
      >
        Fetch
      </button>
      {data !== null && data !== undefined && <p>{displayTxResult(data)}</p>}
      <br></br>
    </div>
  );
}
