import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://zosh-bazzar-backend.onrender.com"
  : "http://localhost:5454";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login on auth errors
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);