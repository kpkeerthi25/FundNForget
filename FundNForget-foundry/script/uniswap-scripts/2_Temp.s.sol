// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";

import {Constants} from "./base/Constants.sol";
import {UniswapHook} from "../../src/UniswapHook.sol";
import {HookMiner} from "../../src/HookMiner.sol";

/// @notice Mines the address and deploys the PointsHook.sol Hook contract
contract Temp is Script, Constants {
    function setUp() public {}

    function run() public {
        // hook contracts must have specific flags encoded in the address
        uint160 flags = uint160(
            Hooks.BEFORE_SWAP_FLAG
        );

        // Mine a salt that will produce a hook address with the correct flags
        bytes memory constructorArgs = abi.encode(POOLMANAGER);
        (address hookAddress, bytes32 salt) =
            HookMiner.find(CREATE2_DEPLOYER, flags, type(UniswapHook).creationCode, constructorArgs);

        // Deploy the hook using CREATE2
        vm.broadcast();
        UniswapHook uniswapHook = new UniswapHook{salt: salt}(IPoolManager(POOLMANAGER));
        require(address(uniswapHook) == hookAddress, "UniswapHook: hook address mismatch");

        console.log("address of uniswapHook :: ", address(uniswapHook));
    }
}