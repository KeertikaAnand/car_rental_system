// AdminUserManagement.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './AdminUserManagement.css'; // Reusing same CSS for consistent styling

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser?.is_admin) return;

        const fetchUsers = async () => {
            try {
                setLoading(true);
                const fetchedUsers = await api.getUsers();
                setUsers(fetchedUsers);
                setError(null);
                console.log("Users fetched:", fetchedUsers); // Console log for debugging
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to load users. Please try again later.');
                console.log("Error state:", error); // Console log for debugging
            } finally {
                setLoading(false);
                console.log("Current user:", currentUser); // Console log for debugging
            }
        };

        fetchUsers();
    }, [currentUser]);

    if (!currentUser?.is_admin) {
        return (
            <div className="unauthorized">
                <h2>Access Denied</h2>
                <p>You do not have permission to view this page.</p>
                <Link to="/" className="back-button">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="admin-management">
            <h2>User Management</h2>

            

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading users...</div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Admin</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.is_admin ? 'Yes' : 'No'}</td>
                                        <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="no-data">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUserManagement;