import axios from 'axios';

const API_URL = 'http://localhost:8080/api/mentors';

// Mentor API functions
export const getMentors = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getMentees = async () => {
    const response = await axios.get(`${API_URL}/mentees`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const createMentor = async (mentorData) => {
    const response = await axios.post(API_URL, mentorData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const updateMentor = async (id, mentorData) => {
    const response = await axios.put(`${API_URL}/${id}`, mentorData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const deleteMentor = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};