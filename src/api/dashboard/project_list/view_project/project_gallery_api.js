import axios from 'axios';

const BASE_URL = 'https://ecis.in/apis/star-estate-API/projectGallery';
// const BASE_URL = 'http://localhost:3000/projectGallery';

export const addProjectGallery = async (formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/addProjectGallery`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
};

export const getProjectGalleryByProject = async (project) => {
    try {
        const response = await axios.get(`${BASE_URL}/getProjectGallery/${project}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
}

export const getProjectGalleryByID = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/getProjectGalleryByID/${id}`);
        console.log(response.data);
        return response.data;

    }catch (error){
        console.error('Error', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
}

export const updateProjectGallery = async (id, formData) => {
    try {
        const response = await axios.put(`${BASE_URL}/updateProjectGallery/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
};

export const updateProjectGalleryStatus = async (cat_id, status) => {
    try {
        await axios.put(`${BASE_URL}/updateProjectGalleryStatus/${cat_id}`, { status });
    } catch (error) {
        throw new Error('Error updating Location Advantages status.');
    }
};

export const updateProjectGalleryHomeStatus = async (cat_id, displayHome) => {
    try {
        await axios.put(`${BASE_URL}/updateProjectGalleryHomeStatus/${cat_id}`, { displayHome });
    } catch (error) {
        throw new Error('Error updating Location Advantages status.');
    }
};

// Delete ProjectGallery
export const deleteProjectGallery = async (cat_id) => {
    try {
        await axios.delete(`${BASE_URL}/deleteProjectGallery/${cat_id}`);
    } catch (error) {
        throw new Error('Error deleting Location Advantages.');
    }
};


export const projectGalleryContent = async( projectname, formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/projectsGalleryContent/${projectname}`, formData);
        return response.data;

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}


export const getGalleryContent = async (project) => {
    try {
        const response = await axios.get(`${BASE_URL}/getGalleryContent/${project}`);

        // Safely check if response.data and response.data.data exist before trying to access the first item
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data[0];
        } else {
            return ''; // Return an empty string if no data is found
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
};
