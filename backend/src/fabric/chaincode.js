/**
 * Chaincode Interaction Layer
 * Provides high-level functions to interact with IMEC chaincode
 */

const gateway = require('./gateway');

class ChaincodeService {
  constructor() {
    this.defaultUser = 'admin';
  }

  /**
   * Asset Operations
   */

  async createAsset(userId, assetData) {
    try {
      const result = await gateway.submitTransaction(
        userId || this.defaultUser,
        'CreateAsset',
        assetData.id,
        JSON.stringify(assetData)
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error creating asset:', error.message);
      throw error;
    }
  }

  async updateAsset(userId, assetId, updates) {
    try {
      const result = await gateway.submitTransaction(
        userId || this.defaultUser,
        'UpdateAsset',
        assetId,
        JSON.stringify(updates)
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error updating asset:', error.message);
      throw error;
    }
  }

  async publishAsset(userId, assetId) {
    try {
      const result = await gateway.submitTransaction(
        userId || this.defaultUser,
        'PublishAsset',
        assetId
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error publishing asset:', error.message);
      throw error;
    }
  }

  async getAsset(assetId) {
    try {
      const result = await gateway.evaluateTransaction(
        this.defaultUser,
        'GetAsset',
        assetId
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error getting asset:', error.message);
      throw error;
    }
  }

  async getAllAssets() {
    try {
      const result = await gateway.evaluateTransaction(
        this.defaultUser,
        'GetAllAssets'
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error getting all assets:', error.message);
      throw error;
    }
  }

  /**
   * Token Operations
   */

  async mintTokens(userId, tokenData) {
    try {
      const result = await gateway.submitTransaction(
        userId || this.defaultUser,
        'MintTokens',
        tokenData.tokenId,
        tokenData.assetId,
        tokenData.totalSupply.toString(),
        tokenData.pricePerToken.toString(),
        JSON.stringify(tokenData.metadata || {})
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error minting tokens:', error.message);
      throw error;
    }
  }

  async burnTokens(userId, tokenId, amount) {
    try {
      const result = await gateway.submitTransaction(
        userId || this.defaultUser,
        'BurnTokens',
        tokenId,
        amount.toString()
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error burning tokens:', error.message);
      throw error;
    }
  }

  async transferTokens(userId, tokenId, fromUser, toUser, amount) {
    try {
      const result = await gateway.submitTransaction(
        userId || this.defaultUser,
        'TransferTokens',
        tokenId,
        fromUser,
        toUser,
        amount.toString()
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error transferring tokens:', error.message);
      throw error;
    }
  }

  async getToken(tokenId) {
    try {
      const result = await gateway.evaluateTransaction(
        this.defaultUser,
        'GetToken',
        tokenId
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error getting token:', error.message);
      throw error;
    }
  }

  async getAllTokens() {
    try {
      const result = await gateway.evaluateTransaction(
        this.defaultUser,
        'GetAllTokens'
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error getting all tokens:', error.message);
      throw error;
    }
  }

  async updateTokenPrice(userId, tokenId, newPrice) {
    try {
      const result = await gateway.submitTransaction(
        userId || this.defaultUser,
        'UpdateTokenPrice',
        tokenId,
        newPrice.toString()
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error updating token price:', error.message);
      throw error;
    }
  }

  /**
   * Investor Operations
   */

  async recordPurchase(userId, purchaseData) {
    try {
      const result = await gateway.submitTransaction(
        userId || this.defaultUser,
        'RecordPurchase',
        purchaseData.tokenId,
        purchaseData.investorId,
        purchaseData.amount.toString(),
        purchaseData.pricePerToken.toString(),
        purchaseData.transactionHash || ''
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error recording purchase:', error.message);
      throw error;
    }
  }

  async getInvestorBalance(investorId, tokenId) {
    try {
      const result = await gateway.evaluateTransaction(
        this.defaultUser,
        'GetInvestorBalance',
        investorId,
        tokenId
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error getting investor balance:', error.message);
      throw error;
    }
  }

  async getInvestorPortfolio(investorId) {
    try {
      const result = await gateway.evaluateTransaction(
        this.defaultUser,
        'GetInvestorPortfolio',
        investorId
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error getting investor portfolio:', error.message);
      throw error;
    }
  }

  async getAssetInvestors(assetId) {
    try {
      const result = await gateway.evaluateTransaction(
        this.defaultUser,
        'GetAssetInvestors',
        assetId
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error getting asset investors:', error.message);
      throw error;
    }
  }

  async getTokenInvestors(tokenId) {
    try {
      const result = await gateway.evaluateTransaction(
        this.defaultUser,
        'GetTokenInvestors',
        tokenId
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error getting token investors:', error.message);
      throw error;
    }
  }

  /**
   * Payout Operations
   */

  async recordPayout(userId, payoutData) {
    try {
      const result = await gateway.submitTransaction(
        userId || this.defaultUser,
        'RecordPayout',
        payoutData.assetId,
        payoutData.tokenId,
        payoutData.totalAmount.toString(),
        payoutData.payoutDate,
        JSON.stringify(payoutData.distributions || [])
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error recording payout:', error.message);
      throw error;
    }
  }

  async getAssetPayouts(assetId) {
    try {
      const result = await gateway.evaluateTransaction(
        this.defaultUser,
        'GetAssetPayouts',
        assetId
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error getting asset payouts:', error.message);
      throw error;
    }
  }

  async getInvestorPayouts(investorId) {
    try {
      const result = await gateway.evaluateTransaction(
        this.defaultUser,
        'GetInvestorPayouts',
        investorId
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error getting investor payouts:', error.message);
      throw error;
    }
  }

  /**
   * Query Operations
   */

  async queryAssetsByOwner(ownerId) {
    try {
      const result = await gateway.evaluateTransaction(
        this.defaultUser,
        'QueryAssetsByOwner',
        ownerId
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error querying assets by owner:', error.message);
      throw error;
    }
  }

  async queryAssetsByStatus(status) {
    try {
      const result = await gateway.evaluateTransaction(
        this.defaultUser,
        'QueryAssetsByStatus',
        status
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error querying assets by status:', error.message);
      throw error;
    }
  }

  async getAssetHistory(assetId) {
    try {
      const result = await gateway.evaluateTransaction(
        this.defaultUser,
        'GetAssetHistory',
        assetId
      );
      return JSON.parse(result);
    } catch (error) {
      console.error('Error getting asset history:', error.message);
      throw error;
    }
  }
}

module.exports = new ChaincodeService();
