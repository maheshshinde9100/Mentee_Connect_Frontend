import axios from 'axios';

const API_URL = 'http://localhost:8080/api/batches'; // Update this with your backend API base URL

// Get all batches
export const fetchBatches = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching batches:', error);
        throw error;
    }
};

// Get batch by ID
export const fetchBatchById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching batch:', error);
        throw error;
    }
};

// Create a new batch
export const createBatch = async (batchData) => {
    try {
        const response = await axios.post(API_URL, batchData);
        return response.data;
    } catch (error) {
        console.error('Error creating batch:', error);
        throw error;
    }
};
