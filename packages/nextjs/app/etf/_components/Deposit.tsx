"use client";

import React, { useEffect, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { useAccount, useContractRead, useContractWrite, useNetwork } from "wagmi";
import { displayTxResult } from "~~/app/debug/_components/contract";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getParsedError } from "~~/utils/scaffold-eth";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

export function Deposit({ bundleId }: { bundleId: string }) {
  const contractsData = getAllContracts();
  const [tok1, setTok1] = useState<any>();
  const [tok2, setTok2] = useState<any>();
  const [tok3, setTok3] = useState<any>();
  const pepeTokenAddress = "0x95F2C24d6b0d7D17fBF5dE14d4791504A240Ed6d";
  const writeTxn = useTransactor();
  const { chain } = useNetwork();
  const { address: connectedAddress } = useAccount();

  const { targetNetwork } = useTargetNetwork();

  const { isFetching: isFetReq0, refetch: refReq0 } = useContractRead({
    address: contractsData["ETF"].address,
    functionName: "requiredTokens",
    abi: contractsData["ETF"].abi,
    args: [0],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      console.log(parsedErrror);
    },
  });

  const { isFetching: isFetReq1, refetch: refReq1 } = useContractRead({
    address: contractsData["ETF"].address,
    functionName: "requiredTokens",
    abi: contractsData["ETF"].abi,
    args: [1],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      console.log(parsedErrror);
    },
  });

  const { isFetching: isFetReq2, refetch: refReq2 } = useContractRead({
    address: contractsData["ETF"].address,
    functionName: "requiredTokens",
    abi: contractsData["ETF"].abi,
    args: [2],
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      console.log(parsedErrror);
    },
  });

  const {
    data: deposit,
    isLoading: isdepLoading,
    writeAsync: depositAsync,
  } = useContractWrite({
    address: contractsData["ETF"].address,
    functionName: "deposit",
    abi: contractsData["ETF"].abi,
    args: [
      bundleId,
      [
        {
          _address: pepeTokenAddress,
          _quantity: BigNumber.from(100).mul(BigNumber.from(10).pow(18)).toString(),
          _chainId: "16",
          _contributor: connectedAddress,
        },
      ],
    ],
  });

  const contractSimpleName = "SimpleERC20";
  const {
    data: approve,
    isLoading,
    writeAsync,
  } = useContractWrite({
    address: pepeTokenAddress,
    functionName: "approve",
    abi: contractsData[contractSimpleName].abi,
    args: [contractsData["ETF"].address, BigNumber.from(100).mul(BigNumber.from(10).pow(18))],
  });

  useEffect(() => {
    async function fetchData(isFetching: any, refetch: any, setData: any) {
      if (isFetching) {
        return;
      }
      if (refetch) {
        const { data } = await refetch();
        console.log(data);
        setData(data);
      }
    }
    fetchData(isFetReq0, refReq0, setTok1);
    fetchData(isFetReq1, refReq1, setTok2);
    fetchData(isFetReq2, refReq2, setTok3);
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
      {isFetReq0 || isFetReq1 || (isFetReq2 && <p>Loading...</p>)}
      <b>Required Tokens</b>

      {[tok1, tok2, tok3].map((tok: any) => {
        if (!tok) {
          return <></>;
        }

        return (
          <>
            {/* <p>{displayTxResult(data)}</p> */}
            <div
              //   flex direction row one next to the other
              style={{
                display: "flex",
                flexDirection: "row",
                //   justifyContent: "space-between",
                width: "100%",
                gap: "50px",
              }}
            >
              <div>
                <p>Address:</p>
                {displayTxResult(tok[0])}
              </div>
              <div>
                <p>Chain:</p>
                {displayTxResult(tok[2])}
              </div>
              <div>
                <p>Quantity:</p>
                {displayTxResult(tok[1])}
              </div>
              {Number(tok[2]) === 16 && (
                <div>
                  <p>Approve 100 token</p>
                  <button
                    onClick={async () => {
                      if (writeAsync) {
                        try {
                          const makeWriteWithParams = () => writeAsync();
                          await writeTxn(makeWriteWithParams);
                          // onChange();
                        } catch (e: any) {
                          console.log(e);
                          //   notification.error(message);
                        }
                      }
                    }}
                  >
                    Approve
                  </button>
                </div>
              )}
              {Number(tok[2]) === 16 && (
                <div>
                  <p>Deposit 100 token</p>
                  <button
                    onClick={async () => {
                      if (depositAsync) {
                        try {
                          const makeWriteWithParams = () => depositAsync();
                          await writeTxn(makeWriteWithParams);
                          // onChange();
                        } catch (e: any) {
                          console.log(e);
                          //   notification.error(message);
                        }
                      }
                    }}
                  >
                    Deposit
                  </button>
                </div>
              )}
            </div>
          </>
        );
      })}

      <br></br>
    </div>
  );
}
