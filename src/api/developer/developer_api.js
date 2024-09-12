import axios from 'axios';
import axiosInstance from '../../imageURL';

const API_URL = 'http://localhost:4000';

// Fetch all developers
export const fetchDevelopers = async () => {
    try {
        const response = await axiosInstance.get(`/developers/getDeveloper`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch developers');
    }
};

// Update developer status
export const updateDeveloperStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(`/developers/updateDeveloperStatus/${id}`, { status });
        return response.data;
    } catch (error) {
        throw new Error('Failed to update developer status');
    }
};

// Delete a developer
export const deleteDeveloper = async (id, image) => {
    try {
        await axiosInstance.delete(`/developers/deleteDeveloper/${id}`, { data: { image } });
    } catch (error) {
        throw new Error('Failed to delete developer');
    }
};

// Fetch developer by ID
export const fetchDeveloperById = async (id) => {
    try {
        const response = await axiosInstance.get(`/developers/getDeveloperById/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch developer data');
    }
};

// Add a new developer
export const addDeveloper = async (data) => {
    try {
        const response = await axiosInstance.post(`/developers/addDeveloper`, data, 
        //     {
        //     headers: { 'Content-Type': 'multipart/form-data' }
        // }
    );
        return response.data;
    } catch (error) {
        throw new Error('Failed to add developer');
    }
};

// Update an existing developer
export const updateDeveloper = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/developers/updateDeveloper/${id}`, data, 
        //     {
        //     headers: { 'Content-Type': 'multipart/form-data' }
        // }
    );
        return response.data;
    } catch (error) {
        throw new Error('Failed to update developer');
    }
};
