// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";

import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/src/types/BeforeSwapDelta.sol";



contract SwapHook is BaseHook {
    using PoolIdLibrary for PoolKey;

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
            beforeAddLiquidity: true,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: true,
            afterRemoveLiquidity: false,
            beforeSwap: true,
            afterSwap: true,
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

//     function beforeSwap(
//     address,
//     PoolKey calldata,
//     IPoolManager.SwapParams calldata params,
//     bytes calldata
// ) external override returns (int256 amountIn, BeforeSwapDelta delta, uint24) {
//     int128 specifiedAmount = int128(params.amountSpecified);
//     int256 fee = specifiedAmount / 100;  // 1% fee
//     int128 adjustedAmount = specifiedAmount - fee;
    
//     delta = BeforeSwapDelta(-fee);  // Fee taken from specified token
//     amountIn = params.amountSpecified;  // Original amount
    
//     return (amountIn, delta, 0);
// }

    function afterSwap(address, PoolKey calldata key, IPoolManager.SwapParams calldata, BalanceDelta, bytes calldata)
        external
        override
        returns (bytes4, int128)
    {
        afterSwapCount[key.toId()]++;
        return (BaseHook.afterSwap.selector, 0);
    }

}