// import { DebugContracts } from "./_components/DebugContracts";
"use client";

import { MatrixView } from "./_components/MatrixView";
import "./index.css";
import type { NextPage } from "next";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

// import { DebugContracts } from "./_components/DebugContracts";

const Debug: NextPage = () => {
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
      </div>
    </>
  );
};

export default Debug;
