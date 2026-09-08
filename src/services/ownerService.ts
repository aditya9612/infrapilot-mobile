import { api } from './api';

export const ownerService = {
    getOwners: async () => {
        try {
            const response = await api.get('/owners');
            return response.data;
        } catch (error) {
            console.error('Error fetching owners:', error);
            throw error;
        }
    }
};
