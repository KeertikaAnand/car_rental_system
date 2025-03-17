# Car Rental System Run Script
Write-Host "Starting Car Rental System..." -ForegroundColor Green

# Check if virtual environment exists
if (-not (Test-Path -Path "venv")) {
    Write-Host "Virtual environment not found. Please run setup.ps1 first." -ForegroundColor Red
    exit 1
}

# Store job IDs for cleanup
$backendJob = $null
$frontendJob = $null

# Function to clean up on exit
function Cleanup {
    Write-Host "Shutting down services..." -ForegroundColor Yellow
    if ($backendJob) {
        Stop-Job -Job $backendJob
        Remove-Job -Job $backendJob
    }
    if ($frontendJob) {
        Stop-Job -Job $frontendJob
        Remove-Job -Job $frontendJob
    }
}

# Register cleanup on script exit
$PSDefaultParameterValues['*:ErrorAction'] = 'Stop'
trap { Cleanup; exit 1 }

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
. .\venv\Scripts\Activate.ps1

# Start the backend
Write-Host "Starting FastAPI backend..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location -Path "$using:PWD\backend"
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}

Write-Host "Backend started on http://localhost:8000" -ForegroundColor Green
Write-Host "API documentation available at http://localhost:8000/docs" -ForegroundColor Green

# Wait a bit for the backend to initialize
Start-Sleep -Seconds 3

# Start the frontend
Write-Host "Starting React frontend..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location -Path "$using:PWD\frontend"
    npm start
}

Write-Host "Frontend started on http://localhost:3000" -ForegroundColor Green
Write-Host "Car Rental System is now running!" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow

# Keep script running and display output from jobs
try {
    while ($true) {
        Receive-Job -Job $backendJob -Keep
        Receive-Job -Job $frontendJob -Keep
        Start-Sleep -Seconds 2
    }
}
finally {
    Cleanup
}
