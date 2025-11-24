# IMEC RWA Marketplace Startup Script (PowerShell)
# This script starts both backend and frontend in development mode

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "IMEC RWA Marketplace - Startup Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install Node.js >= 16.0.0"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: npm is not installed" -ForegroundColor Red
    exit 1
}

# Check backend environment file
if (-not (Test-Path "backend\.env")) {
    Write-Host "Warning: backend\.env not found" -ForegroundColor Yellow
    Write-Host "Copying from backend\.env.example..."
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "Please edit backend\.env with your configuration" -ForegroundColor Yellow
}

# Check frontend environment file
if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "Warning: frontend\.env.local not found" -ForegroundColor Yellow
    Write-Host "Copying from frontend\.env.local.example..."
    Copy-Item "frontend\.env.local.example" "frontend\.env.local"
    Write-Host "Please edit frontend\.env.local with your configuration" -ForegroundColor Yellow
}

# Check if backend dependencies are installed
if (-not (Test-Path "backend\node_modules")) {
    Write-Host ""
    Write-Host "Installing backend dependencies..."
    Set-Location backend
    npm install
    Set-Location ..
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
}

# Check if frontend dependencies are installed
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host ""
    Write-Host "Installing frontend dependencies..."
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
}

# Check Fabric connection
Write-Host ""
Write-Host "Checking Hyperledger Fabric connection..."
if (-not (Test-Path "backend\connection-org1.json")) {
    Write-Host "Warning: backend\connection-org1.json not found" -ForegroundColor Yellow
    Write-Host "Please configure your Fabric connection profile"
}

# Check wallet
if (-not (Test-Path "backend\wallet") -or (Get-ChildItem "backend\wallet" -ErrorAction SilentlyContinue).Count -eq 0) {
    Write-Host "Warning: Fabric wallet is empty" -ForegroundColor Yellow
    Write-Host "You may need to enroll admin: cd backend && npm run enroll-admin"
}

# Start backend in new window
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait for backend to start
Write-Host "Waiting for backend to start..."
Start-Sleep -Seconds 5

# Start frontend in new window
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# Wait a bit
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✓ RWA Marketplace Started Successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:3001" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Both servers are running in separate windows."
Write-Host "Close those windows to stop the servers."
Write-Host "==========================================" -ForegroundColor Cyan
