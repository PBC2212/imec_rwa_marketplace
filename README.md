# IMEC RWA Marketplace

Complete Real World Asset (RWA) tokenization marketplace platform with Hyperledger Fabric 2.5.0 integration.

## 🏗 Architecture

```
rwa_token_marketplace/
├── backend/                 # Express.js backend with Fabric SDK
│   ├── src/
│   │   ├── config/         # Configuration management
│   │   ├── middleware/     # Express middleware (auth, cache, error handling)
│   │   ├── routes/         # API routes (public, admin, investor)
│   │   ├── services/       # External services (Spydra)
│   │   ├── markets/        # Market integrations (CoinGecko, CMC, DexScreener)
│   │   ├── fabric/         # Hyperledger Fabric integration layer
│   │   │   ├── gateway.js      # Gateway connection manager
│   │   │   ├── enrollAdmin.js  # Admin enrollment
│   │   │   ├── registerUser.js # User registration
│   │   │   └── chaincode.js    # Chaincode interaction functions
│   │   └── utils/          # Utilities (feed generator)
│   ├── scripts/
│   │   └── sync.js         # Sync script for ledger data
│   ├── public/             # Public static files (feed.json)
│   ├── wallet/             # Fabric wallet storage
│   └── connection-org1.json # Fabric connection profile
├── frontend/               # Next.js 14 frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # API client and utilities
│   │   └── hooks/         # Custom React hooks
│   └── ...
├── docker-compose.yml     # Docker orchestration
├── Dockerfile.backend     # Backend container
├── Dockerfile.frontend    # Frontend container
├── ecosystem.config.js    # PM2 configuration
└── README.md
```

## 🔑 Key Features

### Backend

- **Hyperledger Fabric Integration**
  - Gateway API for ledger interactions
  - Wallet-based identity management
  - Chaincode operations for all asset/token functions
  - Transaction submission and evaluation

- **RESTful API**
  - Public API for asset/token data
  - Admin API for asset management
  - Investor API for portfolio and purchases
  - Comprehensive error handling and validation

- **Market Integration**
  - CoinGecko API integration
  - CoinMarketCap listing support
  - DexScreener metadata sync

- **Caching & Performance**
  - In-memory caching layer
  - Configurable TTL
  - Cache invalidation on updates

- **Sync Service**
  - Periodic Fabric ledger sync
  - External market data push
  - Public feed generation

### Frontend

- **Investor Portal**
  - Browse tokenized assets
  - Purchase tokens
  - View portfolio and balances
  - Transaction history

- **Admin Dashboard**
  - Create and manage assets
  - Mint tokens
  - Update token prices
  - Record payouts
  - View on-chain history

- **Modern UI/UX**
  - Next.js 14 with App Router
  - Tailwind CSS styling
  - Responsive design
  - Real-time data updates

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Hyperledger Fabric 2.5.0 network running
- Docker (for containerized deployment)

### 1. Clone and Setup

```bash
cd imec_rwa_marketplace
```

### 2. Configure Hyperledger Fabric Connection

Edit `backend/connection-org1.json` with your Fabric network details:

```json
{
  "name": "imec-token-network",
  "version": "1.0.0",
  "client": {
    "organization": "Org1",
    ...
  },
  "peers": {
    "peer0.org1.example.com": {
      "url": "grpcs://localhost:7051",
      ...
    }
  },
  "certificateAuthorities": {
    "ca.org1.example.com": {
      "url": "https://localhost:7054",
      ...
    }
  }
}
```

### 3. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Especially:
# - AUTH_API_KEY (generate a secure key)
# - FABRIC_* variables
# - Market API keys (optional)

# Install dependencies
npm install

# Enroll admin user
npm run enroll-admin

# Register additional users if needed
npm run register-user user1 client

# Start backend server
npm run dev
```

Backend will be available at `http://localhost:3001`

### 4. Frontend Setup

```bash
cd frontend

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
# NEXT_PUBLIC_API_KEY=<same-as-backend-AUTH_API_KEY>

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 5. Run Sync Script

In a separate terminal:

```bash
cd backend
npm run sync:continuous
```

## 🐳 Docker Deployment

### Build and Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variables

Ensure you have:
- `backend/.env` configured
- `frontend/.env.local` configured
- Fabric network accessible from Docker containers

## 🔧 Configuration

### Backend Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
AUTH_API_KEY=your-secret-key

# Spydra (Optional)
SPYDRA_BASE_URL=https://api.spydra.app
SPYDRA_STORE_ID=your-store-id
SPYDRA_API_KEY=your-api-key

# Token
TOKEN_SYMBOL=IMEC
TOKEN_NAME=IMEC Token
TOKEN_DECIMALS=18

# Cache
CACHE_TTL_SECONDS=300

# Market APIs (Optional)
COINGECKO_API_KEY=your-key
COINMARKETCAP_API_KEY=your-key
DEXSCREENER_API_KEY=your-key

# Fabric
FABRIC_CHANNEL_NAME=mychannel
FABRIC_CHAINCODE_NAME=imecChaincode
FABRIC_ADMIN_USER=admin
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_API_KEY=your-secret-key
```

## 📡 API Endpoints

### Public API

