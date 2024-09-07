import axios from 'axios';
import axiosInstance from '../../imageURL';

const API_URL = 'https://ecis.in/apis/star-estate-API';

// Fetch all ClientWords
export const fetchClientWords = async () => {
    try {
        const response = await axiosInstance.get(`/clientSpeak/getClientWords`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch ClientWords');
    }
};

// Update ClientWords status
export const updateClientWordstatus = async (id, status) => {
    try {
        await axiosInstance.put(`/clientSpeak/updateClientWordstatus/${id}`, { status });
    } catch (error) {
        throw new Error('Failed to update ClientWords status');
    }
};

// Delete an ClientWords
export const deleteClientWords = async (id, image) => {
    try {
        await axiosInstance.delete(`/clientSpeak/deleteClientWords/${id}`, { data: { image } });
    } catch (error) {
        throw new Error('Failed to delete ClientWords');
    }
};



export const fetchClientWordsById = async (id) => {
    return axiosInstance.get(`/clientSpeak/getClientWordsById/${id}`);
};

export const addClientWords = async (data) => {
    return axiosInstance.post(`/clientSpeak/addClientWords`, data);
};

export const updateClientWords = async (id, data) => {
    return axiosInstance.put(`/clientSpeak/updateClientWords/${id}`, data);
};
