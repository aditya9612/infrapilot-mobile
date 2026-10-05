import { api } from './api';

export interface MaterialOverview {
  id: string;
  name: string;
  stock: number;
  rate: string;
  total: string;
}

export interface GlobalInventory {
  id: string;
  name: string;
  stock: number;
  stockColor: string;
  unit: string;
  rate: string;
  total: string;
}

export interface MaterialReport {
  id: string;
  name: string;
  purchased: number;
  used: number;
  remaining: number;
  cost: string;
  pending: string;
  alert: string;
}

export interface MaterialAdjustment {
  id: string;
  date: string;
  name: string;
  type: string;
  qtyChange: string;
  qtyColor: string;
  rate: string;
  reason: string;
}

const pid = (projectId: number | null | undefined) => projectId ?? undefined;

export const materialService = {
  getSummary: async (projectId?: number | null): Promise<any> => {
    const response = await api.get('/materials/summary', { params: { project_id: pid(projectId) } });
    return response.data;
  },

  getStockOverview: async (projectId?: number | null): Promise<any> => {
    const response = await api.get(`/materials/inventory`, { params: { project_id: pid(projectId) } });
    return response.data;
  },

  getGlobalInventory: async (): Promise<any> => {
    const response = await api.get(`/materials/inventory`);
    return response.data;
  },

  getReports: async (projectId?: number | null): Promise<any> => {
    const response = await api.get(`/materials/reports`, { params: { project_id: pid(projectId) } });
    return response.data;
  },

  getTransactions: async (projectId?: number | null): Promise<any> => {
    const response = await api.get(`/materials/transactions`, { params: { project_id: pid(projectId) } });
    return response.data;
  },

  getMasterMaterials: async (projectId?: number | null): Promise<any> => {
    const response = await api.get(`/master/materials`, { params: { project_id: pid(projectId) } });
    return response.data;
  },

  getSuppliers: async (projectId?: number | null): Promise<any> => {
    const response = await api.get(`/materials/suppliers`, { params: { project_id: pid(projectId) } });
    return response.data;
  },

  getPurchaseOrders: async (projectId?: number | null): Promise<any> => {
    const response = await api.get(`/materials/purchase-orders`, { params: { project_id: pid(projectId) } });
    return response.data;
  },

  getAlerts: async (projectId?: number | null): Promise<any> => {
    const response = await api.get(`/materials/alerts`, { params: { project_id: pid(projectId) } });
    return response.data;
  },

  getTransfers: async (projectId?: number | null): Promise<any> => {
    const response = await api.get(`/materials/transfers`, { params: { project_id: pid(projectId) } });
    return response.data;
  },
};
