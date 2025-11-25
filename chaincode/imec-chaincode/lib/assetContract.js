/*
 * Asset Contract
 * Manages real-world asset lifecycle on the blockchain
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AssetContract extends Contract {

    constructor() {
        super('AssetContract');
    }

    /**
     * Initialize the ledger with sample data (optional)
     */
    async InitLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const assets = [];
        console.info('============= END : Initialize Ledger ===========');
        return JSON.stringify(assets);
    }

    /**
     * Create a new asset
     * @param {Context} ctx - Transaction context
     * @param {string} assetId - Unique asset identifier
     * @param {string} assetData - JSON string containing asset details
     */
    async CreateAsset(ctx, assetId, assetData) {
        console.info('============= START : Create Asset ===========');

        // Validate input
        if (!assetId || !assetData) {
            throw new Error('Asset ID and data are required');
        }

        // Check if asset already exists
        const exists = await this.AssetExists(ctx, assetId);
        if (exists) {
            throw new Error(`Asset ${assetId} already exists`);
        }

        // Parse asset data
        let asset;
        try {
            asset = JSON.parse(assetData);
        } catch (error) {
            throw new Error('Invalid JSON format for asset data');
        }

        // Add metadata
        asset.id = assetId;
        asset.docType = 'asset';
        asset.status = asset.status || 'draft';
        asset.createdAt = new Date().toISOString();
        asset.updatedAt = new Date().toISOString();
        asset.createdBy = this._getInvokerIdentity(ctx);

        // Validate required fields
        const requiredFields = ['name', 'description', 'assetType', 'totalValue'];
        for (const field of requiredFields) {
            if (!asset[field]) {
                throw new Error(`Required field ${field} is missing`);
            }
        }

        // Store asset on ledger
        await ctx.stub.putState(assetId, Buffer.from(JSON.stringify(asset)));

        // Emit event
        const eventPayload = {
            assetId: assetId,
            action: 'created',
            timestamp: asset.createdAt
        };
        ctx.stub.setEvent('AssetCreated', Buffer.from(JSON.stringify(eventPayload)));

        console.info('============= END : Create Asset ===========');
        return JSON.stringify(asset);
    }

    /**
     * Update an existing asset
     * @param {Context} ctx - Transaction context
     * @param {string} assetId - Asset identifier
     * @param {string} updateData - JSON string with fields to update
     */
    async UpdateAsset(ctx, assetId, updateData) {
        console.info('============= START : Update Asset ===========');

        // Check if asset exists
        const exists = await this.AssetExists(ctx, assetId);
        if (!exists) {
            throw new Error(`Asset ${assetId} does not exist`);
        }

        // Get existing asset
        const assetBytes = await ctx.stub.getState(assetId);
        const asset = JSON.parse(assetBytes.toString());

        // Parse update data
        let updates;
        try {
            updates = JSON.parse(updateData);
        } catch (error) {
            throw new Error('Invalid JSON format for update data');
        }

        // Apply updates (prevent modification of immutable fields)
        const immutableFields = ['id', 'docType', 'createdAt', 'createdBy'];
        for (const [key, value] of Object.entries(updates)) {
            if (!immutableFields.includes(key)) {
                asset[key] = value;
            }
        }

        asset.updatedAt = new Date().toISOString();
        asset.updatedBy = this._getInvokerIdentity(ctx);

        // Store updated asset
        await ctx.stub.putState(assetId, Buffer.from(JSON.stringify(asset)));

        // Emit event
        const eventPayload = {
            assetId: assetId,
            action: 'updated',
            timestamp: asset.updatedAt
        };
        ctx.stub.setEvent('AssetUpdated', Buffer.from(JSON.stringify(eventPayload)));

        console.info('============= END : Update Asset ===========');
        return JSON.stringify(asset);
    }

    /**
     * Publish an asset (make it available for investment)
     * @param {Context} ctx - Transaction context
     * @param {string} assetId - Asset identifier
     */
    async PublishAsset(ctx, assetId) {
        console.info('============= START : Publish Asset ===========');

        // Get asset
        const exists = await this.AssetExists(ctx, assetId);
        if (!exists) {
            throw new Error(`Asset ${assetId} does not exist`);
        }

        const assetBytes = await ctx.stub.getState(assetId);
        const asset = JSON.parse(assetBytes.toString());

        // Validate asset is ready for publishing
        if (!asset.tokenId) {
            throw new Error('Asset must have associated tokens before publishing');
        }

        // Update status
        asset.status = 'published';
        asset.publishedAt = new Date().toISOString();
        asset.updatedAt = asset.publishedAt;
        asset.publishedBy = this._getInvokerIdentity(ctx);

        // Store updated asset
        await ctx.stub.putState(assetId, Buffer.from(JSON.stringify(asset)));

        // Emit event
        const eventPayload = {
            assetId: assetId,
            action: 'published',
            timestamp: asset.publishedAt
        };
        ctx.stub.setEvent('AssetPublished', Buffer.from(JSON.stringify(eventPayload)));

        console.info('============= END : Publish Asset ===========');
        return JSON.stringify(asset);
    }

    /**
     * Archive an asset
     * @param {Context} ctx - Transaction context
     * @param {string} assetId - Asset identifier
     */
    async ArchiveAsset(ctx, assetId) {
        console.info('============= START : Archive Asset ===========');

        const exists = await this.AssetExists(ctx, assetId);
        if (!exists) {
            throw new Error(`Asset ${assetId} does not exist`);
        }

        const assetBytes = await ctx.stub.getState(assetId);
        const asset = JSON.parse(assetBytes.toString());

        asset.status = 'archived';
        asset.archivedAt = new Date().toISOString();
        asset.updatedAt = asset.archivedAt;

        await ctx.stub.putState(assetId, Buffer.from(JSON.stringify(asset)));

        // Emit event
        ctx.stub.setEvent('AssetArchived', Buffer.from(JSON.stringify({
            assetId: assetId,
            action: 'archived',
            timestamp: asset.archivedAt
        })));

        console.info('============= END : Archive Asset ===========');
        return JSON.stringify(asset);
    }

    /**
     * Delete an asset (admin only, use with caution)
     * @param {Context} ctx - Transaction context
     * @param {string} assetId - Asset identifier
     */
    async DeleteAsset(ctx, assetId) {
        console.info('============= START : Delete Asset ===========');

        const exists = await this.AssetExists(ctx, assetId);
        if (!exists) {
            throw new Error(`Asset ${assetId} does not exist`);
        }

        // Delete from ledger
        await ctx.stub.deleteState(assetId);

        // Emit event
        ctx.stub.setEvent('AssetDeleted', Buffer.from(JSON.stringify({
            assetId: assetId,
            action: 'deleted',
            timestamp: new Date().toISOString()
        })));

        console.info('============= END : Delete Asset ===========');
        return JSON.stringify({ success: true, message: `Asset ${assetId} deleted` });
    }

    /**
     * Get asset by ID
     * @param {Context} ctx - Transaction context
     * @param {string} assetId - Asset identifier
     */
    async GetAsset(ctx, assetId) {
        console.info('============= START : Get Asset ===========');

        const assetBytes = await ctx.stub.getState(assetId);
        if (!assetBytes || assetBytes.length === 0) {
            throw new Error(`Asset ${assetId} does not exist`);
        }

        console.info('============= END : Get Asset ===========');
        return assetBytes.toString();
    }

    /**
     * Get all assets (with optional filtering)
     * @param {Context} ctx - Transaction context
     * @param {string} filterQuery - Optional CouchDB query (JSON string)
     */
    async GetAllAssets(ctx, filterQuery) {
        console.info('============= START : Get All Assets ===========');

        let queryString;
        if (filterQuery) {
            queryString = filterQuery;
        } else {
            queryString = JSON.stringify({
                selector: {
                    docType: 'asset'
                }
            });
        }

        const iterator = await ctx.stub.getQueryResult(queryString);
        const assets = await this._getAllResults(iterator);

        console.info('============= END : Get All Assets ===========');
        return JSON.stringify(assets);
    }

    /**
     * Get published assets only
     * @param {Context} ctx - Transaction context
     */
    async GetPublishedAssets(ctx) {
        console.info('============= START : Get Published Assets ===========');

        const queryString = JSON.stringify({
            selector: {
                docType: 'asset',
                status: 'published'
            }
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const assets = await this._getAllResults(iterator);

        console.info('============= END : Get Published Assets ===========');
        return JSON.stringify(assets);
    }

    /**
     * Get asset history
     * @param {Context} ctx - Transaction context
     * @param {string} assetId - Asset identifier
     */
    async GetAssetHistory(ctx, assetId) {
        console.info('============= START : Get Asset History ===========');

        const iterator = await ctx.stub.getHistoryForKey(assetId);
        const history = await this._getAllHistoryResults(iterator);

        console.info('============= END : Get Asset History ===========');
        return JSON.stringify(history);
    }

    /**
     * Check if asset exists
     * @param {Context} ctx - Transaction context
     * @param {string} assetId - Asset identifier
     */
    async AssetExists(ctx, assetId) {
        const assetBytes = await ctx.stub.getState(assetId);
        return assetBytes && assetBytes.length > 0;
    }

    /**
     * Get assets by type
     * @param {Context} ctx - Transaction context
     * @param {string} assetType - Asset type (e.g., 'real-estate', 'art', 'commodity')
     */
    async GetAssetsByType(ctx, assetType) {
        console.info('============= START : Get Assets By Type ===========');

        const queryString = JSON.stringify({
            selector: {
                docType: 'asset',
                assetType: assetType
            }
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const assets = await this._getAllResults(iterator);

        console.info('============= END : Get Assets By Type ===========');
        return JSON.stringify(assets);
    }

    /**
     * Search assets by criteria
     * @param {Context} ctx - Transaction context
     * @param {string} searchCriteria - JSON string with search parameters
     */
    async SearchAssets(ctx, searchCriteria) {
        console.info('============= START : Search Assets ===========');

        let criteria;
        try {
            criteria = JSON.parse(searchCriteria);
        } catch (error) {
            throw new Error('Invalid JSON format for search criteria');
        }

        // Build selector
        const selector = { docType: 'asset' };
        Object.assign(selector, criteria);

        const queryString = JSON.stringify({ selector });
        const iterator = await ctx.stub.getQueryResult(queryString);
        const assets = await this._getAllResults(iterator);

        console.info('============= END : Search Assets ===========');
        return JSON.stringify(assets);
    }

    // ============= Helper Functions =============

    /**
     * Get invoker identity
     */
    _getInvokerIdentity(ctx) {
        const clientIdentity = ctx.clientIdentity;
        return clientIdentity.getID();
    }

    /**
     * Get all results from iterator
     */
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

    /**
     * Get all history results from iterator
     */
    async _getAllHistoryResults(iterator) {
        const allResults = [];
        let res = await iterator.next();

        while (!res.done) {
            if (res.value) {
                const jsonRes = {};
                jsonRes.TxId = res.value.txId;
                jsonRes.Timestamp = res.value.timestamp;
                jsonRes.IsDelete = res.value.isDelete ? res.value.isDelete.toString() : 'false';

                try {
                    if (res.value.value && res.value.value.toString()) {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    }
                } catch (err) {
                    console.log(err);
                    jsonRes.Value = res.value.value.toString('utf8');
                }

                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }

        await iterator.close();
        return allResults;
    }
}

module.exports = AssetContract;
