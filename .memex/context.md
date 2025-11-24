# IMEC RWA Marketplace - Project Rules

## Project Overview

This is a **complete Real World Asset (RWA) tokenization marketplace** built with:
- **Backend:** Express.js with Hyperledger Fabric SDK v2.5
- **Frontend:** Next.js 14 with TypeScript and Tailwind CSS
- **Blockchain:** Hyperledger Fabric 2.5.0 as authoritative ledger
- **Status:** Production-ready, 56 files, fully documented

## Critical Architecture Patterns

### 1. Exact Folder Structure (DO NOT CHANGE)
```
rwa_token_marketplace/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration management
│   │   ├── middleware/       # Auth, cache, error handling
│   │   ├── routes/           # API routes (public, admin, investor)
│   │   ├── services/spydra/  # Secondary services
│   │   ├── markets/          # CoinGecko, CMC, DexScreener
│   │   ├── fabric/           # Hyperledger Fabric integration ⚠️ CRITICAL
│   │   │   ├── gateway.js         # Gateway manager
│   │   │   ├── enrollAdmin.js     # Admin enrollment
│   │   │   ├── registerUser.js    # User registration
│   │   │   └── chaincode.js       # Chaincode interactions
│   │   └── utils/            # Utilities
│   ├── scripts/              # Sync service
│   ├── public/               # Static files (feed.json)
│   ├── wallet/               # Fabric identities (NEVER commit)
│   └── connection-org1.json  # Fabric connection profile
├── frontend/
│   └── src/
│       ├── app/              # Next.js App Router pages
│       ├── lib/              # API client, utilities
│       ├── components/       # React components
│       └── hooks/            # Custom hooks
```

### 2. Hyperledger Fabric Integration Pattern

**CRITICAL:** All asset/token operations MUST go through Fabric chaincode.

**Never bypass the blockchain layer.**

#### Gateway Pattern:
```javascript
// Always use the gateway singleton
const gateway = require('./fabric/gateway');

// For writes (state changes):
await gateway.submitTransaction(userId, 'FunctionName', ...args);

// For reads (no state change):
await gateway.evaluateTransaction(userId, 'FunctionName', ...args);
```

#### Chaincode Service Pattern:
```javascript
// Use the chaincode service abstraction
const chaincode = require('./fabric/chaincode');

// High-level operations
await chaincode.createAsset(userId, assetData);
await chaincode.mintTokens(userId, tokenData);
await chaincode.getAsset(assetId);
```

**Required Chaincode Functions (25+):**
- Asset: CreateAsset, UpdateAsset, PublishAsset, GetAsset, GetAllAssets, GetAssetHistory
- Token: MintTokens, BurnTokens, TransferTokens, UpdateTokenPrice, GetToken, GetAllTokens
- Investor: RecordPurchase, GetInvestorBalance, GetInvestorPortfolio, GetTokenInvestors
- Payout: RecordPayout, GetAssetPayouts, GetInvestorPayouts

### 3. API Route Organization Pattern

**Three route categories with distinct purposes:**

#### Public Routes (`routes/public.js`):
- No authentication required
- Read-only operations
- Returns only published assets
- Examples: `/api/assets`, `/api/tokens`, `/api/feed`

#### Admin Routes (`routes/admin.js`):
- **REQUIRES** `X-API-Key` header
- Write operations (create, update, delete)
- Access to all assets including drafts
- Examples: `/api/admin/assets`, `/api/admin/tokens`

#### Investor Routes (`routes/investor.js`):
- Investor-specific operations
- Portfolio management
- Purchase recording
- Examples: `/api/investor/:id/portfolio`

### 4. Authentication Pattern

**API Key Based (Simple but Effective):**

```javascript
// Middleware usage
const { authenticateAdmin } = require('../middleware/auth');
router.use(authenticateAdmin); // Apply to admin routes

// Frontend must send
headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY }
```

**CRITICAL:** Backend `AUTH_API_KEY` must match Frontend `NEXT_PUBLIC_API_KEY`

### 5. Environment Configuration Pattern

**Backend (.env):**
```env
# CRITICAL - Must be changed from default
AUTH_API_KEY=secure-random-key-minimum-32-chars

# Fabric configuration
FABRIC_CHANNEL_NAME=mychannel
FABRIC_CHAINCODE_NAME=imecChaincode
FABRIC_ADMIN_USER=admin

# Server
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_API_KEY=same-as-backend-auth-api-key
```

