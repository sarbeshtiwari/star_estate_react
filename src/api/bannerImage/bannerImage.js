import axios from 'axios';

const API_URL = 'http://localhost:3000/bannerImages';

export const deleteBanner = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting  banner:', error);
        throw error;
    }
};


export const fetchBannerByID = async () => {
    try {
        const response = await axios.get(`${API_URL}/get`);      
        return response.data;
    } catch (error) {
        console.error('Error fetching  banner data:', error);
        throw error;
    }
};

export const addBannerImage = async (formDataToSend) => {
    try {
        const url = `${API_URL}/addImages`;
        const response = await axios.post(url, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
    }
};

export const updateBannerStatus = async (id, status) => {
    try {
        const response = await axios.patch(`${API_URL}/updateStatus`, {
            id,
            status
        });
        return response.data;
    } catch (error) {
        console.error('Error updating About Us status:', error);
        throw error;
    }
};