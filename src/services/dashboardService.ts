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

export const dashboardService = {
    getAdminDashboard: async (): Promise<AdminDashboardData> => {
        try {
            const response = await api.get('/dashboard/admin');
            return response.data;
        } catch (error) {
            console.error('Error fetching admin dashboard:', error);
            throw error;
        }
    }
};
