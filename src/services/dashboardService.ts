import { api } from './api';

export interface AdminDashboardData {
    project_overview: {
        total: number;
        active: number;
        completed: number;
        delayed: number;
    };
    financial: {
        revenue: number;
        expense: number;
        profit: number;
    };
    vitals: {
        pending_approvals: number;
        action_items: number;
        site_issues_open: number;
        total_labour_today: number;
        material_used_today: number;
    };
    kpi_comparison: {
        current_month: number;
        previous_month: number;
        difference: number;
    };
    active_users: number;
    discipline_progress: Array<{
        name: string;
        planned_cost?: number;
        actual_cost?: number;
        progress_percentage?: number;
    }>;
    master_projects: Array<{
        id: string | number;
        name: string;
        health: string;
        start_date: string;
        end_date?: string;
        progress: number;
        performance_score?: number;
    }>;
    recent_activities: Array<{
        id?: string;
        type: string;
        description: string;
        time: string;
        user?: string;
        project_name?: string;
    }>;
}

export interface EngineerDashboardData {
    project_overview: {
        name: string;
        description: string;
    };
    vitals: {
        total_labour: number;
        skilled_labour: number;
        unskilled_labour: number;
        active_activities: number;
        open_issues: number;
        high_priority_issues: number;
        material_stock_status: number;
        in_stock: number;
        low_out_stock: number;
    };
    today_work_summary: Array<{
        id: string;
        activity: string;
        timestamp: string;
    }>;
    overall_progress: {
        completed_percentage: number;
        planned_percentage: number;
        variance_percentage: number;
    };
    discipline_wise_completion: Array<{
        name: string;
        planned_percentage: number;
        actual_percentage: number;
    }>;
    project_phase_timeline: Array<{
        id: number;
        phase_name: string;
        start_date: string;
        end_date: string;
        status: 'PLANNED' | 'COMPLETED' | 'DELAYED' | 'IN_PROGRESS';
    }>;
    expense_register: {
        total_spent: number;
        labour_spent: number;
        material_spent: number;
        equipment_spent: number;
        expenses: Array<{
            id: string;
            date: string;
            type: string;
            category: string;
            note: string;
            amount: number;
        }>;
    };
}

export const dashboardService = {
    getAdminDashboard: async (): Promise<AdminDashboardData> => {
        try {
            const response = await api.get('/dashboard/admin');
            return response.data;
        } catch (error) {
            console.error('Error fetching admin dashboard:', error);
            throw error;
        }
    },
    getEngineerDashboard: async (projectId: string): Promise<EngineerDashboardData> => {
        try {
            const response = await api.get(`/dashboard/engineer/${projectId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching engineer dashboard:', error);
            throw error;
        }
    }
};
