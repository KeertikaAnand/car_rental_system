import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import CarList from './components/CarList';
import CancelRental from './components/CancelRental';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './components/AdminDashboard';
import AdminCarManagement from './components/AdminCarManagement';
import AdminRentalViewer from './components/AdminRentalViewer';
import AdminUserManagement from './components/AdminUserManagement';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

function AppContent() {
    const { isAuthenticated, user, logout } = useAuth();
    const [backgroundImage, setBackgroundImage] = useState(`url('/images/bg1.jpg')`);

    useEffect(() => {
        const images = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg'];
        let currentIndex = 0;

        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            setBackgroundImage(`url('/images/${images[currentIndex]}')`);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="App" style={{ backgroundImage, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', minHeight: '100vh', transition: 'background-image 1s ease-in-out' }}>
            <header className="App-header">
                <h1>COIMBATORE DRIVES</h1>
                <nav>
                    <ul>
                        {!user?.is_admin && (
                            <>
                                <li>
                                    <Link to="/" className="nav-link">View Cars</Link>
                                </li>
                                {isAuthenticated && (
                                    <>
                                        <li>
                                            <Link to="/profile" className="nav-link">My Profile</Link>
                                        </li>
                                        <li>
                                            <Link to="/cancel-rental" className="nav-link">Cancel Rental</Link>
                                        </li>
                                    </>
                                )}
                            </>
                        )}

                        {isAuthenticated && user?.is_admin && (
                            <li>
                                <Link to="/admin" className="admin-link">Admin Dashboard</Link>
                            </li>
                        )}
                        {isAuthenticated ? (
                            <li>
                                <button onClick={logout} className="logout-btn">Logout</button>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="nav-link">Login</Link>
                                </li>
                                <li>
                                    <Link to="/register" className="nav-link">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            <main className="App-main">
                <Routes>
                    <Route path="/" element={<CarList />} />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <UserProfile />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/cancel-rental"
                        element={
                            <PrivateRoute>
                                <CancelRental />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
                    />
                    <Route
                        path="/register"
                        element={isAuthenticated ? <Navigate to="/" /> : <Register />}
                    />
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/cars"
                        element={
                            <AdminRoute>
                                <AdminCarManagement />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/rentals"
                        element={
                            <AdminRoute>
                                <AdminRentalViewer />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <AdminRoute>
                                <AdminUserManagement />
                            </AdminRoute>
                        }
                    />
                </Routes>
            </main>

            <footer className="App-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>About Us</h3>
                        <p>Coimbatore Drives provides the best car rental services in the city. Book your ride with ease and comfort.</p>
                    </div>
                    <div className="footer-section">
                        <h3>Contact</h3>
                        <p>Email: support@coimbatoredrives.com</p>
                        <p>Phone: +91 98765 43210</p>
                    </div>
                    <div className="footer-section">
                        <h3>Follow Us</h3>
                        <p>Stay connected with us on social media.</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; {new Date().getFullYear()} Coimbatore Drives | All Rights Reserved
                    {isAuthenticated && <span> | Logged in as: {user?.username}</span>}
                    {isAuthenticated && user?.is_admin && <span> (Admin)</span>}
                </div>
            </footer>
        </div>
    );
}

export default App;
