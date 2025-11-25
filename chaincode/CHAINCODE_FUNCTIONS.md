# IMEC Chaincode Function Reference

Complete reference guide for all chaincode functions in the IMEC RWA Marketplace.

## Table of Contents

1. [Asset Contract Functions](#asset-contract-functions)
2. [Token Contract Functions](#token-contract-functions)
3. [Investor Contract Functions](#investor-contract-functions)
4. [Payout Contract Functions](#payout-contract-functions)
5. [Usage Examples](#usage-examples)
6. [Events Reference](#events-reference)

---

## Asset Contract Functions

### CreateAsset
Creates a new real-world asset on the blockchain.

**Parameters:**
- `assetId` (string): Unique asset identifier
- `assetData` (JSON string): Asset details

**Required Fields in assetData:**
- `name`: Asset name
- `description`: Asset description
- `assetType`: Type (e.g., "real-estate", "art", "commodity")
- `totalValue`: Total asset value

**Returns:** Created asset object

**Example:**
```bash
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"AssetContract:CreateAsset","Args":["asset_001","{\"name\":\"Downtown Office Building\",\"description\":\"Prime commercial property\",\"assetType\":\"real-estate\",\"totalValue\":5000000}"]}'
```

---

### UpdateAsset
Updates existing asset information.

**Parameters:**
- `assetId` (string): Asset identifier
- `updateData` (JSON string): Fields to update

**Protected Fields:** id, docType, createdAt, createdBy

**Returns:** Updated asset object

**Example:**
```bash
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"AssetContract:UpdateAsset","Args":["asset_001","{\"description\":\"Updated description\",\"totalValue\":5500000}"]}'
```

---

### PublishAsset
Makes an asset available for investment.

**Parameters:**
- `assetId` (string): Asset identifier

**Requirements:**
- Asset must have associated tokens (tokenId must exist)

**Returns:** Published asset object

**Example:**
```bash
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"AssetContract:PublishAsset","Args":["asset_001"]}'
```

---

### GetAsset
Retrieves asset details by ID.

**Parameters:**
- `assetId` (string): Asset identifier

**Returns:** Asset object

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"AssetContract:GetAsset","Args":["asset_001"]}'
```

---

### GetAllAssets
Retrieves all assets, optionally filtered.

**Parameters:**
- `filterQuery` (optional JSON string): CouchDB query selector

**Returns:** Array of asset objects

**Example (all assets):**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"AssetContract:GetAllAssets","Args":[]}'
```

**Example (with filter):**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"AssetContract:GetAllAssets","Args":["{\"selector\":{\"assetType\":\"real-estate\"}}"]}'
```

---

### GetPublishedAssets
Retrieves only published assets.

**Parameters:** None

**Returns:** Array of published assets

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"AssetContract:GetPublishedAssets","Args":[]}'
```

---

### GetAssetHistory
Retrieves complete transaction history for an asset.

**Parameters:**
- `assetId` (string): Asset identifier

**Returns:** Array of historical records with timestamps and transaction IDs

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"AssetContract:GetAssetHistory","Args":["asset_001"]}'
```

---

### GetAssetsByType
Filters assets by type.

**Parameters:**
- `assetType` (string): Type of asset

**Returns:** Array of matching assets

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"AssetContract:GetAssetsByType","Args":["real-estate"]}'
```

---

### ArchiveAsset
Archives an asset (removes from active listings).

**Parameters:**
- `assetId` (string): Asset identifier

**Returns:** Archived asset object

---

### DeleteAsset
Permanently deletes an asset (admin only, use with caution).

**Parameters:**
- `assetId` (string): Asset identifier

**Returns:** Success message

---

## Token Contract Functions

### MintTokens
Creates new tokens for an asset.

**Parameters:**
- `tokenId` (string): Unique token identifier
- `assetId` (string): Associated asset ID
- `tokenData` (JSON string): Token details

**Required Fields in tokenData:**
- `symbol`: Token symbol
- `name`: Token name
- `totalSupply`: Total number of tokens
- `pricePerToken`: Price per token

**Returns:** Created token object

**Example:**
```bash
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"TokenContract:MintTokens","Args":["token_001","asset_001","{\"symbol\":\"IMEC-RE-001\",\"name\":\"Office Building Token\",\"totalSupply\":100000,\"pricePerToken\":50}"]}'
```

---

### BurnTokens
Removes tokens from circulation.

**Parameters:**
- `tokenId` (string): Token identifier
- `amount` (number): Amount to burn

**Returns:** Updated token object

**Example:**
```bash
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"TokenContract:BurnTokens","Args":["token_001","1000"]}'
```

---

### TransferTokens
Transfers tokens between investors.

**Parameters:**
- `tokenId` (string): Token identifier
- `fromInvestor` (string): Sender investor ID
- `toInvestor` (string): Recipient investor ID
- `amount` (number): Amount to transfer

**Returns:** Transfer record

**Example:**
```bash
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"TokenContract:TransferTokens","Args":["token_001","investor_001","investor_002","500"]}'
```

---

### UpdateTokenPrice
Updates the market price of a token.

**Parameters:**
- `tokenId` (string): Token identifier
- `newPrice` (number): New price per token

**Returns:** Updated token object with price history

**Example:**
```bash
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"TokenContract:UpdateTokenPrice","Args":["token_001","55"]}'
```

---

### GetToken
Retrieves token details.

**Parameters:**
- `tokenId` (string): Token identifier

**Returns:** Token object

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"TokenContract:GetToken","Args":["token_001"]}'
```

---

### GetAllTokens
Retrieves all tokens.

**Parameters:** None

**Returns:** Array of token objects

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"TokenContract:GetAllTokens","Args":[]}'
```

---

### GetTokenBalance
Gets an investor's balance for a specific token.

**Parameters:**
- `tokenId` (string): Token identifier
- `investorId` (string): Investor identifier

**Returns:** Balance object with current value

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"TokenContract:GetTokenBalance","Args":["token_001","investor_001"]}'
```

---

### GetTokenStatistics
Gets comprehensive statistics for a token.

**Parameters:**
- `tokenId` (string): Token identifier

**Returns:** Statistics object with supply, market cap, utilization rate, etc.

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"TokenContract:GetTokenStatistics","Args":["token_001"]}'
```

---

### GetTokenTransferHistory
Gets all transfers for a token.

**Parameters:**
- `tokenId` (string): Token identifier

**Returns:** Array of transfer records

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"TokenContract:GetTokenTransferHistory","Args":["token_001"]}'
```

---

## Investor Contract Functions

### RegisterInvestor
Registers a new investor on the platform.

**Parameters:**
- `investorId` (string): Unique investor identifier
- `investorData` (JSON string): Investor details

**Optional Fields:**
- `name`: Investor name
- `email`: Email address
- `kycVerified`: KYC status (default: false)

**Returns:** Created investor object

**Example:**
```bash
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"InvestorContract:RegisterInvestor","Args":["investor_001","{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"kycVerified\":true}"]}'
```

---

### RecordPurchase
Records a token purchase by an investor.

**Parameters:**
- `purchaseId` (string): Unique purchase identifier
- `investorId` (string): Investor identifier
- `tokenId` (string): Token identifier
- `amount` (number): Number of tokens purchased
- `totalPrice` (number): Total purchase price

**Effects:**
- Updates investor balance
- Updates token circulating supply
- Records purchase transaction

**Returns:** Purchase record

**Example:**
```bash
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"InvestorContract:RecordPurchase","Args":["purchase_001","investor_001","token_001","1000","50000"]}'
```

---

### GetInvestorBalance
Gets investor's balance for a specific token.

**Parameters:**
- `investorId` (string): Investor identifier
- `tokenId` (string): Token identifier

**Returns:** Balance object with current value

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"InvestorContract:GetInvestorBalance","Args":["investor_001","token_001"]}'
```

