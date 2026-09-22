import { api } from './api';

export const equipmentService = {
    // KPI & Dashboard
    getKpi: async (projectId?: number) => {
        const response = await api.get('/equipment/kpi', { params: { project_id: projectId } });
        return response.data;
    },
    getMaintenanceAlerts: async (projectId?: number) => {
        const response = await api.get('/equipment/alerts/maintenance', { params: { project_id: projectId } });
        return response.data;
    },

    // Equipment List
    getEquipmentList: async (projectId?: number) => {
        const response = await api.get('/equipment', { params: { project_id: projectId } });
        return response.data;
    },
    
    // Usage
    getUsageReport: async (projectId?: number) => {
        const response = await api.get('/equipment/usage/report', { params: { project_id: projectId } });
        return response.data;
    },
    getUsageList: async (projectId?: number) => {
        const response = await api.get('/equipment/usage', { params: { project_id: projectId } });
        return response.data;
    },

    // Transfer
    getTransferHistory: async (projectId?: number) => {
        const response = await api.get('/equipment/transfer-history', { params: { project_id: projectId } });
        return response.data;
    },

    // Maintenance
    getMaintenanceList: async (projectId?: number) => {
        const response = await api.get('/equipment/maintenance', { params: { project_id: projectId } });
        return response.data;
    },

    // Rental
    getRentalList: async (projectId?: number) => {
        const response = await api.get('/equipment/rental', { params: { project_id: projectId } });
        return response.data;
    },

    // Purchase
    getPurchaseList: async (projectId?: number) => {
        const response = await api.get('/equipment/purchase', { params: { project_id: projectId } });
        return response.data;
    },

    // Reports
    getUtilizationReport: async (projectId?: number) => {
        const response = await api.get('/equipment/utilization', { params: { project_id: projectId } });
        return response.data;
    },
    getCostReport: async (projectId?: number) => {
        const response = await api.get('/equipment/cost-report', { params: { project_id: projectId } });
        return response.data;
    },
    getPurchaseReport: async (projectId?: number) => {
        const response = await api.get('/equipment/purchase/report', { params: { project_id: projectId } });
        return response.data;
    },
    getAvailabilityReport: async (projectId?: number) => {
        const response = await api.get('/equipment/availability', { params: { project_id: projectId } });
        return response.data;
    }
};
