# Pre-Deployment Setup Script
# Run this before deploying to prepare your files

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Pre-Deployment Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Check if we're in the right directory
if (-not (Test-Path ".\backend") -or -not (Test-Path ".\frontend")) {
    Write-Host "ERROR: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Creating backend .env file..." -ForegroundColor Yellow
if (Test-Path ".\backend\.env") {
    Write-Host "  ✓ .env already exists" -ForegroundColor Green
} else {
    Copy-Item ".\backend\.env.example" ".\backend\.env"
    Write-Host "  ✓ Created .env from .env.example" -ForegroundColor Green
    Write-Host "  ⚠ IMPORTANT: Edit backend\.env and update these values:" -ForegroundColor Yellow
    Write-Host "    - MONGO_URI (your MongoDB connection string)" -ForegroundColor White
    Write-Host "    - JWT_SECRET (change to a secure random string)" -ForegroundColor White
}

Write-Host ""
Write-Host "Step 2: Creating frontend .env file..." -ForegroundColor Yellow
if (Test-Path ".\frontend\.env") {
    Write-Host "  ✓ .env already exists" -ForegroundColor Green
} else {
    Copy-Item ".\frontend\.env.example" ".\frontend\.env"
    Write-Host "  ✓ Created .env from .env.example" -ForegroundColor Green
    Write-Host "  ✓ Already configured for AWS backend (13.61.100.205)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 3: Checking dependencies..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js not found! Please install Node.js 18 or higher" -ForegroundColor Red
    Write-Host "    Download: https://nodejs.org/" -ForegroundColor White
    exit 1
}

# Check Git
try {
    $gitVersion = git --version
    Write-Host "  ✓ Git installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Git not found! Please install Git" -ForegroundColor Red
    Write-Host "    Download: https://git-scm.com/" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Step 4: Installing backend dependencies..." -ForegroundColor Yellow
Set-Location ".\backend"
if (Test-Path ".\node_modules") {
    Write-Host "  ℹ node_modules exists, skipping..." -ForegroundColor Gray
} else {
    npm install --production
    Write-Host "  ✓ Backend dependencies installed" -ForegroundColor Green
}
Set-Location ".."

Write-Host ""
Write-Host "Step 5: Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ".\frontend"
if (Test-Path ".\node_modules") {
    Write-Host "  ℹ node_modules exists, skipping..." -ForegroundColor Gray
} else {
    npm install
    Write-Host "  ✓ Frontend dependencies installed" -ForegroundColor Green
}
Set-Location ".."

Write-Host ""
Write-Host "Step 6: Creating logs directory for backend..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path ".\backend\logs" | Out-Null
Write-Host "  ✓ Logs directory created" -ForegroundColor Green

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Edit backend\.env file:" -ForegroundColor White
Write-Host "   notepad .\backend\.env" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test locally (optional):" -ForegroundColor White
Write-Host "   .\START_LOCAL.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Push to GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m ""Prepare for deployment""" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Deploy backend to AWS:" -ForegroundColor White
Write-Host "   Follow AWS_BACKEND_DEPLOYMENT.md" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Deploy frontend to Render:" -ForegroundColor White
Write-Host "   Follow RENDER_FRONTEND_DEPLOYMENT.md" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - DEPLOYMENT_GUIDE.md (Start here!)" -ForegroundColor White
Write-Host "   - AWS_BACKEND_DEPLOYMENT.md (Detailed AWS guide)" -ForegroundColor White
Write-Host "   - RENDER_FRONTEND_DEPLOYMENT.md (Detailed Render guide)" -ForegroundColor White
Write-Host ""
