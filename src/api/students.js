import axios from 'axios';

export const getMyMentor = async () => {
    try {
        const response = await axios.get('/api/students/my-mentor', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching mentor:', error);
        throw error; // Re-throw for component to handle
    }
};