import axios from 'axios';

const API_URL = 'http://localhost:8080/api/batches';

export const getBatches = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createBatch = async (batchData) => {
    const response = await axios.post(API_URL, batchData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};