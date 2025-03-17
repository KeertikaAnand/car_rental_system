import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RentForm = ({ onSubmit, onCancel, carId }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    } else if (formData.end_date <= formData.start_date) {
      newErrors.end_date = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login page
      navigate('/login');
      return;
    }
    
    if (validateForm()) {
      // Format dates for API
      const rentalData = {
        ...formData,
        car_id: carId,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString()
      };
      
      onSubmit(rentalData);
    }
  };

  return (
    <form className="rent-form" onSubmit={handleSubmit}>
      {isAuthenticated && (
        <div className="form-info">
          <p>Renting as: {user?.username}</p>
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="start_date">Start Date:</label>
        <input
          type="datetime-local"
          id="start_date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
        {errors.start_date && <span className="error">{errors.start_date}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="end_date">End Date:</label>
        <input
          type="datetime-local"
          id="end_date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          required
        />
        {errors.end_date && <span className="error">{errors.end_date}</span>}
      </div>
      
      <div className="form-actions">
        <button type="submit" className="submit-button">
          {isAuthenticated ? 'Rent Car' : 'Login to Rent'}
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default RentForm;