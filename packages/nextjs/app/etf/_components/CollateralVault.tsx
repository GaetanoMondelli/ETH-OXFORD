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
    address: contractsData["ETF"].address,
    functionName: "getVault",
    abi: contractsData["ETF"].abi,
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
        console.log(data);
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
          <b>TOKEN IN THE VAULT</b>
          {data[0].map((item: any, index: number) => {
            return (
              <div
                className="card"
                key={index}
                style={{
                  padding: "1%",
                }}
              >
                {Number(displayTxResult(data[0][index]._chainId)) !== 16 ? <div> 
                  <b>WRAPPED ASSET</b>
                  <br></br>
                  <hr></hr>
                  </div> : <></>}
                <b>Address</b>
                <p>{displayTxResult(data[0][index]._address)}</p>
                <p>Chain Id</p>
                <p>{displayTxResult(data[0][index]._chainId)}</p>
                <p>Amount</p>
                <p>{displayTxResult(data[0][index]._quantity)}</p>
              </div>
            );
          })}
        </>
      )}
      <br></br>
    </div>
  );
}
