import axios from 'axios';
import axiosInstance from '../../imageURL';

const BASE_URL = 'https://ecis.in/apis/star-estate-API';


export const fetchProjectQuery = async () => {
    try {
        const response = await axiosInstance.get(`/userQuery/getQuery`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Query');
    }
};

export const deleteProjectQuery = async (id) => {
    try{
        const response = await axiosInstance.delete(`/userQuery/deleteQuery/${id}`);
        return response;
    } catch (error) {
        throw new Error('Error deleting data');
    } 
}

export const updateProjectQuery = async (id, note) => {
    try{
        const response = await axiosInstance.put(`/userQuery/updateQuery/${id}`, {note});
        return response;
    } catch (error) {
        throw new Error('Error updating data');
    } 
}