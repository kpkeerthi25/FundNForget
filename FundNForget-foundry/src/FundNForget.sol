// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract FundNForget is ReentrancyGuard {
    uint256 private _subscriptionIdCounter = 0;
    string test = "hi world";

    struct Investment {
        address tokenAddress;
        uint256 value;
    }

    struct SwapObject {
        address tokenA;
        address tokenB;
        uint256 value;
    }

    struct StrategySubscription {
        uint256 subscriptionId;
        uint64 strategyAttestationId;
        address user;
        address fundManager;
        Investment[] investments;
        uint256 initialInvestmentValue;
        uint256 initialInvestmentTimestamp;
        uint256 lastUpdated;
        bool isActive;
    }

    // SubscriptionId to StrategySubscription mapping
    mapping(uint256 => StrategySubscription)
        private subscriptionIdToStrategySubscriptionMapping;

    // FundManager to signProtocol attestation mapping.
    mapping(address => uint64) private fundManagerToLatestAttestationMapping;

    // user to investment strategy subscription mapping.
    mapping(address => uint256[]) private userToStrategySubscriptionIdMapping;

    // -----------------------------------------------
    // NOTE: functions for fundManagers
    // -----------------------------------------------

    function upsertFundManagerStrategyAttestationMapping(
        address fundMangerAddress,
        uint64 latestStrategyAttestationId
    ) external {
        fundManagerToLatestAttestationMapping[fundMangerAddress] = latestStrategyAttestationId;
    }

    function getLatestStrategyAttestation(
        address fundMangerAddress
    ) external view returns (uint64) {
        return fundManagerToLatestAttestationMapping[fundMangerAddress];
    }

    function getAllSubscriptionsForFundManager( 
        address fundMangerAddress
    ) external view returns(StrategySubscription[] memory) {
        StrategySubscription[] memory tempSubscriptions = new StrategySubscription[](_subscriptionIdCounter);
        uint256 count = 0;
        
        for (uint256 i = 0; i < _subscriptionIdCounter; i++) {
            if (subscriptionIdToStrategySubscriptionMapping[i].fundManager == fundMangerAddress) {
                tempSubscriptions[i] = subscriptionIdToStrategySubscriptionMapping[i];
                count++;
            }
        }
        StrategySubscription[] memory filteredSubscriptions = new StrategySubscription[](count);
        
        for (uint256 i = 0; i < count; i++) {
            filteredSubscriptions[i] = tempSubscriptions[i];
        }

        return filteredSubscriptions;
    }

    // -----------------------------------------------
    // NOTE: functions for Users
    // -----------------------------------------------

    //TODO
    // This function will be called from UI as a user-action to deposit and create a
    // subscription for an investmentStrategy.
    function createSubscriptionForUser(
        address fundManagerAddress,
        uint64 strategyAttestationId, //optional
        Investment[] memory initialInvestments
    ) external payable nonReentrant {
        require(
            fundManagerToLatestAttestationMapping[fundManagerAddress] == strategyAttestationId,
            "provided strategyId is not the valid for the fundManager"
        );

        for (uint256 i = 0; i < initialInvestments.length; i++) {
            IERC20 token = IERC20(initialInvestments[i].tokenAddress);
            token.transferFrom(msg.sender, address(this), initialInvestments[i].value);
        }

        StrategySubscription memory subscription = StrategySubscription(
            _subscriptionIdCounter,
            strategyAttestationId,
            msg.sender,
            fundManagerAddress,
            initialInvestments,
            0,                      //TODO
            block.timestamp,
            block.timestamp,
            true
        );

        subscriptionIdToStrategySubscriptionMapping[_subscriptionIdCounter] = subscription;
        userToStrategySubscriptionIdMapping[msg.sender].push(_subscriptionIdCounter);
        _subscriptionIdCounter += 1;

        // off-chain call to nodeJs for resolving the swaps.
    
    }

    //TODO
    // Function called from backend application for swap action
    function performSwapOnBefalf(uint256 subscriptionId, SwapObject[] calldata SwapObjects) external nonReentrant {}

    function getAllUserSubscriptions() external view returns (StrategySubscription[] memory) {
        StrategySubscription[] memory subscriptions =
            new StrategySubscription[](userToStrategySubscriptionIdMapping[msg.sender].length);

        for (uint256 i = 0; i < userToStrategySubscriptionIdMapping[msg.sender].length; i++) {
            subscriptions[i] =
                subscriptionIdToStrategySubscriptionMapping[userToStrategySubscriptionIdMapping[msg.sender][i]];
        }
        return subscriptions;
    }

    function getSubscription(uint256 subscriptionId) external view returns (StrategySubscription memory) {
        require(subscriptionId <= _subscriptionIdCounter, "Invalid subscriptionId");
        return subscriptionIdToStrategySubscriptionMapping[subscriptionId];
    }
    
}
