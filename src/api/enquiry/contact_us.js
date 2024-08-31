import axios from 'axios';

const BASE_URL = 'https://ecis.in/apis/star-estate-API';


export const fetchContactUS = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/contactUS/getContactUS`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Query');
    }
};

export const deleteContactUS = async (id) => {
    try{
        const response = await axios.delete(`${BASE_URL}/contactUS/deleteContactUS/${id}`);
        return response;
    } catch (error) {
        throw new Error('Error deleting data');
    } 
}

export const updateContactUS = async (id, note) => {
    try{
        const response = await axios.put(`${BASE_URL}/contactUS/updateContactUS/${id}`, {note});
        return response;
    } catch (error) {
        throw new Error('Error updating data');
    } 
}