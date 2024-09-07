

import axios from 'axios';

export const imageURL = `https://res.cloudinary.com/dmf5snnz9/image/upload/v1724843870`;
// src/axiosInstance.js


// Create an axios instance with default settings
const axiosInstance = axios.create({
    baseURL: 'https://ecis.in/apis/star-estate-API', // Replace with your API base URL
    // timeout: 10000, // Optional: Set a default timeout (in milliseconds)
    // headers: {
    //     'Content-Type': 'application/json',
    //     // Add other headers as needed
    // }
});

// // Optional: Add request and response interceptors if needed
// axiosInstance.interceptors.request.use(
//     config => {
//         // Modify request config before sending
//         // For example, add authentication tokens
//         // const token = localStorage.getItem('token');
//         // if (token) {
//         //     config.headers.Authorization = `Bearer ${token}`;
//         // }
//         return config;
//     },
//     error => {
//         // Handle request error
//         return Promise.reject(error);
//     }
// );

// axiosInstance.interceptors.response.use(
//     response => {
//         // Handle response data
//         return response;
//     },
//     error => {
//         // Handle response error
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;
