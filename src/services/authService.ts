import { api } from './api';

export const authService = {
    requestOtp: async (mobileNumber: string) => {
        try {
            const response = await api.post('/auth/request-otp', { mobileNumber });
            return response.data;
        } catch (error) {
            console.error('Error in requestOtp:', error);
            throw error;
        }
    },

    verifyOtp: async (mobileNumber: string, otp: string) => {
        try {
            const response = await api.post('/auth/verify-otp', { mobileNumber, otp });
            return response.data;
        } catch (error) {
            console.error('Error in verifyOtp:', error);
            throw error;
        }
    }
};
