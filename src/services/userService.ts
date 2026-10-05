import { api } from './api';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    phoneNumber?: string;
    createdAt?: string;
}

export const userService = {
    // List Users
    getUsers: async (params?: any): Promise<User[]> => {
        try {
            const response = await api.get('/users', { params });
            return response.data?.data || response.data || [];
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    },

    // Get current user profile
    getMe: async (): Promise<User | null> => {
        try {
            const response = await api.get('/users/me');
            return response.data?.data || response.data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    },

    // Create User
    createUser: async (userData: any) => {
        try {
            const response = await api.post('/users/create', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get Roles
    getRoles: async () => {
        try {
            const response = await api.get('/users/roles');
            return response.data?.data || response.data || [];
        } catch (error) {
            console.error('Error fetching roles:', error);
            return [];
        }
    },

    // Update Role Status
    updateRoleStatus: async (role: string, status: string) => {
        try {
            const response = await api.put(`/users/roles/${role}/status`, { status });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
