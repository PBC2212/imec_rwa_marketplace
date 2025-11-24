# Setup & Deployment Checklist

Use this checklist to ensure proper setup and deployment of the IMEC RWA Marketplace.

## 📋 Pre-Installation Checklist

### Environment Setup
- [ ] Node.js >= 16.0.0 installed
- [ ] npm >= 8.0.0 installed
- [ ] Git installed (optional)
- [ ] Text editor installed (VS Code, Notepad++, etc.)
- [ ] Terminal/PowerShell access

### Hyperledger Fabric Network
- [ ] Fabric 2.5.0 network running
- [ ] Peer nodes accessible
- [ ] CA (Certificate Authority) accessible
- [ ] Orderer nodes running
- [ ] Channel `mychannel` created
- [ ] Chaincode deployed (see CHAINCODE_REFERENCE.md)
- [ ] Network connection details available

### Optional Tools
- [ ] Docker installed (for containerized deployment)
- [ ] Docker Compose installed
- [ ] PM2 installed globally (`npm install -g pm2`)

---

## 📦 Installation Checklist

### Step 1: Project Setup
- [ ] Project downloaded/cloned
- [ ] Located in: `C:\Users\imani\Workspace\imec_rwa_marketplace`
- [ ] All files present (50 files total)

### Step 2: Backend Dependencies
- [ ] Navigate to `backend/` directory
- [ ] Run `npm install`
- [ ] No errors during installation
- [ ] `node_modules/` folder created

### Step 3: Frontend Dependencies
- [ ] Navigate to `frontend/` directory
- [ ] Run `npm install`
- [ ] No errors during installation
- [ ] `node_modules/` folder created

---

## ⚙️ Configuration Checklist

### Fabric Connection Profile
- [ ] Open `backend/connection-org1.json`
- [ ] Update peer URL: `grpcs://YOUR_PEER_HOST:PORT`
- [ ] Update CA URL: `https://YOUR_CA_HOST:PORT`
- [ ] Replace peer TLS certificate (PEM format)
- [ ] Replace CA TLS certificate (PEM format)
- [ ] Verify `ssl-target-name-override` matches peer hostname
- [ ] Save file

