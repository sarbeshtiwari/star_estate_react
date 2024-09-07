import axios from 'axios';
import axiosInstance from '../../imageURL';

const API_URL = 'https://ecis.in/apis/star-estate-API';

// Fetch all events
export const fetchEvents = async () => {
    try {
        const response = await axiosInstance.get(`/events/getEvents`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch events');
    }
};

// Update event status
export const updateEventStatus = async (id, status) => {
    try {
        await axiosInstance.put(`/events/updateEventStatus/${id}`, { status });
    } catch (error) {
        throw new Error('Failed to update event status');
    }
};

// Delete an event
export const deleteEvent = async (id) => {
    try {
        await axiosInstance.delete(`/events/deleteEvent/${id}`);
    } catch (error) {
        throw new Error('Failed to delete event');
    }
};



export const fetchEventById = async (id) => {
    return axiosInstance.get(`/events/getEventById/${id}`);
};

export const addEvent = async (data) => {
    return axiosInstance.post(`/events/addEvents`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const updateEvent = async (id, data) => {
    return axiosInstance.put(`/events/updateEvent/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};



export const fetchImages = async (eventId) => {
    return axiosInstance.get(`/images/getEventImages/${eventId}`);
};

export const updateImageStatus = async (imageId, status) => {
    return axiosInstance.put(`/images/updateEventImageStatus/${imageId}`, { status });
};

export const deleteImage = async (imageId, imagePath) => {
    return axiosInstance.delete(`/images/deleteEventImage/${imageId}`, { data: { imagePath } });
};
