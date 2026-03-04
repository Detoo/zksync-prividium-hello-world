// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";

contract CounterScript is Script {
    Counter public counter;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_MAIN");
        address deployer = vm.addr(deployerPrivateKey);

        console2.log("==== Configs ====");
        console2.log("block.chainid: %d", block.chainid);
        console2.log("deployer: %s", deployer);
        console2.log("deployer.balance: %d", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        counter = new Counter();

        console2.log("==== Deployed ====");
        console2.log("counter: %s", address(counter));

        vm.stopBroadcast();
    }
}
