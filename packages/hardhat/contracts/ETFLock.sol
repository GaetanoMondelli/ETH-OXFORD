// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { CollateralVault } from "./Collateral.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {EVMTransaction} from "@flarenetwork/flare-periphery-contracts/coston/stateConnector/interface/EVMTransaction.sol";
import {FlareContractsRegistryLibrary} from "@flarenetwork/flare-periphery-contracts/coston/util-contracts/ContractRegistryLibrary.sol";

struct Token {
    address _address;
    uint256 _quantity;
    uint256 _chainId;
    address _contributor;
}

struct Vault {
    Token[] _tokens;
    VaultState state;
}

enum VaultState {
    EMPTY,
    OPEN,
    MINTED,
    BURNED
}

struct EventInfo {
    address sender;
    uint256 quantity;
    uint256 chainId;
    address contributor;
}

contract ETFLock  {
	address public evmVerifierOfFlareTransaction;
    Token[] requiredTokens;
    uint256 public chainId;

    event Deposit(
        uint256 _vaultId,
        address _address,
        uint256 _quantity,
        uint256 _chainId,
        address _contributor
    );

    mapping(uint256 => Vault) public vaults;

    struct TransactionInfo {
    EVMTransaction.Proof originalTransaction;
    uint256 eventNumber;
    EventInfo[] eventInfo;
    }

    constructor(address _evmVerifierOfFlareTransaction, uint256 _chainId,
        Token[] memory _requiredTokens)
    {
        evmVerifierOfFlareTransaction = _evmVerifierOfFlareTransaction;
        chainId = _chainId;
        for (uint256 i = 0; i < _requiredTokens.length; i++) {
            requiredTokens.push(_requiredTokens[i]);
        }
    }


    function getVaultStates()
        public
        view
        returns (VaultState[] memory)
    {
        VaultState[] memory states = new VaultState[](90);
        for (uint256 i = 0; i < states.length; i++) {
            states[i] = vaults[i].state;
        }
        return states;
    }

    function depositLock(
        uint256 _vaultId,
        Token[] memory _tokens
    )
        public
    {
        require(vaults[_vaultId].state == VaultState.OPEN
            || vaults[_vaultId].state == VaultState.EMPTY,
            "Vault is not open or empty"
        );
        for (uint256 i = 0; i < _tokens.length; i++) {
            IERC20(_tokens[i]._address).transferFrom(
                _tokens[i]._contributor,
                address(this),
                _tokens[i]._quantity
            );
            // uint256 j = 0;
            // for (j=0; j < vaults[_vaultId]._tokens.length; j++) {
            //     if (vaults[_vaultId]._tokens[j]._address == _tokens[i]._address) {
            //         vaults[_vaultId]._tokens[j]._quantity += _tokens[i]._quantity;
            //         break;
            //     }
            // }
            // if (j == vaults[_vaultId]._tokens.length) {
            //     vaults[_vaultId]._tokens.push(_tokens[i]);
            // }
            vaults[_vaultId]._tokens.push(_tokens[i]);

            emit Deposit(
                _vaultId,
                _tokens[i]._address,
                _tokens[i]._quantity,
                _tokens[i]._chainId,
                _tokens[i]._contributor
            );
        }
    }

}
