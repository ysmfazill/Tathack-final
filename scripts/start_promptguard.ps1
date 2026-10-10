Write-Host "Starting PromptGuard AI..." -ForegroundColor Cyan

# Check for node and python
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js is required but not found." -ForegroundColor Red
    exit 1
}
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Python is required but not found." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "backend\.venv\Scripts\activate.ps1")) {
    Write-Host "Error: Backend virtual environment not found in backend\.venv" -ForegroundColor Red
    exit 1
}

# Check if port 8080 is already in use
$port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($port8080) {
    Write-Host "Warning: Port 8080 is already in use. Ensure backend is not already running." -ForegroundColor Yellow
} else {
    Write-Host "Launching Backend (Uvicorn)..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\.venv\Scripts\activate.ps1; python -m uvicorn app.main:app --host 127.0.0.1 --port 8080"
}

# Check if port 3000 is already in use
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "Warning: Port 3000 is already in use. Ensure frontend is not already running." -ForegroundColor Yellow
} else {
    Write-Host "Launching Frontend (Vite)..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
}

Write-Host "PromptGuard AI Startup Commands Issued!" -ForegroundColor Green
Write-Host "Backend API: http://127.0.0.1:8080"
Write-Host "Frontend UI: http://localhost:3000"
Write-Host "To stop the services, simply close the two newly opened PowerShell windows."
