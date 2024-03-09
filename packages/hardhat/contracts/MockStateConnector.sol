// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// IStateConnector
import "@flarenetwork/flare-periphery-contracts/flare/stateConnector/interface/IStateConnector.sol";

contract MockStateConnector is IStateConnector {

    function requestAttestations(bytes calldata _data) external override {
        emit AttestationRequest(msg.sender, block.timestamp, _data);
    }

    function lastFinalizedRoundId() external view override returns (uint256 _roundId) {
        return 0;
    }

    function merkleRoot(uint256 _roundId) external view override returns (bytes32) {
        return 0;
    }

    function BUFFER_TIMESTAMP_OFFSET() external view override returns (uint256) {
        return 0;
    }

    function BUFFER_WINDOW() external view override returns (uint256) {
        return 0;
    }
}
