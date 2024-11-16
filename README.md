# FundNForget
FundNForget is a Web3 DeFi app that let's users invest their crypto assets in funds managed by professional fund managers. The users just need to connect their wallet and choose to invest however much they want in the funds they like and everything else is automated. From the point of view of the fund managers, they need to publish their strategy from their dashboard and the app takes care of implementing it for them.

The application is available for trial: https://main.d6w5dw67swnej.amplifyapp.com/

## Components

It has three major components:
1. On chain smart contracts
2. Off chain Node.JS app
3. React based front-end

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
