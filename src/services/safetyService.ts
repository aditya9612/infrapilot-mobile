import { api } from './api';

export const safetyService = {
    getIncidents: async (projectId?: number) => {
        const response = await api.get('/safety', { params: { project_id: projectId } });
        return response.data;
    },
    
    getIncidentStats: async (projectId?: number) => {
        const response = await api.get('/safety/stats', { params: { project_id: projectId } });
        return response.data;
    },

    getSafetyAudits: async (projectId?: number) => {
        const response = await api.get('/safety/audits', { params: { project_id: projectId } });
        return response.data;
    }
};
