# Spydra Integration Guide

## Overview

This guide explains how to integrate Spydra's managed Hyperledger Fabric service into the IMEC RWA Marketplace. Spydra abstracts all Fabric components (peers, orderers, CAs) and provides a REST API for blockchain operations.

## Table of Contents

1. [Architecture](#architecture)
2. [Spydra Setup](#spydra-setup)
3. [Backend Integration](#backend-integration)
4. [Frontend Integration](#frontend-integration)
5. [API Reference](#api-reference)
6. [Example Workflows](#example-workflows)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   React/     │  │   Next.js    │  │ React Native │       │
│  │   Next.js    │  │   Admin      │  │   Mobile     │       │
│  │   Public     │  │   Dashboard  │  │     App      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                 │                  │                 │
│         └─────────────────┼──────────────────┘                 │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND LAYER                           │
│                     (Express.js / Node.js)                      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    API Routes                             │ │
│  │  /api/spydra/*                                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            │                                   │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                 Spydra Services                          │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │   Spydra     │  │    Asset     │  │    Token     │ │ │
│  │  │   Client     │  │   Service    │  │   Service    │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            │                                   │
└────────────────────────────┼───────────────────────────────────┘
                             │ HTTPS/REST
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SPYDRA API LAYER                           │
│                https://api.spydra.io/v2                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  • Asset Management    • Token Operations               │ │
│  │  • Wallet Management   • Transaction Queries            │ │
│  │  • Metadata Storage    • Balance Queries                │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            │                                   │
└────────────────────────────┼───────────────────────────────────┘
                             │ Managed Infrastructure
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 HYPERLEDGER FABRIC NETWORK                      │
│                    (Managed by Spydra)                          │
│                                                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────┐  │
│  │   Peer     │  │   Peer     │  │  Orderer   │  │   CA   │  │
│  │   Nodes    │  │   Nodes    │  │   Nodes    │  │        │  │
│  └────────────┘  └────────────┘  └────────────┘  └────────┘  │
│                            │                                   │
│                    ┌───────▼────────┐                          │
│                    │  Distributed   │                          │
│                    │     Ledger     │                          │
│                    └────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Frontend → Backend**: User actions trigger API calls to Express backend
2. **Backend → Spydra**: Backend translates requests to Spydra REST API calls
3. **Spydra → Fabric**: Spydra manages Fabric network and executes chaincode
4. **Fabric → Ledger**: Transactions are validated and committed to distributed ledger
5. **Response Flow**: Results propagate back through the stack to the frontend

### Key Components

#### Backend Components
- **spydraClient.js**: Core HTTP client for Spydra API
- **assetService.js**: Asset lifecycle operations (create, update, query)
- **tokenService.js**: Token operations (mint, burn, transfer)
- **spydra routes**: REST endpoints exposed to frontend

#### Frontend Components
- Uses existing API client (`@/lib/api`)
- Makes HTTP requests to backend `/api/spydra/*` endpoints
- No direct Fabric SDK or Spydra API calls

---

## Spydra Setup

### Step 1: Create Spydra Account

1. Visit [https://spydra.app](https://spydra.app)
2. Sign up for an account
3. Verify your email

### Step 2: Create a Project

1. Log in to Spydra dashboard
2. Click **"Create Project"**
3. Fill in project details:
   - **Name**: IMEC RWA Marketplace
   - **Description**: Real World Asset tokenization platform
   - **Blockchain**: Hyperledger Fabric
4. Note your **Project ID**

### Step 3: Create a Network

1. Navigate to your project
2. Click **"Create Network"**
3. Configure network:
   - **Network Type**: Private
   - **Consensus**: Raft
   - **Peers**: 2 or more
   - **Organizations**: 1 (can add more later)
4. Wait for network provisioning (5-10 minutes)
5. Note your **Network ID**

### Step 4: Create an Application

1. Go to **Applications** tab
2. Click **"Create Application"**
3. Configure application:
   - **Name**: RWA Marketplace App
   - **Type**: Asset Management
4. Deploy application
5. Note your **App ID**

### Step 5: Define Asset Schema

1. Go to **Schemas** tab
2. Click **"Create Schema"**
3. Define asset schema:

```json
{
  "name": "RWAAssetSchema",
  "version": "1.0",
  "fields": [
    {
      "name": "name",
      "type": "string",
      "required": true
    },
    {
      "name": "symbol",
      "type": "string",
      "required": true
    },
    {
      "name": "description",
      "type": "string",
      "required": true
    },
    {
      "name": "assetType",
      "type": "string",
      "required": true
    },
    {
      "name": "totalValue",
      "type": "number",
      "required": true
    },
    {
      "name": "totalSupply",
      "type": "number",
      "required": true
    },
    {
      "name": "pricePerToken",
      "type": "number",
      "required": true
    },
    {
      "name": "status",
      "type": "string",
      "required": true
    },
    {
      "name": "metadata",
      "type": "object",
      "required": false
    }
  ]
}
```

4. Save and note your **Asset Schema ID**

### Step 6: Generate API Key

1. Go to **Settings** → **API Keys**
2. Click **"Generate API Key"**
3. Copy and securely store your API key
4. ⚠️ **Important**: API keys are shown only once!

### Step 7: Configure Backend

Update `backend/.env` with your Spydra credentials:

```env
# Spydra Configuration
SPYDRA_API_KEY=your-api-key-here
SPYDRA_PROJECT_ID=your-project-id-here
SPYDRA_NETWORK_ID=your-network-id-here
SPYDRA_APP_ID=your-app-id-here
SPYDRA_ASSET_SCHEMA_ID=your-schema-id-here
```

### Step 8: Test Connection

```bash
cd backend
curl http://localhost:3001/api/spydra/health
```

Expected response:
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

## Backend Integration

### File Structure

```
backend/src/spydra/
├── config.js           # Spydra configuration
├── spydraClient.js     # HTTP client wrapper
├── assetService.js     # Asset operations
└── tokenService.js     # Token operations

backend/src/routes/
└── spydra.js           # API routes
```

### Configuration (config.js)

The configuration module loads environment variables and provides helper functions:

```javascript
const config = require('./spydra/config');

// Access configuration
console.log(config.projectId);
console.log(config.networkId);

// Build URLs
const url = config.buildUrl('/assets', { assetId: '123' });

// Get headers
const headers = config.getHeaders();
```

### Spydra Client (spydraClient.js)

The client handles all HTTP communication with Spydra:

```javascript
const spydraClient = require('./spydra/spydraClient');

// GET request
const assets = await spydraClient.get('/assets');

// POST request
const result = await spydraClient.post('/assets', assetData);

// Health check
const health = await spydraClient.healthCheck();

// Wait for transaction
const tx = await spydraClient.waitForTransaction(txId);
```

### Asset Service (assetService.js)

High-level asset operations:

```javascript
const assetService = require('./spydra/assetService');

// Create asset
const asset = await assetService.createAsset({
  name: "Luxury Apartment NYC",
  symbol: "LUXAPT",
  description: "Premium apartment in Manhattan",
  assetType: "real-estate",
  totalValue: 5000000,
  totalSupply: 10000,
  metadata: {
    address: "123 Park Ave, NY",
    sqft: 2500,
    bedrooms: 3
  }
}, creatorWallet);

// Get asset
const asset = await assetService.getAsset(assetId);

// Update asset
await assetService.updateAsset(assetId, updates, updaterWallet);

// Publish asset
await assetService.publishAsset(assetId, publisherWallet);

// List assets
const assets = await assetService.listAssets({ status: 'published' });
```

### Token Service (tokenService.js)

Token lifecycle operations:

```javascript
const tokenService = require('./spydra/tokenService');

// Mint tokens
await tokenService.mintTokens({
  assetId: 'asset-123',
  recipientWallet: 'wallet-456',
  amount: 1000,
  metadata: { purpose: 'initial distribution' }
}, minterWallet);

// Transfer tokens
await tokenService.transferTokens({
  assetId: 'asset-123',
  fromWallet: 'wallet-A',
  toWallet: 'wallet-B',
  amount: 100
});

// Get balance
const balance = await tokenService.getBalance('wallet-456');

// Get token holders
const holders = await tokenService.getTokenHolders('asset-123');
```

### API Routes

All Spydra routes are prefixed with `/api/spydra`:

#### Public Routes (No Authentication)

```javascript
GET  /api/spydra/health              // Health check
GET  /api/spydra/assets              // List published assets
GET  /api/spydra/assets/:id          // Get asset details
GET  /api/spydra/assets/:id/history  // Get asset history
GET  /api/spydra/tokens/:assetId/holders     // Get token holders
GET  /api/spydra/tokens/:assetId/supply      // Get token supply
GET  /api/spydra/wallets/:walletId/balance   // Get wallet balance
GET  /api/spydra/wallets/:walletId/transactions  // Get transactions
```

#### Admin Routes (Requires API Key)

```javascript
POST /api/spydra/assets               // Create asset
PUT  /api/spydra/assets/:id           // Update asset
POST /api/spydra/assets/:id/publish   // Publish asset
POST /api/spydra/assets/:id/metadata  // Add metadata
POST /api/spydra/tokens/mint          // Mint tokens
POST /api/spydra/tokens/burn          // Burn tokens
POST /api/spydra/tokens/transfer      // Transfer tokens
POST /api/spydra/tokens/purchase      // Record purchase
```

---

## Frontend Integration

### API Client Setup

Use the existing API client in `frontend/src/lib/api.ts`:

```typescript
// Add Spydra endpoints
export const spydraApi = {
  // Assets
  getAssets: () => axios.get('/api/spydra/assets'),
  getAsset: (id: string) => axios.get(`/api/spydra/assets/${id}`),
  createAsset: (data: any) => axios.post('/api/spydra/assets', data),
  updateAsset: (id: string, data: any) => 
    axios.put(`/api/spydra/assets/${id}`, data),
  publishAsset: (id: string, publisherWallet: string) =>
    axios.post(`/api/spydra/assets/${id}/publish`, { publisherWallet }),
  
  // Tokens
  mintTokens: (data: any) => axios.post('/api/spydra/tokens/mint', data),
  transferTokens: (data: any) => 
    axios.post('/api/spydra/tokens/transfer', data),
  getBalance: (walletId: string) => 
    axios.get(`/api/spydra/wallets/${walletId}/balance`),
  
  // Queries
  getTokenHolders: (assetId: string) =>
    axios.get(`/api/spydra/tokens/${assetId}/holders`),
  getTransactions: (walletId: string) =>
    axios.get(`/api/spydra/wallets/${walletId}/transactions`),
};
```

### React Components

#### Create Asset Form

```typescript
// components/CreateAssetForm.tsx
'use client';

import { useState } from 'react';
import { spydraApi } from '@/lib/api';

export default function CreateAssetForm() {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    assetType: 'real-estate',
    totalValue: 0,
    totalSupply: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await spydraApi.createAsset({
        asset: formData,
        creatorWallet: 'admin-wallet-123', // Get from auth context
      });
      
      console.log('Asset created:', result.data);
      alert('Asset created successfully!');
    } catch (error) {
      console.error('Error creating asset:', error);
      alert('Failed to create asset');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Asset Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Symbol</label>
        <input
          type="text"
          value={formData.symbol}
          onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300"
          rows={3}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Asset Type</label>
        <select
          value={formData.assetType}
          onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300"
        >
          <option value="real-estate">Real Estate</option>
          <option value="art">Art</option>
          <option value="commodity">Commodity</option>
          <option value="equipment">Equipment</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium">Total Value ($)</label>
        <input
          type="number"
          value={formData.totalValue}
          onChange={(e) => setFormData({ ...formData, totalValue: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Total Supply (tokens)</label>
        <input
          type="number"
          value={formData.totalSupply}
          onChange={(e) => setFormData({ ...formData, totalSupply: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300"
          required
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Create Asset
      </button>
    </form>
  );
}
```

#### Mint Tokens Form

```typescript
// components/MintTokensForm.tsx
'use client';

import { useState } from 'react';
import { spydraApi } from '@/lib/api';

export default function MintTokensForm({ assetId }: { assetId: string }) {
  const [amount, setAmount] = useState(0);
  const [recipientWallet, setRecipientWallet] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await spydraApi.mintTokens({
        assetId,
        recipientWallet,
        amount,
        minterWallet: 'admin-wallet-123', // Get from auth context
      });
      
      console.log('Tokens minted:', result.data);
      alert(`Successfully minted ${amount} tokens!`);
      setAmount(0);
      setRecipientWallet('');
    } catch (error) {
      console.error('Error minting tokens:', error);
      alert('Failed to mint tokens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleMint} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Recipient Wallet</label>
        <input
          type="text"
          value={recipientWallet}
          onChange={(e) => setRecipientWallet(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300"
          placeholder="wallet-address-here"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300"
          min="1"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? 'Minting...' : 'Mint Tokens'}
      </button>
    </form>
  );
}
```

#### Asset List Component

```typescript
// components/AssetList.tsx
'use client';

import { useState, useEffect } from 'react';
import { spydraApi } from '@/lib/api';

export default function AssetList() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const response = await spydraApi.getAssets();
      setAssets(response.data.data);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading assets...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.map((asset: any) => (
        <div key={asset.assetId} className="border rounded-lg p-4">
          <h3 className="text-lg font-bold">{asset.name}</h3>
          <p className="text-sm text-gray-600">{asset.symbol}</p>
          <p className="mt-2">{asset.description}</p>
          <div className="mt-4 flex justify-between">
            <span className="text-sm">Value: ${asset.totalValue.toLocaleString()}</span>
            <span className="text-sm">Supply: {asset.totalSupply}</span>
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md">
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}
```

#### Wallet Balance Component

```typescript
// components/WalletBalance.tsx
'use client';

import { useState, useEffect } from 'react';
import { spydraApi } from '@/lib/api';

export default function WalletBalance({ walletId }: { walletId: string }) {
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalance();
  }, [walletId]);

  const loadBalance = async () => {
    try {
      const response = await spydraApi.getBalance(walletId);
      setBalance(response.data.data);
    } catch (error) {
      console.error('Error loading balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading balance...</div>;
  }

  if (!balance) {
    return <div>No balance data available</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Wallet Balance</h2>
      <div className="space-y-2">
        {balance.balances.map((item: any) => (
          <div key={item.assetId} className="flex justify-between border-b pb-2">
            <span className="font-medium">{item.assetName}</span>
            <span>{item.balance} tokens</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Total Assets: {balance.totalAssets}
      </div>
    </div>
  );
}
```

---

## API Reference

### Complete Endpoint List

#### Asset Operations

**List Assets**
```
GET /api/spydra/assets
Query Parameters:
  - assetType: string (optional)
  - limit: number (default: 100)
  - offset: number (default: 0)
  
Response:
{
  "success": true,
  "data": [
    {
      "assetId": "asset-123",
      "name": "Luxury Apartment",
      "symbol": "LUXAPT",
      "description": "...",
      "assetType": "real-estate",
      "totalValue": 5000000,
      "totalSupply": 10000,
      "pricePerToken": 500,
      "status": "published"
    }
  ],
  "count": 1,
  "total": 1
}
```

**Get Asset**
```
GET /api/spydra/assets/:id

Response:
{
  "success": true,
  "data": {
    "assetId": "asset-123",
    "name": "Luxury Apartment",
    ...
  }
}
```

**Create Asset** (Admin)
```
POST /api/spydra/assets
Headers:
  X-API-Key: your-api-key

Body:
{
  "asset": {
    "name": "Luxury Apartment",
    "symbol": "LUXAPT",
    "description": "Premium apartment",
    "assetType": "real-estate",
    "totalValue": 5000000,
    "totalSupply": 10000,
    "metadata": {}
  },
  "creatorWallet": "wallet-123"
}

Response:
{
  "success": true,
  "data": {
    "assetId": "asset-123",
    "transactionId": "tx-456",
    "asset": { ... }
  }
}
```

**Update Asset** (Admin)
```
PUT /api/spydra/assets/:id
Headers:
  X-API-Key: your-api-key

Body:
{
  "updates": {
    "description": "Updated description",
    "metadata": {}
  },
  "updaterWallet": "wallet-123"
}

Response:
{
  "success": true,
  "data": {
    "assetId": "asset-123",
    "transactionId": "tx-789",
    "asset": { ... }
  }
}
```

**Publish Asset** (Admin)
```
POST /api/spydra/assets/:id/publish
Headers:
  X-API-Key: your-api-key

Body:
{
  "publisherWallet": "wallet-123"
}

Response:
{
  "success": true,
  "data": {
    "assetId": "asset-123",
    "transactionId": "tx-101",
    "asset": { ... }
  }
}
```

#### Token Operations

**Mint Tokens** (Admin)
```
POST /api/spydra/tokens/mint
Headers:
  X-API-Key: your-api-key

Body:
{
  "assetId": "asset-123",
  "recipientWallet": "wallet-456",
  "amount": 1000,
  "minterWallet": "admin-wallet",
  "metadata": {}
}

Response:
{
  "success": true,
  "data": {
    "transactionId": "tx-202",
    "assetId": "asset-123",
    "recipientWallet": "wallet-456",
    "amount": 1000,
    "newBalance": 1000
  }
}
```

**Burn Tokens** (Admin)
```
POST /api/spydra/tokens/burn
Headers:
  X-API-Key: your-api-key

Body:
{
  "assetId": "asset-123",
  "holderWallet": "wallet-456",
  "amount": 100,
  "burnerWallet": "admin-wallet",
  "reason": "Token redemption"
}

Response:
{
  "success": true,
  "data": {
    "transactionId": "tx-303",
    "assetId": "asset-123",
    "holderWallet": "wallet-456",
    "amount": 100,
    "newBalance": 900
  }
}
```

**Transfer Tokens** (Admin)
```
POST /api/spydra/tokens/transfer
Headers:
  X-API-Key: your-api-key

Body:
{
  "assetId": "asset-123",
  "fromWallet": "wallet-A",
  "toWallet": "wallet-B",
  "amount": 50,
  "metadata": {}
}

Response:
{
  "success": true,
  "data": {
    "transactionId": "tx-404",
    "assetId": "asset-123",
    "fromWallet": "wallet-A",
    "toWallet": "wallet-B",
    "amount": 50,
    "fromBalance": 850,
    "toBalance": 50
  }
}
```

#### Query Operations

**Get Balance**
```
GET /api/spydra/wallets/:walletId/balance
Query Parameters:
  - assetId: string (optional, filter by asset)

Response:
{
  "success": true,
  "data": {
    "walletId": "wallet-456",
    "balances": [
      {
        "assetId": "asset-123",
        "assetName": "Luxury Apartment",
        "balance": 900
      }
    ],
    "totalAssets": 1
  }
}
```

**Get Token Holders**
```
GET /api/spydra/tokens/:assetId/holders

Response:
{
  "success": true,
  "data": [
    {
      "wallet": "wallet-A",
      "balance": 500
    },
    {
      "wallet": "wallet-B",
      "balance": 300
    }
  ],
  "count": 2
}
```

**Get Token Supply**
```
GET /api/spydra/tokens/:assetId/supply

Response:
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

**Get Transaction History**
```
GET /api/spydra/wallets/:walletId/transactions
Query Parameters:
  - assetId: string (optional)
  - limit: number (default: 50)
  - offset: number (default: 0)

Response:
{
  "success": true,
  "data": [
    {
      "transactionId": "tx-404",
      "type": "transfer",
      "assetId": "asset-123",
      "fromWallet": "wallet-A",
      "toWallet": "wallet-B",
      "amount": 50,
      "timestamp": "2025-11-24T10:30:00Z"
    }
  ],
  "count": 1,
  "total": 1
}
```

---

## Example Workflows

### Workflow 1: Create and Tokenize an Asset

```javascript
// Step 1: Create the asset
const assetResult = await spydraApi.createAsset({
  asset: {
    name: "Office Building Downtown",
    symbol: "OFCBLD",
    description: "Commercial property in city center",
    assetType: "real-estate",
    totalValue: 10000000, // $10M
    totalSupply: 100000,  // 100,000 tokens
    metadata: {
      address: "456 Business St",
      sqft: 50000,
      floors: 10
    }
  },
  creatorWallet: "admin-wallet-123"
});

const assetId = assetResult.data.data.assetId;
console.log('Asset created:', assetId);

// Step 2: Mint initial token supply
await spydraApi.mintTokens({
  assetId,
  recipientWallet: "treasury-wallet",
  amount: 100000, // Mint all tokens to treasury
  minterWallet: "admin-wallet-123"
});

console.log('Tokens minted to treasury');

// Step 3: Publish the asset
await spydraApi.publishAsset(assetId, "admin-wallet-123");

console.log('Asset published and ready for investment');
```

### Workflow 2: Investor Purchase Flow

```javascript
// Step 1: Investor views available assets
const assetsResponse = await spydraApi.getAssets();
const assets = assetsResponse.data.data;

// Step 2: Investor selects an asset
const selectedAsset = assets[0];
const assetId = selectedAsset.assetId;

// Step 3: Check token holders and availability
const holdersResponse = await spydraApi.getTokenHolders(assetId);
const treasuryHolder = holdersResponse.data.data.find(
  h => h.wallet === 'treasury-wallet'
);

if (treasuryHolder.balance >= 100) {
  // Step 4: Transfer tokens from treasury to investor
  const purchaseResult = await spydraApi.transferTokens({
    assetId,
    fromWallet: "treasury-wallet",
    toWallet: "investor-wallet-789",
    amount: 100,
    metadata: {
      purchasePrice: 500,
      totalValue: 50000,
      paymentMethod: "bank_transfer"
    }
  });
  
  console.log('Purchase complete:', purchaseResult.data.data.transactionId);
  
  // Step 5: Verify investor's new balance
  const balanceResponse = await spydraApi.getBalance("investor-wallet-789");
  console.log('Investor balance:', balanceResponse.data.data);
}
```

### Workflow 3: Portfolio Management

```javascript
// Get investor's complete portfolio
const investorWallet = "investor-wallet-789";

// Step 1: Get all token balances
const balanceResponse = await spydraApi.getBalance(investorWallet);
const portfolio = balanceResponse.data.data;

console.log('Portfolio:');
portfolio.balances.forEach(item => {
  console.log(`${item.assetName}: ${item.balance} tokens`);
});

// Step 2: Get transaction history
const txResponse = await spydraApi.getTransactions(investorWallet);
const transactions = txResponse.data.data;

console.log('Recent transactions:', transactions.length);

// Step 3: Calculate total portfolio value
let totalValue = 0;
for (const holding of portfolio.balances) {
  const assetResponse = await spydraApi.getAsset(holding.assetId);
  const asset = assetResponse.data.data;
  const value = holding.balance * asset.pricePerToken;
  totalValue += value;
  
  console.log(`${asset.name}: $${value.toLocaleString()}`);
}

console.log(`Total portfolio value: $${totalValue.toLocaleString()}`);
```

### Workflow 4: Admin Asset Management

```javascript
// Step 1: Get all assets (including drafts)
const assetsResponse = await spydraApi.getAssets();
const allAssets = assetsResponse.data.data;

// Step 2: Update an asset
const assetToUpdate = allAssets.find(a => a.status === 'draft');
await spydraApi.updateAsset(assetToUpdate.assetId, {
  updates: {
    description: "Updated with more details",
    metadata: {
      ...assetToUpdate.metadata,
      lastInspection: "2025-11-20",
      condition: "excellent"
    }
  },
  updaterWallet: "admin-wallet-123"
});

// Step 3: Get asset history
const historyResponse = await axios.get(
  `/api/spydra/assets/${assetToUpdate.assetId}/history`
);
console.log('Asset history:', historyResponse.data.data);

// Step 4: Check token supply
const supplyResponse = await axios.get(
  `/api/spydra/tokens/${assetToUpdate.assetId}/supply`
);
console.log('Token supply:', supplyResponse.data.data);
```

---

## Best Practices

### 1. Wallet Management

**Create Unique Wallet IDs**
```javascript
// Use a consistent format
const walletId = `user-${userId}-wallet`;
const walletId = `investor-${investorId}-wallet`;
const walletId = `admin-wallet-${adminId}`;
```

**Store Wallet Mappings**
```javascript
// In your database, maintain user → wallet mapping
const userWalletMapping = {
  userId: "user-123",
  walletId: "wallet-abc-def",
  createdAt: "2025-11-24T00:00:00Z"
};
```

### 2. Error Handling

**Always Wrap API Calls**
```javascript
async function createAssetSafely(assetData, creatorWallet) {
  try {
    const result = await spydraApi.createAsset({
      asset: assetData,
      creatorWallet
    });
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Asset creation failed:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
}
```

**Handle Timeout Scenarios**
```javascript
// Set reasonable timeouts
const result = await axios.post('/api/spydra/tokens/mint', data, {
  timeout: 60000 // 60 seconds for blockchain operations
});
```

### 3. Transaction Confirmation

**Always Wait for Confirmation**
```javascript
// In backend
const result = await tokenService.mintTokens(mintData, minterWallet);
// Service automatically waits for transaction confirmation

// Verify in frontend
if (result.data.data.transactionId) {
  // Transaction confirmed
  console.log('Transaction confirmed:', result.data.data.transactionId);
}
```

### 4. Data Validation

**Validate Before Sending**
```javascript
function validateAssetData(asset) {
  const required = ['name', 'symbol', 'description', 'assetType', 'totalValue', 'totalSupply'];
  const missing = required.filter(field => !asset[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  if (asset.totalValue <= 0) {
    throw new Error('Total value must be greater than 0');
  }
  
  if (asset.totalSupply <= 0) {
    throw new Error('Total supply must be greater than 0');
  }
  
  return true;
}
```

### 5. Caching Strategy

**Cache Asset Data**
```javascript
// Cache published assets for 5 minutes
const CACHE_TTL = 5 * 60 * 1000;
let assetsCache = null;
let cacheTimestamp = 0;

async function getAssetsCached() {
  const now = Date.now();
  
  if (assetsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return assetsCache;
  }
  
  const response = await spydraApi.getAssets();
  assetsCache = response.data.data;
  cacheTimestamp = now;
  
  return assetsCache;
}
```

### 6. Security

**Protect API Keys**
```javascript
// Never expose API keys in frontend
// All admin operations go through backend

// ❌ DON'T DO THIS
const apiKey = process.env.NEXT_PUBLIC_SPYDRA_API_KEY; // Wrong!

// ✅ DO THIS
// Backend handles API key authentication
const result = await fetch('/api/spydra/assets', {
  headers: {
    'X-API-Key': process.env.AUTH_API_KEY // Backend API key
  }
});
```

**Validate User Permissions**
```javascript
// Backend middleware
async function checkAssetOwnership(req, res, next) {
  const { assetId } = req.params;
  const { userId } = req.user;
  
  // Verify user owns or has permission for this asset
  const asset = await spydraApi.getAsset(assetId);
  
  if (asset.data.data.metadata.creator !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Permission denied'
    });
  }
  
  next();
}
```

### 7. Logging and Monitoring

**Log Important Events**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'spydra.log' })
  ]
});

// Log asset creation
logger.info('Asset created', {
  assetId: result.assetId,
  creatorWallet: creatorWallet,
  transactionId: result.transactionId,
  timestamp: new Date().toISOString()
});
```

### 8. Testing

**Write Integration Tests**
```javascript
describe('Spydra Integration', () => {
  it('should create an asset', async () => {
    const result = await spydraApi.createAsset({
      asset: testAssetData,
      creatorWallet: testWallet
    });
    
    expect(result.data.success).toBe(true);
    expect(result.data.data.assetId).toBeDefined();
  });
  
  it('should mint tokens', async () => {
    const result = await spydraApi.mintTokens({
      assetId: testAssetId,
      recipientWallet: testWallet,
      amount: 100,
      minterWallet: adminWallet
    });
    
    expect(result.data.success).toBe(true);
    expect(result.data.data.amount).toBe(100);
  });
});
```

---

## Troubleshooting

### Common Issues

#### 1. API Key Authentication Failure

**Error**: `401 Unauthorized`

**Solution**:
```bash
# Check environment variables
cat backend/.env | grep SPYDRA_API_KEY

# Verify API key in Spydra dashboard
# Regenerate if necessary

# Test connection
curl -H "X-API-Key: YOUR_API_KEY" \
  https://api.spydra.io/v2/projects/YOUR_PROJECT_ID/networks/YOUR_NETWORK_ID/apps/YOUR_APP_ID/assets
```

#### 2. Network Configuration Issues

**Error**: `Network ID not found`

**Solution**:
- Log in to Spydra dashboard
- Verify network is running (status should be "Active")
- Check that network ID in `.env` matches dashboard
- Wait for network provisioning to complete (5-10 minutes)

#### 3. Schema Validation Errors

**Error**: `Schema validation failed`

**Solution**:
```javascript
// Ensure all required fields are present
const assetData = {
  name: "Required",
  symbol: "Required",
  description: "Required",
  assetType: "Required",
  totalValue: 123, // Must be number
  totalSupply: 456, // Must be number
  metadata: {} // Optional but must be object if provided
};
```

#### 4. Transaction Timeout

**Error**: `Transaction confirmation timeout`

**Solution**:
- Increase timeout value in `spydraClient.js`
- Check Spydra network status
- Verify peers are running
- Check transaction status manually:
```javascript
const tx = await spydraClient.get(
  config.endpoints.getTransaction,
  { txId: 'your-tx-id' }
);
console.log('Transaction status:', tx.status);
```

#### 5. Balance Mismatch

**Issue**: Balance not updating after transfer

**Solution**:
- Wait for transaction confirmation (2-5 seconds)
- Clear frontend cache
- Query balance directly:
```javascript
const balance = await spydraApi.getBalance(walletId);
console.log('Current balance:', balance.data.data);
```

#### 6. CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:
```javascript
// backend/src/server.js
app.use(cors({
  origin: process.env.CORS_ORIGIN, // http://localhost:3000
  credentials: true,
}));
```

### Debug Mode

Enable debug logging:

```javascript
// backend/src/spydra/config.js
const config = {
  // ...
  debug: process.env.SPYDRA_DEBUG === 'true',
  // ...
};

// backend/.env
SPYDRA_DEBUG=true
```

### Health Check Script

```bash
# backend/scripts/test-spydra.js
const spydraClient = require('../src/spydra/spydraClient');

async function healthCheck() {
  try {
    const health = await spydraClient.healthCheck();
    console.log('✓ Spydra health check passed');
    console.log(health);
  } catch (error) {
    console.error('✗ Spydra health check failed');
    console.error(error.message);
    process.exit(1);
  }
}

healthCheck();
```

Run it:
```bash
node backend/scripts/test-spydra.js
```

---

## Migration from Fabric SDK

If you're migrating from direct Fabric SDK usage:

### Before (Fabric SDK)
```javascript
const gateway = require('./fabric/gateway');

// Create asset
await gateway.submitTransaction(
  userId,
  'CreateAsset',
  assetId,
  JSON.stringify(assetData)
);

// Query asset
const result = await gateway.evaluateTransaction(
  userId,
  'GetAsset',
  assetId
);
```

### After (Spydra)
```javascript
const assetService = require('./spydra/assetService');

// Create asset
await assetService.createAsset(assetData, creatorWallet);

// Query asset
const result = await assetService.getAsset(assetId);
```

### Migration Checklist

- [ ] Set up Spydra account and network
- [ ] Configure environment variables
- [ ] Test Spydra connectivity
- [ ] Update backend routes to use Spydra services
- [ ] Update frontend API calls
- [ ] Test all operations (create, mint, transfer, query)
- [ ] Update documentation
- [ ] Train team on new workflow

---

## Support

### Spydra Support
- **Documentation**: https://docs.spydra.app
- **Support Email**: support@spydra.app
- **Community**: https://discord.gg/spydra

### IMEC Marketplace Support
- **Email**: info@imecapitaltokenization.com
- **Phone**: (248) 678-4819

---

**Last Updated**: November 24, 2025
**Version**: 1.0.0
