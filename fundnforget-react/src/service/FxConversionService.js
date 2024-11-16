import axios from "axios"

class FxConversionService {
    async getUsdtValue(investments) {
        console.log("FX conversion", investments)
        const invPromises = investments
            .map(async(investment) => {
                const tokenSymbol = this.getTokenSymbol(investment.address)
                const price = await this.fetchPriceAtTime(tokenSymbol, Math.floor(Date.now() / 1000))
                console.log("price", price)
                return parseFloat(price) * parseFloat(investment.value)
            })
        const x = Promise.all(invPromises);
           return x.reduce((acc, curr) => acc + curr)
    }

    async fetchPriceAtTime(tokenName, timestamp) {
        const feedId = this.getFeedId(tokenName);
        const request = 'https://hermes.pyth.network/v2/updates/price/' + timestamp + "?ids[]=" + feedId;
        return axios.get(request);
    }

    getTokenSymbol(contractAddress) {
        const mapX = {
            "0x5dEaC602762362FE5f135FA5904351916053cF70": "ETH",
            "0x4200000000000000000000000000000000000006": "USDC",
            "0x6021D8Cc4388f917fc75766dA67eC54A1b4e4Cc6": "SynUNI"
        }
        return mapX[contractAddress]
    }

    getFeedId(tokenSymbol) {
        console.log("Feed", tokenSymbol)
        const mapX = {
            "ETH": "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
            "USDC": "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
            "SynUNI": "0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501"
        }

        return mapX[tokenSymbol]
    }
}

export default new FxConversionService()