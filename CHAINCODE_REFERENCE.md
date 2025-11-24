# Hyperledger Fabric Chaincode Reference

This document describes the expected chaincode functions that must be implemented in your Hyperledger Fabric network.

## Chaincode Name

`imecChaincode`

## Channel

`mychannel`

## Required Functions

### Asset Management Functions

#### CreateAsset
```go
func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, assetID string, assetJSON string) error
```

**Parameters:**
- `assetID` (string): Unique identifier for the asset
- `assetJSON` (string): JSON string containing asset data

**Asset JSON Structure:**
```json
{
  "id": "asset-001",
  "name": "Luxury Apartment Building",
  "description": "Prime location residential property",
  "type": "real-estate",
  "location": "New York, NY",
  "value": 5000000,
  "images": ["https://example.com/image1.jpg"],
  "documents": ["deed.pdf", "appraisal.pdf"],
  "metadata": {},
  "owner": "admin",
  "status": "draft",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

#### UpdateAsset
```go
func (s *SmartContract) UpdateAsset(ctx contractapi.TransactionContextInterface, assetID string, updatesJSON string) error
```

#### PublishAsset
```go
func (s *SmartContract) PublishAsset(ctx contractapi.TransactionContextInterface, assetID string) error
```

#### GetAsset
```go
func (s *SmartContract) GetAsset(ctx contractapi.TransactionContextInterface, assetID string) (string, error)
```

#### GetAllAssets
```go
func (s *SmartContract) GetAllAssets(ctx contractapi.TransactionContextInterface) (string, error)
```

Returns JSON array of all assets.

#### GetAssetHistory
```go
func (s *SmartContract) GetAssetHistory(ctx contractapi.TransactionContextInterface, assetID string) (string, error)
```

Returns transaction history for an asset.

---

### Token Management Functions

#### MintTokens
```go
func (s *SmartContract) MintTokens(ctx contractapi.TransactionContextInterface, tokenID string, assetID string, totalSupply string, pricePerToken string, metadataJSON string) error
```

**Parameters:**
- `tokenID` (string): Unique token identifier
- `assetID` (string): Associated asset ID
- `totalSupply` (string): Total token supply
- `pricePerToken` (string): Price per token
- `metadataJSON` (string): Additional metadata

**Token Structure:**
```json
{
  "tokenId": "token-001",
  "assetId": "asset-001",
  "symbol": "IMEC",
  "name": "IMEC Token",
  "totalSupply": 1000000,
  "circulatingSupply": 0,
  "pricePerToken": 10.00,
  "metadata": {},
  "createdAt": "2025-01-01T00:00:00Z"
}
```

#### BurnTokens
```go
func (s *SmartContract) BurnTokens(ctx contractapi.TransactionContextInterface, tokenID string, amount string) error
```

#### TransferTokens
```go
func (s *SmartContract) TransferTokens(ctx contractapi.TransactionContextInterface, tokenID string, fromUser string, toUser string, amount string) error
```

#### UpdateTokenPrice
```go
func (s *SmartContract) UpdateTokenPrice(ctx contractapi.TransactionContextInterface, tokenID string, newPrice string) error
```

#### GetToken
```go
func (s *SmartContract) GetToken(ctx contractapi.TransactionContextInterface, tokenID string) (string, error)
```

#### GetAllTokens
```go
func (s *SmartContract) GetAllTokens(ctx contractapi.TransactionContextInterface) (string, error)
```

---

### Investor Functions

#### RecordPurchase
```go
func (s *SmartContract) RecordPurchase(ctx contractapi.TransactionContextInterface, tokenID string, investorID string, amount string, pricePerToken string, transactionHash string) error
```

Records a token purchase and updates investor balance.

**Purchase Structure:**
```json
{
  "purchaseId": "purchase-001",
  "tokenId": "token-001",
  "investorId": "investor-001",
  "amount": 100,
  "pricePerToken": 10.00,
  "totalCost": 1000.00,
  "transactionHash": "0x...",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

#### GetInvestorBalance
```go
func (s *SmartContract) GetInvestorBalance(ctx contractapi.TransactionContextInterface, investorID string, tokenID string) (string, error)
```

Returns investor's balance for a specific token.

#### GetInvestorPortfolio
```go
func (s *SmartContract) GetInvestorPortfolio(ctx contractapi.TransactionContextInterface, investorID string) (string, error)
```

Returns complete portfolio for an investor (all token holdings).

#### GetAssetInvestors
```go
func (s *SmartContract) GetAssetInvestors(ctx contractapi.TransactionContextInterface, assetID string) (string, error)
```

#### GetTokenInvestors
```go
func (s *SmartContract) GetTokenInvestors(ctx contractapi.TransactionContextInterface, tokenID string) (string, error)
```

---

### Payout Functions

#### RecordPayout
```go
func (s *SmartContract) RecordPayout(ctx contractapi.TransactionContextInterface, assetID string, tokenID string, totalAmount string, payoutDate string, distributionsJSON string) error
```

**Parameters:**
- `assetID` (string): Asset ID
- `tokenID` (string): Token ID
- `totalAmount` (string): Total payout amount
- `payoutDate` (string): Payout date
- `distributionsJSON` (string): JSON array of distributions

**Distribution Structure:**
```json
[
  {
    "investorId": "investor-001",
    "amount": 100.00,
    "tokenBalance": 100,
    "percentage": 10.0
  }
]
```

#### GetAssetPayouts
```go
func (s *SmartContract) GetAssetPayouts(ctx contractapi.TransactionContextInterface, assetID string) (string, error)
```

#### GetInvestorPayouts
```go
func (s *SmartContract) GetInvestorPayouts(ctx contractapi.TransactionContextInterface, investorID string) (string, error)
```

---

### Query Functions

#### QueryAssetsByOwner
```go
func (s *SmartContract) QueryAssetsByOwner(ctx contractapi.TransactionContextInterface, ownerID string) (string, error)
```

#### QueryAssetsByStatus
```go
func (s *SmartContract) QueryAssetsByStatus(ctx contractapi.TransactionContextInterface, status string) (string, error)
```

Status values: `draft`, `published`, `archived`

---

## Key Naming Convention

All keys stored on the ledger follow this pattern:

- Assets: `ASSET~{assetId}`
- Tokens: `TOKEN~{tokenId}`
- Balances: `BALANCE~{investorId}~{tokenId}`
- Purchases: `PURCHASE~{purchaseId}`
- Payouts: `PAYOUT~{payoutId}`

## Composite Keys

For efficient querying, use composite keys:

```go
// Example: Creating a balance composite key
balanceKey, err := ctx.GetStub().CreateCompositeKey("BALANCE", []string{investorID, tokenID})
```

## Events

Emit events for important state changes:

```go
// Example: Emit token minting event
ctx.GetStub().SetEvent("TokenMinted", []byte(tokenJSON))
```

**Event Types:**
- `AssetCreated`
- `AssetUpdated`
- `AssetPublished`
- `TokenMinted`
- `TokenBurned`
- `TokenTransferred`
- `PurchaseRecorded`
- `PayoutRecorded`

## Error Handling

All functions should return appropriate errors:

```go
if asset == nil {
    return fmt.Errorf("asset %s does not exist", assetID)
}
```

## Example Chaincode Structure (Go)

```go
package main

import (
    "encoding/json"
    "fmt"
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
    contractapi.Contract
}

type Asset struct {
    ID          string                 `json:"id"`
    Name        string                 `json:"name"`
    Description string                 `json:"description"`
    Type        string                 `json:"type"`
    Location    string                 `json:"location"`
    Value       float64                `json:"value"`
    Images      []string               `json:"images"`
    Documents   []string               `json:"documents"`
    Metadata    map[string]interface{} `json:"metadata"`
    Owner       string                 `json:"owner"`
    Status      string                 `json:"status"`
    CreatedAt   string                 `json:"createdAt"`
    UpdatedAt   string                 `json:"updatedAt"`
}

type Token struct {
    TokenID           string                 `json:"tokenId"`
    AssetID           string                 `json:"assetId"`
    Symbol            string                 `json:"symbol"`
    Name              string                 `json:"name"`
    TotalSupply       int64                  `json:"totalSupply"`
    CirculatingSupply int64                  `json:"circulatingSupply"`
    PricePerToken     float64                `json:"pricePerToken"`
    Metadata          map[string]interface{} `json:"metadata"`
    CreatedAt         string                 `json:"createdAt"`
}

// Implement all required functions here...

func main() {
    chaincode, err := contractapi.NewChaincode(&SmartContract{})
    if err != nil {
        fmt.Printf("Error creating chaincode: %s", err.Error())
        return
    }

    if err := chaincode.Start(); err != nil {
        fmt.Printf("Error starting chaincode: %s", err.Error())
    }
}
```

## Installation Instructions

### 1. Package Chaincode

```bash
peer lifecycle chaincode package imecChaincode.tar.gz \
    --path ./chaincode \
    --lang golang \
    --label imecChaincode_1
```

### 2. Install on Peers

```bash
peer lifecycle chaincode install imecChaincode.tar.gz
```

### 3. Approve for Organization

```bash
peer lifecycle chaincode approveformyorg \
    --channelID mychannel \
    --name imecChaincode \
    --version 1.0 \
    --package-id <PACKAGE_ID> \
    --sequence 1
```

### 4. Commit to Channel

```bash
peer lifecycle chaincode commit \
    --channelID mychannel \
    --name imecChaincode \
    --version 1.0 \
    --sequence 1
```

### 5. Verify

```bash
peer chaincode query \
    -C mychannel \
    -n imecChaincode \
    -c '{"function":"GetAllAssets","Args":[]}'
```

---

## Testing

Test chaincode functions using peer CLI:

```bash
# Create an asset
peer chaincode invoke \
    -C mychannel \
    -n imecChaincode \
    -c '{"function":"CreateAsset","Args":["asset-001","{\"id\":\"asset-001\",\"name\":\"Test Asset\",\"value\":100000}"]}'

# Query asset
peer chaincode query \
    -C mychannel \
    -n imecChaincode \
    -c '{"function":"GetAsset","Args":["asset-001"]}'
```

---

For complete chaincode implementation examples, refer to:
- [Hyperledger Fabric Samples](https://github.com/hyperledger/fabric-samples)
- [Contract API Documentation](https://hyperledger.github.io/fabric-chaincode-node/)
