import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // FormData format required by OAuth2PasswordRequestForm
      const params = new URLSearchParams();
      params.append('username', formData.username);
      params.append('password', formData.password);
      
      const response = await axios.post('http://localhost:8000/auth/token', params);
      
      // Store the token in localStorage
      localStorage.setItem('token', response.data.access_token);
      
      // Call the callback function to update parent component state
      onLoginSuccess(response.data.access_token);
      
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.detail || '');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;