# Spydra API Examples

Complete collection of API examples for every Spydra endpoint. Each example includes curl commands and JavaScript/TypeScript code.

---

## Table of Contents

1. [Health & Status](#health--status)
2. [Asset Operations](#asset-operations)
3. [Token Operations](#token-operations)
4. [Query Operations](#query-operations)
5. [Advanced Examples](#advanced-examples)

---

## Configuration

### Environment Variables

```bash
# Backend URL
API_URL=http://localhost:3001/api

# API Key (for admin operations)
API_KEY=imec-2212-RWA-Market-26
```

### Helper Functions

```javascript
// JavaScript helper
async function apiCall(endpoint, method = 'GET', body = null, requiresAuth = false) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  if (requiresAuth) {
    options.headers['X-API-Key'] = 'imec-2212-RWA-Market-26';
  }
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`http://localhost:3001/api${endpoint}`, options);
  return await response.json();
}
```

---

## Health & Status

### Check Spydra API Health

**Description**: Verify connectivity to Spydra API

**curl**:
```bash
curl -X GET http://localhost:3001/api/spydra/health
```

**JavaScript**:
```javascript
const response = await fetch('http://localhost:3001/api/spydra/health');
const result = await response.json();
console.log(result);
```

**Response**:
```json
{
  "success": true,
  "spydra": {
    "healthy": true,
    "message": "Spydra API is reachable"
  }
}
```

---

## Asset Operations

### 1. List All Assets

**Description**: Get all published assets

**curl**:
```bash
curl -X GET "http://localhost:3001/api/spydra/assets?limit=10&offset=0"
```

**JavaScript**:
```javascript
const response = await fetch('http://localhost:3001/api/spydra/assets?limit=10&offset=0');
const result = await response.json();
console.log('Assets:', result.data);
```

**TypeScript**:
```typescript
interface Asset {
  assetId: string;
  name: string;
  symbol: string;
  description: string;
  assetType: string;
  totalValue: number;
  totalSupply: number;
  pricePerToken: number;
  status: string;
  metadata?: Record<string, any>;
}

async function listAssets(): Promise<Asset[]> {
  const response = await fetch('http://localhost:3001/api/spydra/assets');
  const result = await response.json();
  return result.data as Asset[];
}

const assets = await listAssets();
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "assetId": "asset-123",
      "name": "Luxury Apartment",
      "symbol": "LUXAPT",
      "description": "Premium apartment in Manhattan",
      "assetType": "real-estate",
      "totalValue": 5000000,
      "totalSupply": 10000,
      "pricePerToken": 500,
      "status": "published",
      "metadata": {
        "address": "123 Park Ave, NY",
        "sqft": 2500
      }
    }
  ],
  "count": 1,
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### 2. Filter Assets by Type

**curl**:
```bash
curl -X GET "http://localhost:3001/api/spydra/assets?assetType=real-estate"
```

**JavaScript**:
```javascript
const response = await fetch('http://localhost:3001/api/spydra/assets?assetType=real-estate');
const result = await response.json();
console.log('Real estate assets:', result.data);
```

### 3. Get Single Asset

**Description**: Get detailed information about a specific asset

**curl**:
```bash
curl -X GET http://localhost:3001/api/spydra/assets/asset-123
```

**JavaScript**:
```javascript
const assetId = 'asset-123';
const response = await fetch(`http://localhost:3001/api/spydra/assets/${assetId}`);
const result = await response.json();
console.log('Asset details:', result.data);
```

**Response**:
```json
{
  "success": true,
  "data": {
    "assetId": "asset-123",
    "name": "Luxury Apartment",
    "symbol": "LUXAPT",
    "description": "Premium apartment in Manhattan",
    "assetType": "real-estate",
    "totalValue": 5000000,
    "totalSupply": 10000,
    "pricePerToken": 500,
    "status": "published",
    "metadata": {
      "address": "123 Park Ave, NY",
      "sqft": 2500,
      "bedrooms": 3,
      "bathrooms": 2
    }
  }
}
```

### 4. Create Asset (Admin)

**Description**: Create a new asset on the blockchain

**curl**:
```bash
curl -X POST http://localhost:3001/api/spydra/assets \
  -H "Content-Type: application/json" \
  -H "X-API-Key: imec-2212-RWA-Market-26" \
  -d '{
    "asset": {
      "name": "Office Building Downtown",
      "symbol": "OFCBLD",
      "description": "Commercial property in city center",
      "assetType": "real-estate",
      "totalValue": 10000000,
      "totalSupply": 100000,
      "metadata": {
        "address": "456 Business St, NY",
        "sqft": 50000,
        "floors": 10,
        "yearBuilt": 2010
      }
    },
    "creatorWallet": "admin-wallet-123"
  }'
```

**JavaScript**:
```javascript
const assetData = {
  asset: {
    name: "Office Building Downtown",
    symbol: "OFCBLD",
    description: "Commercial property in city center",
    assetType: "real-estate",
    totalValue: 10000000,
    totalSupply: 100000,
    metadata: {
      address: "456 Business St, NY",
      sqft: 50000,
      floors: 10,
      yearBuilt: 2010
    }
  },
  creatorWallet: "admin-wallet-123"
};

const response = await fetch('http://localhost:3001/api/spydra/assets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'imec-2212-RWA-Market-26'
  },
  body: JSON.stringify(assetData)
});

