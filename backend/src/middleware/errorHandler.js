/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Default error status
  const status = err.status || err.statusCode || 500;
  
  // Extract error message
  let message = err.message || 'Internal server error';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.details || message,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  // Fabric-specific errors
  if (message.includes('fabric') || message.includes('chaincode')) {
    return res.status(500).json({
      success: false,
      error: 'Blockchain operation failed',
      details: message,
    });
  }

  // Generic error response
  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
