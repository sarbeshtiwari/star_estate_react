import axios from 'axios';
import axiosInstance from '../../imageURL';

const API_URL = 'https://ecis.in/apis/star-estate-API/bannerImages';

export const deleteBanner = async (id) => {
    try {
        const response = await axiosInstance.delete(`/bannerImages/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting  banner:', error);
        throw error;
    }
};


export const fetchBannerByID = async () => {
    try {
        const response = await axiosInstance.get(`/bannerImages/get`);      
        return response.data;
    } catch (error) {
        console.error('Error fetching  banner data:', error);
        throw error;
    }
};

export const addBannerImage = async (formDataToSend) => {
    try {
        const url = `/bannerImages/addImages`;
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
        const response = await axiosInstance.put(`/bannerImages/updateStatus/${id}`, {
            status
        });
        return response.data;
    } catch (error) {
        console.error('Error updating About Us status:', error);
        throw error;
    }
};