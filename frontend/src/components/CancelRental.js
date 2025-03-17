import React, { useState } from 'react';
import api from '../services/api'; // Make sure this path is correct

const CancelRental = () => {
  const [rentalId, setRentalId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async (e) => {
    e.preventDefault();
    if (!rentalId) {
      setError('Please enter a rental ID');
      return;
    }
    
    setMessage('');
    setError('');
    setIsLoading(true);
    
    try {
      console.log(`Component: Attempting to cancel rental #${rentalId}`);
      await api.cancelRental(rentalId);
      setMessage(`Rental #${rentalId} successfully canceled`);
    } catch (err) {
      console.error('Component: Error canceling rental:', err);
      
      if (err.response) {
        console.log('Error response status:', err.response.status);
        console.log('Error response data:', err.response.data);
        
        // Handle different error types properly
        if (err.response.status === 404) {
          setError(`Rental #${rentalId} not found. Please check the rental ID.`);
        } else if (err.response.status === 403) {
          setError(`Not authorized to cancel rental #${rentalId}. This rental belongs to another user.`);
        } else if (err.response.status === 400) {
          setError(err.response.data.detail || 'Bad request');
        } else {
          setError(`Error: ${err.response.data.detail || 'Unknown server error'}`);
        }
      } else if (err.request) {
        console.log('No response received:', err.request);
        setError('Server not responding. Please check if the backend server is running.');
      } else {
        console.log('Error message:', err.message);
        setError(`Network error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // For testing the API connection
  const testApiConnection = () => {
    api.getCars()
      .then(data => console.log('API test successful:', data))
      .catch(err => console.error('API test failed:', err));
  };

  return (
    <div className="cancel-rental-container">
      <h2>Cancel a Rental</h2>
      <form onSubmit={handleCancel}>
        <div className="form-group">
          <label htmlFor="rentalId">Rental ID:</label>
          <input
            type="number"
            id="rentalId"
            value={rentalId}
            onChange={(e) => setRentalId(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Cancel Rental'}
        </button>
        <button type="button" onClick={testApiConnection} style={{ marginLeft: '10px' }}>
          Test API
        </button>
      </form>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default CancelRental;