const result = await response.json();
console.log('Asset created:', result.data);
```

**TypeScript with Error Handling**:
```typescript
interface CreateAssetRequest {
  asset: {
    name: string;
    symbol: string;
    description: string;
    assetType: string;
    totalValue: number;
    totalSupply: number;
    metadata?: Record<string, any>;
  };
  creatorWallet: string;
}

async function createAsset(data: CreateAssetRequest) {
  try {
    const response = await fetch('http://localhost:3001/api/spydra/assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.API_KEY!
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create asset');
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Create asset error:', error);
    throw error;
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "assetId": "asset-new-123",
    "transactionId": "tx-456",
    "asset": {
      "assetId": "asset-new-123",
      "name": "Office Building Downtown",
      "symbol": "OFCBLD",
      ...
    }
  }
}
```

### 5. Update Asset (Admin)

**Description**: Update existing asset information

**curl**:
```bash
curl -X PUT http://localhost:3001/api/spydra/assets/asset-123 \
  -H "Content-Type: application/json" \
  -H "X-API-Key: imec-2212-RWA-Market-26" \
  -d '{
    "updates": {
      "description": "Updated description with more details",
      "metadata": {
        "lastInspection": "2025-11-20",
        "condition": "excellent",
        "occupancyRate": 95
      }
    },
    "updaterWallet": "admin-wallet-123"
  }'
```

**JavaScript**:
```javascript
const assetId = 'asset-123';
const updates = {
  updates: {
    description: "Updated description with more details",
    metadata: {
      lastInspection: "2025-11-20",
      condition: "excellent",
      occupancyRate: 95
    }
  },
  updaterWallet: "admin-wallet-123"
};

const response = await fetch(`http://localhost:3001/api/spydra/assets/${assetId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'imec-2212-RWA-Market-26'
  },
  body: JSON.stringify(updates)
});

const result = await response.json();
console.log('Asset updated:', result.data);
```

**Response**:
```json
{
  "success": true,
  "data": {
    "assetId": "asset-123",
    "transactionId": "tx-789",
    "asset": {
      "assetId": "asset-123",
      "description": "Updated description with more details",
      ...
    }
  }
}
```

### 6. Publish Asset (Admin)

**Description**: Change asset status from draft to published

**curl**:
```bash
curl -X POST http://localhost:3001/api/spydra/assets/asset-123/publish \
  -H "Content-Type: application/json" \
  -H "X-API-Key: imec-2212-RWA-Market-26" \
  -d '{
    "publisherWallet": "admin-wallet-123"
  }'
```

**JavaScript**:
```javascript
const assetId = 'asset-123';

const response = await fetch(`http://localhost:3001/api/spydra/assets/${assetId}/publish`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'imec-2212-RWA-Market-26'
  },
  body: JSON.stringify({
    publisherWallet: 'admin-wallet-123'
  })
});

const result = await response.json();
console.log('Asset published:', result.data);
```

### 7. Get Asset History

**Description**: Get all transactions related to an asset

**curl**:
```bash
curl -X GET http://localhost:3001/api/spydra/assets/asset-123/history
```

**JavaScript**:
```javascript
const assetId = 'asset-123';
const response = await fetch(`http://localhost:3001/api/spydra/assets/${assetId}/history`);
const result = await response.json();
console.log('Asset history:', result.data);
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "transactionId": "tx-001",
      "type": "create",
      "timestamp": "2025-11-01T10:00:00Z",
      "actor": "admin-wallet-123"
    },
    {
      "transactionId": "tx-002",
      "type": "update",
      "timestamp": "2025-11-15T14:30:00Z",
      "actor": "admin-wallet-123"
    },
    {
      "transactionId": "tx-003",
      "type": "publish",
      "timestamp": "2025-11-20T09:00:00Z",
      "actor": "admin-wallet-123"
    }
  ],
  "count": 3
}
```

---

## Token Operations

### 1. Mint Tokens (Admin)

**Description**: Create new tokens for an asset

**curl**:
```bash
curl -X POST http://localhost:3001/api/spydra/tokens/mint \
  -H "Content-Type: application/json" \
  -H "X-API-Key: imec-2212-RWA-Market-26" \
  -d '{
    "assetId": "asset-123",
    "recipientWallet": "treasury-wallet",
    "amount": 10000,
    "minterWallet": "admin-wallet-123",
    "metadata": {
      "purpose": "Initial token distribution",
      "batch": "batch-001"
    }
  }'
```

**JavaScript**:
```javascript
const mintData = {
  assetId: "asset-123",
  recipientWallet: "treasury-wallet",
  amount: 10000,
  minterWallet: "admin-wallet-123",
  metadata: {
    purpose: "Initial token distribution",
    batch: "batch-001"
  }
};

const response = await fetch('http://localhost:3001/api/spydra/tokens/mint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'imec-2212-RWA-Market-26'
  },
  body: JSON.stringify(mintData)
});

const result = await response.json();
console.log('Tokens minted:', result.data);
```

**Response**:
```json
{
  "success": true,
  "data": {
    "transactionId": "tx-mint-001",
    "assetId": "asset-123",
    "recipientWallet": "treasury-wallet",
    "amount": 10000,
    "newBalance": 10000
  }
}
```

### 2. Burn Tokens (Admin)

**Description**: Remove tokens from circulation

**curl**:
```bash
curl -X POST http://localhost:3001/api/spydra/tokens/burn \
  -H "Content-Type: application/json" \
  -H "X-API-Key: imec-2212-RWA-Market-26" \
  -d '{
    "assetId": "asset-123",
    "holderWallet": "investor-wallet-456",
    "amount": 100,
    "burnerWallet": "admin-wallet-123",
    "reason": "Token redemption"
  }'
```

**JavaScript**:
```javascript
const burnData = {
  assetId: "asset-123",
  holderWallet: "investor-wallet-456",
  amount: 100,
  burnerWallet: "admin-wallet-123",
  reason: "Token redemption"
};

const response = await fetch('http://localhost:3001/api/spydra/tokens/burn', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'imec-2212-RWA-Market-26'
  },
  body: JSON.stringify(burnData)
});

const result = await response.json();
console.log('Tokens burned:', result.data);
```

**Response**:
```json
{
  "success": true,
  "data": {
    "transactionId": "tx-burn-001",
    "assetId": "asset-123",
    "holderWallet": "investor-wallet-456",
    "amount": 100,
    "newBalance": 900
  }
}
```

### 3. Transfer Tokens

**Description**: Move tokens between wallets

**curl**:
```bash
curl -X POST http://localhost:3001/api/spydra/tokens/transfer \
  -H "Content-Type: application/json" \
  -H "X-API-Key: imec-2212-RWA-Market-26" \
  -d '{
    "assetId": "asset-123",
    "fromWallet": "treasury-wallet",
    "toWallet": "investor-wallet-789",
    "amount": 500,
    "metadata": {
      "transferType": "sale",
      "price": 500,
      "totalValue": 250000
    }
  }'
