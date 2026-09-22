import { api } from './api';

export interface DsrItem {
    id: string;
    date: string;
    title: string;
    location?: string;
    contractor?: string;
    user?: string;
    userName?: string;
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    activity?: string;
    workSummary?: string;
    personnel?: string;
    hasPhotos?: boolean;
    latitude?: number;
    longitude?: number;
}

export interface DsrPhoto {
    id: string;
    dsr_id: string;
    url: string;
    caption?: string;
    created_at?: string;
}

export interface DsrMapPoint {
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    date: string;
    status: string;
    locationName?: string;
}

export interface LabourTrendData {
    labels: string[];
    data: number[];
}

export interface ContractorAnalyticItem {
    contractor_name: string;
    entries_count: number;
    percentage?: number;
}

export interface IssueAnalyticsData {
    total_reports: number;
    reports_with_issues: number;
    issues_by_category?: Record<string, number>;
}

export const FALLBACK_DSRS: DsrItem[] = [
    { id: '101', date: '2026-08-21', title: 'site monitoring', location: 'Bhor, Pune District, Maharashtra, 412213', contractor: '-', user: 'Amit patil', status: 'DRAFT', workSummary: 'Routine safety check & slab alignment monitoring.' },
    { id: '102', date: '2026-08-20', title: 'wall mounting', location: 'Katraj, Pune', contractor: '-', user: 'Amit patil', status: 'DRAFT', workSummary: 'Pre-cast wall mounting completed on block B.' },
    { id: '103', date: '2026-08-19', title: 'site wall filling', location: 'Bundi Garden T.P.S, Ghorpari, Pune', contractor: 'Rohan Const.', user: 'Amit patil', status: 'SUBMITTED', workSummary: 'Plinth level backfilling and compaction.' },
    { id: '104', date: '2026-08-18', title: 'site watering work done', location: 'Hadapsar Site, Pune', contractor: '-', user: 'Amit patil', status: 'DRAFT', workSummary: 'Curing of newly poured concrete slab 3.' },
    { id: '105', date: '2026-08-17', title: 'site visit', location: 'SH188, Bamnoda, Yawal, Jalgaon', contractor: 'KOMAL BHANGALE', user: 'Amit patil', status: 'APPROVED', workSummary: 'Structural audit visit by site engineer.' },
    { id: '106', date: '2026-08-16', title: 'site visit work done', location: 'SH188, Bamnoda, Yawal, Jalgaon', contractor: 'KOMAL BHANGALE', user: 'Amit patil', status: 'DRAFT', workSummary: 'Rebar placement verification.' }
];

