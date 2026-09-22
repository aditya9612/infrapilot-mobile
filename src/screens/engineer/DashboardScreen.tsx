import { useNavigation, useRouter } from 'expo-router';
import { CloudRain, CheckCircle, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react-native';
import TopHeader from '../../components/TopHeader';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { dashboardService, EngineerDashboardData } from '../../services/dashboardService';
import CircularProgress from '../../components/CircularProgress';
import { useProjectContext } from '../../contexts/ProjectContext';

export default function EngineerDashboard() {
    const router = useRouter();
    const navigation = useNavigation();
    const [data, setData] = useState<EngineerDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { activeProjectId, loading: contextLoading } = useProjectContext();

    // Pagination states
    const [timelinePage, setTimelinePage] = useState(1);
    const [timelinePerPage, setTimelinePerPage] = useState(5);
    const [showTimelineDropdown, setShowTimelineDropdown] = useState(false);

    const [expensePage, setExpensePage] = useState(1);
    const [expensePerPage, setExpensePerPage] = useState(10);
    const [showExpenseDropdown, setShowExpenseDropdown] = useState(false);

    const MOCK_DATA: any = {
        project_id: 1,
        project_name: 'METRO CITY',
        status: 'Active',
        progress: 24.74,
        planned_progress: 9.43,
        variance: 15.31,
        vitals: {
            total_labour_today: 1,
            active_activities: 1,
            open_issues: { total: 17, high_priority: 3 },
            material_stock_status: [{ category: 'Cement', status: 'Low' }]
        },
        today_work_summary: [
            { activity_name: 'kkkkkkkkkkkkkkkkkk', start_time: 'TBA', finish_time: 'TBA', status: 'ON_TRACK', ui_status: 'IN_PROGRESS' }
        ],
        discipline_progress: [
            { discipline: 'Construction', planned_percent: 0, actual_percent: 40.03 },
            { discipline: 'Yes', planned_percent: 0, actual_percent: 10.5 },
            { discipline: 'Civil work', planned_percent: 0, actual_percent: 65 },
            { discipline: 'Pending Work', planned_percent: 0, actual_percent: 50 }
        ],
        timeline: [
            { id: 1, title: 'mildstone for plumbing', start_date: '2026-09-01', end_date: '2026-09-20', status: 'DELAYED' },
            { id: 2, title: 'Plinth Work Completed', start_date: '2026-09-01', end_date: '2026-09-02', status: 'DELAYED' },
            { id: 3, title: 'site mapping', start_date: '2026-09-01', end_date: '2026-09-10', status: 'PLANNED' },
            { id: 4, title: 'stone mildstone', start_date: '2026-09-01', end_date: '2026-09-20', status: 'IN_PROGRESS' },
            { id: 5, title: 'Ground Floor Slab Completed', start_date: '2026-09-03', end_date: '2026-09-10', status: 'DELAYED' },
            { id: 6, title: 'Roofing Work', start_date: '2026-09-15', end_date: '2026-09-25', status: 'PLANNED' },
            { id: 7, title: 'Electrical Wiring', start_date: '2026-09-20', end_date: '2026-10-05', status: 'PLANNED' }
        ],
        recent_expenses: [
            { date: '2026-09-16', type: 'EXPENSE', category: 'Labour', note: 'Labour expense - 2026-09-16', amount: 674 },
            { date: '2026-09-16', type: 'EXPENSE', category: 'equipment', note: 'null', amount: 1000 },
            { date: '2026-09-16', type: 'EXPENSE', category: 'Labour Advance', note: 'done', amount: 200 },
            { date: '2026-09-16', type: 'EXPENSE', category: 'Labour Advance', note: 'personal', amount: 10 },
            { date: '2026-09-16', type: 'EXPENSE', category: 'Labour Advance', note: 'peersonal', amount: 10 },
            { date: '2026-09-17', type: 'EXPENSE', category: 'Material', note: 'Cement bags', amount: 5000 },
            { date: '2026-09-18', type: 'EXPENSE', category: 'Labour', note: 'Weekly payout', amount: 3200 }
        ],
        weather: { temp: '31°C', condition: 'Thunderstorm', humidity: '54%', wind: '2 km/h' }
    };

    const fetchData = async (isRefetch = false) => {
        if (!activeProjectId) return;
        if (isRefetch) setRefreshing(true);
        else setLoading(true);
        try {
            const result = await dashboardService.getEngineerDashboard(activeProjectId.toString());
            setData(MOCK_DATA); 
        } catch (error: any) {
            setData(MOCK_DATA);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (activeProjectId) {
            fetchData();
        }
    }, [activeProjectId]);

    if ((loading || contextLoading) && !refreshing) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-4 text-gray-500 font-medium">Loading Site Engineer Dashboard...</Text>
            </View>
        );
    }

    if (!data) return null;

    // Derived states
    const totalSpent = data.recent_expenses?.reduce((sum: number, item: any) => sum + item.amount, 0) || 0;
    const labourSpent = data.recent_expenses?.filter((e: any) => e.category?.toLowerCase().includes('labour')).reduce((sum: number, item: any) => sum + item.amount, 0) || 0;
    const materialSpent = data.recent_expenses?.filter((e: any) => e.category?.toLowerCase().includes('material')).reduce((sum: number, item: any) => sum + item.amount, 0) || 0;
    const equipmentSpent = data.recent_expenses?.filter((e: any) => e.category?.toLowerCase().includes('equipment')).reduce((sum: number, item: any) => sum + item.amount, 0) || 0;

    // Pagination computations
    const timelineData = data.timeline || [];
    const timelineTotalPages = Math.ceil(timelineData.length / timelinePerPage);
    const paginatedTimeline = timelineData.slice((timelinePage - 1) * timelinePerPage, timelinePage * timelinePerPage);

    const expenseData = data.recent_expenses || [];
    const expenseTotalPages = Math.ceil(expenseData.length / expensePerPage);
    const paginatedExpenses = expenseData.slice((expensePage - 1) * expensePerPage, expensePage * expensePerPage);

    return (
        <View className="flex-1 bg-gray-50 flex-col">
            <TopHeader title="Dashboard" subtitle="Engineer • Overview • Status" />

            <ScrollView
                className="flex-1 px-3 sm:px-4 py-4 sm:py-6"
                contentContainerStyle={{ paddingBottom: 60 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchData(true)} colors={['#3b82f6']} />}
            >
                {/* Project Header & Weather */}
                <View className="flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                    <View className="w-full lg:w-auto flex-shrink">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mb-1">PROJECT</Text>
                        <Text className="text-2xl sm:text-3xl font-extrabold text-gray-800">{data.project_name}</Text>
                        <Text className="text-xs sm:text-sm text-gray-500 mt-1">Real-time site progress, labor, and material monitoring.</Text>
                    </View>
                    <View className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 flex-row items-center gap-3 w-full lg:w-auto">
                        <View className="bg-purple-50 p-2 rounded-full">
                            <CloudRain size={24} color="#a855f7" />
                        </View>
                        <View className="flex-1 lg:flex-none">
                            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">WEATHER - LIVE</Text>
                            <Text className="text-xs sm:text-sm font-bold text-gray-800">{data.weather?.condition}, {data.weather?.temp}</Text>
                            <Text className="text-[10px] sm:text-[11px] text-gray-400" numberOfLines={1}>Humidity {data.weather?.humidity} - Wind {data.weather?.wind}</Text>
                        </View>
                    </View>
                </View>

                {/* Vitals */}
                <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-[2px] mb-4">SITE VITALS</Text>
                <View className="flex-row flex-wrap justify-between gap-y-4 mb-8">
                    <VitalCard title="TOTAL LABOUR" value="1" subtitle="0 Skilled - 0 Unskilled" colorHex="#3b82f6" />
                    <VitalCard title="ACTIVE ACTIVITIES" value="1" subtitle="Real-Time Active Tracking" colorHex="#3b82f6" />
                    <VitalCard title="OPEN ISSUES" value="17" subtitle="3 High Priority" colorHex="#ef4444" />
                    <VitalCard title="MATERIAL STOCK" value="9" subtitle="5 In Stock - 4 Low/Out" colorHex="#10b981" />
                </View>

                {/* Main Progress Section */}
                <View className="flex-col lg:flex-row mb-8 gap-4">
                    {/* Today's Work Summary */}
                    <View className="flex-1 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                        <View className="flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                            <View>
                                <Text className="font-extrabold text-gray-800 text-lg">Today's Work Summary</Text>
                                <Text className="text-xs text-gray-400 mt-1">Live activity log - Monday, 21 September</Text>
                            </View>
                            <View className="bg-blue-50 px-3 py-1 rounded-full flex-row items-center self-start sm:self-auto">
                                <Text className="text-[10px] font-bold text-blue-600">1 LIVE</Text>
                            </View>
                        </View>
                        
                        <View className="bg-gray-50 rounded-xl p-4">
                            <View className="flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                                <Text className="text-sm font-bold text-gray-800" numberOfLines={2}>kkkkkkkkkkkkkkkkkk</Text>
                                <View className="bg-blue-100 px-2 py-1 rounded self-start sm:self-auto">
                                    <Text className="text-[10px] font-bold text-blue-600">In Progress</Text>
                                </View>
                            </View>
                            <Text className="text-xs text-gray-500 mb-4">Start: TBA - Finish: TBA</Text>
                            <Text className="text-xs font-bold text-gray-500">Status: <Text className="text-emerald-500">ON_TRACK</Text></Text>
                        </View>
                    </View>

                    {/* Overall Progress */}
                    <View className="w-full lg:w-[35%] bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 items-center justify-center">
                        <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-[2px] mb-6">OVERALL PROGRESS</Text>
                        <View className="relative items-center justify-center mb-6">
                            {/* CircularProgress already renders the text inside it natively, so we removed the duplicate absolute View */}
                            <CircularProgress percentage={data.progress || 0} radius={65} strokeWidth={12} color="#2563eb" unfilledColor="#f1f5f9" />
                        </View>
                        
                        <View className="flex-row justify-between w-full bg-gray-50 rounded-xl p-4">
                            <View className="flex-1">
                                <Text className="text-[10px] font-bold text-gray-400 mb-1">Planned</Text>
                                <Text className="text-sm font-bold text-gray-800">{data.planned_progress}%</Text>
                            </View>
                            <View className="flex-1 items-end">
                                <Text className="text-[10px] font-bold text-gray-400 mb-1">Variance</Text>
                                <Text className="text-sm font-bold text-emerald-500">+{data.variance}%</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Discipline Progress */}
                <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-[2px] mb-4">WORK PROGRESS %</Text>
                <View className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <View className="flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                        <View className="flex-1">
                            <Text className="font-extrabold text-gray-800 text-lg">Discipline-wise Completion</Text>
                            <Text className="text-xs text-gray-400 mt-1">Actual vs. planned progress per work category</Text>
                        </View>
                        <View className="bg-blue-50 px-3 py-1 rounded-full self-start sm:self-auto">
                            <Text className="text-[10px] font-bold text-blue-600">{data.progress}% OVERALL</Text>
                        </View>
                    </View>

                    {data.discipline_progress?.map((disc: any, idx: number) => {
                        const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-cyan-500', 'bg-orange-500'];
                        const barColor = colors[idx % colors.length];
                        return (
                            <View key={idx} className="mb-6">
                                <View className="flex-col sm:flex-row justify-between mb-2 gap-1">
                                    <Text className="text-sm font-bold text-gray-800">{disc.discipline}</Text>
                                    <Text className="text-[11px] font-bold text-gray-400">
                                        Planned: {disc.planned_percent}%  <Text className="text-emerald-500 ml-2">Actual: {disc.actual_percent}%</Text>
                                    </Text>
                                </View>
                                <View className="h-[10px] bg-gray-100 rounded-full w-full overflow-hidden">
                                    <View style={{ width: `${disc.actual_percent}%` }} className={`h-full ${barColor} rounded-full`} />
                                </View>
                                <View className="flex-row justify-between mt-2">
                                    <Text className="text-[10px] text-gray-300">0%</Text>
                                    <Text className="text-[10px] text-gray-300">100%</Text>
                                </View>
                            </View>
                        );
                    })}
                    
                    <View className="flex-row items-center mt-2">
                        <View className="w-3 h-3 rounded-full bg-gray-200 mr-2" /><Text className="text-xs text-gray-400 font-medium mr-6">Planned</Text>
                        <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" /><Text className="text-xs text-gray-400 font-medium">Actual</Text>
                    </View>
                </View>

                {/* Timeline */}
                <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-[2px] mb-4">TIMELINE TRACKING</Text>
                <View className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 z-20">
                    <View className="flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
                        <View className="flex-1">
                            <Text className="font-extrabold text-gray-800 text-lg">Project Phase Timeline</Text>
                            <Text className="text-xs text-gray-400 mt-1">Milestone progress and completion status</Text>
                        </View>
                        <View className="bg-emerald-50 px-3 py-1 rounded-full self-start sm:self-auto">
                            <Text className="text-[10px] font-bold text-emerald-600">1/11 PHASES DONE</Text>
                        </View>
                    </View>

                    {paginatedTimeline.map((phase: any, idx: number) => {
                        const isLast = idx === paginatedTimeline.length - 1;
                        const isBlue = phase.status === 'IN_PROGRESS';
                        return (
                            <View key={idx} className="flex-row items-start relative">
                                {!isLast && <View className="absolute left-[15px] top-8 bottom-[-16px] w-[2px] bg-gray-100" />}
                                
                                <View className="mr-3 sm:mr-4 z-10 bg-white py-1">
                                    <View className="w-8 h-8 rounded-full items-center justify-center" style={isBlue ? { backgroundColor: '#2563eb' } : { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb' }}>
                                        <Text className="text-xs font-bold" style={{ color: isBlue ? '#ffffff' : '#9ca3af' }}>{phase.id}</Text>
                                    </View>
                                </View>
                                
                                <View className="flex-1 flex-col sm:flex-row justify-between items-start sm:items-center pb-6 gap-2" style={!isLast ? { borderBottomWidth: 1, borderBottomColor: '#f9fafb' } : {}}>
                                    <View className="flex-1 pr-2">
                                        <Text className="text-sm font-extrabold text-gray-800">{phase.title}</Text>
                                        <Text className="text-[11px] text-gray-400 font-medium mt-1">{phase.start_date} → {phase.end_date}</Text>
                                    </View>
                                    <TimelineBadge status={phase.status} />
                                </View>
                            </View>
                        );
                    })}

                    <View className="flex-col sm:flex-row gap-4 items-center mt-6 pt-6 border-t border-gray-100 justify-between">
                        <View className="flex-row items-center w-full justify-between sm:w-auto relative">
                            <Text className="text-xs text-gray-500 mr-2">Records/page:</Text>
                            <TouchableOpacity onPress={() => setShowTimelineDropdown(!showTimelineDropdown)} className="flex-row items-center bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                <Text className="text-xs font-bold mr-2">{timelinePerPage}</Text>
                                <ChevronDown size={14} color="#9CA3AF" />
                            </TouchableOpacity>
                            {showTimelineDropdown && (
                                <View className="absolute top-10 right-0 w-24 bg-white border border-gray-200 rounded shadow-sm z-50" style={{ elevation: 5 }}>
                                    {[5, 10, 20].map(val => (
                                        <TouchableOpacity key={val} onPress={() => { setTimelinePerPage(val); setTimelinePage(1); setShowTimelineDropdown(false); }} className="px-3 py-2 border-b border-gray-50">
                                            <Text className="text-xs text-gray-700">{val}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                        <Text className="text-xs text-gray-400 text-center flex-1">
                            Showing {(timelinePage - 1) * timelinePerPage + 1} - {Math.min(timelinePage * timelinePerPage, timelineData.length)} of {timelineData.length} records
                        </Text>
                        <View className="flex-row items-center gap-1 justify-center w-full sm:w-auto">
                            <TouchableOpacity disabled={timelinePage === 1} onPress={() => setTimelinePage(Math.max(1, timelinePage - 1))} className="w-8 h-8 rounded items-center justify-center border" style={timelinePage === 1 ? { backgroundColor: '#f3f4f6', borderColor: '#f3f4f6', opacity: 0.5 } : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                                <ChevronLeft size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                            {[...Array(timelineTotalPages)].map((_, i) => (
                                <TouchableOpacity key={i} onPress={() => setTimelinePage(i + 1)} className="w-8 h-8 rounded items-center justify-center" style={timelinePage === i + 1 ? { backgroundColor: '#2563eb' } : { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb' }}>
                                    <Text className="text-xs font-bold" style={{ color: timelinePage === i + 1 ? '#ffffff' : '#4b5563' }}>{i + 1}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity disabled={timelinePage === timelineTotalPages} onPress={() => setTimelinePage(Math.min(timelineTotalPages, timelinePage + 1))} className="w-8 h-8 rounded items-center justify-center border" style={timelinePage === timelineTotalPages ? { backgroundColor: '#f3f4f6', borderColor: '#f3f4f6', opacity: 0.5 } : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                                <ChevronRight size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Expense Tracking */}
                <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-[2px] mb-4">SITE-WISE EXPENSE TRACKING</Text>
                <View className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 z-10">
                    <View className="flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-3">
                        <View className="flex-1">
                            <Text className="font-extrabold text-gray-800 text-lg">Expense Register</Text>
                            <Text className="text-xs text-gray-400 mt-1">All site-related expenditure records</Text>
                        </View>
                        <View className="self-start sm:self-auto sm:items-end">
                            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Spent</Text>
                            <Text className="text-xl font-extrabold text-gray-800">₹{totalSpent.toLocaleString()}</Text>
                        </View>
                    </View>

                    <View className="flex-row flex-wrap gap-2 mb-6">
                        <View className="bg-blue-50 px-3 py-1.5 rounded-full"><Text className="text-[10px] sm:text-[11px] font-bold text-blue-600">Labour ₹{labourSpent.toLocaleString()}</Text></View>
                        <View className="bg-emerald-50 px-3 py-1.5 rounded-full"><Text className="text-[10px] sm:text-[11px] font-bold text-emerald-600">Material ₹{materialSpent.toLocaleString()}</Text></View>
                        <View className="bg-orange-50 px-3 py-1.5 rounded-full"><Text className="text-[10px] sm:text-[11px] font-bold text-orange-500">Equipment ₹{equipmentSpent.toLocaleString()}</Text></View>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="min-w-[600px] w-full">
                            <View className="flex-row justify-between py-3 border-b border-gray-100 mb-2">
                                <Text className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[20%]">DATE</Text>
                                <Text className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[20%]">TYPE</Text>
                                <Text className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[20%]">CATEGORY</Text>
                                <Text className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[30%]">NOTE</Text>
                                <Text className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[10%] text-right">AMOUNT</Text>
                            </View>

                            {paginatedExpenses.map((expense: any, idx: number) => (
                                <View key={idx} className="flex-row justify-between py-4 items-center">
                                    <Text className="text-xs font-bold text-gray-600 w-[20%]">{expense.date}</Text>
                                    <View className="w-[20%]">
                                        <View className="bg-gray-100 self-start px-2 py-1 rounded">
                                            <Text className="text-[10px] font-bold text-gray-600">{expense.type}</Text>
                                        </View>
                                    </View>
                                    <Text className="text-xs font-bold text-gray-800 w-[20%]">{expense.category}</Text>
                                    <Text className="text-xs text-gray-400 w-[30%] pr-4" numberOfLines={1}>{expense.note}</Text>
                                    <Text className="text-sm font-extrabold text-gray-800 w-[10%] text-right">₹{expense.amount}</Text>
                                </View>
                            ))}
                            
                            <View className="flex-row justify-between py-5 sm:py-6 mt-4 border-t border-gray-100 bg-gray-50/50 -mx-4 sm:-mx-6 px-4 sm:px-6 -mb-4 sm:-mb-6 rounded-b-2xl items-center">
                                <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">TOTAL EXPENDITURE</Text>
                                <Text className="text-base sm:text-lg font-extrabold text-blue-600">₹{totalSpent.toLocaleString()}</Text>
                            </View>
                        </View>
                    </ScrollView>

                    <View className="flex-col sm:flex-row gap-4 items-center mt-12 pt-6">
                        <View className="flex-row items-center w-full justify-between sm:w-auto relative">
                            <Text className="text-xs text-gray-500 mr-2">Records/page:</Text>
                            <TouchableOpacity onPress={() => setShowExpenseDropdown(!showExpenseDropdown)} className="flex-row items-center bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                <Text className="text-xs font-bold mr-2">{expensePerPage}</Text>
                                <ChevronDown size={14} color="#9CA3AF" />
                            </TouchableOpacity>
                            {showExpenseDropdown && (
                                <View className="absolute bottom-10 right-0 w-24 bg-white border border-gray-200 rounded shadow-sm z-50" style={{ elevation: 5 }}>
                                    {[5, 10, 20].map(val => (
                                        <TouchableOpacity key={val} onPress={() => { setExpensePerPage(val); setExpensePage(1); setShowExpenseDropdown(false); }} className="px-3 py-2 border-b border-gray-50">
                                            <Text className="text-xs text-gray-700">{val}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                        <Text className="text-xs text-gray-400 text-center flex-1">
                            Showing {(expensePage - 1) * expensePerPage + 1} - {Math.min(expensePage * expensePerPage, expenseData.length)} of {expenseData.length} records
                        </Text>
                        <View className="flex-row items-center gap-1 justify-center w-full sm:w-auto">
                            <TouchableOpacity disabled={expensePage === 1} onPress={() => setExpensePage(Math.max(1, expensePage - 1))} className="w-8 h-8 rounded items-center justify-center border" style={expensePage === 1 ? { backgroundColor: '#f3f4f6', borderColor: '#f3f4f6', opacity: 0.5 } : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                                <ChevronLeft size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                            {[...Array(expenseTotalPages)].map((_, i) => (
                                <TouchableOpacity key={i} onPress={() => setExpensePage(i + 1)} className="w-8 h-8 rounded items-center justify-center" style={expensePage === i + 1 ? { backgroundColor: '#2563eb' } : { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb' }}>
                                    <Text className="text-xs font-bold" style={{ color: expensePage === i + 1 ? '#ffffff' : '#4b5563' }}>{i + 1}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity disabled={expensePage === expenseTotalPages} onPress={() => setExpensePage(Math.min(expenseTotalPages, expensePage + 1))} className="w-8 h-8 rounded items-center justify-center border" style={expensePage === expenseTotalPages ? { backgroundColor: '#f3f4f6', borderColor: '#f3f4f6', opacity: 0.5 } : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                                <ChevronRight size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

            </ScrollView>
        </View>
    );
}

function VitalCard({ title, value, subtitle, colorHex }: { title: string, value: string, subtitle: string, colorHex: string }) {
    return (
        <View className="w-[48%] md:w-[23%] bg-white p-3 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex-shrink-0 flex-col justify-between">
            <Text className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">{title}</Text>
            <Text className="text-2xl sm:text-4xl font-extrabold mb-1 sm:mb-2" style={{ color: colorHex }}>{value}</Text>
            <Text className="text-[9px] sm:text-xs text-gray-400 font-medium">{subtitle}</Text>
        </View>
    );
}

function TimelineBadge({ status }: { status: string }) {
    if (status === 'DELAYED') return <View className="bg-red-50 px-3 py-1 rounded-full"><Text className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{status}</Text></View>;
    if (status === 'IN_PROGRESS') return <View className="bg-blue-50 px-3 py-1 rounded-full"><Text className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{status}</Text></View>;
    return <View className="bg-gray-100 px-3 py-1 rounded-full"><Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{status}</Text></View>;
}
