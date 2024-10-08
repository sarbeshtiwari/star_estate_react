import axios from "axios";

const $API_URL = 'https://ecis.in/apis/star-estate-API/projectAmenities';

export const ProjectAmenities = async (amenityId, status, projectname) => {
    try{
        const response = await axios.post(`${$API_URL}/projectAmenities/${amenityId}`,{status, projectname});
        return response.data;
    }catch(error){
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
}

export const getProjectAmenities = async (projectname) => {
    try {
        const response = await axios.get(`${$API_URL}/getprojectAmenities/${projectname}`);
        return response;
    } catch (error){
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export const projectAmenitiesContent = async(formData, projectname) => {
    try {
        const response = await axios.post(`${$API_URL}/projectsAmenityContent/${projectname}`, formData);
        return response.data;

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}