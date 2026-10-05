import { api } from './api';

export interface CreateApprovalPayload {
    project_id: number | string;
    approval_type?: string;
    remarks: string;
    reference_id?: number | string;
    status?: string;
}

export const approvalService = {
    getApprovals: async (params?: { project_id?: number; status?: string; limit?: number; skip?: number }) => {
        const response = await api.get('/approvals', { params });
        return response.data;
    },

    createApproval: async (payload: CreateApprovalPayload) => {
        const response = await api.post('/approvals', payload);
        return response.data;
    },

    approve: async (id: number | string) => {
        try {
            const response = await api.put(`/approvals/${id}/approve`);
            return response.data;
        } catch (error: any) {
            const response = await api.post(`/approvals/${id}/approve`);
            return response.data;
        }
    },

    reject: async (id: number | string) => {
        try {
            const response = await api.put(`/approvals/${id}/reject`);
            return response.data;
        } catch (error: any) {
            const response = await api.post(`/approvals/${id}/reject`);
            return response.data;
        }
    }
};
