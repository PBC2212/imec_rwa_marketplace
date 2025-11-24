/**
 * Sync Script
 * Synchronizes Fabric ledger data with external services and generates feed
 */

require('dotenv').config();
const chaincode = require('../src/fabric/chaincode');
const spydraClient = require('../src/services/spydra/client');
const coingecko = require('../src/markets/coingecko');
const coinmarketcap = require('../src/markets/coinmarketcap');
const dexscreener = require('../src/markets/dexscreener');
const feedGenerator = require('../src/utils/feedGenerator');

class SyncService {
  constructor() {
    this.syncInterval = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Run complete sync process
   */
  async runSync() {
    console.log('\n' + '='.repeat(60));
    console.log('Starting sync process:', new Date().toISOString());
    console.log('='.repeat(60));

    try {
      // Step 1: Pull data from Fabric ledger
      console.log('\n[1/5] Pulling data from Hyperledger Fabric...');
      const fabricData = await this.pullFromFabric();
      console.log(`✓ Retrieved ${fabricData.assets.length} assets and ${fabricData.tokens.length} tokens`);

      // Step 2: Sync to Spydra
      console.log('\n[2/5] Syncing to Spydra...');
      await this.syncToSpydra(fabricData);
      console.log('✓ Spydra sync complete');

      // Step 3: Generate public feed
      console.log('\n[3/5] Generating public feed...');
      await feedGenerator.generateFeed();
      console.log('✓ Feed generated');

      // Step 4: Push to market integrations
      console.log('\n[4/5] Pushing to market integrations...');
      await this.pushToMarkets(fabricData);
      console.log('✓ Market integrations complete');

      // Step 5: Summary
      console.log('\n[5/5] Sync Summary:');
      console.log(`  - Assets synced: ${fabricData.assets.length}`);
      console.log(`  - Tokens synced: ${fabricData.tokens.length}`);
      console.log(`  - Total market cap: $${this.calculateTotalMarketCap(fabricData.tokens)}`);

      console.log('\n' + '='.repeat(60));
      console.log('Sync completed successfully');
      console.log('='.repeat(60) + '\n');

      return { success: true };
    } catch (error) {
      console.error('\n❌ Sync failed:', error.message);
      console.error(error.stack);
      return { success: false, error: error.message };
    }
  }

  /**
   * Pull all data from Fabric ledger
   */
  async pullFromFabric() {
    const [assets, tokens] = await Promise.all([
      chaincode.getAllAssets(),
      chaincode.getAllTokens(),
    ]);

    return { assets, tokens };
  }

  /**
   * Sync data to Spydra
   */
  async syncToSpydra(fabricData) {
    const results = {
      assets: { success: 0, failed: 0 },
      tokens: { success: 0, failed: 0 },
    };

    // Sync assets
    for (const asset of fabricData.assets) {
      try {
        await spydraClient.syncAssetFromFabric(asset);
        results.assets.success++;
      } catch (error) {
        console.error(`  Failed to sync asset ${asset.id}:`, error.message);
        results.assets.failed++;
      }
    }

    // Sync tokens
    for (const token of fabricData.tokens) {
      try {
        await spydraClient.syncTokenFromFabric(token);
        results.tokens.success++;
      } catch (error) {
        console.error(`  Failed to sync token ${token.tokenId}:`, error.message);
        results.tokens.failed++;
      }
    }

    console.log(`  Assets: ${results.assets.success} synced, ${results.assets.failed} failed`);
    console.log(`  Tokens: ${results.tokens.success} synced, ${results.tokens.failed} failed`);

    return results;
  }

  /**
   * Push data to market integrations
   */
  async pushToMarkets(fabricData) {
    const results = {
      coingecko: 0,
      coinmarketcap: 0,
      dexscreener: 0,
    };

    for (const token of fabricData.tokens) {
      // Prepare market data
      const marketData = {
        tokenId: token.tokenId,
        symbol: token.symbol,
        name: token.name,
        totalSupply: token.totalSupply,
        circulatingSupply: token.circulatingSupply || token.totalSupply,
        currentPrice: token.pricePerToken,
        marketCap: (token.pricePerToken || 0) * (token.circulatingSupply || token.totalSupply || 0),
        description: token.description || '',
      };

      // CoinGecko
      try {
        const cgResult = await coingecko.submitTokenData(marketData);
        if (cgResult.success) results.coingecko++;
      } catch (error) {
        console.error(`  CoinGecko error for ${token.tokenId}:`, error.message);
      }

      // CoinMarketCap
      try {
        const cmcResult = await coinmarketcap.submitListing(marketData);
        if (cmcResult.success) results.coinmarketcap++;
      } catch (error) {
        console.error(`  CoinMarketCap error for ${token.tokenId}:`, error.message);
      }

      // DexScreener
      try {
        const dsResult = await dexscreener.submitTokenMetadata(marketData);
        if (dsResult.success) results.dexscreener++;
      } catch (error) {
        console.error(`  DexScreener error for ${token.tokenId}:`, error.message);
      }
    }

    console.log(`  CoinGecko: ${results.coingecko} updated`);
    console.log(`  CoinMarketCap: ${results.coinmarketcap} updated`);
    console.log(`  DexScreener: ${results.dexscreener} updated`);

    return results;
  }

  /**
   * Calculate total market cap
   */
  calculateTotalMarketCap(tokens) {
    const total = tokens.reduce((sum, token) => {
      return sum + ((token.pricePerToken || 0) * (token.circulatingSupply || token.totalSupply || 0));
    }, 0);

    return total.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  /**
   * Start continuous sync with interval
   */
  startContinuousSync() {
    console.log(`Starting continuous sync (interval: ${this.syncInterval / 1000}s)`);

    // Run initial sync
    this.runSync();

    // Schedule recurring syncs
    setInterval(() => {
      this.runSync();
    }, this.syncInterval);
  }
}

// Run sync if executed directly
if (require.main === module) {
  const syncService = new SyncService();
  
  const mode = process.argv[2] || 'once';

  if (mode === 'continuous') {
    syncService.startContinuousSync();
  } else {
    syncService.runSync()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

module.exports = SyncService;
