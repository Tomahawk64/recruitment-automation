# Local Testing Before Render Deployment

Write-Host "`n🚀 Starting Recruitment Automation System Locally`n" -ForegroundColor Cyan

# Check if .env files exist
if (-not (Test-Path "backend\.env")) {
    Write-Host "❌ backend\.env not found! Copy from backend\.env.example" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "frontend\.env")) {
    Write-Host "❌ frontend\.env not found! Copy from frontend\.env.example" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Environment files found`n" -ForegroundColor Green

# Start Backend
Write-Host "📦 Starting Backend Server (Port 4000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm start"

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "🎨 Starting Frontend Dev Server (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "`n✅ Both servers starting..." -ForegroundColor Green
Write-Host "   Backend:  http://localhost:4000" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`n   Press Ctrl+C in each terminal to stop`n" -ForegroundColor Yellow
