#!/bin/bash

# Check if the OpenAPI Generator CLI is installed
if ! command -v openapi-generator-cli &> /dev/null; then
    echo "OpenAPI Generator CLI is not installed. Installing..."
    npm install -g @openapitools/openapi-generator-cli
fi

# Make sure the backend is running before generating the SDK
echo "Checking if backend is running..."
if ! curl -s http://localhost:8000/openapi.json &> /dev/null; then
    echo "Backend is not running. Please start the backend first."
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p car_rental_sdk

# Generate SDK
echo "Generating Python SDK..."
openapi-generator-cli generate \
    -i http://localhost:8000/openapi.json \
    -g python \
    -o car_rental_sdk \
    --additional-properties=packageName=car_rental_sdk

echo "SDK generated successfully in car_rental_sdk directory"