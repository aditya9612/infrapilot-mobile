import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { Clock, MapPin, Download, CheckCircle, Search, Filter, Eye } from 'lucide-react-native';
import { useProjectContext } from '../../contexts/ProjectContext';

import { attendanceService, AttendanceRecord, AttendanceStatus } from '../../services/attendanceService';
import { ActivityIndicator, RefreshControl } from 'react-native';

export default function DailyAttendanceScreen() {
    const { activeProjectId, projects } = useProjectContext();
    const activeProjectName = projects.find(p => String(p.id) === String(activeProjectId))?.name || 'All Projects';
    const [activeTab, setActiveTab] = useState<'self' | 'labour'>('self');
    const [selfHistory, setSelfHistory] = useState<AttendanceRecord[]>([]);
    const [labourData, setLabourData] = useState<AttendanceRecord[]>([]);
    const [todayStatus, setTodayStatus] = useState<AttendanceStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'self') {
                const [statusRes, historyRes] = await Promise.all([
                    attendanceService.getTodayStatus(),
                    attendanceService.getList(String(activeProjectId))
                ]);
                setTodayStatus(statusRes);
                // Filter self history (assuming api returns all, filtering by some current user id is ideal but let's just use the list for now)
                setSelfHistory(historyRes || []);
            } else {
                const labourRes = await attendanceService.getList(String(activeProjectId));
                setLabourData(labourRes || []);
            }
        } catch (error) {
            console.error('Failed to load attendance data:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    React.useEffect(() => {
        loadData();
    }, [activeProjectId, activeTab]);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    return (
        <View className="flex-1 bg-gray-50">
            <TopHeader 
                title="Attendance Management" 
                subtitle={`Engineer > ${activeProjectName} > Attendance Management`} 
            />
            
            <ScrollView 
                className="flex-1 px-4 py-6" 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />
                }
            >
                
                {/* Header Title Area */}
                <View className="flex-row items-center justify-between mb-6">
                    <View className="flex-row items-center">
                        <View className="bg-blue-100 p-3 rounded-lg mr-4">
                            <Clock size={24} color="#3B82F6" />
                        </View>
                        <View>
                            <Text className="text-xl font-bold text-gray-900">Attendance Management</Text>
                            <View className="flex-row items-center mt-1">
                                <Clock size={12} color="#6B7280" />
                                <Text className="text-xs text-gray-500 ml-1">Tuesday, August 25, 2026 | 01:34 PM</Text>
                            </View>
                        </View>
                    </View>

                    {activeTab === 'labour' && (
                        <View className="flex-row space-x-2">
                            <TouchableOpacity className="px-4 py-2 border border-gray-200 rounded-lg flex-row items-center bg-white mr-2">
                                <Text className="text-gray-500 font-medium ml-1">Bulk Checkin</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="px-4 py-2 border border-gray-200 rounded-lg flex-row items-center bg-white mr-2">
                                <Text className="text-gray-500 font-medium ml-1">Bulk Checkout</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="px-4 py-2 border border-green-500 rounded-lg flex-row items-center bg-green-50/50">
                                <Download size={16} color="#10B981" />
                                <Text className="text-green-600 font-semibold ml-1">Export Report</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Tabs */}
                <View className="flex-row justify-center mb-8">
                    <View className="flex-row bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                        <TouchableOpacity 
                            onPress={() => setActiveTab('self')}
                            className={`px-6 py-2 rounded-full ${activeTab === 'self' ? 'bg-blue-500' : 'bg-transparent'}`}
                        >
                            <Text className={`font-semibold ${activeTab === 'self' ? 'text-white' : 'text-gray-600'}`}>Self Attendance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setActiveTab('labour')}
                            className={`px-6 py-2 rounded-full ${activeTab === 'labour' ? 'bg-blue-500' : 'bg-transparent'}`}
                        >
                            <Text className={`font-semibold ${activeTab === 'labour' ? 'text-white' : 'text-gray-600'}`}>Labour Attendance</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Self Attendance Content */}
                {activeTab === 'self' && (
                    <View>
                        {/* Status Card */}
                        {isLoading && !refreshing ? (
                            <View className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6 items-center justify-center">
                                <ActivityIndicator size="small" color="#3B82F6" />
                                <Text className="mt-2 text-gray-500">Loading today's status...</Text>
                            </View>
                        ) : (
                            <View className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                                <Text className="text-lg font-bold text-gray-900 mb-1">Today's Status</Text>
                                <Text className="text-sm text-gray-500 mb-6">Your attendance status for today</Text>

                                <View className="flex-row items-center mb-6">
                                    <MapPin size={16} color="#6B7280" />
                                    <Text className="text-sm text-gray-700 ml-2">{todayStatus?.location || 'Location not found'}</Text>
                                </View>

                                <View className="flex-row justify-between mb-6">
                                    <View>
                                        <View className="flex-row items-center mb-2">
                                            <Text className="font-semibold text-gray-700">Check-in Time</Text>
                                            {todayStatus?.status === 'present' && (
                                                <View className="bg-blue-50 px-2 py-0.5 rounded ml-2 border border-blue-100 flex-row items-center">
                                                    <MapPin size={10} color="#3B82F6" />
                                                    <Text className="text-[10px] text-blue-600 font-bold ml-1">Present</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text className="text-lg font-bold text-gray-900">{todayStatus?.inTime || '-'}</Text>
                                    </View>
                                    
                                    <View className="items-end">
                                        <Text className="font-semibold text-gray-700 mb-2">Check-out Time</Text>
                                        <Text className="text-lg font-bold text-gray-900">{todayStatus?.outTime || '-'}</Text>
                                    </View>
                                </View>

                                <View className="mb-6">
                                    <View className="flex-row items-center mb-2">
                                        <Clock size={16} color="#6B7280" />
                                        <Text className="font-semibold text-gray-700 ml-2">Total Work Hours</Text>
                                    </View>
                                    <Text className="text-lg font-bold text-gray-900">{todayStatus?.workHours || '-'}</Text>
                                </View>

                                <View className="flex-row items-center mb-6">
                                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2"></View>
                                    <Text className="text-sm text-green-600 font-medium">Live tracking - updates in real-time</Text>
                                </View>

                                <TouchableOpacity 
                                    className={`w-full ${todayStatus?.status === 'present' && !todayStatus?.outTime ? 'bg-red-500 shadow-red-200' : 'bg-blue-500 shadow-blue-200'} py-4 rounded-xl items-center justify-center flex-row shadow-sm`}
                                >
                                    <Text className="text-white font-bold text-lg ml-2">
                                        {todayStatus?.status === 'present' && !todayStatus?.outTime ? 'Check Out' : 'Check In'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* History Table */}
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                            <View className="p-4 border-b border-gray-100">
                                <Text className="text-lg font-bold text-gray-900">Attendance History</Text>
                                <Text className="text-sm text-gray-500">Your Attendance Records</Text>
                            </View>

                            <ScrollView horizontal>
                                <View>
                                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase">Project Name</Text>
                                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase">Attendance Date</Text>
                                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase">Status</Text>
                                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase">In Time</Text>
                                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase">Out Time</Text>
                                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase">Working Hours</Text>
                                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase">OT Hours</Text>
                                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase">Location</Text>
                                    </View>
                                    {selfHistory.length === 0 && !isLoading ? (
                                        <View className="items-center py-8">
                                            <Text className="text-gray-400">No attendance records found.</Text>
                                        </View>
                                    ) : (
                                        selfHistory.map((row) => (
                                            <View key={row.id} className="flex-row items-center px-6 py-4 border-b border-gray-50">
                                                <Text className="w-32 text-sm text-gray-900">{activeProjectName || '-'}</Text>
                                                <Text className="w-32 text-sm text-gray-900">{row.date}</Text>
                                                <Text className="w-24 text-sm text-gray-900">{row.status}</Text>
                                                <Text className="w-24 text-sm text-gray-900">{row.inTime || '-'}</Text>
                                                <Text className="w-24 text-sm text-gray-900">{row.outTime || '-'}</Text>
                                                <Text className="w-32 text-sm text-gray-900">{row.workHours || '-'}</Text>
                                                <Text className="w-24 text-sm text-gray-900">{row.otHours || '-'}</Text>
                                                <TouchableOpacity className="w-24 flex-row items-center">
                                                    <Eye size={14} color="#3B82F6" />
                                                    <Text className="text-blue-500 text-sm ml-1">View</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                )}

                {/* Labour Attendance Content */}
                {activeTab === 'labour' && (
                    <View>
                        {/* Stats */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                            <View className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mr-4 w-[300px] flex-row items-center">
                                <View className="bg-blue-50 p-3 rounded-lg mr-4">
                                    <View className="flex-row">
                                        <View className="w-3 h-3 bg-blue-500 rounded-full" />
                                        <View className="w-3 h-3 bg-blue-500 rounded-full -ml-1" />
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1 uppercase">Total Labour</Text>
                                    <Text className="text-2xl font-bold text-gray-900">3</Text>
                                </View>
                            </View>
                            <View className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm w-[300px] flex-row items-center">
                                <View className="bg-green-50 p-3 rounded-lg mr-4">
                                    <View className="flex-row">
                                        <View className="w-3 h-3 bg-green-500 rounded-full" />
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1 uppercase">Present Today</Text>
                                    <Text className="text-2xl font-bold text-gray-900">6</Text>
                                </View>
                            </View>
                        </ScrollView>

                        {/* Labour Table */}
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-lg font-bold text-gray-900">Labour Attendances</Text>
                                    <Text className="text-sm text-gray-500">View and manage labour attendance</Text>
                                </View>
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4 border-b border-gray-100">
                                <View className="flex-row items-center">
                                    <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 mr-3 w-64">
                                        <Search size={16} color="#9CA3AF" />
                                        <TextInput
                                            placeholder="Search by name, email, labour ID..."
                                            className="ml-2 flex-1 text-sm text-gray-700"
                                        />
                                    </View>
                                    
                                    <TouchableOpacity className="flex-row items-center px-4 py-2 border border-gray-200 rounded-lg mr-3 bg-gray-50/50">
                                        <Filter size={14} color="#6B7280" />
                                        <Text className="ml-2 text-xs font-bold text-gray-700">All Status</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity className="flex-row items-center px-4 py-2 border border-gray-200 rounded-lg bg-gray-50/50">
                                        <Text className="text-xs font-bold text-gray-700">Today</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>

                            <ScrollView horizontal>
                                <View>
                                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                        <Text className="w-12"></Text>
                                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase">Date</Text>
                                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase">Labour Name</Text>
                                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase text-center">Online Status</Text>
                                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase text-center">Check In</Text>
                                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase text-center">Check Out</Text>
                                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase text-center">Hours</Text>
                                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase text-center">Status</Text>
                                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase text-right">Action</Text>
                                    </View>
                                    {labourData.length === 0 && !isLoading ? (
                                        <View className="items-center py-8">
                                            <Text className="text-gray-400">No labour attendance records found.</Text>
                                        </View>
                                    ) : (
                                        labourData.map((row) => (
                                            <View key={row.id} className="flex-row items-center px-6 py-4 border-b border-gray-50">
                                                <View className="w-12">
                                                    <View className="w-4 h-4 border border-gray-300 rounded" />
                                                </View>
                                                <Text className="w-32 text-sm text-gray-900">{row.date}</Text>
                                                <View className="w-48 flex-row items-center">
                                                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
                                                    <Text className="text-blue-600 font-bold">{(row.name || 'U').charAt(0)}</Text>
                                                </View>
                                                <Text className="text-sm font-semibold text-gray-900">{row.name || 'Unknown'}</Text>
                                            </View>
                                            <View className="w-32 items-center flex-row justify-center">
                                                <View className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                                                <Text className="text-xs text-gray-600">Online</Text>
                                            </View>
                                            <View className="w-48 items-center">
                                                <Text className="text-xs text-green-600">{row.inTime}</Text>
                                            </View>
                                            <View className="w-32 items-center">
                                                <Text className="text-gray-400">-</Text>
                                            </View>
                                            <View className="w-24 items-center">
                                                <Text className="text-xs font-bold text-gray-900">0.1hr</Text>
                                                <Text className="text-[10px] text-green-500">1.4 HR</Text>
                                            </View>
                                            <View className="w-24 items-center">
                                                <View className="bg-green-50 px-2 py-1 rounded">
                                                    <Text className="text-[10px] font-bold text-green-600 uppercase">{row.status}</Text>
                                                </View>
                                            </View>
                                            <View className="w-32 items-end">
                                                <TouchableOpacity className="flex-row items-center">
                                                    <Eye size={14} color="#6B7280" />
                                                    <Text className="text-gray-600 text-xs ml-1 font-semibold">VIEW DETAIL</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        ))
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
