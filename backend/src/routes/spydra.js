/**
 * Spydra Routes
 * 
 * REST API endpoints for Spydra-based blockchain operations.
 * These routes provide an alternative to direct Fabric SDK integration.
 * 
 * Route Prefix: /api/spydra
 */

const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const assetService = require('../spydra/assetService');
const tokenService = require('../spydra/tokenService');
const spydraClient = require('../spydra/spydraClient');

// ============================================================================
// PUBLIC ROUTES (Read-only, no authentication required)
// ============================================================================

/**
 * GET /api/spydra/health
 * Check Spydra API connectivity
 */
router.get('/health', async (req, res) => {
  try {
    const health = await spydraClient.healthCheck();
    res.json({
      success: true,
      spydra: health
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/spydra/assets
 * List all published assets
 */
router.get('/assets', async (req, res) => {
  try {
    const { assetType, limit = 100, offset = 0 } = req.query;
    
    const filters = {
      status: 'published',
      limit: parseInt(limit),
      offset: parseInt(offset)
    };
    
    if (assetType) {
      filters.assetType = assetType;
    }
    
    const result = await assetService.listAssets(filters);
    
    res.json({
      success: true,
      data: result.assets,
      count: result.assets.length,
      total: result.total,
      limit: result.limit,
      offset: result.offset
    });
  } catch (error) {
    console.error('List assets error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/spydra/assets/:id
 * Get asset by ID
 */
router.get('/assets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await assetService.getAsset(id);
    
    res.json({
      success: true,
      data: result.asset
    });
  } catch (error) {
    console.error('Get asset error:', error);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/spydra/assets/:id/history
 * Get asset transaction history
 */
router.get('/assets/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await assetService.getAssetHistory(id);
    
    res.json({
      success: true,
      data: result.history,
      count: result.history.length
    });
  } catch (error) {
    console.error('Get asset history error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/spydra/tokens/:assetId/holders
 * Get token holders for an asset
 */
router.get('/tokens/:assetId/holders', async (req, res) => {
  try {
    const { assetId } = req.params;
    const result = await tokenService.getTokenHolders(assetId);
    
    res.json({
      success: true,
      data: result.holders,
      count: result.totalHolders
    });
  } catch (error) {
    console.error('Get token holders error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/spydra/tokens/:assetId/supply
 * Get token supply information
 */
router.get('/tokens/:assetId/supply', async (req, res) => {
  try {
    const { assetId } = req.params;
    const result = await tokenService.getTokenSupply(assetId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get token supply error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/spydra/wallets/:walletId/balance
 * Get wallet balance
 */
router.get('/wallets/:walletId/balance', async (req, res) => {
  try {
    const { walletId } = req.params;
    const { assetId } = req.query;
    
    const result = await tokenService.getBalance(walletId, assetId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/spydra/wallets/:walletId/transactions
 * Get wallet transaction history
 */
router.get('/wallets/:walletId/transactions', async (req, res) => {
  try {
    const { walletId } = req.params;
    const { assetId, limit = 50, offset = 0 } = req.query;
    
    const filters = {
      limit: parseInt(limit),
      offset: parseInt(offset)
    };
    
    if (assetId) {
      filters.assetId = assetId;
    }
    
    const result = await tokenService.getTransactionHistory(walletId, filters);
    
    res.json({
      success: true,
      data: result.transactions,
      count: result.transactions.length,
      total: result.total
    });
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// ADMIN ROUTES (Require authentication)
// ============================================================================

router.use(authenticateAdmin);

/**
 * POST /api/spydra/assets
 * Create a new asset (Admin only)
 */
router.post('/assets', async (req, res) => {
  try {
    const { asset, creatorWallet } = req.body;
    
    // Validate required fields
    const requiredFields = ['name', 'symbol', 'description', 'assetType', 'totalValue', 'totalSupply'];
    const missingFields = requiredFields.filter(field => !asset[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    if (!creatorWallet) {
      return res.status(400).json({
        success: false,
        error: 'creatorWallet is required'
      });
    }
    
    const result = await assetService.createAsset(asset, creatorWallet);
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Create asset error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/spydra/assets/:id
 * Update an asset (Admin only)
 */
router.put('/assets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { updates, updaterWallet } = req.body;
    
    if (!updaterWallet) {
      return res.status(400).json({
        success: false,
        error: 'updaterWallet is required'
      });
    }
    
    const result = await assetService.updateAsset(id, updates, updaterWallet);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Update asset error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/spydra/assets/:id/publish
 * Publish an asset (Admin only)
 */
router.post('/assets/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    const { publisherWallet } = req.body;
    
    if (!publisherWallet) {
      return res.status(400).json({
        success: false,
        error: 'publisherWallet is required'
      });
    }
    
    const result = await assetService.publishAsset(id, publisherWallet);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Publish asset error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/spydra/assets/:id/metadata
 * Create offchain metadata for an asset (Admin only)
 */
router.post('/assets/:id/metadata', async (req, res) => {
  try {
    const { id } = req.params;
    const { metadata } = req.body;
    
    if (!metadata) {
      return res.status(400).json({
        success: false,
        error: 'metadata is required'
      });
    }
    
    const result = await assetService.createOffchainMetadata(id, metadata);
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Create metadata error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/spydra/tokens/mint
 * Mint tokens (Admin only)
 */
router.post('/tokens/mint', async (req, res) => {
  try {
    const { assetId, recipientWallet, amount, minterWallet, metadata } = req.body;
    
    // Validate required fields
    if (!assetId || !recipientWallet || !amount || !minterWallet) {
      return res.status(400).json({
        success: false,
        error: 'assetId, recipientWallet, amount, and minterWallet are required'
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'amount must be greater than 0'
      });
    }
    
    const mintData = {
      assetId,
      recipientWallet,
      amount,
      metadata: metadata || {}
    };
    
    const result = await tokenService.mintTokens(mintData, minterWallet);
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Mint tokens error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/spydra/tokens/burn
 * Burn tokens (Admin only)
 */
router.post('/tokens/burn', async (req, res) => {
  try {
    const { assetId, holderWallet, amount, burnerWallet, reason } = req.body;
    
    // Validate required fields
    if (!assetId || !holderWallet || !amount || !burnerWallet) {
      return res.status(400).json({
        success: false,
        error: 'assetId, holderWallet, amount, and burnerWallet are required'
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'amount must be greater than 0'
      });
    }
    
    const burnData = {
      assetId,
      holderWallet,
      amount,
      reason
    };
    
    const result = await tokenService.burnTokens(burnData, burnerWallet);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Burn tokens error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/spydra/tokens/transfer
 * Transfer tokens between wallets
 */
router.post('/tokens/transfer', async (req, res) => {
  try {
    const { assetId, fromWallet, toWallet, amount, metadata } = req.body;
    
    // Validate required fields
    if (!assetId || !fromWallet || !toWallet || !amount) {
      return res.status(400).json({
        success: false,
        error: 'assetId, fromWallet, toWallet, and amount are required'
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'amount must be greater than 0'
      });
    }
    
    if (fromWallet === toWallet) {
      return res.status(400).json({
        success: false,
        error: 'fromWallet and toWallet cannot be the same'
      });
    }
    
    const transferData = {
      assetId,
      fromWallet,
      toWallet,
      amount,
      metadata: metadata || {}
    };
    
    const result = await tokenService.transferTokens(transferData);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Transfer tokens error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/spydra/tokens/purchase
 * Record a token purchase
 */
router.post('/tokens/purchase', async (req, res) => {
  try {
    const {
      assetId,
      sellerWallet,
      buyerWallet,
      amount,
      price,
      paymentMethod
    } = req.body;
    
    // Validate required fields
    if (!assetId || !sellerWallet || !buyerWallet || !amount || !price) {
      return res.status(400).json({
        success: false,
        error: 'assetId, sellerWallet, buyerWallet, amount, and price are required'
      });
    }
    
    const purchaseData = {
      assetId,
      sellerWallet,
      buyerWallet,
      amount,
      price,
      paymentMethod: paymentMethod || 'unknown'
    };
    
    const result = await tokenService.recordPurchase(purchaseData);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Record purchase error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
