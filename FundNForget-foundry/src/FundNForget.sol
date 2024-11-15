// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FundNForget {

    uint256 private _subscriptionIdCounter = 0;

    struct Investment {
        address tokenAddress;
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
    }

    // SubscriptionId to StrategySubscription mapping
    mapping(uint256 => StrategySubscription) private subscriptionIdToStrategySubscriptionMapping;

    // FundManager to signProtocol attestation mapping.
    mapping(address => uint64) private fundManagerToLatestAttestationMapping;

    // user to investment strategy subscription mapping.
    mapping(address => uint256[]) private userToStrategySubscriptionIdMapping;

    
    // -----------------------------------------------
    // NOTE: functions for fundManagers
    // -----------------------------------------------

    function upsertFundManagerStrategyAttestationMapping(address fundMangerAddress, uint64 latestStrategyAttestationId)
        external
    {
        fundManagerToLatestAttestationMapping[fundMangerAddress] = latestStrategyAttestationId;
    }

    function getLatestStrategyAttestation(address fundMangerAddress) external view returns (uint64) {
        return fundManagerToLatestAttestationMapping[fundMangerAddress];
    }

}