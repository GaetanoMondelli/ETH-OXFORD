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

contract ETF  {
	address public flareContractRegistry;
    Token[] requiredTokens;
    uint256 public chainId;
    

    mapping(uint256 => Vault) public vaults;
    
    struct EventInfo {
    address sender;
    uint256 quantity;
    uint256 chainId;
    address contributor;
    // bytes data;
    }

struct TransactionInfo {
    EVMTransaction.Proof originalTransaction;
    uint256 eventNumber;
    EventInfo[] eventInfo;
}

    constructor(address _flareContractRegistry, uint256 _chainId) {
        flareContractRegistry = _flareContractRegistry;
        chainId = _chainId;
    }

    function getVaultStates()
        public
        view
        returns (VaultState[] memory)
    {
        VaultState[] memory states = new VaultState[](90);
        for (uint256 i = 0; i < 90; i++) {
            states[i] = vaults[i].state;
        }
        return states;
    }

    function getVault(uint256 _vaultId)
        public
        view
        returns (Token[] memory, VaultState)
    {
        return (vaults[_vaultId]._tokens, vaults[_vaultId].state);
    }


    function checkVaultCompletion(uint256 _vaultId) public view returns (bool) {
        for (uint256 i = 0; i < requiredTokens.length; i++) {
            bool found = false;
            for (uint256 j = 0; j < vaults[_vaultId]._tokens.length; j++) {
                if (requiredTokens[i]._address == vaults[_vaultId]._tokens[j]._address) {
                    found = true;
                    if (requiredTokens[i]._quantity > vaults[_vaultId]._tokens[j]._quantity) {
                        return false;
                    }
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }

    function deposit(uint256 _vaultId, Token[] memory _tokens) public {
        _deposit(_vaultId, _tokens, chainId);
    }

    function _deposit(uint256 _vaultId, Token[] memory _tokens, uint256 _chainId) private {
        require(vaults[_vaultId].state == VaultState.OPEN || vaults[_vaultId].state == VaultState.EMPTY,
            "Vault is not open or empty"
        );
        uint256 whitelistedQuantity = 0;
        for (uint256 i = 0; i < _tokens.length; i++) {
            uint256 whitelistedIndex = requiredTokens.length;
            for (uint256 j = 0; j < requiredTokens.length; j++) {
                if (requiredTokens[j]._address == _tokens[i]._address) {
                    whitelistedIndex = j;
                    break;
                }
            }
            require(
                whitelistedIndex < requiredTokens.length,
                "Token not allowed"
            );
            require(
                _tokens[i]._quantity >= requiredTokens[whitelistedIndex]._quantity,
                "Insufficient quantity"
            );
            // check chain id
            require(_tokens[i]._chainId == _chainId, "Invalid chain id");
            whitelistedQuantity++;
        }
        require(
            whitelistedQuantity == requiredTokens.length,
            "Some tokens are missing"
        );
        
        // transfer tokens to the vault
        for (uint256 i = 0; i < _tokens.length; i++) {
            IERC20(_tokens[i]._address).transferFrom(
                _tokens[i]._contributor,
                address(this),
                _tokens[i]._quantity
            );
            uint256 j = 0;
            for (j=0; j < vaults[_vaultId]._tokens.length; j++) {
                if (vaults[_vaultId]._tokens[j]._address == _tokens[i]._address) {
                    vaults[_vaultId]._tokens[j]._quantity += _tokens[i]._quantity;
                    break;
                }
            }
            if (j == vaults[_vaultId]._tokens.length) {
                vaults[_vaultId]._tokens.push(_tokens[i]);
            }
        }
        

        if (checkVaultCompletion(_vaultId)) {
            vaults[_vaultId].state = VaultState.MINTED;
        }
    }

    TransactionInfo[] public transactions;

    function checkExternalDeposit(EVMTransaction.Proof calldata _transaction) external {
        require(isEVMTransactionProofValid(_transaction), "Invalid transaction proof");
        uint256 transactionIndex = transactions.length;
        transactions.push();
        transactions[transactionIndex].originalTransaction = _transaction;
        transactions[transactionIndex].eventNumber = _transaction.data.responseBody.events.length;
        // EventInfo[] storage eventInfo = transactions[transactionIndex].eventInfo;
        Token[] memory tokens = new Token[](_transaction.data.responseBody.events.length);
        uint256 external_chainId;
        for(uint256 i = 0; i < _transaction.data.responseBody.events.length; i++) {
            // (address sender, uint256 value, bytes memory data) = abi.decode(_transaction.data.responseBody.events[i].data, (address, uint256, bytes));
            (address _address, uint256 _quantity, uint256 _chainId, address _contributor) = abi.decode(_transaction.data.responseBody.events[i].data, (address, uint256, uint256, address));
            tokens[i] = Token(_address, _quantity, _chainId, _contributor);
            external_chainId = _chainId;
        }
        _deposit(transactionIndex, tokens, external_chainId);
    }
    
    function isEVMTransactionProofValid(
        EVMTransaction.Proof calldata transaction
    ) public view returns (bool) {
        // Use the library to get the verifier contract and verify that this transaction was proved by state connector
        return FlareContractsRegistryLibrary
                .auxiliaryGetIEVMTransactionVerification()
                .verifyEVMTransaction(transaction);
    }
}
