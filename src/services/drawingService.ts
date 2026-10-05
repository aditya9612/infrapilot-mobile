import { api } from './api';

export const drawingService = {
    getDrawings: async (projectId?: number) => {
        const response = await api.get('/drawings', { params: { project_id: projectId } });
        return response.data;
    },
    getDocuments: async (projectId?: number) => {
        const response = await api.get('/documents', { params: { project_id: projectId } });
        return response.data;
    },
    getDrawingFolders: async (projectId?: number) => {
        const response = await api.get('/drawings/folders', { params: { project_id: projectId } });
        return response.data;
    },
    getDocumentFolders: async (projectId?: number) => {
        const response = await api.get('/documents/folders', { params: { project_id: projectId } });
        return response.data;
    },
    getDocumentStats: async (projectId?: number) => {
        const response = await api.get('/documents/stats', { params: { project_id: projectId } });
        return response.data;
    }
};
