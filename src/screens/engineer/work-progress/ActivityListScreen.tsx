import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import TopHeader from '../../../components/TopHeader';
import { Search, RefreshCw, ChevronDown, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, FileText, FileSpreadsheet, Eye } from 'lucide-react-native';

const ACTIVITY_LIST = [
    { id: '1', desc: 'BOQ GENERATE', logiAdded: '0.00', logiTotal: '100.00 SQ.FT', logiRem: '100.00 REMAINING', start: '25-08-2026', end: '30-08-2026', status: 'NOT_STARTED' },
    { id: '2', desc: 'BOQ GENERATE 3', logiAdded: '0.00', logiTotal: '400.00 Bag', logiRem: '400.00 REMAINING', start: '25-08-2026', end: '01-09-2026', status: 'NOT_STARTED' },
    { id: '3', desc: 'BOQ GENERATE 2', logiAdded: '0.00', logiTotal: '500.00 Ton', logiRem: '500.00 REMAINING', start: '25-08-2026', end: '05-09-2026', status: 'NOT_STARTED' },
    { id: '4', desc: 'neq BOQ 2', logiAdded: '20.00', logiTotal: '200.00 meter', logiRem: '180.00 REMAINING', start: '21-08-2026', end: '24-08-2026', status: 'DELAY' },
    { id: '5', desc: 'iteam 9', logiAdded: '50.00', logiTotal: '50.00 SQ.FT', logiRem: '0.00 REMAINING', start: '20-08-2026', end: '31-08-2026', status: 'COMPLETED' },
    { id: '6', desc: 'iteam 8', logiAdded: '100.00', logiTotal: '100.00 unit', logiRem: '0.00 REMAINING', start: '19-08-2026', end: '25-08-2026', status: 'COMPLETED' },
    { id: '7', desc: 'iteam 7', logiAdded: '1.00', logiTotal: '50.00 Ton', logiRem: '49.00 REMAINING', start: '19-08-2026', end: '20-08-2026', status: 'DELAY' },
    { id: '8', desc: 'iteam 7', logiAdded: '100.00', logiTotal: '100.00 meter', logiRem: '0.00 REMAINING', start: '18-08-2026', end: '30-08-2026', status: 'COMPLETED' },
    { id: '9', desc: 'iteam 6', logiAdded: '14.00', logiTotal: '20.00 SQ.FT', logiRem: '6.00 REMAINING', start: '18-08-2026', end: '18-08-2026', status: 'DELAY' },
    { id: '10', desc: 'iteam 5', logiAdded: '50.00', logiTotal: '100.00 SQ.FT', logiRem: '50.00 REMAINING', start: '18-08-2026', end: '20-08-2026', status: 'DELAY' },
];

