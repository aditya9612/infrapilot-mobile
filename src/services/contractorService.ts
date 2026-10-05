import { api } from './api';

export interface Contractor {
    id: string;
    name: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    status: string;
}

export const contractorService = {
    // List Contractors
    getContractors: async (params?: any): Promise<Contractor[]> => {
        try {
            const response = await api.get('/contractors', { params });
            return response.data?.data || response.data || [];
        } catch (error) {
            console.error('Error fetching contractors:', error);
            return [];
        }
    },

    // Get Contractors by Project
    getContractorsByProject: async (projectId: string): Promise<Contractor[]> => {
        try {
            const response = await api.get(`/contractors/projects/${projectId}`);
            return response.data?.data || response.data || [];
        } catch (error) {
            console.error('Error fetching project contractors:', error);
            return [];
        }
    },

    // Get Contractor by ID
    getContractorById: async (id: string): Promise<Contractor | null> => {
        try {
            const response = await api.get(`/contractors/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('Error fetching contractor details:', error);
            return null;
        }
    },

    // Create Contractor
    createContractor: async (data: any) => {
        try {
            const response = await api.post('/contractors/create', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update Contractor
    updateContractor: async (id: string, data: any) => {
        try {
            const response = await api.put(`/contractors/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update Contractor Status
    updateContractorStatus: async (id: string, status: string) => {
        try {
            const response = await api.put(`/contractors/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get Contractor Finances
    getContractorFinances: async (id: string) => {
        try {
            const response = await api.get(`/contractors/${id}/finances`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('Error fetching contractor finances:', error);
            return null;
        }
    }
};
