import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import TopHeader from '../../../components/TopHeader';
import { Search, ChevronDown, Plus, Edit2, Trash2, Box, CheckCircle2, Hourglass } from 'lucide-react-native';

const TABS = [
    'ALL DAILY ENTRIES',
    'TODAY\'S PROGRESS',
    'PROJECT SUMMARY',
    'ACTIVITY HISTORY',
    'DELAY REPORT'
];

const DAILY_PROGRESS_LIST = [
    { id: '1', activity: 'iteam 2', date: '8/18/2026', progress: '15.00 m³', remarks: 'complete', logged: '8/25/2026, 5:38:38 AM' },
    { id: '2', activity: 'water', date: '8/18/2026', progress: '2.00 unit', remarks: 'gfhfghgfjf', logged: '8/25/2026, 5:33:34 AM' },
    { id: '3', activity: 'iteam 8', date: '8/18/2026', progress: '100.00 unit', remarks: 'iugflbdkjgbdkfj', logged: '8/21/2026, 5:57:35 AM' },
    { id: '4', activity: 'neq BOQ 2', date: '8/21/2026', progress: '20.00 meter', remarks: 'kjhughuy', logged: '8/21/2026, 5:48:10 AM' },
    { id: '5', activity: 'iteam 9', date: '8/20/2026', progress: '50.00 SQ.FT', remarks: 'fghchgfhghghdgfdhfg', logged: '8/20/2026, 10:05:37 AM' },
    { id: '6', activity: 'iteam 7', date: '8/19/2026', progress: '1.00 Ton', remarks: 'rfghhhhhh', logged: '8/19/2026, 7:11:36 AM' },
    { id: '7', activity: 'iteam 7', date: '8/18/2026', progress: '100.00 meter', remarks: 'gfhfjfjjmghk', logged: '8/19/2026, 7:08:53 AM' },
    { id: '8', activity: 'iteam 5', date: '8/18/2026', progress: '50.00 SQ.FT', remarks: 'fgggrgh', logged: '8/18/2026, 6:34:06 AM' },
];

const ACTIVITY_HISTORY_LIST = [
    { id: '1', datetime: '-', activity: 'BOQ GENERATE', status: 'ON_TRACK', added: '+ 150 SQ.FT', total: '150.00 SQ.FT', type: 'DAILY_PROGRESS_UPDATE' },
    { id: '2', datetime: '-', activity: 'BOQ GENERATE', status: 'ON_TRACK', added: '+ 80 SQ.FT', total: '230.00 SQ.FT', type: 'DAILY_PROGRESS_UPDATE' },
    { id: '3', datetime: '-', activity: 'BOQ GENERATE', status: 'DELAY', added: '+ 40 SQ.FT', total: '270.00 SQ.FT', type: 'DAILY_PROGRESS_UPDATE' },
];

const DELAY_REPORT_LIST = [
    { id: '1', activity: 'pipe', status: 'DELAY', progress: '7.50%', compPlan: '0 / 1200.00', rem: '1110.00', start: '2026-08-10', end: '2026-08-15', rep: '-' },
    { id: '2', activity: 'XYZ', status: 'DELAY', progress: '35.00%', compPlan: '0 / 100.00', rem: '65.00', start: '2026-08-06', end: '2026-08-16', rep: '-' },
    { id: '3', activity: 'Borda', status: 'DELAY', progress: '0.00%', compPlan: '0 / 200.00', rem: '200.00', start: '2026-08-17', end: '2026-08-17', rep: '-' },
    { id: '4', activity: 'iteam 4', status: 'DELAY', progress: '85.00%', compPlan: '0 / 100.00', rem: '15.00', start: '2026-08-18', end: '2026-08-18', rep: '-' },
    { id: '5', activity: 'iteam 6', status: 'DELAY', progress: '80.00%', compPlan: '0 / 20.00', rem: '4.00', start: '2026-08-18', end: '2026-08-18', rep: '-' },
    { id: '6', activity: 'eee', status: 'DELAY', progress: '0.00%', compPlan: '0 / 1.00', rem: '1.00', start: '2026-08-17', end: '2026-08-19', rep: '-' },
    { id: '7', activity: 'Column Concrete', status: 'DELAY', progress: '20.00%', compPlan: '0 / 100.00', rem: '80.00', start: '2026-08-17', end: '2026-08-20', rep: '-' },
    { id: '8', activity: 'iteam 1', status: 'DELAY', progress: '50.00%', compPlan: '0 / 100.00', rem: '50.00', start: '2026-08-15', end: '2026-08-20', rep: '-' },
];

