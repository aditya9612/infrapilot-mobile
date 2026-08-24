import { useNavigation, useRouter } from 'expo-router';
import { Menu, Activity, AlertCircle, Package, Users, CheckCircle2, CircleDashed, CheckCircle, Clock } from 'lucide-react-native';
import TopHeader from '../../components/TopHeader';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import { dashboardService, EngineerDashboardData } from '../../services/dashboardService';
import CircularProgress from '../../components/CircularProgress';

export default function EngineerDashboard() {
    const router = useRouter();
    const navigation = useNavigation();
    const [data, setData] = useState<EngineerDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetching for project ID '1' as placeholder
                const result = await dashboardService.getEngineerDashboard('1');
                setData(result);
            } catch (error) {
                console.error("Failed to fetch dashboard data. Using mock data instead.", error);
                // Fallback Mock Data if API fails
                setData({
                    project_overview: {
                        name: 'SARA CITY',
                        description: 'Real-time site progress, labor, and material monitoring.'
                    },
                    vitals: {
                        total_labour: 1, skilled_labour: 0, unskilled_labour: 0,
                        active_activities: 0, open_issues: 13, high_priority_issues: 3,
                        material_stock_status: 23, in_stock: 16, low_out_stock: 7
                    },
                    today_work_summary: [],
                    overall_progress: {
                        completed_percentage: 26.65, planned_percentage: 21.64, variance_percentage: 5.01
                    },
                    discipline_wise_completion: [
                        { name: 'General', planned_percentage: 0, actual_percentage: 35.83 },
                        { name: 'Construction', planned_percentage: 0, actual_percentage: 30 },
                        { name: 'Civil work', planned_percentage: 0, actual_percentage: 5 }
                    ],
                    project_phase_timeline: [
                        { id: 1, phase_name: 'Foundation Work Completion', start_date: '2026-06-20', end_date: '2026-06-15', status: 'PLANNED' },
                        { id: 2, phase_name: 'Site Handover', start_date: '2026-07-16', end_date: '2026-07-17', status: 'COMPLETED' },
                        { id: 3, phase_name: 'site clean', start_date: '2026-07-18', end_date: '2026-07-17', status: 'DELAYED' },
                        { id: 4, phase_name: 'Project Planning & Approval', start_date: '2026-08-11', end_date: '2026-08-31', status: 'IN_PROGRESS' },
                        { id: 5, phase_name: 'Plinth Beam / Plinth Work', start_date: '2026-08-11', end_date: '2026-09-11', status: 'DELAYED' }
                    ],
                    expense_register: {
                        total_spent: 3527.86, labour_spent: 1527.87, material_spent: 1000, equipment_spent: 0,
                        expenses: [
                            { id: '1', date: '2026-08-19', type: 'EXPENSE', category: 'Labour', note: 'Labour expense', amount: 571.62 },
                            { id: '2', date: '2026-08-17', type: 'EXPENSE', category: 'Labour', note: 'Labour expense', amount: 727.81 },
                            { id: '3', date: '2026-08-14', type: 'EXPENSE', category: 'Travel', note: 'jhgd/kjdsgflgsdlfhdsll', amount: 999.99 },
                            { id: '4', date: '2026-08-14', type: 'EXPENSE', category: 'Material', note: 'gvvchjdaadhfv', amount: 1000.00 },
                            { id: '5', date: '2026-08-12', type: 'EXPENSE', category: 'Labour', note: 'Labour expense', amount: 228.44 }
                        ]
                    }
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !data) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-4 text-gray-500 font-medium">Loading Dashboard...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50 flex-col">
            {/* Header */}
            <TopHeader title="Dashboard" subtitle="Engineer • Overview • Status" />

            <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Project Header */}
                <View className="mb-6">
                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">PROJECT</Text>
                    <Text className="text-2xl font-extrabold text-gray-800">{data.project_overview.name}</Text>
                    <Text className="text-sm text-gray-500 mt-1">{data.project_overview.description}</Text>
                </View>

                {/* Vitals */}
                <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">SITE VITALS</Text>
                <View className="flex-row flex-wrap justify-between mb-6">
                    <VitalCard title="TOTAL LABOUR" value={data.vitals.total_labour} subtitle={`${data.vitals.skilled_labour} Skilled • ${data.vitals.unskilled_labour} Unskilled`} color="text-blue-600" />
                    <VitalCard title="ACTIVE ACTIVITIES" value={data.vitals.active_activities} subtitle="Real-Time Active Tracking" color="text-blue-600" />
                    <VitalCard title="OPEN ISSUES" value={data.vitals.open_issues} subtitle={`${data.vitals.high_priority_issues} High Priority`} color="text-red-500" />
                    <VitalCard title="MATERIAL STOCK" value={data.vitals.material_stock_status} subtitle={`${data.vitals.in_stock} In Stock • ${data.vitals.low_out_stock} Low/Out`} color="text-green-500" />
                </View>

                {/* Main Progress Section */}
                <View className="flex-col md:flex-row mb-8 gap-4">
                    {/* Today's Work Summary */}
                    <View className="flex-1 bg-white p-5 rounded-xl shadow-sm border border-gray-100 min-h-[250px]">
                        <View className="flex-row justify-between items-center mb-4">
                            <View>
                                <Text className="font-bold text-gray-800 text-lg">Today's Work Summary</Text>
                                <Text className="text-xs text-gray-500">Live activity log</Text>
                            </View>
                            <View className="bg-blue-50 px-3 py-1 rounded-full flex-row items-center">
                                <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                                <Text className="text-xs font-bold text-blue-600">LIVE</Text>
                            </View>
                        </View>
                        {data.today_work_summary.length === 0 ? (
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-gray-400 italic">No activities recorded today.</Text>
                            </View>
                        ) : null}
                    </View>

                    {/* Overall Progress */}
                    <View className="w-full md:w-1/3 bg-white p-5 rounded-xl shadow-sm border border-gray-100 min-h-[250px] items-center">
                        <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">OVERALL PROGRESS</Text>
                        <CircularProgress percentage={data.overall_progress.completed_percentage} radius={60} strokeWidth={12} color="#3b82f6" unfilledColor="#e5e7eb" />
                        
                        <View className="flex-row justify-between w-full mt-8 bg-gray-50 rounded-lg p-3">
                            <View>
                                <Text className="text-xs text-gray-500 font-medium">Planned</Text>
                                <Text className="text-sm font-bold text-gray-800">{data.overall_progress.planned_percentage}%</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-xs text-gray-500 font-medium">Variance</Text>
                                <Text className="text-sm font-bold text-green-500">+{data.overall_progress.variance_percentage}%</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Discipline Progress */}
                <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">WORK PROGRESS %</Text>
                <View className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <View className="flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                        <View className="w-full sm:w-auto">
                            <Text className="font-bold text-gray-800 text-lg">Discipline-wise Completion</Text>
                            <Text className="text-xs text-gray-500">Actual vs. planned progress per work category</Text>
                        </View>
                        <View className="bg-blue-50 px-3 py-1 rounded-full mt-2 sm:mt-0 self-start sm:self-auto">
                            <Text className="text-xs font-bold text-blue-600">{data.overall_progress.completed_percentage}% OVERALL</Text>
                        </View>
                    </View>

                    {data.discipline_wise_completion.map((disc: any, idx: number) => (
                        <View key={idx} className="mb-5">
                            <View className="flex-row justify-between mb-1">
                                <Text className="text-sm font-bold text-gray-700">{disc.name}</Text>
                                <Text className="text-xs font-medium text-gray-500">
                                    Planned: {disc.planned_percentage}%  <Text className="text-green-600 font-bold">Actual: {disc.actual_percentage}%</Text>
                                </Text>
                            </View>
                            <View className="h-3 bg-gray-100 rounded-full w-full overflow-hidden relative">
                                <View style={{ width: `${disc.actual_percentage}%` }} className="absolute h-full bg-blue-500 rounded-full z-10" />
                                <View style={{ width: `${disc.planned_percentage}%` }} className="absolute h-full bg-gray-300 rounded-full z-0" />
                            </View>
                            <View className="flex-row justify-between mt-1">
                                <Text className="text-[10px] text-gray-400">0%</Text>
                                <Text className="text-[10px] text-gray-400">100%</Text>
                            </View>
                        </View>
                    ))}
                    <View className="flex-row items-center mt-2">
                        <View className="w-3 h-3 rounded bg-gray-300 mr-2" /><Text className="text-xs text-gray-500 mr-4">Planned</Text>
                        <View className="w-3 h-3 rounded bg-blue-500 mr-2" /><Text className="text-xs text-gray-500">Actual</Text>
                    </View>
                </View>

                {/* Timeline */}
                <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">TIMELINE TRACKING</Text>
                <View className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <View className="flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                        <View className="w-full sm:w-auto">
                            <Text className="font-bold text-gray-800 text-lg">Project Phase Timeline</Text>
                            <Text className="text-xs text-gray-500">Milestone progress and completion status</Text>
                        </View>
                        <View className="bg-green-50 px-3 py-1 rounded-full mt-2 sm:mt-0 self-start sm:self-auto">
                            <Text className="text-xs font-bold text-green-600">2/23 PHASES DONE</Text>
                        </View>
                    </View>

                    {data.project_phase_timeline.map((phase: any, idx: number) => (
                        <View key={idx} className="flex-row items-start mb-6 border-b border-gray-50 pb-4">
                            <View className="mr-4 mt-1">
                                {phase.status === 'COMPLETED' ? (
                                    <View className="w-8 h-8 rounded-full bg-green-500 items-center justify-center"><CheckCircle size={16} color="white" /></View>
                                ) : phase.status === 'IN_PROGRESS' ? (
                                    <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center"><Text className="text-white font-bold text-xs">{phase.id}</Text></View>
                                ) : (
                                    <View className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 items-center justify-center"><Text className="text-gray-400 font-bold text-xs">{phase.id}</Text></View>
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className={`text-base font-bold ${phase.status === 'COMPLETED' ? 'text-gray-800' : 'text-gray-700'}`}>{phase.phase_name}</Text>
                                <Text className="text-xs text-gray-400 mt-1">{phase.start_date} → {phase.end_date}</Text>
                            </View>
                            <View className="ml-4 justify-center">
                                <StatusBadge status={phase.status} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Expense Tracking */}
                <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">SITE-WISE EXPENSE TRACKING</Text>
                <View className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <View className="flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-3">
                        <View className="w-full sm:w-auto">
                            <Text className="font-bold text-gray-800 text-lg">Expense Register</Text>
                            <Text className="text-xs text-gray-500">All site-related expenditure records</Text>
                        </View>
                        <View className="items-start sm:items-end mt-2 sm:mt-0">
                            <Text className="text-xs font-bold text-gray-500 uppercase">Total Spent</Text>
                            <Text className="text-xl font-extrabold text-gray-800">₹{data.expense_register.total_spent.toLocaleString()}</Text>
                        </View>
                    </View>

                    <View className="flex-row flex-wrap gap-x-4 gap-y-2 mb-6">
                        <Text className="text-sm font-bold text-blue-600">Labour ₹{data.expense_register.labour_spent.toLocaleString()}</Text>
                        <Text className="text-sm font-bold text-green-600">Material ₹{data.expense_register.material_spent.toLocaleString()}</Text>
                        <Text className="text-sm font-bold text-orange-500">Equipment ₹{data.expense_register.equipment_spent.toLocaleString()}</Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full">
                        <View className="min-w-[500px] w-full">
                            {/* Table Header */}
                            <View className="flex-row justify-between py-3 border-b border-gray-200">
                                <Text className="text-xs font-bold text-gray-400 uppercase w-[20%]">Date</Text>
                                <Text className="text-xs font-bold text-gray-400 uppercase w-[20%]">Category</Text>
                                <Text className="text-xs font-bold text-gray-400 uppercase w-[40%]">Note</Text>
                                <Text className="text-xs font-bold text-gray-400 uppercase w-[20%] text-right">Amount</Text>
                            </View>

                            {/* Table Rows */}
                            {data.expense_register.expenses.map((expense: any, idx: number) => (
                                <View key={idx} className="flex-row justify-between py-4 border-b border-gray-50 items-center">
                                    <Text className="text-xs font-medium text-gray-700 w-[20%]">{expense.date}</Text>
                                    <Text className="text-xs font-medium text-gray-700 w-[20%]">{expense.category}</Text>
                                    <Text className="text-xs text-gray-500 w-[40%] pr-2" numberOfLines={2}>{expense.note}</Text>
                                    <Text className="text-sm font-bold text-gray-800 w-[20%] text-right">₹{expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                                </View>
                            ))}
                            
                            <View className="flex-row justify-between py-4 mt-2 border-t-2 border-gray-100">
                                <Text className="text-sm font-bold text-gray-400 uppercase">Total Expenditure</Text>
                                <Text className="text-lg font-bold text-blue-600">₹{data.expense_register.total_spent.toLocaleString()}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>

            </ScrollView>
        </View>
    );
}

// Helper Components
function VitalCard({ title, value, subtitle, color }: { title: string, value: number, subtitle: string, color: string }) {
    return (
        <View className="w-[48%] md:w-[23%] bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</Text>
            <Text className={`text-3xl font-extrabold ${color} mb-1`}>{value}</Text>
            <Text className="text-[10px] text-gray-500 font-medium">{subtitle}</Text>
        </View>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'COMPLETED':
            return <View className="bg-green-50 px-2 py-1 rounded"><Text className="text-[10px] font-bold text-green-600 uppercase">COMPLETED</Text></View>;
        case 'IN_PROGRESS':
            return <View className="bg-blue-50 px-2 py-1 rounded"><Text className="text-[10px] font-bold text-blue-600 uppercase">IN_PROGRESS</Text></View>;
        case 'DELAYED':
            return <View className="bg-red-50 px-2 py-1 rounded"><Text className="text-[10px] font-bold text-red-600 uppercase">DELAYED</Text></View>;
        case 'PLANNED':
        default:
            return <View className="bg-gray-100 px-2 py-1 rounded"><Text className="text-[10px] font-bold text-gray-600 uppercase">PLANNED</Text></View>;
    }
}
