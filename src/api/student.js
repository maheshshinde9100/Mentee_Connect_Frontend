import axios from 'axios';

const API_URL = 'http://localhost:8080/api/students'; // Update this with your backend API base URL

// Get all students
export const fetchStudents = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

// Get student by ID
export const fetchStudentById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student:', error);
        throw error;
    }
};

// Create a new student
export const createStudent = async (studentData) => {
    try {
        const response = await axios.post(API_URL, studentData);
        return response.data;
    } catch (error) {
        console.error('Error creating student:', error);
        throw error;
    }
};

// Update student
export const updateStudent = async (id, studentData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, studentData);
        return response.data;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
};

// Delete student
export const deleteStudent = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
};
