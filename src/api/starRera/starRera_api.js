import axios from 'axios';
import axiosInstance from '../../imageURL';

const BASE_URL = 'https://ecis.in/apis/star-estate-API/starRera';

export const addStarRera = async (formData) => {
    try {
        const response = await axiosInstance.post(`/starRera/addStarRera`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
};

export const getStarRera = async () => {
    try {
        const response = await axiosInstance.get(`/starRera/getStarRera`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
}

export const getStarReraByID = async (id) => {
    try {
        const response = await axiosInstance.get(`/starRera/getStarReraByID/${id}`);
        console.log(response.data);
        return response.data;

    }catch (error){
        console.error('Error', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
}

export const updateStarRera = async (id, formData) => {
    try {
        const response = await axiosInstance.put(`/starRera/updateStarRera/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
};

export const updateStarReraStatus = async (cat_id, status) => {
    try {
        await axiosInstance.put(`/starRera/updateStarReraStatus/${cat_id}`, { status });
    } catch (error) {
        throw new Error('Error updating Location Advantages status.');
    }
};

// Delete StarRera
export const deleteStarRera = async (cat_id) => {
    try {
        await axiosInstance.delete(`/starRera/deleteStarRera/${cat_id}`);
    } catch (error) {
        throw new Error('Error deleting Location Advantages.');
    }
};