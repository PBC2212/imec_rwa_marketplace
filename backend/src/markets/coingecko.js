/**
 * CoinGecko Market Integration
 * Pushes token data to CoinGecko API
 */

const axios = require('axios');
const config = require('../config');

class CoinGeckoService {
  constructor() {
    this.baseUrl = config.markets.coingecko.baseUrl;
    this.apiKey = config.markets.coingecko.apiKey;

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-Cg-Pro-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Submit token data to CoinGecko
   */
  async submitTokenData(tokenData) {
    try {
      if (!this.apiKey) {
        console.log('CoinGecko API key not configured');
        return { success: false, reason: 'not_configured' };
      }

      const payload = {
        id: tokenData.tokenId,
        symbol: tokenData.symbol || config.token.symbol,
        name: tokenData.name || config.token.name,
        asset_platform_id: 'hyperledger-fabric',
        contract_address: tokenData.tokenId,
        description: tokenData.description || '',
        homepage: tokenData.homepage || '',
        blockchain_site: tokenData.explorer || '',
        image: {
          thumb: tokenData.image?.thumb || '',
          small: tokenData.image?.small || '',
          large: tokenData.image?.large || '',
        },
        categories: tokenData.categories || ['Real World Assets'],
        market_data: {
          current_price: tokenData.currentPrice || 0,
          market_cap: tokenData.marketCap || 0,
          total_volume: tokenData.totalVolume || 0,
          circulating_supply: tokenData.circulatingSupply || 0,
          total_supply: tokenData.totalSupply || 0,
        },
      };

      const response = await this.client.post('/coins', payload);
      
      console.log('CoinGecko submission successful');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('CoinGecko submission error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update token price on CoinGecko
   */
  async updateTokenPrice(tokenId, priceData) {
    try {
      if (!this.apiKey) {
        return { success: false, reason: 'not_configured' };
      }

      const response = await this.client.put(`/coins/${tokenId}/market_data`, {
        current_price: priceData.currentPrice,
        market_cap: priceData.marketCap,
        total_volume: priceData.totalVolume,
        price_change_24h: priceData.priceChange24h || 0,
        price_change_percentage_24h: priceData.priceChangePercentage24h || 0,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('CoinGecko price update error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get token data from CoinGecko
   */
  async getTokenData(tokenId) {
    try {
      const response = await this.client.get(`/coins/${tokenId}`);
      return response.data;
    } catch (error) {
      console.error('CoinGecko fetch error:', error.message);
      return null;
    }
  }
}

module.exports = new CoinGeckoService();
