# Version Notes

## Hyperledger Fabric SDK Version

**Important:** This project uses Hyperledger Fabric SDK v2.2.20 (not v2.5.0)

### Why v2.2.20?

The npm package versions for Hyperledger Fabric SDK are:
- `fabric-network`: v2.2.20 is the latest stable version
- `fabric-ca-client`: v2.2.20 is the latest stable version

Version 2.5.0 was mentioned in the original specifications but does not exist in npm. The v2.2.x SDK is fully compatible with Hyperledger Fabric 2.2+ networks.

### Compatibility

The Fabric SDK v2.2.20 works with:
- ✅ Hyperledger Fabric 2.2.x networks
- ✅ Hyperledger Fabric 2.3.x networks  
- ✅ Hyperledger Fabric 2.4.x networks
- ✅ Hyperledger Fabric 2.5.x networks (if your network uses this)

### Installation

```bash
cd backend
npm install
```

This will install:
- `fabric-network@^2.2.20`
- `fabric-ca-client@^2.2.20`

### If You Need Different Versions

If your Fabric network requires a specific SDK version, edit `backend/package.json`:

```json
{
  "dependencies": {
    "fabric-network": "^X.X.X",
    "fabric-ca-client": "^X.X.X"
  }
}
```

Then run `npm install` again.

### Deprecation Warnings

You may see deprecation warnings during installation (e.g., for `inflight` and `glob`). These are from transitive dependencies and do not affect functionality. They will be resolved in future Fabric SDK updates.

---

**Last Updated:** November 24, 2025
