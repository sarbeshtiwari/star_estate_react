import axios from 'axios';

const BASE_URL = 'https://ecis.in/apis/star-estate-API';


export const fetchProjectQuery = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/userQuery/getQuery`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Query');
    }
};

export const deleteProjectQuery = async (id) => {
    try{
        const response = await axios.delete(`${BASE_URL}/userQuery/deleteQuery/${id}`);
        return response;
    } catch (error) {
        throw new Error('Error deleting data');
    } 
}

export const updateProjectQuery = async (id, note) => {
    try{
        const response = await axios.put(`${BASE_URL}/userQuery/updateQuery/${id}`, {note});
        return response;
    } catch (error) {
        throw new Error('Error updating data');
    } 
}