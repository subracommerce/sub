// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/AgentWallet.sol";
import "../src/SpendIntent.sol";
import "../src/ZkReceiptRegistry.sol";
import "../src/AgentMarketplace.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance);
        
        // Deploy SpendIntent
        SpendIntent spendIntent = new SpendIntent();
        console.log("SpendIntent deployed at:", address(spendIntent));
        
        // Deploy ZkReceiptRegistry
        ZkReceiptRegistry zkRegistry = new ZkReceiptRegistry();
        console.log("ZkReceiptRegistry deployed at:", address(zkRegistry));
        
        // Deploy AgentMarketplace (requires stake token address)
        // For testnet, you would deploy a mock ERC20 token first
        // AgentMarketplace marketplace = new AgentMarketplace(stakeTokenAddress);
        // console.log("AgentMarketplace deployed at:", address(marketplace));
        
        // Deploy sample AgentWallet
        AgentWallet agentWallet = new AgentWallet(
            deployer,
            1 ether, // spending limit per transaction
            10 ether  // daily limit
        );
        console.log("AgentWallet deployed at:", address(agentWallet));
        
        vm.stopBroadcast();
    }
}

