/*
 * IMEC RWA Marketplace Chaincode
 * Main entry point for the smart contract
 */

'use strict';

const AssetContract = require('./lib/assetContract');
const TokenContract = require('./lib/tokenContract');
const InvestorContract = require('./lib/investorContract');
const PayoutContract = require('./lib/payoutContract');

module.exports.AssetContract = AssetContract;
module.exports.TokenContract = TokenContract;
module.exports.InvestorContract = InvestorContract;
module.exports.PayoutContract = PayoutContract;

module.exports.contracts = [
    AssetContract,
    TokenContract,
    InvestorContract,
    PayoutContract
];
