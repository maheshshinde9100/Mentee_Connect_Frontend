import axios from 'axios';

const API_URL = 'http://localhost:8080/api/login';

export const login = async (email, password) => {
    const response = await axios.post(API_URL, { email, password });

    // Transform backend response to frontend expected format
    return {
        success: response.data.status,
        user: {
            id: response.data.id,
            email: email,
            name: response.data.name,
            role: response.data.message.includes('Admin') ? 'ADMIN' :
                response.data.message.includes('Mentor') ? 'MENTOR' : 'STUDENT',
            // Student specific
            ...(response.data.mentorName && { mentorName: response.data.mentorName }),
            // Mentor specific
            ...(response.data.expertise && { expertise: response.data.expertise })
        }
    };
};