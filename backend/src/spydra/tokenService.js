/**
 * Spydra Token Service
 * 
 * Handles all token-related operations through Spydra's REST API.
 * Tokens represent fractional ownership of assets.
 */

const spydraClient = require('./spydraClient');
const config = require('./config');

class TokenService {
  /**
   * Mint new tokens for an asset
   * 
   * @param {Object} mintData - Minting information
   * @param {string} mintData.assetId - Asset to mint tokens for
   * @param {string} mintData.recipientWallet - Wallet to receive tokens
   * @param {number} mintData.amount - Number of tokens to mint
   * @param {Object} mintData.metadata - Additional minting metadata
   * @param {string} minterWallet - Wallet address of minter (must have permission)
   * 
   * @returns {Promise<Object>} Minting result with transaction details
   */
  async mintTokens(mintData, minterWallet) {
    try {
      console.log('[TokenService] Minting tokens:', mintData.amount, 'for asset:', mintData.assetId);
      
      const payload = {
        assetId: mintData.assetId,
        minterWallet,
        recipientWallet: mintData.recipientWallet,
        amount: mintData.amount,
        metadata: {
          ...mintData.metadata,
          mintedAt: new Date().toISOString(),
          minter: minterWallet,
        }
      };
      
      const response = await spydraClient.post(
        config.endpoints.mintTokens,
        payload
      );
      
      // Wait for transaction confirmation
      if (response.transactionId) {
        await spydraClient.waitForTransaction(response.transactionId);
      }
      
      console.log('[TokenService] Tokens minted successfully. TX:', response.transactionId);
      
      return {
        success: true,
        transactionId: response.transactionId,
        assetId: mintData.assetId,
        recipientWallet: mintData.recipientWallet,
        amount: mintData.amount,
        newBalance: response.newBalance
      };
    } catch (error) {
      console.error('[TokenService] Mint tokens error:', error.message);
      throw new Error(`Failed to mint tokens: ${error.message}`);
    }
  }
  
  /**
   * Burn tokens (remove from circulation)
   * 
   * @param {Object} burnData - Burning information
   * @param {string} burnData.assetId - Asset to burn tokens from
   * @param {string} burnData.holderWallet - Wallet holding tokens to burn
   * @param {number} burnData.amount - Number of tokens to burn
   * @param {string} burnerWallet - Wallet address initiating burn
   * 
   * @returns {Promise<Object>} Burning result
   */
  async burnTokens(burnData, burnerWallet) {
    try {
      console.log('[TokenService] Burning tokens:', burnData.amount, 'from asset:', burnData.assetId);
      
      const payload = {
        assetId: burnData.assetId,
        burnerWallet,
        holderWallet: burnData.holderWallet,
        amount: burnData.amount,
        metadata: {
          burnedAt: new Date().toISOString(),
          burner: burnerWallet,
          reason: burnData.reason || 'Token redemption'
        }
      };
      
      const response = await spydraClient.post(
        config.endpoints.burnTokens,
        payload
      );
      
      // Wait for transaction confirmation
      if (response.transactionId) {
        await spydraClient.waitForTransaction(response.transactionId);
      }
      
      console.log('[TokenService] Tokens burned successfully. TX:', response.transactionId);
      
      return {
        success: true,
        transactionId: response.transactionId,
        assetId: burnData.assetId,
        holderWallet: burnData.holderWallet,
        amount: burnData.amount,
        newBalance: response.newBalance
      };
    } catch (error) {
      console.error('[TokenService] Burn tokens error:', error.message);
      throw new Error(`Failed to burn tokens: ${error.message}`);
    }
  }
  
  /**
   * Transfer tokens between wallets
   * 
   * @param {Object} transferData - Transfer information
   * @param {string} transferData.assetId - Asset tokens to transfer
   * @param {string} transferData.fromWallet - Sender wallet
   * @param {string} transferData.toWallet - Recipient wallet
   * @param {number} transferData.amount - Number of tokens to transfer
   * @param {Object} transferData.metadata - Additional transfer metadata
   * 
   * @returns {Promise<Object>} Transfer result
   */
  async transferTokens(transferData) {
    try {
      console.log('[TokenService] Transferring tokens:', 
        transferData.amount, 
        'from', transferData.fromWallet, 
        'to', transferData.toWallet
      );
      
      const payload = {
        assetId: transferData.assetId,
        fromWallet: transferData.fromWallet,
        toWallet: transferData.toWallet,
        amount: transferData.amount,
        metadata: {
          ...transferData.metadata,
          transferredAt: new Date().toISOString(),
        }
      };
      
      const response = await spydraClient.post(
        config.endpoints.transferTokens,
        payload
      );
      
      // Wait for transaction confirmation
      if (response.transactionId) {
        await spydraClient.waitForTransaction(response.transactionId);
      }
      
      console.log('[TokenService] Tokens transferred successfully. TX:', response.transactionId);
      
      return {
        success: true,
        transactionId: response.transactionId,
        assetId: transferData.assetId,
        fromWallet: transferData.fromWallet,
        toWallet: transferData.toWallet,
        amount: transferData.amount,
        fromBalance: response.fromBalance,
        toBalance: response.toBalance
      };
    } catch (error) {
      console.error('[TokenService] Transfer tokens error:', error.message);
      throw new Error(`Failed to transfer tokens: ${error.message}`);
    }
  }
  
