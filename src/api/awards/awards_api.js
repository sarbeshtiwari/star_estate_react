import axios from 'axios';

const API_URL = 'https://ecis.in/apis/star-estate-API';

// Fetch all Awards
export const fetchAwards = async () => {
    try {
        const response = await axios.get(`${API_URL}/award/getAwards`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch Awards');
    }
};

// Update Award status
export const updateAwardStatus = async (id, status) => {
    try {
        await axios.put(`${API_URL}/award/updateAwardStatus/${id}`, { status });
    } catch (error) {
        throw new Error('Failed to update Award status');
    }
};

// Delete an Award
export const deleteAward = async (id) => {
    try {
        await axios.delete(`${API_URL}/award/deleteAwards/${id}`);
    } catch (error) {
        throw new Error('Failed to delete Award');
    }
};



export const fetchAwardById = async (id) => {
    return axios.get(`${API_URL}/award/getAwardById/${id}`);
};

export const addAward = async (data) => {
    return axios.post(`${API_URL}/award/addAwards`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const updateAward = async (id, data) => {
    return axios.put(`${API_URL}/award/updateAward/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
