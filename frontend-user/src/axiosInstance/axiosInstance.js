import axios from 'axios';
import { signatureLevelEnum } from '../enum.js';
const BaseUrl = 'http://localhost:3000';
// Create axios instance
const api = axios.create({
    baseURL: BaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token management
let accessToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor to add access token
api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `${signatureLevelEnum.user} ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                // If already refreshing, add to queue
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `${signatureLevelEnum.user} ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call refresh token endpoint
                const response = await axios.post('/auth/refresh-token', {},{
                    headers: {
                        Authorization: `${signatureLevelEnum.user} ${refreshToken}`
                    }
                });

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

                // Update tokens
                accessToken = newAccessToken;
                refreshToken = newRefreshToken;

                // Store in localStorage (or your preferred storage)
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // Update authorization header
                api.defaults.headers.common.Authorization = `${signatureLevelEnum.user} ${newAccessToken}`;

                // Process queued requests
                processQueue(null, newAccessToken);

                // Retry original request
                originalRequest.headers.Authorization = `${signatureLevelEnum.user} ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh failed - clear tokens and redirect to login
                processQueue(refreshError, null);
                clearTokens();
                window.location.href = '/login'; // Redirect to login
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// Helper functions
export const setTokens = (newAccessToken, newRefreshToken) => {
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    api.defaults.headers.common.Authorization = `${signatureLevelEnum.user} ${newAccessToken}`;
};

export const clearTokens = () => {
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common.Authorization;
};

export const getAccessToken = () => accessToken;
export const getRefreshToken = () => refreshToken;

export default api;