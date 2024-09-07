import axios from 'axios';
import axiosInstance from '../../imageURL';

const API_BASE_URL = `https://ecis.in/apis/star-estate-API`;
// const API_BASE_URL = 'http://localhost:1000';

// Add categories
export const addCategories = async (dataToSubmit) => {
    try {
        const response = await axiosInstance.post(`/categories/addCategory`, dataToSubmit);   //can change later
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Update categories
export const updateCategories = async (id, dataToSubmit) => {
    try {
        const response = await axiosInstance.put(`/categories/updateCategory/${id}`, dataToSubmit);   //can change later
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error Updating categories:', error);
        throw error;
    }
};

// Fetch categories
export const fetchCategories = async () => {
    try {
        const response = await axiosInstance.get(`/categories/getCategories`);   //can change later

        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Update category status
export const updateCategoryStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(`/categories/updateCategoryStatus/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating category status:', error);
        throw error;
    }
};

// Delete category
export const deleteCategory = async (id) => {
    try {
        await axiosInstance.delete(`/categories/deleteCategory/${id}`);
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};

// Get category by ID
export const getCategoryById = async (id) => {
    try {
        const response = await axiosInstance.get(`/categories/getCategoriesByID/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        throw error;
    }
};
