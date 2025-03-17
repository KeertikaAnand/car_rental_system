from datetime import datetime, timedelta
from app.main import client

def test_rent_overlapping_dates():
    # First create a car
    response = client.post(
        "/cars/",
        json={"make": "Mercedes", "model": "C-Class", "year": 2021, "daily_rate": 75.0},
    )
    car_id = response.json()["id"]
    
    # Rent it for a specific period
    start_date = datetime.utcnow() + timedelta(days=5)
    end_date = start_date + timedelta(days=3)
    
    response = client.post(
        f"/cars/{car_id}/rent",
        json={
            "car_id": car_id,
            "user_name": "User 1",
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
        },
    )
    assert response.status_code == 200
    
    # Try to rent it again for overlapping dates
    overlap_start = start_date + timedelta(days=1)
    overlap_end = end_date + timedelta(days=1)
    
    response = client.post(
        f"/cars/{car_id}/rent",
        json={
            "car_id": car_id,
            "user_name": "User 2",
            "start_date": overlap_start.isoformat(),
            "end_date": overlap_end.isoformat(),
        },
    )
    assert response.status_code == 400  # Should fail due to overlap

def test_cancel_rental():
    # First create a car
    response = client.post(
        "/cars/",
        json={"make": "Volvo", "model": "XC60", "year": 2021, "daily_rate": 65.0},
    )
    car_id = response.json()["id"]
    
    # Rent it
    start_date = datetime.utcnow() + timedelta(days=10)
    end_date = start_date + timedelta(days=3)
    
    response = client.post(
        f"/cars/{car_id}/rent",
        json={
            "car_id": car_id,
            "user_name": "Test User",
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
        },
    )
    rental_id = response.json()["id"]
    
    # Cancel the rental
    response = client.delete(f"/cars/rentals/{rental_id}")
    assert response.status_code == 204
    
    # Now we should be able to rent it again for the same period
    response = client.post(
        f"/cars/{car_id}/rent",
        json={
            "car_id": car_id,
            "user_name": "Another User",
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
        },
    )
    assert response.status_code == 200