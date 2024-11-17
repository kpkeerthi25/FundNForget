// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {UniswapHook} from "../../src/UniswapHook.sol";
import {Constants} from "./base/Constants.sol";
import {Config} from "./base/Config.sol";

contract DeployHookScript is Script, Config, Constants {
    UniswapHook public uniswapHook;
    function setUp() public {}

    function run() public {
        vm.broadcast();
        uniswapHook = new UniswapHook(POOLMANAGER);
        console.log("address of uniswapHook :: ", address(uniswapHook));
    }
}