export default function DailyProgressEntryScreen() {
    const [activeTab, setActiveTab] = useState(TABS[0]);

    return (
        <View className="flex-1 bg-gray-50">
            <TopHeader 
                title="Daily Work Progress" 
                subtitle="Engineer > Work Progress > Daily Progress" 
            />
            
            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                
                {/* Header Section */}
                <View className="mb-6 flex-col md:flex-row md:items-center justify-between">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-xl font-bold text-gray-900">Daily Work Progress</Text>
                        <Text className="text-sm text-gray-500 mt-1">Log and track daily execution activities on site.</Text>
                    </View>
                    
                    {(activeTab === 'ALL DAILY ENTRIES' || activeTab === 'TODAY\'S PROGRESS') && (
                        <View className="flex-row items-center space-x-3">
                            <TouchableOpacity className="flex-row items-center px-4 py-2 bg-blue-600 rounded-lg shadow-sm">
                                <Plus size={16} color="#ffffff" className="mr-2" />
                                <Text className="font-bold text-xs text-white">Add Daily Progress</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Stats Section - Varies by Tab */}
                {(activeTab === 'ALL DAILY ENTRIES' || activeTab === 'TODAY\'S PROGRESS') && (
                    <View className="flex-row justify-between mb-6 space-x-4">
                        <View className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">ALL LOGS</Text>
                            <Text className="text-2xl font-bold text-gray-800 mb-1">10</Text>
                            <Text className="text-xs text-gray-400">Total Entries</Text>
                        </View>
                        <View className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">ON TRACK LOGS</Text>
                            <Text className="text-2xl font-bold text-blue-500 mb-1">1</Text>
                            <Text className="text-xs text-gray-400">Performing as expected</Text>
                        </View>
                        <View className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">COMPLETED LOGS</Text>
                            <Text className="text-2xl font-bold text-green-500 mb-1">4</Text>
                            <Text className="text-xs text-gray-400">100% Progress</Text>
                        </View>
                    </View>
                )}

                {activeTab === 'ACTIVITY HISTORY' && (
                    <View className="flex-row justify-between mb-6 space-x-4">
                        <View className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">ALL HISTORY</Text>
                            <Text className="text-2xl font-bold text-gray-800 mb-1">3</Text>
                            <Text className="text-xs text-gray-400">Complete Log</Text>
                        </View>
                        <View className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">PROGRESS UPDATES</Text>
                            <Text className="text-2xl font-bold text-blue-500 mb-1">3</Text>
                            <Text className="text-xs text-gray-400">Actual Progress Added</Text>
                        </View>
                        <View className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">STATUS CHANGES</Text>
                            <Text className="text-2xl font-bold text-orange-400 mb-1">3</Text>
                            <Text className="text-xs text-gray-400">Lifecycle Events</Text>
                        </View>
                    </View>
                )}

                {activeTab === 'DELAY REPORT' && (
                    <View className="flex-row justify-between mb-6 space-x-4">
                        <View className="flex-1 bg-white p-5 rounded-xl border border-red-200 shadow-sm border-l-4 border-l-red-500">
                            <Text className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">ALL DELAYED</Text>
                            <Text className="text-2xl font-bold text-red-600 mb-1">10</Text>
                            <Text className="text-xs text-gray-400">Total Delayed</Text>
                        </View>
                        <View className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">CRITICAL (&lt; 25%)</Text>
                            <Text className="text-2xl font-bold text-red-500 mb-1">5</Text>
                            <Text className="text-xs text-gray-400">High Risk</Text>
                        </View>
                        <View className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">MODERATE (25% - 75%)</Text>
                            <Text className="text-2xl font-bold text-orange-400 mb-1">3</Text>
                            <Text className="text-xs text-gray-400">At Risk</Text>
                        </View>
                        <View className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">ALMOST DONE (&gt; 75%)</Text>
                            <Text className="text-2xl font-bold text-green-500 mb-1">2</Text>
                            <Text className="text-xs text-gray-400">Near Completion</Text>
                        </View>
                    </View>
                )}


                {/* Tabs */}
                <View className="mb-6 border-b border-gray-200">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row">
                            {TABS.map((tab) => (
                                <TouchableOpacity 
                                    key={tab}
                                    onPress={() => setActiveTab(tab)}
                                    className={`px-4 py-3 border-b-2 ${activeTab === tab ? 'border-blue-600' : 'border-transparent'}`}
                                >
                                    <Text className={`text-xs font-bold tracking-wider ${activeTab === tab ? 'text-blue-600' : 'text-gray-500'}`}>{tab}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Content Section based on Tab */}
                
                {/* 1. ALL DAILY ENTRIES & TODAY'S PROGRESS */}
                {(activeTab === 'ALL DAILY ENTRIES' || activeTab === 'TODAY\'S PROGRESS') && (
                    <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
                        <View className="p-4 border-b border-gray-100 flex-row items-center space-x-3">
                            <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex-1">
                                <Search size={16} color="#9CA3AF" />
                                <TextInput placeholder="Search by activity ref or BOQ identity..." className="ml-2 flex-1 text-sm text-gray-700" />
                            </View>
                            <View className="flex-row items-center space-x-2">
                                <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-36">
                                    <Text className="text-sm text-gray-700">DD-MM-YYYY</Text>
                                    <ChevronDown size={14} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row items-center space-x-2">
                                <Text className="text-[10px] font-bold text-gray-500 uppercase">PROJECT:</Text>
                                <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-36">
                                    <Text className="text-sm text-gray-700">ROHAN HARITA</Text>
                                    <ChevronDown size={14} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row items-center space-x-2">
                                <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-36">
                                    <Text className="text-sm text-gray-700">ALL ACTIVI...</Text>
                                    <ChevronDown size={14} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row items-center space-x-2">
                                <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-32">
                                    <Text className="text-sm text-gray-700">ALL STATUS</Text>
                                    <ChevronDown size={14} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                            <View>
                                <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                    <Text className="w-64 text-[10px] font-bold text-gray-500 uppercase tracking-wider">ACTIVITY</Text>
                                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">DATE</Text>
                                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">PROGRESS ADDED</Text>
                                    <Text className="w-64 text-[10px] font-bold text-gray-500 uppercase tracking-wider">REMARKS</Text>
                                    <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">LOGGED AT</Text>
                                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">ACTIONS</Text>
                                </View>
                                {DAILY_PROGRESS_LIST.map((row, index) => (
                                    <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <View className="w-64">
                                            <Text className="text-sm font-bold text-gray-800">{row.activity}</Text>
                                        </View>
                                        <View className="w-40">
                                            <Text className="text-sm text-gray-600">{row.date}</Text>
                                        </View>
                                        <View className="w-40">
                                            <Text className="text-sm font-bold text-blue-600">{row.progress}</Text>
                                        </View>
                                        <View className="w-64">
                                            <Text className="text-sm text-gray-600">{row.remarks}</Text>
                                        </View>
                                        <View className="w-48">
                                            <Text className="text-xs text-gray-500">{row.logged}</Text>
                                        </View>
                                        <View className="w-32 flex-row justify-end space-x-3">
                                            <Edit2 size={14} color="#9CA3AF" />
                                            <Trash2 size={14} color="#9CA3AF" />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                )}

                {/* 2. PROJECT SUMMARY */}
                {activeTab === 'PROJECT SUMMARY' && (
                    <View className="flex-1">
                        <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">PROJECT DETAILS</Text>
                        <View className="flex-row space-x-4 mb-6">
                            <View className="flex-1 bg-white p-5 rounded-xl border border-gray-200">
                                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">PROJECT NAME</Text>
                                <Text className="text-lg font-bold text-gray-800">Rohan Harita</Text>
                            </View>
                            <View className="flex-1 bg-white p-5 rounded-xl border border-gray-200">
                                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">OVERALL PROGRESS</Text>
                                <Text className="text-lg font-bold text-blue-600">27.92%</Text>
                            </View>
                            <View className="flex-1 bg-white p-5 rounded-xl border border-gray-200">
                                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">AVG ACTIVITY PROGRESS</Text>
                                <Text className="text-lg font-bold text-green-600">52.48%</Text>
                            </View>
                        </View>

                        <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">ACTIVITY METRICS</Text>
                        <View className="flex-row space-x-4 mb-6">
                            <View className="flex-1 bg-white p-5 rounded-xl border border-gray-200">
                                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">TOTAL</Text>
                                <Text className="text-2xl font-bold text-gray-800">24</Text>
                            </View>
                            <View className="flex-1 bg-green-50/50 p-5 rounded-xl border border-green-200">
                                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">COMPLETED</Text>
                                <Text className="text-2xl font-bold text-green-600">9</Text>
                            </View>
                            <View className="flex-1 bg-blue-50/50 p-5 rounded-xl border border-blue-200">
                                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">ON TRACK</Text>
                                <Text className="text-2xl font-bold text-blue-600">1</Text>
                            </View>
                            <View className="flex-1 bg-red-50/50 p-5 rounded-xl border border-red-200">
                                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">DELAYED</Text>
                                <Text className="text-2xl font-bold text-red-500">11</Text>
                            </View>
                            <View className="flex-1 bg-yellow-50/50 p-5 rounded-xl border border-yellow-200">
                                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">NOT STARTED</Text>
                                <Text className="text-2xl font-bold text-yellow-600">3</Text>
                            </View>
                        </View>

                        <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">QUANTITY METRICS</Text>
                        <View className="flex-row space-x-4 mb-6">
                            <View className="flex-1 bg-white p-5 rounded-xl border border-gray-200 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">PLANNED QUANTITY</Text>
                                    <Text className="text-2xl font-bold text-gray-800">3901.00</Text>
                                </View>
                                <Box size={24} color="#D97706" />
                            </View>
                            <View className="flex-1 bg-white p-5 rounded-xl border border-gray-200 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">COMPLETED QUANTITY</Text>
                                    <Text className="text-2xl font-bold text-gray-800">1089.00</Text>
                                </View>
                                <CheckCircle2 size={24} color="#10B981" />
                            </View>
                            <View className="flex-1 bg-white p-5 rounded-xl border border-gray-200 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">REMAINING QUANTITY</Text>
                                    <Text className="text-2xl font-bold text-gray-800">2812.00</Text>
                                </View>
                                <Hourglass size={24} color="#F59E0B" />
                            </View>
                        </View>
                    </View>
                )}

                {/* 3. ACTIVITY HISTORY */}
                {activeTab === 'ACTIVITY HISTORY' && (
                    <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
                        <View className="p-4 border-b border-gray-100 flex-row items-center space-x-3">
                            <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex-1">
                                <Search size={16} color="#9CA3AF" />
                                <TextInput placeholder="Search by activity ref or BOQ identity..." className="ml-2 flex-1 text-sm text-gray-700" />
                            </View>
                            <View className="flex-row items-center space-x-2">
                                <Text className="text-[10px] font-bold text-gray-500 uppercase">PROJECT:</Text>
                                <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-36">
                                    <Text className="text-sm text-gray-700">ROHAN HARITA</Text>
                                    <ChevronDown size={14} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row items-center space-x-2">
                                <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-36">
                                    <Text className="text-sm text-gray-700">ALL ACTIVI...</Text>
                                    <ChevronDown size={14} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row items-center space-x-2">
                                <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-32">
                                    <Text className="text-sm text-gray-700">ALL STATUS</Text>
                                    <ChevronDown size={14} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                            <View>
                                <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">DATE & TIME</Text>
                                    <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">ACTIVITY</Text>
                                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">STATUS</Text>
                                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">PROGRESS ADDED</Text>
                                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">TOTAL COMPLETED</Text>
                                    <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">ACTION TYPE</Text>
                                </View>
                                {ACTIVITY_HISTORY_LIST.map((row, index) => (
                                    <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <View className="w-32">
                                            <Text className="text-sm text-gray-800">{row.datetime}</Text>
                                        </View>
                                        <View className="w-48">
                                            <Text className="text-sm font-bold text-gray-800">{row.activity}</Text>
                                        </View>
                                        <View className="w-32">
                                            <View className={`px-2 py-1 rounded-full border self-start ${
                                                row.status === 'DELAY' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                                            }`}>
                                                <Text className={`text-[10px] font-bold ${
                                                    row.status === 'DELAY' ? 'text-red-500' : 'text-green-600'
                                                }`}>{row.status}</Text>
                                            </View>
                                        </View>
                                        <View className="w-40">
                                            <Text className="text-sm font-bold text-blue-600">{row.added}</Text>
                                        </View>
                                        <View className="w-40">
                                            <Text className="text-sm text-gray-600">{row.total}</Text>
                                        </View>
                                        <View className="w-48">
                                            <Text className="text-xs font-medium text-gray-600">{row.type}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                )}

                {/* 4. DELAY REPORT */}
                {activeTab === 'DELAY REPORT' && (
                    <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
                        <View className="p-4 border-b border-gray-100 flex-row items-center space-x-3">
                            <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex-1 max-w-md">
                                <Search size={16} color="#9CA3AF" />
                                <TextInput placeholder="Search by activity ref or BOQ identity..." className="ml-2 flex-1 text-sm text-gray-700" />
                            </View>
                            <View className="flex-row items-center space-x-2">
                                <Text className="text-[10px] font-bold text-gray-500 uppercase">PROJECT:</Text>
                                <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-36">
                                    <Text className="text-sm text-gray-700">ROHAN HARITA</Text>
                                    <ChevronDown size={14} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                            <View>
                                <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                    <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">ACTIVITY</Text>
                                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">STATUS</Text>
                                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">PROGRESS (%)</Text>
                                    <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">COMPLETED / PLANNED</Text>
                                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">REMAINING</Text>
                                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">START DATE</Text>
                                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">END DATE</Text>
                                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">REPORTED ON</Text>
                                </View>
                                {DELAY_REPORT_LIST.map((row, index) => (
                                    <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <View className="w-48">
                                            <Text className="text-sm font-bold text-gray-800">{row.activity}</Text>
                                        </View>
                                        <View className="w-32">
                                            <View className={`px-2 py-1 rounded-full border self-start bg-red-50 border-red-200`}>
                                                <Text className={`text-[10px] font-bold text-red-500`}>{row.status}</Text>
                                            </View>
                                        </View>
                                        <View className="w-32">
                                            <Text className="text-sm font-bold text-blue-600">{row.progress}</Text>
                                        </View>
                                        <View className="w-48">
                                            <Text className="text-sm text-gray-600">{row.compPlan}</Text>
                                        </View>
                                        <View className="w-32">
                                            <Text className="text-sm text-gray-600">{row.rem}</Text>
                                        </View>
                                        <View className="w-32">
                                            <Text className="text-xs text-gray-500">{row.start}</Text>
                                        </View>
                                        <View className="w-32">
                                            <Text className="text-xs text-gray-500">{row.end}</Text>
                                        </View>
                                        <View className="w-32">
                                            <Text className="text-xs text-gray-500">{row.rep}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                )}

                <View className="h-12" />
            </ScrollView>
        </View>
    );
}
