# 🦄 Uniprices

Get current and historical prices from **uniswap** decentralized exchange. Request prices by block number, by date, or request price trend for the last 6 months.

## Installation
Use npm:
```
npm i uniprices
```

Or Yarn:

```
yarn add uniprices
```

## Usage
```javascript
const Uniprices = require('uniprices');

const uniprices = new Uniprices(
    web3  // Web3 object, required.
);

// Getting token price
let prices = await uniprices.getPriceCurrent(
    '0xE41d2489571d322189246DaFA5ebDe1F4699F498' // Token address, required. If address is not valid uniswap token, will trow an error.
);

/*
Returns an object: {
    sell: {
        eth: 705.1327229984558, // Sell price. Tokens to ETH.
        token: 0.0014181727317201672 // Sell price. ETH to token.
    },
    buy: {
        eth: 711.0950709237676, // Buy price. Tokens to ETH.
        token: 0.0014062817208125526 // Buy price. ETH to token.
    }
}
*/

// Getting token price for given block
let priceByBlock = await uniprices.getPriceByBlock(
    '0xE41d2489571d322189246DaFA5ebDe1F4699F498', // Token address, required. If address is not valid uniswap token will trow an error.
    9301593 // Block number, required.
);

/*
Returns an object:
{
    sell: {
        eth: 660.0046170034753, // Sell price. Tokens to ETH.
        token: 0.001515140916044129 // Sell price. ETH to token.
    },
    buy: {
        eth: 665.5473066426158, // Buy price. Tokens to ETH.
        token: 0.0015025227959294828 // Buy price. ETH to token.
    }
}
Or false if the price for a given block is not found
*/

// Getting token price for given date
let priceByDate = await uniprices.getPriceByDate(
    '0xE41d2489571d322189246DaFA5ebDe1F4699F498', // Token address, required. If address is not valid uniswap token will trow an error.
    '2019-09-02T12:00:00Z' // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
);

/*
Returns an object:
{
    sell: {
        eth: 1049.308625825207, // Sell price. Tokens to ETH.
        token: 0.0009530084623230564 // Sell price. ETH to token.
    },
    buy: {
        eth: 1064.442519929068, // Buy price. Tokens to ETH.
        token: 0.000939458901046754 // Buy price. ETH to token.
    }
}
Or false if the price for a given date is not found
*/

// Getting token price trend (Price 1h, 12h, 1d, 7d, 1m, 3m and 6m ago)
let priceTrend = await uniprices.getPriceTrend(
    '0xE41d2489571d322189246DaFA5ebDe1F4699F498', // Token address, required. If address is not valid uniswap token will trow an error.
);

/*
Returns an object:
{
    '1h': {
        sell: { eth: 706.3144725491642, token: 0.0014157999571931372 },
        buy: { eth: 712.2882035638517, token: 0.0014039261004135906 }
    },
    '12h': {
        sell: { eth: 706.3144725491642, token: 0.0014157999571931372 },
        buy: { eth: 712.2882035638517, token: 0.0014039261004135906 }
    },
    '1d': {
        sell: { eth: 667.0258578485677, token: 0.0014991922550430213 },
        buy: { eth: 672.6366528114763, token: 0.0014866867510419117 }
    },
    '7d': {
        sell: { eth: 702.3071222116168, token: 0.0014238784833206963 },
        buy: { eth: 708.8714215292256, token: 0.0014106930673587208 }
    },
    '3m': {
        sell: { eth: 568.2301739407155, token: 0.0017598502259479304 },
        buy: { eth: 574.8297096923411, token: 0.0017396456431161454 }
    },
    '1m': {
        sell: { eth: 668.2651684571723, token: 0.001496411974169933 },
        buy: { eth: 674.3174301154061, token: 0.0014829810936799529 }
    },
    '6m': {
        sell: { eth: 943.5426765954456, token: 0.001059835474117893 },
        buy: { eth: 955.6376597573558, token: 0.0010464217162118833 }
    }
}
*/
```