import { api } from './api';

export interface NotificationItem {
    id: number;
    title: string;
    message: string;
    type: string;
    link: string | null;
    user_id: number;
    is_read: boolean;
    created_at: string;
    read_at: string | null;
}

export const notificationService = {
    getNotifications: async (): Promise<NotificationItem[]> => {
        try {
            const response = await api.get('/notifications');
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    }
};
