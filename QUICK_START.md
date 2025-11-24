# Quick Start Guide

Get your IMEC RWA Marketplace up and running in minutes.

## Prerequisites Checklist

- [ ] Node.js >= 16.0.0 installed
- [ ] npm >= 8.0.0 installed
- [ ] Hyperledger Fabric 2.5.0 network running
- [ ] Fabric peer and CA accessible
- [ ] Chaincode deployed (see CHAINCODE_REFERENCE.md)

## 5-Minute Setup

### Step 1: Configure Fabric Connection (2 min)

1. Edit `backend/connection-org1.json`:
   - Update peer URLs
   - Update CA URLs
   - Replace TLS certificates with your network's certificates

```json
{
  "peers": {
    "peer0.org1.example.com": {
      "url": "grpcs://YOUR_PEER_URL:7051",
      ...
    }
  },
  "certificateAuthorities": {
    "ca.org1.example.com": {
      "url": "https://YOUR_CA_URL:7054",
      ...
    }
  }
}
```

### Step 2: Configure Environment Variables (1 min)

1. Backend:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` - **IMPORTANT:** Set a strong `AUTH_API_KEY`

```env
AUTH_API_KEY=your-secure-random-key-here
```

2. Frontend:
```bash
cd frontend
cp .env.local.example .env.local
```

Edit `frontend/.env.local` - Use the **same** API key:

```env
NEXT_PUBLIC_API_KEY=your-secure-random-key-here
```

### Step 3: Enroll Admin User (1 min)

```bash
cd backend
npm install
npm run enroll-admin
```

Expected output:
```
✓ Successfully enrolled admin user and imported into wallet
```

### Step 4: Start the Application (1 min)

**Option A: Using Startup Script (Recommended for Windows)**

```powershell
.\start.ps1
```

**Option B: Manual Start**

Terminal 1 (Backend):
```bash
cd backend
npm install
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
```

### Step 5: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## First-Time Setup Tasks

### 1. Test Fabric Connection

```bash
cd backend
node -e "const gateway = require('./src/fabric/gateway'); gateway.connect('admin').then(() => console.log('✓ Connected')).catch(e => console.error('✗ Error:', e.message))"
```

### 2. Create Your First Asset (via API)

Using cURL:

```bash
curl -X POST http://localhost:3001/api/admin/assets \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secure-random-key-here" \
  -d '{
    "name": "Test Asset",
    "description": "My first tokenized asset",
    "type": "real-estate",
    "location": "New York, NY",
    "value": 1000000,
    "images": ["https://images.unsplash.com/photo-1560518883-ce09059eeffa"],
    "metadata": {}
  }'
```

Or use the Admin UI at http://localhost:3000/admin

### 3. Mint Tokens for the Asset

```bash
curl -X POST http://localhost:3001/api/admin/tokens \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secure-random-key-here" \
  -d '{
    "assetId": "asset-id-from-previous-step",
    "totalSupply": 1000,
    "pricePerToken": 1000,
    "symbol": "IMEC",
    "name": "IMEC Token"
  }'
```

### 4. Publish the Asset

```bash
curl -X POST http://localhost:3001/api/admin/assets/{asset-id}/publish \
  -H "X-API-Key: your-secure-random-key-here"
```

### 5. View on Frontend

Visit http://localhost:3000 to see your published asset!

## Testing the Investor Flow

1. Go to http://localhost:3000/invest
2. Enter an investor ID (e.g., "investor001")
3. Select a token
4. Enter amount to purchase
5. Click "Purchase Tokens"
6. Transaction is recorded on Hyperledger Fabric blockchain!

## Running the Sync Service

To sync ledger data and generate public feed:

```bash
cd backend
npm run sync
```

For continuous sync (every 5 minutes):

```bash
npm run sync:continuous
```

## Troubleshooting

### "Identity admin does not exist in wallet"

**Solution:**
```bash
cd backend
npm run enroll-admin
```

### "Failed to connect to gateway"

**Checklist:**
- [ ] Is Fabric network running?
- [ ] Are peer and CA URLs correct in `connection-org1.json`?
- [ ] Are TLS certificates valid?
- [ ] Can you reach the peer/CA from your machine?

Test connection:
```bash
curl -k https://YOUR_CA_URL:7054/cainfo
```

### "API key required" or "Invalid API key"

**Solution:**
- Ensure `AUTH_API_KEY` in `backend/.env` matches `NEXT_PUBLIC_API_KEY` in `frontend/.env.local`
- Restart both backend and frontend after changing

### Frontend can't connect to backend

**Solution:**
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Default: `http://localhost:3001/api`
- Ensure backend is running on port 3001

### Port already in use

**Solution:**

Change ports in:

1. `backend/.env`:
```env
PORT=3002
```

2. `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

## Next Steps

1. **Deploy Chaincode**: Ensure your chaincode implements all required functions (see CHAINCODE_REFERENCE.md)

2. **Customize UI**: Edit frontend components in `frontend/src/components/`

3. **Add Market Integrations**: Add API keys to `backend/.env`:
   ```env
   COINGECKO_API_KEY=your-key
   COINMARKETCAP_API_KEY=your-key
   DEXSCREENER_API_KEY=your-key
   ```

4. **Set Up Production**: See README.md for Docker and PM2 deployment options

5. **Enable Spydra**: Add Spydra credentials to `backend/.env` for secondary indexing

## Useful Commands

```bash
# Backend
cd backend
npm run dev           # Start dev server
npm run sync          # Run sync once
npm run sync:continuous # Run sync continuously
npm run enroll-admin  # Enroll admin
npm run register-user user1 # Register new user

# Frontend
cd frontend
npm run dev           # Start dev server
npm run build         # Build for production
npm run start         # Start production server

# Docker
docker-compose up -d          # Start all services
docker-compose logs -f        # View logs
docker-compose down           # Stop all services
docker-compose restart        # Restart services

# PM2 (Production)
pm2 start ecosystem.config.js # Start with PM2
pm2 status                    # Check status
pm2 logs                      # View logs
pm2 restart all               # Restart all
pm2 stop all                  # Stop all
```

## Getting Help

1. Check logs:
   - Backend: Look at terminal output
   - Fabric: Check peer/orderer logs

2. Verify chaincode:
```bash
peer chaincode query -C mychannel -n imecChaincode -c '{"Args":["GetAllAssets"]}'
```

3. Test API health:
```bash
curl http://localhost:3001/health
```

## Sample Test Workflow

```bash
# 1. Create asset
curl -X POST http://localhost:3001/api/admin/assets \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-key" \
  -d '{"name":"Test Asset","type":"real-estate","value":1000000}'

# 2. Get all assets
curl http://localhost:3001/api/assets

# 3. Mint tokens
curl -X POST http://localhost:3001/api/admin/tokens \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-key" \
  -d '{"assetId":"asset-id","totalSupply":1000,"pricePerToken":1000}'

# 4. Record purchase
curl -X POST http://localhost:3001/api/investor/investor001/purchase \
  -H "Content-Type: application/json" \
  -d '{"tokenId":"token-id","amount":10,"pricePerToken":1000}'

# 5. Check investor portfolio
curl http://localhost:3001/api/investor/investor001/portfolio
```

---

**Congratulations!** Your IMEC RWA Marketplace is now running on Hyperledger Fabric. 🎉

For detailed documentation, see [README.md](README.md)
