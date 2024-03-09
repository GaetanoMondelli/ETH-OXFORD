import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract, ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import fs from "fs";
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
  require("dotenv").config();

  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Let's start deploying the contrtacts on Sepolia

  if (hre.network.name === "sepolia") {
    // await deploy("SimpleERC20", {
    //   from: deployer,
    //   args: ["OverChain", "OVR"],
    //   log: true,
    //   autoMine: true,
    // });

    // const overChain = await hre.ethers.getContract<Contract>("SimpleERC20", deployer);

    // await deploy("SimpleERC20", {
    //   from: deployer,
    //   args: ["UNISWAP", "UNI"],
    //   log: true,
    //   autoMine: true,
    // });

    // const uniSwap = await hre.ethers.getContract<Contract>("SimpleERC20", deployer);

    // await deploy("SimpleERC20", {
    //   from: deployer,
    //   args: ["ETFToken", "ETF"],
    //   log: true,
    //   autoMine: true,
    // });

    // const etfToken = await hre.ethers.getContract<Contract>("SimpleERC20", deployer);

    // const overChainAddress = await overChain.getAddress();
    // const uniSwapAddress = await uniSwap.getAddress();
    // const etfTokenAddress = await etfToken.getAddress();

    // // mint 1000000 tokens for each contract
    // await overChain.mint(deployer, 1000000);
    // await uniSwap.mint(deployer, 1000000);

    // fs.writeFileSync(
    //   "deployed.json",
    //   JSON.stringify(
    //     {
    //       overChain: overChainAddress,
    //       uniSwap: uniSwapAddress,
    //       etfToken: etfTokenAddress,
    //     },
    //     null,
    //     2,
    //   ),
    // );

    const overChainAddress = "0xFCb7E64A67dFAb710c3064e097B50B1d93898E71";
    const uniSwapAddress = "0x60a0F6a9952061A78E903B98e5452A996FD4233c";
    // const etfTokenAddress =  "0x1d8177b9dF133B72c198c9CF184FB4265CCFb986";

    const evmVerifierOfFlareTransaction = "0x0bd4a6D3eFbB0aa8b191AE71E7dfF41c10fe8B9F";
    const sepoliaChainId = BigNumber.from(31337);
    console.log("Deploying ETF Lock contract");
    await deploy("ETFLock", {
      from: deployer,
      args: [
        evmVerifierOfFlareTransaction,
        sepoliaChainId,
        [
          {
            _address: overChainAddress,
            _quantity: BigNumber.from(50).toString(),
            _chainId: sepoliaChainId.toString(),
            _contributor: deployer,
          },
          {
            _address: uniSwapAddress,
            _quantity: BigNumber.from(100).toString(),
            _chainId: sepoliaChainId.toString(),
            _contributor: deployer,
          },
        ],
      ],
      log: true,
      autoMine: true,
    });

    const loclOverChain = await hre.ethers.getContract<Contract>("ETFLock", deployer);
    // lock the required amount of tokens
    const vaultId = BigNumber.from(0);
    console.log("Locking the required amount of tokens");

    const overChain = await hre.ethers.getContractAt("SimpleERC20", overChainAddress);
    const uniSwap = await hre.ethers.getContractAt("SimpleERC20", uniSwapAddress);

    await overChain.approve(await loclOverChain.getAddress(), 50);
    await uniSwap.approve(await loclOverChain.getAddress(), 100);

    await loclOverChain.depositLock(vaultId.toString(), [
      {
        _address: overChainAddress,
        _quantity: BigNumber.from(50).toString(),
        _chainId: sepoliaChainId.toString(),
        _contributor: deployer,
      },
      {
        _address: uniSwapAddress,
        _quantity: BigNumber.from(100).toString(),
        _chainId: sepoliaChainId.toString(),
        _contributor: deployer,
      },
    ]);

    // verify the lock
    await hre.run("verify:verify", {
      address: await loclOverChain.getAddress(),
      constructorArguments: [
        evmVerifierOfFlareTransaction,
        sepoliaChainId,
        [
          {
            _address: overChainAddress,
            _quantity: BigNumber.from(50).toString(),
            _chainId: sepoliaChainId.toString(),
            _contributor: deployer,
          },
          {
            _address: uniSwapAddress,
            _quantity: BigNumber.from(100).toString(),
            _chainId: sepoliaChainId.toString(),
            _contributor: deployer,
          },
        ],
      ],
    });

    return;
  }
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
// deployYourContract.tags = ["YourContract"];
