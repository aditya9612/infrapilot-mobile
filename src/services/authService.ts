import { api } from './api';

export const authService = {
    login: async (mobileNumber: string) => {
        try {
            const response = await api.post('/auth/login', { mobile: mobileNumber });
            return response.data;
        } catch (error: any) {
            console.error('Error in login:', error.response?.data || error.message);
            throw error;
        }
    },

    verifyOtp: async (mobileNumber: string, otp: string) => {
        try {
            const response = await api.post('/auth/verify_otp', { mobile: mobileNumber, otp });
            return response.data;
        } catch (error: any) {
            console.error('Error in verifyOtp:', error.response?.data || error.message);
            throw error;
        }
    }
};
