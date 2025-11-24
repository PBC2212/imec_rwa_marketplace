/**
 * Admin API Routes
 * Requires authentication
 */

const express = require('express');
const router = express.Router();
const chaincode = require('../fabric/chaincode');
const spydraClient = require('../services/spydra/client');
const { authenticateAdmin } = require('../middleware/auth');
const { clearCache } = require('../middleware/cache');
const { v4: uuidv4 } = require('uuid');

// Apply authentication to all admin routes
router.use(authenticateAdmin);

/**
 * POST /api/admin/assets
 * Create a new asset
 */
router.post('/assets', async (req, res, next) => {
  try {
    const assetData = {
      id: req.body.id || uuidv4(),
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      location: req.body.location,
      value: req.body.value,
      images: req.body.images || [],
      documents: req.body.documents || [],
      metadata: req.body.metadata || {},
      owner: req.body.owner || 'admin',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create asset on Fabric ledger
    const result = await chaincode.createAsset('admin', assetData);

    // Sync to Spydra (secondary)
    await spydraClient.syncAssetFromFabric(result);

    // Clear cache
    clearCache();

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/assets/:id
 * Update an existing asset
 */
router.put('/assets/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    // Update on Fabric ledger
    const result = await chaincode.updateAsset('admin', id, updates);

    // Sync to Spydra
    await spydraClient.syncAssetFromFabric(result);

    // Clear cache
    clearCache();

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/assets/:id/publish
 * Publish an asset
 */
router.post('/assets/:id/publish', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Publish asset on Fabric
    const result = await chaincode.publishAsset('admin', id);

    // Sync to Spydra
    await spydraClient.syncAssetFromFabric(result);

    // Clear cache
    clearCache();

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/tokens
 * Mint new tokens for an asset
 */
router.post('/tokens', async (req, res, next) => {
  try {
    const tokenData = {
      tokenId: req.body.tokenId || uuidv4(),
      assetId: req.body.assetId,
      totalSupply: req.body.totalSupply,
      pricePerToken: req.body.pricePerToken,
      symbol: req.body.symbol,
      name: req.body.name,
      metadata: req.body.metadata || {},
    };

    // Mint tokens on Fabric
    const result = await chaincode.mintTokens('admin', tokenData);

    // Sync to Spydra
    await spydraClient.syncTokenFromFabric(result);

    // Clear cache
    clearCache();

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/tokens/:id/price
 * Update token price
 */
router.post('/tokens/:id/price', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPrice } = req.body;

    if (!newPrice || newPrice <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid price',
      });
    }

    // Update price on Fabric
    const result = await chaincode.updateTokenPrice('admin', id, newPrice);

    // Sync to Spydra
    await spydraClient.syncTokenFromFabric(result);

    // Clear cache
    clearCache();

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/payouts
 * Record a payout distribution
 */
router.post('/payouts', async (req, res, next) => {
  try {
    const payoutData = {
      assetId: req.body.assetId,
      tokenId: req.body.tokenId,
      totalAmount: req.body.totalAmount,
      payoutDate: req.body.payoutDate || new Date().toISOString(),
      distributions: req.body.distributions || [],
    };

    // Record payout on Fabric
    const result = await chaincode.recordPayout('admin', payoutData);

    // Clear cache
    clearCache();

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/purchases
 * Record an investor purchase
 */
router.post('/purchases', async (req, res, next) => {
  try {
    const purchaseData = {
      tokenId: req.body.tokenId,
      investorId: req.body.investorId,
      amount: req.body.amount,
      pricePerToken: req.body.pricePerToken,
      transactionHash: req.body.transactionHash || '',
    };

    // Record purchase on Fabric
    const result = await chaincode.recordPurchase('admin', purchaseData);

    // Clear cache
    clearCache();

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/tokens/:id
 * Burn tokens (reduce supply)
 */
router.delete('/tokens/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
      });
    }

    // Burn tokens on Fabric
    const result = await chaincode.burnTokens('admin', id, amount);

    // Clear cache
    clearCache();

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/assets
 * Get all assets including drafts
 */
router.get('/assets', async (req, res, next) => {
  try {
    const assets = await chaincode.getAllAssets();

    res.json({
      success: true,
      data: assets,
      count: assets.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/asset/:id/history
 * Get asset history
 */
router.get('/asset/:id/history', async (req, res, next) => {
  try {
    const { id } = req.params;
    const history = await chaincode.getAssetHistory(id);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
