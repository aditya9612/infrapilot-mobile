import { api } from './api';
import type { SitePhotoItem, SitePhotoQueryParams, UploadSitePhotoRequest } from '../types/sitePhoto';

export const sitePhotosService = {
    /**
     * GET /api/v1/site-photos
     * List Site Photos
     */
    getSitePhotos: async (params?: SitePhotoQueryParams): Promise<SitePhotoItem[]> => {
        try {
            const queryParams = { limit: 1000, ...params };
            const response = await api.get('/site-photos', { params: queryParams });
            const data = response?.data;
            if (Array.isArray(data)) return data;
            if (Array.isArray(data?.data)) return data.data;
            if (Array.isArray(data?.items)) return data.items;
            if (Array.isArray(data?.photos)) return data.photos;
            return [];
        } catch (error) {
            console.error('Error fetching site photos:', error);
            return [];
        }
    },

    /**
     * POST /api/v1/site-photos/upload
     * Upload Site Photo
     */
    uploadSitePhoto: async (data: FormData | UploadSitePhotoRequest): Promise<SitePhotoItem> => {
        let formData: FormData;

        if (data instanceof FormData) {
            formData = data;
        } else {
            formData = new FormData();
            if (data.file) {
                if (typeof data.file === 'string') {
                    const uriParts = data.file.split('.');
                    const fileType = uriParts[uriParts.length - 1] || 'jpg';
                    formData.append('file', {
                        uri: data.file,
                        name: `site_photo_${Date.now()}.${fileType}`,
                        type: `image/${fileType}`,
                    } as any);
                } else {
                    formData.append('file', data.file);
                }
            }

            if (data.project_id !== undefined && data.project_id !== null) {
                formData.append('project_id', String(data.project_id));
            }
            if (data.activity_id !== undefined && data.activity_id !== null) {
                formData.append('activity_id', String(data.activity_id));
            }
            if (data.location_id !== undefined && data.location_id !== null) {
                formData.append('location_id', String(data.location_id));
            }
            if (data.task_id !== undefined && data.task_id !== null) {
                formData.append('task_id', String(data.task_id));
            }
            if (data.dsr_id !== undefined && data.dsr_id !== null) {
                formData.append('dsr_id', String(data.dsr_id));
            }
            if (data.description) {
                formData.append('description', data.description);
            }
            if (data.observed_date) {
                formData.append('observed_date', data.observed_date);
            }
        }

        const response = await api.post('/site-photos/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response?.data?.data || response?.data;
    },

    /**
     * DELETE /api/v1/site-photos/{photo_id}
     * Delete Photo
     */
    deleteSitePhoto: async (photoId: number | string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await api.delete(`/site-photos/${photoId}`);
            return response?.data || { success: true };
        } catch (error) {
            console.error('Error deleting site photo:', error);
            throw error;
        }
    }
};

export default sitePhotosService;
