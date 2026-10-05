import { api } from './api';

export interface Alert {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt?: string;
}

export const alertService = {
    // List Alerts
    getAlerts: async (): Promise<Alert[]> => {
        try {
            const response = await api.get('/alerts');
            return response.data?.data || response.data || [];
        } catch (error) {
            console.error('Error fetching alerts:', error);
            return [];
        }
    },

    // Get Unread Count
    getUnreadCount: async (): Promise<number> => {
        try {
            const response = await api.get('/alerts/unread-count');
            return response.data?.count || response.data || 0;
        } catch (error) {
            return 0;
        }
    },

    // Mark as Read
    markAsRead: async (id: string) => {
        try {
            const response = await api.put(`/alerts/${id}/read`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Mark All as Read
    markAllAsRead: async () => {
        try {
            const response = await api.put('/alerts/read-all');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
