# Q-Voting Ultra - Unified Startup Script
# Starts Backend and Frontend servers automatically

Write-Host "🚀 INITIALIZING Q-VOTING ULTRA..." -ForegroundColor Cyan

# 1. Start Backend in a new process
Write-Host "Starting Backend Service (Port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

# 2. Start Frontend in a new process
Write-Host "Starting Frontend Service (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# 3. Wait a moment for servers to spin up
Write-Host "Waiting for services to stabilize..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# 4. Open the Application
Write-Host "✅ SYSTEM ACTIVE. Opening Dashboard..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "⚠️  KEEP THIS WINDOW OPEN." -ForegroundColor Red
Write-Host "    - Backend is running in a separate window."
Write-Host "    - Frontend is running in a separate window."
Write-Host "    - Press Ctrl+C in those windows to stop servers."
