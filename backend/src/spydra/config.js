/**
 * Spydra Configuration
 * 
 * Spydra abstracts Hyperledger Fabric components and provides REST API access.
 * All blockchain operations go through Spydra's API layer.
 * 
 * Required Environment Variables:
 * - SPYDRA_API_KEY: Your Spydra API authentication key
 * - SPYDRA_PROJECT_ID: Spydra project identifier
 * - SPYDRA_NETWORK_ID: Fabric network identifier
 * - SPYDRA_APP_ID: Application identifier
 * - SPYDRA_ASSET_SCHEMA_ID: Schema for asset tokens
 */

require('dotenv').config();

const config = {
  // Spydra API Configuration
  apiKey: process.env.SPYDRA_API_KEY,
  projectId: process.env.SPYDRA_PROJECT_ID,
  networkId: process.env.SPYDRA_NETWORK_ID,
  appId: process.env.SPYDRA_APP_ID,
  assetSchemaId: process.env.SPYDRA_ASSET_SCHEMA_ID,
  
  // Base URLs
  baseUrl: 'https://api.spydra.io/v2',
  
  // API Endpoints
  endpoints: {
    // Asset operations
    createAsset: '/projects/{projectId}/networks/{networkId}/apps/{appId}/assets',
    getAsset: '/projects/{projectId}/networks/{networkId}/apps/{appId}/assets/{assetId}',
    updateAsset: '/projects/{projectId}/networks/{networkId}/apps/{appId}/assets/{assetId}',
    listAssets: '/projects/{projectId}/networks/{networkId}/apps/{appId}/assets',
    
    // Token operations
    mintTokens: '/projects/{projectId}/networks/{networkId}/apps/{appId}/tokens/mint',
    burnTokens: '/projects/{projectId}/networks/{networkId}/apps/{appId}/tokens/burn',
    transferTokens: '/projects/{projectId}/networks/{networkId}/apps/{appId}/tokens/transfer',
    
    // Query operations
    getBalance: '/projects/{projectId}/networks/{networkId}/apps/{appId}/balances/{walletId}',
    getTransaction: '/projects/{projectId}/networks/{networkId}/transactions/{txId}',
    listTransactions: '/projects/{projectId}/networks/{networkId}/transactions',
    
    // Offchain metadata
    createMetadata: '/projects/{projectId}/networks/{networkId}/apps/{appId}/metadata',
    getMetadata: '/projects/{projectId}/networks/{networkId}/apps/{appId}/metadata/{metadataId}',
  },
  
  // Request configuration
  timeout: 30000, // 30 seconds
  retries: 3,
  
  // Headers
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
    };
  },
  
  // Build URL helper
  buildUrl(endpoint, params = {}) {
    let url = `${this.baseUrl}${endpoint}`;
    
    // Replace path parameters
    url = url
      .replace('{projectId}', params.projectId || this.projectId)
      .replace('{networkId}', params.networkId || this.networkId)
      .replace('{appId}', params.appId || this.appId)
      .replace('{assetId}', params.assetId || '')
      .replace('{walletId}', params.walletId || '')
      .replace('{txId}', params.txId || '')
      .replace('{metadataId}', params.metadataId || '');
    
    return url;
  },
  
  // Validate configuration
  validate() {
    const required = [
      'apiKey',
      'projectId',
      'networkId',
      'appId',
      'assetSchemaId'
    ];
    
    const missing = required.filter(key => !this[key]);
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required Spydra configuration: ${missing.join(', ')}\n` +
        'Please set the following environment variables:\n' +
        missing.map(key => `- SPYDRA_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`).join('\n')
      );
    }
    
    return true;
  }
};

// Validate on load
try {
  config.validate();
  console.log('✓ Spydra configuration loaded successfully');
} catch (error) {
  console.warn('⚠ Spydra configuration incomplete:', error.message);
}

module.exports = config;
