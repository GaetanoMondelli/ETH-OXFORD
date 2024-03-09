// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC20Base.sol";
import "@thirdweb-dev/contracts/extension/Ownable.sol";

interface IETFToken {
	function mint(address account, uint256 amount) external;

	function burn(address account, uint256 amount) external;
}

contract SimpleERC20 is ERC20, Ownable {

    
	constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
		_setupOwner(msg.sender);
	}

	/**
	 * @dev Function to mint new ETF tokens. Only the owner can mint.
	 *
	 * @param account The address that will receive the minted tokens.
	 * @param amount The amount of tokens to mint.
	 */
	function mint(address account, uint256 amount) external {
		_mint(account, amount);
	}

	function burn(address account, uint256 amount) external onlyOwner {
		super._burn(account, amount);
	}

	function _canSetOwner() internal view virtual override returns (bool) {
		return msg.sender == owner();
	}
}
