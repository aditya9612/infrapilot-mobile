import { api } from './api';

export const reportService = {
    // Generate Report
    generateReport: async (data: any) => {
        try {
            const response = await api.post('/reports/generate', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get Project Reports
    getProjectReports: async (projectId: string) => {
        try {
            const response = await api.get(`/reports/projects/${projectId}`);
            return response.data?.data || response.data || [];
        } catch (error) {
            console.error('Error fetching project reports:', error);
            return [];
        }
    },

    // Export Report
    exportReport: async (id: string, format: string = 'pdf') => {
        try {
            const response = await api.get(`/reports/${id}/export`, { 
                params: { format },
                responseType: 'blob' 
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
