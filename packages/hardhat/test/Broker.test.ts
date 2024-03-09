import { expect } from "chai";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "hardhat";
import { Broker, MockContractRegistry, MockFtsoRegistry } from "../typechain-types";

describe("Broker", function () {
  const initialCollateralAmount = 1000;
  const collateralAmount = BigNumber.from(initialCollateralAmount).mul(BigNumber.from(10).pow(18));
  const fee = 2;
  const collateralRatio = 60;
  const lockinPeriod = 0;
  let contractRegistry: MockContractRegistry;
  let broker: Broker;
  let ftsoRegistry: MockFtsoRegistry;
  let minter: any;
  let owner: any;

  beforeEach(async () => {
    [minter, owner] = await ethers.getSigners();
    const contractRegistryFactory = await ethers.getContractFactory("MockContractRegistry");
    const ftsoRegistryFactory = await ethers.getContractFactory("MockFtsoRegistry");
    const BrokerFactory = await ethers.getContractFactory("Broker");

    contractRegistry = (await contractRegistryFactory.deploy()) as MockContractRegistry;
    ftsoRegistry = (await ftsoRegistryFactory.deploy()) as MockFtsoRegistry;
    await contractRegistry.setContractAddress("FtsoRegistry", await ftsoRegistry.getAddress());

    broker = (await BrokerFactory.deploy(
      await contractRegistry.getAddress(),
      "C2FLR",
      collateralRatio,
      lockinPeriod,
      fee,
    )) as Broker;
  });

  it("Should be to open a vault", async function () {
    const vaultFee = collateralAmount.mul(fee).div(100).add(collateralAmount);
    console.log("vaultFee", vaultFee.toString());
    const vault = await broker.openVault("testBTC", collateralAmount.toString(), {
      value: vaultFee.toString(),
    });
    expect(vault).to.be.ok;
    // expect the balance of the vault to be the same as the collateral amount
    const vaultBalance = await  ethers.provider.getBalance(
        await broker.vaults(0)
    );
    expect(BigNumber.from(vaultBalance).eq(collateralAmount));
    const brokerBalance = await ethers.provider.getBalance(await broker.getAddress()); 
    expect(BigNumber.from(brokerBalance).eq(vaultFee.sub(collateralAmount)));
  });
});
