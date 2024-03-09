/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  114: {
    GettingDataFeeds: {
      address: "0xdE617C9DaDDF41EbD739cA57eBbA607C11ba902d",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_flareContractRegistry",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "getSymbols",
          outputs: [
            {
              internalType: "string[]",
              name: "",
              type: "string[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_symbol",
              type: "string",
            },
          ],
          name: "getTokenPriceWei",
          outputs: [
            {
              internalType: "uint256",
              name: "_price",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_timestamp",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_decimals",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
  },
  31337: {
    Broker: {
      address: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_flareContractRegistry",
              type: "address",
            },
            {
              internalType: "string",
              name: "_symbolCollateral",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "_collateralRatio",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_lockingPeriod",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_fee",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "approved",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "ApprovalForAll",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "balance",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "balances",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "collateralRatio",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "fee",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "flareContractRegistry",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "getApproved",
          outputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "vaultId",
              type: "uint256",
            },
          ],
          name: "getVaultOverview",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
          ],
          name: "isApprovedForAll",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "lockingPeriod",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_symbolSynthetic",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "_amountCollateral",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "vaultId",
              type: "uint256",
            },
          ],
          name: "openVault",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ownerOf",
          outputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "owners",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              internalType: "bool",
              name: "_approved",
              type: "bool",
            },
          ],
          name: "setApprovalForAll",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "symbolCollateral",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "vaults",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "vaultsByOwner",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      inheritedFunctions: {
        approve: "@openzeppelin/contracts/token/ERC721/IERC721.sol",
        balanceOf: "@openzeppelin/contracts/token/ERC721/IERC721.sol",
        getApproved: "@openzeppelin/contracts/token/ERC721/IERC721.sol",
        isApprovedForAll: "@openzeppelin/contracts/token/ERC721/IERC721.sol",
        ownerOf: "@openzeppelin/contracts/token/ERC721/IERC721.sol",
        safeTransferFrom: "@openzeppelin/contracts/token/ERC721/IERC721.sol",
        setApprovalForAll: "@openzeppelin/contracts/token/ERC721/IERC721.sol",
        supportsInterface: "@openzeppelin/contracts/token/ERC721/IERC721.sol",
        transferFrom: "@openzeppelin/contracts/token/ERC721/IERC721.sol",
      },
    },
    MockContractRegistry: {
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      abi: [
        {
          inputs: [],
          name: "getAllContracts",
          outputs: [
            {
              internalType: "string[]",
              name: "_names",
              type: "string[]",
            },
            {
              internalType: "address[]",
              name: "_addresses",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "_nameHash",
              type: "bytes32",
            },
          ],
          name: "getContractAddressByHash",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_name",
              type: "string",
            },
          ],
          name: "getContractAddressByName",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32[]",
              name: "_nameHashes",
              type: "bytes32[]",
            },
          ],
          name: "getContractAddressesByHash",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string[]",
              name: "_names",
              type: "string[]",
            },
          ],
          name: "getContractAddressesByName",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_name",
              type: "string",
            },
            {
              internalType: "address",
              name: "_address",
              type: "address",
            },
          ],
          name: "setContractAddress",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {
        getAllContracts:
          "@flarenetwork/flare-periphery-contracts/flare/util-contracts/userInterfaces/IFlareContractRegistry.sol",
        getContractAddressByHash:
          "@flarenetwork/flare-periphery-contracts/flare/util-contracts/userInterfaces/IFlareContractRegistry.sol",
        getContractAddressByName:
          "@flarenetwork/flare-periphery-contracts/flare/util-contracts/userInterfaces/IFlareContractRegistry.sol",
        getContractAddressesByHash:
          "@flarenetwork/flare-periphery-contracts/flare/util-contracts/userInterfaces/IFlareContractRegistry.sol",
        getContractAddressesByName:
          "@flarenetwork/flare-periphery-contracts/flare/util-contracts/userInterfaces/IFlareContractRegistry.sol",
      },
    },
    MockFtsoRegistry: {
      address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "getAllCurrentPrices",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "ftsoIndex",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "price",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "decimals",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              internalType: "struct IFtsoRegistry.PriceInfo[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_symbol",
              type: "string",
            },
          ],
          name: "getCurrentPrice",
          outputs: [
            {
              internalType: "uint256",
              name: "_price",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_timestamp",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_ftsoIndex",
              type: "uint256",
            },
          ],
          name: "getCurrentPrice",
          outputs: [
            {
              internalType: "uint256",
              name: "_price",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_timestamp",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_assetIndex",
              type: "uint256",
            },
          ],
          name: "getCurrentPriceWithDecimals",
          outputs: [
            {
              internalType: "uint256",
              name: "_price",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_timestamp",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_assetPriceUsdDecimals",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_symbol",
              type: "string",
            },
          ],
          name: "getCurrentPriceWithDecimals",
          outputs: [
            {
              internalType: "uint256",
              name: "_price",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_timestamp",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_decimals",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256[]",
              name: "_indices",
              type: "uint256[]",
            },
          ],
          name: "getCurrentPricesByIndices",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "ftsoIndex",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "price",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "decimals",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              internalType: "struct IFtsoRegistry.PriceInfo[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string[]",
              name: "_symbols",
              type: "string[]",
            },
          ],
          name: "getCurrentPricesBySymbols",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "ftsoIndex",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "price",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "decimals",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              internalType: "struct IFtsoRegistry.PriceInfo[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_ftsoIndex",
              type: "uint256",
            },
          ],
          name: "getFtso",
          outputs: [
            {
              internalType: "contract IIFtso",
              name: "_activeFtsoAddress",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_symbol",
              type: "string",
            },
          ],
          name: "getFtsoBySymbol",
          outputs: [
            {
              internalType: "contract IIFtso",
              name: "_activeFtsoAddress",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_symbol",
              type: "string",
            },
          ],
          name: "getFtsoIndex",
          outputs: [
            {
              internalType: "uint256",
              name: "_assetIndex",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_ftsoIndex",
              type: "uint256",
            },
          ],
          name: "getFtsoSymbol",
          outputs: [
            {
              internalType: "string",
              name: "_symbol",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256[]",
              name: "_indices",
              type: "uint256[]",
            },
          ],
          name: "getFtsos",
          outputs: [
            {
              internalType: "contract IFtsoGenesis[]",
              name: "_ftsos",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getSupportedFtsos",
          outputs: [
            {
              internalType: "contract IIFtso[]",
              name: "_ftsos",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getSupportedIndices",
          outputs: [
            {
              internalType: "uint256[]",
              name: "_supportedIndices",
              type: "uint256[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getSupportedIndicesAndFtsos",
          outputs: [
            {
              internalType: "uint256[]",
              name: "_supportedIndices",
              type: "uint256[]",
            },
            {
              internalType: "contract IIFtso[]",
              name: "_ftsos",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getSupportedIndicesAndSymbols",
          outputs: [
            {
              internalType: "uint256[]",
              name: "_supportedIndices",
              type: "uint256[]",
            },
            {
              internalType: "string[]",
              name: "_supportedSymbols",
              type: "string[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getSupportedIndicesSymbolsAndFtsos",
          outputs: [
            {
              internalType: "uint256[]",
              name: "_supportedIndices",
              type: "uint256[]",
            },
            {
              internalType: "string[]",
              name: "_supportedSymbols",
              type: "string[]",
            },
            {
              internalType: "contract IIFtso[]",
              name: "_ftsos",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getSupportedSymbols",
          outputs: [
            {
              internalType: "string[]",
              name: "",
              type: "string[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getSupportedSymbolsAndFtsos",
          outputs: [
            {
              internalType: "string[]",
              name: "_supportedSymbols",
              type: "string[]",
            },
            {
              internalType: "contract IIFtso[]",
              name: "_ftsos",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "symbol",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
          ],
          name: "setPrice",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string[]",
              name: "_symbols",
              type: "string[]",
            },
          ],
          name: "setSupportedSymbols",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "symbols",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      inheritedFunctions: {
        getAllCurrentPrices:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getCurrentPrice:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getCurrentPriceWithDecimals:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getCurrentPricesByIndices:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getCurrentPricesBySymbols:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getFtso:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getFtsoBySymbol:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getFtsoIndex:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getFtsoSymbol:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getFtsos:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getSupportedFtsos:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getSupportedIndices:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getSupportedIndicesAndFtsos:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getSupportedIndicesAndSymbols:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getSupportedIndicesSymbolsAndFtsos:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getSupportedSymbols:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
        getSupportedSymbolsAndFtsos:
          "@flarenetwork/flare-periphery-contracts/flare/ftso/userInterfaces/IFtsoRegistry.sol",
      },
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
