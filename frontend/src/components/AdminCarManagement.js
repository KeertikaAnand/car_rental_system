import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AdminCarManagement.css';

const AdminCarManagement = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form state
  const initialFormState = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    daily_rate: 0,
    description: '',
    image_url: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [formMessage, setFormMessage] = useState(null);

  // Fetch cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cars/');
        setCars(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch cars');
        setLoading(false);
        console.error('Error fetching cars:', err);
      }
    };

    fetchCars();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'year' || name === 'daily_rate' ? Number(value) : value
    });
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedCar(null);
    setIsAdding(false);
    setFormMessage(null);
  };

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      color: car.color,
      daily_rate: car.daily_rate,
      description: car.description || '',
      image_url: car.image_url || ''
    });
    setIsAdding(false);
  };

  const handleNewCar = () => {
    setSelectedCar(null);
    setFormData(initialFormState);
    setIsAdding(true);
    setFormMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage(null);
    
    try {
      if (isAdding) {
        // Create new car
        const response = await axios.post('http://localhost:8000/cars/', formData);
        setCars([...cars, response.data]);
        setFormMessage({ type: 'success', text: 'Car added successfully!' });
        resetForm();
      } else if (selectedCar) {
        // Update existing car
        const response = await axios.put(`http://localhost:8000/cars/${selectedCar.id}`, formData);
        
        const updatedCars = cars.map(car => 
          car.id === selectedCar.id ? response.data : car
        );
        
        setCars(updatedCars);
        setFormMessage({ type: 'success', text: 'Car updated successfully!' });
      }
    } catch (err) {
      setFormMessage({ 
        type: 'error', 
        text: err.response?.data?.detail || 'An error occurred while saving the car' 
      });
      console.error('Error saving car:', err);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:8000/cars/${carId}`);
      setCars(cars.filter(car => car.id !== carId));
      if (selectedCar && selectedCar.id === carId) {
        resetForm();
      }
      setFormMessage({ type: 'success', text: 'Car deleted successfully!' });
    } catch (err) {
      setFormMessage({ 
        type: 'error', 
        text: err.response?.data?.detail || 'Failed to delete car' 
      });
      console.error('Error deleting car:', err);
    }
  };

  if (!user?.is_admin) {
    return (
      <div className="unauthorized">
        <h2>Access Denied</h2>
        <p>You do not have administrative privileges to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading car inventory...</div>;
  }

  return (
    <div className="admin-car-management">
      <h2>Car Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="admin-car-container">
        <div className="car-list">
          <div className="car-list-header">
            <h3>Available Cars</h3>
            <button className="add-button" onClick={handleNewCar}>+ Add New Car</button>
          </div>
          
          {cars.length === 0 ? (
            <p>No cars available in the system.</p>
          ) : (
            <table className="car-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Year</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <tr 
                    key={car.id} 
                    className={selectedCar?.id === car.id ? 'selected' : ''}
                    onClick={() => handleSelectCar(car)}
                  >
                    <td>{car.id}</td>
                    <td>{car.make}</td>
                    <td>{car.model}</td>
                    <td>{car.year}</td>
                    <td>{car.is_available ? 'Yes' : 'No'}</td>
                    <td>
                      <button 
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(car.id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="car-form-container">
          <h3>{isAdding ? 'Add New Car' : selectedCar ? 'Edit Car' : 'Select a car'}</h3>
          
          {formMessage && (
            <div className={`form-message ${formMessage.type}`}>
              {formMessage.text}
            </div>
          )}
          
          {(isAdding || selectedCar) && (
            <form onSubmit={handleSubmit} className="car-form">
              <div className="form-group">
                <label htmlFor="make">Make</label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="model">Model</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="daily_rate">Daily Rate ($)</label>
                <input
                  type="number"
                  id="daily_rate"
                  name="daily_rate"
                  min="0"
                  step="0.01"
                  value={formData.daily_rate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="image_url">Image URL</label>
                <input
                  type="text"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  {isAdding ? 'Add Car' : 'Update Car'}
                </button>
                <button type="button" className="cancel-button" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCarManagement;