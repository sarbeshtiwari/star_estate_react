import axios from "axios";

const $API_URL = 'https://ecis.in/apis/star-estate-API/projectLocationAdvantages';
// const $API_URL = 'http://localhost:4000/projectLocationAdvantages';

export const ProjectLocationAdvantages = async (locationId, status, projectname, title, proximity, unit) => {
    try{
        const response = await axios.post(`${$API_URL}/projectLocationAdvantages/${locationId}`,{status, projectname, title, proximity, unit});
        return response.data;
    }catch(error){
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
}

export const getProjectLocationAdvantages = async (projectname) => {
    try {
        const response = await axios.get(`${$API_URL}/getprojectLocationAdvantages/${projectname}`);
        return response.data;
    } catch (error){
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export const projectLocationContent = async(formData, projectname) => {
    try {
        const response = await axios.post(`${$API_URL}/projectsLocationContent/${projectname}`, formData);
        return response.data;

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}