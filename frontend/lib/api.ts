import axios from 'axios';

const api = axios.create({
    baseURL: 'https://rejoice-decor-and-event.onrender.com/api',
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
