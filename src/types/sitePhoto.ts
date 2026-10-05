export interface SitePhotoItem {
    id: number | string;
    photo_id?: number | string;
    project_id?: number | string;
    activity_id?: number | string;
    activity_name?: string;
    activity_tag?: string;
    location_id?: number | string;
    location_name?: string;
    location_tag?: string;
    task_id?: number | string;
    task_name?: string;
    dsr_id?: number | string;
    dsr_name?: string;
    description?: string;
    observed_date?: string;
    date?: string;
    file_url?: string;
    image_url?: string;
    photo_url?: string;
    url?: string;
    created_at?: string;
    created_by?: string;
    created_by_name?: string;
    label?: string;
    title?: string;
    status?: string;
    category?: string;
}

export interface UploadSitePhotoRequest {
    file: any;
    project_id: number | string;
    activity_id?: number | string;
    location_id?: number | string;
    task_id?: number | string;
    dsr_id?: number | string;
    description?: string;
    observed_date?: string;
}

export interface SitePhotoQueryParams {
    project_id?: number | string;
    activity_id?: number | string;
    location_id?: number | string;
    dsr_id?: number | string;
    task_id?: number | string;
    limit?: number;
    skip?: number;
}
