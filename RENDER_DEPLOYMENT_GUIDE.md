# Render Deployment Guide

## Complete guide for deploying IMEC RWA Marketplace to Render

---

## Prerequisites

- GitHub repository with your code
- Render account (https://render.com)
- Environment variables ready

---

## Part 1: Backend Deployment

### Step 1: Create Backend Web Service

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `imec-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment:**
- **Node Version**: Leave as auto-detected (>=16.0.0)

### Step 2: Configure Backend Environment Variables

Add the following environment variables in Render Dashboard:

```env
# Server Configuration
NODE_ENV=production
PORT=3001

# Authentication
AUTH_API_KEY=your-secure-api-key-here-minimum-32-chars

# CORS Configuration
CORS_ORIGIN=https://your-frontend-url.onrender.com

# Spydra Configuration
SPYDRA_API_KEY=your-spydra-api-key
SPYDRA_PROJECT_ID=your-project-id
SPYDRA_NETWORK_ID=your-network-id
SPYDRA_APP_ID=your-app-id
SPYDRA_ASSET_SCHEMA_ID=your-schema-id

# Fabric Configuration (if using direct Fabric SDK)
FABRIC_CHANNEL_NAME=mychannel
FABRIC_CHAINCODE_NAME=imecChaincode
FABRIC_ADMIN_USER=admin

# Optional: Market Integration APIs
COINGECKO_API_KEY=your-key
COINMARKETCAP_API_KEY=your-key
```

### Step 3: Advanced Backend Settings

**Auto-Deploy**: ✅ Enabled (deploys automatically on git push)

**Health Check Path**: `/health`

**Instance Type**: 
- Start with **Free** tier for testing
- Upgrade to **Starter** ($7/month) for production

### Step 4: Get Backend URL

After deployment completes, copy your backend URL:
```
https://imec-backend.onrender.com
```

---

## Part 2: Frontend Deployment

### Step 1: Create Frontend Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect same GitHub repository
3. Configure the service:

**Basic Settings:**
- **Name**: `imec-frontend` (or your preferred name)
- **Region**: Same as backend
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Environment:**
- **Node Version**: Leave as auto-detected (>=16.0.0)

### Step 2: Configure Frontend Environment Variables

Add the following environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://imec-backend.onrender.com/api
NEXT_PUBLIC_API_KEY=same-as-backend-auth-api-key

# Node Environment
NODE_ENV=production
```

**Important:** 
- Replace `https://imec-backend.onrender.com` with your actual backend URL from Step 4 above
- Make sure `NEXT_PUBLIC_API_KEY` matches `AUTH_API_KEY` from backend

### Step 3: Advanced Frontend Settings

**Auto-Deploy**: ✅ Enabled

**Health Check Path**: `/` (Next.js will serve the landing page)

**Instance Type**: Free tier is fine for frontend

---

## Part 3: Update Backend CORS

After frontend is deployed, update backend environment variable:

1. Go to backend service in Render
2. Update `CORS_ORIGIN` to your frontend URL:
```env
CORS_ORIGIN=https://imec-frontend.onrender.com
```
3. Save and redeploy backend

---

## Part 4: Custom Domains (Optional)

### Add Custom Domain to Frontend

1. Go to frontend service settings
2. Navigate to "Custom Domains"
3. Click "Add Custom Domain"
4. Enter your domain: `app.imecapitaltrust.com`
5. Update DNS records as instructed by Render

### Add Custom Domain to Backend

1. Go to backend service settings
2. Add custom domain: `api.imecapitaltrust.com`
3. Update DNS records

### Update Environment Variables

After adding custom domains, update:

**Backend:**
```env
CORS_ORIGIN=https://app.imecapitaltrust.com
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://api.imecapitaltrust.com/api
```

---

## Part 5: Verification

### Test Backend

```bash
# Test health endpoint
curl https://your-backend-url.onrender.com/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-11-24T...",
  "network": "IMEC Token Network",
  "platform": "Hyperledger Fabric 2.5.0"
}
```

### Test Frontend

1. Visit your frontend URL
2. Verify landing page loads
3. Check browser console for errors
4. Test login functionality
5. Verify API calls are working

### Test Spydra Integration (if configured)

```bash
curl https://your-backend-url.onrender.com/api/spydra/health
```

---

## Part 6: Monitoring & Logs

### View Logs

**Backend Logs:**
1. Go to backend service
2. Click "Logs" tab
3. Monitor for errors

**Frontend Logs:**
1. Go to frontend service
2. Click "Logs" tab
3. Monitor build and runtime logs

### Set Up Alerts

1. Go to service settings
2. Navigate to "Notifications"
3. Add email for deploy failures
4. Add email for service downtime

---

## Troubleshooting

### Build Fails with TypeScript Errors

**Issue:** TypeScript compilation errors

**Solution:**
1. Run `npm run build` locally first
2. Fix all TypeScript errors
3. Commit and push changes
4. Redeploy

### Backend Can't Connect to Spydra

**Issue:** 500 errors when calling Spydra endpoints

**Solution:**
1. Verify all Spydra environment variables are set
2. Check Spydra API key is valid
3. Check Spydra network is running
4. Review backend logs for detailed errors

### Frontend Can't Reach Backend

**Issue:** API calls failing with CORS or network errors

**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check backend `CORS_ORIGIN` includes frontend URL
3. Ensure both services are deployed
4. Check backend health endpoint

### Environment Variables Not Working

**Issue:** Config values not being read

**Solution:**
1. Ensure variables are set in Render dashboard (not just in code)
2. Restart service after adding variables
3. Check variable names match exactly (case-sensitive)
4. For frontend, ensure variables start with `NEXT_PUBLIC_`

### Slow Cold Starts (Free Tier)

**Issue:** First request takes 30+ seconds

**Solution:**
- Free tier services spin down after inactivity
- Upgrade to Starter plan ($7/month) to keep services always running
- Or accept cold starts for development/testing

---

## Performance Optimization

### Backend Optimizations

1. **Enable Persistent Disk** (for Fabric wallet if using direct SDK):
   - Go to service settings
   - Add persistent disk at `/opt/render/project/src/backend/wallet`
   - Size: 1GB

2. **Increase Resources** (if needed):
   - Upgrade to Starter or higher plan
   - More memory helps with concurrent requests

### Frontend Optimizations

1. **Enable CDN** (automatic on Render)
2. **Optimize Images**: Ensure logo and images are optimized
3. **Monitor Bundle Size**: Run `npm run build` locally to check

---

## Maintenance

### Regular Updates

1. **Update Dependencies:**
   ```bash
   cd backend && npm update
   cd ../frontend && npm update
   ```

2. **Security Patches:**
   - Monitor GitHub security alerts
   - Update vulnerable packages promptly

3. **Backup Strategy:**
   - Spydra handles blockchain backups
   - Backend has no persistent data (stateless)
   - Configuration stored in environment variables

### Scaling

As your platform grows:

1. **Backend Scaling:**
   - Upgrade instance type
   - Add more instances (load balancing automatic)
   - Consider dedicated Redis for caching

2. **Frontend Scaling:**
   - Render handles CDN automatically
   - Consider upgrading instance type for faster builds

3. **Database (Future):**
   - If you add a database, use Render's PostgreSQL
   - Or use external services (MongoDB Atlas, etc.)

---

## Cost Estimation

### Free Tier (Testing)
- Backend: Free (with spin-down)
- Frontend: Free (with spin-down)
- **Total**: $0/month

### Starter Plan (Production)
- Backend: $7/month (always on)
- Frontend: Free (static site can stay on free tier)
- **Total**: $7/month

### Recommended Production Setup
- Backend: Starter ($7/month)
- Frontend: Starter ($7/month)
- **Total**: $14/month

Plus Spydra costs (separate billing)

---

## Security Checklist

Before going to production:

- [ ] All environment variables are set
- [ ] API keys are strong and unique
- [ ] CORS is configured correctly
- [ ] HTTPS is enabled (automatic on Render)
- [ ] Health checks are working
- [ ] Logs are being monitored
- [ ] Alerts are configured
- [ ] Spydra network is secured
- [ ] Rate limiting is configured (if needed)
- [ ] Authentication is working

---

## Support

### Render Support
- Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

### IME Capital Trust
- Email: info@imecapitaltrust.com
- Phone: (248) 678-4819

### Spydra Support
- Docs: https://docs.spydra.app
- Email: support@spydra.app

---

## Quick Deploy Commands

After fixing code locally and testing:

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "fix: Add missing imports for Render build"

# Push to trigger deployment
git push origin main
```

Render will automatically:
1. Detect the push
2. Pull latest code
3. Run build commands
4. Deploy new version
5. Run health checks

Total deployment time: 2-5 minutes

---

## Success Criteria

✅ Backend health check returns 200 OK
✅ Frontend loads without errors
✅ Can login to platform
✅ Can view marketplace
✅ API calls work correctly
✅ Spydra integration works (if configured)
✅ No console errors
✅ Mobile responsive

---

**Last Updated**: November 24, 2025  
**Status**: ✅ Ready for Deployment
