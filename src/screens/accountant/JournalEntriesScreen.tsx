import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, TextInput } from 'react-native';
import { Menu, Download, Upload, Eye, Plus, Calendar, Search, ChevronDown, Play, Filter, FileText } from 'lucide-react-native';
import { useNavigation } from 'expo-router';

type Tab = 'Journal Entry' | 'Recurring' | 'Adjustment Register';

export function JournalEntriesScreen() {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const [activeTab, setActiveTab] = useState<Tab>('Journal Entry');

    const manualEntries = [
        { id: 'JRN-340D6620', date: '9/1/2026', description: 'general entry created', status: 'Posted', type: 'Manual', createdAt: '9/1/2026, 9:59:15 AM' },
        { id: 'JRN-CA98D579', date: '9/1/2026', description: 'general entry', status: 'Posted', type: 'Manual', createdAt: '9/1/2026, 9:58:43 AM' },
    ];

    const recurringEntries = [
        { name: 'transport bill', frequency: 'kilometer', nextRunDate: '9/20/2026', status: 'Active' },
        { name: 'internet bill', frequency: '50MBPS', nextRunDate: '9/20/2026', status: 'Active' },
    ];

    const adjustments = [
        { id: 'JRN-8089D002', date: '9/1/2026', description: 'purchase sand', status: 'Posted', type: 'Adjustment', createdAt: '9/1/2026, 10:02:30 AM' },
        { id: 'JRN-C8E28C8A', date: '9/1/2026', description: 'purchase of cement', status: 'Posted', type: 'Adjustment', createdAt: '9/1/2026, 10:01:05 AM' },
    ];

    return (
        <View className="flex-1 bg-[#F8F9FA]">
            {/* Header */}
            <View className="bg-[#2563EB] px-6 py-4 flex-row items-center justify-between z-10">
                <View className="flex-row items-center">
                    {!isDesktop && (
                        <TouchableOpacity onPress={() => (navigation as any).toggleDrawer()} className="mr-4">
                            <Menu color="#fff" size={24} />
                        </TouchableOpacity>
                    )}
                    <View>
                        <Text className="text-white text-xl font-bold">Journal Entries</Text>
                        <Text className="text-blue-200 text-xs mt-1">Accountant • Journal Entries</Text>
                    </View>
                </View>
                <View className="flex-row items-center space-x-4">
                    <View className="relative">
                        <View className="w-4 h-4 bg-red-500 rounded-full absolute -top-1 -right-1 z-10 items-center justify-center">
                            <Text className="text-white text-[8px] font-bold">21</Text>
                        </View>
                        <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                            <Menu color="#fff" size={16} />
                        </View>
                    </View>
                    <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                        <Text className="text-white font-bold">A</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4 md:p-6">
                    {/* Title & Actions */}
                    <View className="flex-col md:flex-row md:items-center justify-between mb-6">
                        <View className="mb-4 md:mb-0">
                            <Text className="text-2xl font-bold text-gray-900">
                                {activeTab === 'Journal Entry' && 'Journal Entries'}
                                {activeTab === 'Recurring' && 'Recurring Entries'}
                                {activeTab === 'Adjustment Register' && 'Adjustment Register'}
                            </Text>
                            <Text className="text-gray-500 mt-1">
                                {activeTab === 'Journal Entry' && 'Record and manage manual journal entries.'}
                                {activeTab === 'Recurring' && 'Manage recurring and automated journal entries.'}
                                {activeTab === 'Adjustment Register' && 'Manage accounting adjustments and corrections.'}
                            </Text>
                        </View>
                        <View className="flex-row flex-wrap gap-2">
                            {activeTab === 'Journal Entry' && (
                                <>
                                    <TouchableOpacity className="flex-row items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <Download size={16} color="#6B7280" className="mr-2" />
                                        <Text className="text-gray-700 font-medium text-sm">Export</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-row items-center px-4 py-2 bg-[#2563EB] rounded-lg shadow-sm">
                                        <Plus size={16} color="#FFFFFF" className="mr-2" />
                                        <Text className="text-white font-medium text-sm">New Entry</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                            {activeTab === 'Recurring' && (
                                <>
                                    <TouchableOpacity className="flex-row items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                                        <Play size={16} color="#10B981" className="mr-2" />
                                        <Text className="text-green-700 font-medium text-sm">Run Due</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-row items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <Download size={16} color="#6B7280" className="mr-2" />
                                        <Text className="text-gray-700 font-medium text-sm">Export</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-row items-center px-4 py-2 bg-[#2563EB] rounded-lg shadow-sm">
                                        <Text className="text-white font-medium text-sm">New Recurring</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                            {activeTab === 'Adjustment Register' && (
                                <>
                                    <TouchableOpacity className="flex-row items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <FileText size={16} color="#6B7280" className="mr-2" />
                                        <Text className="text-gray-700 font-medium text-sm">Template</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-row items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <Upload size={16} color="#6B7280" className="mr-2" />
                                        <Text className="text-gray-700 font-medium text-sm">Import</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-row items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <Download size={16} color="#6B7280" className="mr-2" />
                                        <Text className="text-gray-700 font-medium text-sm">Export</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-row items-center px-4 py-2 bg-[#2563EB] rounded-lg shadow-sm">
                                        <Text className="text-white font-medium text-sm">New Adjustment</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>

                    {/* Tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                        <View className="flex-row bg-white rounded-lg p-1 border border-gray-200">
                            {(['Journal Entry', 'Recurring', 'Adjustment Register'] as Tab[]).map((tab) => (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-md ${activeTab === tab ? 'bg-blue-50' : 'bg-transparent'}`}
                                >
                                    <Text className={`font-medium ${activeTab === tab ? 'text-blue-600' : 'text-gray-600'}`}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Content Section */}
                    {activeTab === 'Journal Entry' && (
                        <View className="space-y-6">
                            {/* Empty Card to match screenshot style */}
                            <View className="bg-white rounded-xl border border-gray-200 p-4">
                                <Text className="font-bold text-gray-800">Manual Journal Entries</Text>
                            </View>

                            <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <View className="p-4 border-b border-gray-100">
                                    <Text className="font-bold text-gray-800">Recent Manual Entries</Text>
                                </View>
                                
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={{ minWidth: 1000 }}>
                                        {/* Table Header */}
                                        <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-100">
                                            <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">JOURNAL NUMBER</Text>
                                            <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">ENTRY DATE</Text>
                                            <Text className="flex-2 text-xs font-bold text-gray-500 uppercase tracking-wider">DESCRIPTION</Text>
                                            <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">STATUS</Text>
                                            <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">ENTRY TYPE</Text>
                                            <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">CREATED AT</Text>
                                            <Text className="w-20 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">ACTION</Text>
                                        </View>
                                        
                                        {/* Table Body */}
                                        {manualEntries.map((row, idx) => (
                                            <View key={idx} className="flex-row items-center p-4 border-b border-gray-50 hover:bg-gray-50">
                                                <Text className="flex-1 text-sm font-medium text-blue-600">{row.id}</Text>
                                                <Text className="flex-1 text-sm text-gray-600">{row.date}</Text>
                                                <Text className="flex-2 text-sm text-gray-600">{row.description}</Text>
                                                <View className="flex-1">
                                                    <View className="bg-green-100 px-2 py-1 rounded-full self-start">
                                                        <Text className="text-[10px] font-bold text-green-700">{row.status}</Text>
                                                    </View>
                                                </View>
                                                <Text className="flex-1 text-sm text-gray-600 font-medium">{row.type}</Text>
                                                <Text className="flex-1 text-sm text-gray-500">{row.createdAt}</Text>
                                                <View className="w-20 items-center">
                                                    <TouchableOpacity className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center">
                                                        <Eye size={16} color="#3B82F6" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>

                                {/* Pagination Footer */}
                                <View className="p-4 border-t border-gray-100 flex-row items-center justify-between bg-gray-50">
                                    <View className="flex-row items-center">
                                        <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                                        <View className="bg-white border border-gray-200 rounded px-2 py-1 flex-row items-center">
                                            <Text className="text-xs text-gray-700 mr-1">10</Text>
                                            <ChevronDown size={12} color="#6B7280" />
                                        </View>
                                    </View>
                                    <Text className="text-xs text-gray-500">Showing 1 - 2 of 2 records</Text>
                                    <View className="flex-row items-center space-x-1">
                                        <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                            <Text className="text-gray-400">{'<'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="w-6 h-6 items-center justify-center rounded bg-blue-600">
                                            <Text className="text-white text-xs font-bold">1</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                            <Text className="text-gray-400">{'>'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {activeTab === 'Recurring' && (
                        <View className="space-y-6">
                            <View className="bg-white rounded-xl border border-gray-200 p-4">
                                <Text className="font-bold text-gray-800">Recurring Entries</Text>
                            </View>

                            <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <View className="p-4 border-b border-gray-100">
                                    <Text className="font-bold text-gray-800">Active Recurring Journals</Text>
                                </View>
                                
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={{ minWidth: 900 }}>
                                        {/* Table Header */}
                                        <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-100">
                                            <Text className="flex-2 text-xs font-bold text-gray-500 uppercase tracking-wider">TEMPLATE NAME</Text>
                                            <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">FREQUENCY</Text>
                                            <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">NEXT RUN DATE</Text>
                                            <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">STATUS</Text>
                                            <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">ACTION</Text>
                                        </View>
                                        
                                        {/* Table Body */}
                                        {recurringEntries.map((row, idx) => (
                                            <View key={idx} className="flex-row items-center p-4 border-b border-gray-50 hover:bg-gray-50">
                                                <Text className="flex-2 text-sm font-medium text-gray-800">{row.name}</Text>
                                                <Text className="flex-1 text-sm text-gray-600">{row.frequency}</Text>
                                                <Text className="flex-1 text-sm text-gray-600">{row.nextRunDate}</Text>
                                                <View className="flex-1">
                                                    <View className="bg-green-100 px-2 py-1 rounded-full self-start">
                                                        <Text className="text-[10px] font-bold text-green-700">{row.status}</Text>
                                                    </View>
                                                </View>
                                                <View className="flex-1 items-center">
                                                    <TouchableOpacity>
                                                        <Text className="text-xs font-bold text-yellow-600">Toggle Status</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                                
                                {/* Pagination Footer */}
                                <View className="p-4 border-t border-gray-100 flex-row items-center justify-between bg-gray-50">
                                    <View className="flex-row items-center">
                                        <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                                        <View className="bg-white border border-gray-200 rounded px-2 py-1 flex-row items-center">
                                            <Text className="text-xs text-gray-700 mr-1">10</Text>
                                            <ChevronDown size={12} color="#6B7280" />
                                        </View>
                                    </View>
                                    <Text className="text-xs text-gray-500">Showing 1 - 2 of 2 records</Text>
                                    <View className="flex-row items-center space-x-1">
                                        <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                            <Text className="text-gray-400">{'<'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="w-6 h-6 items-center justify-center rounded bg-blue-600">
                                            <Text className="text-white text-xs font-bold">1</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                            <Text className="text-gray-400">{'>'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {activeTab === 'Adjustment Register' && (
                        <View className="space-y-6">
                            <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <View className="p-4 border-b border-gray-100 flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                                    <Text className="font-bold text-gray-800">All Adjustment Registers</Text>
                                    
                                    <View className="flex-row flex-wrap items-center gap-3">
                                        <View className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex-row items-center min-w-[150px]">
                                            <TextInput placeholder="Search..." placeholderTextColor="#9CA3AF" className="flex-1 text-sm outline-none" />
                                        </View>
                                        <View className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex-row items-center min-w-[120px] justify-between">
                                            <Text className="text-gray-400 text-sm">Status...</Text>
                                        </View>
                                        <View className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex-row items-center justify-between">
                                            <Text className="text-gray-500 text-sm mr-2">dd-mm-yyyy</Text>
                                            <Calendar size={14} color="#6B7280" />
                                        </View>
                                        <View className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex-row items-center justify-between">
                                            <Text className="text-gray-500 text-sm mr-2">dd-mm-yyyy</Text>
                                            <Calendar size={14} color="#6B7280" />
                                        </View>
                                        <TouchableOpacity className="bg-[#2563EB] rounded-lg px-4 py-2 flex-row items-center">
                                            <Filter size={14} color="#fff" className="mr-2" />
                                            <Text className="text-white font-medium text-sm">Filter</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={{ minWidth: 1000 }}>
                                        {/* Table Header */}
                                        <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-100">
                                            <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">JOURNAL NUMBER</Text>
                                            <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">ENTRY DATE</Text>
                                            <Text className="flex-2 text-xs font-bold text-gray-500 uppercase tracking-wider">DESCRIPTION</Text>
                                            <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">STATUS</Text>
                                            <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">ENTRY TYPE</Text>
                                            <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">CREATED AT</Text>
                                            <Text className="w-20 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">ACTION</Text>
                                        </View>
                                        
                                        {/* Table Body */}
                                        {adjustments.map((row, idx) => (
                                            <View key={idx} className="flex-row items-center p-4 border-b border-gray-50 hover:bg-gray-50">
                                                <Text className="flex-1 text-sm font-medium text-green-600">{row.id}</Text>
                                                <Text className="flex-1 text-sm text-gray-600">{row.date}</Text>
                                                <Text className="flex-2 text-sm text-gray-600">{row.description}</Text>
                                                <View className="flex-1">
                                                    <View className="bg-green-100 px-2 py-1 rounded-full self-start">
                                                        <Text className="text-[10px] font-bold text-green-700">{row.status}</Text>
                                                    </View>
                                                </View>
                                                <Text className="flex-1 text-sm text-gray-600 font-medium">{row.type}</Text>
                                                <Text className="flex-1 text-sm text-gray-500">{row.createdAt}</Text>
                                                <View className="w-20 items-center">
                                                    <TouchableOpacity className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center">
                                                        <Eye size={16} color="#3B82F6" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                                
                                {/* Pagination Footer */}
                                <View className="p-4 border-t border-gray-100 flex-row items-center justify-between bg-gray-50">
                                    <View className="flex-row items-center">
                                        <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                                        <View className="bg-white border border-gray-200 rounded px-2 py-1 flex-row items-center">
                                            <Text className="text-xs text-gray-700 mr-1">10</Text>
                                            <ChevronDown size={12} color="#6B7280" />
                                        </View>
                                    </View>
                                    <Text className="text-xs text-gray-500">Showing 1 - 2 of 2 records</Text>
                                    <View className="flex-row items-center space-x-1">
                                        <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                            <Text className="text-gray-400">{'<'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="w-6 h-6 items-center justify-center rounded bg-blue-600">
                                            <Text className="text-white text-xs font-bold">1</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                            <Text className="text-gray-400">{'>'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
