# IMEC Chaincode Deployment Guide

Complete guide for deploying the IMEC RWA Marketplace chaincode to a Hyperledger Fabric network.

## Prerequisites

- Hyperledger Fabric 2.2+ network running
- Fabric binaries installed and in PATH
- Node.js 14+ and npm installed
- Appropriate peer and orderer certificates
- Admin identity enrolled

## Quick Start

### 1. Set Environment Variables

```bash
# Network configuration
export FABRIC_CFG_PATH=/path/to/fabric/config
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/path/to/peer/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/path/to/admin/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051

# Orderer configuration
export ORDERER_CA=/path/to/orderer/tlsca/cert.pem

# Chaincode configuration
export CHANNEL_NAME=mychannel
export CHAINCODE_NAME=imecChaincode
export CHAINCODE_VERSION=1.0
export CHAINCODE_SEQUENCE=1
```

### 2. Install Dependencies

```bash
cd chaincode/imec-chaincode
npm install
cd ../..
```

### 3. Package Chaincode

```bash
peer lifecycle chaincode package imec-chaincode.tar.gz \
  --path chaincode/imec-chaincode \
  --lang node \
  --label imec_${CHAINCODE_VERSION}
```

### 4. Install on Peer(s)

For each peer in your organization:

```bash
# Set peer-specific environment variables
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051
export CORE_PEER_TLS_ROOTCERT_FILE=/path/to/peer0/tls/ca.crt

# Install chaincode
peer lifecycle chaincode install imec-chaincode.tar.gz
```

### 5. Query Installed Chaincode

```bash
peer lifecycle chaincode queryinstalled
```

Save the package ID from the output:
```bash
export PACKAGE_ID=imec_1.0:a1b2c3d4...
```

### 6. Approve Chaincode Definition

For each organization:

```bash
peer lifecycle chaincode approveformyorg \
  -o orderer.example.com:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --channelID ${CHANNEL_NAME} \
  --name ${CHAINCODE_NAME} \
  --version ${CHAINCODE_VERSION} \
  --package-id ${PACKAGE_ID} \
  --sequence ${CHAINCODE_SEQUENCE} \
  --tls \
  --cafile ${ORDERER_CA}
```

### 7. Check Commit Readiness

```bash
peer lifecycle chaincode checkcommitreadiness \
  --channelID ${CHANNEL_NAME} \
  --name ${CHAINCODE_NAME} \
  --version ${CHAINCODE_VERSION} \
  --sequence ${CHAINCODE_SEQUENCE} \
  --tls \
  --cafile ${ORDERER_CA}
```

Expected output: All organizations should show `true`.

### 8. Commit Chaincode Definition

```bash
peer lifecycle chaincode commit \
  -o orderer.example.com:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --channelID ${CHANNEL_NAME} \
  --name ${CHAINCODE_NAME} \
  --version ${CHAINCODE_VERSION} \
  --sequence ${CHAINCODE_SEQUENCE} \
  --tls \
  --cafile ${ORDERER_CA} \
  --peerAddresses peer0.org1.example.com:7051 \
  --tlsRootCertFiles ${CORE_PEER_TLS_ROOTCERT_FILE}
```

For multi-org networks, add all peer addresses:
```bash
--peerAddresses peer0.org1.example.com:7051 \
--tlsRootCertFiles /path/to/org1/peer/tls/ca.crt \
--peerAddresses peer0.org2.example.com:9051 \
--tlsRootCertFiles /path/to/org2/peer/tls/ca.crt
```

### 9. Query Committed Chaincode

```bash
peer lifecycle chaincode querycommitted \
  --channelID ${CHANNEL_NAME} \
  --name ${CHAINCODE_NAME} \
  --cafile ${ORDERER_CA}
```

### 10. Initialize Ledger (Optional)

```bash
peer chaincode invoke \
  -o orderer.example.com:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --tls \
  --cafile ${ORDERER_CA} \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  --peerAddresses peer0.org1.example.com:7051 \
  --tlsRootCertFiles ${CORE_PEER_TLS_ROOTCERT_FILE} \
  -c '{"function":"AssetContract:InitLedger","Args":[]}'
```

## Verification

### Test Asset Creation

