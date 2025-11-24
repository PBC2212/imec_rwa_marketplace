# Spydra Integration Architecture

## Complete architectural documentation for Spydra-based Hyperledger Fabric integration

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Component Diagrams](#component-diagrams)
3. [Data Flow](#data-flow)
4. [Sequence Diagrams](#sequence-diagrams)
5. [Deployment Architecture](#deployment-architecture)
6. [Security Architecture](#security-architecture)
7. [Scalability Considerations](#scalability-considerations)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Web     │  │  Mobile  │  │  Admin   │  │  Partner │      │
│  │  Browser │  │   App    │  │  Portal  │  │   API    │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │             │              │              │             │
└───────┼─────────────┼──────────────┼──────────────┼─────────────┘
        │             │              │              │
        └─────────────┴──────────────┴──────────────┘
                      │
                      │ HTTPS (REST API)
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                           │
│                    (Express.js Backend)                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    API Gateway                            │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │ │
│  │  │   Public   │  │   Admin    │  │   Spydra   │        │ │
│  │  │   Routes   │  │   Routes   │  │   Routes   │        │ │
│  │  └────────────┘  └────────────┘  └────────────┘        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            │                                   │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   Service Layer                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │   Spydra     │  │    Asset     │  │    Token     │  │ │
│  │  │   Client     │  │   Service    │  │   Service    │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            │                                   │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                  Middleware Layer                        │ │
│  │  • Authentication    • Rate Limiting                     │ │
│  │  • Caching          • Error Handling                     │ │
│  │  • Logging          • Validation                         │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────┼───────────────────────────────────┘
                             │
                             │ HTTPS (REST API)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SPYDRA API LAYER                           │
│                   https://api.spydra.io/v2                      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   API Endpoints                          │ │
│  │  • /projects/{projectId}/networks/{networkId}/...       │ │
│  │  • Asset Management APIs                                │ │
│  │  • Token Operations APIs                                │ │
│  │  • Query and Transaction APIs                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            │                                   │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │             Spydra Managed Infrastructure                │ │
│  │  • API Gateway        • Identity Management             │ │
│  │  • Transaction Pool   • State Management                │ │
│  │  • Query Engine       • Event Handlers                  │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────┼───────────────────────────────────┘
                             │
                             │ gRPC / Internal Protocol
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 HYPERLEDGER FABRIC NETWORK                      │
│                    (Managed by Spydra)                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   Network Components                     │ │
│  │                                                          │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐       │ │
│  │  │   Peer 0   │  │   Peer 1   │  │   Peer N   │       │ │
│  │  │  Org1MSP   │  │  Org1MSP   │  │  Org1MSP   │       │ │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘       │ │
│  │        │                │                │               │ │
│  │        └────────────────┴────────────────┘               │ │
│  │                        │                                 │ │
│  │                 ┌──────▼──────┐                          │ │
│  │                 │   Orderer   │                          │ │
│  │                 │   Service   │                          │ │
│  │                 │   (Raft)    │                          │ │
│  │                 └──────┬──────┘                          │ │
│  │                        │                                 │ │
│  │                 ┌──────▼──────┐                          │ │
│  │                 │  Chaincode  │                          │ │
│  │                 │   (Smart    │                          │ │
│  │                 │  Contract)  │                          │ │
│  │                 └──────┬──────┘                          │ │
│  │                        │                                 │ │
│  │        ┌───────────────┼───────────────┐                │ │
│  │        │               │               │                │ │
│  │  ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐          │ │
│  │  │   World   │  │Blockchain │  │  Private  │          │ │
│  │  │   State   │  │  (Blocks) │  │   Data    │          │ │
│  │  │ (LevelDB) │  │           │  │Collection │          │ │
│  │  └───────────┘  └───────────┘  └───────────┘          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                Certificate Authority                     │ │
│  │  • Identity Management    • X.509 Certificates          │ │
│  │  • Enrollment Services    • Revocation Lists            │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Diagrams

### Backend Component Structure

```
backend/
│
├── src/
│   │
│   ├── config/                     # Configuration Management
│   │   └── index.js                # App configuration
│   │
│   ├── spydra/                     # ⭐ Spydra Integration Layer
│   │   ├── config.js               # Spydra configuration
│   │   ├── spydraClient.js         # HTTP client wrapper
│   │   ├── assetService.js         # Asset operations
│   │   └── tokenService.js         # Token operations
│   │
│   ├── routes/                     # API Routes
│   │   ├── public.js               # Public endpoints
│   │   ├── admin.js                # Admin endpoints
│   │   ├── investor.js             # Investor endpoints
│   │   └── spydra.js               # ⭐ Spydra endpoints
│   │
│   ├── middleware/                 # Middleware
│   │   ├── auth.js                 # Authentication
│   │   ├── cache.js                # Response caching
│   │   └── errorHandler.js         # Error handling
│   │
│   ├── utils/                      # Utilities
│   │   └── helpers.js              # Helper functions
│   │
│   └── server.js                   # Express server
│
├── .env                            # Environment variables
└── package.json                    # Dependencies
```

### Service Dependencies

```
┌─────────────────────────────────────────────────────┐
│                   Express Server                    │
│                    (server.js)                      │
└───────────────────┬─────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐     ┌────────▼──────────┐
│  Fabric SDK    │     │  Spydra Services  │
│  Integration   │     │   (Alternative)   │
│  (Original)    │     │                   │
└────────────────┘     └────────┬──────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
            ┌───────▼──────┐ ┌─▼─────┐ ┌──▼──────┐
            │ spydraClient │ │ Asset │ │  Token  │
            │              │ │Service│ │ Service │
            └──────────────┘ └───────┘ └─────────┘
                    │
                    ▼
          ┌─────────────────┐
          │   Spydra API    │
          │ (REST Endpoint) │
          └─────────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │ Hyperledger     │
          │ Fabric Network  │
          └─────────────────┘
```

---

## Data Flow

### Asset Creation Flow

```
1. Admin Interface
   │
   │ POST /api/spydra/assets
   │ {
   │   asset: { name, symbol, ... },
   │   creatorWallet: "admin-wallet"
   │ }
   ▼
2. Backend API Route (routes/spydra.js)
   │
   │ • Validate request body
   │ • Check authentication (API key)
   │ • Extract asset data
   ▼
3. Asset Service (assetService.js)
   │
   │ • Validate asset data
   │ • Calculate pricePerToken
   │ • Add metadata (timestamps, creator)
   │ • Build Spydra request payload
   ▼
4. Spydra Client (spydraClient.js)
   │
   │ • Build URL with project/network/app IDs
   │ • Add authentication headers
   │ • Make HTTP POST request
   │ • Handle response/errors
   ▼
5. Spydra API Layer
   │
   │ • Authenticate request
   │ • Validate against schema
   │ • Convert to Fabric transaction
   │ • Submit to network
   ▼
6. Hyperledger Fabric
   │
   │ • Execute chaincode
   │ • Validate transaction
   │ • Reach consensus (Raft)
   │ • Commit to ledger
   ▼
7. Response Flow (back up the stack)
   │
   │ • Transaction ID generated
   │ • Asset ID assigned
   │ • Confirmation received
   │ • Response sent to client
   ▼
8. Client Receives
   {
     success: true,
     data: {
       assetId: "asset-123",
       transactionId: "tx-456",
       asset: { ... }
     }
   }
```

### Token Transfer Flow

```
1. Transfer Request
   │
   │ POST /api/spydra/tokens/transfer
   │ {
   │   assetId, fromWallet, toWallet, amount
   │ }
   ▼
2. Token Service
   │
   │ • Validate wallets differ
   │ • Validate amount > 0
   │ • Add transfer metadata
   │ • Check sender balance (implicit)
   ▼
3. Spydra API
   │
   │ • Verify sender has sufficient balance
   │ • Create transfer transaction
   │ • Submit to Fabric network
   ▼
4. Fabric Execution
   │
   │ • Chaincode: transfer(from, to, amount)
   │ • Update sender balance: -amount
   │ • Update recipient balance: +amount
   │ • Emit transfer event
   │ • Commit state changes
   ▼
5. Confirmation
   │
   │ • Transaction confirmed
   │ • New balances returned
   │ • Event notifications triggered
   ▼
6. Response
   {
     success: true,
     data: {
       transactionId: "tx-789",
       fromWallet: "wallet-A",
       toWallet: "wallet-B",
       amount: 100,
       fromBalance: 900,
       toBalance: 100
     }
   }
```

### Query Flow (Balance Lookup)

```
1. Balance Query
   │
   │ GET /api/spydra/wallets/:walletId/balance
   ▼
2. Token Service
   │
   │ • Extract wallet ID
   │ • Build query request
   ▼
3. Spydra API
   │
   │ • Query world state
   │ • Aggregate balances across assets
   │ • Format response
   ▼
4. Fabric Query
   │
   │ • Read from world state (no transaction)
   │ • Fast read operation (no consensus needed)
   │ • Return current balances
   ▼
5. Response Processing
   │
   │ • Group by asset
   │ • Calculate totals
   │ • Enrich with asset names
   ▼
6. Client Response
   {
     success: true,
     data: {
       walletId: "wallet-123",
       balances: [
         { assetId: "asset-1", balance: 500 },
         { assetId: "asset-2", balance: 300 }
       ],
       totalAssets: 2
     }
   }
```

---

## Sequence Diagrams

### Investor Purchase Sequence

```
Actor: Investor
Browser: Frontend
Backend: Express API
Spydra: Spydra API
Fabric: Fabric Network

Investor → Browser: Click "Buy Tokens"
Browser → Browser: Show purchase form
Investor → Browser: Enter amount, confirm

Browser → Backend: POST /api/spydra/tokens/purchase
                    {assetId, buyer, seller, amount, price}

Backend → Backend: Validate request
Backend → Backend: Check authentication

Backend → Spydra: POST /tokens/transfer
                   {assetId, from: seller, to: buyer, amount}

Spydra → Spydra: Authenticate
Spydra → Spydra: Validate balances

Spydra → Fabric: Submit transaction
                  transferTokens(assetId, from, to, amount)

Fabric → Fabric: Execute chaincode
Fabric → Fabric: Validate sender balance
Fabric → Fabric: Update balances
Fabric → Fabric: Reach consensus
Fabric → Fabric: Commit to ledger

Fabric → Spydra: Transaction confirmed
                  {txId, newBalances}

Spydra → Backend: Transfer complete
                   {transactionId, fromBalance, toBalance}

Backend → Backend: Enhance with purchase metadata

Backend → Browser: 200 OK
                    {success: true, transactionId, amount, price}

Browser → Browser: Show success message
Browser → Browser: Update portfolio view
Browser → Investor: "Purchase successful!"
```

### Asset Creation with Minting Sequence

```
Admin: Admin User
Portal: Admin Portal
Backend: Express API
Spydra: Spydra API
Fabric: Fabric Network

Admin → Portal: Navigate to "Create Asset"
Portal → Admin: Display asset form

Admin → Portal: Fill asset details
                (name, symbol, value, supply)
Admin → Portal: Click "Create"

Portal → Backend: POST /api/spydra/assets
                   {asset: {...}, creatorWallet}

Backend → Spydra: POST /assets
                   {schemaId, asset, creatorWallet}

Spydra → Fabric: Create asset transaction

Fabric → Fabric: Execute CreateAsset chaincode
Fabric → Fabric: Validate data
Fabric → Fabric: Store in world state
Fabric → Fabric: Commit

Fabric → Spydra: Asset created {assetId}

Spydra → Backend: Asset confirmed {assetId, txId}

Backend → Portal: 201 Created {assetId}

Portal → Admin: "Asset created successfully"

--- Automatic Token Minting ---

Portal → Backend: POST /api/spydra/tokens/mint
                   {assetId, recipientWallet: treasury, amount}

Backend → Spydra: POST /tokens/mint

Spydra → Fabric: Mint tokens transaction

Fabric → Fabric: Execute MintTokens chaincode
Fabric → Fabric: Update token supply
Fabric → Fabric: Update treasury balance
Fabric → Fabric: Commit

Fabric → Spydra: Tokens minted

Spydra → Backend: Mint confirmed

Backend → Portal: Tokens minted successfully

Portal → Portal: Update UI with token info
Portal → Admin: "Asset ready for investment"
```

---

## Deployment Architecture

### Development Environment

```
┌─────────────────────────────────────────────┐
│           Developer Machine                 │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │   Frontend (Next.js)               │    │
│  │   http://localhost:3000            │    │
│  └───────────────┬────────────────────┘    │
│                  │                          │
│  ┌───────────────▼────────────────────┐    │
│  │   Backend (Express)                │    │
│  │   http://localhost:3001            │    │
│  └───────────────┬────────────────────┘    │
│                  │                          │
└──────────────────┼──────────────────────────┘
                   │
                   │ HTTPS
                   ▼
         ┌──────────────────────┐
         │   Spydra Test API    │
         │  (Development Env)   │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Test Fabric Network │
         │   (Spydra Managed)   │
         └──────────────────────┘
```

### Production Environment

```
┌─────────────────────────────────────────────────────────┐
│                    Cloud Provider                        │
│                  (AWS/Azure/GCP)                        │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Load Balancer                       │  │
│  │              (SSL/TLS Termination)              │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                 │
│         ┌─────────────┼─────────────┐                  │
│         │             │             │                  │
│  ┌──────▼──────┐ ┌───▼──────┐ ┌───▼──────┐          │
│  │  Frontend   │ │ Frontend │ │ Frontend │          │
│  │  Instance 1 │ │Instance 2│ │Instance 3│          │
│  │  (Next.js)  │ │(Next.js) │ │(Next.js) │          │
│  └──────┬──────┘ └───┬──────┘ └───┬──────┘          │
│         │            │            │                   │
│         └────────────┼────────────┘                   │
│                      │                                 │
│  ┌───────────────────▼──────────────────────────┐    │
│  │           API Gateway                        │    │
│  │           (Rate Limiting, Auth)             │    │
│  └───────────────────┬──────────────────────────┘    │
│                      │                                 │
│         ┌────────────┼────────────┐                   │
│         │            │            │                   │
│  ┌──────▼──────┐ ┌──▼──────┐ ┌──▼──────┐           │
│  │  Backend    │ │Backend  │ │Backend  │           │
│  │  Instance 1 │ │Instance2│ │Instance3│           │
│  │  (Express)  │ │(Express)│ │(Express)│           │
│  └──────┬──────┘ └──┬──────┘ └──┬──────┘           │
│         │           │           │                    │
│         └───────────┼───────────┘                    │
│                     │                                 │
│  ┌──────────────────▼─────────────────────────┐     │
│  │           Redis Cache Cluster              │     │
│  │           (Distributed Caching)            │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
└──────────────────────┼───────────────────────────────┘
                       │
                       │ HTTPS
                       ▼
         ┌──────────────────────────┐
         │   Spydra Production API  │
         │   (High Availability)    │
         └──────────┬───────────────┘
                    │
                    ▼
         ┌──────────────────────────┐
         │ Production Fabric Network│
         │   • Multi-region         │
         │   • Redundant peers      │
         │   • Automatic failover   │
         │   • 99.9% SLA           │
         └──────────────────────────┘
```

### Container Deployment (Docker)

```
┌────────────────────────────────────────────┐
│          Docker Compose Stack               │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   nginx (Reverse Proxy)              │ │
│  │   Port: 80, 443                      │ │
│  └───────────────┬──────────────────────┘ │
│                  │                         │
│      ┌───────────┼───────────┐            │
│      │           │           │            │
│  ┌───▼────┐  ┌──▼─────┐  ┌──▼─────┐     │
│  │Frontend│  │Backend │  │ Redis  │     │
│  │ :3000  │  │ :3001  │  │ :6379  │     │
│  └────────┘  └────┬───┘  └────────┘     │
│                   │                       │
└───────────────────┼───────────────────────┘
                    │
                    │ Spydra API
                    ▼
            External Network
```

---

## Security Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────┐
│                Client Request                    │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│            Frontend Authentication               │
│  • User login (localStorage)                    │
│  • Role: admin | investor | user                │
│  • Include API key for admin operations         │
└──────────────────┬──────────────────────────────┘
                   │
                   │ HTTP Request + Headers
                   │ X-API-Key: [key]
                   ▼
┌─────────────────────────────────────────────────┐
│         Backend Authentication Layer            │
│  1. Extract API key from headers                │
│  2. Validate against AUTH_API_KEY               │
│  3. Check endpoint permissions                  │
│  4. Rate limit by IP/key                        │
└──────────────────┬──────────────────────────────┘
                   │
                   │ Valid Request
                   ▼
┌─────────────────────────────────────────────────┐
│            Spydra Authentication                │
│  1. Include X-API-Key header                    │
│  2. Spydra validates against account            │
│  3. Check project/network permissions           │
│  4. Rate limit API calls                        │
└──────────────────┬──────────────────────────────┘
                   │
                   │ Authenticated Request
                   ▼
┌─────────────────────────────────────────────────┐
│         Fabric Network Security                 │
│  • X.509 certificate validation                 │
│  • MSP identity verification                    │
│  • Channel access control                       │
│  • Chaincode endorsement policies               │
└─────────────────────────────────────────────────┘
```

### Security Layers

```
Layer 1: Transport Security
┌────────────────────────────┐
│  • TLS 1.3                 │
│  • HTTPS only              │
│  • Certificate pinning     │
└────────────────────────────┘

Layer 2: API Authentication
┌────────────────────────────┐
│  • API key validation      │
│  • JWT tokens              │
│  • Rate limiting           │
└────────────────────────────┘

Layer 3: Application Security
┌────────────────────────────┐
│  • Input validation        │
│  • SQL injection prevention│
│  • XSS protection          │
│  • CSRF tokens             │
└────────────────────────────┘

Layer 4: Blockchain Security
┌────────────────────────────┐
│  • X.509 certificates      │
│  • MSP verification        │
│  • Endorsement policies    │
│  • Immutable ledger        │
└────────────────────────────┘
```

### Key Management

```
┌─────────────────────────────────────────────────┐
│              Key Storage Hierarchy               │
│                                                 │
│  Environment Variables (.env)                   │
│  ├── AUTH_API_KEY (Backend API key)            │
│  ├── SPYDRA_API_KEY (Spydra authentication)    │
│  └── NEXT_PUBLIC_API_KEY (Frontend → Backend)  │
│                                                 │
│  Secrets Manager (Production)                   │
│  ├── AWS Secrets Manager                        │
│  ├── Azure Key Vault                            │
│  └── Google Secret Manager                      │
│                                                 │
│  Spydra Platform                                │
│  ├── API keys (Dashboard generated)            │
│  ├── Network certificates (Auto-managed)       │
│  └── Wallet identities (Platform secured)      │
│                                                 │
│  Fabric Network                                 │
│  ├── MSP certificates (CA issued)              │
│  ├── Private keys (Hardware secured)           │
│  └── TLS certificates (Auto-rotated)           │
└─────────────────────────────────────────────────┘
```

---

## Scalability Considerations

### Horizontal Scaling

```
Request Distribution:

                    ┌─────────────┐
                    │Load Balancer│
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐    ┌────▼─────┐    ┌────▼─────┐
    │ Backend 1 │    │Backend 2 │    │Backend 3 │
    └─────┬─────┘    └────┬─────┘    └────┬─────┘
          │               │               │
          └───────────────┼───────────────┘
                          │
                    ┌─────▼──────┐
                    │Redis Cache │
                    └─────┬──────┘
                          │
                    ┌─────▼──────┐
                    │Spydra API  │
                    └────────────┘
```

### Performance Optimization

**1. Caching Strategy**
```javascript
// Cache read operations
const CACHE_TTL = {
  assets: 5 * 60,        // 5 minutes
  balances: 30,          // 30 seconds
  transactions: 60,      // 1 minute
  holders: 5 * 60        // 5 minutes
};

// Cache invalidation on writes
// Clear cache after: create, update, mint, burn, transfer
```

**2. Request Batching**
```javascript
// Batch multiple balance queries
async function getBatchBalances(walletIds) {
  return Promise.all(
    walletIds.map(id => getBalance(id))
  );
}

// Batch asset details
async function getBatchAssets(assetIds) {
  return Promise.all(
    assetIds.map(id => getAsset(id))
  );
}
```

**3. Rate Limiting**
```javascript
// Per IP rate limits
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window
  message: 'Too many requests'
});

// Per API key limits (admin operations)
const adminLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 30,               // 30 requests per minute
  keyGenerator: (req) => req.headers['x-api-key']
});
```

### Database Considerations

```
┌─────────────────────────────────────────────────┐
│           Data Storage Strategy                 │
│                                                 │
│  Hot Data (Frequent Access)                     │
│  ├── Redis Cache                                │
│  │   • Active balances                          │
│  │   • Recent transactions                      │
│  │   • Published assets                         │
│  └── TTL: 30s - 5m                              │
│                                                 │
│  Warm Data (Occasional Access)                  │
│  ├── Spydra API (via REST)                     │
│  │   • All blockchain data                      │
│  │   • Transaction history                      │
│  │   • Asset metadata                           │
│  └── Access: On-demand                          │
│                                                 │
│  Cold Data (Archive)                            │
│  ├── Fabric Ledger                              │
│  │   • Immutable history                        │
│  │   • Complete audit trail                     │
│  │   • Long-term storage                        │
│  └── Access: Rare, compliance                   │
└─────────────────────────────────────────────────┘
```

---

## Monitoring and Observability

### Monitoring Architecture

```
┌─────────────────────────────────────────────────┐
│              Application Metrics                │
│                                                 │
│  Backend (Express)                              │
│  ├── HTTP request metrics                       │
│  ├── Response times                             │
│  ├── Error rates                                │
│  └── API call patterns                          │
│                                                 │
│  Frontend (Next.js)                             │
│  ├── Page load times                            │
│  ├── User interactions                          │
│  ├── Error boundaries                           │
│  └── API response times                         │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│           Monitoring Platform                   │
│  • Prometheus + Grafana                         │
│  • DataDog / New Relic                          │
│  • CloudWatch / Azure Monitor                   │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│              Alert System                       │
│  • High error rate                              │
│  • Slow response times                          │
│  • API failures                                 │
│  • Blockchain sync issues                       │
└─────────────────────────────────────────────────┘
```

### Logging Strategy

```
┌─────────────────────────────────────────────────┐
│                Log Levels                       │
│                                                 │
│  ERROR - Critical failures                      │
│  ├── API errors                                 │
│  ├── Blockchain transaction failures            │
│  └── Authentication failures                    │
│                                                 │
│  WARN - Potential issues                        │
│  ├── High latency                               │
│  ├── Rate limit warnings                        │
│  └── Deprecated API usage                       │
│                                                 │
│  INFO - Important events                        │
│  ├── Asset created                              │
│  ├── Tokens minted                              │
│  ├── Transfers completed                        │
│  └── User actions                               │
│                                                 │
│  DEBUG - Detailed information                   │
│  ├── API requests/responses                     │
│  ├── State changes                              │
│  └── Performance metrics                        │
└─────────────────────────────────────────────────┘
```

---

## Disaster Recovery

### Backup Strategy

```
┌─────────────────────────────────────────────────┐
│            Backup Hierarchy                     │
│                                                 │
│  Application Layer                              │
│  ├── Code repository (Git)                      │
│  ├── Configuration files                        │
│  └── Environment variables (Secrets manager)    │
│                                                 │
│  Database Layer                                 │
│  ├── Redis cache (Rebuild from source)         │
│  └── No persistent DB needed                    │
│                                                 │
│  Blockchain Layer (Managed by Spydra)           │
│  ├── Automatic ledger backups                   │
│  ├── Multi-region replication                   │
│  ├── Point-in-time recovery                     │
│  └── Immutable audit trail                      │
└─────────────────────────────────────────────────┘
```

### High Availability

```
Component         | Availability | Recovery Time
------------------|--------------|--------------
Frontend          | 99.9%        | < 1 minute
Backend API       | 99.9%        | < 1 minute
Redis Cache       | 99.9%        | < 30 seconds
Spydra API        | 99.9%        | Managed
Fabric Network    | 99.95%       | Managed
Overall System    | 99.8%        | < 5 minutes
```

---

## Cost Optimization

### Resource Usage

```
┌─────────────────────────────────────────────────┐
│              Cost Breakdown                     │
│                                                 │
│  Compute (Backend)                              │
│  ├── Container instances: $50-200/month         │
│  ├── Load balancer: $20/month                   │
│  └── Auto-scaling: Variable                     │
│                                                 │
│  Storage                                        │
│  ├── Redis cache: $30-100/month                 │
│  └── S3/blob storage: $10/month                 │
│                                                 │
│  Networking                                     │
│  ├── Data transfer: $20-50/month                │
│  └── CDN: $10-30/month                          │
│                                                 │
│  Spydra Platform                                │
│  ├── Network hosting: $200-500/month            │
│  ├── API calls: Variable (per transaction)     │
│  └── Storage: Included                          │
│                                                 │
│  Total Estimated: $350-1000/month               │
│  (Scales with transaction volume)               │
└─────────────────────────────────────────────────┘
```

---

**Last Updated**: November 24, 2025
**Version**: 1.0.0
