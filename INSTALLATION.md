# Installation Guide

Complete step-by-step installation guide for the IMEC RWA Marketplace.

## Prerequisites

### Required Software

1. **Node.js** (>= 16.0.0)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **npm** (>= 8.0.0)
   - Comes with Node.js
   - Verify: `npm --version`

3. **Hyperledger Fabric Network** (2.5.0)
   - Must be running and accessible
   - Chaincode deployed and instantiated
   - See: CHAINCODE_REFERENCE.md

### Optional Software

4. **Docker** (for containerized deployment)
   - Download: https://www.docker.com/
   - Verify: `docker --version`

5. **PM2** (for production deployment)
   - Install: `npm install -g pm2`
   - Verify: `pm2 --version`

## Installation Steps

### Step 1: Clone/Download Project

If using Git:
```bash
cd C:\Users\imani\Workspace
git clone <repository-url> imec_rwa_marketplace
cd imec_rwa_marketplace
```

If downloaded as ZIP:
- Extract to `C:\Users\imani\Workspace\imec_rwa_marketplace`
- Open terminal in that directory

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

Expected output:
```
added 150+ packages
```

**Common Issues:**
- If `npm install` fails, try: `npm install --legacy-peer-deps`
- On Windows, you may need to run as Administrator

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

Expected output:
```
added 200+ packages
```

### Step 4: Configure Hyperledger Fabric Connection

**Critical Step:** This must be done correctly for the system to work.

Edit `backend/connection-org1.json`:

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
      "url": "grpcs://YOUR_PEER_HOST:YOUR_PEER_PORT",
      "tlsCACerts": {
        "pem": "-----BEGIN CERTIFICATE-----\nYOUR_PEER_TLS_CERT\n-----END CERTIFICATE-----\n"
      },
      "grpcOptions": {
        "ssl-target-name-override": "peer0.org1.example.com",
        "hostnameOverride": "peer0.org1.example.com"
      }
    }
  },
  "certificateAuthorities": {
    "ca.org1.example.com": {
      "url": "https://YOUR_CA_HOST:YOUR_CA_PORT",
      "caName": "ca-org1",
      "tlsCACerts": {
        "pem": "-----BEGIN CERTIFICATE-----\nYOUR_CA_TLS_CERT\n-----END CERTIFICATE-----\n"
      },
      "httpOptions": {
        "verify": false
      }
    }
  }
}
```

**How to get your certificates:**

1. **Peer TLS Certificate:**
```bash
cat /path/to/fabric/network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
```

2. **CA TLS Certificate:**
```bash
cat /path/to/fabric/network/organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem
```

### Step 5: Configure Environment Variables

#### Backend Configuration

The `.env` file already exists with defaults. Review and update:

```bash
cd backend
notepad .env  # Windows
# or
nano .env     # Linux/Mac
```

**Critical Settings to Change:**

1. **AUTH_API_KEY** - MUST change to a secure random key:
   ```env
   AUTH_API_KEY=your-secure-random-key-here-minimum-32-characters
   ```

2. **Fabric Settings** - Verify these match your network:
   ```env
   FABRIC_CHANNEL_NAME=mychannel
   FABRIC_CHAINCODE_NAME=imecChaincode
   FABRIC_ADMIN_USER=admin
   ```

#### Frontend Configuration

The `.env.local` file already exists with defaults. Update the API key to match backend:

```bash
cd ../frontend
notepad .env.local  # Windows
# or
nano .env.local     # Linux/Mac
```

**Critical:** API key must match backend:
```env
NEXT_PUBLIC_API_KEY=your-secure-random-key-here-minimum-32-characters
```

### Step 6: Enroll Admin User

This creates the admin identity in the Fabric wallet:

```bash
cd ../backend
npm run enroll-admin
```

Expected output:
```
Wallet path: C:\Users\imani\Workspace\imec_rwa_marketplace\backend\wallet
Successfully enrolled admin user and imported into wallet
```

**Troubleshooting:**
- If enrollment fails, check:
  - CA URL is correct in connection-org1.json
  - CA is running and accessible
  - CA certificate is valid
  - Network connectivity

### Step 7: Verify Installation

Test the Fabric connection:

```bash
node -e "const gateway = require('./src/fabric/gateway'); gateway.connect('admin').then(() => console.log('✓ Connected to Fabric')).catch(e => console.error('✗ Error:', e.message))"
```

Expected output:
```
Connected to Fabric gateway as admin
✓ Connected to Fabric
```

## Starting the Application

### Option 1: Using Startup Script (Recommended)

**Windows:**
```powershell
.\start.ps1
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

The script will:
- ✓ Check Node.js and npm
- ✓ Install dependencies if needed
- ✓ Verify configuration
- ✓ Start backend on http://localhost:3001
- ✓ Start frontend on http://localhost:3000

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 3: Docker (Production)

```bash
docker-compose up -d
```

View logs:
```bash
docker-compose logs -f
```

Stop:
```bash
docker-compose down
```

### Option 4: PM2 (Production)

```bash
pm2 start ecosystem.config.js
pm2 monit
```

## Post-Installation Setup

### 1. Register Additional Users (Optional)

```bash
cd backend
npm run register-user investor1 client
npm run register-user investor2 client
npm run register-user admin2 admin
```

### 2. Create Your First Asset

