
import axiosInstance from '../../imageURL';
// import axios from 'axios';
// const API_URL = 'https://ecis.in/apis/star-estate-API';

// Fetch all Advertisements
export const fetchAdvertisements = async () => {
    try {
        const response = await axiosInstance.get(`/advertisement/getAdvertisements`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch Advertisements');
    }
};

// Update Advertisement status
export const updateAdvertisementStatus = async (id, status) => {
    try {
        await axiosInstance.put(`/advertisement/updateAdvertisementStatus/${id}`, { status });
    } catch (error) {
        throw new Error('Failed to update Advertisement status');
    }
};

// Delete an Advertisement
export const deleteAdvertisement = async (id, image) => {
    try {
        await axiosInstance.delete(`/advertisement/deleteAdvertisement/${id}`, { data: { image } });
    } catch (error) {
        throw new Error('Failed to delete Advertisement');
    }
};



export const fetchAdvertisementById = async (id) => {
    return axiosInstance.get(`/advertisement/getAdvertisementById/${id}`);
};

export const addAdvertisement = async (data) => {
    return axiosInstance.post(`/advertisement/addAdvertisements`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const updateAdvertisement = async (id, data) => {
    return axiosInstance.put(`/advertisement/updateAdvertisement/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
