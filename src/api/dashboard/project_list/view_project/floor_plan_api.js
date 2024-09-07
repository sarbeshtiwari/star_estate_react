import axios from 'axios';

const BASE_URL = 'https://ecis.in/apis/star-estate-API/projectFloorPlan';

// const BASE_URL = 'http://localhost:4000/projectFloorPlan';

export const addFloorPlan = async (formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/addFloorPlan`, formData, {
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

export const getFloorPlanByProject = async (project) => {
    try {
        const response = await axios.get(`${BASE_URL}/getFloorPlan/${project}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
}

export const getFloorPlanByID = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/getFloorPlanByID/${id}`);
        console.log(response.data);
        return response.data;

    }catch (error){
        console.error('Error', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
}

export const updateFloorPlan = async (id, formData) => {
    try {
        const response = await axios.put(`${BASE_URL}/updateFloorPlan/${id}`, formData, {
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

export const updateFloorPlanStatus = async (cat_id, status) => {
    try {
        await axios.put(`${BASE_URL}/updateFloorPlanStatus/${cat_id}`, { status });
    } catch (error) {
        throw new Error('Error updating Location Advantages status.');
    }
};

// Delete FloorPlan
export const deleteFloorPlan = async (cat_id) => {
    try {
        await axios.delete(`${BASE_URL}/deleteFloorPlan/${cat_id}`);
    } catch (error) {
        throw new Error('Error deleting Location Advantages.');
    }
};


export const projectFloorContent = async( projectname, floorPlanContent) => {
    console.log(floorPlanContent)
    try {
        const response = await axios.post(`${BASE_URL}/projectsFloorPlanContent/${projectname}`, floorPlanContent);
        return response.data;

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}


export const getFloorContent = async (project) => {
    try {
        const response = await axios.get(`${BASE_URL}/getFloorContent/${project}`);
        console.log(response)
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data[0];
        } else {
            return ''; // Return an empty string if no data is found
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
}