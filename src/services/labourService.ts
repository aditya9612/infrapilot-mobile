import { api } from './api';

export const labourService = {
    // Stats
    getDashboardStats: async (projectId?: number) => {
        const response = await api.get('/labour/dashboard/stats', { params: { project_id: projectId } });
        return response.data;
    },
    
    getAttendanceDashboard: async (projectId?: number) => {
        const response = await api.get('/labour/attendance/dashboard', { params: { project_id: projectId } });
        return response.data;
    },

    getSkillSummary: async (projectId?: number) => {
        const response = await api.get('/labour/summary/skill', { params: { project_id: projectId } });
        return response.data;
    },

    // Personnel
    getLabourList: async (projectId?: number) => {
        const response = await api.get('/labour', { params: { project_id: projectId } });
        return response.data;
    },

    getLabourTypes: async () => {
        const response = await api.get('/master/labour-types');
        return response.data;
    },

    // Attendance
    getAttendanceList: async (projectId?: number) => {
        const response = await api.get('/attendance/list', { params: { project_id: projectId } });
        return response.data;
    },

    getTodayStatus: async (projectId?: number) => {
        const response = await api.get('/attendance/today', { params: { project_id: projectId } });
        return response.data;
    },
    
    // Payroll & Wages
    getPayrollStats: async (projectId?: number) => {
        const response = await api.get('/labour/payroll/stats', { params: { project_id: projectId } });
        return response.data;
    },

    getPayrollList: async (projectId?: number) => {
        const response = await api.get('/labour/payroll', { params: { project_id: projectId } });
        return response.data;
    },

    getWageStats: async (projectId?: number) => {
        const response = await api.get('/labour/wages/stats', { params: { project_id: projectId } });
        return response.data;
    },

    getWagesList: async (projectId?: number) => {
        const response = await api.get('/labour/wages', { params: { project_id: projectId } });
        return response.data;
    }
};
