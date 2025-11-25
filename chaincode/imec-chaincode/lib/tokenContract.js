/*
 * Token Contract
 * Manages tokenization and token lifecycle for RWA marketplace
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class TokenContract extends Contract {

    constructor() {
        super('TokenContract');
    }

    /**
     * Mint new tokens for an asset
     * @param {Context} ctx - Transaction context
     * @param {string} tokenId - Unique token identifier
     * @param {string} assetId - Associated asset ID
     * @param {string} tokenData - JSON string containing token details
     */
    async MintTokens(ctx, tokenId, assetId, tokenData) {
        console.info('============= START : Mint Tokens ===========');

        // Validate input
        if (!tokenId || !assetId || !tokenData) {
            throw new Error('Token ID, Asset ID, and token data are required');
        }

        // Check if token already exists
        const exists = await this.TokenExists(ctx, tokenId);
        if (exists) {
            throw new Error(`Token ${tokenId} already exists`);
        }

        // Verify asset exists
        const assetBytes = await ctx.stub.getState(assetId);
        if (!assetBytes || assetBytes.length === 0) {
            throw new Error(`Asset ${assetId} does not exist`);
        }

        // Parse token data
        let token;
        try {
            token = JSON.parse(tokenData);
        } catch (error) {
            throw new Error('Invalid JSON format for token data');
        }

        // Add metadata
        token.id = tokenId;
        token.assetId = assetId;
        token.docType = 'token';
        token.createdAt = new Date().toISOString();
        token.updatedAt = new Date().toISOString();
        token.createdBy = this._getInvokerIdentity(ctx);

        // Validate required fields
        const requiredFields = ['symbol', 'name', 'totalSupply', 'pricePerToken'];
        for (const field of requiredFields) {
            if (token[field] === undefined || token[field] === null) {
                throw new Error(`Required field ${field} is missing`);
            }
        }

        // Initialize token state
        token.circulatingSupply = 0;
        token.burnedSupply = 0;
        token.availableSupply = token.totalSupply;
        token.totalRaised = 0;
        token.investorCount = 0;

        // Store token
        await ctx.stub.putState(tokenId, Buffer.from(JSON.stringify(token)));

        // Update asset with tokenId
        const asset = JSON.parse(assetBytes.toString());
        asset.tokenId = tokenId;
        asset.updatedAt = new Date().toISOString();
        await ctx.stub.putState(assetId, Buffer.from(JSON.stringify(asset)));

        // Emit event
        const eventPayload = {
            tokenId: tokenId,
            assetId: assetId,
            totalSupply: token.totalSupply,
            action: 'minted',
            timestamp: token.createdAt
        };
        ctx.stub.setEvent('TokensMinted', Buffer.from(JSON.stringify(eventPayload)));

        console.info('============= END : Mint Tokens ===========');
        return JSON.stringify(token);
    }

    /**
     * Burn tokens (remove from circulation)
     * @param {Context} ctx - Transaction context
     * @param {string} tokenId - Token identifier
     * @param {number} amount - Amount of tokens to burn
     */
    async BurnTokens(ctx, tokenId, amount) {
        console.info('============= START : Burn Tokens ===========');

        amount = parseFloat(amount);
        if (isNaN(amount) || amount <= 0) {
            throw new Error('Invalid burn amount');
        }

        // Get token
        const tokenBytes = await ctx.stub.getState(tokenId);
        if (!tokenBytes || tokenBytes.length === 0) {
            throw new Error(`Token ${tokenId} does not exist`);
        }

        const token = JSON.parse(tokenBytes.toString());

        // Validate burn amount
        if (amount > token.circulatingSupply) {
            throw new Error('Burn amount exceeds circulating supply');
        }

        // Update supplies
        token.circulatingSupply -= amount;
        token.burnedSupply += amount;
        token.availableSupply = token.totalSupply - token.circulatingSupply - token.burnedSupply;
        token.updatedAt = new Date().toISOString();

        // Store updated token
        await ctx.stub.putState(tokenId, Buffer.from(JSON.stringify(token)));

        // Emit event
        ctx.stub.setEvent('TokensBurned', Buffer.from(JSON.stringify({
            tokenId: tokenId,
            amount: amount,
            timestamp: token.updatedAt
        })));

        console.info('============= END : Burn Tokens ===========');
        return JSON.stringify(token);
    }

    /**
     * Transfer tokens between investors
     * @param {Context} ctx - Transaction context
     * @param {string} tokenId - Token identifier
     * @param {string} fromInvestor - Sender investor ID
     * @param {string} toInvestor - Recipient investor ID
     * @param {number} amount - Amount to transfer
     */
    async TransferTokens(ctx, tokenId, fromInvestor, toInvestor, amount) {
        console.info('============= START : Transfer Tokens ===========');

        amount = parseFloat(amount);
        if (isNaN(amount) || amount <= 0) {
            throw new Error('Invalid transfer amount');
        }

        // Validate different investors
        if (fromInvestor === toInvestor) {
            throw new Error('Cannot transfer to same investor');
        }

        // Get token
        const tokenBytes = await ctx.stub.getState(tokenId);
        if (!tokenBytes || tokenBytes.length === 0) {
            throw new Error(`Token ${tokenId} does not exist`);
        }

        // Get sender balance
        const fromBalanceKey = ctx.stub.createCompositeKey('balance', [tokenId, fromInvestor]);
        const fromBalanceBytes = await ctx.stub.getState(fromBalanceKey);
        
        let fromBalance = 0;
        if (fromBalanceBytes && fromBalanceBytes.length > 0) {
            fromBalance = parseFloat(fromBalanceBytes.toString());
        }

        if (fromBalance < amount) {
            throw new Error('Insufficient balance');
        }

        // Get recipient balance
        const toBalanceKey = ctx.stub.createCompositeKey('balance', [tokenId, toInvestor]);
        const toBalanceBytes = await ctx.stub.getState(toBalanceKey);
        
        let toBalance = 0;
        if (toBalanceBytes && toBalanceBytes.length > 0) {
            toBalance = parseFloat(toBalanceBytes.toString());
        }

        // Update balances
        fromBalance -= amount;
        toBalance += amount;

        await ctx.stub.putState(fromBalanceKey, Buffer.from(fromBalance.toString()));
        await ctx.stub.putState(toBalanceKey, Buffer.from(toBalance.toString()));

        // Record transfer
        const transferId = `transfer_${tokenId}_${Date.now()}`;
        const transfer = {
            id: transferId,
            docType: 'transfer',
            tokenId: tokenId,
            from: fromInvestor,
            to: toInvestor,
            amount: amount,
            timestamp: new Date().toISOString()
        };
        await ctx.stub.putState(transferId, Buffer.from(JSON.stringify(transfer)));

        // Emit event
        ctx.stub.setEvent('TokensTransferred', Buffer.from(JSON.stringify(transfer)));

        console.info('============= END : Transfer Tokens ===========');
        return JSON.stringify(transfer);
    }

    /**
     * Update token price
     * @param {Context} ctx - Transaction context
     * @param {string} tokenId - Token identifier
     * @param {number} newPrice - New price per token
     */
    async UpdateTokenPrice(ctx, tokenId, newPrice) {
        console.info('============= START : Update Token Price ===========');

        newPrice = parseFloat(newPrice);
        if (isNaN(newPrice) || newPrice <= 0) {
            throw new Error('Invalid price');
        }

        // Get token
        const tokenBytes = await ctx.stub.getState(tokenId);
        if (!tokenBytes || tokenBytes.length === 0) {
            throw new Error(`Token ${tokenId} does not exist`);
        }

        const token = JSON.parse(tokenBytes.toString());
        const oldPrice = token.pricePerToken;

        // Update price
        token.pricePerToken = newPrice;
        token.updatedAt = new Date().toISOString();
        token.priceHistory = token.priceHistory || [];
        token.priceHistory.push({
            oldPrice: oldPrice,
            newPrice: newPrice,
            timestamp: token.updatedAt
        });

        // Store updated token
        await ctx.stub.putState(tokenId, Buffer.from(JSON.stringify(token)));

        // Emit event
        ctx.stub.setEvent('TokenPriceUpdated', Buffer.from(JSON.stringify({
            tokenId: tokenId,
            oldPrice: oldPrice,
            newPrice: newPrice,
            timestamp: token.updatedAt
        })));

        console.info('============= END : Update Token Price ===========');
        return JSON.stringify(token);
    }

    /**
     * Get token by ID
     * @param {Context} ctx - Transaction context
     * @param {string} tokenId - Token identifier
     */
    async GetToken(ctx, tokenId) {
        console.info('============= START : Get Token ===========');

        const tokenBytes = await ctx.stub.getState(tokenId);
        if (!tokenBytes || tokenBytes.length === 0) {
            throw new Error(`Token ${tokenId} does not exist`);
        }

        console.info('============= END : Get Token ===========');
        return tokenBytes.toString();
    }

    /**
     * Get all tokens
     * @param {Context} ctx - Transaction context
     */
    async GetAllTokens(ctx) {
        console.info('============= START : Get All Tokens ===========');

        const queryString = JSON.stringify({
            selector: {
                docType: 'token'
            }
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const tokens = await this._getAllResults(iterator);

        console.info('============= END : Get All Tokens ===========');
        return JSON.stringify(tokens);
    }

    /**
     * Get tokens by asset
     * @param {Context} ctx - Transaction context
     * @param {string} assetId - Asset identifier
     */
    async GetTokensByAsset(ctx, assetId) {
        console.info('============= START : Get Tokens By Asset ===========');

        const queryString = JSON.stringify({
            selector: {
                docType: 'token',
                assetId: assetId
            }
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const tokens = await this._getAllResults(iterator);

        console.info('============= END : Get Tokens By Asset ===========');
        return JSON.stringify(tokens);
    }

    /**
     * Get token balance for investor
     * @param {Context} ctx - Transaction context
     * @param {string} tokenId - Token identifier
     * @param {string} investorId - Investor identifier
     */
    async GetTokenBalance(ctx, tokenId, investorId) {
        console.info('============= START : Get Token Balance ===========');

        const balanceKey = ctx.stub.createCompositeKey('balance', [tokenId, investorId]);
        const balanceBytes = await ctx.stub.getState(balanceKey);

        let balance = 0;
        if (balanceBytes && balanceBytes.length > 0) {
            balance = parseFloat(balanceBytes.toString());
        }

        console.info('============= END : Get Token Balance ===========');
        return JSON.stringify({ tokenId, investorId, balance });
    }

    /**
     * Get token statistics
     * @param {Context} ctx - Transaction context
     * @param {string} tokenId - Token identifier
     */
    async GetTokenStatistics(ctx, tokenId) {
        console.info('============= START : Get Token Statistics ===========');

        const tokenBytes = await ctx.stub.getState(tokenId);
        if (!tokenBytes || tokenBytes.length === 0) {
            throw new Error(`Token ${tokenId} does not exist`);
        }

        const token = JSON.parse(tokenBytes.toString());

        const stats = {
            tokenId: token.id,
            symbol: token.symbol,
            name: token.name,
            totalSupply: token.totalSupply,
            circulatingSupply: token.circulatingSupply,
            availableSupply: token.availableSupply,
            burnedSupply: token.burnedSupply,
            currentPrice: token.pricePerToken,
            marketCap: token.circulatingSupply * token.pricePerToken,
            totalRaised: token.totalRaised,
            investorCount: token.investorCount,
            utilizationRate: ((token.circulatingSupply / token.totalSupply) * 100).toFixed(2) + '%'
        };

        console.info('============= END : Get Token Statistics ===========');
        return JSON.stringify(stats);
    }

    /**
     * Check if token exists
     * @param {Context} ctx - Transaction context
     * @param {string} tokenId - Token identifier
     */
    async TokenExists(ctx, tokenId) {
        const tokenBytes = await ctx.stub.getState(tokenId);
        return tokenBytes && tokenBytes.length > 0;
    }

    /**
     * Get token transfer history
     * @param {Context} ctx - Transaction context
     * @param {string} tokenId - Token identifier
     */
    async GetTokenTransferHistory(ctx, tokenId) {
        console.info('============= START : Get Token Transfer History ===========');

        const queryString = JSON.stringify({
            selector: {
                docType: 'transfer',
                tokenId: tokenId
            },
            sort: [{ timestamp: 'desc' }]
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const transfers = await this._getAllResults(iterator);

        console.info('============= END : Get Token Transfer History ===========');
        return JSON.stringify(transfers);
    }

    // ============= Helper Functions =============

    _getInvokerIdentity(ctx) {
        const clientIdentity = ctx.clientIdentity;
        return clientIdentity.getID();
    }

    async _getAllResults(iterator) {
        const allResults = [];
        let res = await iterator.next();

        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                const jsonRes = {};
                jsonRes.Key = res.value.key;
                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes.Record);
            }
            res = await iterator.next();
        }

        await iterator.close();
        return allResults;
    }
}

module.exports = TokenContract;
