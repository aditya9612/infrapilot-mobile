export interface WorkApprovalItem {
    id: number | string;
    project_id?: number | string;
    project_name?: string;
    approval_type?: string;
    type?: string;
    category?: string;
    remarks?: string;
    description?: string;
    title?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateWorkApprovalForm {
    project_id: number | string;
    project_name?: string;
    approval_type: string;
    remarks: string;
}