---

### GetInvestorPortfolio
Gets complete portfolio with profit/loss analysis.

**Parameters:**
- `investorId` (string): Investor identifier

**Returns:** Portfolio object with:
- All holdings
- Total invested amount
- Current value
- Profit/loss calculations
- Percentage returns

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"InvestorContract:GetInvestorPortfolio","Args":["investor_001"]}'
```

---

### GetTokenInvestors
Gets all investors holding a specific token.

**Parameters:**
- `tokenId` (string): Token identifier

**Returns:** Array of investor objects with balances

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"InvestorContract:GetTokenInvestors","Args":["token_001"]}'
```

---

### GetInvestorPurchaseHistory
Gets purchase history for an investor.

**Parameters:**
- `investorId` (string): Investor identifier

**Returns:** Array of purchase records sorted by date (descending)

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"InvestorContract:GetInvestorPurchaseHistory","Args":["investor_001"]}'
```

---

### UpdateKYCStatus
Updates investor KYC verification status.

**Parameters:**
- `investorId` (string): Investor identifier
- `verified` (boolean): Verification status

**Returns:** Updated investor object

**Example:**
```bash
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"InvestorContract:UpdateKYCStatus","Args":["investor_001","true"]}'
```

---

## Payout Contract Functions

### RecordPayout
Records a new payout for an asset.

**Parameters:**
- `payoutId` (string): Unique payout identifier
- `assetId` (string): Asset identifier
- `tokenId` (string): Token identifier
- `totalAmount` (number): Total payout amount
- `payoutType` (string): Type (e.g., "dividend", "revenue", "rental")
- `description` (string): Payout description

**Returns:** Payout record with calculated per-token amount

**Example:**
```bash
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"PayoutContract:RecordPayout","Args":["payout_001","asset_001","token_001","100000","dividend","Q1 2025 dividend distribution"]}'
```

---

### DistributePayout
Distributes a payout to all token holders.

**Parameters:**
- `payoutId` (string): Payout identifier

**Effects:**
- Creates distribution records for each investor
- Calculates individual amounts based on holdings
- Updates payout status to "completed"

**Returns:** Payout and distribution details

**Example:**
```bash
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"PayoutContract:DistributePayout","Args":["payout_001"]}'
```

---

### GetAssetPayouts
Gets all payouts for an asset.

**Parameters:**
- `assetId` (string): Asset identifier

**Returns:** Payouts array with statistics

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"PayoutContract:GetAssetPayouts","Args":["asset_001"]}'
```

