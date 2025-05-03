import axios from 'axios';

const API_URL = 'http://localhost:8080/api/mentors'; // Update this with your backend API base URL

// Get all mentors
export const fetchMentors = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching mentors:', error);
        throw error;
    }
};

// Get mentor by ID
export const fetchMentorById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching mentor:', error);
        throw error;
    }
};

// Create a new mentor
export const createMentor = async (mentorData) => {
    try {
        const response = await axios.post(API_URL, mentorData);
        return response.data;
    } catch (error) {
        console.error('Error creating mentor:', error);
        throw error;
    }
};

// Update mentor
export const updateMentor = async (id, mentorData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, mentorData);
        return response.data;
    } catch (error) {
        console.error('Error updating mentor:', error);
        throw error;
    }
};

// Delete mentor
export const deleteMentor = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting mentor:', error);
        throw error;
    }
};
