/**
 * DexScreener Market Integration
 * Pushes token data to DexScreener API
 */

const axios = require('axios');
const config = require('../config');

class DexScreenerService {
  constructor() {
    this.baseUrl = config.markets.dexscreener.baseUrl;
    this.apiKey = config.markets.dexscreener.apiKey;

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Submit token metadata to DexScreener
   */
  async submitTokenMetadata(tokenData) {
    try {
      if (!this.apiKey) {
        console.log('DexScreener API key not configured');
        return { success: false, reason: 'not_configured' };
      }

      const payload = {
        chainId: 'hyperledger-fabric',
        tokenAddress: tokenData.tokenId,
        info: {
          name: tokenData.name || config.token.name,
          symbol: tokenData.symbol || config.token.symbol,
          description: tokenData.description || '',
          imageUrl: tokenData.imageUrl || '',
          websites: tokenData.websites || [],
          socials: tokenData.socials || [],
        },
      };

      const response = await this.client.post('/dex/tokens/info', payload);
      
      console.log('DexScreener metadata submission successful');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('DexScreener submission error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update token liquidity data
   */
  async updateLiquidityData(tokenId, liquidityData) {
    try {
      if (!this.apiKey) {
        return { success: false, reason: 'not_configured' };
      }

      const response = await this.client.put(`/dex/tokens/${tokenId}/liquidity`, {
        liquidityUsd: liquidityData.liquidityUsd,
        priceUsd: liquidityData.priceUsd,
        volume24h: liquidityData.volume24h,
        priceChange24h: liquidityData.priceChange24h,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('DexScreener liquidity update error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get token data from DexScreener
   */
  async getTokenData(tokenAddress) {
    try {
      const response = await this.client.get(`/dex/tokens/${tokenAddress}`);
      return response.data;
    } catch (error) {
      console.error('DexScreener fetch error:', error.message);
      return null;
    }
  }
}

module.exports = new DexScreenerService();
