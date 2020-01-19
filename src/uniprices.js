const BigNumber = require('bignumber.js');
const EthDater = require('ethereum-block-by-date');

const factoryABI = require('./abi/factory');
const erc20ABI = require('./abi/erc20');
const addresses = require('./addresses');

module.exports = class Uniprices {
    constructor(web3) {
        this.web3 = web3;
        this.dater = new EthDater(web3);
        this.factory = new this.web3.eth.Contract(factoryABI, addresses.factory);
        this.trendBlocks = {};
    }

    async getPriceCurrent(address) {
        return await this.getPriceWrapper(
            await this.getToken(address)
        );
    }

    async getPriceByBlock(address, block) {
        return await this.getPriceWrapper(
            await this.getToken(address),
            block
        );
    }

    async getPriceByDate(address, date) {
        const { block } = await this.dater.getDate(date);
        return await this.getPriceWrapper(
            await this.getToken(address),
            block
        );
    }

    async getPriceTrend(address) {
        const token = await this.getToken(address);
        return Object.assign( {}, ...await Promise.all(
            Object.entries(await this.getTrendBlocks()).map(async i => {
                return { [i[0]]: await this.getPriceWrapper(token, i[1]) };
            })
        ));
    }

    async getPriceWrapper(token, block = 'latest') {
        try {
            return await this.getPrice(token, block);
        } catch(e) {
            return false;
        }
    }

    async getToken(address) {
        const token = { address: address };
        const tokenContract = new this.web3.eth.Contract(erc20ABI, address);
        token.exchange = await this.factory.methods.getExchange(address).call();
        token.decimals = await tokenContract.methods.decimals().call();
        return token;
    }

    async getTrendBlocks() {
        if (Object.keys(this.trendBlocks).length == 0) await this.createTrendBlocks();
        return this.trendBlocks;
    }

    async createTrendBlocks() {
        const dates = [
            { period: '1h', timestamp: new Date().setHours(new Date().getHours() - 1) },
            { period: '12h', timestamp: new Date().setHours(new Date().getHours() - 12) },
            { period: '1d', timestamp: new Date().setDate(new Date().getDate() - 1) },
            { period: '7d', timestamp: new Date().setDate(new Date().getDate() - 7) },
            { period: '1m', timestamp: new Date().setMonth(new Date().getMonth() - 1) },
            { period: '3m', timestamp: new Date().setMonth(new Date().getMonth() - 3) },
            { period: '6m', timestamp: new Date().setMonth(new Date().getMonth() - 6) }
        ];

        return await Promise.all(
            dates.map(async date => ({ block: this.trendBlocks[date.period] } = await this.dater.getDate(date.timestamp)))
        );
    }

    async getPrice(token, block) {
        const tokenContract = new this.web3.eth.Contract(erc20ABI, token.address);

        const calculations = {
            amount: BigNumber(1),
            full: BigNumber(1000),
            comission: BigNumber(997)
        };

        const reserveETH = BigNumber(
            await this.web3.eth.getBalance(token.exchange, block)
        ).shiftedBy(-18);

        const reserveToken = BigNumber(
            await tokenContract.methods.balanceOf(token.exchange).call(block)
        ).shiftedBy(
            BigNumber(token.decimals).negated().toNumber()
        );

        const sell = reserveToken.times(calculations.comission).div(
            reserveETH.times(calculations.full).plus(calculations.amount.times(calculations.comission))
        );

        const buy = reserveToken.times(calculations.full).div(
            reserveETH.minus(calculations.amount).times(calculations.comission)
        );

        return {
            sell: {
                eth: sell.toNumber(),
                token: calculations.amount.div(sell).toNumber()
            },
            buy: {
                eth: buy.toNumber(),
                token: calculations.amount.div(buy).toNumber()
            }
        };
    }
};