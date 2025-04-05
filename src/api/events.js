import apiClient from './setup';

export const getEvents = async () => {
    const response = await apiClient.get('/events');
    return response;
};

export const getEvent = async (id) => {
    const response = await apiClient.get(`/events/${id}`);
    return response;
};