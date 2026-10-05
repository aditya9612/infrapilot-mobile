import { api } from './api';

export const payrollService = {
    getActivePayroll: async (projectId?: number) => {
        const response = await api.get('/labour/payroll', { params: { project_id: projectId } });
        return response.data;
    },
    getContractorLiability: async (projectId?: number) => {
        const response = await api.get('/labour/payroll/contractor-liability', { params: { project_id: projectId } });
        return response.data;
    },
    getWeeklyVelocity: async (projectId?: number) => {
        const response = await api.get('/labour/payroll/weekly-velocity', { params: { project_id: projectId } });
        return response.data;
    },
    getDisbursementHistory: async (projectId?: number) => {
        const response = await api.get('/labour/payroll/disbursement-history', { params: { project_id: projectId } });
        return response.data;
    }
};
