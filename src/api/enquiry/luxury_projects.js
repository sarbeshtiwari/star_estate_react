import axios from 'axios';

const BASE_URL = 'https://star-estate-api.onrender.com';


export const fetchLuxuryProperty = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/luxuryProjects/getLuxuryProjects`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Query');
    }
};

export const deleteLuxuryProperty = async (id) => {
    try{
        const response = await axios.delete(`${BASE_URL}/luxuryProjects/deleteLuxuryProjects/${id}`);
        return response;
    } catch (error) {
        throw new Error('Error deleting data');
    } 
}

export const updateLuxuryProperty = async (id, note) => {
    try{
        const response = await axios.put(`${BASE_URL}/luxuryProjects/updateLuxuryProjects/${id}`, {note});
        return response;
    } catch (error) {
        throw new Error('Error updating data');
    } 
}