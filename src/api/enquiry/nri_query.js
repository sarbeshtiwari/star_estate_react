import axios from 'axios';
import axiosInstance from '../../imageURL';

const BASE_URL = 'http://localhost:4000';


export const fetchNRIQuery = async () => {
    try {
        const response = await axiosInstance.get(`/NRIQuery/getNRIQuery`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Query');
    }
};

export const deleteNRIQuery = async (id) => {
    try{
        const response = await axiosInstance.delete(`/NRIQuery/deleteNRIQuery/${id}`);
        return response;
    } catch (error) {
        throw new Error('Error deleting data');
    } 
}

export const updateLuxuryProperty = async (id, note) => {
    try{
        const response = await axiosInstance.put(`/NRIQuery/updateNRIQuery/${id}`, {note});
        return response;
    } catch (error) {
        throw new Error('Error updating data');
    } 
}