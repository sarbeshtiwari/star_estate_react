import axios from "axios";

const API_BASE_URL = 'https://ecis.in/apis/star-estate-API/addProjects';
// const API_BASE_URL = 'http://localhost:4000/addProjects'


export const fetchProjects = async (id) => {
    try {
        
        const response = await axios.get(`${API_BASE_URL}/getProjectByType/${id}`);
        return response.data;
       
    } catch (err) {
        console.error('Unexpected error:', err);
        throw err;
    }
};

export const updateStatus = async (id,  status, slugURL) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/updateProjectStatus/${id}`, { status, slugURL });
        return response; // Ensure response is returned
    } catch (error) {
        console.error('Unexpected error:', error);
        throw error; // Rethrow the error to be handled in the caller function
    }
};

export const updateSimilarPropStatus = async (id,  status) => {
    console.log(status)
    try {
        const response = await axios.put(`${API_BASE_URL}/updateShowSimilarProperties/${id}`, { status});
        return response; // Ensure response is returned
    } catch (error) {
        console.error('Unexpected error:', error);
        throw error; // Rethrow the error to be handled in the caller function
    }
};

export const updateProjectStatusCategory = async (id, value) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/updateProjectStatusCategory/${id}`, { project_status: value });
        return response; // Ensure response is returned
    } catch (error) {
        console.log('Unexpected error:', error);
        throw error; // Rethrow the error to be handled in the caller function
    }
};


export const deleteProject = async (id, image) => {
    try {
        await axios.delete(`${API_BASE_URL}/deleteProject/${id}`, { data: { image } });
        
    } catch (error) {
        console.error('Error deleting Project:', error);
    }
};

//adding a project
// Fetch a project by ID
export const fetchProjectById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getProjectById/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
    }
};

// Add a new project
export const addProject = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/addProject`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding project:', error);
        throw error;
    }
};

// Update an existing project
export const updateProject = async (id, formData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/updateProject/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
};

const BASE_URL_CITIES = 'https://ecis.in/apis/star-estate-API';
const BASE_URL_DEVELOPERS = 'https://ecis.in/apis/star-estate-API/developers';



// Fetch cities
export const fetchCities = async () => {
    try {
        const response = await axios.get(`${BASE_URL_CITIES}/city/getCities`);
        // const filteredCity = response.data.filter(city => city.status === true);
        return response.data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
};

// Fetch developers
export const fetchDevelopers = async () => {
    try {
        const response = await axios.get(`${BASE_URL_DEVELOPERS}/getDeveloper`);
        return response.data;
    } catch (error) {
        console.error('Error fetching developers:', error);
        throw error;
    }
};

// Fetch localities by city ID
export const fetchLocalitiesByCity = async (cityId) => {
    try {
        const response = await axios.get(`${BASE_URL_CITIES}/subCity/getSubCityByCity/${cityId}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Handle 404 error
            console.error('City not found');
            return false;
        } else {
            // Handle other errors
            console.error('Error fetching localities:', error);
            return false;
        }
    }
};

export const fetchCitiesByState = async (state) => {
    try {
        const response = await axios.get(`${BASE_URL_CITIES}/city/getCityByState/${state}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
};