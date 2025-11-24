# Spydra Integration - Quick Start Guide

## 🚀 Get Started in 10 Minutes

This guide will help you integrate Spydra's managed Hyperledger Fabric into your RWA marketplace quickly.

---

## Prerequisites

- Node.js 16+ installed
- Existing IMEC RWA Marketplace project
- Spydra account (sign up at [https://spydra.app](https://spydra.app))

---

## Step 1: Spydra Setup (5 minutes)

### 1.1 Create Account
```
1. Visit https://spydra.app
2. Click "Sign Up"
3. Verify your email
4. Log in to dashboard
```

### 1.2 Create Project and Network
```
1. Dashboard → "Create Project"
   - Name: IMEC RWA Marketplace
   - Blockchain: Hyperledger Fabric
   
2. Project → "Create Network"
   - Type: Private
   - Peers: 2
   - Wait 5-10 minutes for provisioning
   
3. Networks → "Create Application"
   - Name: RWA Marketplace App
   - Type: Asset Management
   
4. Applications → "Create Schema"
   - Use the schema below
   
5. Settings → "Generate API Key"
   - Copy and save securely
```

### 1.3 Asset Schema
```json
{
  "name": "RWAAssetSchema",
  "version": "1.0",
  "fields": [
    { "name": "name", "type": "string", "required": true },
    { "name": "symbol", "type": "string", "required": true },
    { "name": "description", "type": "string", "required": true },
    { "name": "assetType", "type": "string", "required": true },
    { "name": "totalValue", "type": "number", "required": true },
    { "name": "totalSupply", "type": "number", "required": true },
    { "name": "pricePerToken", "type": "number", "required": true },
    { "name": "status", "type": "string", "required": true },
    { "name": "metadata", "type": "object", "required": false }
  ]
}
```

---

## Step 2: Backend Configuration (2 minutes)

### 2.1 Update Environment Variables

Edit `backend/.env`:

```env
# Spydra Configuration
SPYDRA_API_KEY=pk_test_abc123def456...
SPYDRA_PROJECT_ID=proj_abc123
SPYDRA_NETWORK_ID=net_xyz789
SPYDRA_APP_ID=app_456def
SPYDRA_ASSET_SCHEMA_ID=schema_789ghi
```

Replace with your actual values from Spydra dashboard.

### 2.2 Install Dependencies (if needed)

```bash
cd backend
npm install axios
```

### 2.3 Start Backend

```bash
npm run dev
# or
npm start
```

### 2.4 Test Connection

```bash
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

✅ If you see this, Spydra is connected!

---

## Step 3: Test API Endpoints (3 minutes)

### 3.1 Create an Asset

```bash
curl -X POST http://localhost:3001/api/spydra/assets \
  -H "Content-Type: application/json" \
  -H "X-API-Key: imec-2212-RWA-Market-26" \
  -d '{
    "asset": {
      "name": "Test Property",
      "symbol": "TESTPROP",
      "description": "Test real estate asset",
      "assetType": "real-estate",
      "totalValue": 1000000,
      "totalSupply": 10000,
      "metadata": {
        "location": "Test City"
      }
    },
    "creatorWallet": "admin-wallet-123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "assetId": "asset-abc123",
    "transactionId": "tx-def456",
    "asset": { ... }
  }
}
```

✅ Save the `assetId` for next steps.

### 3.2 Mint Tokens

```bash
curl -X POST http://localhost:3001/api/spydra/tokens/mint \
  -H "Content-Type: application/json" \
  -H "X-API-Key: imec-2212-RWA-Market-26" \
  -d '{
    "assetId": "asset-abc123",
    "recipientWallet": "treasury-wallet",
    "amount": 10000,
    "minterWallet": "admin-wallet-123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "transactionId": "tx-ghi789",
    "amount": 10000,
    "newBalance": 10000
  }
}
```

✅ Tokens minted successfully!

### 3.3 Get Balance

```bash
curl http://localhost:3001/api/spydra/wallets/treasury-wallet/balance
```

Response:
```json
{
  "success": true,
  "data": {
    "walletId": "treasury-wallet",
    "balances": [
      {
        "assetId": "asset-abc123",
        "assetName": "Test Property",
        "balance": 10000
      }
    ],
    "totalAssets": 1
  }
}
```

✅ Balance confirmed!

### 3.4 List Assets

```bash
curl http://localhost:3001/api/spydra/assets
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "assetId": "asset-abc123",
      "name": "Test Property",
      "symbol": "TESTPROP",
      ...
    }
  ],
  "count": 1
}
```

✅ Asset is on the blockchain!

---

## Step 4: Frontend Integration (Optional)

### 4.1 Update API Client

Edit `frontend/src/lib/api.ts`:

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const spydraApi = {
  // Assets
  getAssets: () => axios.get(`${API_URL}/spydra/assets`),
  getAsset: (id: string) => axios.get(`${API_URL}/spydra/assets/${id}`),
  createAsset: (data: any) => 
    axios.post(`${API_URL}/spydra/assets`, data, {
      headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY }
    }),
  
  // Tokens
  mintTokens: (data: any) =>
    axios.post(`${API_URL}/spydra/tokens/mint`, data, {
      headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY }
    }),
  transferTokens: (data: any) =>
    axios.post(`${API_URL}/spydra/tokens/transfer`, data, {
      headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY }
    }),
  
  // Queries
  getBalance: (walletId: string) =>
    axios.get(`${API_URL}/spydra/wallets/${walletId}/balance`),
  getTransactions: (walletId: string) =>
    axios.get(`${API_URL}/spydra/wallets/${walletId}/transactions`),
};
```

