import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AdminRentalViewer.css';

const AdminRentalViewer = () => {
    const { user } = useAuth();
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                let url = 'http://localhost:8000/cars/admin/rentals';
                if (filter !== 'all') {
                    url += `?status=${filter}`;
                }

                const response = await axios.get(url);
                setRentals(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch rentals');
                setLoading(false);
                console.error('Error fetching rentals:', err);
            }
        };

        if (user?.is_admin) {
            fetchRentals();
        } else {
            setLoading(false);
        }
    }, [filter, user]);

    const handleCancelRental = async (rentalId) => {
        if (!window.confirm('Are you sure you want to cancel this rental?')) {
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8000/cars/rentals/${rentalId}/cancel`);

            setRentals(rentals.map(rental =>
                rental.id === rentalId ? { ...rental, status: 'canceled' } : rental
            ));

            alert('Rental canceled successfully');
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to cancel rental');
            console.error('Error canceling rental:', err);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
        return <div className="loading">Loading rental information...</div>;
    }

    return (
        <div className="admin-rental-viewer">
            <h2>Rental Management</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="filter-controls">
                <label htmlFor="status-filter">Filter by Status:</label>
                <select
                    id="status-filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Rentals</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                </select>
            </div>

            {rentals.length === 0 ? (
                <p>No rentals found with the selected filter.</p>
            ) : (
                <div className="rental-table-container">
                    <table className="rental-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User ID</th>
                                <th>Car</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentals.map(rental => (
                                <tr key={rental.id} className={`status-${rental.status}`}>
                                    <td>{rental.id}</td>
                                    <td>{rental.user_id}</td>
                                    <td>{rental.car ? `${rental.car.make} ${rental.car.model} (${rental.car.year})` : "Car information unavailable"}</td>
                                    <td>{formatDate(rental.start_date)}</td>
                                    <td>{formatDate(rental.end_date)}</td>
                                    <td className="rental-status">{rental.status}</td>
                                    <td>{formatDate(rental.created_at)}</td>
                                    <td>
                                        {rental.status === 'active' && (
                                            <button
                                                className="cancel-button"
                                                onClick={() => handleCancelRental(rental.id)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminRentalViewer;