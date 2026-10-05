import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { Download, Plus, Search, Filter, Printer, Edit2, Trash2, EyeOff } from 'lucide-react-native';
import { useProjectContext } from '../../contexts/ProjectContext';
import { labourService } from '../../services/labourService';

export default function LabourRegistryScreen() {
    const { activeProjectId, projects } = useProjectContext();
    const activeProjectName = projects.find(p => String(p.id) === String(activeProjectId))?.name || 'All Projects';
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(true);
    const [labourList, setLabourList] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [skillSummary, setSkillSummary] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const pid = activeProjectId ? Number(activeProjectId) : undefined;
                
                const [labourRes, statsRes, skillRes] = await Promise.all([
                    labourService.getLabourList(pid),
                    labourService.getDashboardStats(pid),
                    labourService.getSkillSummary(pid)
                ]);
                
                setLabourList(labourRes || []);
                setStats(statsRes || {});
                setSkillSummary(skillRes || {});
            } catch (error) {
                console.error('Error fetching labour registry data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeProjectId]);

    const filteredList = labourList.filter((item: any) => 
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.employee_id || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View className="flex-1 bg-gray-50">
            <TopHeader 
                title="Personnel Registry" 
                subtitle={`Engineer > ${activeProjectName} > Personnel Registry`}
            />
            
            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View className="mb-6 flex-col md:flex-row md:items-center justify-between">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-xl font-bold text-gray-900">Workforce Personnel Ledger</Text>
                        <Text className="text-sm text-gray-500 mt-1">Centralized database of site workforce, performance metrics and compliance.</Text>
                    </View>
                    
                    <View className="flex-row items-center space-x-3">
                        <TouchableOpacity className="flex-row items-center px-4 py-2 border border-green-500 rounded-lg bg-green-50/50 mr-3">
                            <Download size={16} color="#10B981" />
                            <Text className="ml-2 font-semibold text-green-600">Export Report</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center px-4 py-2 bg-blue-600 rounded-lg shadow-sm shadow-blue-200">
                            <Plus size={16} color="#FFFFFF" />
                            <Text className="ml-2 font-semibold text-white">Register Labour</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {loading ? (
                    <View className="py-10 items-center">
                        <ActivityIndicator size="large" color="#3B82F6" />
                        <Text className="text-gray-500 mt-4">Loading personnel data...</Text>
                    </View>
                ) : (
                    <>
                        {/* Stats Cards Row 1 */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                            <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                                <Text className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">Personnel Database</Text>
                                <Text className="text-2xl font-bold text-gray-900">{stats?.total_labour || labourList.length}</Text>
                                <Text className="text-xs text-gray-400 mt-1">Total Records</Text>
                            </View>
                            <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                                <Text className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">Active Labour</Text>
                                <Text className="text-2xl font-bold text-blue-500">{stats?.active_labour || 0}</Text>
                                <Text className="text-xs text-gray-400 mt-1">Currently Deployed</Text>
                            </View>
                            <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                                <Text className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">Technical Skill</Text>
                                <Text className="text-2xl font-bold text-green-500">{skillSummary?.skilled || 0}</Text>
                                <Text className="text-xs text-gray-400 mt-1">Skilled Labourers</Text>
                            </View>
                        </ScrollView>

                        {/* Stats Cards Row 2 */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                            <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 min-w-[120px]">
                                <Text className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Total Labours</Text>
                                <Text className="text-lg font-bold text-gray-900">{stats?.total_labour || 0}</Text>
                            </View>
                            <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 min-w-[120px]">
                                <Text className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Active</Text>
                                <Text className="text-lg font-bold text-blue-500">{stats?.active_labour || 0}</Text>
                            </View>
                            <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 min-w-[120px]">
                                <Text className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Present Today</Text>
                                <Text className="text-lg font-bold text-green-500">{stats?.present_today || 0}</Text>
                            </View>
                            <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 min-w-[120px]">
                                <Text className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Absent Today</Text>
                                <Text className="text-lg font-bold text-red-500">{stats?.absent_today || 0}</Text>
                            </View>
                            <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 min-w-[120px]">
                                <Text className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Wage This Month</Text>
                                <Text className="text-lg font-bold text-orange-500">₹{stats?.wage_this_month || 0}</Text>
                            </View>
                        </ScrollView>

                        {skillSummary && Object.keys(skillSummary).length > 0 && (
                            <View className="flex-row items-center mb-4">
                                <Text className="text-xs font-bold text-gray-500 tracking-wider uppercase mr-2">Skill Summary:</Text>
                                {Object.entries(skillSummary).map(([skill, count]) => (
                                    <View key={skill} className="bg-blue-50 px-3 py-1 rounded-full mr-2">
                                        <Text className="text-xs font-semibold text-blue-600">{skill}: {String(count)}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Table Container */}
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm mb-8 overflow-hidden">
                            {/* Toolbar */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4 border-b border-gray-100">
                                <View className="flex-row items-center">
                                    <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 mr-3 w-64">
                                        <Search size={16} color="#9CA3AF" />
                                        <TextInput
                                            placeholder="Search by name, ID or Aadhaar..."
                                            className="ml-2 flex-1 text-sm text-gray-700"
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                        />
                                    </View>
                                    
                                    <TouchableOpacity className="flex-row items-center px-4 py-2 border border-gray-200 rounded-lg mr-3 bg-gray-50/50">
                                        <Filter size={14} color="#6B7280" />
                                        <Text className="ml-2 text-xs font-bold text-gray-700">ALL STATUS</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity className="flex-row items-center px-4 py-2 border border-gray-200 rounded-lg mr-3 bg-gray-50/50">
                                        <Filter size={14} color="#6B7280" />
                                        <Text className="ml-2 text-xs font-bold text-gray-700">ALL PROJECTS</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity className="flex-row items-center px-4 py-2 border border-gray-200 rounded-lg bg-gray-50/50">
                                        <Text className="text-xs font-bold text-gray-700">NEWEST FIRST</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>

                            {/* Data Table */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <View>
                                    {/* Table Header */}
                                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Name / ID</Text>
                                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Skill Category</Text>
                                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Default Daily Wage</Text>
                                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Custom Daily Wage</Text>
                                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Effective Daily Wage</Text>
                                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Effective OT Rate</Text>
                                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Assigned Project</Text>
                                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</Text>
                                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</Text>
                                    </View>

                                    {/* Table Rows */}
                                    {filteredList.map((row: any, index: number) => (
                                        <View key={row.id || index} className={`flex-row items-center px-6 py-4 ${index !== filteredList.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                            <View className="w-48">
                                                <Text className="text-sm font-bold text-gray-900">{row.name || 'Unknown'}</Text>
                                                <Text className="text-xs text-gray-500">{row.employee_id || row.id || 'No ID'}</Text>
                                            </View>
                                            <View className="w-32">
                                                <View className="bg-blue-50 self-start px-2 py-1 rounded">
                                                    <Text className="text-[10px] font-bold text-blue-600 uppercase">{row.skill_category?.name || row.category || 'GENERAL'}</Text>
                                                </View>
                                            </View>
                                            <Text className="w-32 text-sm font-medium text-gray-600 text-center">₹{row.default_wage || 0}</Text>
                                            <Text className="w-32 text-sm font-bold text-gray-900 text-center">₹{row.custom_wage || 0}</Text>
                                            <Text className="w-32 text-sm font-bold text-green-600 text-center">₹{row.effective_wage || 0}</Text>
                                            <Text className="w-32 text-sm font-medium text-gray-600 text-center">₹{row.effective_ot_rate || 0}</Text>
                                            <Text className="w-32 text-sm font-semibold text-blue-600">{row.project?.name || activeProjectName}</Text>
                                            <View className="w-24">
                                                <View className={`self-start px-2 py-1 rounded ${row.status === 'ACTIVE' ? 'bg-green-50' : 'bg-gray-100'}`}>
                                                    <Text className={`text-[10px] font-bold uppercase ${row.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}`}>
                                                        {row.status || 'ACTIVE'}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View className="w-32 flex-row justify-end space-x-3">
                                                <TouchableOpacity><Printer size={16} color="#9CA3AF" /></TouchableOpacity>
                                                <TouchableOpacity><EyeOff size={16} color="#9CA3AF" /></TouchableOpacity>
                                                <TouchableOpacity><Edit2 size={16} color="#9CA3AF" /></TouchableOpacity>
                                                <TouchableOpacity><Trash2 size={16} color="#9CA3AF" /></TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}

                                    {filteredList.length === 0 && (
                                        <View className="px-6 py-8 items-center justify-center">
                                            <Text className="text-gray-500">No personnel records found.</Text>
                                        </View>
                                    )}
                                </View>
                            </ScrollView>

                            {/* Footer */}
                            <View className="px-6 py-4 border-t border-gray-100 flex-row justify-between items-center bg-gray-50/30">
                                <View className="flex-row items-center">
                                    <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                                    <View className="border border-gray-200 rounded px-2 py-1 bg-white">
                                        <Text className="text-xs font-medium">10</Text>
                                    </View>
                                </View>
                                <Text className="text-xs text-gray-500">Showing 1 - {filteredList.length} of {filteredList.length} records</Text>
                                <View className="flex-row">
                                    <TouchableOpacity className="px-2 py-1 border border-gray-200 rounded mr-1 bg-white">
                                        <Text className="text-gray-400">&lt;</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="px-2 py-1 border border-blue-500 rounded bg-blue-500 mr-1">
                                        <Text className="text-white font-bold">1</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="px-2 py-1 border border-gray-200 rounded bg-white">
                                        <Text className="text-gray-400">&gt;</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

