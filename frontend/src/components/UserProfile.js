import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css'

const UserProfile = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchUserRentals = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('Authentication token not found. Please log in.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:8000/cars/rentals/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setRentals(response.data);
                setLoading(false);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError('Not authenticated. Please log in.');
                } else {
                    setError('Failed to load your rentals');
                }
                setLoading(false);
            }
        };

        fetchUserRentals();
    }, []);

    if (loading) return <div>Loading your profile...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="profile-container">
            <h2>Your Profile</h2>

            <div className="user-info">
                <p>
                    <strong>Username:</strong> {user?.username}
                </p>
                <p>
                    <strong>Email:</strong> {user?.email}
                </p>
            </div>

            <h3>Your Rentals</h3>
            {rentals.length === 0 ? (
                <p>You haven't rented any cars yet.</p>
            ) : (
                <div className="rental-list">
                    {rentals.map((rental) => (
                        <div key={rental.id} className="rental-item">
                            <h4>
                                {rental.car ? `${rental.car.make} ${rental.car.model}` : "Car information unavailable"}
                            </h4>
                            <p>Rental ID: {rental.id}</p>
                            <p>From: {new Date(rental.start_date).toLocaleDateString()}</p>
                            <p>To: {new Date(rental.end_date).toLocaleDateString()}</p>
                            <p>Status: {rental.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserProfile;