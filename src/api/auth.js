import axios from 'axios';

const API_URL = 'http://localhost:8080/api/login';

export const login = async (email, password) => {
    try {
        const response = await axios.post(API_URL, { email, password });

        // Transform backend response to frontend expected format
        return {
            success: response.data.status,
            user: {
                email: email,
                role: response.data.message.includes('Admin') ? 'ADMIN' :
                    response.data.message.includes('Mentor') ? 'MENTOR' : 'STUDENT'
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};