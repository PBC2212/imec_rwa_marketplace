# Verification Script for IMEC RWA Marketplace
# Checks if all required files and configurations are in place

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "IMEC RWA Marketplace - Verification" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$errors = 0
$warnings = 0

# Function to check file exists
function Test-FileExists {
    param([string]$path, [string]$name, [bool]$required = $true)
    
    if (Test-Path $path) {
        Write-Host "[OK] $name" -ForegroundColor Green
        return $true
    } else {
        if ($required) {
            Write-Host "[ERROR] $name - Missing" -ForegroundColor Red
            $script:errors++
        } else {
            Write-Host "[WARN] $name - Missing (optional)" -ForegroundColor Yellow
            $script:warnings++
        }
        return $false
    }
}

# Function to check directory exists
function Test-DirectoryExists {
    param([string]$path, [string]$name)
    
    if (Test-Path $path -PathType Container) {
        Write-Host "[OK] $name" -ForegroundColor Green
        return $true
    } else {
        Write-Host "[ERROR] $name - Missing" -ForegroundColor Red
        $script:errors++
        return $false
    }
}

Write-Host "Checking Project Structure..." -ForegroundColor White
Write-Host ""

# Root Files
Write-Host "Root Files:" -ForegroundColor Yellow
Test-FileExists "README.md" "README.md"
Test-FileExists "QUICK_START.md" "QUICK_START.md"
Test-FileExists "INSTALLATION.md" "INSTALLATION.md"
Test-FileExists "CHAINCODE_REFERENCE.md" "CHAINCODE_REFERENCE.md"
Test-FileExists "PROJECT_SUMMARY.md" "PROJECT_SUMMARY.md"
Test-FileExists "BUILD_COMPLETE.md" "BUILD_COMPLETE.md"
Test-FileExists "CHECKLIST.md" "CHECKLIST.md"
Test-FileExists "docker-compose.yml" "docker-compose.yml"
Test-FileExists "ecosystem.config.js" "ecosystem.config.js"
Test-FileExists "package.json" "package.json"
Test-FileExists ".gitignore" ".gitignore"
Write-Host ""

# Backend Structure
Write-Host "Backend Structure:" -ForegroundColor Yellow
Test-DirectoryExists "backend" "backend/"
Test-FileExists "backend\package.json" "backend/package.json"
Test-FileExists "backend\.env" "backend/.env"
Test-FileExists "backend\connection-org1.json" "backend/connection-org1.json"
Test-DirectoryExists "backend\src" "backend/src/"
Test-DirectoryExists "backend\src\fabric" "backend/src/fabric/"
Test-DirectoryExists "backend\src\routes" "backend/src/routes/"
Test-DirectoryExists "backend\src\services" "backend/src/services/"
Test-DirectoryExists "backend\wallet" "backend/wallet/"
Write-Host ""

# Backend Files
Write-Host "Backend Files:" -ForegroundColor Yellow
Test-FileExists "backend\src\server.js" "server.js"
Test-FileExists "backend\src\fabric\gateway.js" "gateway.js"
Test-FileExists "backend\src\fabric\enrollAdmin.js" "enrollAdmin.js"
Test-FileExists "backend\src\fabric\registerUser.js" "registerUser.js"
Test-FileExists "backend\src\fabric\chaincode.js" "chaincode.js"
Test-FileExists "backend\src\routes\public.js" "public.js"
Test-FileExists "backend\src\routes\admin.js" "admin.js"
Test-FileExists "backend\src\routes\investor.js" "investor.js"
Test-FileExists "backend\scripts\sync.js" "sync.js"
Write-Host ""

# Frontend Structure
Write-Host "Frontend Structure:" -ForegroundColor Yellow
Test-DirectoryExists "frontend" "frontend/"
Test-FileExists "frontend\package.json" "frontend/package.json"
Test-FileExists "frontend\.env.local" "frontend/.env.local"
Test-FileExists "frontend\next.config.js" "next.config.js"
Test-FileExists "frontend\tailwind.config.js" "tailwind.config.js"
Test-FileExists "frontend\tsconfig.json" "tsconfig.json"
Test-DirectoryExists "frontend\src\app" "frontend/src/app/"
Test-DirectoryExists "frontend\src\lib" "frontend/src/lib/"
Write-Host ""

