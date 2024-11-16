import FundNForgetAbi from "../abi/FundNForgetAbi";
import { ethers, BigNumber } from 'ethers';
import FundManagerService from "./FundManagerService";
import FxConversionService from "./FxConversionService";

class InvestorDataService {

  contractAddress = '0xF425D06d5F95A4caa3452Cb608b461C85c44e646';

  async getCurrentStrategies(provider) {
    const contract = new ethers.Contract(this.contractAddress, FundNForgetAbi, provider);
    const allSubscriptions = await contract.getAllUserSubscriptions();
    console.log("OG", allSubscriptions)
    const transformedSubscriptions = allSubscriptions.map(subscription => ({
      subscriptionId: BigNumber.from(subscription[0]).toNumber(), // Convert hex to number
      initialInvestmentValue: BigNumber.from(subscription[1]).toNumber(), // Convert hex to number
      fundManager: subscription[2], // Already a string (address)
      investor: subscription[3], // Already a string (address)
      allocations: subscription[4].map(([address, value]) => ({
        address, // Already a string
        value: parseFloat(BigNumber.from(value).toString()), // Convert BigNumber to string
      })),
      status: BigNumber.from(subscription[5]).toNumber(), // Convert hex to number (if needed)
      startDate: BigNumber.from(subscription[6]).toNumber(), // Convert hex timestamp to number
      endDate: BigNumber.from(subscription[7]).toNumber(), // Convert hex timestamp to number
      isActive: subscription[8], // Already a boolean
    }));
    console.log("Transf ", transformedSubscriptions)
    // Filter and map to an array of Promises
    const strategiesPromises = transformedSubscriptions
      .filter((it) => it.isActive)
      .map(async (it) => {
        const allocations = (await FundManagerService.fetchStrategies(it.fundManager))[0];
        const currentValue = 0 // TODO await FxConversionService.getUsdtValue(it.allocations)
        return {
          subscriptionId: it.subscriptionId,
          walletId: it.fundManager,
          investedAmount: it.initialInvestmentValue,
          currentAmount: currentValue,
          startDate: new Date(it.startDate * 1000).toISOString(),
          allocations,
        };
      });
  
    // Wait for all Promises to resolve
    return Promise.all(strategiesPromises);
  }

  // console.log(await InvestorService.getCurrentStrategies(getEthersProvider().getSigner()))

  getTokenSymbol(contractAddress) {
      const mapX = {
          "0x5dEaC602762362FE5f135FA5904351916053cF70": "ETH",
          "0x4200000000000000000000000000000000000006": "USDC",
          "0x6021D8Cc4388f917fc75766dA67eC54A1b4e4Cc6": "SynUNI"
      }
      return mapX[contractAddress]
  }
  

  async getAllStrategies(provider) {
    const fundManagers = await this.fetchFundManagers(provider)
    fundManagers.forEach(async (fundManager) => {
        console.log(await FundManagerService.fetchStrategies(fundManager))
    });
  }

  async cashOutStrategy(provider, subscriptionId) {
    const contract = new ethers.Contract(this.contractAddress, FundNForgetAbi, provider);
    return contract.getAllUserSubscriptions(subscriptionId) // TODO
  }

  async fetchFundManagers(provider) {
    const contract = new ethers.Contract(this.contractAddress, FundNForgetAbi, provider);
    const managerAddresses = await contract.getAllFundManagerAddresses()
    const proms = managerAddresses.map(async(it) => {
      const subscriptions = await FundManagerService.getAllSubscriptionsForFundManager(it, provider)
      const subscriberCount = FundManagerService.getSubscriptionCount(subscriptions)
      const investedValue = FundManagerService.getInvestedValue(subscriptions)
      return {
        walletId: it,
        subscriberCount,
        investedValue
      }
    })
    return Promise.all(proms)
  }

  // await InvestorService.fetchFundManagers(getEthersProvider())

  async investFunds(signer, fundManagerAddress, investmentData) {
    const contract = new ethers.Contract(this.contractAddress, FundNForgetAbi, signer);
    const nonZero = investmentData.filter((it) => it.value != 0)
    console.log("NONZ", nonZero)
    await contract.createSubscriptionForUser(fundManagerAddress, nonZero, 0)
  }

  // await InvestorService.investFunds(
//     getEthersProvider().getSigner(), "0x951e30c7A23f02Fbe2De2A252B946DBBb0b12825", 3289, 
//     [
//         {tokenAddress: "0x6021D8Cc4388f917fc75766dA67eC54A1b4e4Cc6", value: 100000000000000}
//     ]
// )
}

export default new InvestorDataService();
