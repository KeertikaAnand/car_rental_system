# Check if the OpenAPI Generator CLI is installed
try {
    npm list -g @openapitools/openapi-generator-cli | Out-Null
} catch {
    Write-Host "OpenAPI Generator CLI is not installed. Installing..."
    npm install -g @openapitools/openapi-generator-cli
}

# Make sure the backend is running before generating the SDK
Write-Host "Checking if backend is running..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/openapi.json" -UseBasicParsing -ErrorAction Stop
} catch {
    Write-Host "Backend is not running. Please start the backend first."
    exit 1
}

# Create output directory if it doesn't exist
if (-not (Test-Path -Path "car_rental_sdk")) {
    New-Item -ItemType Directory -Path "car_rental_sdk" | Out-Null
}

# Generate SDK
Write-Host "Generating Python SDK..."
openapi-generator-cli generate `
    -i http://localhost:8000/openapi.json `
    -g python `
    -o car_rental_sdk `
    --additional-properties=packageName=car_rental_sdk

Write-Host "SDK generated successfully in car_rental_sdk directory"