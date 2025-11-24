/**
 * Spydra API Client
 * Secondary integration for metadata and external indexing
 */

const axios = require('axios');
const config = require('../../config');

class SpydraClient {
  constructor() {
    this.baseUrl = config.spydra.baseUrl;
    this.storeId = config.spydra.storeId;
    this.apiKey = config.spydra.apiKey;

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create asset metadata in Spydra
   */
  async createAssetMetadata(assetData) {
    try {
      if (!this.apiKey || !this.storeId) {
        console.log('Spydra not configured, skipping metadata creation');
        return null;
      }

      const response = await this.client.post(`/stores/${this.storeId}/assets`, {
        id: assetData.id,
        name: assetData.name,
        description: assetData.description,
        metadata: assetData,
      });

      return response.data;
    } catch (error) {
      console.error('Spydra createAssetMetadata error:', error.message);
      return null;
    }
  }

  /**
   * Update asset metadata in Spydra
   */
  async updateAssetMetadata(assetId, updates) {
    try {
      if (!this.apiKey || !this.storeId) {
        console.log('Spydra not configured, skipping metadata update');
        return null;
      }

      const response = await this.client.put(
        `/stores/${this.storeId}/assets/${assetId}`,
        updates
      );

      return response.data;
    } catch (error) {
      console.error('Spydra updateAssetMetadata error:', error.message);
      return null;
    }
  }

  /**
   * Get asset metadata from Spydra
   */
  async getAssetMetadata(assetId) {
    try {
      if (!this.apiKey || !this.storeId) {
        return null;
      }

      const response = await this.client.get(
        `/stores/${this.storeId}/assets/${assetId}`
      );

      return response.data;
    } catch (error) {
      console.error('Spydra getAssetMetadata error:', error.message);
      return null;
    }
  }

  /**
   * List all assets from Spydra
   */
  async listAssets() {
    try {
      if (!this.apiKey || !this.storeId) {
        return [];
      }

      const response = await this.client.get(`/stores/${this.storeId}/assets`);
      return response.data.assets || [];
    } catch (error) {
      console.error('Spydra listAssets error:', error.message);
      return [];
    }
  }

  /**
   * Create token metadata
   */
  async createTokenMetadata(tokenData) {
    try {
      if (!this.apiKey || !this.storeId) {
        console.log('Spydra not configured, skipping token metadata creation');
        return null;
      }

      const response = await this.client.post(`/stores/${this.storeId}/tokens`, {
        id: tokenData.tokenId,
        symbol: tokenData.symbol,
        name: tokenData.name,
        totalSupply: tokenData.totalSupply,
        metadata: tokenData,
      });

      return response.data;
    } catch (error) {
      console.error('Spydra createTokenMetadata error:', error.message);
      return null;
    }
  }

  /**
   * Update token metadata
   */
  async updateTokenMetadata(tokenId, updates) {
    try {
      if (!this.apiKey || !this.storeId) {
        return null;
      }

      const response = await this.client.put(
        `/stores/${this.storeId}/tokens/${tokenId}`,
        updates
      );

      return response.data;
    } catch (error) {
      console.error('Spydra updateTokenMetadata error:', error.message);
      return null;
    }
  }

  /**
   * Sync asset data to Spydra (from Fabric)
   */
  async syncAssetFromFabric(fabricAsset) {
    try {
      // Check if asset exists
      const existing = await this.getAssetMetadata(fabricAsset.id);

      if (existing) {
        return await this.updateAssetMetadata(fabricAsset.id, fabricAsset);
      } else {
        return await this.createAssetMetadata(fabricAsset);
      }
    } catch (error) {
      console.error('Spydra syncAssetFromFabric error:', error.message);
      return null;
    }
  }

  /**
   * Sync token data to Spydra (from Fabric)
   */
  async syncTokenFromFabric(fabricToken) {
    try {
      const existing = await this.client.get(
        `/stores/${this.storeId}/tokens/${fabricToken.tokenId}`
      ).catch(() => null);

      if (existing) {
        return await this.updateTokenMetadata(fabricToken.tokenId, fabricToken);
      } else {
        return await this.createTokenMetadata(fabricToken);
      }
    } catch (error) {
      console.error('Spydra syncTokenFromFabric error:', error.message);
      return null;
    }
  }
}

module.exports = new SpydraClient();