```bash
peer chaincode invoke \
  -o orderer.example.com:7050 \
  --tls \
  --cafile ${ORDERER_CA} \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  --peerAddresses peer0.org1.example.com:7051 \
  --tlsRootCertFiles ${CORE_PEER_TLS_ROOTCERT_FILE} \
  -c '{"function":"AssetContract:CreateAsset","Args":["test_asset_001","{\"name\":\"Test Asset\",\"description\":\"Testing chaincode\",\"assetType\":\"test\",\"totalValue\":1000000}"]}'
```

### Test Asset Query

```bash
peer chaincode query \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  -c '{"function":"AssetContract:GetAsset","Args":["test_asset_001"]}'
```

### Test Token Minting

```bash
peer chaincode invoke \
  -o orderer.example.com:7050 \
  --tls \
  --cafile ${ORDERER_CA} \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  --peerAddresses peer0.org1.example.com:7051 \
  --tlsRootCertFiles ${CORE_PEER_TLS_ROOTCERT_FILE} \
  -c '{"function":"TokenContract:MintTokens","Args":["test_token_001","test_asset_001","{\"symbol\":\"TEST\",\"name\":\"Test Token\",\"totalSupply\":10000,\"pricePerToken\":100}"]}'
```

## Upgrading Chaincode

### 1. Update Code and Version

Edit `package.json`:
```json
{
  "version": "1.1.0"
}
```

### 2. Package New Version

```bash
export CHAINCODE_VERSION=1.1
peer lifecycle chaincode package imec-chaincode-v1.1.tar.gz \
  --path chaincode/imec-chaincode \
  --lang node \
  --label imec_${CHAINCODE_VERSION}
```

### 3. Install on Peers

```bash
peer lifecycle chaincode install imec-chaincode-v1.1.tar.gz
```

### 4. Approve New Version

```bash
export CHAINCODE_SEQUENCE=2
peer lifecycle chaincode approveformyorg \
  -o orderer.example.com:7050 \
  --channelID ${CHANNEL_NAME} \
  --name ${CHAINCODE_NAME} \
  --version ${CHAINCODE_VERSION} \
  --package-id ${NEW_PACKAGE_ID} \
  --sequence ${CHAINCODE_SEQUENCE} \
  --tls \
  --cafile ${ORDERER_CA}
```

### 5. Commit New Version

```bash
peer lifecycle chaincode commit \
  -o orderer.example.com:7050 \
  --channelID ${CHANNEL_NAME} \
  --name ${CHAINCODE_NAME} \
  --version ${CHAINCODE_VERSION} \
  --sequence ${CHAINCODE_SEQUENCE} \
  --tls \
  --cafile ${ORDERER_CA} \
  --peerAddresses peer0.org1.example.com:7051 \
  --tlsRootCertFiles ${CORE_PEER_TLS_ROOTCERT_FILE}
```

## Deployment Scripts

### deploy.sh

Create a deployment script:

