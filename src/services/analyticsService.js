import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin/analytics';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Data:', error.response.data);
      console.error('Error Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export const analyticsService = {
  getMentorAnalytics: async () => {
    try {
      const response = await apiClient.get('/mentors');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudentAnalytics: async () => {
    try {
      const response = await apiClient.get('/students');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDepartmentAnalytics: async () => {
    try {
      const response = await apiClient.get('/departments');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default analyticsService; 