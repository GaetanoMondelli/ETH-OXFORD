import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const initialCollateralAmount = 1000;
  const collateralAmount = BigNumber.from(initialCollateralAmount).mul(BigNumber.from(10).pow(18));
  const fee = 2;
  const collateralRatio = 60;
  const lockinPeriod = 0;

  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("YourContract", {
    from: deployer,
    // Contract constructor arguments
    args: [deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  let contractRegistry: Contract;
  let ftsoRegistry: Contract;
  let broker: Contract;


  if (hre.network.name === "hardhat") {
    await deploy("MockContractRegistry", {
      from: deployer,
      args: [],
      log: true,
      autoMine: true,
    });

    contractRegistry = await hre.ethers.getContract<Contract>("MockContractRegistry", deployer);

    await deploy("MockFtsoRegistry", {
      from: deployer,
      args: [],
      log: true,
      autoMine: true,
    });

    ftsoRegistry = await hre.ethers.getContract<Contract>("MockFtsoRegistry", deployer);
    contractRegistry.setContractAddress("FtsoRegistry", await ftsoRegistry.getAddress());
  }

  await deploy("MockFtsoRegistry", {
    from: deployer,
    args: [await contractRegistry.getAddress(), "C2FLR", collateralRatio, lockinPeriod, fee],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const yourContract = await hre.ethers.getContract<Contract>("YourContract", deployer);
  console.log("👋 Initial greeting:", await yourContract.greeting());
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
