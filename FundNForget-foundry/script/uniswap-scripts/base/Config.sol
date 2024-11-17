// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Currency} from "v4-core/src/types/Currency.sol";

/// @notice Shared configuration between scripts
contract Config {
    /// @dev populated with default anvil addresses
    IERC20 constant token1 = IERC20(address(0xc0AF1790125acB557467b7d8c13555eC063b096c));
    IERC20 constant token0 = IERC20(address(0x5dde0A29E8C5E0F2f3657cd65f17f6eA2C91C3EB));
    IHooks constant hookContract = IHooks(address(0xc10E2eC53213abf6F36188EeD3230249a9B90080));

    Currency constant currency0 = Currency.wrap(address(token0));
    Currency constant currency1 = Currency.wrap(address(token1));
}
