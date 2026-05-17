import Axios from 'axios';
import { API_BASE_URL } from '../config';

/**
 * Cliente HTTP de la API — instancia Axios con baseURL y Bearer token
 *
 * Añade automáticamente Authorization desde localStorage (auth_token) en cada petición.
 */
const axios = Axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axios;