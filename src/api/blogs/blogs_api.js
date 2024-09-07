import axios from 'axios';
import axiosInstance from '../../imageURL';

const API_URL = 'https://ecis.in/apis/star-estate-API';

// Fetch all blogs
export const fetchBlogs = async () => {
    try {
        const response = await axiosInstance.get(`/blogs/getBlog`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch blogs');
    }
};

// Fetch a single blog by ID
export const fetchBlogById = async (id) => {
    try {
        const response = await axiosInstance.get(`/blogs/getBlogById/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch blog');
    }
};

// Update blog status
export const updateBlogStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(`/blogs/updateBlogStatus/${id}`, { status });
        return response.data;
    } catch (error) {
        throw new Error('Failed to update blog status');
    }
};

// Delete a blog
export const deleteBlog = async (id, image) => {
    try {
        await axiosInstance.delete(`/blogs/deleteBlog/${id}`, { data: { image } });
    } catch (error) {
        throw new Error('Failed to delete blog');
    }
};

// Add a new blog
export const addBlog = async (data) => {
    try {
        const response = await axiosInstance.post(`/blogs/addBlogs`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to add blog');
    }
};

// Update an existing blog
export const updateBlog = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/blogs/updateBlog/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to update blog');
    }
};
