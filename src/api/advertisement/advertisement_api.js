import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Fetch all Advertisements
export const fetchAdvertisements = async () => {
    try {
        const response = await axios.get(`${API_URL}/advertisement/getAdvertisements`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch Advertisements');
    }
};

// Update Advertisement status
export const updateAdvertisementStatus = async (id, status) => {
    try {
        await axios.put(`${API_URL}/advertisement/updateAdvertisementStatus/${id}`, { status });
    } catch (error) {
        throw new Error('Failed to update Advertisement status');
    }
};

// Delete an Advertisement
export const deleteAdvertisement = async (id, image) => {
    try {
        await axios.delete(`${API_URL}/advertisement/deleteAdvertisement/${id}`, { data: { image } });
    } catch (error) {
        throw new Error('Failed to delete Advertisement');
    }
};



export const fetchAdvertisementById = async (id) => {
    return axios.get(`${API_URL}/advertisement/getAdvertisementById/${id}`);
};

export const addAdvertisement = async (data) => {
    return axios.post(`${API_URL}/advertisement/addAdvertisements`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const updateAdvertisement = async (id, data) => {
    return axios.put(`${API_URL}/advertisement/updateAdvertisement/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
