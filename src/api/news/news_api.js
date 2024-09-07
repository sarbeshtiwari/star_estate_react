import axios from 'axios';
import axiosInstance from '../../imageURL';

const API_URL = 'https://ecis.in/apis/star-estate-API/news';

export const fetchNews = async () => {
    return axiosInstance.get(`/news/getNews`);
};

export const updateNewsStatus = async (id, status) => {
    return axiosInstance.put(`/news/updateNewsStatus/${id}`, { status });
};

export const deleteNews = async (id, image, image2) => {
    return axiosInstance.delete(`/news/deleteNews/${id}`, { data: { image, image2 } });
};



export const fetchNewsById = async (id) => {
    return axiosInstance.get(`/news/getNewsById/${id}`);
};

export const addNews = async (data) => {
    return axiosInstance.post(`/news/addNews`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const updateNews = async (id, data) => {
    return axiosInstance.put(`/news/updateNews/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
