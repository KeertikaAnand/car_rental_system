// api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create an axios instance with auth header handling
const authAxios = axios.create({
    baseURL: API_URL,
});

// Add request interceptor to attach the token
authAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const api = {
    // Get all cars
    getCars: async () => {
        try {
            const response = await authAxios.get('/cars/');
            return response.data;
        } catch (error) {
            console.error('Error fetching cars:', error);
            throw error;
        }
    },

    // Get a specific car
    getCar: async (carId) => {
        try {
            const response = await authAxios.get(`/cars/${carId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching car with ID ${carId}:`, error);
            throw error;
        }
    },

    // Add a new car
    addCar: async (carData) => {
        try {
            const response = await authAxios.post('/cars/', carData);
            return response.data;
        } catch (error) {
            console.error('Error adding car:', error);
            throw error;
        }
    },

    // Rent a car
    rentCar: async (carId, rentalData) => {
        try {
            const response = await authAxios.post(`/cars/${carId}/rent`, rentalData);
            return response.data;
        } catch (error) {
            console.error(`Error renting car with ID ${carId}:`, error);
            throw error;
        }
    },

    // Cancel a rental
    cancelRental: async (rentalId) => {
        try {
            console.log(`Sending cancellation request for rental #${rentalId}`);
            const response = await authAxios.post(`/cars/rentals/${rentalId}/cancel`);
            console.log('Cancellation response:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Error canceling rental with ID ${rentalId}:`, error);
            throw error;
        }
    },

    // Login
    login: async (username, password) => {
        try {
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);

            const response = await axios.post(`${API_URL}/auth/token`, params);
            if (response.data && response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // Get current user
    getCurrentUser: async () => {
        try {
            const response = await authAxios.get('/auth/users/me');
            return response.data;
        } catch (error) {
            console.error('Error fetching current user:', error);
            throw error;
        }
    },

    // Get all users
    getUsers: async (skip = 0, limit = 100) => {
        try {
            const response = await authAxios.get(`/auth/users?skip=${skip}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },
};

export default api;