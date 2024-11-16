class InvestorDataService {
    
    getCurrentStrategies(walletId) {
      // use smart contract to get all subscriptions for the user
      // this has attestation ID 
      // query sign protocol with this
      // Use lit to decrypt
      return currentStrategies.filter(strategy => strategy.walletId === walletId);
    }

    cashOutStrategy(walletId, subscriptionId) {
      
    }

    fetchFundManagers() {
      return fundManagerData;
    }

    investFunds(investmentData) {

    }
  }

  const fundManagerData = [
    {
      id: 1,
      walletId: '0x0868574DC2E9cc0581598006CC84387D556EBF46',
      subscriberCount: 120,
      investedValue: 100000,
      currentValue: 120000,
      performance30d: 3.5,
    },
    {
      id: 2,
      walletId: '0x1234567ABCDEF1234567890ABCDEF1234567890',
      subscriberCount: 85,
      investedValue: 80000,
      currentValue: 95000,
      performance30d: 4.2,
    },
    {
      id: 3,
      walletId: '0x9876543210ABCDEF9876543210ABCDEF98765432',
      subscriberCount: 150,
      investedValue: 120000,
      currentValue: 150000,
      performance30d: 6.2,
    },
  ];
  
  const currentStrategies = [
    {
      id: 1,
      subscriptionId: 'SUB123',
      walletId: '0x0868574DC2E9cc0581598006CC84387D556EBF46',
      investedAmount: 10000,
      currentAmount: 12000,
      startDate: '2024-01-01',
      allocations: [
        { crypto: 'BTC', percentage: 40 },
        { crypto: 'ETH', percentage: 35 },
        { crypto: 'XRP', percentage: 25 },
      ],
    },
    {
      id: 2,
      subscriptionId: 'SUB456',
      walletId: '0x0868574DC2E9cc0581598006CC84387D556EBF46',
      investedAmount: 8000,
      currentAmount: 9500,
      startDate: '2024-02-15',
      allocations: [
        { crypto: 'BTC', percentage: 50 },
        { crypto: 'ETH', percentage: 30 },
        { crypto: 'ADA', percentage: 20 },
      ],
    },
  ];
  
  export default new InvestorDataService();
  