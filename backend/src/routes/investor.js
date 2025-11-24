/**
 * Investor API Routes
 * Routes for investor-specific operations
 */

const express = require('express');
const router = express.Router();
const chaincode = require('../fabric/chaincode');
const { cacheMiddleware } = require('../middleware/cache');

/**
 * GET /api/investor/:id/portfolio
 * Get investor's portfolio
 */
router.get('/:id/portfolio', cacheMiddleware(30), async (req, res, next) => {
  try {
    const { id } = req.params;
    const portfolio = await chaincode.getInvestorPortfolio(id);

    res.json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/investor/:id/balance/:tokenId
 * Get investor's balance for a specific token
 */
router.get('/:id/balance/:tokenId', cacheMiddleware(30), async (req, res, next) => {
  try {
    const { id, tokenId } = req.params;
    const balance = await chaincode.getInvestorBalance(id, tokenId);

    res.json({
      success: true,
      data: balance,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/investor/:id/payouts
 * Get investor's payout history
 */
router.get('/:id/payouts', cacheMiddleware(60), async (req, res, next) => {
  try {
    const { id } = req.params;
    const payouts = await chaincode.getInvestorPayouts(id);

    res.json({
      success: true,
      data: payouts,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/investor/:id/purchase
 * Record a token purchase by investor
 */
router.post('/:id/purchase', async (req, res, next) => {
  try {
    const { id } = req.params;
    const purchaseData = {
      tokenId: req.body.tokenId,
      investorId: id,
      amount: req.body.amount,
      pricePerToken: req.body.pricePerToken,
      transactionHash: req.body.transactionHash || '',
    };

    const result = await chaincode.recordPurchase(id, purchaseData);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
