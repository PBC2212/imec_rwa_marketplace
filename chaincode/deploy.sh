#!/bin/bash

# IMEC Chaincode Deployment Script
# Deploys the IMEC RWA Marketplace chaincode to Hyperledger Fabric

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration with defaults
CHANNEL_NAME=${CHANNEL_NAME:-"mychannel"}
CHAINCODE_NAME=${CHAINCODE_NAME:-"imecChaincode"}
CHAINCODE_VERSION=${CHAINCODE_VERSION:-"1.0"}
CHAINCODE_SEQUENCE=${CHAINCODE_SEQUENCE:-"1"}
CHAINCODE_PATH="chaincode/imec-chaincode"

echo -e "${GREEN}===== IMEC Chaincode Deployment =====${NC}"
echo "Channel: ${CHANNEL_NAME}"
echo "Chaincode: ${CHAINCODE_NAME}"
echo "Version: ${CHAINCODE_VERSION}"
echo "Sequence: ${CHAINCODE_SEQUENCE}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v peer &> /dev/null; then
    echo -e "${RED}Error: 'peer' command not found. Install Fabric binaries.${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js not found. Install Node.js 14+.${NC}"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo -e "${RED}Warning: 'jq' not found. Install for better output parsing.${NC}"
fi

# Check environment variables
if [ -z "$CORE_PEER_ADDRESS" ]; then
    echo -e "${RED}Error: CORE_PEER_ADDRESS not set${NC}"
    exit 1
fi

if [ -z "$ORDERER_CA" ]; then
    echo -e "${RED}Error: ORDERER_CA not set${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

# Step 1: Install dependencies
echo -e "${YELLOW}===== Step 1: Installing Dependencies =====${NC}"
cd ${CHAINCODE_PATH}
npm install
cd -
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 2: Package chaincode
echo -e "${YELLOW}===== Step 2: Packaging Chaincode =====${NC}"
PACKAGE_FILE="imec-chaincode-${CHAINCODE_VERSION}.tar.gz"

peer lifecycle chaincode package ${PACKAGE_FILE} \
  --path ${CHAINCODE_PATH} \
  --lang node \
  --label imec_${CHAINCODE_VERSION}

echo -e "${GREEN}✓ Chaincode packaged: ${PACKAGE_FILE}${NC}"
echo ""

# Step 3: Install on peer
echo -e "${YELLOW}===== Step 3: Installing on Peer =====${NC}"
peer lifecycle chaincode install ${PACKAGE_FILE}
echo -e "${GREEN}✓ Chaincode installed on peer${NC}"
echo ""

# Step 4: Get package ID
echo -e "${YELLOW}===== Step 4: Getting Package ID =====${NC}"
if command -v jq &> /dev/null; then
    PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r ".installed_chaincodes[] | select(.label==\"imec_${CHAINCODE_VERSION}\") | .package_id")
else
    # Fallback without jq
    peer lifecycle chaincode queryinstalled
    echo -e "${YELLOW}Please enter the Package ID:${NC}"
    read PACKAGE_ID
fi

if [ -z "$PACKAGE_ID" ]; then
    echo -e "${RED}Error: Could not get package ID${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Package ID: ${PACKAGE_ID}${NC}"
echo ""

# Step 5: Approve for organization
echo -e "${YELLOW}===== Step 5: Approving for Organization =====${NC}"
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

echo -e "${GREEN}✓ Chaincode approved${NC}"
echo ""

# Step 6: Check commit readiness
echo -e "${YELLOW}===== Step 6: Checking Commit Readiness =====${NC}"
peer lifecycle chaincode checkcommitreadiness \
  --channelID ${CHANNEL_NAME} \
  --name ${CHAINCODE_NAME} \
  --version ${CHAINCODE_VERSION} \
  --sequence ${CHAINCODE_SEQUENCE} \
  --tls \
  --cafile ${ORDERER_CA} \
  --output json

echo ""
echo -e "${YELLOW}Proceed with commit? (y/n)${NC}"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment paused. Run commit manually when ready.${NC}"
    exit 0
fi

# Step 7: Commit chaincode
echo -e "${YELLOW}===== Step 7: Committing Chaincode =====${NC}"
peer lifecycle chaincode commit \
  -o orderer.example.com:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --channelID ${CHANNEL_NAME} \
  --name ${CHAINCODE_NAME} \
  --version ${CHAINCODE_VERSION} \
  --sequence ${CHAINCODE_SEQUENCE} \
  --tls \
  --cafile ${ORDERER_CA} \
  --peerAddresses ${CORE_PEER_ADDRESS} \
  --tlsRootCertFiles ${CORE_PEER_TLS_ROOTCERT_FILE}

echo -e "${GREEN}✓ Chaincode committed${NC}"
echo ""

# Step 8: Verify deployment
echo -e "${YELLOW}===== Step 8: Verifying Deployment =====${NC}"
peer lifecycle chaincode querycommitted \
  --channelID ${CHANNEL_NAME} \
  --name ${CHAINCODE_NAME} \
  --cafile ${ORDERER_CA}

echo ""
echo -e "${GREEN}===== Deployment Complete! =====${NC}"
echo -e "${GREEN}Chaincode ${CHAINCODE_NAME} v${CHAINCODE_VERSION} successfully deployed${NC}"
echo ""
echo "You can now invoke chaincode functions:"
echo "  peer chaincode invoke -C ${CHANNEL_NAME} -n ${CHAINCODE_NAME} -c '{...}'"
echo ""
