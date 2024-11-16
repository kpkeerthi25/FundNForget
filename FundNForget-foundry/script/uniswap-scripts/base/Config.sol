// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Currency} from "v4-core/src/types/Currency.sol";

/// @notice Shared configuration between scripts
contract Config {
    /// @dev populated with default anvil addresses
    IERC20 constant token0 = IERC20(address(0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238));
    IERC20 constant token1 = IERC20(address(0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14));
    IHooks constant hookContract = IHooks(address(0x7d917B5B323cef1f1bEa9e077FaFE526e2e5cAc0));

    Currency constant currency0 = Currency.wrap(address(token0));
    Currency constant currency1 = Currency.wrap(address(token1));
}
