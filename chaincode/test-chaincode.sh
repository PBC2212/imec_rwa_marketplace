#!/bin/bash

# IMEC Chaincode Test Script
# Tests all major chaincode functions

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
CHANNEL_NAME=${CHANNEL_NAME:-"mychannel"}
CHAINCODE_NAME=${CHAINCODE_NAME:-"imecChaincode"}
ORDERER_CA=${ORDERER_CA:-"/path/to/orderer/ca.crt"}

echo -e "${GREEN}===== IMEC Chaincode Test Suite =====${NC}"
echo ""

# Test 1: Create Asset
echo -e "${YELLOW}Test 1: Creating test asset...${NC}"
peer chaincode invoke \
  -o orderer.example.com:7050 \
  --tls --cafile ${ORDERER_CA} \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  --peerAddresses ${CORE_PEER_ADDRESS} \
  --tlsRootCertFiles ${CORE_PEER_TLS_ROOTCERT_FILE} \
  -c '{"function":"AssetContract:CreateAsset","Args":["test_asset_001","{\"name\":\"Test Real Estate\",\"description\":\"Test property for verification\",\"assetType\":\"real-estate\",\"totalValue\":1000000,\"location\":\"New York\"}"]}'

sleep 3
echo -e "${GREEN}✓ Asset created${NC}"
echo ""

# Test 2: Query Asset
echo -e "${YELLOW}Test 2: Querying asset...${NC}"
ASSET_RESULT=$(peer chaincode query \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  -c '{"function":"AssetContract:GetAsset","Args":["test_asset_001"]}')

echo "${ASSET_RESULT}"
echo -e "${GREEN}✓ Asset queried${NC}"
echo ""

# Test 3: Mint Tokens
echo -e "${YELLOW}Test 3: Minting tokens...${NC}"
peer chaincode invoke \
  -o orderer.example.com:7050 \
  --tls --cafile ${ORDERER_CA} \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  --peerAddresses ${CORE_PEER_ADDRESS} \
  --tlsRootCertFiles ${CORE_PEER_TLS_ROOTCERT_FILE} \
  -c '{"function":"TokenContract:MintTokens","Args":["test_token_001","test_asset_001","{\"symbol\":\"TEST-RE-001\",\"name\":\"Test Real Estate Token\",\"totalSupply\":10000,\"pricePerToken\":100}"]}'

sleep 3
echo -e "${GREEN}✓ Tokens minted${NC}"
echo ""

# Test 4: Query Token
echo -e "${YELLOW}Test 4: Querying token...${NC}"
TOKEN_RESULT=$(peer chaincode query \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  -c '{"function":"TokenContract:GetToken","Args":["test_token_001"]}')

echo "${TOKEN_RESULT}"
echo -e "${GREEN}✓ Token queried${NC}"
echo ""

# Test 5: Publish Asset
echo -e "${YELLOW}Test 5: Publishing asset...${NC}"
peer chaincode invoke \
  -o orderer.example.com:7050 \
  --tls --cafile ${ORDERER_CA} \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  --peerAddresses ${CORE_PEER_ADDRESS} \
  --tlsRootCertFiles ${CORE_PEER_TLS_ROOTCERT_FILE} \
  -c '{"function":"AssetContract:PublishAsset","Args":["test_asset_001"]}'

sleep 3
echo -e "${GREEN}✓ Asset published${NC}"
echo ""

# Test 6: Register Investor
echo -e "${YELLOW}Test 6: Registering investor...${NC}"
peer chaincode invoke \
  -o orderer.example.com:7050 \
  --tls --cafile ${ORDERER_CA} \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  --peerAddresses ${CORE_PEER_ADDRESS} \
  --tlsRootCertFiles ${CORE_PEER_TLS_ROOTCERT_FILE} \
  -c '{"function":"InvestorContract:RegisterInvestor","Args":["test_investor_001","{\"name\":\"Test Investor\",\"email\":\"test@example.com\",\"kycVerified\":true}"]}'

sleep 3
echo -e "${GREEN}✓ Investor registered${NC}"
echo ""

