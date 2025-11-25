# IMEC RWA Marketplace Chaincode

Smart contract implementation for the IMEC Real World Asset (RWA) Tokenization Marketplace on Hyperledger Fabric 2.2+.

## Overview

This chaincode provides the blockchain layer for managing real-world assets, their tokenization, investor portfolios, and revenue payouts on the Hyperledger Fabric blockchain.

## Architecture

The chaincode is organized into four main contracts:

### 1. AssetContract (`lib/assetContract.js`)
Manages the lifecycle of real-world assets.

**Functions:**
- `CreateAsset` - Create a new asset
- `UpdateAsset` - Update asset information
- `PublishAsset` - Make asset available for investment
- `ArchiveAsset` - Archive an asset
- `DeleteAsset` - Delete an asset (admin only)
- `GetAsset` - Get asset by ID
- `GetAllAssets` - Get all assets with optional filtering
- `GetPublishedAssets` - Get only published assets
- `GetAssetHistory` - Get complete history of an asset
- `GetAssetsByType` - Filter assets by type
- `SearchAssets` - Search assets by criteria
- `AssetExists` - Check if asset exists

### 2. TokenContract (`lib/tokenContract.js`)
Manages token creation, transfer, and lifecycle.

**Functions:**
- `MintTokens` - Create new tokens for an asset
- `BurnTokens` - Remove tokens from circulation
- `TransferTokens` - Transfer tokens between investors
- `UpdateTokenPrice` - Update token market price
- `GetToken` - Get token details
- `GetAllTokens` - Get all tokens
- `GetTokensByAsset` - Get tokens for specific asset
- `GetTokenBalance` - Get investor's token balance
- `GetTokenStatistics` - Get comprehensive token stats
- `GetTokenTransferHistory` - Get all transfers for a token
- `TokenExists` - Check if token exists

### 3. InvestorContract (`lib/investorContract.js`)
Manages investor profiles, portfolios, and purchases.

**Functions:**
- `RegisterInvestor` - Register new investor
- `UpdateInvestor` - Update investor information
- `RecordPurchase` - Record a token purchase
- `GetInvestorBalance` - Get investor's balance for a token
- `GetInvestorPortfolio` - Get complete portfolio with P&L
- `GetTokenInvestors` - Get all investors holding a token
- `GetInvestorPurchaseHistory` - Get purchase history
- `GetInvestor` - Get investor details
- `GetAllInvestors` - Get all investors
- `UpdateKYCStatus` - Update investor KYC verification
- `InvestorExists` - Check if investor exists

### 4. PayoutContract (`lib/payoutContract.js`)
Manages dividend and revenue distributions.

**Functions:**
- `RecordPayout` - Record a new payout
- `DistributePayout` - Distribute payout to all token holders
- `GetPayout` - Get payout details
- `GetAssetPayouts` - Get all payouts for an asset
- `GetInvestorPayouts` - Get all payouts received by investor
- `GetPayoutDistributions` - Get distribution details for a payout
- `GetAllPayouts` - Get all payouts
- `UpdatePayoutStatus` - Update payout status
- `CancelPayout` - Cancel a pending payout
- `GetTokenPayoutStatistics` - Get payout statistics for a token
- `PayoutExists` - Check if payout exists

## Data Models

### Asset
```json
{
  "id": "asset_001",
  "docType": "asset",
  "name": "Downtown Office Building",
  "description": "Prime commercial real estate",
  "assetType": "real-estate",
  "totalValue": 5000000,
  "tokenId": "token_001",
  "status": "published",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z",
  "createdBy": "x509::/CN=admin"
}
```

### Token
```json
{
  "id": "token_001",
  "docType": "token",
  "assetId": "asset_001",
  "symbol": "IMEC-RE-001",
  "name": "Downtown Office Token",
  "totalSupply": 100000,
  "circulatingSupply": 75000,
  "availableSupply": 25000,
  "burnedSupply": 0,
  "pricePerToken": 50,
  "totalRaised": 3750000,
  "investorCount": 42,
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### Investor
```json
{
  "id": "investor_001",
  "docType": "investor",
  "name": "John Doe",
  "email": "john@example.com",
  "kycVerified": true,
  "status": "active",
  "totalInvested": 150000,
  "activeInvestments": 5,
  "registeredAt": "2025-01-01T00:00:00Z"
}
```

### Purchase
```json
{
  "id": "purchase_001",
  "docType": "purchase",
  "investorId": "investor_001",
  "tokenId": "token_001",
  "assetId": "asset_001",
  "amount": 1000,
  "pricePerToken": 50,
  "totalPrice": 50000,
  "purchaseDate": "2025-01-15T00:00:00Z",
  "status": "completed"
}
```

### Payout
```json
{
  "id": "payout_001",
  "docType": "payout",
  "assetId": "asset_001",
  "tokenId": "token_001",
  "totalAmount": 100000,
  "payoutType": "dividend",
  "description": "Q1 2025 Revenue Distribution",
  "perTokenAmount": 1.33,
  "circulatingSupplyAtPayout": 75000,
  "status": "completed",
  "distributedAmount": 100000,
  "payoutDate": "2025-04-01T00:00:00Z"
}
```

## Installation

### Prerequisites
- Node.js 14+ and npm 6+
- Hyperledger Fabric 2.2+ network running
- Fabric binaries and tools installed

### Install Dependencies
```bash
cd chaincode/imec-chaincode
npm install
```

## Deployment

### Package the Chaincode
```bash
peer lifecycle chaincode package imec-chaincode.tar.gz \
  --path chaincode/imec-chaincode \
  --lang node \
  --label imec_1.0
