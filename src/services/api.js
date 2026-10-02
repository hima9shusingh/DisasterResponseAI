import axios from 'axios';
import { getToken, clearAuth } from '../utils/authStorage.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const isAuthCheck = originalRequest.url?.includes('/auth/me');
      const msg = error.response.data?.message?.toLowerCase() || '';
      const isTokenError = msg.includes('token') || 
                           msg.includes('authentication required') ||
                           msg.includes('user no longer exists') ||
                           msg.includes('account is inactive');
                           
      if (isAuthCheck || isTokenError) {
        clearAuth();
      }
      // We do not force redirect here to avoid breaking static navigation.
      // The calling components will receive the 401 and handle UI state.
    }

    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error) => {
  if (error.response?.data) {
    let msg = error.response.data.message || 'Error occurred';
    if (error.response.data.errors && Object.keys(error.response.data.errors).length > 0) {
      msg += ': ' + Object.values(error.response.data.errors).join(', ');
    }
    return msg;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.warn('Backend is currently unreachable:', getApiErrorMessage(error));
    throw error;
  }
};

export default api;