  /**
   * Get token balance for a wallet
   * 
   * @param {string} walletId - Wallet address
   * @param {string} assetId - Optional: filter by specific asset
   * @returns {Promise<Object>} Balance information
   */
  async getBalance(walletId, assetId = null) {
    try {
      console.log('[TokenService] Getting balance for wallet:', walletId);
      
      const params = { walletId };
      if (assetId) {
        params.assetId = assetId;
      }
      
      const response = await spydraClient.get(
        config.endpoints.getBalance,
        params
      );
      
      return {
        success: true,
        walletId,
        balances: response.balances || [],
        totalAssets: response.totalAssets || 0
      };
    } catch (error) {
      console.error('[TokenService] Get balance error:', error.message);
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }
  
  /**
   * Get all token holders for an asset
   * 
   * @param {string} assetId - Asset identifier
   * @returns {Promise<Object>} List of token holders
   */
  async getTokenHolders(assetId) {
    try {
      console.log('[TokenService] Getting token holders for asset:', assetId);
      
      // Query transactions to build holder list
      const response = await spydraClient.get(
        config.endpoints.listTransactions,
        {
          filter: {
            assetId,
            type: ['mint', 'transfer'],
            sortBy: 'timestamp',
            sortOrder: 'desc'
          }
        }
      );
      
      // Aggregate holders from transactions
      const holders = new Map();
      
      for (const tx of response.transactions || []) {
        if (tx.type === 'mint') {
          const current = holders.get(tx.recipientWallet) || 0;
          holders.set(tx.recipientWallet, current + tx.amount);
        } else if (tx.type === 'transfer') {
          // Deduct from sender
          const fromBalance = holders.get(tx.fromWallet) || 0;
          holders.set(tx.fromWallet, fromBalance - tx.amount);
          
          // Add to recipient
          const toBalance = holders.get(tx.toWallet) || 0;
          holders.set(tx.toWallet, toBalance + tx.amount);
        }
      }
      
      // Convert to array and filter out zero balances
      const holdersList = Array.from(holders.entries())
        .filter(([_, balance]) => balance > 0)
        .map(([wallet, balance]) => ({ wallet, balance }))
        .sort((a, b) => b.balance - a.balance);
      
      return {
        success: true,
        assetId,
        holders: holdersList,
        totalHolders: holdersList.length
      };
    } catch (error) {
      console.error('[TokenService] Get token holders error:', error.message);
      throw new Error(`Failed to get token holders: ${error.message}`);
    }
  }
  
  /**
   * Get transaction history for a wallet
   * 
   * @param {string} walletId - Wallet address
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Transaction history
   */
  async getTransactionHistory(walletId, filters = {}) {
    try {
      console.log('[TokenService] Getting transaction history for wallet:', walletId);
      
      const response = await spydraClient.get(
        config.endpoints.listTransactions,
        {
          filter: {
            ...filters,
            walletId,
            sortBy: 'timestamp',
            sortOrder: 'desc'
          }
        }
      );
      
      return {
        success: true,
        walletId,
        transactions: response.transactions || [],
        total: response.total || 0
      };
    } catch (error) {
      console.error('[TokenService] Get transaction history error:', error.message);
      throw new Error(`Failed to get transaction history: ${error.message}`);
    }
  }
  
  /**
   * Get token supply information for an asset
   * 
   * @param {string} assetId - Asset identifier
   * @returns {Promise<Object>} Supply information
   */
  async getTokenSupply(assetId) {
    try {
      console.log('[TokenService] Getting token supply for asset:', assetId);
      
      // Get all mint and burn transactions
      const response = await spydraClient.get(
        config.endpoints.listTransactions,
        {
          filter: {
            assetId,
            type: ['mint', 'burn']
          }
        }
      );
      
      let totalMinted = 0;
      let totalBurned = 0;
      
      for (const tx of response.transactions || []) {
        if (tx.type === 'mint') {
          totalMinted += tx.amount;
        } else if (tx.type === 'burn') {
          totalBurned += tx.amount;
        }
      }
      
      const circulatingSupply = totalMinted - totalBurned;
      
      return {
        success: true,
        assetId,
        totalMinted,
        totalBurned,
        circulatingSupply
      };
    } catch (error) {
      console.error('[TokenService] Get token supply error:', error.message);
      throw new Error(`Failed to get token supply: ${error.message}`);
    }
  }
  
  /**
   * Record a token purchase (combines transfer and metadata)
   * 
   * @param {Object} purchaseData - Purchase information
   * @returns {Promise<Object>} Purchase result
   */
  async recordPurchase(purchaseData) {
    try {
      console.log('[TokenService] Recording purchase:', purchaseData);
      
      const transferResult = await this.transferTokens({
        assetId: purchaseData.assetId,
        fromWallet: purchaseData.sellerWallet,
        toWallet: purchaseData.buyerWallet,
        amount: purchaseData.amount,
        metadata: {
          purchasePrice: purchaseData.price,
          totalValue: purchaseData.price * purchaseData.amount,
          paymentMethod: purchaseData.paymentMethod,
          purchaseType: 'sale'
        }
      });
      
      return {
        ...transferResult,
        purchasePrice: purchaseData.price,
        totalValue: purchaseData.price * purchaseData.amount
      };
    } catch (error) {
      console.error('[TokenService] Record purchase error:', error.message);
      throw new Error(`Failed to record purchase: ${error.message}`);
    }
  }
}

// Export singleton instance
const tokenService = new TokenService();

module.exports = tokenService;
