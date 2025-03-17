import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AdminRentalViewer from './AdminRentalViewer';
import './AdminRentalViewer.css';

const AdminRentalManagement = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    checkAuthAndFetchData();
  }, [isAuthenticated, isAdmin, statusFilter]);

  const checkAuthAndFetchData = async () => {
    try {
      // Basic auth check before making API calls
      if (!isAuthenticated) {
        setError("You must be logged in to access this page.");
        setLoading(false);
        return;
      }
      
      if (!isAdmin) {
        setError("You must have administrator privileges to access this page.");
        setLoading(false);
        return;
      }
      
      await fetchRentals();
    } catch (err) {
      console.error('Error in admin auth check:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchRentals = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin rentals with status filter:', statusFilter);
      
      const data = await api.getAdminRentals(statusFilter);
      console.log('Rentals data received:', data.length, 'records');
      setRentals(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching admin rentals:', err);
      setError(err.message || 'Failed to fetch rentals. Please check your connection and permissions.');
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Function to manually refresh data
  const refreshData = () => {
    checkAuthAndFetchData();
  };

  // Display authentication error
  if (error) {
    return (
      <div className="admin-container error-container">
        <h2>Admin Rental Management</h2>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={refreshData} className="refresh-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Display loading indicator
  if (loading) {
    return (
      <div className="admin-container">
        <h2>Admin Rental Management</h2>
        <div className="loading-spinner">Loading rental data...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Rental Management</h2>
        <div className="admin-controls">
          <div className="filter-control">
            <label htmlFor="status-filter">Filter by Status: </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={handleFilterChange}
              className="status-select"
            >
              <option value="all">All Rentals</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button onClick={refreshData} className="refresh-button">
            Refresh Data
          </button>
        </div>
      </div>

      {rentals.length === 0 ? (
        <div className="no-rentals">
          <p>No rental records found with the selected filter.</p>
        </div>
      ) : (
        <AdminRentalViewer rentals={rentals} onDataChange={refreshData} />
      )}
    </div>
  );
};

export default AdminRentalManagement;