import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

export const assignMentorToStudent = async (studentEmail, mentorName) => {
    const response = await axios.post(`${API_URL}/assign-mentor`, {
        studentEmail,
        mentorName
    });
    return response.data;
};

export const getStudents = async () => {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
};

export const getMentors = async () => {
    const response = await axios.get('http://localhost:8080/api/mentors');
    return response.data;
};