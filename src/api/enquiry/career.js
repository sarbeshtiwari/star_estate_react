import axios from 'axios';

const BASE_URL = 'https://ecis.in/star-api/starEstate';


export const fetchCareer = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/careerQuery/getCareer`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Query');
    }
};

export const deleteCareer = async (id) => {
    try{
        const response = await axios.delete(`${BASE_URL}/careerQuery/deleteCareer/${id}`);
        return response;
    } catch (error) {
        throw new Error('Error deleting data');
    } 
}

export const updateCareer = async (id, note) => {
    try{
        const response = await axios.put(`${BASE_URL}/careerQuery/updateCareer/${id}`, {note});
        return response;
    } catch (error) {
        throw new Error('Error updating data');
    } 
}