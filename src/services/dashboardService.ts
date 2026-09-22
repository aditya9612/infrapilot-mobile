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
    discipline_progress: Array<{
        name: string;
        planned_cost: number;
        actual_cost: number;
        progress_percentage: number;
    }>;
    master_projects: Array<{
        id: string;
        name: string;
        health: 'On Track' | 'Delayed' | 'At Risk' | 'COMPLETED';
        start_date: string;
        progress: number;
    }>;
    recent_activities: Array<{
        id: string;
        type: 'Invoice' | 'Delete' | 'Task' | 'Alert' | 'System';
        description: string;
        timestamp: string;
    }>;
}

export interface EngineerDashboardData {
    project_id: number;
    project_name: string;
    status: string;
    progress: number;
    planned_progress: number;
    variance: number;
    vitals: {
        total_labour_today: number;
        active_activities: number;
        open_issues: {
            total: number;
            high_priority: number;
        };
        material_stock_status: Array<{
            category: string;
            status: string;
        }>;
    };
    today_work_summary: Array<{
        activity_name: string;
        status: string;
        start_time: string;
        finish_time: string;
    }>;
    discipline_progress: Array<{
        discipline: string;
        planned_percent: number;
        actual_percent: number;
    }>;
    timeline: Array<{
        id: number;
        title: string;
        status: 'PLANNED' | 'COMPLETED' | 'DELAYED' | 'IN_PROGRESS' | string;
        start_date: string;
        end_date: string;
    }>;
    recent_expenses: Array<{
        date: string;
        type: string;
        category: string;
        note: string;
        amount: number;
    }>;
    weather: any;
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
