import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      {user?.is_admin ? (
        <div className="admin-panel">
          <div className="admin-card">
            <h3>Car Management</h3>
            <p>Add, update, or remove cars from the system</p>
            <Link to="/admin/cars" className="admin-button">
              Manage Cars
            </Link>
          </div>
          
          <div className="admin-card">
            <h3>Rental Management</h3>
            <p>View and manage all customer rentals</p>
            <Link to="/admin/rentals" className="admin-button">
              Manage Rentals
            </Link>
          </div>
          
          <div className="admin-card">
            <h3>User Management</h3>
            <p>View user accounts and information</p>
            <Link to="/admin/users" className="admin-button">
              Manage Users
            </Link>
          </div>
        </div>
      ) : (
        <div className="unauthorized">
          <p>You do not have administrative privileges to access this page.</p>
          <Link to="/" className="back-button">
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;