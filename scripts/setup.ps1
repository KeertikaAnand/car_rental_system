# Car Rental System Setup Script
Write-Host "Setting up Car Rental System..." -ForegroundColor Green

# Create virtual environment
Write-Host "Creating Python virtual environment..." -ForegroundColor Cyan
python -m venv venv

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
. .\venv\Scripts\Activate.ps1

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
pip install -r backend\requirements.txt

# Initialize the database
Write-Host "Initializing the database..." -ForegroundColor Cyan
cd backend
python -c "from app.database import engine; from app import models; models.Base.metadata.create_all(bind=engine)"

# Load sample data
Write-Host "Loading sample data..." -ForegroundColor Cyan
sqlite3 car_rental.db ".read ..\database\seed_data.sql"

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
cd ..\frontend
npm install

Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "To run the application, use .\scripts\run.ps1" -ForegroundColor Yellow