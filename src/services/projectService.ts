import { api } from './api';

export interface Project {
    id: number;
    name: string;
    description?: string;
    status?: string;
}

export const projectService = {
    getProjects: async (): Promise<Project[]> => {
        try {
            const response = await api.get('/projects');
            return response.data;
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }
};
