import axios from 'axios';
import axiosInstance from '../../imageURL';

const BASE_URL = 'http://localhost:4000';


export const fetchPropertyEvaluation = async () => {
    try {
        const response = await axiosInstance.get(`/propertyEvaluation/getEvaluationReport`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Query');
    }
};

export const deletePropertyEvaluation = async (id) => {
    try{
        const response = await axiosInstance.delete(`/propertyEvaluation/deleteEvaluationReport/${id}`);
        return response;
    } catch (error) {
        throw new Error('Error deleting data');
    } 
}