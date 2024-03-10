import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract, ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import fs from "fs";
// read JSON file

const sepoliaChainId = BigNumber.from(31337);
const overChainAddress = "0xFCb7E64A67dFAb710c3064e097B50B1d93898E71";
const uniSwapAddress = "0x60a0F6a9952061A78E903B98e5452A996FD4233c";
const costonChainId = BigNumber.from(16);

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

  if (hre.network.name === "coston") {
    console.log("Publishing Sepolia Transaction");
    const etfAddress = "0x85325798FF4E6bd40B1766AEa13bFe1e3e586D75";
    const etf = await hre.ethers.getContractAt("ETF", etfAddress);
    const data = fs.readFileSync("/Users/gaetano/dev/flare_training/packages/hardhat/evmproof2.json");
    const proof = JSON.parse(data.toString());
    console.log("Publishing Proof from sepolia to coston's ETF contract", etfAddress);
    console.log(proof);
    await etf.checkExternalDeposit(proof);
  }

  if (hre.network.name === "coston" && false) {
    // const etfAddress = "0x5fb202C83294787B6A36Dfb53D643eD27128d69f";
    // const etf = await hre.ethers.getContractAt("ETF", etfAddress);

    await deploy("MockFtsoRegistry", {
      from: deployer,
      args: [],
      log: true,
      autoMine: true,
    });

    const ftsoRegistry = await hre.ethers.getContract<Contract>("MockFtsoRegistry", deployer);
    const ftsoRegistryAddress = await ftsoRegistry.getAddress();

    await deploy("SimpleERC20", {
      from: deployer,
      args: ["ETFToken", "ETF"],
      log: true,
      autoMine: true,
    });

    const etfToken = await hre.ethers.getContract<Contract>("SimpleERC20", deployer);
    const etfTokenAddress = await etfToken.getAddress();

    // await deploy("SimpleERC20", {
    //   from: deployer,
    //   args: ["PEPE TOKEN", "PEPE"],
    //   log: true,
    //   autoMine: true,
    // });

    // const pepeToken = await hre.ethers.getContract<Contract>("SimpleERC20", deployer);

    const pepeToken = await hre.ethers.getContractAt("SimpleERC20", "0x95F2C24d6b0d7D17fBF5dE14d4791504A240Ed6d");
    const pepeTokenAddress = await pepeToken.getAddress();
    await pepeToken.mint(deployer, BigNumber.from(1000).mul(BigNumber.from(10).pow(18)).toString());
    // await pepeToken.approve(etfTokenAddress, BigNumber.from(1000).mul(BigNumber.from(10).pow(18)).toString());

    try {
      await hre.run("verify:verify", {
        address: etfTokenAddress,
        constructorArguments: ["ETFToken", "ETF"],
      });

      // await hre.run("verify:verify", {
      //   address: pepeTokenAddress,
      //   constructorArguments: ["PEPE TOKEN, PEPE"],
      // });
    } catch (e) {
      console.log("Error verifying the contract");
      console.log(e);
    }

    await deploy("ETF", {
      from: deployer,
      log: true,
      autoMine: true,
      args: [
        ftsoRegistryAddress,
        ["OVR", "UNI", "PEPE"],
        costonChainId,
        etfTokenAddress,
        BigNumber.from(100).mul(BigNumber.from(10).pow(18)).toString(),
        [
          {
            _address: overChainAddress,
            _quantity: BigNumber.from(50).mul(BigNumber.from(10).pow(18)).toString(),
            _chainId: sepoliaChainId.toString(),
            _contributor: deployer,
          },
          {
            _address: uniSwapAddress,
            _quantity: BigNumber.from(100).mul(BigNumber.from(10).pow(18)).toString(),
            _chainId: sepoliaChainId.toString(),
            _contributor: deployer,
          },
          {
            _address: pepeTokenAddress,
            _quantity: BigNumber.from(100).mul(BigNumber.from(10).pow(18)).toString(),
            _chainId: costonChainId.toString(),
            _contributor: deployer,
          },
        ],
      ],
    });

    const etf = await hre.ethers.getContract<Contract>("ETF", deployer);
    const etfAddress = await etf.getAddress();
    const data = fs.readFileSync("/Users/gaetano/dev/flare_training/packages/hardhat/evmproof2.json");
    const proof = JSON.parse(data.toString());
    console.log("Deploying ETF contract", etfAddress);
    console.log(proof);
    const chainId = await etf.chainId();
    console.log("ChainId: ", chainId.toString());
    await pepeToken.approve(etfAddress, BigNumber.from(1000).mul(BigNumber.from(10).pow(18)).toString());
    await etf.checkExternalDeposit(proof);
    await etf.deposit(3, [
      {
        _address: pepeTokenAddress,
        _quantity: BigNumber.from(100).mul(BigNumber.from(10).pow(18)).toString(),
        _chainId: costonChainId.toString(),
        _contributor: deployer,
      },
    ]);

    await etf.deposit(0, [
      {
        _address: pepeTokenAddress,
        _quantity: BigNumber.from(100).mul(BigNumber.from(10).pow(18)).toString(),
        _chainId: costonChainId.toString(),
        _contributor: deployer,
      },
    ]);

    // approve etf tokens to reedem the tokens
    await etfToken.approve(etfAddress, BigNumber.from(100).mul(BigNumber.from(10).pow(18)).toString());
    // await etf.burn(0);

    try {
      await hre.run("verify:verify", {
        address: etfAddress,
        constructorArguments: [
          ftsoRegistryAddress,
          ["OVR", "UNI", "PEPE"],
          costonChainId,
          etfTokenAddress,
          BigNumber.from(100).mul(BigNumber.from(10).pow(18)).toString(),
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
    } catch (e) {
      console.log("Error verifying the contract");
      console.log(e);
    }
  }

  if (hre.network.name === "coston" && false) {
    await deploy("SimpleERC20", {
      from: deployer,
      args: ["ETFToken", "ETF"],
      log: true,
      autoMine: true,
    });

    const etfToken = await hre.ethers.getContract<Contract>("SimpleERC20", deployer);
    const etfTokenAddress = await etfToken.getAddress();

    await hre.run("verify:verify", {
      address: etfTokenAddress,
      constructorArguments: ["ETFToken", "ETF"],
    });

    const sepoliaChainId = BigNumber.from(31337);
    const overChainAddress = "0xFCb7E64A67dFAb710c3064e097B50B1d93898E71";
    const uniSwapAddress = "0x60a0F6a9952061A78E903B98e5452A996FD4233c";
    const costonChainId = BigNumber.from(16);

    // etfToken =  "0x60a0F6a9952061A78E903B98e5452A996FD4233c";

    await deploy("SimpleERC20", {
      from: deployer,
      args: ["PEPE TOKEN", "PEPE"],
      log: true,
      autoMine: true,
    });

    const pepeToken = await hre.ethers.getContract<Contract>("SimpleERC20", deployer);
    const pepeTokenAddress = await pepeToken.getAddress();

    await hre.run("verify:verify", {
      address: pepeTokenAddress,
      constructorArguments: ["PEPE TOKEN", "PEPE"],
    });
    // uint256 _chainId,
    // address _etfToken, uint256 _etfTokenPerVault,
    // Token[] memory _requiredTokens
    console.log("Deploying ETF contract");
    await deploy("ETF", {
      from: deployer,
      log: true,
      autoMine: true,
      args: [
        costonChainId,
        etfTokenAddress,
        100,
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

    const etf = await hre.ethers.getContract<Contract>("ETF", deployer);
    const etfAddress = await etf.getAddress();

    // const etfAddress = "0x2cE00d5a6F739a142C9A3E1E2eea363bC47fF7F2";
    // const etf = await hre.ethers.getContractAt("ETF", etfAddress);

    // const result = await etf.checkExternalDeposit(
    //   data ? JSON.parse(data.toString()) : [],
    // )

    // verify the lock
    await hre.run("verify:verify", {
      address: etfAddress,
      constructorArguments: [
        costonChainId,
        etfTokenAddress,
        100,
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

    console.log("Deployed ETF contract at ", etfAddress);
  }

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

    console.log("Deploying ETF Lock contract on sepolia");
    const overChainAddress = "0xFCb7E64A67dFAb710c3064e097B50B1d93898E71";
    const uniSwapAddress = "0x60a0F6a9952061A78E903B98e5452A996FD4233c";
    const evmVerifierOfFlareTransaction = "0x0bd4a6D3eFbB0aa8b191AE71E7dfF41c10fe8B9F";
    const sepoliaChainId = BigNumber.from(31337);
    const amount = BigNumber.from(100).mul(BigNumber.from(10).pow(18));
    const vaultId = BigNumber.from(34);

    await deploy("ETFLock", {
      from: deployer,
      args: [
        evmVerifierOfFlareTransaction,
        sepoliaChainId,
        [
          {
            _address: overChainAddress,
            _quantity: BigNumber.from(amount).toString(),
            _chainId: sepoliaChainId.toString(),
            _contributor: deployer,
          },
          {
            _address: uniSwapAddress,
            _quantity: BigNumber.from(amount).div(2).toString(),
            _chainId: sepoliaChainId.toString(),
            _contributor: deployer,
          },
        ],
      ],
      log: true,
      autoMine: true,
    });

    // const loclOverChain = await hre.ethers.getContract<Contract>("ETFLock", deployer);
    // lock the required amount of tokens
    // const vaultId = BigNumber.from(34);
    // const loclOverChainAddress = "0x2cE00d5a6F739a142C9A3E1E2eea363bC47fF7F2";
    // const loclOverChain = await hre.ethers.getContractAt("ETFLock", loclOverChainAddress);
    const loclOverChain = await hre.ethers.getContract<Contract>("ETFLock", deployer);
    console.log("Locking the required amount of tokens on vault", vaultId.toString());


    const overChain = await hre.ethers.getContractAt("SimpleERC20", overChainAddress);
    const uniSwap = await hre.ethers.getContractAt("SimpleERC20", uniSwapAddress);

    await uniSwap.mint(deployer, amount.toString());
    await overChain.mint(deployer, amount.toString());

    await overChain.approve(await loclOverChain.getAddress(), amount.toString());
    await uniSwap.approve(await loclOverChain.getAddress(), amount.toString());

    const tx = await loclOverChain.depositLock(25, [
      {
        _address: overChainAddress,
        _quantity: BigNumber.from(amount).div(2).toString(),
        _chainId: sepoliaChainId.toString(),
        _contributor: deployer,
      },
      {
        _address: uniSwapAddress,
        _quantity: BigNumber.from(amount).div(1).toString(),
        _chainId: sepoliaChainId.toString(),
        _contributor: deployer,
      },
    ]);

    console.log("Transaction hash: ", tx.hash);

    // verify the lock
    // await hre.run("verify:verify", {
    //   address: await loclOverChain.getAddress(),
    //   constructorArguments: [
    //     evmVerifierOfFlareTransaction,
    //     sepoliaChainId,
    //     [
    //       {
    //         _address: overChainAddress,
    //         _quantity: BigNumber.from(50).toString(),
    //         _chainId: sepoliaChainId.toString(),
    //         _contributor: deployer,
    //       },
    //       {
    //         _address: uniSwapAddress,
    //         _quantity: BigNumber.from(100).toString(),
    //         _chainId: sepoliaChainId.toString(),
    //         _contributor: deployer,
    //       },
    //     ],
    //   ],
    // });

    return;
  }
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
// deployYourContract.tags = ["YourContract"];
