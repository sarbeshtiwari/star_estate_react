import axios from 'axios';
import axiosInstance from '../../imageURL';

const BASE_URL = 'https://ecis.in/apis/star-estate-API';


export const fetchLuxuryProperty = async () => {
    try {
        const response = await axiosInstance.get(`/luxuryProjects/getLuxuryProjects`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Query');
    }
};

export const deleteLuxuryProperty = async (id) => {
    try{
        const response = await axiosInstance.delete(`/luxuryProjects/deleteLuxuryProjects/${id}`);
        return response;
    } catch (error) {
        throw new Error('Error deleting data');
    } 
}

export const updateLuxuryProperty = async (id, note) => {
    try{
        const response = await axiosInstance.put(`/luxuryProjects/updateLuxuryProjects/${id}`, {note});
        return response;
    } catch (error) {
        throw new Error('Error updating data');
    } 
}