```

**JavaScript**:
```javascript
const transferData = {
  assetId: "asset-123",
  fromWallet: "treasury-wallet",
  toWallet: "investor-wallet-789",
  amount: 500,
  metadata: {
    transferType: "sale",
    price: 500,
    totalValue: 250000
  }
};

const response = await fetch('http://localhost:3001/api/spydra/tokens/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'imec-2212-RWA-Market-26'
  },
  body: JSON.stringify(transferData)
});

const result = await response.json();
console.log('Tokens transferred:', result.data);
```

**Response**:
```json
{
  "success": true,
  "data": {
    "transactionId": "tx-transfer-001",
    "assetId": "asset-123",
    "fromWallet": "treasury-wallet",
    "toWallet": "investor-wallet-789",
    "amount": 500,
    "fromBalance": 9500,
    "toBalance": 500
  }
}
```

### 4. Record Purchase

**Description**: Record a token purchase (combines transfer with purchase metadata)

**curl**:
```bash
curl -X POST http://localhost:3001/api/spydra/tokens/purchase \
  -H "Content-Type: application/json" \
  -H "X-API-Key: imec-2212-RWA-Market-26" \
  -d '{
    "assetId": "asset-123",
    "sellerWallet": "treasury-wallet",
    "buyerWallet": "investor-wallet-101",
    "amount": 100,
    "price": 500,
    "paymentMethod": "bank_transfer"
  }'
```

**JavaScript**:
```javascript
const purchaseData = {
  assetId: "asset-123",
  sellerWallet: "treasury-wallet",
  buyerWallet: "investor-wallet-101",
  amount: 100,
  price: 500,
  paymentMethod: "bank_transfer"
};

const response = await fetch('http://localhost:3001/api/spydra/tokens/purchase', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'imec-2212-RWA-Market-26'
  },
  body: JSON.stringify(purchaseData)
});

const result = await response.json();
console.log('Purchase recorded:', result.data);
```

**Response**:
```json
{
  "success": true,
  "data": {
    "transactionId": "tx-purchase-001",
    "assetId": "asset-123",
    "fromWallet": "treasury-wallet",
    "toWallet": "investor-wallet-101",
    "amount": 100,
    "purchasePrice": 500,
    "totalValue": 50000,
    "fromBalance": 9400,
    "toBalance": 100
  }
}
```

---

## Query Operations

### 1. Get Wallet Balance

**Description**: Get token balances for a wallet

**curl**:
```bash
curl -X GET http://localhost:3001/api/spydra/wallets/investor-wallet-789/balance
```

**JavaScript**:
```javascript
const walletId = 'investor-wallet-789';
const response = await fetch(`http://localhost:3001/api/spydra/wallets/${walletId}/balance`);
const result = await response.json();
console.log('Wallet balance:', result.data);
```

**Filter by Asset**:
```bash
curl -X GET "http://localhost:3001/api/spydra/wallets/investor-wallet-789/balance?assetId=asset-123"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "walletId": "investor-wallet-789",
    "balances": [
      {
        "assetId": "asset-123",
        "assetName": "Luxury Apartment",
        "balance": 500
      },
      {
        "assetId": "asset-456",
        "assetName": "Office Building",
        "balance": 200
      }
    ],
    "totalAssets": 2
  }
}
```

### 2. Get Token Holders

**Description**: Get all wallets holding tokens for an asset

**curl**:
```bash
curl -X GET http://localhost:3001/api/spydra/tokens/asset-123/holders
```

**JavaScript**:
```javascript
const assetId = 'asset-123';
const response = await fetch(`http://localhost:3001/api/spydra/tokens/${assetId}/holders`);
const result = await response.json();
console.log('Token holders:', result.data);
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "wallet": "treasury-wallet",
      "balance": 5000
    },
    {
      "wallet": "investor-wallet-789",
      "balance": 500
    },
    {
      "wallet": "investor-wallet-456",
      "balance": 300
    }
  ],
  "count": 3
}
```

### 3. Get Token Supply

**Description**: Get supply information for an asset

**curl**:
```bash
curl -X GET http://localhost:3001/api/spydra/tokens/asset-123/supply
```

**JavaScript**:
```javascript
const assetId = 'asset-123';
const response = await fetch(`http://localhost:3001/api/spydra/tokens/${assetId}/supply`);
const result = await response.json();
console.log('Token supply:', result.data);
```

**Response**:
```json
{
  "success": true,
  "data": {
    "assetId": "asset-123",
    "totalMinted": 10000,
    "totalBurned": 100,
    "circulatingSupply": 9900
  }
}
```

### 4. Get Transaction History

**Description**: Get transaction history for a wallet

**curl**:
```bash
curl -X GET "http://localhost:3001/api/spydra/wallets/investor-wallet-789/transactions?limit=20&offset=0"
```

**JavaScript**:
```javascript
const walletId = 'investor-wallet-789';
const params = new URLSearchParams({
  limit: '20',
  offset: '0'
});

