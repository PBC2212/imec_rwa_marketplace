/*
 * Payout Contract
 * Manages dividend/revenue payouts to token holders
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class PayoutContract extends Contract {

    constructor() {
        super('PayoutContract');
    }

    /**
     * Record a payout for an asset
     * @param {Context} ctx - Transaction context
     * @param {string} payoutId - Unique payout identifier
     * @param {string} assetId - Asset identifier
     * @param {string} tokenId - Token identifier
     * @param {number} totalAmount - Total payout amount
     * @param {string} payoutType - Type of payout (dividend, revenue, rental, etc.)
     * @param {string} description - Payout description
     */
    async RecordPayout(ctx, payoutId, assetId, tokenId, totalAmount, payoutType, description) {
        console.info('============= START : Record Payout ===========');

        totalAmount = parseFloat(totalAmount);
        if (isNaN(totalAmount) || totalAmount <= 0) {
            throw new Error('Invalid payout amount');
        }

        // Check if payout already exists
        const exists = await this.PayoutExists(ctx, payoutId);
        if (exists) {
            throw new Error(`Payout ${payoutId} already exists`);
        }

        // Verify asset exists
        const assetBytes = await ctx.stub.getState(assetId);
        if (!assetBytes || assetBytes.length === 0) {
            throw new Error(`Asset ${assetId} does not exist`);
        }

        // Verify token exists
        const tokenBytes = await ctx.stub.getState(tokenId);
        if (!tokenBytes || tokenBytes.length === 0) {
            throw new Error(`Token ${tokenId} does not exist`);
        }

        const token = JSON.parse(tokenBytes.toString());

        // Create payout record
        const payout = {
            id: payoutId,
            docType: 'payout',
            assetId: assetId,
            tokenId: tokenId,
            totalAmount: totalAmount,
            payoutType: payoutType,
            description: description,
            perTokenAmount: token.circulatingSupply > 0 ? totalAmount / token.circulatingSupply : 0,
            circulatingSupplyAtPayout: token.circulatingSupply,
            payoutDate: new Date().toISOString(),
            status: 'pending',
            distributedAmount: 0,
            remainingAmount: totalAmount,
            recordedBy: this._getInvokerIdentity(ctx)
        };

        await ctx.stub.putState(payoutId, Buffer.from(JSON.stringify(payout)));

        // Emit event
        ctx.stub.setEvent('PayoutRecorded', Buffer.from(JSON.stringify({
            payoutId: payoutId,
            assetId: assetId,
            tokenId: tokenId,
            totalAmount: totalAmount,
            timestamp: payout.payoutDate
        })));

        console.info('============= END : Record Payout ===========');
        return JSON.stringify(payout);
    }

    /**
     * Distribute payout to investors
     * @param {Context} ctx - Transaction context
     * @param {string} payoutId - Payout identifier
     */
    async DistributePayout(ctx, payoutId) {
        console.info('============= START : Distribute Payout ===========');

        const payoutBytes = await ctx.stub.getState(payoutId);
        if (!payoutBytes || payoutBytes.length === 0) {
            throw new Error(`Payout ${payoutId} does not exist`);
        }

        const payout = JSON.parse(payoutBytes.toString());

        if (payout.status === 'completed') {
            throw new Error('Payout already distributed');
        }

        // Get all investors for this token
        const queryString = JSON.stringify({
            selector: {
                docType: 'purchase',
                tokenId: payout.tokenId
            }
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const purchases = await this._getAllResults(iterator);

        // Get unique investors
        const investorIds = [...new Set(purchases.map(p => p.investorId))];

        const distributions = [];
        let totalDistributed = 0;

        for (const investorId of investorIds) {
            const balanceKey = ctx.stub.createCompositeKey('balance', [payout.tokenId, investorId]);
            const balanceBytes = await ctx.stub.getState(balanceKey);
            
            if (balanceBytes && balanceBytes.length > 0) {
                const balance = parseFloat(balanceBytes.toString());
                
                if (balance > 0) {
                    const investorAmount = balance * payout.perTokenAmount;

                    // Create distribution record
                    const distributionId = `dist_${payoutId}_${investorId}`;
                    const distribution = {
                        id: distributionId,
                        docType: 'distribution',
                        payoutId: payoutId,
                        investorId: investorId,
                        tokenId: payout.tokenId,
                        tokenBalance: balance,
                        amount: investorAmount,
                        distributedAt: new Date().toISOString(),
                        status: 'completed'
                    };

                    await ctx.stub.putState(distributionId, Buffer.from(JSON.stringify(distribution)));
                    distributions.push(distribution);
                    totalDistributed += investorAmount;
                }
            }
        }

        // Update payout status
        payout.status = 'completed';
        payout.distributedAmount = totalDistributed;
        payout.remainingAmount = payout.totalAmount - totalDistributed;
        payout.distributedAt = new Date().toISOString();
        payout.numberOfRecipients = distributions.length;

        await ctx.stub.putState(payoutId, Buffer.from(JSON.stringify(payout)));

        // Emit event
        ctx.stub.setEvent('PayoutDistributed', Buffer.from(JSON.stringify({
            payoutId: payoutId,
            totalDistributed: totalDistributed,
            numberOfRecipients: distributions.length,
            timestamp: payout.distributedAt
        })));

        console.info('============= END : Distribute Payout ===========');
        return JSON.stringify({
            payout: payout,
            distributions: distributions
        });
    }

    /**
     * Get payout by ID
     * @param {Context} ctx - Transaction context
     * @param {string} payoutId - Payout identifier
     */
    async GetPayout(ctx, payoutId) {
        console.info('============= START : Get Payout ===========');

        const payoutBytes = await ctx.stub.getState(payoutId);
        if (!payoutBytes || payoutBytes.length === 0) {
            throw new Error(`Payout ${payoutId} does not exist`);
        }

        console.info('============= END : Get Payout ===========');
        return payoutBytes.toString();
    }

    /**
     * Get all payouts for an asset
     * @param {Context} ctx - Transaction context
     * @param {string} assetId - Asset identifier
     */
    async GetAssetPayouts(ctx, assetId) {
        console.info('============= START : Get Asset Payouts ===========');

        const queryString = JSON.stringify({
            selector: {
                docType: 'payout',
                assetId: assetId
            },
            sort: [{ payoutDate: 'desc' }]
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const payouts = await this._getAllResults(iterator);

        // Calculate statistics
        const stats = {
            totalPayouts: payouts.length,
            totalDistributed: payouts.reduce((sum, p) => sum + (p.distributedAmount || 0), 0),
            lastPayoutDate: payouts.length > 0 ? payouts[0].payoutDate : null
        };

        console.info('============= END : Get Asset Payouts ===========');
        return JSON.stringify({
            assetId: assetId,
            payouts: payouts,
            statistics: stats
        });
    }

    /**
     * Get all payouts for an investor
     * @param {Context} ctx - Transaction context
     * @param {string} investorId - Investor identifier
     */
    async GetInvestorPayouts(ctx, investorId) {
        console.info('============= START : Get Investor Payouts ===========');

        const queryString = JSON.stringify({
            selector: {
                docType: 'distribution',
                investorId: investorId
            },
            sort: [{ distributedAt: 'desc' }]
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const distributions = await this._getAllResults(iterator);

        // Get details for each distribution
        const detailedDistributions = [];
        let totalReceived = 0;

        for (const dist of distributions) {
            // Get payout details
            const payoutBytes = await ctx.stub.getState(dist.payoutId);
            let payoutInfo = null;
            
            if (payoutBytes && payoutBytes.length > 0) {
                const payout = JSON.parse(payoutBytes.toString());
                payoutInfo = {
                    assetId: payout.assetId,
                    tokenId: payout.tokenId,
                    payoutType: payout.payoutType,
                    description: payout.description,
                    payoutDate: payout.payoutDate
                };
            }

            detailedDistributions.push({
                ...dist,
                payoutDetails: payoutInfo
            });

            totalReceived += dist.amount;
        }

        // Calculate statistics
        const stats = {
            totalDistributions: distributions.length,
            totalReceived: totalReceived,
            lastDistributionDate: distributions.length > 0 ? distributions[0].distributedAt : null
        };

        console.info('============= END : Get Investor Payouts ===========');
        return JSON.stringify({
            investorId: investorId,
            distributions: detailedDistributions,
            statistics: stats
        });
    }

    /**
     * Get payout distribution details
     * @param {Context} ctx - Transaction context
     * @param {string} payoutId - Payout identifier
     */
    async GetPayoutDistributions(ctx, payoutId) {
        console.info('============= START : Get Payout Distributions ===========');

        const queryString = JSON.stringify({
            selector: {
                docType: 'distribution',
                payoutId: payoutId
            }
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const distributions = await this._getAllResults(iterator);

        console.info('============= END : Get Payout Distributions ===========');
        return JSON.stringify(distributions);
    }

    /**
     * Get all payouts
     * @param {Context} ctx - Transaction context
     */
    async GetAllPayouts(ctx) {
        console.info('============= START : Get All Payouts ===========');

        const queryString = JSON.stringify({
            selector: {
                docType: 'payout'
            },
            sort: [{ payoutDate: 'desc' }]
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const payouts = await this._getAllResults(iterator);

        console.info('============= END : Get All Payouts ===========');
        return JSON.stringify(payouts);
    }

    /**
     * Update payout status
     * @param {Context} ctx - Transaction context
     * @param {string} payoutId - Payout identifier
     * @param {string} status - New status
     */
    async UpdatePayoutStatus(ctx, payoutId, status) {
        console.info('============= START : Update Payout Status ===========');

        const payoutBytes = await ctx.stub.getState(payoutId);
        if (!payoutBytes || payoutBytes.length === 0) {
            throw new Error(`Payout ${payoutId} does not exist`);
        }

        const payout = JSON.parse(payoutBytes.toString());
        payout.status = status;
        payout.updatedAt = new Date().toISOString();

        await ctx.stub.putState(payoutId, Buffer.from(JSON.stringify(payout)));

        console.info('============= END : Update Payout Status ===========');
        return JSON.stringify(payout);
    }

    /**
     * Cancel a payout
     * @param {Context} ctx - Transaction context
     * @param {string} payoutId - Payout identifier
     * @param {string} reason - Cancellation reason
     */
    async CancelPayout(ctx, payoutId, reason) {
        console.info('============= START : Cancel Payout ===========');

        const payoutBytes = await ctx.stub.getState(payoutId);
        if (!payoutBytes || payoutBytes.length === 0) {
            throw new Error(`Payout ${payoutId} does not exist`);
        }

        const payout = JSON.parse(payoutBytes.toString());

        if (payout.status === 'completed') {
            throw new Error('Cannot cancel completed payout');
        }

        payout.status = 'cancelled';
        payout.cancelledAt = new Date().toISOString();
        payout.cancellationReason = reason;

        await ctx.stub.putState(payoutId, Buffer.from(JSON.stringify(payout)));

        // Emit event
        ctx.stub.setEvent('PayoutCancelled', Buffer.from(JSON.stringify({
            payoutId: payoutId,
            reason: reason,
            timestamp: payout.cancelledAt
        })));

        console.info('============= END : Cancel Payout ===========');
        return JSON.stringify(payout);
    }

    /**
     * Get payout statistics for a token
     * @param {Context} ctx - Transaction context
     * @param {string} tokenId - Token identifier
     */
    async GetTokenPayoutStatistics(ctx, tokenId) {
        console.info('============= START : Get Token Payout Statistics ===========');

        const queryString = JSON.stringify({
            selector: {
                docType: 'payout',
                tokenId: tokenId
            }
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const payouts = await this._getAllResults(iterator);

        const stats = {
            tokenId: tokenId,
            totalPayouts: payouts.length,
            totalDistributed: payouts.reduce((sum, p) => sum + (p.distributedAmount || 0), 0),
            totalAmount: payouts.reduce((sum, p) => sum + p.totalAmount, 0),
            averagePayoutAmount: payouts.length > 0 ? 
                payouts.reduce((sum, p) => sum + p.totalAmount, 0) / payouts.length : 0,
            completedPayouts: payouts.filter(p => p.status === 'completed').length,
            pendingPayouts: payouts.filter(p => p.status === 'pending').length,
            lastPayoutDate: payouts.length > 0 ? payouts[0].payoutDate : null
        };

        console.info('============= END : Get Token Payout Statistics ===========');
        return JSON.stringify(stats);
    }

    /**
     * Check if payout exists
     * @param {Context} ctx - Transaction context
     * @param {string} payoutId - Payout identifier
     */
    async PayoutExists(ctx, payoutId) {
        const payoutBytes = await ctx.stub.getState(payoutId);
        return payoutBytes && payoutBytes.length > 0;
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

module.exports = PayoutContract;
