require('dotenv').config();
const assert = require('chai').assert;
const Web3 = require('web3');
const Uniprices = require('../src/uniprices');

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + process.env.INFURA));
const uniprices = new Uniprices(web3);

describe('🦄 Uniprices Tests', function() {
    // TODO
});