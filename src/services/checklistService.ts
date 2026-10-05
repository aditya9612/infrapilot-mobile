import api from './api';

export const checklistService = {
    getChecklists: async (projectId?: number) => {
        const response = await api.get('/checklists', { params: { project_id: projectId } });
        return response.data;
    },
    getChecklistLogs: async (projectId?: number) => {
        const response = await api.get('/checklists/logs', { params: { project_id: projectId } });
        return response.data;
    },
};
