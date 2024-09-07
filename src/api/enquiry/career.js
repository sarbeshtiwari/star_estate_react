import axios from 'axios';
import axiosInstance from '../../imageURL';

const BASE_URL = 'https://ecis.in/apis/star-estate-API';


export const fetchCareer = async () => {
    try {
        const response = await axiosInstance.get(`/careerQuery/getCareer`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Query');
    }
};

export const deleteCareer = async (id) => {
    try{
        const response = await axiosInstance.delete(`/careerQuery/deleteCareer/${id}`);
        return response;
    } catch (error) {
        throw new Error('Error deleting data');
    } 
}

export const updateCareer = async (id, note) => {
    try{
        const response = await axiosInstance.put(`/careerQuery/updateCareer/${id}`, {note});
        return response;
    } catch (error) {
        throw new Error('Error updating data');
    } 
}