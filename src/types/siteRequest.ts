export interface SiteRequestItem {
    id: number | string;
    project_id?: number | string;
    project_name?: string;
    resource_type?: string;
    category?: string;
    description?: string;
    narrative?: string;
    quantity?: number | string;
    units?: number | string;
    unit?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateSiteRequestForm {
    project_id: number | string;
    project_name?: string;
    resource_type: string;
    description: string;
    quantity: string;
    unit: string;
}
