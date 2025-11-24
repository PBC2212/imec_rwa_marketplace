/**
 * Feed Generator Utility
 * Generates public feed.json from Fabric ledger data
 */

const fs = require('fs').promises;
const path = require('path');
const chaincode = require('../fabric/chaincode');
const config = require('../config');

class FeedGenerator {
  constructor() {
    this.feedPath = path.resolve(__dirname, '../../public/feed.json');
  }

  /**
   * Generate complete feed from Fabric ledger
   */
  async generateFeed() {
    try {
      console.log('Generating feed from Fabric ledger...');

      // Fetch data from Fabric
      const [assets, tokens] = await Promise.all([
        chaincode.getAllAssets(),
        chaincode.getAllTokens(),
      ]);

      // Filter published assets only
      const publishedAssets = assets.filter(asset => asset.status === 'published');

      // Calculate aggregated statistics
      const stats = {
        totalAssets: publishedAssets.length,
        totalTokens: tokens.length,
        totalMarketCap: tokens.reduce((sum, token) => {
          return sum + ((token.pricePerToken || 0) * (token.totalSupply || 0));
        }, 0),
        totalSupply: tokens.reduce((sum, token) => sum + (token.totalSupply || 0), 0),
        lastUpdated: new Date().toISOString(),
      };

      // Build feed object
      const feed = {
        version: '1.0',
        network: 'IMEC Token Network',
        platform: 'Hyperledger Fabric 2.5.0',
        stats,
        assets: publishedAssets.map(asset => this.formatAsset(asset)),
        tokens: tokens.map(token => this.formatToken(token)),
        generatedAt: new Date().toISOString(),
      };

      // Write to file
      await fs.writeFile(this.feedPath, JSON.stringify(feed, null, 2), 'utf8');
      
      console.log(`Feed generated successfully: ${this.feedPath}`);
      return feed;
    } catch (error) {
      console.error('Error generating feed:', error.message);
      throw error;
    }
  }

  /**
   * Format asset for feed
   */
  formatAsset(asset) {
    return {
      id: asset.id,
      name: asset.name,
      description: asset.description,
      type: asset.type,
      location: asset.location,
      value: asset.value,
      status: asset.status,
      images: asset.images || [],
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    };
  }

  /**
   * Format token for feed
   */
  formatToken(token) {
    return {
      tokenId: token.tokenId,
      assetId: token.assetId,
      symbol: token.symbol || config.token.symbol,
      name: token.name || config.token.name,
      totalSupply: token.totalSupply,
      circulatingSupply: token.circulatingSupply || token.totalSupply,
      pricePerToken: token.pricePerToken,
      marketCap: (token.pricePerToken || 0) * (token.circulatingSupply || token.totalSupply || 0),
      metadata: token.metadata || {},
    };
  }

  /**
   * Get current feed
   */
  async getFeed() {
    try {
      const data = await fs.readFile(this.feedPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log('Feed file not found, generating new feed...');
      return await this.generateFeed();
    }
  }
}

module.exports = new FeedGenerator();