---

### GetInvestorPayouts
Gets all payouts received by an investor.

**Parameters:**
- `investorId` (string): Investor identifier

**Returns:** Distributions array with payout details and statistics

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"PayoutContract:GetInvestorPayouts","Args":["investor_001"]}'
```

---

### GetTokenPayoutStatistics
Gets payout statistics for a token.

**Parameters:**
- `tokenId` (string): Token identifier

**Returns:** Statistics object with totals and averages

**Example:**
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"PayoutContract:GetTokenPayoutStatistics","Args":["token_001"]}'
```

---

### CancelPayout
Cancels a pending payout.

**Parameters:**
- `payoutId` (string): Payout identifier
- `reason` (string): Cancellation reason

**Returns:** Cancelled payout object

**Example:**
```bash
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"PayoutContract:CancelPayout","Args":["payout_001","Market conditions changed"]}'
```

---

## Events Reference

All chaincode functions emit events for auditability and real-time tracking.

### Asset Events
- **AssetCreated**: Emitted when asset is created
- **AssetUpdated**: Emitted when asset is updated
- **AssetPublished**: Emitted when asset is published
- **AssetArchived**: Emitted when asset is archived
- **AssetDeleted**: Emitted when asset is deleted

### Token Events
- **TokensMinted**: Emitted when tokens are created
- **TokensBurned**: Emitted when tokens are burned
- **TokensTransferred**: Emitted when tokens are transferred
- **TokenPriceUpdated**: Emitted when token price changes

### Investor Events
- **InvestorRegistered**: Emitted when investor registers
- **PurchaseRecorded**: Emitted when purchase is recorded
- **KYCStatusUpdated**: Emitted when KYC status changes

### Payout Events
- **PayoutRecorded**: Emitted when payout is recorded
- **PayoutDistributed**: Emitted when payout is distributed
- **PayoutCancelled**: Emitted when payout is cancelled

---

## Complete Workflow Example

### 1. Create and Publish Asset
```bash
# Create asset
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"AssetContract:CreateAsset","Args":["asset_re_001","{\"name\":\"Luxury Apartments\",\"description\":\"Downtown luxury apartments\",\"assetType\":\"real-estate\",\"totalValue\":10000000}"]}'

# Mint tokens
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"TokenContract:MintTokens","Args":["token_re_001","asset_re_001","{\"symbol\":\"IMEC-LXAP\",\"name\":\"Luxury Apartments Token\",\"totalSupply\":200000,\"pricePerToken\":50}"]}'

# Publish asset
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"AssetContract:PublishAsset","Args":["asset_re_001"]}'
```

### 2. Register Investor and Record Purchase
```bash
# Register investor
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"InvestorContract:RegisterInvestor","Args":["inv_001","{\"name\":\"Alice Smith\",\"email\":\"alice@example.com\"}"]}'

# Record purchase
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"InvestorContract:RecordPurchase","Args":["purch_001","inv_001","token_re_001","2000","100000"]}'
```

### 3. Distribute Payout
```bash
# Record payout
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"PayoutContract:RecordPayout","Args":["pay_001","asset_re_001","token_re_001","50000","rental","Monthly rental income"]}'

# Distribute to holders
peer chaincode invoke -C mychannel -n imecChaincode \
  -c '{"function":"PayoutContract:DistributePayout","Args":["pay_001"]}'
```

### 4. Query Portfolio
```bash
peer chaincode query -C mychannel -n imecChaincode \
  -c '{"function":"InvestorContract:GetInvestorPortfolio","Args":["inv_001"]}'
```

---

## Notes

- All invoke operations require consensus from endorsing peers
- Query operations are read-only and don't create transactions
- All amounts should be provided as strings to avoid precision issues
- JSON strings must be properly escaped in command line
- Events can be subscribed to using Fabric SDK event services

## Support

For questions or issues:
- Email: info@imecapitaltokenization.com
- Phone: (248) 678-4819
