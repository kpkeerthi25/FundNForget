// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Currency} from "v4-core/src/types/Currency.sol";

/// @notice Shared configuration between scripts
contract Config {
    /// @dev populated with default anvil addresses
    IERC20 constant token0 = IERC20(address(0x5dEaC602762362FE5f135FA5904351916053cF70));
    IERC20 constant token1 = IERC20(address(0x6021D8Cc4388f917fc75766dA67eC54A1b4e4Cc6));
    IHooks constant hookContract = IHooks(address(0xfa870735bC9CED6C657f88804013c91c1c424080));

    Currency constant currency0 = Currency.wrap(address(token0));
    Currency constant currency1 = Currency.wrap(address(token1));
}