### Backend Environment
- [ ] File `backend/.env` exists
- [ ] `AUTH_API_KEY` set to secure random string (min 32 chars)
- [ ] `FABRIC_CHANNEL_NAME` matches your channel (default: mychannel)
- [ ] `FABRIC_CHAINCODE_NAME` matches your chaincode (default: imecChaincode)
- [ ] `PORT` set (default: 3001)
- [ ] `CORS_ORIGIN` set (default: http://localhost:3000)
- [ ] Save file

### Frontend Environment
- [ ] File `frontend/.env.local` exists
- [ ] `NEXT_PUBLIC_API_URL` set (default: http://localhost:3001/api)
- [ ] `NEXT_PUBLIC_API_KEY` matches `AUTH_API_KEY` from backend
- [ ] Save file

### Wallet Setup
- [ ] Navigate to `backend/` directory
- [ ] Run `npm run enroll-admin`
- [ ] Admin identity created successfully
- [ ] `backend/wallet/admin.id` file exists

---

## 🧪 Testing Checklist

### Backend Tests
- [ ] Backend running on http://localhost:3001
- [ ] Health check responds: `curl http://localhost:3001/health`
- [ ] Response: `{"status":"ok",...}`

### Fabric Connection Test
```bash
cd backend
node -e "const gateway = require('./src/fabric/gateway'); gateway.connect('admin').then(() => console.log('✓ Connected')).catch(e => console.error('✗ Error:', e.message))"
```
- [ ] Output: "Connected to Fabric gateway as admin"
- [ ] Output: "✓ Connected"
- [ ] No errors

### API Tests
```bash
# Get assets (should return empty array or data)
curl http://localhost:3001/api/assets

# Get stats
curl http://localhost:3001/api/stats

# Test admin endpoint
curl -X GET http://localhost:3001/api/admin/assets \
  -H "X-API-Key: your-api-key"
```
- [ ] Assets endpoint returns JSON
- [ ] Stats endpoint returns JSON
- [ ] Admin endpoint returns data (not "Invalid API key")

### Frontend Tests
- [ ] Frontend running on http://localhost:3000
- [ ] Home page loads
- [ ] Admin dashboard loads: http://localhost:3000/admin
- [ ] Investor portal loads: http://localhost:3000/invest
- [ ] No console errors (F12 developer tools)

---

## 🚀 Deployment Checklist

### Development Deployment
- [ ] Backend started: `cd backend && npm run dev`
- [ ] Frontend started: `cd frontend && npm run dev`
- [ ] Both accessible via browser
- [ ] No startup errors

Or using startup script:
- [ ] Run `.\start.ps1` (Windows) or `./start.sh` (Unix/Linux)
- [ ] Backend and frontend both start
- [ ] No errors in output

### Docker Deployment
- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] Run `docker-compose build`
- [ ] Build completes successfully
- [ ] Run `docker-compose up -d`
- [ ] Containers running: `docker-compose ps`
- [ ] View logs: `docker-compose logs -f`
- [ ] Services accessible

### PM2 Deployment
- [ ] PM2 installed globally
- [ ] Run `pm2 start ecosystem.config.js`
- [ ] Both services running: `pm2 status`
- [ ] View logs: `pm2 logs`
- [ ] Services restart automatically: `pm2 restart all`

---

## 🎯 Feature Testing Checklist

### Admin Features
- [ ] Create asset via API or UI
- [ ] Update asset metadata
- [ ] Publish asset
- [ ] Mint tokens for asset
- [ ] Update token price
- [ ] View all assets (including drafts)
- [ ] View asset history

### Investor Features
- [ ] Browse published assets on home page
- [ ] View token details
- [ ] Purchase tokens via investor portal
- [ ] View portfolio (API: `/api/investor/{id}/portfolio`)
- [ ] Check token balance
- [ ] View payout history (if applicable)

### Sync Service
- [ ] Run sync manually: `cd backend && npm run sync`
- [ ] Feed generated: `backend/public/feed.json`
- [ ] Start continuous sync: `npm run sync:continuous`
- [ ] Syncs every 5 minutes

---

## 🔐 Security Checklist

### Before Production
- [ ] Change `AUTH_API_KEY` to strong random value (min 64 chars)
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Set `NODE_ENV=production`
- [ ] Remove development API keys
- [ ] Secure wallet directory permissions
- [ ] Add market API keys if using integrations
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Review .gitignore (wallet excluded)
- [ ] Backup wallet directory

### Network Security
- [ ] Fabric network secured with TLS
- [ ] Peer access restricted
- [ ] CA access restricted
- [ ] API rate limiting (optional)
- [ ] DDoS protection (optional)

---

## 📊 Monitoring Checklist

### Logs
- [ ] Backend logs accessible
- [ ] Frontend logs accessible (browser console)
- [ ] Fabric logs accessible (peer/orderer)
- [ ] PM2 logs configured (if using PM2)
- [ ] Log rotation configured (optional)

### Health Checks
- [ ] Backend health endpoint working: `/health`
- [ ] Monitor response times
- [ ] Monitor error rates
- [ ] Set up alerts (optional)

### Metrics
- [ ] Track API response times
- [ ] Monitor blockchain transaction times
- [ ] Track user activity
- [ ] Monitor system resources (CPU, memory)

---

## 📝 Documentation Checklist

### Read Documentation
- [ ] README.md (main documentation)
- [ ] QUICK_START.md (quick setup)
- [ ] INSTALLATION.md (detailed setup)
- [ ] CHAINCODE_REFERENCE.md (chaincode specs)
- [ ] PROJECT_SUMMARY.md (overview)
- [ ] BUILD_COMPLETE.md (deliverables)

### Understand Architecture
- [ ] Backend architecture understood
- [ ] Frontend architecture understood
- [ ] Fabric integration understood
- [ ] API endpoints documented
- [ ] Deployment options understood

---

## 🧩 Optional Features Checklist

### Market Integrations
- [ ] CoinGecko API key added to `.env`
- [ ] CoinMarketCap API key added
- [ ] DexScreener API key added
- [ ] Test market sync

### Spydra Integration
- [ ] Spydra account created
- [ ] Store ID added to `.env`
- [ ] API key added to `.env`
- [ ] Test Spydra sync

### Additional Users
- [ ] Register investor users: `npm run register-user investor1 client`
- [ ] Register admin users: `npm run register-user admin2 admin`
- [ ] Test with different identities

---

## 🎨 Customization Checklist

### Frontend Customization
- [ ] Brand colors updated in `tailwind.config.js`
- [ ] Logo added
- [ ] Favicon added
- [ ] Custom components created in `src/components/`
- [ ] Additional pages added
- [ ] Styling customized

### Backend Customization
- [ ] New API routes added (if needed)
- [ ] New middleware added (if needed)
- [ ] New chaincode functions implemented
- [ ] Additional services integrated
- [ ] Custom business logic added

---

## ✅ Production Readiness Checklist

### Code Quality
- [ ] No console.log in production code
- [ ] Error handling comprehensive
- [ ] Code commented and documented
- [ ] TypeScript errors resolved (frontend)
- [ ] ESLint warnings resolved

### Performance
- [ ] API response times acceptable (<500ms)
- [ ] Frontend load times acceptable (<3s)
- [ ] Caching configured and working
- [ ] Database queries optimized (if applicable)

### Reliability
- [ ] Automatic restart on failure (PM2)
- [ ] Error notifications configured
- [ ] Backup strategy in place
- [ ] Recovery plan documented
- [ ] Load testing performed (optional)

### Compliance
- [ ] Data privacy requirements met
- [ ] Security standards followed
- [ ] Audit trail maintained (blockchain)
- [ ] Legal requirements satisfied

---

## 🎉 Go-Live Checklist

### Final Verification
- [ ] All tests passing
- [ ] All features working
- [ ] All security measures in place
- [ ] All documentation updated
- [ ] Backup created
- [ ] Rollback plan prepared

### Deployment
- [ ] Production environment configured
- [ ] DNS configured (if applicable)
- [ ] SSL certificates installed
- [ ] Monitoring active
- [ ] Logs being collected
- [ ] Team notified

### Post-Deployment
- [ ] Verify all features working in production
- [ ] Monitor for errors
- [ ] Check performance metrics
- [ ] User acceptance testing
- [ ] Documentation shared with team

---

## 📞 Support Checklist

### If Something Goes Wrong
- [ ] Check logs (backend, frontend, fabric)
- [ ] Review error messages
- [ ] Consult INSTALLATION.md troubleshooting section
- [ ] Verify configuration files
- [ ] Check network connectivity
- [ ] Restart services
- [ ] Check chaincode status
- [ ] Review recent changes

### Getting Help
- [ ] Review all documentation
- [ ] Check Hyperledger Fabric documentation
- [ ] Check Next.js documentation
- [ ] Check Express.js documentation
- [ ] Search for error messages
- [ ] Check GitHub issues (if open source)

---

## 📈 Ongoing Maintenance Checklist

### Daily
- [ ] Monitor application health
- [ ] Check error logs
- [ ] Verify all services running

### Weekly
- [ ] Review performance metrics
- [ ] Check disk space
- [ ] Review security logs
- [ ] Backup wallet directory

### Monthly
- [ ] Update dependencies
- [ ] Review and update documentation
- [ ] Security audit
- [ ] Performance optimization

### Quarterly
- [ ] Major feature updates
- [ ] Architecture review
- [ ] Capacity planning
- [ ] Team training

---

## ✨ Success Criteria

Your IMEC RWA Marketplace is successfully deployed when:

✅ Backend API responds on http://localhost:3001  
✅ Frontend UI loads on http://localhost:3000  
✅ Admin can create and publish assets  
✅ Investors can purchase tokens  
✅ All transactions recorded on Fabric blockchain  
✅ No errors in logs  
✅ All security measures in place  
✅ Documentation complete and accessible  
✅ Team trained and ready  
✅ Backup and recovery tested  

---

**Use this checklist to ensure nothing is missed during setup, deployment, and ongoing maintenance.**

Print this checklist or keep it handy for reference!

---

*Last Updated: November 23, 2025*  
*Project: IMEC RWA Marketplace*  
*Version: 1.0.0*