### 4.2 Use in Components

```typescript
// In any component
import { spydraApi } from '@/lib/api';

// Get assets
const response = await spydraApi.getAssets();
const assets = response.data.data;

// Get balance
const balance = await spydraApi.getBalance('wallet-123');
console.log('Balance:', balance.data.data);
```

---

## Complete Example: End-to-End Flow

### Scenario: Create Asset → Mint Tokens → Transfer to Investor

```javascript
// 1. Create Asset
const assetResult = await fetch('http://localhost:3001/api/spydra/assets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'imec-2212-RWA-Market-26'
  },
  body: JSON.stringify({
    asset: {
      name: "Office Building Downtown",
      symbol: "OFCBLD",
      description: "Commercial property",
      assetType: "real-estate",
      totalValue: 5000000,
      totalSupply: 50000
    },
    creatorWallet: "admin-wallet"
  })
});

const { data: { assetId } } = await assetResult.json();
console.log('✓ Asset created:', assetId);

// 2. Mint Tokens to Treasury
await fetch('http://localhost:3001/api/spydra/tokens/mint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'imec-2212-RWA-Market-26'
  },
  body: JSON.stringify({
    assetId,
    recipientWallet: "treasury",
    amount: 50000,
    minterWallet: "admin-wallet"
  })
});

console.log('✓ Tokens minted to treasury');

// 3. Transfer Tokens to Investor
await fetch('http://localhost:3001/api/spydra/tokens/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'imec-2212-RWA-Market-26'
  },
  body: JSON.stringify({
    assetId,
    fromWallet: "treasury",
    toWallet: "investor-001",
    amount: 1000
  })
});

console.log('✓ Tokens transferred to investor');

// 4. Check Investor Balance
const balanceResult = await fetch(
  'http://localhost:3001/api/spydra/wallets/investor-001/balance'
);
const balance = await balanceResult.json();

console.log('✓ Investor balance:', balance.data.balances);
```

Expected output:
```
✓ Asset created: asset-abc123
✓ Tokens minted to treasury
✓ Tokens transferred to investor
✓ Investor balance: [{ assetId: 'asset-abc123', balance: 1000 }]
```

---

## Verification Checklist

- [ ] Spydra account created
- [ ] Project and network set up
- [ ] API key generated and configured
- [ ] Backend running and healthy
- [ ] Health check passes
- [ ] Can create assets
- [ ] Can mint tokens
- [ ] Can transfer tokens
- [ ] Can query balances
- [ ] Frontend integrated (optional)

---

## Troubleshooting

### "API Key Invalid"
```
Solution: Check SPYDRA_API_KEY in .env matches dashboard
```

### "Network not found"
```
Solution: Verify SPYDRA_NETWORK_ID and ensure network is Active
```

### "Schema validation failed"
```
Solution: Ensure all required fields are present in asset data
```

### Connection timeout
```
Solution: Check network status in Spydra dashboard
```

---

## Next Steps

1. **Read Full Documentation**: See `SPYDRA_INTEGRATION_GUIDE.md`
2. **Explore API**: Test all endpoints with Postman or curl
3. **Build UI**: Create frontend components for your users
4. **Add Features**: Implement portfolio view, transaction history, etc.
5. **Deploy**: Move to production with real Spydra network

---

## Support

**IMEC Support**
- Email: info@imecapitaltokenization.com
- Phone: (248) 678-4819

**Spydra Support**
- Docs: https://docs.spydra.app
- Email: support@spydra.app

---

## Resources

- **Full Integration Guide**: `SPYDRA_INTEGRATION_GUIDE.md`
- **API Examples**: `SPYDRA_API_EXAMPLES.md`
- **Architecture Docs**: `PROJECT_SUMMARY.md`
- **Spydra Documentation**: https://docs.spydra.app

---

**🎉 Congratulations! You've successfully integrated Spydra!**

Your RWA marketplace is now powered by managed Hyperledger Fabric infrastructure.

---

Last Updated: November 24, 2025
