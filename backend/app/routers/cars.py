from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import models, schemas, security
from ..database import get_db

router = APIRouter(
    prefix="/cars",
    tags=["cars"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[schemas.Car])
def get_cars(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    cars = db.query(models.Car).offset(skip).limit(limit).all()
    return cars

@router.get("/{car_id}", response_model=schemas.Car)
def get_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@router.post("/{car_id}/rent", response_model=schemas.Rental)
def rent_car(
    car_id: int, 
    rental: schemas.RentalCreate, 
    current_user: models.User = Depends(security.get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if car exists and is available
    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    if not car.is_available:
        raise HTTPException(status_code=400, detail="Car is not available")
    
    # Create rental
    db_rental = models.Rental(
        car_id=car_id,
        user_id=current_user.id,
        start_date=rental.start_date,
        end_date=rental.end_date,
        status="active"
    )
    db.add(db_rental)
    
    # Update car availability
    car.is_available = False
    
    db.commit()
    db.refresh(db_rental)
    return db_rental

@router.get("/rentals/user", response_model=List[schemas.RentalDetail])
def get_user_rentals(
    current_user: models.User = Depends(security.get_current_active_user),
    db: Session = Depends(get_db)
):
    rentals = db.query(models.Rental).filter(models.Rental.user_id == current_user.id).all()
    return rentals

@router.post("/rentals/{rental_id}/cancel", response_model=schemas.Rental)
def cancel_rental(
    rental_id: int,
    current_user: models.User = Depends(security.get_current_active_user),
    db: Session = Depends(get_db)
):
    print(f"Attempting to cancel rental #{rental_id} by user {current_user.username}")
    
    # Get the rental
    rental = db.query(models.Rental).filter(models.Rental.id == rental_id).first()
    if rental is None:
        print(f"Rental #{rental_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Rental #{rental_id} not found"
        )
    
    # Check if the rental belongs to the user
    if rental.user_id != current_user.id and not current_user.is_admin:
        print(f"User {current_user.username} not authorized to cancel rental #{rental_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail=f"Not authorized to cancel rental #{rental_id}. This rental belongs to another user."
        )
    
    # Check if the rental is already canceled
    if rental.status == "canceled":
        print(f"Rental #{rental_id} is already canceled")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Rental #{rental_id} is already canceled"
        )
    
    # Update rental status
    rental.status = "canceled"
    
    # Make car available again
    car = db.query(models.Car).filter(models.Car.id == rental.car_id).first()
    if car:
        car.is_available = True
    
    db.commit()
    db.refresh(rental)
    print(f"Successfully canceled rental #{rental_id}")
    return rental

# Admin endpoints
@router.post("/", response_model=schemas.Car)
def create_car(
    car: schemas.CarCreate,
    current_user: models.User = Depends(security.get_admin_user),
    db: Session = Depends(get_db)
):
    db_car = models.Car(**car.dict(), is_available=True)
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

@router.put("/{car_id}", response_model=schemas.Car)
def update_car(
    car_id: int,
    car_update: schemas.CarCreate,
    current_user: models.User = Depends(security.get_admin_user),
    db: Session = Depends(get_db)
):
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Update car attributes
    for key, value in car_update.dict().items():
        setattr(db_car, key, value)
    
    db.commit()
    db.refresh(db_car)
    return db_car

@router.delete("/{car_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_car(
    car_id: int,
    current_user: models.User = Depends(security.get_admin_user),
    db: Session = Depends(get_db)
):
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Check if car has active rentals
    active_rentals = db.query(models.Rental).filter(
        models.Rental.car_id == car_id,
        models.Rental.status == "active"
    ).first()
    
    if active_rentals:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete car with active rentals"
        )
    
    db.delete(db_car)
    db.commit()
    return None

@router.get("/admin/rentals", response_model=List[schemas.RentalDetail])
def get_all_rentals(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(security.get_admin_user),
    db: Session = Depends(get_db)
):
    query = db.query(models.Rental)
    if status:
        query = query.filter(models.Rental.status == status)
    
    rentals = query.offset(skip).limit(limit).all()
    return rentals