```
GET  /api/feed                    # Get public feed
GET  /api/assets                  # Get all published assets
GET  /api/asset/:id               # Get specific asset
GET  /api/tokens                  # Get all tokens
GET  /api/token/:id               # Get specific token
GET  /api/token/:id/investors     # Get token investors
GET  /api/prices                  # Get token prices
GET  /api/stats                   # Get platform statistics
```

### Admin API (Requires AUTH_API_KEY)

```
POST /api/admin/assets            # Create asset
PUT  /api/admin/assets/:id        # Update asset
POST /api/admin/assets/:id/publish # Publish asset
GET  /api/admin/assets            # Get all assets (including drafts)
GET  /api/admin/asset/:id/history # Get asset history

POST /api/admin/tokens            # Mint tokens
POST /api/admin/tokens/:id/price  # Update token price
POST /api/admin/payouts           # Record payout
DEL  /api/admin/tokens/:id        # Burn tokens

POST /api/admin/purchases         # Record purchase
```

### Investor API

```
GET  /api/investor/:id/portfolio       # Get investor portfolio
GET  /api/investor/:id/balance/:tokenId # Get token balance
GET  /api/investor/:id/payouts        # Get payout history
POST /api/investor/:id/purchase       # Record purchase
```

## 🔐 Hyperledger Fabric Integration

### Chaincode Functions

The backend interacts with the following chaincode functions:

**Asset Management:**
- `CreateAsset` - Create new asset on ledger
- `UpdateAsset` - Update asset metadata
- `PublishAsset` - Mark asset as published
- `GetAsset` - Retrieve asset by ID
- `GetAllAssets` - Query all assets
- `GetAssetHistory` - Get asset transaction history

**Token Management:**
- `MintTokens` - Create new token supply
- `BurnTokens` - Reduce token supply
- `TransferTokens` - Transfer tokens between users
- `UpdateTokenPrice` - Update token pricing
- `GetToken` - Retrieve token details
- `GetAllTokens` - Query all tokens

**Investor Operations:**
- `RecordPurchase` - Record token purchase
- `GetInvestorBalance` - Get investor token balance
- `GetInvestorPortfolio` - Get complete portfolio
- `GetAssetInvestors` - List asset investors
- `GetTokenInvestors` - List token holders

**Payout Operations:**
- `RecordPayout` - Record dividend distribution
- `GetAssetPayouts` - Get asset payout history
- `GetInvestorPayouts` - Get investor payout history

### Wallet Management

Users are stored in the filesystem wallet at `backend/wallet/`:

```bash
# Enroll admin
npm run enroll-admin

# Register new user
npm run register-user investor1 client

# Register admin user
npm run register-user admin1 admin
```

## 📊 Sync Service

The sync script performs:

1. **Pull from Fabric** - Retrieves all assets and tokens from ledger
2. **Sync to Spydra** - Updates secondary metadata store
3. **Generate Feed** - Creates public `feed.json` file
4. **Push to Markets** - Updates CoinGecko, CMC, DexScreener

Run sync:

```bash
# One-time sync
npm run sync

# Continuous sync (every 5 minutes)
npm run sync:continuous
```

## 🎨 Frontend Routes

- `/` - Home page with asset listings
- `/invest` - Investor portal for token purchases
- `/portfolio` - Investor portfolio view
- `/asset/[id]` - Asset detail page
- `/admin` - Admin dashboard
- `/admin/assets` - Asset management
- `/admin/assets/[id]` - Edit specific asset
- `/admin/tokens` - Token management

## 🛠 Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development

```bash
cd frontend
npm run dev  # Next.js dev server with hot reload
```

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Production Deployment

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start with ecosystem config
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# View logs
pm2 logs

# Restart
pm2 restart all

# Stop
pm2 stop all
```

### Using Docker

See Docker Deployment section above.

## 🔍 Troubleshooting

### Fabric Connection Issues

1. Verify Fabric network is running
2. Check `connection-org1.json` has correct URLs and certificates
3. Ensure wallet contains enrolled identities
4. Check firewall rules for peer/CA ports

### API Key Issues

1. Ensure `.env` and `.env.local` have matching `AUTH_API_KEY`
2. Check API key is being sent in headers as `X-API-Key`

### Cache Issues

Clear backend cache by restarting the server.

### Port Conflicts

Change ports in:
- `backend/.env` (PORT)
- `frontend/.env.local` (NEXT_PUBLIC_API_URL)
- `docker-compose.yml` (port mappings)

## 📝 License

MIT License

## 👥 Support

For issues and questions:
- Check logs: `backend/logs/` and `docker-compose logs`
- Review Fabric peer/orderer logs
- Verify chaincode is deployed and instantiated

## 🎯 Next Steps

1. **Deploy Chaincode** - Ensure your Fabric chaincode is deployed with all required functions
2. **Configure Markets** - Add API keys for market integrations
3. **Customize UI** - Modify frontend components in `frontend/src/components/`
4. **Add Features** - Extend chaincode and API as needed
5. **Set Up Monitoring** - Use PM2, Prometheus, or other monitoring tools

---

Built with ❤️ using Hyperledger Fabric 2.5.0, Express.js, and Next.js 14
