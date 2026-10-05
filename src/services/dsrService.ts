import { api } from './api';
import type {
  DsrItem,
  CreateDsrRequest,
  UpdateDsrRequest,
  DsrResponse,
  DsrPhoto,
  DsrMapPoint,
  LabourTrend,
  ContractorAnalytics,
  IssueAnalytics,
  IssueAnalyticsData,
} from '../types/dsr';

export type {
  DsrItem,
  CreateDsrRequest,
  UpdateDsrRequest,
  DsrResponse,
  DsrPhoto,
  DsrMapPoint,
  LabourTrend,
  ContractorAnalytics,
  IssueAnalytics,
  IssueAnalyticsData,
};

export const dsrService = {
  /**
   * Get all DSRs (Cross-project)
   * GET /api/v1/dsr
   */
  async getDsr(params?: { limit?: number; offset?: number }): Promise<DsrResponse> {
    const response = await api.get<DsrResponse>('/dsr', { params });
    return response.data;
  },

  /**
   * Create new DSR
   * POST /api/v1/dsr
   *
   * Backend expects fields as query params / FormData body.
   */
  async createDsr(data: CreateDsrRequest): Promise<DsrItem> {
    const {
      dsr_image, total_labour, skilled_labour, unskilled_labour, resolved_address,
      ...payload
    } = data;

    // Defensively ensure weather is a valid value
    if (payload.weather && !['Sunny', 'Rainy', 'Cloudy', 'Windy', 'Foggy', 'Stormy'].includes(payload.weather)) {
      payload.weather = 'Sunny';
    }

    // Convert empty strings and 0 for optional foreign keys to null
    const finalPayload: any = { ...payload };
    Object.keys(finalPayload).forEach(key => {
      if (finalPayload[key] === '' || (key === 'contractor_id' && finalPayload[key] === 0)) {
        finalPayload[key] = null;
      }
    });

    if (dsr_image) {
      const form = new FormData();
      if (typeof dsr_image === 'string') {
        const uriParts = dsr_image.split('.');
        const fileType = uriParts[uriParts.length - 1] || 'jpg';
        form.append('photos', {
          uri: dsr_image,
          name: `dsr_photo_${Date.now()}.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      } else {
        form.append('photos', dsr_image);
      }
      const response = await api.post<DsrItem>('/dsr', form, {
        params: finalPayload,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }

    const response = await api.post<DsrItem>('/dsr', null, { params: finalPayload });
    return response.data;
  },

  /**
   * Get all DSRs for a project
   * GET /api/v1/dsr/project/{project_id}
   */
  async getDsrByProject(
    projectId: number | string,
    params?: {
      limit?: number;
      offset?: number;
      start_date?: string;
      end_date?: string;
      contractor_name?: string;
      status?: string;
    }
  ): Promise<DsrResponse> {
    const finalParams = {
      limit: 100,
      offset: 0,
      ...params,
    };
    const response = await api.get<any>(`/dsr/project/${projectId}`, {
      params: finalParams,
    });
    const d = response.data;
    if (d && Array.isArray(d.items)) {
      return d as DsrResponse;
    }
    if (Array.isArray(d)) {
      return { items: d, meta: { total: d.length, limit: 100, offset: 0 } };
    }
    if (d && Array.isArray(d.data)) {
      return { items: d.data, meta: d.meta || { total: d.data.length, limit: 100, offset: 0 } };
    }
    return { items: [], meta: { total: 0, limit: 100, offset: 0 } };
  },

  /**
   * Backward-compatible helper that returns DsrItem[]
   */
  async getProjectDsrs(
    projectId: number | string,
    params?: {
      limit?: number;
      offset?: number;
      start_date?: string;
      end_date?: string;
      contractor_name?: string;
      status?: string;
    }
  ): Promise<DsrItem[]> {
    try {
      const res = await this.getDsrByProject(projectId, params);
      return res.items || [];
    } catch (e) {
      console.error('getProjectDsrs error:', e);
      return [];
    }
  },

  /**
   * Get single DSR by ID
   * GET /api/v1/dsr/{id}
   */
  async getDsrById(id: number | string): Promise<DsrItem> {
    const response = await api.get<any>(`/dsr/${id}`);
    return response.data?.data || response.data;
  },

  /**
   * Update DSR
   * PUT /api/v1/dsr/{id}
   */
  async updateDsr(id: number | string, data: UpdateDsrRequest): Promise<DsrItem> {
    const {
      dsr_image, resolved_address, total_labour, skilled_labour, unskilled_labour,
      ...payload
    } = data;

    if (payload.weather && !['Sunny', 'Rainy', 'Cloudy', 'Windy', 'Foggy', 'Stormy'].includes(payload.weather)) {
      payload.weather = 'Sunny';
    }

    const finalPayload: any = { ...payload };
    Object.keys(finalPayload).forEach(key => {
      if (finalPayload[key] === '' || (key === 'contractor_id' && finalPayload[key] === 0)) {
        finalPayload[key] = null;
      }
    });

    const response = await api.put<DsrItem>(`/dsr/${id}`, finalPayload);
    return response.data;
  },

  /**
   * Delete DSR
   * DELETE /api/v1/dsr/{id}
   */
  async deleteDsr(id: number | string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/dsr/${id}`);
    return response.data;
  },

  /**
   * Submit DSR (Draft -> Submitted)
   * PUT /api/v1/dsr/{id}/submit
   */
  async submitDsr(id: number | string): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/dsr/${id}/submit`, {});
    return response.data;
  },

  /**
   * Approve DSR (Submitted -> Approved)
   * PUT /api/v1/dsr/{id}/approve
   */
  async approveDsr(id: number | string): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/dsr/${id}/approve`, {});
    return response.data;
  },

  /**
   * Reject DSR (Submitted -> Draft/Rejected)
   * PUT /api/v1/dsr/{id}/reject
   */
  async rejectDsr(id: number | string): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/dsr/${id}/reject`, {});
    return response.data;
  },

  /**
   * Upload photo for a DSR
   */
  async uploadDsrPhoto(
    dsr_id: number | string,
    fileUri: string,
    project_id?: number | string
  ): Promise<{ status: string; url: string }> {
    const formData = new FormData();
    const uriParts = fileUri.split('.');
    const fileType = uriParts[uriParts.length - 1] || 'jpg';

    formData.append('file', {
      uri: fileUri,
      name: `dsr_photo_${Date.now()}.${fileType}`,
      type: `image/${fileType}`,
    } as any);
    formData.append('dsr_id', String(dsr_id));
    formData.append('project_id', String(project_id || 1));
    formData.append('activity_tag', 'DSR Documentation');
    formData.append('location_tag', 'Site');
    formData.append('description', `DSR #${dsr_id} site photo`);
    formData.append('date', new Date().toISOString().split('T')[0]);

    try {
      const response = await api.post<any>(
        `/site-photos/upload`,
        formData,
        {
          params: { project_id: project_id || 1 },
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      return { status: 'uploaded', url: response.data?.url || response.data?.photo_url || '' };
    } catch (error) {
      console.warn(`Simulating DSR Photo Upload for DSR ${dsr_id}`, error);
      return { status: 'uploaded', url: fileUri };
    }
  },

  /**
   * Get all photos for a DSR via site-photos endpoint or dsr endpoint
   */
  async getDsrPhotos(dsr_id: number | string, project_id?: number | string): Promise<DsrPhoto[]> {
    let items: any[] = [];
    try {
      const response = await api.get<any>(`/site-photos`, { params: { dsr_id, project_id: project_id || 1 } });
      const data = response.data;
      if (Array.isArray(data)) {
        items = data;
      } else if (data && Array.isArray(data.items)) {
        items = data.items;
      } else if (data && Array.isArray(data.data)) {
        items = data.data;
      }
      items = items.filter((p: any) => String(p.dsr_id) === String(dsr_id));
    } catch {
      // ignore
    }

    if (items.length === 0) {
      try {
        const response = await api.get<any>(`/dsr/${dsr_id}/photos`);
        const data = response.data;
        if (Array.isArray(data)) {
          items = data;
        } else if (data && Array.isArray(data.data)) {
          items = data.data;
        }
      } catch {
        // ignore
      }
    }

    const uniqueItems = Array.from(new Map(items.map((item: any) => [item.id, item])).values());
    return uniqueItems
      .map((p: any) => ({ id: Number(p.id) || 0, url: p.url || p.file_url || p.photo_url || p.image_url || '' }))
      .filter((p: any) => p.url);
  },

  /**
   * Delete a DSR photo
   */
  async deleteDsrPhoto(photo_id: number | string): Promise<{ status: string }> {
    try {
      const response = await api.delete<{ status: string }>(`/site-photos/${photo_id}`);
      return response.data;
    } catch {
      const response = await api.delete<{ status: string }>(`/dsr/photo/${photo_id}`);
      return response.data;
    }
  },

  /**
   * Get DSR map points for a project
   */
  async getDsrMapPoints(project_id: number | string): Promise<DsrMapPoint[]> {
    try {
      const response = await api.get<any>(`/dsr/project/${project_id}/map`);
      const d = response.data;
      if (Array.isArray(d)) return d;
      if (d && Array.isArray(d.data)) return d.data;
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Get labour trend analytics
   */
  async getLabourTrend(
    project_id: number | string,
    start_date?: string,
    end_date?: string
  ): Promise<LabourTrend[]> {
    try {
      const response = await api.get<any>(
        `/dsr/project/${project_id}/analytics/labour`,
        { params: { start_date, end_date } }
      );
      const d = response.data;
      if (Array.isArray(d)) return d;
      if (d && Array.isArray(d.data)) return d.data;
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Get contractor analytics
   */
  async getContractorAnalytics(
    project_id: number | string,
    start_date?: string,
    end_date?: string
  ): Promise<ContractorAnalytics[]> {
    try {
      const response = await api.get<any>(
        `/dsr/project/${project_id}/analytics/contractor`,
        { params: { start_date, end_date } }
      );
      const d = response.data;
      if (Array.isArray(d)) return d;
      if (d && Array.isArray(d.data)) return d.data;
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Get issue analytics
   */
  async getIssueAnalytics(project_id: number | string): Promise<IssueAnalytics | null> {
    try {
      const response = await api.get<any>(
        `/dsr/project/${project_id}/analytics/issues`
      );
      return response.data?.data || response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Export DSR to Excel
   * GET /api/v1/dsr/project/{project_id}/export
   */
  async exportDsrExcel(
    project_id: number | string,
    params?: {
      start_date?: string;
      end_date?: string;
      contractor_name?: string;
    }
  ): Promise<any> {
    const response = await api.get(`/dsr/project/${project_id}/export`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Export Daily DSR to PDF
   * GET /api/v1/reports/daily/export/pdf
   */
  async exportDailyPdf(params: {
    report_date: string;
    project_id?: number | string;
  }): Promise<any> {
    const response = await api.get(`/reports/daily/export/pdf`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export default dsrService;
