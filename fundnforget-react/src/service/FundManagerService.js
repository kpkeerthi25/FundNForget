class FundManagerService {

    async fetchStrategies() {
        return strategyList; // Query get attestation with fund manager wallet address
    }

    async fetchFundStatistics(walletId) {
        return fundStatistics
    }

    async fetchFundPerformance(walletId) {
        return fundPerformance;
    }

    async createStrategy(walletId, allocations) {
        // Use lit to make it as an encrypted string
        // create attestation using sign
    }
}

export default new FundManagerService()

const fundPerformance = [
    { date: '2023-01-01', value: 0 },
    { date: '2023-01-15', value: 10 },
    { date: '2023-02-01', value: -5 },
    { date: '2023-02-15', value: 20 },
    { date: '2023-03-01', value: -10 },
    { date: '2023-03-15', value: 15 },
    { date: '2023-04-01', value: 5 },
    { date: '2023-01-15', value: 10 },
    { date: '2023-02-01', value: -5 },
    { date: '2023-02-15', value: 20 },
    { date: '2023-03-01', value: -10 },
    { date: '2023-03-15', value: 15 },
    { date: '2023-04-01', value: 5 },
    { date: '2023-01-15', value: 10 },
    { date: '2023-02-01', value: -5 },
    { date: '2023-02-15', value: 20 },
    { date: '2023-03-01', value: -10 },
    { date: '2023-03-15', value: 15 },
    { date: '2023-04-01', value: 5 },
    { date: '2023-01-15', value: 10 },
    { date: '2023-02-01', value: -5 },
    { date: '2023-02-15', value: 20 },
    { date: '2023-03-01', value: -10 },
    { date: '2023-03-15', value: 15 },
    { date: '2023-04-01', value: 5 },
]

const fundStatistics = {
    subscriberCount: 1280,
    investedValue: 1200000.00,
    currentValue: 5600000.00
}

const strategyList = [
    {
        startDate: "2024-01-01",
        allocations: [
            { crypto: 'BTC', percentage: 30 },
            { crypto: 'ETH', percentage: 25 },
            { crypto: 'XRP', percentage: 20 },
            { crypto: 'ADA', percentage: 15 },
            { crypto: 'LTC', percentage: 10 },
        ],
    },
    {
        startDate: '2023-01-01',
        endDate: '2023-03-01',
        allocations: [
            { crypto: 'BTC', percentage: 40 },
            { crypto: 'ETH', percentage: 35 },
            { crypto: 'XRP', percentage: 25 },
        ],
    },
    {
        startDate: '2023-04-01',
        endDate: '2023-06-01',
        allocations: [
            { crypto: 'BTC', percentage: 50 },
            { crypto: 'ETH', percentage: 30 },
            { crypto: 'ADA', percentage: 20 },
        ],
    }
]