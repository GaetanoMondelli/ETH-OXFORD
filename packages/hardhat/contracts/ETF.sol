// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IETFToken } from "./SimpleERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {EVMTransaction} from "@flarenetwork/flare-periphery-contracts/coston/stateConnector/interface/EVMTransaction.sol";
import {FlareContractsRegistryLibrary} from "@flarenetwork/flare-periphery-contracts/coston/util-contracts/ContractRegistryLibrary.sol";
import {IFtsoRegistry} from "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol";

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
	address public ftsoRegistry;
    Token[] public requiredTokens;
    uint256 public chainId;
    address public etfToken;
    uint256 public  etfTokenPerVault;
    bool no_constraints = false;

    mapping(uint256 => Vault) public vaults;

    mapping(uint256 => address[]) public contributionsAddress;
    mapping(uint256 => uint256[]) public contributionsAmount;
    mapping(address => string) public symbols;
    
    struct EventInfo {
    address sender;
    uint256 quantity;
    uint256 chainId;
    address contributor;
    }

    struct TransactionInfo {
        EVMTransaction.Proof originalTransaction;
        uint256 eventNumber;
        EventInfo[] eventInfo;
    }


    event Burn(
        uint256 _vaultId,
        address _address
    );


    constructor(
        address _ftsoRegistry,
        // array of symbols
        string[] memory _symbols,
        uint256 _chainId,
        address _etfToken, 
        uint256 _etfTokenPerVault,
        Token[] memory _requiredTokens
        ) 
    {
        // flareContractsRegistryLibrary = _flareContractsRegistryLibrary; // this one should check flare transactions
       ftsoRegistry = _ftsoRegistry;
       chainId = _chainId;
        etfToken = _etfToken;
        etfTokenPerVault = _etfTokenPerVault;
        for (uint256 i = 0; i < _requiredTokens.length; i++) {
            requiredTokens.push(_requiredTokens[i]);
            symbols[_requiredTokens[i]._address] = _symbols[i];
        }
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
        if(no_constraints){
             _deposit(_vaultId, _tokens, chainId);
        }
        _deposit(_vaultId, _tokens, chainId);
    }

    

    function _deposit(uint256 _vaultId, Token[] memory _tokens, uint256 _chainId) private {
        // require(vaults[_vaultId].state == VaultState.OPEN || vaults[_vaultId].state == VaultState.EMPTY,
        //     "Vault is not open or empty"
        // );
 
        
        // transfer tokens to the vault
        for (uint256 i = 0; i < _tokens.length; i++) {
            if (_tokens[i]._chainId == chainId) {
                IERC20(_tokens[i]._address).transferFrom(
                    _tokens[i]._contributor,
                    address(this),
                    _tokens[i]._quantity
                );
            }
            // vaults[_vaultId]._tokens.push(_tokens[i]);
            uint256 j = 0;
            for (j=0; j < vaults[_vaultId]._tokens.length; j++) {
                if (vaults[_vaultId]._tokens[j]._address == _tokens[i]._address
                    && vaults[_vaultId]._tokens[j]._chainId == _chainId
                ) {
                    vaults[_vaultId]._tokens[j]._quantity += _tokens[i]._quantity;

                    // get the price of the token
                    (uint256 currentSyntheticPrice, , ) = IFtsoRegistry(ftsoRegistry).getCurrentPriceWithDecimals(
                        symbols[_tokens[i]._address]
                    );
                    contributionsAmount[_vaultId].push(currentSyntheticPrice * _tokens[i]._quantity);
                    contributionsAddress[_vaultId].push(_tokens[i]._contributor);
                    break;
                }
            }
            if (j == vaults[_vaultId]._tokens.length) {
                (uint256 currentSyntheticPrice, , ) = IFtsoRegistry(ftsoRegistry).getCurrentPriceWithDecimals(
                        symbols[_tokens[i]._address]
                    );
                    contributionsAmount[_vaultId].push(currentSyntheticPrice * _tokens[i]._quantity);
                    contributionsAddress[_vaultId].push(_tokens[i]._contributor);
                    vaults[_vaultId]._tokens.push(_tokens[i]);
            }
        }
        
        vaults[_vaultId].state = VaultState.OPEN;

        if (checkVaultCompletion(_vaultId)) {
            vaults[_vaultId].state = VaultState.MINTED;

            // calculate the contribution
            uint256 contributionslength = contributionsAddress[_vaultId].length;
            uint256 totalContribution = 0;

            for (uint256 i = 0; i < contributionslength; i++) {
                totalContribution += contributionsAmount[_vaultId][i];
            }

            for (uint256 i = 0; i < contributionslength; i++) {
                IETFToken(etfToken).mint(msg.sender, 
                    etfTokenPerVault * contributionsAmount[_vaultId][i] / totalContribution);
            }
        }
    }

    TransactionInfo[] public transactions;

    function checkExternalDeposit(EVMTransaction.Proof calldata _transaction) external {
        require(isEVMTransactionProofValid(_transaction), "Invalid transaction proof");
        uint256 transactionIndex = transactions.length;
        transactions.push();
        transactions[transactionIndex].originalTransaction = _transaction;
        transactions[transactionIndex].eventNumber = _transaction.data.responseBody.events.length;
        Token[] memory tokens = new Token[](2);
        uint256 external_chainId;
        uint256 vaultId;
        uint256 index=0;
        bytes32 eventTopic = keccak256("Deposit(uint256,address,uint256,uint256,address)");
        for(uint256 i = 0; i < _transaction.data.responseBody.events.length; i++) {
            if (_transaction.data.responseBody.events[i].topics[0] != eventTopic) {
                continue;
            }
            (uint256 _vaultId, address _address, uint256 _quantity, uint256 _chainId, address _contributor) = abi.decode(_transaction.data.responseBody.events[i].data, (uint256, address, uint256, uint256, address));
            tokens[index] = Token(_address, _quantity, _chainId, _contributor);
            index++;
            external_chainId = _chainId;
            vaultId = _vaultId;
        }
        _deposit(vaultId, tokens, external_chainId);
    }


    function burn(uint256 _vaultId) public {
        require(vaults[_vaultId].state == VaultState.MINTED, "Vault was not minted");
        vaults[_vaultId].state = VaultState.BURNED;
        for (uint256 i = 0; i < vaults[_vaultId]._tokens.length; i++) {
            if (vaults[_vaultId]._tokens[i]._chainId == chainId) {
                IERC20(vaults[_vaultId]._tokens[i]._address).transfer(
                    msg.sender,
                    vaults[_vaultId]._tokens[i]._quantity
                );
            }
        }
        IETFToken(etfToken).burn(msg.sender, etfTokenPerVault);
        emit Burn(_vaultId, msg.sender);
    }
    
    function isEVMTransactionProofValid(
        EVMTransaction.Proof calldata transaction
    ) public view returns (bool) {
        // Use the library to get the verifier contract and verify that this transaction was proved by state connector
        return FlareContractsRegistryLibrary
                .auxiliaryGetIEVMTransactionVerification()
                .verifyEVMTransaction(transaction);

                // 0x0bd4a6D3eFbB0aa8b191AE71E7dfF41c10fe8B9F
    }
}
