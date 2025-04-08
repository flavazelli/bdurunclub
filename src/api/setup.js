import axios from 'axios';
import Cookies from 'js-cookie';

// Base URL for the API
const BASE_URL = 'http://localhost:3000/api';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds timeout
});

// Rate limiting and throttling
let isThrottled = false;

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
    async (config) => {
        if (isThrottled) {
            return Promise.reject({ message: 'Too many requests. Please try again later.' });
        }
        config.withCredentials = true;
        const token = Cookies.get('jwt'); // Get token from cookie
        if (token) {
            config.headers.Authorization = `JWT ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle responses and errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle unauthorized/unauthenticated errors
        const token = Cookies.get('jwt') // Get JWT token from cookie
        const tokenExpiration = Cookies.get('exp'); // Get token expiration from cookie
        if (token && tokenExpiration && new Date() > new Date(tokenExpiration + 60) && error.response && error.response.status === 401 && !originalRequest._retry) {
            
            originalRequest._retry = true;

            try {
                // Refresh the token
                const response = await axios.post(`${BASE_URL}/users/refresh-token`);

                const newToken = response.data.refreshedToken;
                const newExpiration = response.data.exp;

                // Update the JWT cookie and expiration
                Cookies.set('jwt', newToken, { expires: new Date(newExpiration) });
                Cookies.set('exp', newExpiration, { expires: new Date(newExpiration) });

               // Retry the original request with the new token
                originalRequest.headers.Authorization = `JWT ${newToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Handle refresh token failure
                return Promise.reject(refreshError);
                
            }
        } else if (error.response && error.response.status === 401) {
            Cookies.remove('jwt');
            Cookies.remove('exp')
        }

        // Handle rate limiting
        if (error.response && error.response.status === 429) {
            isThrottled = true;
            setTimeout(() => {
                isThrottled = false;
            }, 60000); // Throttle for 1 minute
        }

        return Promise.reject(error);
    }
);

export default apiClient;