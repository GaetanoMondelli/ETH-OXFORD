// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { TokenBundle, ITokenBundle } from "@thirdweb-dev/contracts/extension/TokenBundle.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import "@flarenetwork/flare-periphery-contracts/flare/util-contracts/userInterfaces/IFlareContractRegistry.sol";
import "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol";
import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import { IETFToken } from "./SimpleERC20.sol";
import { console } from "hardhat/console.sol";

address constant NATIVE_TOKEN = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

contract CollateralVault {
	address public flareContractRegistry;
	uint256 public collateralRatio;
	address public minter;
	string public symbolSynthetic;
	uint256 public mintSyntheticPrice;
	uint256 public amountCollateral;
	uint256 public syntethicTokenBalance;
	address public owner;

	string public symbolCollateral = "FLR22";
	address public collateralToken = NATIVE_TOKEN;
	uint256 public mintCollateralPrice = 1;
	uint256 public lockingPeriod = 1 days;

	event MinterAmount(address minter, uint256 amount);
	event OwnerAmount(address owner, uint256 amount);

	constructor(
		address _flareContractRegistry,
		string memory _symbolSynthetic,
		string memory _symbolCollateral,
		uint256 _collateralRatio,
		uint256 _amountCollateral,
		uint256 _lockingPeriod
	) payable {
		require(msg.value >= _amountCollateral, "Insufficient collateral2");
		minter = msg.sender;
		flareContractRegistry = _flareContractRegistry;
		symbolSynthetic = _symbolSynthetic;
		symbolCollateral = _symbolCollateral;
		collateralRatio = _collateralRatio;
		lockingPeriod = _lockingPeriod;
		amountCollateral = _amountCollateral;
		owner = msg.sender;
		mint(_amountCollateral);
	}

	function setOwner(address _owner) public {
		require(msg.sender == owner, "Only the owner can set the owner");
		owner = _owner;
	}

	function setMinter(address _minter) public {
		require(msg.sender == owner, "Only the owner can set the minter");
		minter = _minter;
	}

	function getCollateralToSyntheticConversion(
		uint256 amount
	) public view returns (uint256) {
		// uint256 decimalPriceDifference = 18 - 5;

		(uint256 currentSyntheticPrice, , ) = getTokenPriceWei(symbolSynthetic);

		(uint256 currentCollateralTokenPrice, , ) = getTokenPriceWei(
			symbolCollateral
		);
		uint256 normalizedAmount = amount; // (10 ** decimalPriceDifference);
		return
			(currentCollateralTokenPrice * normalizedAmount) /
			currentSyntheticPrice;
	}

	function mint(uint256 _amountCollateral) private {
		uint256 collaterisableAmount = (_amountCollateral * collateralRatio) /
			100;

		uint256 _amountSynthetic = getCollateralToSyntheticConversion(
			collaterisableAmount
		);
		(mintSyntheticPrice, , ) = getTokenPriceWei(symbolSynthetic);

		syntethicTokenBalance = _amountSynthetic;
	}

	function getCurrentValue() public view returns (uint256) {
		(uint256 currentSyntheticPrice, , ) = getTokenPriceWei(symbolSynthetic);
		uint256 valueSynthetic = syntethicTokenBalance * currentSyntheticPrice;
		// add 5 decimals to the value
		valueSynthetic = valueSynthetic / (10 ** 5);
		return valueSynthetic;
	}

	function burn() public {
		require(
			msg.sender == owner,
			"Only the owner can burn the synthetic tokens"
		);
		require(block.timestamp > lockingPeriod, "Locking period not over yet");

		uint256 valueSynthetic = getCurrentValue();

		uint256 amountCollateralToWithdrawToOwner = Math.min(
			amountCollateral,
			valueSynthetic
		);

		payable(owner).transfer(amountCollateralToWithdrawToOwner);
		emit OwnerAmount(owner, amountCollateralToWithdrawToOwner);


		if (address(this).balance > 0) {
			emit MinterAmount(minter, address(this).balance);
			payable(minter).transfer(address(this).balance);
		} else {
			emit MinterAmount(minter, 0);
		}
		syntethicTokenBalance = 0;
	}

	function getTokenPriceWei(
		string memory _symbol
	)
		public
		view
		returns (uint256 _price, uint256 _timestamp, uint256 _decimals)
	{
		IFlareContractRegistry contractRegistry = IFlareContractRegistry(
			flareContractRegistry
		);
		IFtsoRegistry ftsoRegistry = IFtsoRegistry(
			contractRegistry.getContractAddressByName("FtsoRegistry")
		);
		(_price, _timestamp, _decimals) = ftsoRegistry
			.getCurrentPriceWithDecimals(_symbol);

		return (_price, _timestamp, _decimals);
	}
}
