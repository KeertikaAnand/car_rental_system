#!/usr/bin/env python3

import sys
import os
from datetime import datetime, timedelta

# Add the SDK to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'car_rental_sdk'))

try:
    from car_rental_sdk.api.cars_api import CarsApi
    from car_rental_sdk.api_client import ApiClient
    from car_rental_sdk.configuration import Configuration
    from car_rental_sdk.model.car_create import CarCreate
    from car_rental_sdk.model.rental_create import RentalCreate
except ImportError:
    print("ERROR: SDK modules not found. Please generate the SDK first.")
    sys.exit(1)

def test_sdk():
    print("Testing Car Rental SDK...")
    
    # Create configuration and client
    config = Configuration(host="http://localhost:8000")
    client = ApiClient(config)
    cars_api = CarsApi(client)
    
    try:
        # Test 1: Get all cars
        print("\n1. Getting all cars...")
        cars = cars_api.get_cars()
        print(f"   Found {len(cars)} cars")
        
        if len(cars) > 0:
            # Test 2: Get specific car
            car_id = cars[0].id
            print(f"\n2. Getting car with ID {car_id}...")
            car = cars_api.get_car(car_id)
            print(f"   Found car: {car.make} {car.model} ({car.year})")
            
            # Test 3: Create a new car
            print("\n3. Creating a new car...")
            new_car = CarCreate(
                make="Tesla",
                model="Model 3",
                year=2023,
                daily_rate=75.0
            )
            created_car = cars_api.create_car(new_car)
            print(f"   Created car with ID: {created_car.id}")
            
            # Test 4: Rent a car
            print("\n4. Renting a car...")
            # Set rental dates (from tomorrow to 3 days later)
            start_date = datetime.utcnow() + timedelta(days=1)
            end_date = start_date + timedelta(days=3)
            
            rental_data = RentalCreate(
                car_id=created_car.id,
                user_name="SDK Tester",
                start_date=start_date,
                end_date=end_date
            )
            
            try:
                rental = cars_api.rent_car(created_car.id, rental_data)
                print(f"   Created rental with ID: {rental.id}")
                
                # Test 5: Cancel a rental
                print("\n5. Canceling the rental...")
                cars_api.delete_
# Test 5: Cancel a rental
                print("\n5. Canceling the rental...")
                cars_api.delete_rental(rental.id)
                print("   Rental successfully canceled")
                
            except Exception as e:
                print(f"   Error renting car: {e}")
        else:
            print("   No cars found in the system to test with")
            
        print("\nSDK test completed successfully!")
        
    except Exception as e:
        print(f"Error during SDK test: {e}")
        return False
        
    return True

if __name__ == "__main__":
    success = test_sdk()
    sys.exit(0 if success else 1)