# Test 7: Record Purchase
echo -e "${YELLOW}Test 7: Recording token purchase...${NC}"
peer chaincode invoke \
  -o orderer.example.com:7050 \
  --tls --cafile ${ORDERER_CA} \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  --peerAddresses ${CORE_PEER_ADDRESS} \
  --tlsRootCertFiles ${CORE_PEER_TLS_ROOTCERT_FILE} \
  -c '{"function":"InvestorContract:RecordPurchase","Args":["test_purchase_001","test_investor_001","test_token_001","100","10000"]}'

sleep 3
echo -e "${GREEN}✓ Purchase recorded${NC}"
echo ""

# Test 8: Get Investor Portfolio
echo -e "${YELLOW}Test 8: Querying investor portfolio...${NC}"
PORTFOLIO_RESULT=$(peer chaincode query \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  -c '{"function":"InvestorContract:GetInvestorPortfolio","Args":["test_investor_001"]}')

echo "${PORTFOLIO_RESULT}"
echo -e "${GREEN}✓ Portfolio queried${NC}"
echo ""

# Test 9: Record Payout
echo -e "${YELLOW}Test 9: Recording payout...${NC}"
peer chaincode invoke \
  -o orderer.example.com:7050 \
  --tls --cafile ${ORDERER_CA} \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  --peerAddresses ${CORE_PEER_ADDRESS} \
  --tlsRootCertFiles ${CORE_PEER_TLS_ROOTCERT_FILE} \
  -c '{"function":"PayoutContract:RecordPayout","Args":["test_payout_001","test_asset_001","test_token_001","1000","dividend","Test quarterly dividend"]}'

sleep 3
echo -e "${GREEN}✓ Payout recorded${NC}"
echo ""

# Test 10: Distribute Payout
echo -e "${YELLOW}Test 10: Distributing payout...${NC}"
peer chaincode invoke \
  -o orderer.example.com:7050 \
  --tls --cafile ${ORDERER_CA} \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  --peerAddresses ${CORE_PEER_ADDRESS} \
  --tlsRootCertFiles ${CORE_PEER_TLS_ROOTCERT_FILE} \
  -c '{"function":"PayoutContract:DistributePayout","Args":["test_payout_001"]}'

sleep 3
echo -e "${GREEN}✓ Payout distributed${NC}"
echo ""

# Test 11: Get Investor Payouts
echo -e "${YELLOW}Test 11: Querying investor payouts...${NC}"
PAYOUT_RESULT=$(peer chaincode query \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  -c '{"function":"PayoutContract:GetInvestorPayouts","Args":["test_investor_001"]}')

echo "${PAYOUT_RESULT}"
echo -e "${GREEN}✓ Investor payouts queried${NC}"
echo ""

# Test 12: Get Token Statistics
echo -e "${YELLOW}Test 12: Querying token statistics...${NC}"
STATS_RESULT=$(peer chaincode query \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  -c '{"function":"TokenContract:GetTokenStatistics","Args":["test_token_001"]}')

echo "${STATS_RESULT}"
echo -e "${GREEN}✓ Token statistics queried${NC}"
echo ""

# Test 13: Get Asset History
echo -e "${YELLOW}Test 13: Querying asset history...${NC}"
HISTORY_RESULT=$(peer chaincode query \
  -C ${CHANNEL_NAME} \
  -n ${CHAINCODE_NAME} \
  -c '{"function":"AssetContract:GetAssetHistory","Args":["test_asset_001"]}')

echo "${HISTORY_RESULT}"
echo -e "${GREEN}✓ Asset history queried${NC}"
echo ""

echo -e "${GREEN}===== All Tests Completed Successfully! =====${NC}"
echo ""
echo "Summary:"
echo "  ✓ Asset created and published"
echo "  ✓ Tokens minted"
echo "  ✓ Investor registered"
echo "  ✓ Purchase recorded"
echo "  ✓ Portfolio tracked"
echo "  ✓ Payout distributed"
echo "  ✓ All queries working"
echo ""
