# FundNForget
FundNForget is a Web3 DeFi app that let's users invest their crypto assets in funds managed by professional fund managers. The users just need to connect their wallet and choose to invest however much they want in the funds they like and everything else is automated. From the point of view of the fund managers, they need to publish their strategy from their dashboard and the app takes care of implementing it for them.

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
