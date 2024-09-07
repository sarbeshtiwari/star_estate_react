import axios from 'axios';
import axiosInstance from '../../imageURL';

const BASE_URL = 'https://ecis.in/apis/star-estate-API';


export const fetchContactUS = async () => {
    try {
        const response = await axiosInstance.get(`/contactUS/getContactUS`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Query');
    }
};

export const deleteContactUS = async (id) => {
    try{
        const response = await axiosInstance.delete(`/contactUS/deleteContactUS/${id}`);
        return response;
    } catch (error) {
        throw new Error('Error deleting data');
    } 
}

export const updateContactUS = async (id, note) => {
    try{
        const response = await axiosInstance.put(`/contactUS/updateContactUS/${id}`, {note});
        return response;
    } catch (error) {
        throw new Error('Error updating data');
    } 
}