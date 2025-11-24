/**
 * CoinMarketCap Market Integration
 * Pushes token data to CoinMarketCap API
 */

const axios = require('axios');
const config = require('../config');

class CoinMarketCapService {
  constructor() {
    this.baseUrl = config.markets.coinmarketcap.baseUrl;
    this.apiKey = config.markets.coinmarketcap.apiKey;

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-CMC_PRO_API_KEY': this.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Submit token listing to CoinMarketCap
   */
  async submitListing(tokenData) {
    try {
      if (!this.apiKey) {
        console.log('CoinMarketCap API key not configured');
        return { success: false, reason: 'not_configured' };
      }

      const payload = {
        name: tokenData.name || config.token.name,
        symbol: tokenData.symbol || config.token.symbol,
        slug: tokenData.slug || tokenData.symbol?.toLowerCase(),
        description: tokenData.description || '',
        logo: tokenData.logo || '',
        website: tokenData.website || '',
        technical_doc: tokenData.whitepaper || '',
        source_code: tokenData.sourceCode || '',
        tags: tokenData.tags || ['real-world-assets', 'tokenization'],
        platform: {
          name: 'Hyperledger Fabric',
          token_address: tokenData.tokenId,
        },
        date_launched: tokenData.launchDate || new Date().toISOString(),
      };

      const response = await this.client.post('/cryptocurrency/listings/latest', payload);
      
      console.log('CoinMarketCap listing submission successful');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('CoinMarketCap submission error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update token market data
   */
  async updateMarketData(tokenId, marketData) {
    try {
      if (!this.apiKey) {
        return { success: false, reason: 'not_configured' };
      }

      const response = await this.client.put(`/cryptocurrency/${tokenId}`, {
        circulating_supply: marketData.circulatingSupply,
        total_supply: marketData.totalSupply,
        max_supply: marketData.maxSupply,
        market_cap: marketData.marketCap,
        price: marketData.price,
        volume_24h: marketData.volume24h,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('CoinMarketCap update error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get token quote from CoinMarketCap
   */
  async getQuote(symbol) {
    try {
      const response = await this.client.get('/cryptocurrency/quotes/latest', {
        params: { symbol },
      });

      return response.data.data[symbol];
    } catch (error) {
      console.error('CoinMarketCap quote fetch error:', error.message);
      return null;
    }
  }
}

module.exports = new CoinMarketCapService();
