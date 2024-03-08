// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@flarenetwork/flare-periphery-contracts/flare/util-contracts/userInterfaces/IFlareContractRegistry.sol";

contract MockContractRegistry is IFlareContractRegistry {
	
    mapping(string => address) private contractAddresses;

    function setContractAddress(
        string calldata _name,
        address _address
    ) external {
        contractAddresses[_name] = _address;
    }
    
    function getContractAddressByName(
		string calldata _name
	) external view override returns (address) {

        return contractAddresses[_name];
    }

	function getContractAddressByHash(
		bytes32 _nameHash
	) external view override returns (address) {}

	function getContractAddressesByName(
		string[] calldata _names
	) external view override returns (address[] memory) {}

	function getContractAddressesByHash(
		bytes32[] calldata _nameHashes
	) external view override returns (address[] memory) {}

	function getAllContracts()
		external
		view
		override
		returns (string[] memory _names, address[] memory _addresses)
	{}
}

