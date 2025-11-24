/**
 * Cache Middleware
 * Simple in-memory caching for API responses
 */

const config = require('../config');

// In-memory cache store
const cache = new Map();

/**
 * Cache middleware factory
 * @param {number} duration - Cache duration in seconds (optional)
 */
function cacheMiddleware(duration) {
  const cacheDuration = (duration || config.cache.ttlSeconds) * 1000;

  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      const { data, timestamp } = cachedResponse;
      const age = Date.now() - timestamp;

      // Return cached response if still valid
      if (age < cacheDuration) {
        res.set('X-Cache', 'HIT');
        res.set('X-Cache-Age', Math.floor(age / 1000).toString());
        return res.json(data);
      }

      // Remove expired cache entry
      cache.delete(key);
    }

    // Store original send function
    const originalSend = res.json.bind(res);

    // Override send function to cache response
    res.json = function(data) {
      cache.set(key, {
        data,
        timestamp: Date.now(),
      });

      res.set('X-Cache', 'MISS');
      return originalSend(data);
    };

    next();
  };
}

/**
 * Clear cache for specific key or all keys
 * @param {string} key - Cache key to clear (optional)
 */
function clearCache(key) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Get cache statistics
 */
function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}

module.exports = {
  cacheMiddleware,
  clearCache,
  getCacheStats,
};
