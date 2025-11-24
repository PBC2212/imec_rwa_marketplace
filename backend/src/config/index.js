/**
 * Configuration Module
 * Centralized configuration management for the backend
 */

require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  // Authentication
  auth: {
    apiKey: process.env.AUTH_API_KEY || 'your-secret-api-key',
  },

  // Spydra API Configuration
  spydra: {
    baseUrl: process.env.SPYDRA_BASE_URL || 'https://api.spydra.app',
    storeId: process.env.SPYDRA_STORE_ID || '',
    apiKey: process.env.SPYDRA_API_KEY || '',
  },

  // Token Configuration
  token: {
    symbol: process.env.TOKEN_SYMBOL || 'IMEC',
    name: process.env.TOKEN_NAME || 'IMEC Token',
    decimals: parseInt(process.env.TOKEN_DECIMALS) || 18,
  },

  // Cache Configuration
  cache: {
    ttlSeconds: parseInt(process.env.CACHE_TTL_SECONDS) || 300,
  },

  // Market Integration APIs
  markets: {
    coingecko: {
      apiKey: process.env.COINGECKO_API_KEY || '',
      baseUrl: process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3',
    },
    coinmarketcap: {
      apiKey: process.env.COINMARKETCAP_API_KEY || '',
      baseUrl: process.env.COINMARKETCAP_BASE_URL || 'https://pro-api.coinmarketcap.com/v1',
    },
    dexscreener: {
      apiKey: process.env.DEXSCREENER_API_KEY || '',
      baseUrl: process.env.DEXSCREENER_BASE_URL || 'https://api.dexscreener.com/latest',
    },
  },

  // Hyperledger Fabric Configuration
  fabric: {
    channelName: process.env.FABRIC_CHANNEL_NAME || 'mychannel',
    chaincodeName: process.env.FABRIC_CHAINCODE_NAME || 'imecChaincode',
    connectionProfile: process.env.FABRIC_CONNECTION_PROFILE || 'connection-org1.json',
    walletPath: process.env.FABRIC_WALLET_PATH || './wallet',
    adminUser: process.env.FABRIC_ADMIN_USER || 'admin',
  },

  // Database Configuration (for caching/metadata)
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/imec_marketplace',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // File Storage
  storage: {
    publicPath: process.env.PUBLIC_PATH || './public',
    feedPath: process.env.FEED_PATH || './public/feed.json',
  },
};

module.exports = config;