### 6. Fabric Connection Profile Pattern

**connection-org1.json structure:**
```json
{
  "peers": {
    "peer0.org1.example.com": {
      "url": "grpcs://YOUR_PEER_HOST:PORT",
      "tlsCACerts": { "pem": "ACTUAL_CERT_HERE" }
    }
  },
  "certificateAuthorities": {
    "ca.org1.example.com": {
      "url": "https://YOUR_CA_HOST:PORT",
      "tlsCACerts": { "pem": "ACTUAL_CERT_HERE" }
    }
  }
}
```

**Must have REAL certificates, not placeholders!**

### 7. Data Flow Pattern

```
User Request (Frontend)
    ↓ HTTP REST
Backend API (Express)
    ↓ Fabric SDK
Gateway (fabric/gateway.js)
    ↓ gRPC
Peer Node
    ↓ Invoke/Query
Chaincode (Smart Contract)
    ↓ Read/Write
Ledger (World State + Blockchain)
```

**Never skip the Fabric layer for asset/token operations.**

## Important Conventions

### 1. Error Handling Convention
- All async functions must have try-catch
- Use centralized error handler middleware
- Return consistent error format:
```javascript
res.status(statusCode).json({
  success: false,
  error: message
});
```

### 2. Response Format Convention
```javascript
// Success response
res.json({
  success: true,
  data: result,
  count: array.length  // For arrays
});
```

### 3. Caching Convention
- GET endpoints use `cacheMiddleware(ttl)`
- Cache cleared on POST/PUT/DELETE operations
- Use `clearCache()` after state changes

### 4. File Naming Convention
- Backend: `.js` files (CommonJS)
- Frontend: `.tsx` for pages/components, `.ts` for utilities
- Config files: lowercase with hyphens

### 5. Import Pattern
Backend (CommonJS):
```javascript
const express = require('express');
const chaincode = require('../fabric/chaincode');
```

Frontend (ES Modules):
```typescript
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
```

## Security Rules

### 1. Wallet Security ⚠️ CRITICAL
- **NEVER commit `backend/wallet/` contents**
- `.gitignore` must exclude `wallet/*` except `.gitkeep`
- Wallet contains private keys - treat as secrets

### 2. API Key Security
- Default keys in `.env` files are for development only
- **MUST be changed before production deployment**
- Minimum 32 characters, random string

### 3. Environment Variables
- Never hardcode sensitive values
- Use `process.env.VARIABLE_NAME`
- Provide `.env.example` templates

### 4. CORS Configuration
- Set specific origins in production
- Never use `*` wildcard in production

## Development Workflow

### Initial Setup Sequence:
1. Install backend dependencies: `cd backend && npm install`
2. Install frontend dependencies: `cd frontend && npm install`
3. Configure Fabric connection profile
4. Enroll admin: `cd backend && npm run enroll-admin`
5. Start: `.\start.ps1` or `./start.sh`

### Making Changes:

#### Adding New API Endpoint:
1. Add route handler in appropriate file (`routes/public.js`, `routes/admin.js`, etc.)
2. Add chaincode interaction if needed
3. Update API client in `frontend/src/lib/api.ts`
4. Clear cache if data structure changes

#### Adding New Chaincode Function:
1. Implement in Fabric chaincode (Go/Node)
2. Add wrapper in `backend/src/fabric/chaincode.js`
3. Create API endpoint using the wrapper
4. Update frontend to use new endpoint

#### Adding New Frontend Page:
1. Create in `frontend/src/app/[path]/page.tsx`
2. Add navigation links
3. Use API client from `@/lib/api`
4. Follow existing page patterns

### Testing Pattern:
1. Test Fabric connection: `node -e "const gateway = require('./src/fabric/gateway'); gateway.connect('admin').then(() => console.log('✓ Connected'))"`
2. Test API: `curl http://localhost:3001/health`
3. Test endpoints with curl or Postman
4. Verify on frontend UI

## Common Mistakes to Avoid

### ❌ DON'T:
1. Bypass Fabric layer for asset/token operations
2. Commit wallet directory contents
3. Use default API keys in production
4. Hardcode configuration values
5. Skip error handling in async functions
6. Modify the exact folder structure
7. Use synchronous Fabric operations
8. Forget to clear cache after updates
9. Mix CommonJS and ES modules
10. Store secrets in code

