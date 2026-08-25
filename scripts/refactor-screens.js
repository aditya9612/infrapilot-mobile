const fs = require('fs');
const path = require('path');

const mappings = [
    // Root Engineer screens (depth 3 -> 3)
    { app: 'engineer/chat.tsx', screen: 'engineer/ChatScreen.tsx', name: 'ChatScreen', depthChange: 0 },
    { app: 'engineer/checklists.tsx', screen: 'engineer/ChecklistsScreen.tsx', name: 'ChecklistsScreen', depthChange: 0 },
    { app: 'engineer/daily-site-report.tsx', screen: 'engineer/DailySiteReportScreen.tsx', name: 'DailySiteReportScreen', depthChange: 0 },
    { app: 'engineer/dashboard.tsx', screen: 'engineer/DashboardScreen.tsx', name: 'DashboardScreen', depthChange: 0 },
    { app: 'engineer/drawings-documents.tsx', screen: 'engineer/DrawingsDocumentsScreen.tsx', name: 'DrawingsDocumentsScreen', depthChange: 0 },
    { app: 'engineer/issue-delay-tracker.tsx', screen: 'engineer/IssueDelayTrackerScreen.tsx', name: 'IssueDelayTrackerScreen', depthChange: 0 },
    { app: 'engineer/machinery-equipment.tsx', screen: 'engineer/MachineryEquipmentScreen.tsx', name: 'MachineryEquipmentScreen', depthChange: 0 },
    { app: 'engineer/material-management.tsx', screen: 'engineer/MaterialManagementScreen.tsx', name: 'MaterialManagementScreen', depthChange: 0 },
    { app: 'engineer/quality-control.tsx', screen: 'engineer/QualityControlScreen.tsx', name: 'QualityControlScreen', depthChange: 0 },
    { app: 'engineer/reports.tsx', screen: 'engineer/ReportsScreen.tsx', name: 'ReportsScreen', depthChange: 0 },
    { app: 'engineer/safety-management.tsx', screen: 'engineer/SafetyManagementScreen.tsx', name: 'SafetyManagementScreen', depthChange: 0 },
    { app: 'engineer/settings.tsx', screen: 'engineer/SettingsScreen.tsx', name: 'SettingsScreen', depthChange: 0 },
    { app: 'engineer/site-photos.tsx', screen: 'engineer/SitePhotosScreen.tsx', name: 'SitePhotosScreen', depthChange: 0 },
    { app: 'engineer/task-management.tsx', screen: 'engineer/TaskManagementScreen.tsx', name: 'TaskManagementScreen', depthChange: 0 },
    { app: 'engineer/work-progress.tsx', screen: 'engineer/WorkProgressScreen.tsx', name: 'WorkProgressScreen', depthChange: 0 },

    // Labour Management (depth 4 -> 3)
    { app: 'engineer/labour-management/daily-attendance.tsx', screen: 'engineer/DailyAttendanceScreen.tsx', name: 'DailyAttendanceScreen', depthChange: -1 },
    { app: 'engineer/labour-management/labour-registry.tsx', screen: 'engineer/LabourRegistryScreen.tsx', name: 'LabourRegistryScreen', depthChange: -1 },
    { app: 'engineer/labour-management/payroll-reports.tsx', screen: 'engineer/PayrollReportScreen.tsx', name: 'PayrollReportScreen', depthChange: -1 },
    { app: 'engineer/labour-management/salary-advances.tsx', screen: 'engineer/SalaryAdvancesScreen.tsx', name: 'SalaryAdvancesScreen', depthChange: -1 },

    // Approvals (depth 4 -> 3)
    { app: 'engineer/approvals/resources-request.tsx', screen: 'engineer/ResourcesRequestScreen.tsx', name: 'ResourcesRequestScreen', depthChange: -1 },
    { app: 'engineer/approvals/work-approvals.tsx', screen: 'engineer/WorkApprovalsScreen.tsx', name: 'WorkApprovalsScreen', depthChange: -1 },
];

const APP_DIR = path.join(__dirname, '../src/app');
const SCREENS_DIR = path.join(__dirname, '../src/screens');

mappings.forEach(({ app, screen, name, depthChange }) => {
    const appPath = path.join(APP_DIR, app);
    const screenPath = path.join(SCREENS_DIR, screen);

    if (!fs.existsSync(appPath)) {
        console.log(`Skipping ${appPath} - does not exist.`);
        return;
    }

    let content = fs.readFileSync(appPath, 'utf8');

    // If depth changes from 4 to 3, we need to reduce the relative import path depth by 1
    if (depthChange === -1) {
        content = content.replace(/\.\.\/\.\.\/\.\.\//g, '../../');
    }

    // Ensure directory exists
    const screenDir = path.dirname(screenPath);
    if (!fs.existsSync(screenDir)) {
        fs.mkdirSync(screenDir, { recursive: true });
    }

    // Write the actual screen component
    fs.writeFileSync(screenPath, content);
    console.log(`Moved ${app} -> ${screen}`);

    // Determine path from app to screen for the re-export
    // E.g. from src/app/engineer/chat.tsx to src/screens/engineer/ChatScreen.tsx
    // Since we know the exact paths, let's just hardcode the relative paths for simplicity
    
    let exportPath = '';
    if (depthChange === 0) {
        // e.g. src/app/engineer/chat.tsx -> ../../../screens/engineer/ChatScreen
        // Wait, from app/engineer it's 2 levels up to src: ../../screens/engineer/ChatScreen
        exportPath = `../../screens/engineer/${name}`;
    } else if (depthChange === -1) {
        // e.g. src/app/engineer/labour-management/daily-attendance.tsx -> ../../../../screens/engineer/DailyAttendanceScreen
        // 3 levels up to src: ../../../screens/engineer/DailyAttendanceScreen
        exportPath = `../../../screens/engineer/${name}`;
    }

    const exportContent = `export { default } from '${exportPath}';\n`;
    fs.writeFileSync(appPath, exportContent);
    console.log(`Re-wrote ${app} to export ${exportPath}`);
});

console.log('Done!');