```

### Install on Peer
```bash
peer lifecycle chaincode install imec-chaincode.tar.gz
```

### Approve for Organization
```bash
export PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r '.installed_chaincodes[0].package_id')

peer lifecycle chaincode approveformyorg \
  -o orderer.example.com:7050 \
  --channelID mychannel \
  --name imecChaincode \
  --version 1.0 \
  --package-id $PACKAGE_ID \
  --sequence 1 \
  --tls \
  --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
```

### Commit to Channel
```bash
peer lifecycle chaincode commit \
  -o orderer.example.com:7050 \
  --channelID mychannel \
  --name imecChaincode \
  --version 1.0 \
  --sequence 1 \
  --tls \
  --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
  --peerAddresses peer0.org1.example.com:7051 \
  --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
```

## Usage Examples

### Create an Asset
```bash
peer chaincode invoke \
  -C mychannel \
  -n imecChaincode \
  -c '{"function":"AssetContract:CreateAsset","Args":["asset_001","{\"name\":\"Downtown Office\",\"description\":\"Prime real estate\",\"assetType\":\"real-estate\",\"totalValue\":5000000}"]}'
```

### Mint Tokens
```bash
peer chaincode invoke \
  -C mychannel \
  -n imecChaincode \
  -c '{"function":"TokenContract:MintTokens","Args":["token_001","asset_001","{\"symbol\":\"IMEC-RE-001\",\"name\":\"Office Token\",\"totalSupply\":100000,\"pricePerToken\":50}"]}'
```

### Record Purchase
```bash
peer chaincode invoke \
  -C mychannel \
  -n imecChaincode \
  -c '{"function":"InvestorContract:RecordPurchase","Args":["purchase_001","investor_001","token_001","1000","50000"]}'
```

### Query Asset
```bash
peer chaincode query \
  -C mychannel \
  -n imecChaincode \
  -c '{"function":"AssetContract:GetAsset","Args":["asset_001"]}'
```

## Events

The chaincode emits the following events:

- `AssetCreated` - When a new asset is created
- `AssetUpdated` - When an asset is updated
- `AssetPublished` - When an asset is published
- `TokensMinted` - When tokens are minted
- `TokensBurned` - When tokens are burned
- `TokensTransferred` - When tokens are transferred
- `TokenPriceUpdated` - When token price changes
- `PurchaseRecorded` - When a purchase is recorded
- `InvestorRegistered` - When an investor registers
- `KYCStatusUpdated` - When KYC status changes
- `PayoutRecorded` - When a payout is recorded
- `PayoutDistributed` - When a payout is distributed
- `PayoutCancelled` - When a payout is cancelled

## Testing

Run the test suite:
```bash
npm test
```

## Development

### Linting
```bash
npm run lint
```

### Code Style
- 4 spaces indentation
- Single quotes
- Semicolons required
- ES6+ features supported

## Security Considerations

1. **Access Control**: Implement proper access control in production
2. **Input Validation**: All inputs are validated before processing
3. **State Management**: Composite keys used for efficient balance tracking
4. **Event Emission**: All state changes emit events for auditability
5. **Immutability**: Critical fields are protected from modification

## Performance Optimization

1. **CouchDB Queries**: Use rich queries for complex filtering
2. **Composite Keys**: Efficient balance lookups
3. **Pagination**: Implement for large result sets in production
4. **Caching**: Results can be cached at application layer

## Upgrading

To upgrade the chaincode:

1. Update version in package.json
2. Package new version
3. Install on all peers
4. Approve for organizations
5. Commit with incremented sequence number

## Support

For issues or questions:
- Email: info@imecapitaltokenization.com
- Phone: (248) 678-4819

## License

Apache-2.0

## Version

1.0.0 - Initial release