export default function ActivityListScreen() {
    return (
        <View className="flex-1 bg-gray-50">
            <TopHeader 
                title="Activity List" 
                subtitle="InfraPilot > Engineer > Work Progress" 
            />
            
            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                
                {/* Header Section */}
                <View className="mb-6 flex-col md:flex-row md:items-center justify-between">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-xl font-bold text-gray-900">Project Work Progress</Text>
                        <Text className="text-sm text-gray-500 mt-1">Historical record of project activities and BOQ execution momentum.</Text>
                    </View>
                    
                    <View className="flex-row items-center space-x-3">
                        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
                            <RefreshCw size={18} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center px-4 py-2 border border-red-200 bg-white rounded-lg shadow-sm">
                            <FileText size={16} color="#EF4444" className="mr-2" />
                            <Text className="font-bold text-xs text-red-600">Export PDF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center px-4 py-2 border border-green-200 bg-white rounded-lg shadow-sm">
                            <FileSpreadsheet size={16} color="#10B981" className="mr-2" />
                            <Text className="font-bold text-xs text-green-600">Export Excel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center px-4 py-2 bg-blue-600 rounded-lg shadow-sm">
                            <Plus size={16} color="#ffffff" className="mr-2" />
                            <Text className="font-bold text-xs text-white">Add Activity</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Section */}
                <View className="flex-row justify-between mb-6 space-x-4">
                    <View className="flex-1 bg-white p-5 rounded-xl border border-blue-200 shadow-sm border-l-4 border-l-blue-500">
                        <Text className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">TOTAL TASKS</Text>
                        <Text className="text-2xl font-bold text-gray-800 mb-1">24</Text>
                        <Text className="text-xs text-gray-400">Active Ledger</Text>
                    </View>
                    <View className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">COMPLIANCE</Text>
                        <Text className="text-2xl font-bold text-blue-500 mb-1">38%</Text>
                        <Text className="text-xs text-gray-400">Completion Ratio</Text>
                    </View>
                    <View className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">BEHIND SCHEDULE</Text>
                        <Text className="text-2xl font-bold text-red-500 mb-1">11</Text>
                        <Text className="text-xs text-gray-400">Action Required</Text>
                    </View>
                    <View className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">EXECUTION</Text>
                        <Text className="text-2xl font-bold text-green-500 mb-1">1</Text>
                        <Text className="text-xs text-gray-400">On Track Items</Text>
                    </View>
                </View>

                {/* Table Section */}
                <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
                    <View className="p-4 border-b border-gray-100 flex-row items-center space-x-3">
                        <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex-1">
                            <Search size={16} color="#9CA3AF" />
                            <TextInput placeholder="Search by activity name or BOQ code..." className="ml-2 flex-1 text-sm text-gray-700" />
                        </View>
                        <View className="flex-row items-center space-x-2">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase">PROJECT:</Text>
                            <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-40">
                                <Text className="text-sm text-gray-700">ROHAN HARITA</Text>
                                <ChevronDown size={14} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center space-x-2">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase">WORK ORDER:</Text>
                            <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-40">
                                <Text className="text-sm text-gray-700">ALL WORK ORDERS</Text>
                                <ChevronDown size={14} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center space-x-2">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase">STATUS:</Text>
                            <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-36">
                                <Text className="text-sm text-gray-700">ALL STATUS</Text>
                                <ChevronDown size={14} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <View>
                            <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                <Text className="w-64 text-[10px] font-bold text-gray-500 uppercase tracking-wider">ACTIVITY DESCRIPTION</Text>
                                <Text className="w-64 text-[10px] font-bold text-gray-500 uppercase tracking-wider">LOGISTICS</Text>
                                <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">TIMELINE</Text>
                                <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">STATUS</Text>
                                <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">ACTIONS</Text>
                            </View>
                            {ACTIVITY_LIST.map((row, index) => (
                                <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                    <View className="w-64">
                                        <Text className="text-sm font-bold text-gray-800">{row.desc}</Text>
                                    </View>
                                    <View className="w-64">
                                        <View className="flex-row items-center mb-1">
                                            <Text className="text-xs font-semibold text-gray-800">{row.logiAdded} / </Text>
                                            <Text className="text-xs font-bold text-gray-800">{row.logiTotal}</Text>
                                        </View>
                                        <Text className="text-[10px] text-gray-500">{row.logiRem}</Text>
                                    </View>
                                    <View className="w-48">
                                        <Text className="text-xs font-semibold text-gray-700">{row.start}</Text>
                                        <Text className="text-[10px] text-gray-500 mt-0.5">TO {row.end}</Text>
                                    </View>
                                    <View className="w-40">
                                        <View className={`px-2 py-1 rounded-full border self-start ${
                                            row.status === 'NOT_STARTED' ? 'bg-white border-gray-400' :
                                            row.status === 'DELAY' ? 'bg-white border-red-500' :
                                            'bg-white border-blue-500'
                                        }`}>
                                            <Text className={`text-[10px] font-bold ${
                                                row.status === 'NOT_STARTED' ? 'text-gray-600' :
                                                row.status === 'DELAY' ? 'text-red-500' :
                                                'text-blue-600'
                                            }`}>{row.status}</Text>
                                        </View>
                                    </View>
                                    <View className="w-32 flex-row justify-end space-x-3">
                                        <Eye size={14} color="#9CA3AF" />
                                        <Edit2 size={14} color="#9CA3AF" />
                                        <Trash2 size={14} color="#9CA3AF" />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Pagination */}
                    <View className="p-4 border-t border-gray-100 flex-row justify-between items-center bg-white">
                        <View className="flex-row items-center">
                            <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                            <TouchableOpacity className="flex-row items-center px-2 py-1 border border-gray-200 rounded bg-white">
                                <Text className="text-xs text-gray-700 mr-1">10</Text>
                                <ChevronDown size={14} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-xs text-gray-500">Showing 1 - 10 of 24 records</Text>
                        <View className="flex-row items-center space-x-1">
                            <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                <ChevronLeft size={14} color="#9CA3AF" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-6 h-6 items-center justify-center rounded bg-blue-600">
                                <Text className="text-xs text-white font-medium">1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white">
                                <Text className="text-xs text-gray-600 font-medium">2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white">
                                <Text className="text-xs text-gray-600 font-medium">3</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white">
                                <ChevronRight size={14} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className="h-12" />
            </ScrollView>
        </View>
    );
}
