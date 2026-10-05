import { api } from './api';

export const qualityService = {
    getInspections: async (projectId?: number) => {
        const response = await api.get('/qc/inspections', { params: { project_id: projectId } });
        return response.data;
    },
    
    getReports: async (projectId?: number) => {
        const response = await api.get('/qc/reports', { params: { project_id: projectId } });
        return response.data;
    },
    
    getDashboardStats: async (projectId?: number) => {
        const response = await api.get('/qc/stats', { params: { project_id: projectId } });
        return response.data;
    }
};
