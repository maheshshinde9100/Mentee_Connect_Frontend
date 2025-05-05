import axios from 'axios';

const API_URL = 'http://localhost:8080/api/students';

export const getStudents = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getMyMentor = async () => {
    const response = await axios.get(`${API_URL}/mentor`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const updateStudent = async (id, studentData) => {
    const response = await axios.put(`${API_URL}/${id}`, studentData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};