// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { CollateralVault } from "./Collateral.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Broker is IERC721 {
	mapping(address => uint256) public balances;
	mapping(uint256 => address) public owners;
	mapping(uint256 => address) public vaults;
	mapping(address => uint256[]) public vaultsByOwner;


	address public flareContractRegistry;
	string public symbolCollateral;
	uint256 public collateralRatio;
	uint256 public lockingPeriod;
	address public owner;
	uint256 public fee;

	uint256 vaultId = 0;

	constructor(
		address _flareContractRegistry,
		string memory _symbolCollateral,
		uint256 _collateralRatio,
		uint256 _lockingPeriod,
		uint256 _fee
	) {
		flareContractRegistry = _flareContractRegistry;
		symbolCollateral = _symbolCollateral;
		collateralRatio = _collateralRatio;
		lockingPeriod = _lockingPeriod;
		fee = _fee;
		owner = msg.sender;
	}

	function openVault(
		string memory _symbolSynthetic,
		uint256 _amountCollateral
	) public payable {
		// required value is the amount of collateral plus the percentage fee on the collateral
		require(msg.value >= _amountCollateral, "Insufficient collateral");
		require(
			msg.value == _amountCollateral + ((_amountCollateral * fee) / 100),
			"Insufficient fee"
		);

		CollateralVault vault = new CollateralVault{
			value: _amountCollateral
		}(
			flareContractRegistry,
			_symbolSynthetic,
			symbolCollateral,
			collateralRatio,
			_amountCollateral,
			lockingPeriod
		);
		uint256 tokenId = uint256(vaultId++);
		balances[msg.sender] += 1;
		owners[tokenId] = msg.sender;
		vaults[tokenId] = address(vault);
		vaultsByOwner[msg.sender].push(tokenId);
	}

	function supportsInterface(
		bytes4 interfaceId
	) external view override returns (bool) {
		return interfaceId == 0x80ac58cd || interfaceId == 0x5b5e139f;
	}

	function balanceOf(
		address owner
	) external view override returns (uint256 balance) {
		return balances[owner];
	}

	function ownerOf(
		uint256 tokenId
	) external view override returns (address owner) {
		return owners[tokenId];
	}

	function safeTransferFrom(
		address from,
		address to,
		uint256 tokenId,
		bytes calldata data
	) external override {
		_transferFrom(from, to, tokenId);
	}

	function safeTransferFrom(
		address from,
		address to,
		uint256 tokenId
	) external override {
		_transferFrom(from, to, tokenId);
	}

	function transferFrom(
		address from,
		address to,
		uint256 tokenId
	) external override {
		_transferFrom(from, to, tokenId);
	}

	function approve(address to, uint256 tokenId) external override {
		// not implemented
		require(false, "Not implemented");
	}

	function setApprovalForAll(
		address operator,
		bool _approved
	) external override {
		// not implemented
		require(false, "Not implemented");
	}

	function getApproved(
		uint256 tokenId
	) external view override returns (address operator) {
		return address(0);
	}

	function isApprovedForAll(
		address owner,
		address operator
	) external view override returns (bool) {
		return false;
	}

	function _transferFrom(address from, address to, uint256 tokenId) private {
		// require(
		// 	msg.sender == from || msg.sender == vaults[tokenId],
		// 	"Not authorized"
		// );
		require(to != address(0), "Invalid address");
		require(owners[tokenId] == from, "Not the owner");
		require(balances[from] > 0, "Not enough balance");

		balances[from] -= 1;
		balances[to] += 1;
		owners[tokenId] = to;

		if (vaults[tokenId] != address(0)) {
			CollateralVault(vaults[tokenId]).setOwner(to);
			// remove from vaultsByOwner
			uint256[] storage vaultsOfOwner = vaultsByOwner[from];
			for (uint256 i = 0; i < vaultsOfOwner.length; i++) {
				if (vaultsOfOwner[i] == tokenId) {
					vaultsOfOwner[i] = vaultsOfOwner[vaultsOfOwner.length - 1];
					vaultsOfOwner.pop();
					break;
				}
			}
			vaultsByOwner[from] = vaultsOfOwner;
			vaultsByOwner[to].push(tokenId);
		}
	}
}
