/**
 * Spydra Asset Service
 * 
 * Handles all asset-related operations through Spydra's REST API.
 * Assets represent real-world assets tokenized on the Fabric network.
 */

const spydraClient = require('./spydraClient');
const config = require('./config');

class AssetService {
  /**
   * Create a new asset on the blockchain
   * 
   * @param {Object} assetData - Asset information
   * @param {string} assetData.name - Asset name
   * @param {string} assetData.symbol - Asset symbol/ticker
   * @param {string} assetData.description - Asset description
   * @param {string} assetData.assetType - Type (e.g., 'real-estate', 'art', 'commodity')
   * @param {number} assetData.totalValue - Total asset value in USD
   * @param {number} assetData.totalSupply - Total token supply
   * @param {Object} assetData.metadata - Additional metadata
   * @param {string} creatorWallet - Wallet address of asset creator
   * 
   * @returns {Promise<Object>} Created asset with ID and transaction details
   */
  async createAsset(assetData, creatorWallet) {
    try {
      console.log('[AssetService] Creating asset:', assetData.name);
      
      const payload = {
        schemaId: config.assetSchemaId,
        creatorWallet,
        asset: {
          name: assetData.name,
          symbol: assetData.symbol,
          description: assetData.description,
          assetType: assetData.assetType,
          totalValue: assetData.totalValue,
          totalSupply: assetData.totalSupply,
          pricePerToken: assetData.totalValue / assetData.totalSupply,
          status: assetData.status || 'draft',
          metadata: {
            ...assetData.metadata,
            createdAt: new Date().toISOString(),
            creator: creatorWallet,
          }
        }
      };
      
      const response = await spydraClient.post(
        config.endpoints.createAsset,
        payload
      );
      
      // Wait for transaction confirmation
      if (response.transactionId) {
        await spydraClient.waitForTransaction(response.transactionId);
      }
      
      console.log('[AssetService] Asset created successfully:', response.assetId);
      
      return {
        success: true,
        assetId: response.assetId,
        transactionId: response.transactionId,
        asset: response.asset
      };
    } catch (error) {
      console.error('[AssetService] Create asset error:', error.message);
      throw new Error(`Failed to create asset: ${error.message}`);
    }
  }
  
  /**
   * Get asset by ID
   * 
   * @param {string} assetId - Asset identifier
   * @returns {Promise<Object>} Asset data from blockchain
   */
  async getAsset(assetId) {
    try {
      console.log('[AssetService] Fetching asset:', assetId);
      
      const response = await spydraClient.get(
        config.endpoints.getAsset,
        { assetId }
      );
      
      return {
        success: true,
        asset: response.asset
      };
    } catch (error) {
      console.error('[AssetService] Get asset error:', error.message);
      throw new Error(`Failed to get asset: ${error.message}`);
    }
  }
  
  /**
   * Update asset information
   * 
   * @param {string} assetId - Asset identifier
   * @param {Object} updates - Fields to update
   * @param {string} updaterWallet - Wallet address of updater
   * @returns {Promise<Object>} Updated asset
   */
  async updateAsset(assetId, updates, updaterWallet) {
    try {
      console.log('[AssetService] Updating asset:', assetId);
      
      const payload = {
        assetId,
        updaterWallet,
        updates: {
          ...updates,
          metadata: {
            ...updates.metadata,
            updatedAt: new Date().toISOString(),
            updatedBy: updaterWallet,
          }
        }
      };
      
      const response = await spydraClient.put(
        config.endpoints.updateAsset,
        payload,
        { assetId }
      );
      
      // Wait for transaction confirmation
      if (response.transactionId) {
        await spydraClient.waitForTransaction(response.transactionId);
      }
      
      console.log('[AssetService] Asset updated successfully');
      
      return {
        success: true,
        assetId,
        transactionId: response.transactionId,
        asset: response.asset
      };
    } catch (error) {
      console.error('[AssetService] Update asset error:', error.message);
      throw new Error(`Failed to update asset: ${error.message}`);
    }
  }
  
