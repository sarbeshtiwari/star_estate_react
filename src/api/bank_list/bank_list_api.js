import axios from 'axios';
import axiosInstance from '../../imageURL';

const BASE_URL = 'https://ecis.in/apis/star-estate-API';

export const addBankList = async (formData) => {
    try {
        const response = await axiosInstance.post(`/banks/addBankList`, formData, {
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

export const getBankList = async () => {
    try {
        const response = await axiosInstance.get(`/banks/getBankList`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
}

export const getBankListByID = async (id) => {
    try {
        const response = await axiosInstance.get(`/banks/getBankListByID/${id}`);
        console.log(response.data);
        return response.data;

    }catch (error){
        console.error('Error', error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the component
    }
}

export const updateBankList = async (id, formData) => {
    try {
        const response = await axiosInstance.put(`/banks/updateBankList/${id}`, formData, {
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

export const updateBankListStatus = async (cat_id, status) => {
    try {
        await axiosInstance.put(`/banks/updateBankListStatus/${cat_id}`, { status });
    } catch (error) {
        throw new Error('Error updating Location Advantages status.');
    }
};

// Delete BankList
export const deleteBankList = async (cat_id) => {
    try {
        await axiosInstance.delete(`/banks/deleteBankList/${cat_id}`);
    } catch (error) {
        throw new Error('Error deleting Location Advantages.');
    }
};