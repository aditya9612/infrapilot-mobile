import { api } from './api';
import { projectService } from './projectService';
import type { IssueItem, CreateIssueRequest, UpdateIssueRequest } from '../types/issue';

export const issueService = {
  // GET /issues (Fetch all issues for all projects)
  getAllIssues: async (projectsList?: any[]): Promise<IssueItem[]> => {
    let directList: IssueItem[] = [];
    try {
      const response = await api.get('/issues', { params: { limit: 1000 } });
      const data = response?.data;
      if (Array.isArray(data)) directList = data;
      else if (Array.isArray(data?.data)) directList = data.data;
      else if (Array.isArray(data?.items)) directList = data.items;
      else if (Array.isArray(data?.issues)) directList = data.issues;
    } catch (err) {
      console.warn('Direct GET /issues call error, falling back to per-project fetch:', err);
    }

    try {
      let targetProjects = projectsList;
      if (!targetProjects || targetProjects.length === 0) {
        targetProjects = await projectService.getProjects().catch(() => []);
      }

      if (targetProjects && targetProjects.length > 0) {
        const promises = targetProjects.map(p => {
          const pid = p.id ?? (p as any).project_id;
          return issueService.getIssuesByProject(pid).catch(() => []);
        });
        const results = await Promise.all(promises);
        const combined = [...directList, ...results.flat()];
        const uniqueMap = new Map();
        combined.forEach(item => {
          if (item) {
            const key = item.id !== undefined ? String(item.id) : `${item.project_id}_${item.title}`;
            uniqueMap.set(key, item);
          }
        });
        return Array.from(uniqueMap.values());
      }
    } catch (error) {
      console.error('Error fetching per-project issues fallback:', error);
    }

    return directList;
  },

  // GET /issues/project/{project_id}
  getIssuesByProject: async (projectId: number | string): Promise<IssueItem[]> => {
    try {
      const response = await api.get(`/issues/project/${projectId}`, { params: { limit: 1000 } });
      const data = response?.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.items)) return data.items;
      if (Array.isArray(data?.issues)) return data.issues;
      return [];
    } catch (error) {
      console.error('Error fetching project issues:', error);
      try {
        const fallbackRes = await api.get('/issues', { params: { project_id: projectId, limit: 1000 } });
        const d = fallbackRes?.data;
        if (Array.isArray(d)) return d;
        if (Array.isArray(d?.data)) return d.data;
        if (Array.isArray(d?.items)) return d.items;
        if (Array.isArray(d?.issues)) return d.issues;
        return [];
      } catch (err) {
        return [];
      }
    }
  },

  // GET /issues/{id}
  getIssueById: async (id: number | string): Promise<IssueItem | null> => {
    try {
      const response = await api.get(`/issues/${id}`);
      return response?.data?.data || response?.data || null;
    } catch (error) {
      console.error('Error fetching issue by id:', error);
      return null;
    }
  },

  // POST /issues
  createIssue: async (data: CreateIssueRequest): Promise<IssueItem> => {
    const response = await api.post('/issues', data);
    return response?.data?.data || response?.data;
  },

  // PUT /issues/{id}
  updateIssue: async (id: number | string, data: UpdateIssueRequest): Promise<IssueItem> => {
    const response = await api.put(`/issues/${id}`, data);
    return response?.data?.data || response?.data;
  },

  // DELETE /issues/{id}
  deleteIssue: async (id: number | string): Promise<{ success: boolean }> => {
    try {
      const response = await api.delete(`/issues/${id}`);
      return response?.data || { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  // GET /reports/issues/pdf
  exportPdfReport: async (params: { project_id?: number | string; status?: string; priority?: string; start_date?: string; end_date?: string }) => {
    const response = await api.get('/reports/issues/pdf', {
      params,
      responseType: 'blob',
    });
    return response?.data ?? response;
  },

  // GET /reports/issues/excel
  exportExcelReport: async (params: { project_id?: number | string; status?: string; priority?: string; start_date?: string; end_date?: string }) => {
    const response = await api.get('/reports/issues/excel', {
      params,
      responseType: 'blob',
    });
    return response?.data ?? response;
  }
};

export default issueService;
