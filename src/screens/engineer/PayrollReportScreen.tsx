import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { ChevronDown, Download, FileText } from 'lucide-react-native';

const PAYROLL_DATA = [
    { id: '1', name: 'Amit', initials: 'A', skill: 'SKILLED', wage: '₹800', days: '1', ot: '0h', total: '₹0', status: 'ACTIVE' },
    { id: '2', name: 'GAURAV', initials: 'G', skill: 'SKILLED', wage: '₹10', days: '2', ot: '0h', total: '₹0', status: 'ACTIVE' },
    { id: '3', name: 'Ramesh Sharma', initials: 'R', skill: 'SKILLED', wage: '₹850', days: '16', ot: '1.0800000429153442h', total: '₹3,470.375', status: 'ACTIVE' },
];

export default function PayrollReportsScreen() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('Aggregate Report');

    return (
        <View className="flex-1 bg-gray-50">
            <TopHeader 
                title="Financial Intelligence" 
                subtitle="Engineer > Human Resources > Payroll Reports" 
            />
            
            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                
                {/* Header Title Area */}
                <View className="mb-6">
                    <Text className="text-xl font-bold text-gray-900">Fiscal Payroll Analysis</Text>
                    <Text className="text-sm text-gray-500 mt-1">Historical man-power costing and wage distribution trends.</Text>
                </View>

                {/* Stats Cards Row 1 */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-500 tracking-wider mb-2 uppercase">Total Payout</Text>
                        <Text className="text-2xl font-bold text-gray-900">₹3,098.75</Text>
                        <Text className="text-xs text-gray-400 mt-1">All Wage Items</Text>
                    </View>
                    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-500 tracking-wider mb-2 uppercase">High Payouts</Text>
                        <Text className="text-2xl font-bold text-green-500">0</Text>
                        <Text className="text-xs text-gray-400 mt-1">Above 25k Threshold</Text>
                    </View>
                    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-500 tracking-wider mb-2 uppercase">OT Intensive</Text>
                        <Text className="text-2xl font-bold text-orange-500">2</Text>
                        <Text className="text-xs text-gray-400 mt-1">Shifts with Overtime</Text>
                    </View>
                    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-500 tracking-wider mb-2 uppercase">Advance Adjusted</Text>
                        <Text className="text-2xl font-bold text-red-500">₹10.00</Text>
                        <Text className="text-xs text-gray-400 mt-1">Recovery Target</Text>
                    </View>
                </ScrollView>

                {/* Stats Cards Row 2 */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 min-w-[120px]">
                        <Text className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Total Labours</Text>
                        <Text className="text-lg font-bold text-gray-900">0</Text>
                    </View>
                    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 min-w-[120px]">
                        <Text className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Paid Count</Text>
                        <Text className="text-lg font-bold text-green-500">0</Text>
                    </View>
                    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 min-w-[120px]">
                        <Text className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Pending Count</Text>
                        <Text className="text-lg font-bold text-orange-500">0</Text>
                    </View>
                    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-4 min-w-[120px]">
                        <Text className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Avg Daily Wage</Text>
                        <Text className="text-lg font-bold text-blue-500">0</Text>
                    </View>
                </ScrollView>

                {/* Table Container */}
                <View className="bg-white rounded-xl border border-gray-100 shadow-sm mb-8 overflow-hidden z-10">
                    {/* Toolbar */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4 border-b border-gray-100">
                        <View className="flex-row justify-between items-center w-full min-w-[800px]">
                            <View className="flex-row items-center">
                                <Text className="text-xs font-bold text-gray-500 mr-3 uppercase tracking-wider">Filter</Text>
                                <View className="relative z-50">
                                    <TouchableOpacity 
                                        className="flex-row items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 min-w-[180px]"
                                        onPress={() => setIsFilterOpen(!isFilterOpen)}
                                    >
                                        <Text className="text-xs font-medium text-gray-700">{selectedFilter}</Text>
                                        <ChevronDown size={14} color="#6B7280" />
                                    </TouchableOpacity>
                                    
                                    {isFilterOpen && (
                                        <View className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg w-full py-1 z-50" style={{ elevation: 5 }}>
                                            {['Aggregate Report', 'Payroll List', 'Contractor Liability', 'Disbursement History', 'Weekly Velocity'].map((item) => (
                                                <TouchableOpacity 
                                                    key={item}
                                                    className={`px-4 py-2 ${selectedFilter === item ? 'bg-blue-50' : 'bg-transparent'}`}
                                                    onPress={() => {
                                                        setSelectedFilter(item);
                                                        setIsFilterOpen(false);
                                                    }}
                                                >
                                                    <Text className={`text-xs ${selectedFilter === item ? 'font-bold text-blue-600' : 'text-gray-700'}`}>{item}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                                <TouchableOpacity className="ml-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                                    <FileText size={14} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                            
                            <View className="flex-row items-center space-x-2">
                                <TouchableOpacity className="flex-row items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 w-28 mr-2">
                                    <Text className="text-xs font-medium text-gray-700">AUGUST</Text>
                                    <ChevronDown size={14} color="#6B7280" />
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-row items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 w-24 mr-2">
                                    <Text className="text-xs font-medium text-gray-700">2026</Text>
                                    <ChevronDown size={14} color="#6B7280" />
                                </TouchableOpacity>
                                
                                <TouchableOpacity className="flex-row items-center px-4 py-2 border border-green-500 rounded-lg bg-green-50/50 mr-2">
                                    <Download size={14} color="#10B981" />
                                    <Text className="ml-2 text-xs font-bold text-green-600 uppercase">Export Excel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-row items-center px-4 py-2 border border-red-500 rounded-lg bg-red-50/50">
                                    <Download size={14} color="#EF4444" />
                                    <Text className="ml-2 text-xs font-bold text-red-500 uppercase">Export PDF</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Data Table */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <View>
                            {/* Table Header */}
                            <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Labour Name</Text>
                                <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Skill Type</Text>
                                <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Daily Wage</Text>
                                <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Days Present</Text>
                                <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">OT Hours</Text>
                                <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Total Wage Earned</Text>
                                <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Status</Text>
                            </View>

                            {/* Table Rows */}
                            {PAYROLL_DATA.map((row, index) => (
                                <View key={row.id} className={`flex-row items-center px-6 py-4 ${index !== PAYROLL_DATA.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                    <View className="w-48 flex-row items-center">
                                        <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
                                            <Text className="text-blue-600 font-bold">{row.initials}</Text>
                                        </View>
                                        <Text className="text-sm font-semibold text-gray-900">{row.name}</Text>
                                    </View>
                                    
                                    <View className="w-32 items-center">
                                        <View className="bg-gray-100 px-2 py-1 rounded">
                                            <Text className="text-[10px] font-bold text-gray-600 uppercase">{row.skill}</Text>
                                        </View>
                                    </View>
                                    
                                    <Text className="w-32 text-sm font-bold text-gray-900 text-center">{row.wage}</Text>
                                    <Text className="w-32 text-sm font-medium text-gray-600 text-center">{row.days}</Text>
                                    <Text className="w-40 text-sm font-medium text-orange-500 text-center">{row.ot}</Text>
                                    <Text className="w-40 text-sm font-bold text-green-600 text-center">{row.total}</Text>
                                    
                                    <View className="w-24 items-end">
                                        <Text className="text-[10px] font-bold text-green-500 uppercase tracking-wider">{row.status}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View className="px-6 py-4 border-t border-gray-100 flex-row justify-between items-center bg-gray-50/30">
                        <View className="flex-row items-center">
                            <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                            <View className="border border-gray-200 rounded px-2 py-1 bg-white">
                                <Text className="text-xs font-medium">10</Text>
                            </View>
                            <ChevronDown size={14} color="#6B7280" className="ml-1" />
                        </View>
                        <Text className="text-xs text-gray-500">Showing 1 - {PAYROLL_DATA.length} of {PAYROLL_DATA.length} records</Text>
                        <View className="flex-row items-center">
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
            </ScrollView>
        </View>
    );
}
