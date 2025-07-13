import axios from 'axios';
import './axiosInterceptor';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

export default api;