  /**
   * List all assets
   * 
   * @param {Object} filters - Optional filters
   * @param {string} filters.assetType - Filter by asset type
   * @param {string} filters.status - Filter by status
   * @param {number} filters.limit - Max results
   * @param {number} filters.offset - Pagination offset
   * @returns {Promise<Object>} List of assets
   */
  async listAssets(filters = {}) {
    try {
      console.log('[AssetService] Listing assets with filters:', filters);
      
      const response = await spydraClient.get(
        config.endpoints.listAssets,
        filters
      );
      
      return {
        success: true,
        assets: response.assets || [],
        total: response.total || 0,
        limit: filters.limit || 100,
        offset: filters.offset || 0
      };
    } catch (error) {
      console.error('[AssetService] List assets error:', error.message);
      throw new Error(`Failed to list assets: ${error.message}`);
    }
  }
  
  /**
   * Get asset history (all transactions for an asset)
   * 
   * @param {string} assetId - Asset identifier
   * @returns {Promise<Object>} Asset transaction history
   */
  async getAssetHistory(assetId) {
    try {
      console.log('[AssetService] Fetching asset history:', assetId);
      
      const response = await spydraClient.get(
        config.endpoints.listTransactions,
        {
          filter: {
            assetId,
            sortBy: 'timestamp',
            sortOrder: 'desc'
          }
        }
      );
      
      return {
        success: true,
        assetId,
        history: response.transactions || []
      };
    } catch (error) {
      console.error('[AssetService] Get asset history error:', error.message);
      throw new Error(`Failed to get asset history: ${error.message}`);
    }
  }
  
  /**
   * Publish asset (change status from draft to published)
   * 
   * @param {string} assetId - Asset identifier
   * @param {string} publisherWallet - Wallet address of publisher
   * @returns {Promise<Object>} Published asset
   */
  async publishAsset(assetId, publisherWallet) {
    try {
      console.log('[AssetService] Publishing asset:', assetId);
      
      return await this.updateAsset(
        assetId,
        {
          status: 'published',
          publishedAt: new Date().toISOString()
        },
        publisherWallet
      );
    } catch (error) {
      console.error('[AssetService] Publish asset error:', error.message);
      throw new Error(`Failed to publish asset: ${error.message}`);
    }
  }
  
  /**
   * Create offchain metadata for an asset
   * Useful for large files like images, documents, etc.
   * 
   * @param {string} assetId - Asset identifier
   * @param {Object} metadata - Offchain metadata
   * @returns {Promise<Object>} Metadata reference
   */
  async createOffchainMetadata(assetId, metadata) {
    try {
      console.log('[AssetService] Creating offchain metadata for:', assetId);
      
      const payload = {
        assetId,
        metadata,
        timestamp: new Date().toISOString()
      };
      
      const response = await spydraClient.post(
        config.endpoints.createMetadata,
        payload
      );
      
      console.log('[AssetService] Offchain metadata created:', response.metadataId);
      
      return {
        success: true,
        metadataId: response.metadataId,
        assetId
      };
    } catch (error) {
      console.error('[AssetService] Create metadata error:', error.message);
      throw new Error(`Failed to create offchain metadata: ${error.message}`);
    }
  }
  
  /**
   * Get offchain metadata
   * 
   * @param {string} metadataId - Metadata identifier
   * @returns {Promise<Object>} Metadata content
   */
  async getOffchainMetadata(metadataId) {
    try {
      console.log('[AssetService] Fetching offchain metadata:', metadataId);
      
      const response = await spydraClient.get(
        config.endpoints.getMetadata,
        { metadataId }
      );
      
      return {
        success: true,
        metadata: response.metadata
      };
    } catch (error) {
      console.error('[AssetService] Get metadata error:', error.message);
      throw new Error(`Failed to get offchain metadata: ${error.message}`);
    }
  }
}

// Export singleton instance
const assetService = new AssetService();

module.exports = assetService;
