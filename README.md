# FundNForget
FundNForget is a Web3 DeFi app that let's users invest their crypto assets in funds managed by professional fund managers. The users just need to connect their wallet and choose to invest however much they want in the funds they like and everything else is automated. From the point of view of the fund managers, they need to publish their strategy from their dashboard and the app takes care of implementing it for them.

The application is available for trial: https://main.d6w5dw67swnej.amplifyapp.com/

## Components

It has three major components:
1. On chain smart contracts
2. Off chain Node.JS app
3. React based front-end

## On-Chain Smart Contract

The onchain smart contract is where the data related to the investments and the assets are maintained. The smart contract address is `0xF425D06d5F95A4caa3452Cb608b461C85c44e646`. We have used the following sign protocol schema: `onchain_evm_84532_0x4e3`

### Created the following synthetic tokens for testing

SynUni - https://sepolia.basescan.org/token/0x6021D8Cc4388f917fc75766dA67eC54A1b4e4Cc6

SynEth - https://sepolia.basescan.org/address/0xc0AF1790125acB557467b7d8c13555eC063b096c

SynUSDT - 
https://sepolia.basescan.org/token/0x5dde0A29E8C5E0F2f3657cd65f17f6eA2C91C3EB

### Uniswap V4 Liquidity Pools with BeforeSwap hook to enforce fee to the protocol address
https://sepolia.basescan.org/tx/0x1eedda15742db27418537bb8f585c3c69f1f63bce921f6cf7d59a26a04115738

https://sepolia.basescan.org/tx/0xb3db94867256c6c4dcb96d4c8bb5c0ecbc491eac95773f45e8f8295b3bd926d2

https://sepolia.basescan.org/tx/0x894814a068507a7cea5467b80a6dff3d3e30b85ad7fc674c5674745efce85fb4


### Integrations Used

#### Pyth Price Feeds

Pyth price feeds are used to value the initial investments of users in USDT. This helps them track their PnL in a daily manner. This is also used to value the portfolio so that the swaps can be performed.

#### Uniswap

Uniswap is used to swap the currencies to maintain the assets according to the fund's chosen strategy.

### Pyth entropy 

Pyth entropy module is used to generate random numbers so that investors who are confused about what fund to invest in can randomize their investments.

### Sign Protocol Event Listeners

The strategy updates are done directly on the sign protocol schema. And whenever this happens, the assets have to be re-allocated according to the new strategy. Triggering this process in an event-driven manner is done through the usage of sign protocol's hook as event listeners.


## Front-End

The front end is exposed to both the fund managers and investors. As sson as a user lands in our page, they're given the option to select whether they're an investor or a fund manager and the subsequent options are based on this selection. The code for this is under `fundnforget-react`. The following can be deon to start the front end locally.

```
cd fundnforget-react
npm install
npm start
```

### Investor UI

Investors can see their current allocations in various funds, select new funds to invest in, invest any crypto in them and cash out when required.

### Fund Manager UI

Fund managers can see their current allocation and also change it when required. They also see metrics like subcriber count and total value of assets invested in their portfolio.

### Integrations Used

#### Privy

Privy is used in the front end to onboard the users and also to maintain the authentication state all through the app. Signers from the privy context are used to authenticate all the transactions and smart contrat calls.

#### Blockscout

Block scout explorer link to the investors wallet is provided on their screen so that the users can examine their transactions and also track their balances.

#### Sign Protocol

The strategies that the fund managers use is stored in an encrypted manner using sign protocol's schemas. Lit protocol is used to encrypt the data related to these strategies. The users who have invested in a particular fund access these strategies directly using the sign protocol.

## Off-chain Node.JS app

The off chain Node.JS app is used to compute the swaps between the various cryptocurrencies used in the strategies. This cannot be done on chain as we want this data to be hidden from the public eye. The backend app uses sign protocol to access the strategy data and lit protocol to decode the encrypted value and then performs the swap operation.

### Integrations Used

#### Sign Protocol

The strategies that the fund managers use is stored in an encrypted manner using sign protocol. Sign protocol is used to query this information so that the strategies can be implemented by the smart contracts.

#### Lit Protocol

The actual encryption of the data in the sign protocol schemas is handled using the lit protocol so as to perform this process in a trustless distriuted manner. So decoding this data will again require the usage of Lit protocol from the backend.
