/**
 * Public API Routes
 * Accessible without authentication
 */

const express = require('express');
const router = express.Router();
const chaincode = require('../fabric/chaincode');
const { cacheMiddleware } = require('../middleware/cache');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config');

/**
 * GET /api/feed
 * Get public feed JSON
 */
router.get('/feed', cacheMiddleware(60), async (req, res, next) => {
  try {
    const feedPath = path.resolve(__dirname, '../../public/feed.json');
    const feedData = await fs.readFile(feedPath, 'utf8');
    
    res.json(JSON.parse(feedData));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/assets
 * Get all published assets
 */
router.get('/assets', cacheMiddleware(30), async (req, res, next) => {
  try {
    const assets = await chaincode.getAllAssets();
    
    // Filter only published assets for public endpoint
    const publishedAssets = assets.filter(asset => asset.status === 'published');

    res.json({
      success: true,
      data: publishedAssets,
      count: publishedAssets.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/asset/:id
 * Get specific asset details
 */
router.get('/asset/:id', cacheMiddleware(30), async (req, res, next) => {
  try {
    const { id } = req.params;
    const asset = await chaincode.getAsset(id);

    if (!asset || asset.status !== 'published') {
      return res.status(404).json({
        success: false,
        error: 'Asset not found',
      });
    }

    res.json({
      success: true,
      data: asset,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tokens
 * Get all tokens
 */
router.get('/tokens', cacheMiddleware(30), async (req, res, next) => {
  try {
    const tokens = await chaincode.getAllTokens();

    res.json({
      success: true,
      data: tokens,
      count: tokens.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/token/:id
 * Get specific token details
 */
router.get('/token/:id', cacheMiddleware(30), async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = await chaincode.getToken(id);

    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found',
      });
    }

    res.json({
      success: true,
      data: token,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/token/:id/investors
 * Get investors for a specific token
 */
router.get('/token/:id/investors', cacheMiddleware(60), async (req, res, next) => {
  try {
    const { id } = req.params;
    const investors = await chaincode.getTokenInvestors(id);

    res.json({
      success: true,
      data: investors,
      count: investors.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/prices
 * Get current token prices and market data
 */
router.get('/prices', cacheMiddleware(60), async (req, res, next) => {
  try {
    const tokens = await chaincode.getAllTokens();

    const prices = tokens.map(token => ({
      tokenId: token.tokenId,
      symbol: token.symbol || config.token.symbol,
      name: token.name || config.token.name,
      pricePerToken: token.pricePerToken,
      totalSupply: token.totalSupply,
      circulatingSupply: token.circulatingSupply || token.totalSupply,
      marketCap: (token.pricePerToken || 0) * (token.circulatingSupply || token.totalSupply || 0),
    }));

    res.json({
      success: true,
      data: prices,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/stats
 * Get platform statistics
 */
router.get('/stats', cacheMiddleware(120), async (req, res, next) => {
  try {
    const assets = await chaincode.getAllAssets();
    const tokens = await chaincode.getAllTokens();

    const stats = {
      totalAssets: assets.length,
      publishedAssets: assets.filter(a => a.status === 'published').length,
      totalTokens: tokens.length,
      totalMarketCap: tokens.reduce((sum, token) => {
        return sum + ((token.pricePerToken || 0) * (token.totalSupply || 0));
      }, 0),
      totalSupply: tokens.reduce((sum, token) => sum + (token.totalSupply || 0), 0),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
