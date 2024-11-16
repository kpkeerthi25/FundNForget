import SignProtocolAdaptor from "./SignProtocolAdaptor";
import { ethers, BigNumber } from 'ethers';
import FundNForgetAbi from "../abi/FundNForgetAbi";
import FxConversionService from "./FxConversionService";

class FundManagerService {

    contractAddress = '0xF425D06d5F95A4caa3452Cb608b461C85c44e646';

    async fetchStrategies(walletAddress) {
        console.log(walletAddress)
        const attestationStrings = await SignProtocolAdaptor.getAttestations(walletAddress)
        const allocationsList = attestationStrings
            .map((it) => {
                try {
                    return JSON.parse(it)
                } catch(e) {
                    return {}
                }
            })
        console.log("Allcoation", allocationsList)
        const valAll = allocationsList.filter((it) => this.isValidObject(it))
        console.log(valAll)
        return valAll
            .map((allocation) => {
                try {
                    return allocation.map((it) => ({
                        crypto: this.getTokenSymbol(it.crypto),
                        percentage: it.percentage
                    }))
                } catch(e) {

                }
            })
    }

    // await FundManagerService.fetchStrategies("0x7293aA04dC3DD4964BEfAF3e8935618D2BFfCf3E")

    isValidObject = (variable) => {
        return (
          Array.isArray(variable) && // Checks if the variable is an array
          variable !== null // Ensures it's not null (although arrays can't be null)
        );
      };
      

    async getAllSubscriptionsForFundManager(walletAddress, provider) {
        const contract = new ethers.Contract(this.contractAddress, FundNForgetAbi, provider);
        const x = await contract.getAllSubscriptionsForFundManager(walletAddress)
        return x.filter((it) => it.isActive)
    }
      

    async fetchFundStatistics(provider, walletAddress) {
        const contract = new ethers.Contract(this.contractAddress, FundNForgetAbi, provider);
        console.log("BEFORE")
        const subscriptions = (await contract.getAllSubscriptionsForFundManager(walletAddress)).filter((it) => it.isActive)
        console.log("SUBZ", subscriptions)
        return {
            subscriberCount: this.getSubscriptionCount(subscriptions),
            investedValue: this.getInvestedValue(subscriptions),
        }
    }

    async fetchFundPerformance(walletId) {
        return fundPerformance; // LATER
    }

    async createStrategy(allocations) {
        const formattedAllocations = allocations.map(item => ({
            ...item,
            crypto: this.getContractAddress(item.crypto),
        }));
        const message = JSON.stringify(formattedAllocations)
        console.log("Storing", message)
        await SignProtocolAdaptor.createAttestation(message)
    }

    //await FundManagerService.createStrategy([
    //     {crypto: "ETH", percentage: 25},
    //     {crypto: "USDC", percentage: 75},
    // ])

    getSubscriptionCount(subscriptions) {
        if (subscriptions.length === 0) {
            return 0; // Return 0 if the array is empty
        }
        return [...new Set(subscriptions.map((it) => it.user))].length
    }

    getInvestedValue(subscriptions) {
        if (subscriptions.length === 0) {
            return 0; // Return 0 if the array is empty
        }
        console.log("Subs", subscriptions)
        const invVlas = subscriptions.map((it) => BigNumber.from(it[1]).toNumber())
        console.log("INV", invVlas)
        return subscriptions.map((it) => BigNumber.from(it[1]).toNumber())
            .reduce((acc, curr) => acc + curr, 0); // Initialize reduce with 0
    }
    

    getCurrentValue(subscriptions) {
        if (subscriptions.length === 0) {
            return 0; // Return 0 if the array is empty
        }
        return [...new Set(subscriptions.map((it) => FxConversionService.getUsdtValue(it.investments)))].reduce((acc, curr) => acc + curr)
    }

    getContractAddress(tokenSymbol) {
        const mapX = {
            "ETH": "0x5dEaC602762362FE5f135FA5904351916053cF70",
            "USDC": "0x4200000000000000000000000000000000000006",
            "SynUNI": "0x6021D8Cc4388f917fc75766dA67eC54A1b4e4Cc6" 
        }
        return mapX[tokenSymbol]
    }

    getTokenSymbol(contractAddress) {
        const mapX = {
            "0x5dEaC602762362FE5f135FA5904351916053cF70": "ETH",
            "0x4200000000000000000000000000000000000006": "USDC",
            "0x6021D8Cc4388f917fc75766dA67eC54A1b4e4Cc6": "SynUNI"
        }
        return mapX[contractAddress]
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