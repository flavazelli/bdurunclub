import axios from 'axios'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

// Base URL for the API
const BASE_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:3000/api/'

// Create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
})

// Rate limiting and throttling
let isThrottled = false

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  async (config) => {
    if (isThrottled) {
      return Promise.reject({ message: 'Too many requests. Please try again later.' })
    }
    config.withCredentials = true
    const token = Cookies.get('jwt') // Get token from cookie
    if (token) {
      config.headers.Authorization = `JWT ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle responses and errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle unauthorized/unauthenticated errors
    const token = Cookies.get('jwt') // Get JWT token from cookie
    const decoded = jwtDecode(token)
    if (
      token &&
      decoded.exp &&
      new Date() > new Date(decoded.exp + 60) &&
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        // Refresh the token
        const response = await axios.post(`${BASE_URL}/users/refresh-token`)

        const newToken = response.data.refreshedToken
        // Update the JWT cookie and expiration
        // Set the JWT token in a cookie with the Secure flag
        Cookies.set('jwt', newToken, {
          path: '/',
          secure: process.env.NODE_ENV === 'production', // Secure only in production
          sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax', // Strict in production, Lax otherwise
          expires: new Date(response.data.exp * 1000), // Convert timestamp to a Date object
        })

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `JWT ${newToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Handle refresh token failure
        return Promise.reject(refreshError)
      }
    } else if (error.response && error.response.status === 401) {
      Cookies.remove('jwt')
    }

    // Handle rate limiting
    if (error.response && error.response.status === 429) {
      isThrottled = true
      setTimeout(() => {
        isThrottled = false
      }, 60000) // Throttle for 1 minute
    }

    return Promise.reject(error)
  },
)

export default apiClient
