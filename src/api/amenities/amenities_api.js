
import axiosInstance from '../../imageURL';


const BASE_URL = 'https://ecis.in/apis/star-estate-API/subAmenities';

// Fetch amenities by category ID
export const fetchAmenityData = async (id) => {
    try {
        const response = await axiosInstance.get(`/subAmenities/getAmenitiyDataByCategory/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching amenities data.');
    }
};


// Update amenity status
export const updateAmenityStatus = async (cat_id, status) => {
    try {
        await axiosInstance.put(`/subAmenities/updateSubAmenitiyCategoryStatus/${cat_id}`, { status });
    } catch (error) {
        throw new Error('Error updating amenity status.');
    }
};

// Delete amenity
export const deleteAmenity = async (cat_id) => {
    try {
        await axiosInstance.delete(`/subAmenities/deleteSubAmenitiyCategory/${cat_id}`);
    } catch (error) {
        throw new Error('Error deleting amenity.');
    }
};

// src/services/apiService.js


// export const addSubAmenities = async (data) => {
//     try {
//         const response = await axiosInstance.post(`/subAmenities/addSubAmenities`, data, {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error:', error.response ? error.response.data : error.message);
//         setToastMessage('An error occurred while saving data.');
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 2000); // Hide toast after 2 seconds
//     }
    
// };

// export const updateSubAmenity = async (id, data) => {
//     try {
//         const response = await axiosInstance.put(`/subAmenities/updateFaq/${id}`, data);
//         return response.data;
//     } catch (error) {
//         throw new Error('Error updating amenity');
//     }
// };

export const addSubAmenities = async (formData) => {
    try {
        const response = await axiosInstance.post(`/subAmenities/addSubAmenities`, formData, {
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

export const getSubAmenitiyByID = async (id) => {
    try {
        const response = await axiosInstance.get(`/subAmenities/getSubAmenityByID/${id}`);
        console.log(response.data);
        return response.data;

    }catch (error){
        console.error('Error', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
}

export const updateSubAmenity = async (id, formData) => {
    try {
        console.log(formData)
        const response = await axiosInstance.put(`/subAmenities/updateSubAmenities/${id}`, formData, {
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



export const getAllTheAmenities = async () => {
    try{
        const response = await axiosInstance.get(`/subAmenities/getAllTheAmenities`);
        return response;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
}