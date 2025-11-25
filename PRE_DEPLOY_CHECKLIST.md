# Pre-Deployment Checklist

## Run these checks before deploying to Render

---

## ✅ Step 1: Test Local Build

### Backend Test
```bash
cd backend
npm install
npm run dev

# Should start without errors on port 3001
```

### Frontend Test
```bash
cd frontend
npm install
npm run build

# Should complete without TypeScript errors
```

**Expected Result:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

---

## ✅ Step 2: Check All Imports

Run this command to verify no missing imports:

```bash
cd frontend
npm run build 2>&1 | grep "Cannot find name"
```

**Expected Result:** No output (no errors)

**If you see errors:**
- Open the file mentioned in the error
- Add missing imports

### Common Missing Imports:

**React hooks:**
```typescript
import { useState, useEffect } from 'react';
```

**API client:**
```typescript
import { api } from '@/lib/api';
```

**Utility functions:**
```typescript
import { formatCurrency, formatNumber, formatDate, getStatusColor } from '@/lib/utils';
```

---

## ✅ Step 3: Verify Environment Variables

### Backend Environment Variables

Create `backend/.env` file with:

```env
# Server
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000

# Authentication
AUTH_API_KEY=your-secure-key-here

# Spydra (if using)
SPYDRA_API_KEY=your-key
SPYDRA_PROJECT_ID=your-project-id
SPYDRA_NETWORK_ID=your-network-id
SPYDRA_APP_ID=your-app-id
SPYDRA_ASSET_SCHEMA_ID=your-schema-id

# Fabric (if using direct SDK)
FABRIC_CHANNEL_NAME=mychannel
FABRIC_CHAINCODE_NAME=imecChaincode
```

### Frontend Environment Variables

Create `frontend/.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_API_KEY=same-as-backend-auth-api-key
```

---

## ✅ Step 4: Test Full Stack Locally

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend** (in new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test in Browser:**
   - Visit http://localhost:3000
   - Check landing page loads
   - Test navigation
   - Open browser console (F12)
   - Verify no errors

4. **Test API Endpoints:**
   ```bash
   # Health check
   curl http://localhost:3001/health
   
   # Assets endpoint
   curl http://localhost:3001/api/assets
   
   # Spydra health (if configured)
   curl http://localhost:3001/api/spydra/health
   ```

---

## ✅ Step 5: Check for TypeScript Errors

```bash
cd frontend
npx tsc --noEmit
```

**Expected Result:** No errors

**Common TypeScript Issues:**
- Missing type definitions
- Incorrect prop types
- Missing imports
- Unused variables (warnings OK)

---

## ✅ Step 6: Lint Code

```bash
cd frontend
npm run lint
```

**Fix any errors** before deploying.

**Warnings are OK**, but errors must be fixed.

---

## ✅ Step 7: Check Dependencies

### Check for Security Vulnerabilities

```bash
# Backend
cd backend
npm audit

# Frontend
cd frontend
npm audit
```

**Note:** Some vulnerabilities in `jsrsasign` are expected (see SECURITY_NOTES.md)

**Do NOT run `npm audit fix --force`** as it will break Fabric SDK.

---

## ✅ Step 8: Verify File Structure

Ensure these critical files exist:

```
imec_rwa_marketplace/
├── package.json (root)
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── spydra/
│   │   └── fabric/
│   └── .env (for local testing)
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── .env.local (for local testing)
└── README.md
```

---

## ✅ Step 9: Git Status

Check what will be deployed:

```bash
git status
git diff
```

**Ensure:**
- All fixes are committed
- No sensitive data in code
- .env files are NOT committed (should be in .gitignore)

---

## ✅ Step 10: Final Build Test

Run the exact same build command Render will use:

```bash
# From root directory
cd backend && npm install && cd ../frontend && npm install && npm run build
```

**This should complete without errors!**

---

## 🚨 If Build Fails

### Check Error Message

**"Cannot find name X"** → Missing import
- Add the import at top of file

**"Module not found"** → Wrong import path
- Check the import path is correct
- Ensure file exists

**"Type error"** → TypeScript issue
- Fix the type annotation
- Or add `// @ts-ignore` (last resort)

**"Out of memory"** → Build needs more resources
- Close other applications
- Or use Render (has more memory)

---

## ✅ Ready to Deploy?

If all checks pass:

```bash
# Add all changes
git add .

# Commit
git commit -m "fix: Add missing imports for marketplace page"

# Push to trigger deployment
git push origin main
```

Render will automatically:
1. Detect the push ✅
2. Clone the repository ✅
3. Install dependencies ✅
4. Run build command ✅
5. Start the services ✅

---

## 📊 Build Success Indicators

### Backend Build Success:
```
added 425 packages
✓ No critical vulnerabilities
✓ Build completed in X seconds
```

### Frontend Build Success:
```
▲ Next.js 14.2.33
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
✓ Compiled in X seconds
```

---

## 🎯 Post-Deployment Checks

After successful deployment:

1. **Visit Frontend URL** → Landing page should load
2. **Test Backend** → `curl https://your-backend.onrender.com/health`
3. **Check Logs** → No errors in Render dashboard
4. **Test Features** → Login, navigation, API calls work

---

## 🔄 If Deployment Fails

1. Check Render logs for exact error
2. Run the same build command locally
3. Fix the issue
4. Test locally again
5. Commit and push

---

## ✅ Final Checklist

Before pushing to GitHub:

- [ ] Local backend starts without errors
- [ ] Local frontend builds without errors
- [ ] TypeScript compilation passes
- [ ] No missing imports
- [ ] All environment variables documented
- [ ] Tested locally end-to-end
- [ ] Git status shows correct changes
- [ ] Ready to commit and push

---

**If all boxes are checked, you're ready to deploy!** 🚀
