const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "ReentrancyGuardReentrantCall",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "Log",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "LogNumber",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint64",
				"name": "sequence",
				"type": "uint64"
			},
			{
				"internalType": "address",
				"name": "provider",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "randomNumber",
				"type": "bytes32"
			}
		],
		"name": "_entropyCallback",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenContract",
				"type": "address"
			}
		],
		"name": "calculateTokenUSDPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "subscriptionId",
				"type": "uint256"
			}
		],
		"name": "cashOutSubsription",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "fundManagerAddress",
				"type": "address"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "tokenAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					}
				],
				"internalType": "struct FundNForget.Investment[]",
				"name": "initialInvestments",
				"type": "tuple[]"
			},
			{
				"internalType": "uint64",
				"name": "sequenceNumber",
				"type": "uint64"
			}
		],
		"name": "createSubscriptionForUser",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "entropy",
		"outputs": [
			{
				"internalType": "contract IEntropy",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllFundManagerAddresses",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "fundMangerAddress",
				"type": "address"
			}
		],
		"name": "getAllSubscriptionsForFundManager",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "subscriptionId",
						"type": "uint256"
					},
					{
						"internalType": "uint64",
						"name": "strategyAttestationId",
						"type": "uint64"
					},
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "fundManager",
						"type": "address"
					},
					{
						"components": [
							{
								"internalType": "address",
								"name": "tokenAddress",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "value",
								"type": "uint256"
							}
						],
						"internalType": "struct FundNForget.Investment[]",
						"name": "investments",
						"type": "tuple[]"
					},
					{
						"internalType": "uint256",
						"name": "initialInvestmentValue",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "initialInvestmentTimestamp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastUpdated",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					}
				],
				"internalType": "struct FundNForget.StrategySubscription[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllUserSubscriptions",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "subscriptionId",
						"type": "uint256"
					},
					{
						"internalType": "uint64",
						"name": "strategyAttestationId",
						"type": "uint64"
					},
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "fundManager",
						"type": "address"
					},
					{
						"components": [
							{
								"internalType": "address",
								"name": "tokenAddress",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "value",
								"type": "uint256"
							}
						],
						"internalType": "struct FundNForget.Investment[]",
						"name": "investments",
						"type": "tuple[]"
					},
					{
						"internalType": "uint256",
						"name": "initialInvestmentValue",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "initialInvestmentTimestamp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastUpdated",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					}
				],
				"internalType": "struct FundNForget.StrategySubscription[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "fundMangerAddress",
				"type": "address"
			}
		],
		"name": "getLatestStrategyAttestation",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "subscriptionId",
				"type": "uint256"
			}
		],
		"name": "getSubscription",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "subscriptionId",
						"type": "uint256"
					},
					{
						"internalType": "uint64",
						"name": "strategyAttestationId",
						"type": "uint64"
					},
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "fundManager",
						"type": "address"
					},
					{
						"components": [
							{
								"internalType": "address",
								"name": "tokenAddress",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "value",
								"type": "uint256"
							}
						],
						"internalType": "struct FundNForget.Investment[]",
						"name": "investments",
						"type": "tuple[]"
					},
					{
						"internalType": "uint256",
						"name": "initialInvestmentValue",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "initialInvestmentTimestamp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastUpdated",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					}
				],
				"internalType": "struct FundNForget.StrategySubscription",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "subscriptionId",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "tokenA",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "tokenB",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					}
				],
				"internalType": "struct FundNForget.SwapObject[]",
				"name": "SwapObjects",
				"type": "tuple[]"
			}
		],
		"name": "performSwapOnBefalf",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "userRandomNumber",
				"type": "bytes32"
			}
		],
		"name": "requestRandomNumber",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "fundMangerAddress",
				"type": "address"
			},
			{
				"internalType": "uint64",
				"name": "latestStrategyAttestationId",
				"type": "uint64"
			}
		],
		"name": "upsertFundManagerStrategyAttestationMapping",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

export default abi;