```bash
#!/bin/bash

set -e

# Configuration
CHANNEL_NAME=${CHANNEL_NAME:-"mychannel"}
CHAINCODE_NAME=${CHAINCODE_NAME:-"imecChaincode"}
CHAINCODE_VERSION=${CHAINCODE_VERSION:-"1.0"}
CHAINCODE_SEQUENCE=${CHAINCODE_SEQUENCE:-"1"}

echo "===== Installing Dependencies ====="
cd chaincode/imec-chaincode
npm install
cd ../..

echo "===== Packaging Chaincode ====="
peer lifecycle chaincode package imec-chaincode.tar.gz \
  --path chaincode/imec-chaincode \
  --lang node \
  --label imec_${CHAINCODE_VERSION}

echo "===== Installing on Peer ====="
peer lifecycle chaincode install imec-chaincode.tar.gz

echo "===== Getting Package ID ====="
PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r '.installed_chaincodes[0].package_id')
echo "Package ID: ${PACKAGE_ID}"

echo "===== Approving for Organization ====="
peer lifecycle chaincode approveformyorg \
  -o orderer.example.com:7050 \
  --channelID ${CHANNEL_NAME} \
  --name ${CHAINCODE_NAME} \
  --version ${CHAINCODE_VERSION} \
  --package-id ${PACKAGE_ID} \
  --sequence ${CHAINCODE_SEQUENCE} \
  --tls \
  --cafile ${ORDERER_CA}

echo "===== Checking Commit Readiness ====="
peer lifecycle chaincode checkcommitreadiness \
  --channelID ${CHANNEL_NAME} \
  --name ${CHAINCODE_NAME} \
  --version ${CHAINCODE_VERSION} \
  --sequence ${CHAINCODE_SEQUENCE} \
  --tls \
  --cafile ${ORDERER_CA}

echo "===== Committing Chaincode ====="
peer lifecycle chaincode commit \
  -o orderer.example.com:7050 \
  --channelID ${CHANNEL_NAME} \
  --name ${CHAINCODE_NAME} \
  --version ${CHAINCODE_VERSION} \
  --sequence ${CHAINCODE_SEQUENCE} \
  --tls \
  --cafile ${ORDERER_CA} \
  --peerAddresses peer0.org1.example.com:7051 \
  --tlsRootCertFiles ${CORE_PEER_TLS_ROOTCERT_FILE}

echo "===== Deployment Complete ====="
peer lifecycle chaincode querycommitted --channelID ${CHANNEL_NAME} --name ${CHAINCODE_NAME}
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run:
```bash
./deploy.sh
```

## Troubleshooting

### Issue: Package Install Fails

**Error:** `chaincode install failed`

**Solution:**
- Check Node.js version: `node --version` (must be 14+)
- Verify npm dependencies: `cd chaincode/imec-chaincode && npm install`
- Check file permissions

### Issue: Approval Fails

**Error:** `proposal failed with status: 500`

**Solution:**
- Verify peer is reachable
- Check TLS certificates are valid
- Ensure admin MSP is properly configured

### Issue: Commit Fails

**Error:** `failed to collect endorsements`

**Solution:**
- Ensure all required orgs have approved
- Check commit readiness status
- Verify endorsement policy

### Issue: Invoke Fails

**Error:** `chaincode not found`

**Solution:**
- Verify chaincode is committed: `peer lifecycle chaincode querycommitted`
- Check channel name and chaincode name
- Ensure chaincode container is running: `docker ps`

### Issue: Chaincode Container Fails

**Error:** Container exits immediately

**Solution:**
- Check chaincode logs: `docker logs <container_id>`
- Verify Node.js dependencies
- Check for syntax errors in chaincode

## Best Practices

1. **Version Control**: Tag each deployment in git
2. **Testing**: Test on dev network before production
3. **Backup**: Backup channel configuration before upgrades
4. **Monitoring**: Monitor chaincode container logs
5. **Documentation**: Document all configuration changes
6. **Rollback Plan**: Keep previous version package for rollback
7. **Security**: Use proper MSP configuration and TLS
8. **Endorsement Policy**: Define appropriate policy for your use case

## Multi-Organization Deployment

For networks with multiple organizations:

1. **Coordinate**: All orgs must approve before commit
2. **Package Distribution**: Share package with all orgs
3. **Endorsement**: Configure endorsement policy
4. **Commit**: One org commits after all approve

Example endorsement policy (2 of 3 orgs):
```bash
--signature-policy "OR('Org1MSP.member','Org2MSP.member','Org3MSP.member')"
```

## Production Checklist

- [ ] All dependencies installed
- [ ] Code reviewed and tested
- [ ] Version tagged in git
- [ ] Chaincode packaged
- [ ] Installed on all peers
- [ ] Approved by all organizations
- [ ] Commit readiness verified
- [ ] Chaincode committed to channel
- [ ] Deployment verified with test transactions
- [ ] Monitoring configured
- [ ] Documentation updated
- [ ] Team notified of deployment

## Support

For deployment issues:
- Email: info@imecapitaltokenization.com
- Phone: (248) 678-4819

## References

- [Hyperledger Fabric Chaincode Lifecycle](https://hyperledger-fabric.readthedocs.io/en/release-2.2/chaincode_lifecycle.html)
- [Fabric Contract API](https://hyperledger.github.io/fabric-chaincode-node/)
- [IMEC RWA Marketplace Documentation](../README.md)
