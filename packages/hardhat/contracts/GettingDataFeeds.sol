// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol";
import "@flarenetwork/flare-periphery-contracts/flare/util-contracts/userInterfaces/IFlareContractRegistry.sol";
import {TokenBundle, ITokenBundle} from "@thirdweb-dev/contracts/extension/TokenBundle.sol";


contract GettingDataFeeds {
	address private FLARE_CONTRACT_REGISTRY =
		0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019;

	constructor(address _flareContractRegistry) {
		FLARE_CONTRACT_REGISTRY = _flareContractRegistry;
	}

	function getSymbols() public view returns (string[] memory) {
		IFlareContractRegistry contractRegistry = IFlareContractRegistry(
			FLARE_CONTRACT_REGISTRY
		);

		IFtsoRegistry ftsoRegistry = IFtsoRegistry(
			contractRegistry.getContractAddressByName("FtsoRegistry")
		);

		return  ftsoRegistry.getSupportedSymbols();
	}

	function getTokenPriceWei(
		string memory _symbol
	)
		public
		view
		returns (uint256 _price, uint256 _timestamp, uint256 _decimals)
	{
		// 2. Access the Contract Registry
		IFlareContractRegistry contractRegistry = IFlareContractRegistry(
			FLARE_CONTRACT_REGISTRY
		);

		// 3. Retrieve the FTSO Registry
		IFtsoRegistry ftsoRegistry = IFtsoRegistry(
			contractRegistry.getContractAddressByName("FtsoRegistry")
		);

		// 4. Get latest price
		(_price, _timestamp, _decimals) = ftsoRegistry
			.getCurrentPriceWithDecimals(_symbol);
	}

	// function _deposit(uint256 _vaultId, Token[] memory _tokens, uint256 _chainId) private {
    //     require(vaults[_vaultId].state == VaultState.OPEN || vaults[_vaultId].state == VaultState.EMPTY,
    //         "Vault is not open or empty"
    //     );
    //     // uint256 whitelistedQuantity = 0;
    //     // for (uint256 i = 0; i < _tokens.length; i++) {
    //     //     uint256 whitelistedIndex = requiredTokens.length;
    //     //     for (uint256 j = 0; j < requiredTokens.length; j++) {
    //     //         if (requiredTokens[j]._address == _tokens[i]._address) {
    //     //             whitelistedIndex = j;
    //     //             break;
    //     //         }
    //     //     }
    //     //     require(
    //     //         whitelistedIndex < requiredTokens.length,
    //     //         "Token not allowed"
    //     //     );
    //     //     require(
    //     //         _tokens[i]._quantity >= requiredTokens[whitelistedIndex]._quantity,
    //     //         "Insufficient quantity"
    //     //     );
    //     //     // check chain id
    //     //     require(_tokens[i]._chainId == _chainId, "Invalid chain id");
    //     //     whitelistedQuantity++;
    //     // }
    //     // require(
    //     //     whitelistedQuantity == requiredTokens.length,
    //     //     "Some tokens are missing"
    //     // );
        
    //     // transfer tokens to the vault
    //     for (uint256 i = 0; i < _tokens.length; i++) {
    //         IERC20(_tokens[i]._address).transferFrom(
    //             _tokens[i]._contributor,
    //             address(this),
    //             _tokens[i]._quantity
    //         );
    //         uint256 j = 0;
    //         for (j=0; j < vaults[_vaultId]._tokens.length; j++) {
    //             if (vaults[_vaultId]._tokens[j]._address == _tokens[i]._address) {
    //                 vaults[_vaultId]._tokens[j]._quantity += _tokens[i]._quantity;
    //                 break;
    //             }
    //         }
    //         if (j == vaults[_vaultId]._tokens.length) {
    //             vaults[_vaultId]._tokens.push(_tokens[i]);
    //         }
    //     }
        

    //     if (checkVaultCompletion(_vaultId)) {
    //         vaults[_vaultId].state = VaultState.MINTED;
    //     }
    // }
}
