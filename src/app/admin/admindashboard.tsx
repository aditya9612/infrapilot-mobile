import { useNavigation, useRouter } from 'expo-router';
import {
    AlertTriangle,
    Bell,
    FileText,
    HardHat,
    Menu,
    Plus,
    Trash2
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { AdminDashboardData } from '../../services/dashboardService';

const formatCompactCurrency = (amount: number) => {
    if (amount >= 1e9) {
        return `₹${(amount / 1e9).toFixed(1)}B`;
    }
    if (amount >= 1e7) {
        return `₹${(amount / 1e7).toFixed(1)}Cr`;
    }
    if (amount >= 1e5) {
        return `₹${(amount / 1e5).toFixed(1)}L`;
    }
    if (amount >= 1e3) {
        return `₹${(amount / 1e3).toFixed(1)}K`;
    }
    return `₹${amount === 0 ? '0' : amount.toFixed(2)}`;
};

export default function AdminDashboardScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch from the real endpoint or use fallback for now if endpoint isn't live
                // const result = await dashboardService.getAdminDashboard();
                // setData(result);

                const mockData: AdminDashboardData = {
                    project_overview: { total: 12, active: 7, completed: 2, delayed: 3 },
                    financial: { revenue: 2066.19, expense: 613083.49, profit: -611017.30 },
                    vitals: {
                        pending_approvals: 23,
                        action_items: 3,
                        site_issues_open: 16,
                        total_labour_today: 1,
                        material_used_today: 1
                    },
                    kpi_comparison: { current_month: 13083.49, previous_month: 600000.00, difference: -586916.51 },
                    discipline_progress: [
                        { name: 'Civil', planned_cost: 100000, actual_cost: 95000, progress_percentage: 85 },
                        { name: 'MEP', planned_cost: 50000, actual_cost: 55000, progress_percentage: 60 }
                    ],
                    master_projects: [
                        { id: '1', name: 'Rohan Harita', health: 'On Track', start_date: '2023-01-10', progress: 17.37 },
                        { id: '2', name: 'Gini Vivante', health: 'Delayed', start_date: '2023-03-15', progress: 20 },
                        { id: '3', name: 'Sara City', health: 'At Risk', start_date: '2023-05-10', progress: 23.37 }
                    ],
                    recent_activities: [
                        { id: '1', type: 'System', description: 'System: CREATE_PO', timestamp: '30 Aug 17:31' },
                        { id: '2', type: 'System', description: 'System: CREATE_PO', timestamp: '30 Aug 17:30' },
                        { id: '3', type: 'System', description: 'System: RECEIVE_MATERIAL', timestamp: '30 Aug 11:11' },
                        { id: '4', type: 'Task', description: 'System: TASK_COMPLETED', timestamp: '30 Aug 10:35' },
                    ]
                };

                setTimeout(() => {
                    setData(mockData);
                    setIsLoading(false);
                }, 1000);

            } catch (error) {
                console.error("Dashboard failed to load", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading || !data) {
        return (
            <View className="flex-1 bg-gray-50 p-4 pt-12 items-center justify-center">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="mt-4 text-gray-500 font-semibold">Loading Admin Dashboard...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            {/* Header Toolbar (Project Pulse) */}
            <TopHeader title="Admin Dashboard" subtitle="Real-time infrastructure health and budget monitoring." />
            
            <View className="px-4 pb-4 bg-white shadow-sm border-b border-gray-200">
                {/* Horizontal Action Pills */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 px-3 py-1.5 rounded-full mr-2 shadow-sm">
                        <Plus size={14} color="#1F2937" className="mr-1" />
                        <Text className="text-xs font-bold text-gray-700">New Project</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 px-3 py-1.5 rounded-full mr-2 shadow-sm">
                        <Plus size={14} color="#1F2937" className="mr-1" />
                        <Text className="text-xs font-bold text-gray-700">Add User</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 px-3 py-1.5 rounded-full mr-2 shadow-sm">
                        <Plus size={14} color="#1F2937" className="mr-1" />
                        <Text className="text-xs font-bold text-gray-700">Create BOQ</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Critical Alerts Banner */}
            {data.vitals.site_issues_open > 0 && (
                <View className="mx-4 mt-5 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg shadow-sm">
                    <View className="flex-row items-center mb-1">
                        <AlertTriangle size={16} color="#F59E0B" className="mr-2" />
                        <Text className="text-gray-800 font-bold text-sm">Critical Alerts</Text>
                    </View>
                    <Text className="text-red-500 text-xs font-medium ml-6">
                        System Alert: Urgent attention needed for {data.vitals.site_issues_open} open site issues.
                    </Text>
                </View>
            )}

            {/* Project Overview Grid */}
            <View className="px-4 mt-6">
                <Text className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest pl-1">Project Overview</Text>
                <View className="flex-row flex-wrap justify-between gap-y-3">
                    <View className="w-[48%] bg-white p-3.5 rounded-xl shadow-sm border border-gray-100">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Total Projects</Text>
                        <Text className="text-2xl font-black text-blue-600">{data.project_overview.total}</Text>
                        <Text className="text-[9px] font-semibold text-gray-400 mt-1">Master projects</Text>
                    </View>
                    <View className="w-[48%] bg-white p-3.5 rounded-xl shadow-sm border border-gray-100">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Ongoing Projects</Text>
                        <Text className="text-2xl font-black text-blue-600">{data.project_overview.active}</Text>
                        <Text className="text-[9px] font-semibold text-gray-400 mt-1">On-going sites</Text>
                    </View>
                    <View className="w-[48%] bg-white p-3.5 rounded-xl shadow-sm border border-gray-100">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Completed Projects</Text>
                        <Text className="text-2xl font-black text-green-600">{data.project_overview.completed}</Text>
                        <Text className="text-[9px] font-semibold text-gray-400 mt-1">Finished sites</Text>
                    </View>
                    <View className="w-[48%] bg-white p-3.5 rounded-xl shadow-sm border border-gray-100">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Delayed Projects</Text>
                        <Text className="text-2xl font-black text-red-600">{data.project_overview.delayed}</Text>
                        <Text className="text-[9px] font-semibold text-gray-400 mt-1">At high risk</Text>
                    </View>
                </View>
            </View>

            {/* Financial Status Grid */}
            <View className="px-4 mt-6">
                <Text className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest pl-1">Financial Status</Text>

                <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Total Revenue</Text>
                    <Text className="text-2xl font-black text-blue-700">₹{data.financial.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
                    <Text className="text-[9px] font-semibold text-gray-400 mt-1">Total invoiced</Text>
                </View>

                <View className="flex-row justify-between gap-3">
                    <View className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Total Expenses</Text>
                        <Text className="text-xl font-black text-amber-500">₹{data.financial.expense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
                        <Text className="text-[9px] font-semibold text-gray-400 mt-1">Payments & Purchases</Text>
                    </View>
                    <View className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Profit / Loss</Text>
                        <Text className={`text-xl font-black ${data.financial.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.financial.profit >= 0 ? '' : '-'}₹{Math.abs(data.financial.profit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </Text>
                        <Text className="text-[9px] font-semibold text-gray-400 mt-1">Net margin</Text>
                    </View>
                </View>
            </View>

            {/* Operations & Vitals */}
            <View className="px-4 mt-6">
                <Text className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest pl-1">Operations & Vitals</Text>
                <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-2.5">
                    <View className="flex-row flex-wrap border-b border-gray-100 pb-2 mb-2">
                        <View className="w-1/2 flex-row pb-2">
                            <View className="flex-1">
                                <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Users</Text>
                                <Text className="text-lg font-black text-blue-600 my-0.5">{data.vitals.pending_approvals + 19}</Text>
                                <Text className="text-[8px] font-semibold text-gray-400">Active on app</Text>
                            </View>
                        </View>
                        <View className="w-1/2 flex-row pb-2 border-l border-gray-100 pl-3">
                            <View className="flex-1">
                                <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pending Approvals</Text>
                                <Text className="text-lg font-black text-amber-500 my-0.5">{data.vitals.pending_approvals}</Text>
                                <Text className="text-[8px] font-semibold text-gray-400">Awaiting review</Text>
                            </View>
                        </View>
                        <View className="w-1/2 flex-row pb-2">
                            <View className="flex-1">
                                <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Action Items</Text>
                                <Text className="text-lg font-black text-amber-500 my-0.5">{data.vitals.action_items}</Text>
                                <Text className="text-[8px] font-semibold text-gray-400">Requires action</Text>
                            </View>
                        </View>
                        <View className="w-1/2 flex-row pb-2 border-l border-gray-100 pl-3">
                            <View className="flex-1">
                                <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Site Issues Open</Text>
                                <Text className="text-lg font-black text-red-600 my-0.5">{data.vitals.site_issues_open}</Text>
                                <Text className="text-[8px] font-semibold text-gray-400">Open tickets</Text>
                            </View>
                        </View>
                        <View className="w-1/2 flex-row pt-1">
                            <View className="flex-1">
                                <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Labour Today</Text>
                                <Text className="text-lg font-black text-green-600 my-0.5">{data.vitals.total_labour_today}</Text>
                                <Text className="text-[8px] font-semibold text-gray-400">On-site workers</Text>
                            </View>
                        </View>
                        <View className="w-1/2 flex-row pt-1 border-l border-gray-100 pl-3">
                            <View className="flex-1">
                                <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Material Used Today</Text>
                                <Text className="text-lg font-black text-blue-500 my-0.5">{data.vitals.material_used_today}</Text>
                                <Text className="text-[8px] font-semibold text-gray-400">Items consumed</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* KPI - Month on Month */}
            <View className="px-4 mt-6">
                <Text className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest pl-1">KPI - Month On Month</Text>
                <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Current Month</Text>
                    <Text className="text-2xl font-black text-blue-700">₹{data.kpi_comparison.current_month.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
                    <Text className="text-[9px] font-semibold text-gray-400 mt-1">Revenue this month</Text>
                </View>
                <View className="flex-row justify-between gap-3">
                    <View className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Previous Month</Text>
                        <Text className="text-xl font-black text-gray-800">₹{data.kpi_comparison.previous_month.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
                        <Text className="text-[9px] font-semibold text-gray-400 mt-1">Revenue last month</Text>
                    </View>
                    <View className={`flex-1 bg-white rounded-xl p-4 shadow-sm border ${data.kpi_comparison.difference >= 0 ? 'border-green-200' : 'border-red-200'}`}>
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Difference</Text>
                        <Text className={`text-xl font-black ${data.kpi_comparison.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.kpi_comparison.difference >= 0 ? '' : '-'}₹{Math.abs(data.kpi_comparison.difference).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </Text>
                        <Text className="text-[9px] font-semibold text-gray-400 mt-1">
                            {data.kpi_comparison.difference >= 0 ? 'Growth vs last month' : 'Decline vs last month'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Discipline Progress Chart - Fallback UI */}
            <View className="px-4 mt-6">
                <View className="flex-row justify-between items-center mb-2 pl-1">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Discipline Progress</Text>
                    <View className="bg-gray-100 rounded border border-gray-200 px-1.5 py-0.5"><Text className="text-[9px] font-bold text-gray-500">This Year</Text></View>
                </View>
                <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <Text className="text-[9px] font-semibold text-gray-400 mb-4">Planned vs Actual % progress across disciplines</Text>
                    {data.discipline_progress.map((item: any, idx: number) => (
                        <View key={idx} className={`${idx !== data.discipline_progress.length - 1 ? 'mb-4' : ''}`}>
                            <View className="flex-row justify-between mb-1.5">
                                <Text className="font-bold text-gray-700 text-xs">{item.name}</Text>
                                <Text className="text-[10px] font-bold text-gray-400">{item.progress_percentage}%</Text>
                            </View>
                            <View className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <View style={{ width: `${item.progress_percentage}%` }} className="h-full bg-blue-600 rounded-full" />
                            </View>
                            <View className="flex-row justify-between mt-1.5">
                                <View className="flex-row items-center"><View className="w-2 h-2 rounded-full bg-blue-600 mr-1" /><Text className="text-[9px] text-gray-400 font-semibold">{formatCompactCurrency(item.planned_cost)} planned</Text></View>
                                <View className="flex-row items-center"><View className="w-2 h-2 rounded-full bg-red-600 mr-1" /><Text className="text-[9px] text-gray-400 font-semibold">{formatCompactCurrency(item.actual_cost)} actual</Text></View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Master Projects Overview List */}
            <View className="px-4 mt-6">
                <Text className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest pl-1">Master Projects Overview</Text>

                {data.master_projects.map((project: any, idx: number) => (
                    <View key={project.id} className={`bg-white p-4 ${idx === 0 ? 'rounded-t-xl' : ''} ${idx === data.master_projects.length - 1 ? 'rounded-b-xl border-b-0' : 'border-b border-gray-100'} border-x border-t border-gray-100 shadow-sm mb-1`}>
                        <View className="flex-row justify-between items-start mb-2">
                            <View>
                                <Text className="text-sm font-bold text-gray-800">{project.name}</Text>
                                <Text className="text-[10px] text-gray-500 font-medium mt-0.5">{project.start_date} TO 2026-12-01</Text>
                            </View>
                            <View className={`px-2 py-1 flex-row items-center rounded border ${project.health === 'On Track' ? 'bg-green-50 border-green-200' :
                                project.health === 'Delayed' ? 'bg-red-50 border-red-200' :
                                    project.health === 'COMPLETED' ? 'bg-blue-50 border-blue-200' :
                                        'bg-amber-50 border-amber-200'
                                }`}>
                                <Text className={`text-[9px] font-bold uppercase tracking-wider ${project.health === 'On Track' ? 'text-green-600' :
                                    project.health === 'Delayed' ? 'text-red-600' :
                                        project.health === 'COMPLETED' ? 'text-blue-600' :
                                            'text-amber-600'
                                    }`}>
                                    {project.health}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between items-center">
                            <View className="flex-1 mr-4">
                                <View className="h-1.5 w-full rounded-full overflow-hidden bg-transparent">
                                    <View style={{ width: `${project.progress}%` }} className={`h-full rounded-full ${project.health === 'On Track' ? 'bg-green-600' :
                                        project.health === 'Delayed' ? 'bg-red-600' :
                                            project.health === 'COMPLETED' ? 'bg-blue-500' :
                                                'bg-amber-500'
                                        }`} />
                                </View>
                            </View>
                            <Text className="text-[10px] text-gray-500 font-bold w-10 text-right">{project.progress}%</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Activity Pulse Feed */}
            <View className="px-4 mt-6 mb-10">
                <Text className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest pl-1">Activity Pulse</Text>
                <View className="bg-white rounded-xl py-2 shadow-sm border border-gray-100">
                    {data.recent_activities.map((activity: any, idx: number) => {
                        let IconComponent = Bell;
                        let iconColor = "#1F2937";

                        if (activity.type === 'Invoice') { IconComponent = FileText; iconColor = "#f59e0b"; }
                        if (activity.type === 'Delete') { IconComponent = Trash2; iconColor = "#DC2626"; }
                        if (activity.type === 'Task') { IconComponent = HardHat; iconColor = "#2563EB"; }
                        if (activity.type === 'System') { IconComponent = AlertTriangle; iconColor = "#f59e0b"; }

                        return (
                            <View key={activity.id} className={`flex-row gap-3 items-center px-4 py-2.5 ${idx !== data.recent_activities.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                <View className={`p-1 mt-0.5`}>
                                    <IconComponent size={14} color={iconColor} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-gray-700 leading-tight">{activity.description}</Text>
                                    <Text className="text-[9px] text-gray-400 font-semibold mt-0.5">{activity.timestamp}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>

        </ScrollView>
    );
}
