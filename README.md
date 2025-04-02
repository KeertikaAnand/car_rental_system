# Car Rental System

A full-stack application for managing car rentals, featuring a FastAPI backend, ReactJS frontend, and Python SDK.

## Features

- Browse available cars by make, model, and price.
- Rent cars for specific date ranges.
- Manage and cancel bookings.
- Admin panel for fleet management.
- User authentication and profiles.
- Rating and review system for cars.
- Interactive availability calendar.

## Tech Stack

- Backend: FastAPI with SQLite database
- Frontend: React.js with Axios for API calls
- SDK: Python SDK generated using OpenAPI Generator CLI
- Automation: Shell/PowerShell scripts for setup and execution

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- OpenAPI Generator CLI

file

## Setup Instructions

### Using Automation Scripts

1. Clone the repository:

    git clone https://github.com/yourusername/car-rental-system.git
    cd car-rental-system

2. Run the setup script:

    # On Linux/macOS
    ./scripts/setup.sh

    # On Windows
    .\scripts\setup.ps1

3. Run the application:

    # On Linux/macOS
    ./scripts/run.sh

    # On Windows
    .\scripts\run.ps1

### Manual Setup

#### Backend Setup

1. Create and activate a virtual environment:

    python -m venv venv
    source venv/bin/activate # On Windows: venv\Scripts\activate

2. Install dependencies:

    cd backend
    pip install -r requirements.txt

3. Initialize the database:

    python -m app.init_db

4. Start the FastAPI server:

    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

5. Access the API docs at http://localhost:8000/docs

#### Frontend Setup

1. Install dependencies:

    cd frontend
    npm install

2. Start the React development server:

    npm start

3. Access the frontend at http://localhost:3000

#### Generating SDK

1. Ensure you have OpenAPI Generator CLI installed:

    npm install -g @openapitools/openapi-generator-cli

2. Generate the SDK (with backend server running):

    openapi-generator-cli generate -i http://localhost:8000/openapi.json -g python -o car_rental_sdk

3. Install the generated SDK:

    cd car_rental_sdk
    pip install -e .

## API Documentation

The full API documentation is available at http://localhost:8000/docs when the backend is running.

### Main Endpoints

- GET /cars/: List all available cars
- GET /cars/{car_id}: Get details of a specific car
- POST /cars/: Add a new car (admin only)
- POST /cars/{car_id}/rent: Rent a car
- DELETE /rentals/{rental_id}: Cancel a rental

## Using the SDK

```python
from car_rental_sdk.api.cars_api import CarsApi
from car_rental_sdk import ApiClient

# Initialize the API client
client = ApiClient()
cars_api = CarsApi(client)

# Get all available cars
cars = cars_api.get_cars()
print(cars)

# Rent a car
rental = cars_api.rent_car(
    car_id=1,
    rental_request={
        "user_name": "John Doe",
        "start_date": "2025-03-20T00:00:00",
        "end_date": "2025-03-25T00:00:00"
    }
)
print(f"Rental created with ID: {rental.id}")
