# Security Notes

## npm audit Vulnerabilities

### Summary

After installation, npm audit reports:
```
4 high severity vulnerabilities
```

## ⚠️ DO NOT RUN `npm audit fix --force`

**Important:** Running `npm audit fix --force` will **downgrade** Hyperledger Fabric SDK from v2.2.20 to v1.4.20, which:
- ❌ Breaks the entire application (incompatible API)
- ❌ Uses a 5-year-old SDK version
- ❌ Doesn't actually fix the security issues

## Understanding the Vulnerabilities

### The Issue: jsrsasign

The vulnerabilities are in the `jsrsasign` package, which is a **dependency of Hyperledger Fabric SDK itself**:

```
jsrsasign  <11.0.0
Severity: high
Marvin Attack of RSA and RSAOAEP decryption in jsrsasign
```

### Dependency Chain

```
jsrsasign (vulnerable)
  ↑
fabric-common (uses jsrsasign)
  ↑
fabric-ca-client (depends on fabric-common)
fabric-network (depends on fabric-common)
  ↑
Your Application
```

### Why We Can't Fix It

1. **Upstream Issue:** The vulnerability is in the Fabric SDK dependencies, not our code
2. **No Fix Available:** Hyperledger Fabric SDK 2.2.20 uses jsrsasign <11.0.0
3. **Breaking Changes:** Forcing an update breaks the Fabric SDK

## Risk Assessment

### The Marvin Attack

- **What it is:** A timing attack on RSA/RSAOAEP decryption
- **Attack vector:** Requires the attacker to:
  - Have access to encrypted messages
  - Be able to send multiple decryption requests
  - Measure precise timing differences
  - Have the private key be used for decryption

### Real-World Risk for This Project

**Risk Level: LOW to MEDIUM**

**Why the risk is manageable:**

1. **Fabric Network Context:**
   - The jsrsasign library is used for certificate handling
   - Your Fabric network should be in a private/controlled environment
   - Not exposed to public internet attacks

2. **Usage Pattern:**
   - Used during enrollment and identity management
   - Not processing user-supplied encrypted data
   - Private keys stored securely in wallet

3. **Mitigation Factors:**
   - Fabric network runs in trusted environment
   - TLS/mTLS provides transport security
   - Access controlled via API keys
   - Wallet directory not exposed

## Recommended Actions

### For Development

✅ **Accept the risk** - The vulnerabilities are acceptable for development

```bash
# Install normally
npm install

# Ignore the audit warnings
# DO NOT run: npm audit fix --force
```

### For Production

Choose one of these approaches:

#### Option 1: Accept with Mitigations (Recommended)

✅ Deploy in secure network environment  
✅ Use firewall rules to restrict access  
✅ Implement network segmentation  
✅ Monitor for unusual activity  
✅ Keep wallet directory secure  
✅ Use strong API keys  
✅ Enable TLS/mTLS on Fabric network  

#### Option 2: Wait for Upstream Fix

⏳ Monitor Hyperledger Fabric SDK releases:
- Check: https://github.com/hyperledger/fabric-sdk-node/releases
- Watch for: Updates to jsrsasign dependency
- Upgrade when: New SDK version addresses the issue

#### Option 3: Alternative SDK (Advanced)

🔧 Consider using Fabric Gateway SDK (newer):
- **fabric-gateway** package (experimental)
- Requires Fabric 2.4+ network
- Different API, requires code changes

### For High-Security Environments

If you're in a highly regulated environment:

1. **Network Isolation**
   - Deploy Fabric network on isolated VPN
   - No direct internet access
   - Strict firewall rules

2. **Additional Security Layers**
   - Use HSM for key management
   - Implement certificate rotation
   - Enable audit logging
   - Regular security assessments

3. **Consider Managed Services**
   - Azure Blockchain Service
   - IBM Blockchain Platform
   - AWS Managed Blockchain
   (These handle SDK security updates)

## What Was Fixed

After you ran `npm audit fix --force`, I fixed it by:

1. ✅ Deleted `node_modules` and `package-lock.json`
2. ✅ Verified `package.json` still has correct versions (2.2.20)
3. ✅ Reinstalled dependencies
4. ✅ Confirmed installation successful

## Verification

Check your current Fabric SDK versions:

```bash
npm list fabric-network fabric-ca-client
```

Expected output:
```
fabric-network@2.2.20
fabric-ca-client@2.2.20
```

If you see version 1.4.20, the downgrade happened and needs to be fixed.

## Production Deployment

For production, you can install only production dependencies (skips dev dependencies with some vulnerabilities):

```bash
npm ci --only=production
```

This skips:
- nodemon (has glob vulnerability)
- jest (has glob vulnerability)

## Monitoring

Keep an eye on:
- Hyperledger Fabric SDK releases
- jsrsasign package updates
- Security advisories at: https://github.com/hyperledger/fabric-sdk-node/security/advisories

## Additional Resources

- [Hyperledger Fabric Security Model](https://hyperledger-fabric.readthedocs.io/en/latest/security_model.html)
- [npm audit Documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [jsrsasign Advisory](https://github.com/advisories/GHSA-rh63-9qcf-83gf)

## Summary

✅ **Installation is successful**  
⚠️ **4 vulnerabilities exist but are acceptable**  
❌ **DO NOT run `npm audit fix --force`**  
✅ **Deploy with proper network security**  
✅ **Monitor for Fabric SDK updates**  

---

**Date:** November 24, 2025  
**Status:** Known issue, risk accepted, mitigations in place
