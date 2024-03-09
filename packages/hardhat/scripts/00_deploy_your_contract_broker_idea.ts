// import { HardhatRuntimeEnvironment } from "hardhat/types";
// import { DeployFunction } from "hardhat-deploy/types";
// import { Contract } from "ethers";
// import { BigNumber } from "@ethersproject/bignumber";

// /**
//  * Deploys a contract named "YourContract" using the deployer account and
//  * constructor arguments set to the deployer address
//  *
//  * @param hre HardhatRuntimeEnvironment object.
//  */
// const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   const initialCollateralAmount = 1000;
//   const collateralAmount = BigNumber.from(initialCollateralAmount).mul(BigNumber.from(10).pow(18));
//   const fee = 2;
//   const collateralRatio = 60;
//   const lockinPeriod = 0;

//   const { deployer } = await hre.getNamedAccounts();
//   const { deploy } = hre.deployments;


//   let contractRegistry: Contract;
//   let ftsoRegistry: Contract;
//   let broker: Contract;

//   // address private FLARE_CONTRACT_REGISTRY =
//   // 0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019;

//   let contractRegistryAddress = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";


//   if (hre.network.name === "localhost") {
//     // Deploy the Mock contracts
//     await deploy("MockContractRegistry", {
//       from: deployer,
//       args: [],
//       log: true,
//       autoMine: true,
//     });

//     contractRegistry = await hre.ethers.getContract<Contract>("MockContractRegistry", deployer);

//     await deploy("MockFtsoRegistry", {
//       from: deployer,
//       args: [],
//       log: true,
//       autoMine: true,
//     });

//     ftsoRegistry = await hre.ethers.getContract<Contract>("MockFtsoRegistry", deployer);
//     contractRegistryAddress = await contractRegistry.getAddress();
//     contractRegistry.setContractAddress("FtsoRegistry", await ftsoRegistry.getAddress());
//   }

//   await deploy("Broker", {
//     from: deployer,
//     args: [contractRegistryAddress, "C2FLR", collateralRatio, lockinPeriod, fee],
//     log: true,
//     autoMine: true,
//   });

//   // Get the deployed contract to interact with it after deploying.
// };

// export default deployYourContract;

// // Tags are useful if you have multiple deploy files and only want to run one of them.
// // e.g. yarn deploy --tags YourContract
// // deployYourContract.tags = ["YourContract"];
