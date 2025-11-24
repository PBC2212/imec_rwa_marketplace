/**
 * Express Server
 * Main application server for RWA Marketplace
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const investorRoutes = require('./routes/investor');
const spydraRoutes = require('./routes/spydra');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    network: 'IMEC Token Network',
    platform: 'Hyperledger Fabric 2.5.0',
  });
});

// API Routes
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/investor', investorRoutes);
app.use('/api/spydra', spydraRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.server.port;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 RWA Marketplace Backend Server');
  console.log('='.repeat(50));
  console.log(`Environment: ${config.server.nodeEnv}`);
  console.log(`Server running on port: ${PORT}`);
  console.log(`Network: IMEC Token Network`);
  console.log(`Platform: Hyperledger Fabric 2.5.0`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