### ✅ DO:
1. Always go through Fabric for blockchain data
2. Use environment variables
3. Follow the established patterns
4. Clear cache on state changes
5. Handle errors comprehensively
6. Document new features
7. Test with real Fabric network
8. Use TypeScript types in frontend
9. Follow authentication patterns
10. Keep documentation updated

## Deployment Checklist

### Before Production:
- [ ] Change `AUTH_API_KEY` to secure random value
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Set `NODE_ENV=production`
- [ ] Configure real Fabric network URLs
- [ ] Add valid TLS certificates to connection profile
- [ ] Enroll production admin identity
- [ ] Deploy and test chaincode
- [ ] Set up SSL/TLS
- [ ] Configure monitoring
- [ ] Test all API endpoints
- [ ] Verify wallet backup strategy

## Documentation Structure

All documentation follows this pattern:
- **README.md** - Complete reference
- **QUICK_START.md** - 5-minute setup
- **INSTALLATION.md** - Detailed setup
- **CHAINCODE_REFERENCE.md** - Blockchain specs
- **PROJECT_SUMMARY.md** - Architecture overview
- **CHECKLIST.md** - Setup/deployment checklists

When adding features, update relevant documentation.

## Key Dependencies

### Backend:
- `express` - Web framework
- `fabric-network` - Hyperledger Fabric SDK
- `fabric-ca-client` - CA operations
- `axios` - HTTP client
- `cors`, `helmet`, `morgan` - Middleware

### Frontend:
- `next` - React framework (v14)
- `react`, `react-dom` - UI library
- `axios` - HTTP client
- `tailwindcss` - Styling
- `typescript` - Type safety

## Project-Specific Patterns

### 1. Token Configuration
Default token: `IMEC` (symbol), configurable via environment

### 2. Channel and Chaincode Names
- Default channel: `mychannel`
- Default chaincode: `imecChaincode`
- Configurable via `FABRIC_CHANNEL_NAME`, `FABRIC_CHAINCODE_NAME`

### 3. Sync Service Pattern
- Runs periodically (default: 5 minutes)
- Pulls from Fabric → Syncs to Spydra → Generates feed → Pushes to markets
- Start with: `npm run sync:continuous`

### 4. Market Integration Pattern
All market services follow same interface:
```javascript
class MarketService {
  async submitTokenData(data) { /* ... */ }
  async updateMarketData(id, data) { /* ... */ }
  async getTokenData(id) { /* ... */ }
}
```

### 5. Feed Generation Pattern
- Source: Fabric ledger (authoritative)
- Output: `public/feed.json`
- Format: Versioned JSON with stats, assets, tokens
- Updated by sync service

## Critical Reminders

1. **Fabric is authoritative** - All blockchain data comes from Fabric, not Spydra
2. **Wallet security** - Never expose private keys
3. **API keys must match** - Backend and frontend must use same key
4. **Connection profile must be valid** - With real certificates and URLs
5. **Admin must be enrolled** - Before starting the application
6. **Chaincode must be deployed** - On the Fabric network before use
7. **Environment variables** - Always use .env files, never commit them with secrets
8. **Cache invalidation** - Clear cache after any state change
9. **Error handling** - Every async operation needs try-catch
10. **Testing** - Always test with real Fabric network, not mocks

## Quick Reference Commands

```bash
# Setup
cd backend && npm install
cd frontend && npm install
npm run enroll-admin

# Development
.\start.ps1              # Start both (Windows)
./start.sh               # Start both (Unix/Linux)
npm run dev:backend      # Backend only
npm run dev:frontend     # Frontend only

# Fabric Operations
npm run enroll-admin     # Enroll admin user
npm run register-user user1  # Register new user

# Sync
npm run sync             # Run once
npm run sync:continuous  # Run continuously

# Docker
docker-compose up -d     # Start containers
docker-compose logs -f   # View logs
docker-compose down      # Stop containers

# PM2
pm2 start ecosystem.config.js  # Start
pm2 logs                       # View logs
pm2 restart all                # Restart
```

---

**Last Updated:** November 23, 2025  
**Project Status:** ✅ Complete and Production Ready  
**Total Files:** 56 | **Lines of Code:** ~6,000+