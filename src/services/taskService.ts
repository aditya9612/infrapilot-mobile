import { api } from './api';

export interface TaskSummary {
    total_tasks: number;
    planned: number;
    in_progress: number;
    completed: number;
    cancelled: number;
}

export const taskService = {
    getTasks: async (projectId?: number, params?: any) => {
        if (!projectId) return [];
        try {
            const response = await api.get(`/projects/${projectId}/tasks`, { params }).catch(() => null);
            if (!response || !response.data) {
                const altResponse = await api.get('/tasks', { params: { project_id: projectId, ...params } }).catch(() => null);
                return altResponse?.data || [];
            }
            return response.data;
        } catch (error) {
            return [];
        }
    },
    
    getTaskSummary: async (projectId?: number) => {
        if (!projectId) return null;
        try {
            const response = await api.get(`/projects/${projectId}/tasks`, { params: { limit: 1000 } }).catch(() => null);
            const tasks = response?.data?.items || response?.data || [];
            
            return {
                total_tasks: tasks.length,
                planned: tasks.filter((t: any) => t.status === 'Planned').length,
                in_progress: tasks.filter((t: any) => t.status === 'In Progress').length,
                completed: tasks.filter((t: any) => t.status === 'Completed').length,
                cancelled: tasks.filter((t: any) => t.status === 'Cancelled').length,
            };
        } catch (error) {
            return null;
        }
    },

    getTaskRequests: async (projectId?: number, params?: any) => {
        if (!projectId) return [];
        try {
            const response = await api.get(`/projects/${projectId}/tasks`, { 
                params: { ...params, view: 'requests' } 
            }).catch(() => null);
            return response?.data || [];
        } catch (error) {
            return [];
        }
    }
};

export default taskService;
