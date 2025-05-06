import axios from 'axios';

const API_BASE = 'http://localhost:8080/api'; // Adjust if needed

export const getMentors = async () => {
    const response = await axios.get(`${API_BASE}/mentors`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const getMyMentees = async () => {
    const response = await axios.get(`${API_BASE}/mentors/my-mentees`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};