Using the Admin UI:
1. Go to http://localhost:3000/admin
2. Click "Create Asset"
3. Fill in details
4. Click "Create"

Or using API:
```bash
curl -X POST http://localhost:3001/api/admin/assets \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
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

### 3. Mint Tokens

Using API:
```bash
curl -X POST http://localhost:3001/api/admin/tokens \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
  -d '{
    "assetId": "asset-id-from-step-2",
    "totalSupply": 1000,
    "pricePerToken": 1000,
    "symbol": "IMEC",
    "name": "IMEC Token"
  }'
```

### 4. Publish the Asset

```bash
curl -X POST http://localhost:3001/api/admin/assets/{asset-id}/publish \
  -H "X-API-Key: your-api-key-here"
```

### 5. Run Sync Service

Start continuous sync:
```bash
cd backend
npm run sync:continuous
```

Or run once:
```bash
npm run sync
```

## Verification Checklist

After installation, verify everything works:

- [ ] Backend is running on port 3001
- [ ] Frontend is running on port 3000
- [ ] Health check returns OK: http://localhost:3001/health
- [ ] Admin dashboard loads: http://localhost:3000/admin
- [ ] Can create an asset via API
- [ ] Can view assets on frontend
- [ ] Fabric wallet contains admin identity
- [ ] Can connect to Fabric network

## Common Installation Issues

### Issue 1: "Cannot find module"

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: "EADDRINUSE: Address already in use"

**Solution:**

Port 3001 is already in use:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <pid> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

Or change port in `backend/.env`:
```env
PORT=3002
```

And update `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

### Issue 3: "Identity admin does not exist in wallet"

**Solution:**
```bash
cd backend
npm run enroll-admin
```

### Issue 4: "Failed to connect to gateway"

**Possible causes:**

1. **Fabric network not running**
   - Start your Fabric network
   - Verify peers/orderers are running

2. **Wrong URLs in connection profile**
   - Check peer URL
   - Check CA URL
   - Verify ports

3. **Certificate issues**
   - Update TLS certificates in connection-org1.json
   - Ensure certificates are valid

4. **Network connectivity**
   - Test peer connection: `curl -k https://YOUR_PEER_URL`
   - Test CA connection: `curl -k https://YOUR_CA_URL/cainfo`

### Issue 5: "Chaincode not found"

**Solution:**

Verify chaincode is deployed:
```bash
peer lifecycle chaincode queryinstalled
peer lifecycle chaincode querycommitted -C mychannel
```

If not deployed, see CHAINCODE_REFERENCE.md for deployment instructions.

### Issue 6: npm install fails on Windows

**Solution:**

1. Run PowerShell as Administrator
2. Set execution policy:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Install windows-build-tools:
   ```bash
   npm install --global windows-build-tools
   ```
4. Try install again

### Issue 7: "Cannot connect to backend" on frontend

**Check:**
1. Backend is running
2. CORS is configured correctly
3. API URL is correct in `.env.local`
4. API key matches between backend and frontend

## Directory Permissions

Ensure proper permissions:

```bash
# Linux/Mac
chmod +x start.sh
chmod -R 755 backend/wallet
chmod 644 backend/.env
chmod 644 frontend/.env.local

# Windows (usually not needed)
# Right-click folders > Properties > Security
```

## Testing Installation

Run these commands to verify:

```bash
# 1. Backend health
curl http://localhost:3001/health

# 2. Get assets (should return empty array initially)
curl http://localhost:3001/api/assets

# 3. Get stats
curl http://localhost:3001/api/stats

# 4. Test admin endpoint (with your API key)
curl -X GET http://localhost:3001/api/admin/assets \
  -H "X-API-Key: your-api-key"
```

## Security Checklist

Before going to production:

- [ ] Change AUTH_API_KEY to a strong random value
- [ ] Update CORS_ORIGIN to your production domain
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS for all connections
- [ ] Secure Fabric wallet directory
- [ ] Review and update all API keys
- [ ] Enable authentication for frontend
- [ ] Set up firewall rules
- [ ] Enable SSL/TLS
- [ ] Regular backups of wallet

## Next Steps

After successful installation:

1. **Read Documentation**
   - README.md - Complete documentation
   - QUICK_START.md - Quick reference
   - CHAINCODE_REFERENCE.md - Chaincode specs

2. **Customize**
   - Modify frontend components
   - Add new API endpoints
   - Extend chaincode functions

3. **Deploy to Production**
   - Set up production environment
   - Configure SSL/TLS
   - Set up monitoring
   - Configure backups

4. **Add Market Integrations**
   - Get API keys for CoinGecko
   - Get API keys for CoinMarketCap
   - Get API keys for DexScreener
   - Update .env with keys

## Support

If you encounter issues:

1. Check logs:
   - Backend: Terminal output or PM2 logs
   - Frontend: Browser console (F12)
   - Fabric: Peer/orderer logs

2. Review documentation:
   - README.md
   - QUICK_START.md
   - This file

3. Verify requirements:
   - Node.js version
   - Fabric network status
   - Chaincode deployment

4. Test components individually:
   - Fabric connection
   - Backend API
   - Frontend pages

---

**Installation Complete!** 🎉

Your IMEC RWA Marketplace is now installed and ready to use.

Access your application:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **Admin Dashboard:** http://localhost:3000/admin
- **Investor Portal:** http://localhost:3000/invest

Happy tokenizing! 🚀
