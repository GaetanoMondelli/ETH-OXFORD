// import { DebugContracts } from "./_components/DebugContracts";
"use client";

import { useState } from "react";
import { displayTxResult } from "../debug/_components/contract";
import { MatrixView } from "./_components/MatrixView";
import "./index.css";
import type { NextPage } from "next";
import { useContractRead } from "wagmi";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

const Broker: NextPage = () => {
  const contractsData = getAllContracts();
  const [result, setResult] = useState<any>();

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
        <h1 className="text-4xl my-0">Example</h1>
        <MatrixView
          //   contracts={contracts}
          bundles={[]}
          //   address="0x1234567890"
          //   bundleState={{}}
          //   bundleStateLoading={false}
          //   bundleId={0}
          //   bundleStateError={null}
          //   setBundleId={null}
          //   requiredTokenStructs={{}}
        />
        <p>Test call</p>
        {contractsData["Broker"].address}
        {isFetching ? "Fetching..." : "Not fetching"}
        <button
          onClick={async () => {
            const { data } = await refetch();
            setResult(data);
            console.log(data);
          }}
          disabled={isFetching}
        >
          Fetch
        </button>
        {result !== null && result !== undefined && <p>{displayTxResult(result)}</p>}
      </div>
    </>
  );
};

export default Broker;
