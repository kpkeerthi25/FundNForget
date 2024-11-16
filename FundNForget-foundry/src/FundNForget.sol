// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import {IEntropyConsumer} from "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";
import {IEntropy} from "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";

contract FundNForget is ReentrancyGuard, IEntropyConsumer {

    // -----------------------------------------------
    // NOTE: Pyth Network utils
    // -----------------------------------------------

    IPyth pyth;
    IEntropy public entropy;
    address provider;

    mapping(address => bytes32) pythNetworkMapping;

    event Log(address);
    event LogNumber(uint256);

    constructor() {
        // Hard coding base sepolia pyth contract
        pyth = IPyth(0xA2aa501b19aff244D90cc15a4Cf739D2725B5729);
        entropy = IEntropy(0x41c9e39574F40Ad34c79f1C99B66A45eFB830d4c);
        provider = entropy.getDefaultProvider();
        
        // base-eth
        pythNetworkMapping[0x5dEaC602762362FE5f135FA5904351916053cF70] = 0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a;
        //base-usdc
        pythNetworkMapping[0x4200000000000000000000000000000000000006] = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace;
        //base-synthetic-uni
        //mocking uni erc-20 in base sepolia
        pythNetworkMapping[0x6021D8Cc4388f917fc75766dA67eC54A1b4e4Cc6] = 0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501;
    }

    // This method is required by the IEntropyConsumer interface
    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }

    function requestRandomNumber(bytes32 userRandomNumber) external payable returns(uint64) {
        // get the required fee
        uint128 requestFee = entropy.getFee(provider);
        // check if the user has sent enough fees
        if (msg.value < requestFee) revert("not enough fees");

        // pay the fees and request a random number from entropy
        uint64 sequenceNumber = entropy.requestWithCallback{value: requestFee}(
            provider,
            userRandomNumber
        );

        return sequenceNumber;
    }

    function entropyCallback(
        uint64 sequenceNumber,
        // If your app uses multiple providers, you can use this argument
        // to distinguish which one is calling the app back. This app only
        // uses one provider so this argument is not used.
        address _providerAddress,
        bytes32 randomNumber
    ) internal override {
        pythSequenceNumberToRandomNumberMapping[sequenceNumber] = uint256(mapRandomNumber(randomNumber, 0, int256(fundManagers.length-1)));
    }

    function mapRandomNumber(
        bytes32 randomNumber,
        int256 minRange,
        int256 maxRange
    ) internal returns (int256) {
        uint256 range = uint256(maxRange - minRange + 1);
        return minRange + int256(uint256(randomNumber) % range);
    }

    // -----------------------------------------------
    // NOTE: bussiness logic starts here
    // -----------------------------------------------

    // To enable subscribing to random fund-Manager
    address NULL_ADDRESS = 0x0000000000000000000000000000000000000000;

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

    uint256 private _subscriptionIdCounter = 0;

    mapping(uint64 => uint256) private pythSequenceNumberToRandomNumberMapping;

    // SubscriptionId to StrategySubscription mapping
    mapping(uint256 => StrategySubscription)
        private subscriptionIdToStrategySubscriptionMapping;

    // FundManager to signProtocol attestation mapping.
    mapping(address => uint64) private fundManagerToLatestAttestationMapping;

    // user to investment strategy subscription mapping.
    mapping(address => uint256[]) private userToStrategySubscriptionIdMapping;

    // for fundManager list in investor page.
    address[] private fundManagers;

    // -----------------------------------------------
    // NOTE: functions for fundManagers
    // -----------------------------------------------

    function upsertFundManagerStrategyAttestationMapping(
        address fundMangerAddress,
        uint64 latestStrategyAttestationId
    ) external {
        if (fundManagerToLatestAttestationMapping[fundMangerAddress] < 1) {
            emit Log(fundMangerAddress);
            fundManagers.push(fundMangerAddress);
        }
        fundManagerToLatestAttestationMapping[fundMangerAddress] = latestStrategyAttestationId;
    }

    function getLatestStrategyAttestation(
        address fundMangerAddress
    ) external view returns (uint64) {
        return fundManagerToLatestAttestationMapping[fundMangerAddress];
    }

    function getAllSubscriptionsForFundManager(
        address fundMangerAddress
    ) external view returns (StrategySubscription[] memory) {
        StrategySubscription[]
            memory tempSubscriptions = new StrategySubscription[](
                _subscriptionIdCounter
            );
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

    function getAllFundManagerAddresses()
        external
        view
        returns (address[] memory)
    {
        return fundManagers;
    }

    // -----------------------------------------------
    // NOTE: functions for Users
    // -----------------------------------------------

    //TODO
    // This function will be called from UI as a user-action to deposit and create a
    // subscription for an investmentStrategy.

    //If choosing random fundManager - UI will call requestRandomNumber and pass sequenceNumber
    function createSubscriptionForUser(
        address fundManagerAddress,
        uint64 strategyAttestationId, //optional
        Investment[] memory initialInvestments,
        uint64 sequenceNumber //only for randomising fundManager
    ) external payable nonReentrant {
        require(
            fundManagerToLatestAttestationMapping[fundManagerAddress] ==
                strategyAttestationId || fundManagerAddress == NULL_ADDRESS,
            "provided strategyId is not the valid for the fundManager"
        );

        if(fundManagerAddress == NULL_ADDRESS) {
            uint256 randomFundManagerIndex = pythSequenceNumberToRandomNumberMapping[sequenceNumber];
            fundManagerAddress = fundManagers[randomFundManagerIndex];
        }

        uint256 initialInvestmentValue = 0;

        for (uint256 i = 0; i < initialInvestments.length; i++) {
            IERC20 token = IERC20(initialInvestments[i].tokenAddress);
            token.transferFrom(
                msg.sender,
                address(this),
                initialInvestments[i].value
            );
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
            0, //TODO
            block.timestamp,
            block.timestamp,
            true
        );

        subscriptionIdToStrategySubscriptionMapping[_subscriptionIdCounter] = subscription;
        userToStrategySubscriptionIdMapping[msg.sender].push(_subscriptionIdCounter);
        _subscriptionIdCounter += 1;
        
    }

    // redeeming the funds
    function cashOutSubsription(uint256 subscriptionId) external payable {
        StrategySubscription memory subscription = subscriptionIdToStrategySubscriptionMapping[subscriptionId];
        require(msg.sender == subscription.user, "only investor can cash out his funds");
        for (uint256 i = 0; i < subscription.investments.length; i++) {
            IERC20 token = IERC20(subscription.investments[i].tokenAddress);
            token.transfer(msg.sender, subscription.investments[i].value);
        }
        subscriptionIdToStrategySubscriptionMapping[subscriptionId].isActive = false;
    }

    //TODO
    // Function called from backend application for swap action
    function performSwapOnBefalf(
        uint256 subscriptionId,
        SwapObject[] calldata SwapObjects
    ) external nonReentrant {}

    function getAllUserSubscriptions()
        external
        view
        returns (StrategySubscription[] memory)
    {
        StrategySubscription[]
            memory subscriptions = new StrategySubscription[](
                userToStrategySubscriptionIdMapping[msg.sender].length
            );

        for ( uint256 i = 0; i < userToStrategySubscriptionIdMapping[msg.sender].length;i++) {
            subscriptions[i] = subscriptionIdToStrategySubscriptionMapping[userToStrategySubscriptionIdMapping[msg.sender][i]];
        }
        return subscriptions;
    }

    function getSubscription(
        uint256 subscriptionId
    ) external view returns (StrategySubscription memory) {
        require(
            subscriptionId <= _subscriptionIdCounter,
            "Invalid subscriptionId"
        );
        return subscriptionIdToStrategySubscriptionMapping[subscriptionId];
    }

    function calculateTokenUSDPrice(
        address tokenContract
    ) public payable returns (uint256) {
        // Read the current price from a price feed if it is less than 60 seconds old.
        // Each price feed (e.g., ETH/USD) is identified by a price feed ID.
        // The complete list of feed IDs is available at https://pyth.network/developers/price-feed-ids

        bytes32 priceFeedId = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace; // ETH/USD
        // PythStructs.Price memory price = pyth.getPriceNoOlderThan(priceFeedId, 600);
        PythStructs.Price memory price = pyth.getPriceUnsafe(priceFeedId);

        // represent in usd * 10e18
        uint256 calculatedPrice = (uint(uint64(price.price)) * (10 ** 18)) /
            (10 ** uint8(uint32(-1 * price.expo)));
        return calculatedPrice;
    }
}
