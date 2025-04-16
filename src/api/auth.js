import apiClient from './setup';
import Cookies from 'js-cookie';

export const login = async (email, password) => {
    const response = await apiClient.post('/users/login', {
        email,
        password,
    });

    if (response.data.token) {
        // Set the JWT token in a cookie with the Secure flag
        Cookies.set('jwt', response.data.token, {
          path: '/',
          secure: process.env.NODE_ENV === 'production', // Secure only in production
          sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax', // Strict in production, Lax otherwise
          expires: new Date(response.data.exp * 1000) // Convert timestamp to a Date object
        });
    }

    return response;
};

export const logout = async () => {
    const response = await apiClient.post('/users/logout');
    Cookies.remove('jwt');
    return response;
};

export const signup = async (firstName, lastName, email, password) => {
    const response = await apiClient.post('/users', { firstName, lastName, email, password, roles: ["member"] });
    return response;
};

export const verifyEmail = async (token) => {
    const response = await apiClient.post(`/users/verify/${token}`);
    return response;
};

export const forgotPassword = async (email) => {
    const response = await apiClient.post('/users/forgot-password', { email });

    return response;
};

export const resetPassword = async (token, password) => {
    const response = await apiClient.post('/users/forgot-password', { token, password });
    return response;
};

export const getLoggedInUser = async () => {
    const response = await apiClient.get('/users/me');
    return response;
};

export const updateUser = async (userId, userData) => {
    const response = await apiClient.patch(`/users/${userId}`, userData);
    return response;
}