import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api-testing.infrapilot.in/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

import * as SecureStore from 'expo-secure-store';

// Interceptor to inject JWT token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error fetching token for request:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
