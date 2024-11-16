// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";


contract FundNForget is ReentrancyGuard {
    IPyth pyth;

    mapping(address => bytes32) pythNetworkMapping;

    constructor() {
    // Hard coding base sepolia pyth contract
    pyth = IPyth(0xA2aa501b19aff244D90cc15a4Cf739D2725B5729);

    // base-eth
    pythNetworkMapping[0x5dEaC602762362FE5f135FA5904351916053cF70] = 0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a;
    //base-usdc
    pythNetworkMapping[0x4200000000000000000000000000000000000006] = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace;
    //base-synthetic-uni
    pythNetworkMapping[0x6021D8Cc4388f917fc75766dA67eC54A1b4e4Cc6] = 0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501;


  }
    uint256 private _subscriptionIdCounter = 0;

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

        uint256 initialInvestmentValue = 0;

        for (uint256 i = 0; i < initialInvestments.length; i++) {
            IERC20 token = IERC20(initialInvestments[i].tokenAddress);
            token.transferFrom(msg.sender, address(this), initialInvestments[i].value);
        }

        for (uint256 i = 0; i < initialInvestments.length; i++) {
            IERC20 token = IERC20(initialInvestments[i].tokenAddress);

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

    function calculateTokenUSDPrice(address tokenContract) public payable returns(uint256){
        
        // Read the current price from a price feed if it is less than 60 seconds old.
        // Each price feed (e.g., ETH/USD) is identified by a price feed ID.
        // The complete list of feed IDs is available at https://pyth.network/developers/price-feed-ids

        bytes32 priceFeedId = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace; // ETH/USD
        // PythStructs.Price memory price = pyth.getPriceNoOlderThan(priceFeedId, 600);
        PythStructs.Price memory price = pyth.getPriceUnsafe(priceFeedId);

        // represent in usd * 10e18
        uint256 calculatedPrice = (uint(uint64(price.price)) * (10 ** 18)) / (10 ** uint8(uint32(-1 * price.expo)));
        return calculatedPrice;
  }
    
}
