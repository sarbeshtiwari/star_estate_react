import axios from 'axios';

const API_URL = 'https://ecis.in/apis/star-estate-API';

// Fetch all ClientWords
export const fetchClientWords = async () => {
    try {
        const response = await axios.get(`${API_URL}/clientSpeak/getClientWords`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch ClientWords');
    }
};

// Update ClientWords status
export const updateClientWordstatus = async (id, status) => {
    try {
        await axios.put(`${API_URL}/clientSpeak/updateClientWordstatus/${id}`, { status });
    } catch (error) {
        throw new Error('Failed to update ClientWords status');
    }
};

// Delete an ClientWords
export const deleteClientWords = async (id, image) => {
    try {
        await axios.delete(`${API_URL}/clientSpeak/deleteClientWords/${id}`, { data: { image } });
    } catch (error) {
        throw new Error('Failed to delete ClientWords');
    }
};



export const fetchClientWordsById = async (id) => {
    return axios.get(`${API_URL}/clientSpeak/getClientWordsById/${id}`);
};

export const addClientWords = async (data) => {
    return axios.post(`${API_URL}/clientSpeak/addClientWords`, data);
};

export const updateClientWords = async (id, data) => {
    return axios.put(`${API_URL}/clientSpeak/updateClientWords/${id}`, data);
};