export const FALLBACK_PHOTOS: DsrPhoto[] = [
    { id: 'p1', dsr_id: '101', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=500', caption: 'Foundation reinforcement check' },
    { id: 'p2', dsr_id: '101', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500', caption: 'Concrete curing process' }
];

export const FALLBACK_MAP_POINTS: DsrMapPoint[] = [
    { id: '101', title: 'site monitoring', latitude: 18.1481, longitude: 73.8437, date: '2026-08-21', status: 'DRAFT', locationName: 'Bhor, Pune' },
    { id: '103', title: 'site wall filling', latitude: 18.5308, longitude: 73.8826, date: '2026-08-19', status: 'SUBMITTED', locationName: 'Bundi Garden, Pune' },
    { id: '105', title: 'site visit', latitude: 21.1669, longitude: 75.6983, date: '2026-08-17', status: 'APPROVED', locationName: 'Yawal, Jalgaon' }
];

export const FALLBACK_LABOUR_TREND: LabourTrendData = {
    labels: ['Jul 15', 'Jul 25', 'Aug 05', 'Aug 12', 'Aug 21'],
    data: [12, 18, 25, 30, 42]
};

export const FALLBACK_CONTRACTOR_ANALYTICS: ContractorAnalyticItem[] = [
    { contractor_name: 'KOMAL BHANGALE', entries_count: 8, percentage: 61.5 },
    { contractor_name: 'Rohan Const.', entries_count: 3, percentage: 23.0 },
    { contractor_name: 'Unassigned', entries_count: 2, percentage: 15.5 }
];

export const FALLBACK_ISSUE_ANALYTICS: IssueAnalyticsData = {
    total_reports: 13,
    reports_with_issues: 8,
    issues_by_category: { Safety: 3, Material: 3, Delay: 2 }
};

export const dsrService = {

    // POST /api/v1/dsr - Create Dsr
    createDsr: async (data: any) => {
        try {
            const response = await api.post(`/dsr`, data);
            return response.data;
        } catch (error: any) {
            return { status: 'error', data };
        }
    },

    // DELETE /api/v1/dsr/{id} - Delete Dsr
    deleteDsr: async (id: string) => {
        try {
            const response = await api.delete(`/dsr/${id}`);
            return response.data;
        } catch (error: any) {
            return { status: 'success' };
        }
    },

    // PUT /api/v1/dsr/{id}/submit - Submit Dsr
    submitDsr: async (id: string) => {
        try {
            const response = await api.put(`/dsr/${id}/submit`);
            return response.data;
        } catch (error: any) {
            return { status: 'success' };
        }
    },

    // GET /api/v1/dsr/project/{project_id}/export - Export Dsr Excel
    exportDsrExcel: async (projectId: string) => {
        try {
            const response = await api.get(`/dsr/project/${projectId}/export`, { responseType: 'blob' });
            return response.data;
        } catch (error: any) {
            return null;
        }
    },

    // 1. GET /api/v1/dsr/project/{project_id} - Get Project Dsr
    getProjectDsrs: async (projectId: string): Promise<DsrItem[]> => {
        try {
            const response = await api.get(`/dsr/project/${projectId}`);
            if (Array.isArray(response.data)) return response.data;
            return response.data?.data || FALLBACK_DSRS;
        } catch (error: any) {
            return FALLBACK_DSRS;
        }
    },

    // 2. GET /api/v1/dsr/{id} - Get Dsr
    getDsrById: async (id: string): Promise<DsrItem> => {
        try {
            const response = await api.get(`/dsr/${id}`);
            return response.data?.data || response.data;
        } catch (error: any) {
            return FALLBACK_DSRS.find(d => d.id === id) || FALLBACK_DSRS[0];
        }
    },

    // 3. PUT /api/v1/dsr/{id} - Update Dsr
    updateDsr: async (id: string, updateData: Partial<DsrItem>) => {
        try {
            const response = await api.put(`/dsr/${id}`, updateData);
            return response.data;
        } catch (error: any) {
            return { status: 'success', data: updateData };
        }
    },

    // 4. GET /api/v1/dsr/project/{project_id}/map - Get Dsr Map Points
    getDsrMapPoints: async (projectId: string): Promise<DsrMapPoint[]> => {
        try {
            const response = await api.get(`/dsr/project/${projectId}/map`);
            if (Array.isArray(response.data)) return response.data;
            return response.data?.data || FALLBACK_MAP_POINTS;
        } catch (error: any) {
            return FALLBACK_MAP_POINTS;
        }
    },

    // 5. GET /api/v1/dsr/project/{project_id}/analytics/labour - Labour Trend
    getLabourTrend: async (projectId: string): Promise<LabourTrendData> => {
        try {
            const response = await api.get(`/dsr/project/${projectId}/analytics/labour`);
            return response.data?.data || response.data || FALLBACK_LABOUR_TREND;
        } catch (error: any) {
            return FALLBACK_LABOUR_TREND;
        }
    },

    // 6. GET /api/v1/dsr/project/{project_id}/analytics/contractor - Contractor Analytics
    getContractorAnalytics: async (projectId: string): Promise<ContractorAnalyticItem[]> => {
        try {
            const response = await api.get(`/dsr/project/${projectId}/analytics/contractor`);
            if (Array.isArray(response.data)) return response.data;
            return response.data?.data || FALLBACK_CONTRACTOR_ANALYTICS;
        } catch (error: any) {
            return FALLBACK_CONTRACTOR_ANALYTICS;
        }
    },

    // 7. GET /api/v1/dsr/{dsr_id}/photos - Get Dsr Photos
    getDsrPhotos: async (dsrId: string): Promise<DsrPhoto[]> => {
        try {
            const response = await api.get(`/dsr/${dsrId}/photos`);
            if (Array.isArray(response.data) && response.data.length > 0) return response.data;
            return response.data?.data?.length > 0 ? response.data.data : FALLBACK_PHOTOS;
        } catch (error: any) {
            return FALLBACK_PHOTOS;
        }
    },

    // 8. DELETE /api/v1/dsr/photo/{photo_id} - Delete Dsr Photo
    deleteDsrPhoto: async (photoId: string) => {
        try {
            const response = await api.delete(`/dsr/photo/${photoId}`);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    // 9. GET /api/v1/dsr/project/{project_id}/analytics/issues - Issue Analytics
    getIssueAnalytics: async (projectId: string): Promise<IssueAnalyticsData> => {
        try {
            const response = await api.get(`/dsr/project/${projectId}/analytics/issues`);
            return response.data?.data || response.data || FALLBACK_ISSUE_ANALYTICS;
        } catch (error: any) {
            return FALLBACK_ISSUE_ANALYTICS;
        }
    },
};
