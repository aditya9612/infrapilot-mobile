import { api } from './api';

export interface ProjectEntity {
    id: string;
    name: string;
    status: string;
    progress: number;
    startDate: string;
    endDate: string;
    healthDotColor: string;
}

export interface ProjectActivityEntity {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    rawTime: string;
    user: string;
    accentColor: string;
    iconType: string;
}

export interface ProjectsDashboardData {
    summary: {
        total: number;
        ongoing: number;
        completed: number;
        delayed: number;
    };
    projects: ProjectEntity[];
    activities: ProjectActivityEntity[];
}

export const projectService = {
    getProjectsDashboard: async (): Promise<ProjectsDashboardData> => {
        try {
            // Execute both remote fetching strategies simultaneously 
            const [alertsRes, tasksRes, invoicesRes, projectsRes] = await Promise.all([
                api.get('/projects/alerts/projects'),
                api.get('/projects/alerts/tasks').catch(() => ({ data: [] })),
                api.get('/invoices?limit=50&offset=0').catch(() => ({ data: [] })),
                api.get('/projects?limit=100&offset=0')
            ]);

            const alertsPayload = alertsRes.data;
            const tasksPayload = tasksRes.data;
            const invoicesPayload = invoicesRes.data;
            const projectsPayload = projectsRes.data;

            // Force extract Master Projects array
            const isProjArray = Array.isArray(projectsPayload);
            const projectsList = isProjArray ? projectsPayload : (projectsPayload.items || projectsPayload.data || projectsPayload.projects || projectsPayload.master_projects || []);

            const mappedProjects = projectsList.map((p: any, index: number) => {
                const rawStatus = p.status || p.health || p.state || 'On Track';
                let color = '#10B981';

                if (rawStatus.toUpperCase().includes('DELAY')) color = '#EF4444';
                else if (rawStatus.toUpperCase().includes('HOLD')) color = '#F59E0B';
                else if (rawStatus.toUpperCase().includes('COMPLET')) color = '#3B82F6';

                return {
                    id: p.id?.toString() || index.toString(),
                    name: p.name || p.project_name || p.title || 'Unnamed Project',
                    status: rawStatus.replace('_', ' ').toUpperCase(),
                    progress: parseFloat(p.progress || p.completion_percentage || p.performance_score || '0'),
                    startDate: p.start_date || p.startDate || p.created_at?.split('T')[0] || 'N/A',
                    endDate: p.end_date || p.endDate || 'N/A',
                    healthDotColor: color,
                };
            });

            // Safely synthesize overarching summary statistics
            const summary = {
                total: mappedProjects.length,
                ongoing: mappedProjects.filter((p: any) => !p.status.includes('DELAY') && !p.status.includes('COMPLET')).length,
                completed: mappedProjects.filter((p: any) => p.status.includes('COMPLET')).length,
                delayed: mappedProjects.filter((p: any) => p.status.includes('DELAY')).length,
            };

            // Force extract alerts / recent activities array
            const alertsList = Array.isArray(alertsPayload) ? alertsPayload : (alertsPayload.activities || alertsPayload.data || []);
            const tasksList = Array.isArray(tasksPayload) ? tasksPayload : (tasksPayload.tasks || tasksPayload.data || []);
            const invoicesList = Array.isArray(invoicesPayload) ? invoicesPayload : (invoicesPayload.items || invoicesPayload.data || invoicesPayload.invoices || []);

            let unifiedActivities: ProjectActivityEntity[] = [];

            // 1. Process Project Alerts (Site / Red)
            alertsList.forEach((a: any, idx: number) => {
                const action = `${a.project_name || a.name || 'System'} is ${a.status || 'Updated'}`;
                const rawT = a.created_at || a.timestamp || new Date().toISOString();
                unifiedActivities.push({
                    id: `proj-alert-${a.id || idx}`,
                    type: 'Site',
                    description: action,
                    timestamp: 'Recent',
                    rawTime: rawT,
                    user: 'System',
                    accentColor: 'Red',
                    iconType: 'Alert'
                });
            });

            // 2. Process Task Alerts (Site/Finance)
            tasksList.forEach((t: any, idx: number) => {
                const action = `${t.task_name || t.title || 'Task'}: ${t.status || 'Updated'}`;
                const rawT = t.created_at || t.timestamp || new Date().toISOString();
                const isFinance = /(payment|invoice|bill|payroll|budget)/i.test(action);
                unifiedActivities.push({
                    id: `task-alert-${t.id || idx}`,
                    type: isFinance ? 'Finance' : 'Site',
                    description: action,
                    timestamp: 'Recent',
                    rawTime: rawT,
                    user: 'System',
                    accentColor: isFinance ? 'Emerald' : 'Blue',
                    iconType: isFinance ? 'Receipt' : 'Checkmark'
                });
            });

            // 3. Process Invoices (Finance / Amber)
            invoicesList.forEach((inv: any, idx: number) => {
                const action = `Invoice #${inv.invoice_number || inv.id || idx}: ${inv.status || 'Generated'}`;
                const rawT = inv.created_at || inv.timestamp || new Date().toISOString();
                unifiedActivities.push({
                    id: `inv-${inv.id || idx}`,
                    type: 'Finance',
                    description: action,
                    timestamp: 'Recent',
                    rawTime: rawT,
                    user: inv.created_by?.name || 'System',
                    accentColor: 'Amber',
                    iconType: 'Receipt'
                });
            });

            // 4. Sort Unified List by rawTime descending (newest first)
            unifiedActivities.sort((a, b) => new Date(b.rawTime).getTime() - new Date(a.rawTime).getTime());

            // 5. Format human-readable timestamp post-sorting
            unifiedActivities = unifiedActivities.map(item => {
                try {
                    const dateObj = new Date(item.rawTime);
                    const hours = dateObj.getHours();
                    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const formattedHours = hours % 12 || 12;
                    item.timestamp = `${formattedHours}:${minutes} ${ampm}`;
                } catch {
                    item.timestamp = 'Recent';
                }
                return item;
            });

            return { summary, projects: mappedProjects, activities: unifiedActivities };
        } catch (e) {
            console.error('Failed to parallel fetch projects APIs:', e);
            return { summary: { total: 0, ongoing: 0, completed: 0, delayed: 0 }, projects: [], activities: [] };
        }
    }
};
