// apiService.js
import axios from 'axios';
import axiosInstance from '../../imageURL';

const BASE_URL = 'https://ecis.in/apis/star-estate-API';

// Fetch all jobs
export const fetchJobs = async () => {
    try {
        const response = await axiosInstance.get(`/jobs/getJobs`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching jobs');
    }
};

// Update job status
export const updateJobStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(`/jobs/updateJobStatus/${id}`, { status });
        return response.data;
    } catch (error) {
        throw new Error('Error updating job status');
    }
};

// Delete job
export const deleteJob = async (id) => {
    try {
        await axiosInstance.delete(`/jobs/deleteJob/${id}`);
    } catch (error) {
        throw new Error('Error deleting job');
    }
};

// Fetch job details by ID
export const fetchJobDetails = async (id) => {
    try {
        const response = await axiosInstance.get(`/jobs/getJobByID/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching job details');
    }
};

// Add new job
export const addJob = async (jobData) => {
    try {
        const response = await axiosInstance.post(`/jobs/addJob`, jobData);
        return response.data;
    } catch (error) {
        throw new Error('Error adding job');
    }
};

// Update job details
export const updateJob = async (id, jobData) => {
    try {
        const response = await axiosInstance.put(`/jobs/updateJob/${id}`, jobData);
        return response.data;
    } catch (error) {
        throw new Error('Error updating job');
    }
};
