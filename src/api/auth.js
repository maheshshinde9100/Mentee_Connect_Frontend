// ✅ src/api/auth.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const loginUser = (credentials) => API.post('/login', credentials);
export const registerAdmin = (adminData) => API.post('/admin', adminData);
export const registerMentor = (mentorData) => API.post('/mentors', mentorData);
export const registerStudent = (studentData) => API.post('/students', studentData);
