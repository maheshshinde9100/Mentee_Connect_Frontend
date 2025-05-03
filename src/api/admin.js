import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin'; // Update this with your backend API base URL

// Get Admin data
export const fetchAdmin = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching admin:', error);
        throw error;
    }
};

// Add a new Admin
export const addAdmin = async (adminData) => {
    try {
        const response = await axios.post(API_URL, adminData);
        return response.data;
    } catch (error) {
        console.error('Error adding admin:', error);
        throw error;
    }
};

// Update Admin
export const updateAdmin = async (id, adminData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, adminData);
        return response.data;
    } catch (error) {
        console.error('Error updating admin:', error);
        throw error;
    }
};

// Assign Mentor
export const assignMentor = async (mentorData) => {
    try {
        const response = await axios.post(`${API_URL}/assign-mentor`, mentorData);
        return response.data;
    } catch (error) {
        console.error('Error assigning mentor:', error);
        throw error;
    }
};

// Get all students
export const fetchAllStudents = async () => {
    try {
        const response = await axios.get(`${API_URL}/students`);
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};
