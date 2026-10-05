import { api } from './api';

export interface CreateSiteRequestPayload {
    project_id: number | string;
    resource_type?: string;
    description: string;
    quantity: number | string;
    unit?: string;
    status?: string;
}

export const siteRequestService = {
    getRequests: async (params?: { project_id?: number; status?: string; limit?: number; skip?: number }) => {
        const response = await api.get('/site-requests', { params });
        return response.data;
    },

    createRequest: async (payload: CreateSiteRequestPayload) => {
        const response = await api.post('/site-requests', payload);
        return response.data;
    },

    approveRequest: async (id: number | string) => {
        try {
            const response = await api.put(`/site-requests/${id}/approve`);
            return response.data;
        } catch (error: any) {
            const response = await api.post(`/site-requests/${id}/approve`);
            return response.data;
        }
    },

    rejectRequest: async (id: number | string) => {
        try {
            const response = await api.put(`/site-requests/${id}/reject`);
            return response.data;
        } catch (error: any) {
            const response = await api.post(`/site-requests/${id}/reject`);
            return response.data;
        }
    }
};