const response = await fetch(
  `http://localhost:3001/api/spydra/wallets/${walletId}/transactions?${params}`
);
const result = await response.json();
console.log('Transaction history:', result.data);
```

**Filter by Asset**:
```bash
curl -X GET "http://localhost:3001/api/spydra/wallets/investor-wallet-789/transactions?assetId=asset-123"
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "transactionId": "tx-transfer-001",
      "type": "transfer",
      "assetId": "asset-123",
      "fromWallet": "treasury-wallet",
      "toWallet": "investor-wallet-789",
      "amount": 500,
      "timestamp": "2025-11-24T10:30:00Z",
      "metadata": {
        "transferType": "sale",
        "price": 500
      }
    }
  ],
  "count": 1,
  "total": 1
}
```

---

## Advanced Examples

### Complete Workflow: Asset Creation to Investor Purchase

```javascript
async function completeAssetWorkflow() {
  // 1. Create Asset
  console.log('Step 1: Creating asset...');
  const createResponse = await fetch('http://localhost:3001/api/spydra/assets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'imec-2212-RWA-Market-26'
    },
    body: JSON.stringify({
      asset: {
        name: "Luxury Villa Miami",
        symbol: "LUXVILLA",
        description: "Beachfront property",
        assetType: "real-estate",
        totalValue: 8000000,
        totalSupply: 80000
      },
      creatorWallet: "admin-wallet-123"
    })
  });
  const { data: { assetId } } = await createResponse.json();
  console.log('✓ Asset created:', assetId);
  
  // 2. Mint Tokens
  console.log('Step 2: Minting tokens...');
  await fetch('http://localhost:3001/api/spydra/tokens/mint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'imec-2212-RWA-Market-26'
    },
    body: JSON.stringify({
      assetId,
      recipientWallet: "treasury-wallet",
      amount: 80000,
      minterWallet: "admin-wallet-123"
    })
  });
  console.log('✓ Tokens minted');
  
  // 3. Publish Asset
  console.log('Step 3: Publishing asset...');
  await fetch(`http://localhost:3001/api/spydra/assets/${assetId}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'imec-2212-RWA-Market-26'
    },
    body: JSON.stringify({
      publisherWallet: "admin-wallet-123"
    })
  });
  console.log('✓ Asset published');
  
  // 4. Investor Purchase
  console.log('Step 4: Processing investor purchase...');
  await fetch('http://localhost:3001/api/spydra/tokens/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'imec-2212-RWA-Market-26'
    },
    body: JSON.stringify({
      assetId,
      sellerWallet: "treasury-wallet",
      buyerWallet: "investor-001",
      amount: 1000,
      price: 100,
      paymentMethod: "bank_transfer"
    })
  });
  console.log('✓ Purchase completed');
  
  // 5. Verify Balance
  console.log('Step 5: Verifying investor balance...');
  const balanceResponse = await fetch(
    'http://localhost:3001/api/spydra/wallets/investor-001/balance'
  );
  const balance = await balanceResponse.json();
  console.log('✓ Investor balance:', balance.data);
  
  return {
    assetId,
    success: true
  };
}

// Run workflow
completeAssetWorkflow()
  .then(result => console.log('Workflow complete:', result))
  .catch(error => console.error('Workflow failed:', error));
```

### Bulk Operations

```javascript
async function bulkMintTokens(distributions) {
  const results = [];
  
  for (const dist of distributions) {
    try {
      const response = await fetch('http://localhost:3001/api/spydra/tokens/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'imec-2212-RWA-Market-26'
        },
        body: JSON.stringify({
          assetId: dist.assetId,
          recipientWallet: dist.wallet,
          amount: dist.amount,
          minterWallet: "admin-wallet-123"
        })
      });
      
      const result = await response.json();
      results.push({
        wallet: dist.wallet,
        success: true,
        transactionId: result.data.transactionId
      });
      
      console.log(`✓ Minted ${dist.amount} tokens to ${dist.wallet}`);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({
        wallet: dist.wallet,
        success: false,
        error: error.message
      });
      console.error(`✗ Failed to mint for ${dist.wallet}:`, error.message);
    }
  }
  
  return results;
}

// Example usage
const distributions = [
  { assetId: 'asset-123', wallet: 'investor-001', amount: 100 },
  { assetId: 'asset-123', wallet: 'investor-002', amount: 200 },
  { assetId: 'asset-123', wallet: 'investor-003', amount: 150 },
];

const results = await bulkMintTokens(distributions);
console.log('Bulk mint results:', results);
```

### Portfolio Aggregation

```javascript
async function getInvestorPortfolio(walletId) {
  // Get balances
  const balanceResponse = await fetch(
    `http://localhost:3001/api/spydra/wallets/${walletId}/balance`
  );
  const balanceData = await balanceResponse.json();
  
  // Get asset details for each holding
  const portfolio = [];
  
  for (const holding of balanceData.data.balances) {
    const assetResponse = await fetch(
      `http://localhost:3001/api/spydra/assets/${holding.assetId}`
    );
    const assetData = await assetResponse.json();
    const asset = assetData.data;
    
    portfolio.push({
      asset: {
        id: asset.assetId,
        name: asset.name,
        symbol: asset.symbol,
        type: asset.assetType,
        pricePerToken: asset.pricePerToken
      },
      holdings: {
        tokens: holding.balance,
        value: holding.balance * asset.pricePerToken,
        percentage: (holding.balance / asset.totalSupply) * 100
      }
    });
  }
  
  // Calculate totals
  const totalValue = portfolio.reduce((sum, item) => sum + item.holdings.value, 0);
  
  return {
    walletId,
    portfolio,
    totalAssets: portfolio.length,
    totalValue
  };
}