# Frontend Files
Write-Host "Frontend Files:" -ForegroundColor Yellow
Test-FileExists "frontend\src\app\page.tsx" "page.tsx (Home)"
Test-FileExists "frontend\src\app\layout.tsx" "layout.tsx"
Test-FileExists "frontend\src\app\admin\page.tsx" "admin/page.tsx"
Test-FileExists "frontend\src\app\invest\page.tsx" "invest/page.tsx"
Test-FileExists "frontend\src\app\portfolio\page.tsx" "portfolio/page.tsx"
Test-FileExists "frontend\src\app\asset\[id]\page.tsx" "asset/[id]/page.tsx"
Test-FileExists "frontend\src\lib\api.ts" "api.ts"
Test-FileExists "frontend\src\lib\utils.ts" "utils.ts"
Write-Host ""

# Check Configuration
Write-Host "Configuration Check:" -ForegroundColor Yellow

# Check backend .env
if (Test-Path "backend\.env") {
    $envContent = Get-Content "backend\.env" -Raw
    if ($envContent -match "AUTH_API_KEY=imec-rwa-dev-key-change-this-in-production") {
        Write-Host "[WARN] AUTH_API_KEY still has default value - change for production" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host "[OK] AUTH_API_KEY is customized" -ForegroundColor Green
    }
}

# Check frontend .env.local
if (Test-Path "frontend\.env.local") {
    $envContent = Get-Content "frontend\.env.local" -Raw
    if ($envContent -match "imec-rwa-dev-key-change-this-in-production") {
        Write-Host "[WARN] Frontend API key still has default value - change for production" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host "[OK] Frontend API key is customized" -ForegroundColor Green
    }
}

# Check Node.js
Write-Host ""
Write-Host "Node.js Check:" -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js $nodeVersion installed" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js not found" -ForegroundColor Red
    $errors++
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "[OK] npm $npmVersion installed" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm not found" -ForegroundColor Red
    $errors++
}

# Check Docker (optional)
Write-Host ""
Write-Host "Optional Tools:" -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "[OK] Docker installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "[INFO] Docker not installed (optional)" -ForegroundColor Gray
}

# Check PM2 (optional)
try {
    $pm2Version = pm2 --version
    Write-Host "[OK] PM2 installed: v$pm2Version" -ForegroundColor Green
} catch {
    Write-Host "[INFO] PM2 not installed (optional)" -ForegroundColor Gray
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification Summary" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "[SUCCESS] All checks passed!" -ForegroundColor Green
    Write-Host "Your project is ready to run." -ForegroundColor Green
} elseif ($errors -eq 0) {
    Write-Host "[SUCCESS] All required files present" -ForegroundColor Green
    Write-Host "[WARN] $warnings warning(s) found" -ForegroundColor Yellow
    Write-Host "Review warnings above." -ForegroundColor Yellow
} else {
    Write-Host "[ERROR] $errors error(s) found" -ForegroundColor Red
    if ($warnings -gt 0) {
        Write-Host "[WARN] $warnings warning(s) found" -ForegroundColor Yellow
    }
    Write-Host "Please fix errors before running." -ForegroundColor Red
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor White
Write-Host "1. Review any errors or warnings above" -ForegroundColor Gray
Write-Host "2. Install dependencies: cd backend && npm install" -ForegroundColor Gray
Write-Host "3. Install dependencies: cd frontend && npm install" -ForegroundColor Gray
Write-Host "4. Configure Fabric: Edit backend/connection-org1.json" -ForegroundColor Gray
Write-Host "5. Enroll admin: cd backend && npm run enroll-admin" -ForegroundColor Gray
Write-Host "6. Start application: .\start.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "For detailed instructions, see QUICK_START.md" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
