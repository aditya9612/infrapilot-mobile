import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api-testing.infrapilot.in/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to inject JWT token in the future
api.interceptors.request.use(
    async (config) => {
        // const token = await SecureStore.getItemAsync('userToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
