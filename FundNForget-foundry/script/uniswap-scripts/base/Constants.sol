// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PositionManager} from "v4-periphery/src/PositionManager.sol";
import {IAllowanceTransfer} from "permit2/src/interfaces/IAllowanceTransfer.sol";

/// @notice Shared constants used in scripts
contract Constants {
    address constant CREATE2_DEPLOYER = address(0x4e59b44847b379578588920cA78FbF26c0B4956C);

    /// @dev populated with default base sepolia addresses
    IPoolManager constant POOLMANAGER = IPoolManager(address(0x7Da1D65F8B249183667cdE74C5CBD46dD38AA829));
    PositionManager constant posm = PositionManager(payable(address(0xcDbe7b1ed817eF0005ECe6a3e576fbAE2EA5EAFE)));
    IAllowanceTransfer constant PERMIT2 = IAllowanceTransfer(address(0x000000000022D473030F116dDEE9F6B43aC78BA3));

    // IPoolManager constant POOLMANAGER = IPoolManager(address(0x8C4BcBE6b9eF47855f97E675296FA3F6fafa5F1A));
    // PositionManager constant posm = PositionManager(payable(address(0x1B1C77B606d13b09C84d1c7394B96b147bC03147)));
    // IAllowanceTransfer constant PERMIT2 = IAllowanceTransfer(address(0x000000000022D473030F116dDEE9F6B43aC78BA3));
}
