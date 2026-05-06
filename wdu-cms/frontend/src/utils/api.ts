/// <reference types="vite/client" />
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});


// Add Interceptor for Auth Token
api.interceptors.request.use((config) => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    }
  } catch (error) {
    console.error('Error reading auth token from storage:', error);
  }
  return config;
});

// Add Interceptor for Response Errors (e.g. Expired Token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      localStorage.removeItem('auth-storage');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);


export default api;
