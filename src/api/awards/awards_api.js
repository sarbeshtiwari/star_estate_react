import axios from 'axios';
import axiosInstance from '../../imageURL';

const API_URL = 'https://ecis.in/apis/star-estate-API';

// Fetch all Awards
export const fetchAwards = async () => {
    try {
        const response = await axiosInstance.get(`/award/getAwards`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch Awards');
    }
};

// Update Award status
export const updateAwardStatus = async (id, status) => {
    try {
        await axiosInstance.put(`/award/updateAwardStatus/${id}`, { status });
    } catch (error) {
        throw new Error('Failed to update Award status');
    }
};

// Delete an Award
export const deleteAward = async (id) => {
    try {
        await axiosInstance.delete(`/award/deleteAwards/${id}`);
    } catch (error) {
        throw new Error('Failed to delete Award');
    }
};



export const fetchAwardById = async (id) => {
    return axiosInstance.get(`/award/getAwardById/${id}`);
};

export const addAward = async (data) => {
    return axiosInstance.post(`/award/addAwards`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const updateAward = async (id, data) => {
    return axiosInstance.put(`/award/updateAward/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
