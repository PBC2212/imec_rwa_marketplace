/**
 * Authentication Middleware
 * Validates API keys for admin endpoints
 */

const config = require('../config');

/**
 * Middleware to authenticate admin API requests
 */
function authenticateAdmin(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required',
    });
  }

  if (apiKey !== config.auth.apiKey) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API key',
    });
  }

  next();
}

/**
 * Optional authentication middleware
 * Attaches user info if valid API key is provided
 */
function optionalAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  if (apiKey && apiKey === config.auth.apiKey) {
    req.isAuthenticated = true;
    req.userRole = 'admin';
  } else {
    req.isAuthenticated = false;
  }

  next();
}

module.exports = {
  authenticateAdmin,
  optionalAuth,
};
