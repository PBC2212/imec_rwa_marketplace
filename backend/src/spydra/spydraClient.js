/**
 * Spydra REST API Client
 * 
 * Provides a wrapper around Spydra's REST API for Hyperledger Fabric operations.
 * All blockchain interactions go through Spydra's managed infrastructure.
 * 
 * This client handles:
 * - Authentication
 * - Request/response formatting
 * - Error handling
 * - Retry logic
 * - Response parsing
 */

const axios = require('axios');
const config = require('./config');

class SpydraClient {
  constructor() {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: config.getHeaders(),
    });
    
    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (req) => {
        console.log(`[Spydra] ${req.method.toUpperCase()} ${req.url}`);
        return req;
      },
      (error) => {
        console.error('[Spydra] Request error:', error.message);
        return Promise.reject(error);
      }
    );
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[Spydra] Response ${response.status} from ${response.config.url}`);
        return response;
      },
      (error) => {
        return this.handleError(error);
      }
    );
  }
  
  /**
   * Handle API errors with detailed information
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`[Spydra] API Error ${status}:`, data);
      
      const errorMessage = data.message || data.error || 'Unknown error';
      const customError = new Error(`Spydra API Error (${status}): ${errorMessage}`);
      customError.status = status;
      customError.data = data;
      
      throw customError;
    } else if (error.request) {
      // Request made but no response
      console.error('[Spydra] No response received:', error.message);
      throw new Error('Spydra API: No response received. Network issue or service unavailable.');
    } else {
      // Request setup error
      console.error('[Spydra] Request setup error:', error.message);
      throw error;
    }
  }
  
  /**
   * Make a GET request
   */
  async get(endpoint, params = {}) {
    try {
      const url = this.config.buildUrl(endpoint, params);
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Make a POST request
   */
  async post(endpoint, data, params = {}) {
    try {
      const url = this.config.buildUrl(endpoint, params);
      const response = await this.client.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Make a PUT request
   */
  async put(endpoint, data, params = {}) {
    try {
      const url = this.config.buildUrl(endpoint, params);
      const response = await this.client.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Make a DELETE request
   */
  async delete(endpoint, params = {}) {
    try {
      const url = this.config.buildUrl(endpoint, params);
      const response = await this.client.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Retry a request with exponential backoff
   */
  async retryRequest(requestFn, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          const waitTime = delay * Math.pow(2, attempt - 1);
          console.log(`[Spydra] Retry attempt ${attempt}/${maxRetries} after ${waitTime}ms`);
          await this.sleep(waitTime);
        }
      }
    }
    
    throw lastError;
  }
  
  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(txId, maxAttempts = 10, interval = 2000) {
    console.log(`[Spydra] Waiting for transaction ${txId} to confirm...`);
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const tx = await this.get(this.config.endpoints.getTransaction, { txId });
        
        if (tx.status === 'CONFIRMED' || tx.status === 'COMMITTED') {
          console.log(`[Spydra] Transaction ${txId} confirmed`);
          return tx;
        }
        
        if (tx.status === 'FAILED') {
          throw new Error(`Transaction ${txId} failed: ${tx.error}`);
        }
        
        console.log(`[Spydra] Transaction ${txId} status: ${tx.status} (attempt ${attempt}/${maxAttempts})`);
        
        if (attempt < maxAttempts) {
          await this.sleep(interval);
        }
      } catch (error) {
        if (attempt === maxAttempts) {
          throw new Error(`Transaction ${txId} confirmation timeout: ${error.message}`);
        }
        await this.sleep(interval);
      }
    }
    
    throw new Error(`Transaction ${txId} confirmation timeout after ${maxAttempts} attempts`);
  }
  
  /**
   * Health check
   */
  async healthCheck() {
    try {
      // Try to list assets as a health check
      await this.get(this.config.endpoints.listAssets);
      return { healthy: true, message: 'Spydra API is reachable' };
    } catch (error) {
      return {
        healthy: false,
        message: error.message,
        error: error.data || error
      };
    }
  }
}

// Export singleton instance
const spydraClient = new SpydraClient();

module.exports = spydraClient;
