import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api-testing.infrapilot.in/api/v1';

let authToken: string | null = null;

export const loadAuthToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('authToken');
        authToken = token;
        return token;
    } catch (e) {
        return null;
    }
};

export const setAuthToken = async (token: string | null) => {
    authToken = token;
    try {
        if (token) {
            await SecureStore.setItemAsync('authToken', token);
        } else {
            await SecureStore.deleteItemAsync('authToken');
        }
    } catch (e) {
        console.error("Failed to save auth token", e);
    }
};

export const getAuthToken = () => authToken;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to inject JWT token into requests
api.interceptors.request.use(
    async (config) => {
        let currentToken = authToken;
        if (!currentToken) {
            currentToken = await loadAuthToken();
        }
        
        if (currentToken) {
            config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle 401 Unauthorized responses
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            await setAuthToken(null);
            try {
                router.replace('/');
            } catch (e) {
                console.warn('Could not redirect to login page');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
