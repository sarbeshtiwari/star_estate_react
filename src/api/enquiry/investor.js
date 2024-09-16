import axios from 'axios';
import axiosInstance from '../../imageURL';

const BASE_URL = 'https://ecis.in/apis/star-estate-API';


export const fetchInvestor = async () => {
    try {
        const response = await axiosInstance.get(`/channelPartner/getChannelPartner`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Query');
    }
};

export const deleteInvestor = async (id) => {
    try{
        const response = await axiosInstance.delete(`/channelPartner/deleteChannelPartner/${id}`);
        return response;
    } catch (error) {
        throw new Error('Error deleting data');
    } 
}