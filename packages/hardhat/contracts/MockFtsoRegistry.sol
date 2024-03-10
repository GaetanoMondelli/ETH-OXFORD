
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol";

contract MockFtsoRegistry is IFtsoRegistry {

	mapping (string => uint256[3]) prices;
	string[] public symbols;

	constructor() {
		symbols.push("PEPE");
		symbols.push("OVR");
		symbols.push("UNI");
		prices["PEPE"] = [100000, 1709745120, 5];
		prices["OVR"] = [200000, 1709745120, 5];
		prices["UNI"] = [500000, 1709745120, 5];
	}

	function getSupportedSymbols()
		public
		view
		override
		returns (string[] memory)
	{
		return symbols;
		
	}

	function setSupportedSymbols(string[] memory _symbols) external {
	}

	function getCurrentPriceWithDecimals(
		string memory _symbol
	)
		public
		view
		override
		returns (uint256 _price, uint256 _timestamp, uint256 _decimals)
	{
		return (prices[_symbol][0], prices[_symbol][1], prices[_symbol][2]);
	}


	function setPrice(string memory symbol, uint256 price) public {
		prices[symbol][0] = price;
	}


	function getFtsos(
		uint256[] memory _indices
	) external view override returns (IFtsoGenesis[] memory _ftsos) {}

	function getFtso(
		uint256 _ftsoIndex
	) external view override returns (IIFtso _activeFtsoAddress) {}

	function getFtsoBySymbol(
		string memory _symbol
	) external view override returns (IIFtso _activeFtsoAddress) {}

	function getSupportedIndices()
		external
		view
		override
		returns (uint256[] memory _supportedIndices)
	{}

	function getSupportedFtsos()
		external
		view
		override
		returns (IIFtso[] memory _ftsos)
	{}

	function getFtsoIndex(
		string memory _symbol
	) external view override returns (uint256 _assetIndex) {}

	function getFtsoSymbol(
		uint256 _ftsoIndex
	) external view override returns (string memory _symbol) {}

	function getCurrentPrice(
		uint256 _ftsoIndex
	) external view override returns (uint256 _price, uint256 _timestamp) {}

	function getCurrentPrice(
		string memory _symbol
	) external view override returns (uint256 _price, uint256 _timestamp) {

		return (prices[_symbol][0], prices[_symbol][1]);
	}

	function getCurrentPriceWithDecimals(
		uint256 _assetIndex
	)
		external
		view
		override
		returns (
			uint256 _price,
			uint256 _timestamp,
			uint256 _assetPriceUsdDecimals
		)
	{}

	function getAllCurrentPrices()
		external
		view
		override
		returns (PriceInfo[] memory)
	{}

	function getCurrentPricesByIndices(
		uint256[] memory _indices
	) external view override returns (PriceInfo[] memory) {}

	function getCurrentPricesBySymbols(
		string[] memory _symbols
	) external view override returns (PriceInfo[] memory) {}

	function getSupportedIndicesAndFtsos()
		external
		view
		override
		returns (uint256[] memory _supportedIndices, IIFtso[] memory _ftsos)
	{}

	function getSupportedSymbolsAndFtsos()
		external
		view
		override
		returns (string[] memory _supportedSymbols, IIFtso[] memory _ftsos)
	{}

	function getSupportedIndicesAndSymbols()
		external
		view
		override
		returns (
			uint256[] memory _supportedIndices,
			string[] memory _supportedSymbols
		)
	{}

	function getSupportedIndicesSymbolsAndFtsos()
		external
		view
		override
		returns (
			uint256[] memory _supportedIndices,
			string[] memory _supportedSymbols,
			IIFtso[] memory _ftsos
		)
	{}
}