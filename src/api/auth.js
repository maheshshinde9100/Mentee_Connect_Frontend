import axios from 'axios';

const API_URL = 'http://localhost:8080/api/login'; // Update this with your backend API base URL

// Login
export const login = async (loginData) => {
    try {
        const response = await axios.post(API_URL, loginData);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};
