// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {FundNForget} from "../src/FundNForget.sol";
import {FundNForgetSignProtocolHook} from "../src/FundNForgetSignProtocolHook.sol";

contract InitialTestScript is Script {
    FundNForget public fundNForget;
    FundNForgetSignProtocolHook public fundNForgetSignProtocolHook;

    function setUp() public {}

    function run() public {
        vm.broadcast();
        fundNForget = new FundNForget();
        console.log("address of FundNForget :: ", address(fundNForget));

        vm.broadcast();
        fundNForgetSignProtocolHook = new FundNForgetSignProtocolHook(address(fundNForget));
        console.log("address of FundNForgetSignProtocolHook :: ", address(fundNForgetSignProtocolHook));

    }
}