// Example usage
const portfolio = await getInvestorPortfolio('investor-wallet-789');
console.log('Portfolio:', portfolio);
```

### Real-time Balance Monitoring

```javascript
async function monitorWalletBalance(walletId, intervalMs = 5000) {
  let previousBalance = null;
  
  const checkBalance = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/spydra/wallets/${walletId}/balance`
      );
      const result = await response.json();
      const currentBalance = result.data;
      
      if (previousBalance) {
        // Check for changes
        for (const current of currentBalance.balances) {
          const previous = previousBalance.balances.find(
            b => b.assetId === current.assetId
          );
          
          if (!previous) {
            console.log(`[NEW] ${current.assetName}: ${current.balance} tokens`);
          } else if (current.balance !== previous.balance) {
            const change = current.balance - previous.balance;
            console.log(
              `[CHANGE] ${current.assetName}: ${previous.balance} → ${current.balance} (${change > 0 ? '+' : ''}${change})`
            );
          }
        }
      }
      
      previousBalance = currentBalance;
    } catch (error) {
      console.error('Balance check error:', error.message);
    }
  };
  
  // Initial check
  await checkBalance();
  
  // Set up interval
  return setInterval(checkBalance, intervalMs);
}

// Start monitoring
const monitorId = await monitorWalletBalance('investor-wallet-789', 5000);

// Stop monitoring later
// clearInterval(monitorId);
```

---

## Error Handling

### Example with Comprehensive Error Handling

```javascript
async function safeMintTokens(mintData) {
  try {
    // Validate input
    if (!mintData.assetId) {
      throw new Error('Asset ID is required');
    }
    if (!mintData.recipientWallet) {
      throw new Error('Recipient wallet is required');
    }
    if (!mintData.amount || mintData.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    // Make API call
    const response = await fetch('http://localhost:3001/api/spydra/tokens/mint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'imec-2212-RWA-Market-26'
      },
      body: JSON.stringify(mintData)
    });
    
    // Handle HTTP errors
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Parse and return result
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Operation failed');
    }
    
    return {
      success: true,
      data: result.data
    };
    
  } catch (error) {
    console.error('Mint tokens error:', error);
    
    // Return structured error
    return {
      success: false,
      error: {
        message: error.message,
        type: error.name,
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Usage
const result = await safeMintTokens({
  assetId: 'asset-123',
  recipientWallet: 'investor-001',
  amount: 500,
  minterWallet: 'admin-wallet-123'
});

if (result.success) {
  console.log('Success:', result.data);
} else {
  console.error('Error:', result.error);
}
```

---

## Testing Scripts

### Test All Endpoints

```javascript
async function testAllEndpoints() {
  console.log('='.repeat(50));
  console.log('Testing Spydra Integration');
  console.log('='.repeat(50));
  
  const tests = [];
  
  // Test 1: Health Check
  console.log('\n1. Testing health endpoint...');
  try {
    const response = await fetch('http://localhost:3001/api/spydra/health');
    const result = await response.json();
    tests.push({ name: 'Health Check', success: result.success });
    console.log('✓ Health check passed');
  } catch (error) {
    tests.push({ name: 'Health Check', success: false, error: error.message });
    console.log('✗ Health check failed:', error.message);
  }
  
  // Test 2: List Assets
  console.log('\n2. Testing list assets...');
  try {
    const response = await fetch('http://localhost:3001/api/spydra/assets');
    const result = await response.json();
    tests.push({ name: 'List Assets', success: result.success });
    console.log(`✓ Found ${result.count} assets`);
  } catch (error) {
    tests.push({ name: 'List Assets', success: false, error: error.message });
    console.log('✗ List assets failed:', error.message);
  }
  
  // Test 3: Create Asset (requires API key)
  console.log('\n3. Testing create asset...');
  try {
    const response = await fetch('http://localhost:3001/api/spydra/assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'imec-2212-RWA-Market-26'
      },
      body: JSON.stringify({
        asset: {
          name: `Test Asset ${Date.now()}`,
          symbol: 'TEST',
          description: 'Test asset',
          assetType: 'real-estate',
          totalValue: 1000000,
          totalSupply: 10000
        },
        creatorWallet: 'test-wallet'
      })
    });
    const result = await response.json();
    tests.push({ name: 'Create Asset', success: result.success });
    if (result.success) {
      console.log('✓ Asset created:', result.data.assetId);
    }
  } catch (error) {
    tests.push({ name: 'Create Asset', success: false, error: error.message });
    console.log('✗ Create asset failed:', error.message);
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Test Summary');
  console.log('='.repeat(50));
  const passed = tests.filter(t => t.success).length;
  const failed = tests.filter(t => !t.success).length;
  console.log(`Passed: ${passed}/${tests.length}`);
  console.log(`Failed: ${failed}/${tests.length}`);
  
  if (failed > 0) {
    console.log('\nFailed Tests:');
    tests.filter(t => !t.success).forEach(t => {
      console.log(`- ${t.name}: ${t.error}`);
    });
  }
}

// Run tests
testAllEndpoints();
```

---

**Last Updated**: November 24, 2025
**Version**: 1.0.0
