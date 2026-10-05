import { api } from './api';
import type {
  ActivityItem,
  CreateActivityRequest,
  UpdateActivityRequest,
  DailyProgressItem,
  CreateDailyProgressRequest,
  WorkOrderItem,
  CreateWorkOrderRequest,
} from '../types/workProgress';

export const workProgressService = {
  // ── WORK ORDERS ─────────────────────────────────────────────────────────────
  getWorkOrders: async (projectId?: number | string) => {
    const response = await api.get('/work-orders', { params: { project_id: projectId } });
    return response?.data ?? response;
  },

  createWorkOrder: async (data: CreateWorkOrderRequest): Promise<WorkOrderItem> => {
    const response = await api.post('/work-orders', data);
    return response?.data ?? response;
  },

  updateWorkOrder: async (id: number | string, data: Partial<CreateWorkOrderRequest>): Promise<WorkOrderItem> => {
    const response = await api.put(`/work-orders/${id}`, data);
    return response?.data ?? response;
  },

  deleteWorkOrder: async (id: number | string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/work-orders/${id}`);
    return response?.data ?? response;
  },

  // ── MASTER DATA ─────────────────────────────────────────────────────────────
  getActivityTypes: async () => {
    const response = await api.get('/master/activity-types');
    return response?.data ?? response;
  },

  // ── ACTIVITIES ──────────────────────────────────────────────────────────────
  getActivities: async (projectId?: number | string, limit: number = 100, offset: number = 0) => {
    const response = await api.get('/work-progress/activities', { params: { project_id: projectId, limit, offset } });
    return response?.data ?? response;
  },

  getActivityById: async (id: number | string): Promise<ActivityItem> => {
    const response = await api.get(`/work-progress/activities/${id}`);
    return response?.data ?? response;
  },

  createActivity: async (data: CreateActivityRequest): Promise<ActivityItem> => {
    const response = await api.post('/work-progress/activities', data);
    return response?.data ?? response;
  },

  updateActivity: async (id: number | string, data: UpdateActivityRequest): Promise<ActivityItem> => {
    const response = await api.put(`/work-progress/activities/${id}`, data);
    return response?.data ?? response;
  },

  deleteActivity: async (id: number | string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/work-progress/activities/${id}`);
    return response?.data ?? response;
  },

  // ── DAILY PROGRESS ENTRIES ──────────────────────────────────────────────────
  getDailyEntries: async (projectId?: number | string) => {
    const response = await api.get('/work-progress/daily-entry', { params: { project_id: projectId } });
    return response?.data ?? response;
  },

  createDailyEntry: async (data: CreateDailyProgressRequest): Promise<DailyProgressItem> => {
    const response = await api.post('/work-progress/daily-entry', data);
    return response?.data ?? response;
  },

  deleteDailyEntry: async (id: number | string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/work-progress/daily-entry/${id}`);
    return response?.data ?? response;
  },

  getTodayProgress: async (projectId?: number | string) => {
    const response = await api.get('/work-progress/site-engineer/today-progress', { params: { project_id: projectId } });
    return response?.data ?? response;
  },

  getProgressHistory: async (projectId?: number | string, limit: number = 100) => {
    const response = await api.get('/work-progress/progress-history', { params: { project_id: projectId, limit } });
    return response?.data ?? response;
  },

  getProjectSummary: async (projectId: number | string) => {
    const response = await api.get(`/work-progress/project/${projectId}/summary`);
    return response?.data ?? response;
  },

  getDelayedActivities: async (projectId: number | string, limit: number = 100) => {
    const response = await api.get(`/work-progress/project/${projectId}/delayed-activities`, { params: { limit } });
    return response?.data ?? response;
  },

  getWorkOrderProgressSummary: async (workOrderId: number | string) => {
    const response = await api.get(`/work-progress/work-order/${workOrderId}/progress-summary`);
    return response?.data ?? response;
  },

  // ── EXPORTS & REPORTS ───────────────────────────────────────────────────────
  exportPdf: async (params: { project_id?: number | string; type?: string }) => {
    const response = await api.get(`/work-progress/export/pdf`, {
      params,
      responseType: 'blob',
    });
    return response?.data ?? response;
  },

  exportExcel: async (params: { project_id?: number | string; type?: string }) => {
    const response = await api.get(`/work-progress/export/excel`, {
      params,
      responseType: 'blob',
    });
    return response?.data ?? response;
  },

  getPdfReport: async (projectId?: number | string) => {
    const response = await api.get('/work-progress/reports/pdf', {
      params: projectId ? { project_id: projectId } : {},
      responseType: 'blob',
    });
    return response?.data ?? response;
  },

  getExcelReport: async (projectId?: number | string) => {
    const response = await api.get('/work-progress/reports/excel', {
      params: projectId ? { project_id: projectId } : {},
      responseType: 'blob',
    });
    return response?.data ?? response;
  },
};

export default workProgressService;
