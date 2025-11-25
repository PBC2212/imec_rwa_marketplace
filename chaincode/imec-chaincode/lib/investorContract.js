/*
 * Investor Contract
 * Manages investor portfolios and purchase tracking
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class InvestorContract extends Contract {

    constructor() {
        super('InvestorContract');
    }

    /**
     * Register a new investor
     * @param {Context} ctx - Transaction context
     * @param {string} investorId - Unique investor identifier
     * @param {string} investorData - JSON string containing investor details
     */
    async RegisterInvestor(ctx, investorId, investorData) {
        console.info('============= START : Register Investor ===========');

        // Validate input
        if (!investorId || !investorData) {
            throw new Error('Investor ID and data are required');
        }

        // Check if investor already exists
        const exists = await this.InvestorExists(ctx, investorId);
        if (exists) {
            throw new Error(`Investor ${investorId} already exists`);
        }

        // Parse investor data
        let investor;
        try {
            investor = JSON.parse(investorData);
        } catch (error) {
            throw new Error('Invalid JSON format for investor data');
        }

        // Add metadata
        investor.id = investorId;
        investor.docType = 'investor';
        investor.registeredAt = new Date().toISOString();
        investor.updatedAt = new Date().toISOString();
        investor.totalInvested = 0;
        investor.activeInvestments = 0;
        investor.kycVerified = investor.kycVerified || false;
        investor.status = investor.status || 'active';

        // Store investor
        await ctx.stub.putState(investorId, Buffer.from(JSON.stringify(investor)));

        // Emit event
        ctx.stub.setEvent('InvestorRegistered', Buffer.from(JSON.stringify({
            investorId: investorId,
            timestamp: investor.registeredAt
        })));

        console.info('============= END : Register Investor ===========');
        return JSON.stringify(investor);
    }

    /**
     * Update investor information
     * @param {Context} ctx - Transaction context
     * @param {string} investorId - Investor identifier
     * @param {string} updateData - JSON string with fields to update
     */
    async UpdateInvestor(ctx, investorId, updateData) {
        console.info('============= START : Update Investor ===========');

        const exists = await this.InvestorExists(ctx, investorId);
        if (!exists) {
            throw new Error(`Investor ${investorId} does not exist`);
        }

        const investorBytes = await ctx.stub.getState(investorId);
        const investor = JSON.parse(investorBytes.toString());

        // Parse update data
        let updates;
        try {
            updates = JSON.parse(updateData);
        } catch (error) {
            throw new Error('Invalid JSON format for update data');
        }

        // Apply updates (prevent modification of immutable fields)
        const immutableFields = ['id', 'docType', 'registeredAt'];
        for (const [key, value] of Object.entries(updates)) {
            if (!immutableFields.includes(key)) {
                investor[key] = value;
            }
        }

        investor.updatedAt = new Date().toISOString();

        await ctx.stub.putState(investorId, Buffer.from(JSON.stringify(investor)));

        console.info('============= END : Update Investor ===========');
        return JSON.stringify(investor);
    }

    /**
     * Record a token purchase
     * @param {Context} ctx - Transaction context
     * @param {string} purchaseId - Unique purchase identifier
     * @param {string} investorId - Investor identifier
     * @param {string} tokenId - Token identifier
     * @param {number} amount - Amount of tokens purchased
     * @param {number} totalPrice - Total purchase price
     */
    async RecordPurchase(ctx, purchaseId, investorId, tokenId, amount, totalPrice) {
        console.info('============= START : Record Purchase ===========');

        amount = parseFloat(amount);
        totalPrice = parseFloat(totalPrice);

        if (isNaN(amount) || amount <= 0 || isNaN(totalPrice) || totalPrice <= 0) {
            throw new Error('Invalid purchase amount or price');
        }

        // Verify investor exists
        const investorExists = await this.InvestorExists(ctx, investorId);
        if (!investorExists) {
            throw new Error(`Investor ${investorId} does not exist`);
        }

        // Verify token exists
        const tokenBytes = await ctx.stub.getState(tokenId);
        if (!tokenBytes || tokenBytes.length === 0) {
            throw new Error(`Token ${tokenId} does not exist`);
        }

        const token = JSON.parse(tokenBytes.toString());

        // Check available supply
        if (amount > token.availableSupply) {
            throw new Error('Insufficient token supply');
        }

        // Create purchase record
        const purchase = {
            id: purchaseId,
            docType: 'purchase',
            investorId: investorId,
            tokenId: tokenId,
            assetId: token.assetId,
            amount: amount,
            pricePerToken: totalPrice / amount,
            totalPrice: totalPrice,
            purchaseDate: new Date().toISOString(),
            status: 'completed'
        };

        await ctx.stub.putState(purchaseId, Buffer.from(JSON.stringify(purchase)));

        // Update token balance
        const balanceKey = ctx.stub.createCompositeKey('balance', [tokenId, investorId]);
        const balanceBytes = await ctx.stub.getState(balanceKey);
        
        let currentBalance = 0;
        if (balanceBytes && balanceBytes.length > 0) {
            currentBalance = parseFloat(balanceBytes.toString());
        }

        const newBalance = currentBalance + amount;
        await ctx.stub.putState(balanceKey, Buffer.from(newBalance.toString()));

        // Update token statistics
        token.circulatingSupply += amount;
        token.availableSupply -= amount;
        token.totalRaised += totalPrice;
        token.updatedAt = new Date().toISOString();

        // Track unique investors
        if (currentBalance === 0) {
            token.investorCount += 1;
        }

        await ctx.stub.putState(tokenId, Buffer.from(JSON.stringify(token)));

        // Update investor statistics
        const investorBytes = await ctx.stub.getState(investorId);
        const investor = JSON.parse(investorBytes.toString());
        investor.totalInvested += totalPrice;
        
        if (currentBalance === 0) {
            investor.activeInvestments += 1;
        }

        investor.updatedAt = new Date().toISOString();
        await ctx.stub.putState(investorId, Buffer.from(JSON.stringify(investor)));

        // Emit event
        ctx.stub.setEvent('PurchaseRecorded', Buffer.from(JSON.stringify({
            purchaseId: purchaseId,
            investorId: investorId,
            tokenId: tokenId,
            amount: amount,
            totalPrice: totalPrice,
            timestamp: purchase.purchaseDate
        })));

        console.info('============= END : Record Purchase ===========');
        return JSON.stringify(purchase);
    }

    /**
     * Get investor balance for a specific token
     * @param {Context} ctx - Transaction context
     * @param {string} investorId - Investor identifier
     * @param {string} tokenId - Token identifier
     */
    async GetInvestorBalance(ctx, investorId, tokenId) {
        console.info('============= START : Get Investor Balance ===========');

        const balanceKey = ctx.stub.createCompositeKey('balance', [tokenId, investorId]);
        const balanceBytes = await ctx.stub.getState(balanceKey);

        let balance = 0;
        if (balanceBytes && balanceBytes.length > 0) {
            balance = parseFloat(balanceBytes.toString());
        }

        // Get token info
        const tokenBytes = await ctx.stub.getState(tokenId);
        let tokenInfo = null;
        if (tokenBytes && tokenBytes.length > 0) {
            const token = JSON.parse(tokenBytes.toString());
            tokenInfo = {
                id: token.id,
                symbol: token.symbol,
                name: token.name,
                pricePerToken: token.pricePerToken
            };
        }

        const result = {
            investorId: investorId,
            tokenId: tokenId,
            balance: balance,
            currentValue: balance * (tokenInfo ? tokenInfo.pricePerToken : 0),
            token: tokenInfo
        };

        console.info('============= END : Get Investor Balance ===========');
        return JSON.stringify(result);
    }

    /**
     * Get investor portfolio (all holdings)
     * @param {Context} ctx - Transaction context
     * @param {string} investorId - Investor identifier
     */
    async GetInvestorPortfolio(ctx, investorId) {
        console.info('============= START : Get Investor Portfolio ===========');

        // Get all purchases by investor
        const queryString = JSON.stringify({
            selector: {
                docType: 'purchase',
                investorId: investorId
            }
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const purchases = await this._getAllResults(iterator);

        // Get unique tokens
        const tokenIds = [...new Set(purchases.map(p => p.tokenId))];

        // Build portfolio
        const holdings = [];
        let totalValue = 0;
        let totalInvested = 0;

        for (const tokenId of tokenIds) {
            const balanceKey = ctx.stub.createCompositeKey('balance', [tokenId, investorId]);
            const balanceBytes = await ctx.stub.getState(balanceKey);
            
            if (balanceBytes && balanceBytes.length > 0) {
                const balance = parseFloat(balanceBytes.toString());
                
                if (balance > 0) {
                    const tokenBytes = await ctx.stub.getState(tokenId);
                    const token = JSON.parse(tokenBytes.toString());

                    const tokenPurchases = purchases.filter(p => p.tokenId === tokenId);
                    const invested = tokenPurchases.reduce((sum, p) => sum + p.totalPrice, 0);
                    const currentValue = balance * token.pricePerToken;
                    
                    holdings.push({
                        tokenId: tokenId,
                        assetId: token.assetId,
                        symbol: token.symbol,
                        name: token.name,
                        balance: balance,
                        averageBuyPrice: invested / balance,
                        currentPrice: token.pricePerToken,
                        invested: invested,
                        currentValue: currentValue,
                        profitLoss: currentValue - invested,
                        profitLossPercentage: ((currentValue - invested) / invested * 100).toFixed(2) + '%'
                    });

                    totalValue += currentValue;
                    totalInvested += invested;
                }
            }
        }

        // Get investor info
        const investorBytes = await ctx.stub.getState(investorId);
        let investor = null;
        if (investorBytes && investorBytes.length > 0) {
            investor = JSON.parse(investorBytes.toString());
        }

        const portfolio = {
            investorId: investorId,
            investorInfo: investor,
            holdings: holdings,
            summary: {
                totalInvested: totalInvested,
                currentValue: totalValue,
                totalProfitLoss: totalValue - totalInvested,
                totalProfitLossPercentage: totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested * 100).toFixed(2) + '%' : '0%',
                numberOfHoldings: holdings.length
            }
        };

        console.info('============= END : Get Investor Portfolio ===========');
        return JSON.stringify(portfolio);
    }

    /**
     * Get all investors holding a specific token
     * @param {Context} ctx - Transaction context
     * @param {string} tokenId - Token identifier
     */
    async GetTokenInvestors(ctx, tokenId) {
        console.info('============= START : Get Token Investors ===========');

        // Get all purchases for this token
        const queryString = JSON.stringify({
            selector: {
                docType: 'purchase',
                tokenId: tokenId
            }
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const purchases = await this._getAllResults(iterator);

        // Get unique investors
        const investorIds = [...new Set(purchases.map(p => p.investorId))];

        const investors = [];
        for (const investorId of investorIds) {
            const balanceKey = ctx.stub.createCompositeKey('balance', [tokenId, investorId]);
            const balanceBytes = await ctx.stub.getState(balanceKey);
            
            if (balanceBytes && balanceBytes.length > 0) {
                const balance = parseFloat(balanceBytes.toString());
                
                if (balance > 0) {
                    const investorBytes = await ctx.stub.getState(investorId);
                    let investorData = { id: investorId };
                    
                    if (investorBytes && investorBytes.length > 0) {
                        investorData = JSON.parse(investorBytes.toString());
                    }

                    investors.push({
                        investorId: investorId,
                        investorName: investorData.name || investorData.id,
                        balance: balance,
                        email: investorData.email
                    });
                }
            }
        }

        console.info('============= END : Get Token Investors ===========');
        return JSON.stringify(investors);
    }

    /**
     * Get investor purchase history
     * @param {Context} ctx - Transaction context
     * @param {string} investorId - Investor identifier
     */
    async GetInvestorPurchaseHistory(ctx, investorId) {
        console.info('============= START : Get Investor Purchase History ===========');

        const queryString = JSON.stringify({
            selector: {
                docType: 'purchase',
                investorId: investorId
            },
            sort: [{ purchaseDate: 'desc' }]
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const purchases = await this._getAllResults(iterator);

        console.info('============= END : Get Investor Purchase History ===========');
        return JSON.stringify(purchases);
    }

    /**
     * Get investor by ID
     * @param {Context} ctx - Transaction context
     * @param {string} investorId - Investor identifier
     */
    async GetInvestor(ctx, investorId) {
        console.info('============= START : Get Investor ===========');

        const investorBytes = await ctx.stub.getState(investorId);
        if (!investorBytes || investorBytes.length === 0) {
            throw new Error(`Investor ${investorId} does not exist`);
        }

        console.info('============= END : Get Investor ===========');
        return investorBytes.toString();
    }

    /**
     * Get all investors
     * @param {Context} ctx - Transaction context
     */
    async GetAllInvestors(ctx) {
        console.info('============= START : Get All Investors ===========');

        const queryString = JSON.stringify({
            selector: {
                docType: 'investor'
            }
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const investors = await this._getAllResults(iterator);

        console.info('============= END : Get All Investors ===========');
        return JSON.stringify(investors);
    }

    /**
     * Check if investor exists
     * @param {Context} ctx - Transaction context
     * @param {string} investorId - Investor identifier
     */
    async InvestorExists(ctx, investorId) {
        const investorBytes = await ctx.stub.getState(investorId);
        return investorBytes && investorBytes.length > 0;
    }

    /**
     * Update investor KYC status
     * @param {Context} ctx - Transaction context
     * @param {string} investorId - Investor identifier
     * @param {boolean} verified - KYC verification status
     */
    async UpdateKYCStatus(ctx, investorId, verified) {
        console.info('============= START : Update KYC Status ===========');

        const investorBytes = await ctx.stub.getState(investorId);
        if (!investorBytes || investorBytes.length === 0) {
            throw new Error(`Investor ${investorId} does not exist`);
        }

        const investor = JSON.parse(investorBytes.toString());
        investor.kycVerified = verified === 'true' || verified === true;
        investor.kycVerifiedAt = new Date().toISOString();
        investor.updatedAt = investor.kycVerifiedAt;

        await ctx.stub.putState(investorId, Buffer.from(JSON.stringify(investor)));

        // Emit event
        ctx.stub.setEvent('KYCStatusUpdated', Buffer.from(JSON.stringify({
            investorId: investorId,
            verified: investor.kycVerified,
            timestamp: investor.kycVerifiedAt
        })));

        console.info('============= END : Update KYC Status ===========');
        return JSON.stringify(investor);
    }

    // ============= Helper Functions =============

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

module.exports = InvestorContract;
