import React, { useState } from 'react';
import axios from 'axios';
import RentForm from './RentForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CarItem.css'

const CarItem = ({ car, onRentalComplete }) => {
  const [showRentForm, setShowRentForm] = useState(false);
  const [isRenting, setIsRenting] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleRentClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowRentForm(true);
  };

  const handleRentSubmit = async (rentalData) => {
    setIsRenting(true);
    setError('');
    
    try {
      await axios.post(`http://localhost:8000/cars/${car.id}/rent`, rentalData);
      setIsRenting(false);
      setShowRentForm(false);
      
      // Notify parent component to refresh the car list
      if (onRentalComplete) {
        onRentalComplete();
      }
    } catch (err) {
      setIsRenting(false);
      setError(err.response?.data?.detail || 'Failed to rent car. Please try again.');
    }
  };

  const handleRentCancel = () => {
    setShowRentForm(false);
    setError('');
  };

  return (
    <div className="car-item">
      <div className="car-image">
        <img 
          src={car.image_url || `https://via.placeholder.com/150?text=${car.make}+${car.model}`} 
          alt={`${car.make} ${car.model}`} 
        />
      </div>
      
      <div className="car-details">
        <h3>{car.make} {car.model}</h3>
        <p className="car-year">Year: {car.year}</p>
        <p className="car-price">Rate: ${car.daily_rate}/day</p>
        <p className="car-availability">
          {car.is_available ? 'Available' : 'Currently Rented'}
        </p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showRentForm ? (
        <RentForm 
          onSubmit={handleRentSubmit} 
          onCancel={handleRentCancel}
          carId={car.id}
        />
      ) : (
        <div className="car-actions">
          <button 
            className="rent-button" 
            onClick={handleRentClick}
            disabled={!car.is_available || isRenting}
          >
            {isRenting ? 'Processing...' : car.is_available ? 'Rent Now' : 'Unavailable'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CarItem;