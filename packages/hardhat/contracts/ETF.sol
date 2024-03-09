// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { CollateralVault } from "./Collateral.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";


struct Token {
    address _address;
    uint256 _quantity;
    uint256 _chainId;
}

enum VaultState {
    EMPTY,
    MINTED,
    BURNED
}

contract ETF  {
	address public flareContractRegistry;
    Token[] requiredTokens;
    mapping(uint256 => VaultState) public vaults;

    constructor(address _flareContractRegistry) {
        flareContractRegistry = _flareContractRegistry;
    }


    function getBundleStates()
        public
        view
        returns (VaultState[] memory)
    {
        VaultState[] memory states = new VaultState[](90);
        for (uint256 i = 0; i < 90; i++) {
            states[i] = vaults[i];
        }
        return states;
    }


    function getBundle(uint256 bundleId) public view returns (address[] memory, uint256[] memory) {
        address[] memory addresses = bundleIdToAddress[bundleId];
        uint256[] memory quantities = new uint256[](addresses.length);
        for (uint256 i = 0; i < addresses.length; i++) {
            quantities[i] = tokenQuantities[bundleId][addresses[i]];
        }
        return (addresses, quantities);
    }


}
