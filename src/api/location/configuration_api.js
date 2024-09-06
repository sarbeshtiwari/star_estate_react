import axios from 'axios';

const API_URL = 'https://ecis.in/apis/star-estate-API/cityConfiguration';


export const addConfiguration = async (formDataToSend) => {
    try {
        console.log(formDataToSend)
        const response = await axios.post(`${API_URL}/addConfiguration`, formDataToSend, {
            headers: {
                'Content-Type': 'application/json',
            }
            
        });
        return response.data;
    } catch (error) {
        throw new Error('Error adding Data: ' + error.message);
    }
};

export const fetchProjectConfiguration = async (location) => {
    try {
        const response = await axios.get(`${API_URL}/getConfigurationByCity/${location}`);
       
        return response.data;
    } catch (error) {
        throw new Error('Error adding Data: ' + error.message);
    }
};

export const fetchProjectConfigurationByID= async (id) => {
    try {
        const response = await axios.get(`${API_URL}/getConfigurationByID/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error adding Data: ' + error.message);
    }
};

export const fetchProjectConfigurationByLocationAndType= async (location, projectConfiguration, projectType) => {
    try {
        const response = await axios.get(`${API_URL}/getConfigurationByLocationAndType/${location}/${projectConfiguration}/${projectType}`);
        return response.data;
    } catch (error) {
        throw new Error('Error adding Data: ' + error.message);
    }
};



// Update Configuration status
export const updateConfigurationStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}/updateConfigurationStatus/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating Configuration status:', error);
        throw error;
    }
};

// Delete a Configuration
export const deleteConfiguration = async (id) => {
    try {
        await axios.delete(`${API_URL}/deleteConfiguration/${id}`);
    } catch (error) {
        console.error('Error deleting Configuration:', error);
        throw error;
    }
};
