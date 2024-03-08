import { expect } from "chai";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "hardhat";
import { CollateralVault, MockContractRegistry, MockFtsoRegistry } from "../typechain-types";

describe("Collateral", function () {
  const initialCollateralAmount = 1000;
  const collateralAmount = BigNumber.from(initialCollateralAmount).mul(BigNumber.from(10).pow(18));
  const fee = 2;
  const collateralRatio = 60;
  const lockinPeriod = 0;
  let contractRegistry: MockContractRegistry;
  let collateral: CollateralVault;
  let ftsoRegistry: MockFtsoRegistry;
  let minter: any;
  let owner: any;

  beforeEach(async () => {
    [minter, owner] = await ethers.getSigners();
    const collateralFactory = await ethers.getContractFactory("CollateralVault");
    const contractRegistryFactory = await ethers.getContractFactory("MockContractRegistry");
    const ftsoRegistryFactory = await ethers.getContractFactory("MockFtsoRegistry");

    contractRegistry = (await contractRegistryFactory.deploy()) as MockContractRegistry;
    ftsoRegistry = (await ftsoRegistryFactory.deploy()) as MockFtsoRegistry;

    await contractRegistry.setContractAddress("FtsoRegistry", await ftsoRegistry.getAddress());
    const contractRegistryAddress = await contractRegistry.getAddress();

    collateral = (await collateralFactory.deploy(
      contractRegistryAddress,
      "testBTC",
      "C2FLR",
      collateralRatio,
      collateralAmount.toString(),
      lockinPeriod,
      { value: collateralAmount.toString() },
    )) as CollateralVault;

    await collateral.setOwner(owner.address);
  });

  describe("Deployment", function () {
    it("Should have minted the right amount of synethetics based on collateral", async function () {
      const colateralPrize = (await ftsoRegistry["getCurrentPriceWithDecimals(string)"]("testBTC"))._price;
      const collateralToSyntheticConversion = await collateral.getCollateralToSyntheticConversion(
        collateralAmount.toString(),
      );
      const collaterisable = collateralAmount.mul(collateralRatio).div(100);
      const collaterisedSynethicsValue = await collateral.getCollateralToSyntheticConversion(collaterisable.toString());
      const syntheticBalance = await collateral.syntethicTokenBalance();

      console.log("colateralPrize amount", colateralPrize.toString(), collateralAmount.toString());
      console.log("collateralToSyntheticConversion", collateralToSyntheticConversion.toString());
      console.log("collaterisableAmount", collaterisable.toString());
      console.log("collateralAmount", collaterisedSynethicsValue.toString());
      console.log("syntheticBalance", syntheticBalance.toString());

      const expectedSyntheticAmount = collaterisedSynethicsValue;
      expect(BigNumber.from(syntheticBalance).eq(expectedSyntheticAmount)).to.be.true;
    });
    
  // todo need to check when burn right amount are given to minter and owner

  });
});
