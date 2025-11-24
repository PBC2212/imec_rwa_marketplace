#!/bin/bash

# IMEC RWA Marketplace Startup Script
# This script starts both backend and frontend in development mode

echo "=========================================="
echo "IMEC RWA Marketplace - Startup Script"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js >= 16.0.0"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm version: $(npm --version)${NC}"

# Check backend environment file
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Warning: backend/.env not found${NC}"
    echo "Copying from backend/.env.example..."
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}Please edit backend/.env with your configuration${NC}"
fi

# Check frontend environment file
if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}Warning: frontend/.env.local not found${NC}"
    echo "Copying from frontend/.env.local.example..."
    cp frontend/.env.local.example frontend/.env.local
    echo -e "${YELLOW}Please edit frontend/.env.local with your configuration${NC}"
fi

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo ""
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo ""
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
fi

# Check Fabric connection
echo ""
echo "Checking Hyperledger Fabric connection..."
if [ ! -f "backend/connection-org1.json" ]; then
    echo -e "${YELLOW}Warning: backend/connection-org1.json not found${NC}"
    echo "Please configure your Fabric connection profile"
fi

# Check wallet
if [ ! -d "backend/wallet" ] || [ -z "$(ls -A backend/wallet)" ]; then
    echo -e "${YELLOW}Warning: Fabric wallet is empty${NC}"
    echo "You may need to enroll admin: cd backend && npm run enroll-admin"
fi

# Start backend
echo ""
echo "=========================================="
echo "Starting Backend Server..."
echo "=========================================="
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start frontend
echo ""
echo "=========================================="
echo "Starting Frontend Server..."
echo "=========================================="
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait a bit for both to start
sleep 3

echo ""
echo "=========================================="
echo -e "${GREEN}✓ RWA Marketplace Started Successfully!${NC}"
echo "=========================================="
echo ""
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=========================================="

# Handle shutdown
trap "echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID; exit 0" SIGINT SIGTERM

# Wait for processes
wait
