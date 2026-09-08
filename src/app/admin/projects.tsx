import { AlertTriangle, CheckCircle, FileText, Filter, Plus, Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { NewProjectModal } from '../../components/modals/NewProjectModal';
import { ProjectsDashboardData, projectService } from '../../services/projectService';

export default function ProjectsScreen() {
    const [data, setData] = useState<ProjectsDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [activityTab, setActivityTab] = useState('All');

    const loadData = async () => {
        const res = await projectService.getProjectsDashboard();
        setData(res);
    };

    useEffect(() => {
        loadData().finally(() => setLoading(false));
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    if (loading || !data) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="text-gray-500 font-medium mt-4">Loading Projects...</Text>
            </View>
        );
    }

    const getStatusType = (status: string) => {
        const s = status.toUpperCase();
        if (s.includes('DELAY')) return 'DELAYED';
        if (s.includes('COMPLET')) return 'COMPLETED';
        if (s.includes('HOLD')) return 'ON HOLD';
        if (s.includes('PLAN')) return 'PLANNED';
        return 'ONGOING';
    };

    const filterCounts: Record<string, number> = {
        'ALL': data.projects.length,
        'ONGOING': data.projects.filter(p => getStatusType(p.status) === 'ONGOING').length,
        'PLANNED': data.projects.filter(p => getStatusType(p.status) === 'PLANNED').length,
        'DELAYED': data.projects.filter(p => getStatusType(p.status) === 'DELAYED').length,
        'COMPLETED': data.projects.filter(p => getStatusType(p.status) === 'COMPLETED').length,
        'ON HOLD': data.projects.filter(p => getStatusType(p.status) === 'ON HOLD').length,
    };

    const filterChips = ['ALL', 'ONGOING', 'PLANNED', 'DELAYED', 'COMPLETED', 'ON HOLD'];

    const filteredProjects = data.projects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter.toUpperCase() === 'ALL' || getStatusType(p.status) === activeFilter.toUpperCase();
        return matchesSearch && matchesFilter;
    });

    const filteredActivities = data.activities.filter(a => {
        return activityTab === 'All' || a.type === activityTab;
    });

    return (
        <View className="flex-1 bg-gray-50 relative">
            <TopHeader title="Site / Project Management" subtitle="Real-time infrastructure projects and budget monitoring." />

            <ScrollView
                className="flex-1"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
            >
                {/* Top Action Buttons */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 pt-4 flex-row">
                    <TouchableOpacity
                        className="flex-row items-center bg-gray-900 rounded-full py-2 px-4 shadow-sm mr-2"
                        onPress={() => setIsNewProjectModalOpen(true)}
                    >
                        <Plus size={16} color="#FFFFFF" />
                        <Text className="text-white font-bold text-xs ml-1.5">New Project</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center bg-emerald-500 rounded-full py-2 px-3 shadow-sm mr-4">
                        <FileText size={14} color="#FFFFFF" />
                        <Text className="text-white font-bold text-xs ml-1.5">Convert Quotation</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Horizontal Stat Cards */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4 py-4 min-h-[90px]">
                    <View className="bg-white px-5 py-4 rounded-xl shadow-sm border border-gray-100 mr-3 w-[150px]">
                        <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Projects</Text>
                        <Text className="text-[28px] font-black text-[#2563EB]">{data.summary.total}</Text>
                        <Text className="text-[9px] text-gray-400 font-medium mt-1">Across all locations</Text>
                    </View>
                    <View className="bg-white px-5 py-4 rounded-xl shadow-sm border border-gray-100 mr-3 w-[150px]">
                        <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Ongoing Sites</Text>
                        <Text className="text-[28px] font-black text-green-500">{data.summary.ongoing}</Text>
                        <Text className="text-[9px] text-gray-400 font-medium mt-1">Currently in progress</Text>
                    </View>
                    <View className="bg-white px-5 py-4 rounded-xl shadow-sm border border-gray-100 mr-3 w-[150px]">
                        <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Completed</Text>
                        <Text className="text-[28px] font-black text-blue-500">{data.summary.completed}</Text>
                        <Text className="text-[9px] text-gray-400 font-medium mt-1">Successfully delivered</Text>
                    </View>
                    <View className="bg-white px-5 py-4 rounded-xl shadow-sm border border-gray-100 mr-4 w-[150px]">
                        <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Delayed</Text>
                        <Text className="text-[28px] font-black text-red-500">{data.summary.delayed}</Text>
                        <Text className="text-[9px] text-gray-400 font-medium mt-1">Needs urgent attention</Text>
                    </View>
                </ScrollView>

                {/* Search & Filters */}
                <View className="px-4 pb-2 z-10 bg-gray-50">
                    <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm mb-3">
                        <Search size={18} color="#9CA3AF" />
                        <TextInput
                            placeholder="Search project name..."
                            className="flex-1 ml-2 text-sm text-gray-800"
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <Filter size={18} color="#9CA3AF" />
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row pb-1">
                        {filterChips.map((chip, idx) => {
                            const isActive = activeFilter.toUpperCase() === chip;
                            return (
                                <Pressable
                                    key={idx}
                                    onPress={() => setActiveFilter(chip)}
                                    className={`flex-row items-center px-4 py-2 rounded-xl mr-2 shadow-sm ${isActive ? 'bg-[#2563EB]' : 'bg-gray-100'}`}
                                >
                                    <Text className={`text-[11px] font-black mr-2 ${isActive ? 'text-white' : 'text-gray-500'}`}>{chip}</Text>
                                    <View className={`px-2 py-[2px] rounded-lg ${isActive ? 'bg-[#60A5FA]' : 'bg-gray-200'}`}>
                                        <Text className={`text-[10px] font-black ${isActive ? 'text-white' : 'text-gray-500'}`}>{filterCounts[chip]}</Text>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Projects List */}
                <View className="px-4 py-4">
                    <View className="flex-row justify-between items-center mb-5 mt-2">
                        <Text className="text-lg font-black text-gray-800 tracking-tight">Project Progress</Text>
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filteredProjects.length} OF {data.projects.length} PROJECTS</Text>
                    </View>

                    {filteredProjects.length === 0 ? (
                        <View className="bg-white rounded-2xl p-6 items-center justify-center border border-dashed border-gray-300">
                            <Text className="text-gray-400 font-medium">No projects found.</Text>
                        </View>
                    ) : (
                        <View className="flex-row flex-wrap justify-between">
                            {filteredProjects.map((project, idx) => (
                                <TouchableOpacity
                                    key={project.id}
                                    className="bg-white rounded-2xl p-5 mb-3 shadow-sm border border-gray-50 w-full"
                                    activeOpacity={0.7}
                                >
                                    <View className="flex-row justify-between items-end mb-4">
                                        <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>{project.name}</Text>
                                        <Text className="text-xs font-bold text-gray-400">{project.progress}%</Text>
                                    </View>

                                    <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <View className="h-full rounded-full" style={{ width: `${project.progress}%`, backgroundColor: project.healthDotColor }} />
                                    </View>

                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center">
                                            <View className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: project.healthDotColor }} />
                                            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{getStatusType(project.status)}</Text>
                                        </View>
                                        <Text className="text-[11px] font-bold text-gray-500">{project.startDate}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Activity Feed */}
                <View className="px-4 pt-4 pb-28">
                    <View className="flex-row justify-between items-end mb-4 mt-2">
                        <Text className="text-lg font-black text-gray-800 tracking-tight">Project Activity</Text>
                        <View className="flex-row items-center border border-gray-100 rounded-lg p-0.5 bg-white shadow-sm">
                            <TouchableOpacity className="px-3 py-1 flex-row items-center">
                                <Text className="text-[10px] font-bold text-[#2563EB]">View All</Text>
                            </TouchableOpacity>
                            <View className="w-[1px] h-3 bg-gray-200 mx-1" />
                            {['All', 'Finance', 'Site'].map(tab => (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => setActivityTab(tab)}
                                    className={`px-3 py-1 rounded-md ${activityTab === tab ? 'bg-gray-100' : ''}`}
                                >
                                    <Text className={`text-[10px] font-bold ${activityTab === tab ? 'text-gray-800' : 'text-gray-400'}`}>{tab}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View className="bg-white/80 rounded-2xl shadow-sm border border-white p-5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                        {filteredActivities.length === 0 ? (
                            <View className="p-8 items-center border border-dashed border-gray-200 rounded-xl">
                                <Text className="text-gray-400 text-xs font-semibold">No recent activity.</Text>
                            </View>
                        ) : (
                            filteredActivities.map((act, idx) => {
                                const isLast = idx === filteredActivities.length - 1;

                                let iconColor = '#3B82F6';
                                let hexTint = '#EFF6FF'; // bg-blue-50
                                let IconCmp = CheckCircle;

                                if (act.accentColor === 'Red') {
                                    iconColor = '#EF4444'; hexTint = '#FEF2F2';
                                } else if (act.accentColor === 'Emerald') {
                                    iconColor = '#10B981'; hexTint = '#ECFDF5';
                                } else if (act.accentColor === 'Amber') {
                                    iconColor = '#F59E0B'; hexTint = '#FFFBEB';
                                }

                                if (act.iconType === 'Alert') IconCmp = AlertTriangle;
                                else if (act.iconType === 'Receipt') IconCmp = FileText;

                                return (
                                    <View key={act.id} className="flex-row relative z-10 w-full mb-1 min-h-[55px]">
                                        {/* Vertical Dashed Line */}
                                        {!isLast && (
                                            <View className="absolute left-[15px] top-[32px] bottom-[-16px] w-[2px] border-l-2 border-dashed border-gray-100 z-0" />
                                        )}

                                        {/* Circular Icon */}
                                        <View className="w-8 h-8 rounded-full items-center justify-center z-20 mt-1 mr-4 border border-gray-50" style={{ backgroundColor: hexTint }}>
                                            <IconCmp size={13} color={iconColor} strokeWidth={2.5} />
                                        </View>

                                        {/* Content Block */}
                                        <View className="flex-1 pt-1 pb-4 flex-row justify-between items-start">
                                            <View className="flex-1 pr-3">
                                                <Text className="text-[13px] font-bold text-gray-800 leading-snug">{act.description}</Text>
                                                <Text className="text-[10px] font-medium text-gray-400 mt-1">Updated by {act.user}</Text>
                                            </View>
                                            <View className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                                <Text className="text-[9px] font-black text-gray-400">{act.timestamp}</Text>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })
                        )}
                    </View>
                </View>
            </ScrollView>

            <NewProjectModal visible={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)} />
        </View>
    );
}