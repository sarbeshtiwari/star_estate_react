import axios from 'axios';
import axiosInstance from '../../imageURL';

const API_URL = 'http://localhost:4000';

export const deleteBanner = async (id) => {
    try {
        const response = await axiosInstance.delete(`/projectBannerImages/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting  banner:', error);
        throw error;
    }
};


export const fetchBannerByID = async (projectName) => {
    try {
        const response = await axiosInstance.get(`/projectBannerImages/get/${projectName}`);      
        return response.data;
    } catch (error) {
        console.error('Error fetching  banner data:', error);
        throw error;
    }
};

export const addBannerImage = async (formDataToSend) => {
    try {
        const url = `/projectBannerImages/addImages`;
        const response = await axiosInstance.post(url, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
    }
};

export const updateBannerStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(`/projectBannerImages/updateStatus/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating status:', error);
        throw error;
    }
};
