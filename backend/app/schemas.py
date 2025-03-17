# schemas.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: Optional[bool]
    is_admin: Optional[bool]

    class Config:
        orm_mode = True

# Car schemas
class CarBase(BaseModel):
    make: str
    model: str
    year: int
    color: str
    daily_rate: float
    description: Optional[str] = None
    image_url: Optional[str] = None

class CarCreate(CarBase):
    pass

class Car(CarBase):
    id: int
    is_available: bool

    class Config:
        orm_mode = True

# Rental schemas
class RentalBase(BaseModel):
    start_date: datetime
    end_date: datetime

class RentalCreate(RentalBase):
    pass

class Rental(RentalBase):
    id: int
    car_id: Optional[int]
    user_id: Optional[int]
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

# Detailed Rental schema with car information
class RentalDetail(Rental):
    car: Optional[Car]

    class Config:
        orm_mode = True