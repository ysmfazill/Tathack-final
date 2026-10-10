Write-Host "Running PromptGuard AI Health Check..." -ForegroundColor Cyan

$backendHealthy = $false
$frontendHealthy = $false

# 1. Backend Health
try {
    $res = Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/health" -Method Get -ErrorAction Stop
    if ($res.status -eq "ok") {
        Write-Host "[OK] Backend HTTP available and healthy." -ForegroundColor Green
        $backendHealthy = $true
    } else {
        Write-Host "[WARN] Backend returned unexpected health status." -ForegroundColor Yellow
    }
} catch {
    Write-Host "[FAIL] Backend is unreachable at http://127.0.0.1:8080." -ForegroundColor Red
}

# 2. Frontend Health
try {
    $res = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -UseBasicParsing -ErrorAction Stop
    Write-Host "[OK] Frontend HTTP available." -ForegroundColor Green
    $frontendHealthy = $true
} catch {
    Write-Host "[FAIL] Frontend is unreachable at http://localhost:3000." -ForegroundColor Red
}

# 3. Settings Endpoint
try {
    $res = Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/settings/security" -Method Get -ErrorAction Stop
    Write-Host "[OK] Security Settings endpoint available." -ForegroundColor Green
} catch {
    Write-Host "[WARN] Settings endpoint failed or is unreachable." -ForegroundColor Yellow
}

# 4. Ollama Provider Status
try {
    $res = Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/providers/status" -Method Get -ErrorAction Stop
    if ($res.status -eq "online") {
        Write-Host "[OK] Ollama is online. Model: $($res.model)" -ForegroundColor Green
    } else {
        Write-Host "[INFO] Ollama is offline or unavailable. Deterministic authorization will still function normally." -ForegroundColor Yellow
    }
} catch {
    Write-Host "[INFO] Could not check Ollama status (backend may be down)." -ForegroundColor Yellow
}

Write-Host ""
if ($backendHealthy -and $frontendHealthy) {
    Write-Host "Overall Status: SYSTEM READY FOR DEMONSTRATION" -ForegroundColor Green
} else {
    Write-Host "Overall Status: OFFLINE OR DEGRADED (Check logs)" -ForegroundColor Red
}
