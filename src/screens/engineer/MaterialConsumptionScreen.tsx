import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { Search, RefreshCw, ChevronDown, ChevronLeft, ChevronRight, Link } from 'lucide-react-native';

const USAGE_DATA = [
    { id: '1', name: 'Ultratech Cement Opc 53', stock: 6, rate: '₹100', total: '₹600' },
    { id: '2', name: 'Ultratech Cement Opc 53', stock: 3, rate: '₹1,000', total: '₹3,000' },
    { id: '3', name: 'Cement', stock: 0, rate: '₹100', total: '₹0' },
    { id: '4', name: 'Cement', stock: 90, rate: '₹200', total: '₹18,000' },
    { id: '5', name: 'Cement', stock: 9, rate: '₹1,000', total: '₹9,000' },
    { id: '6', name: 'Cement', stock: 100, rate: '₹100', total: '₹10,000' },
    { id: '7', name: 'Sand', stock: 90, rate: '₹100', total: '₹9,000' },
    { id: '8', name: 'Material Master', stock: 6, rate: '₹100', total: '₹600' },
    { id: '9', name: 'Material Master', stock: 0, rate: '₹200', total: '₹0' },
    { id: '10', name: 'Material Master', stock: 1, rate: '₹100', total: '₹100' },
];

const TRANSFERS_DATA = [
    { id: '1', material: 'Gi Pipe', from: 'Sara City', to: 'Rohan Harita', qty: 1, status: 'COMPLETED', date: 'N/A' },
    { id: '2', material: 'electric buttons', from: 'Sara City', to: 'Rohan Harita', qty: 1, status: 'COMPLETED', date: 'N/A' },
    { id: '3', material: 'electric buttons', from: 'Sara City', to: 'Rohan Harita', qty: 1, status: 'COMPLETED', date: 'N/A' },
    { id: '4', material: 'Pvc Pipe', from: 'Rohan Harita', to: 'Sara City', qty: 1, status: 'COMPLETED', date: 'N/A' },
    { id: '5', material: 'Pvc Pipe', from: 'Rohan Harita', to: 'Sara City', qty: 1, status: 'COMPLETED', date: 'N/A' },
    { id: '6', material: 'Pvc Pipe', from: 'Sara City', to: 'Rohan Harita', qty: 10, status: 'COMPLETED', date: 'N/A' },
    { id: '7', material: 'material master', from: 'Rohan Harita', to: 'Sara City', qty: 1, status: 'COMPLETED', date: 'N/A' },
    { id: '8', material: 'material master', from: 'Sara City', to: 'Rohan Harita', qty: 1, status: 'COMPLETED', date: 'N/A' },
    { id: '9', material: 'UltraTech Cement OPC 53', from: 'Sara City', to: 'Rohan Harita', qty: 1, status: 'COMPLETED', date: 'N/A' },
    { id: '10', material: 'cement', from: 'Sara City', to: 'Rohan Harita', qty: 1, status: 'COMPLETED', date: 'N/A' },
];

const TRANSACTIONS_DATA = [
    { id: '1', date: '8/25/2026, 8:20:23 AM', type: 'TRANSFER_OUT', material: 'Gi Pipe', qty: -1, rate: '₹200', amount: '₹200', issueType: 'TRANSFER' },
    { id: '2', date: '8/25/2026, 8:16:31 AM', type: 'USAGE', material: 'Sand', qty: -10, rate: '₹100', amount: '₹1,000', issueType: 'SITE' },
    { id: '3', date: '8/25/2026, 8:12:50 AM', type: 'PURCHASE', material: 'Gi Pipe', qty: 20, rate: '₹500', amount: '₹10,000', issueType: 'PURCHASE' },
    { id: '4', date: '8/25/2026, 8:10:17 AM', type: 'PURCHASE', material: 'Gi Pipe', qty: 100, rate: '₹500', amount: '₹50,000', issueType: 'PURCHASE' },
    { id: '5', date: '8/24/2026, 5:12:34 AM', type: 'ADJUSTMENT', material: 'Electric Buttons', qty: -195, rate: '₹1,500', amount: '₹2,92,500', issueType: 'SYSTEM' },
    { id: '6', date: '8/24/2026, 5:12:03 AM', type: 'USAGE', material: 'Electric Buttons', qty: -1, rate: '₹1,500', amount: '₹1,500', issueType: 'SYSTEM' },
    { id: '7', date: '8/24/2026, 5:10:37 AM', type: 'TRANSFER_OUT', material: 'Electric Buttons', qty: -1, rate: '₹1,500', amount: '₹1,500', issueType: 'TRANSFER' },
    { id: '8', date: '8/22/2026, 5:11:25 AM', type: 'ADJUSTMENT', material: 'Material Master', qty: -9, rate: '₹100', amount: '₹900', issueType: 'SYSTEM' },
    { id: '9', date: '8/22/2026, 5:10:36 AM', type: 'USAGE', material: 'Material Master', qty: -1, rate: '₹100', amount: '₹100', issueType: 'SYSTEM' },
    { id: '10', date: '8/22/2026, 5:08:07 AM', type: 'TRANSFER_OUT', material: 'Electric Buttons', qty: -1, rate: '₹1,500', amount: '₹1,500', issueType: 'TRANSFER' },
];

export default function MaterialConsumptionScreen() {
    const [activeTab, setActiveTab] = useState('Usage');
    const tabs = ['Usage', 'Transfers', 'Transactions'];

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'PURCHASE': return 'text-blue-500';
            case 'TRANSFER_OUT':
            case 'USAGE':
            case 'ADJUSTMENT':
                return 'text-orange-500';
            default: return 'text-gray-500';
        }
    };

    const renderPagination = (totalRecords: number) => (
        <View className="p-4 border-t border-gray-100 flex-row justify-between items-center bg-white">
            <View className="flex-row items-center">
                <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                <TouchableOpacity className="flex-row items-center px-2 py-1 border border-gray-200 rounded bg-white">
                    <Text className="text-xs text-gray-700 mr-1">10</Text>
                    <ChevronDown size={14} color="#6B7280" />
                </TouchableOpacity>
            </View>
            <Text className="text-xs text-gray-500">Showing 1 - 10 of {totalRecords} records</Text>
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
    );

    const renderUsage = () => (
        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase">Consumption Logs</Text>
            </View>
            <View className="p-4 border-b border-gray-100 flex-row items-center">
                <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-64 mr-2">
                    <Search size={16} color="#9CA3AF" />
                    <TextInput placeholder="Search usage..." className="ml-2 flex-1 text-sm text-gray-700" />
                </View>
                <TouchableOpacity className="p-2 border border-gray-200 rounded-lg bg-gray-50">
                    <RefreshCw size={16} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                        <Text className="w-64 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Material Name</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Remaining Stock</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Avg Rate</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Total Value</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</Text>
                    </View>
                    {USAGE_DATA.map((row, index) => (
                        <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                            <Text className="w-64 text-sm font-semibold text-gray-800">{row.name}</Text>
                            <Text className="w-32 text-sm font-bold text-green-600 text-center">{row.stock}</Text>
                            <Text className="w-32 text-sm font-medium text-gray-600 text-center">{row.rate}</Text>
                            <Text className="w-32 text-sm font-medium text-gray-600 text-center">{row.total}</Text>
                            <View className="w-32 flex-row justify-end">
                                <TouchableOpacity className="bg-red-50 px-3 py-1.5 rounded border border-red-100">
                                    <Text className="text-red-500 text-[10px] font-bold uppercase tracking-wider">Record Usage</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {renderPagination(25)}
        </View>
    );

    const renderTransfers = () => (
        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase">Consumption Logs</Text>
            </View>
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-64 mr-2">
                        <Search size={16} color="#9CA3AF" />
                        <TextInput placeholder="Search transfers..." className="ml-2 flex-1 text-sm text-gray-700" />
                    </View>
                    <TouchableOpacity className="p-2 border border-gray-200 rounded-lg bg-gray-50">
                        <RefreshCw size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity className="flex-row items-center px-4 py-2 bg-blue-600 rounded-lg shadow-sm">
                    <Text className="font-bold text-xs text-white">Initiate Transfer</Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Material</Text>
                        <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">From Project</Text>
                        <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">To Project</Text>
                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Qty</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Status</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Transfer Date</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</Text>
                    </View>
                    {TRANSFERS_DATA.map((row, index) => (
                        <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                            <Text className="w-48 text-sm font-semibold text-gray-800">{row.material}</Text>
                            <Text className="w-40 text-sm text-gray-600">{row.from}</Text>
                            <Text className="w-40 text-sm text-gray-600">{row.to}</Text>
                            <Text className="w-24 text-sm font-medium text-gray-600 text-center">{row.qty}</Text>
                            <View className="w-32 items-center">
                                <View className="px-2 py-0.5 rounded border border-green-200 bg-green-50">
                                    <Text className="text-[10px] font-bold text-green-600">{row.status}</Text>
                                </View>
                            </View>
                            <Text className="w-32 text-sm text-gray-500 text-center">{row.date}</Text>
                            <View className="w-32 flex-row justify-end items-center">
                                <Link size={14} color="#3B82F6" className="mr-1" />
                                <Text className="text-blue-500 text-xs font-medium">Update Status</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {renderPagination(16)}
        </View>
    );

    const renderTransactions = () => (
        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase">Consumption Logs</Text>
            </View>
            <View className="p-4 border-b border-gray-100 flex-row items-center">
                <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-64 mr-3">
                    <Search size={16} color="#9CA3AF" />
                    <TextInput placeholder="Search transactions..." className="ml-2 flex-1 text-sm text-gray-700" />
                </View>
                <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-48 mr-2">
                    <Text className="text-sm text-gray-700">All Materials</Text>
                    <ChevronDown size={16} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2 border border-gray-200 rounded-lg bg-gray-50">
                    <RefreshCw size={16} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date</Text>
                        <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Type</Text>
                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Material</Text>
                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Qty</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Rate</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Amount</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Issue Type</Text>
                    </View>
                    {TRANSACTIONS_DATA.map((row, index) => (
                        <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                            <Text className="w-48 text-sm text-gray-600">{row.date}</Text>
                            <View className="w-40 items-center">
                                <View className={`px-2 py-0.5 rounded border border-gray-100 bg-gray-50`}>
                                    <Text className={`text-[10px] font-bold uppercase ${getTypeColor(row.type)}`}>{row.type}</Text>
                                </View>
                            </View>
                            <Text className="w-48 text-sm font-semibold text-gray-800">{row.material}</Text>
                            <Text className="w-24 text-sm font-medium text-gray-600 text-center">{row.qty}</Text>
                            <Text className="w-32 text-sm font-medium text-gray-600 text-center">{row.rate}</Text>
                            <Text className="w-32 text-sm font-bold text-gray-900 text-center">{row.amount}</Text>
                            <Text className="w-32 text-sm text-gray-600">{row.issueType}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {renderPagination(83)}
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <TopHeader 
                title="Material Consumption" 
                subtitle="Engineer > Material Management > Consumption" 
            />
            
            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                
                {/* Header Section */}
                <View className="mb-6 flex-col md:flex-row md:items-center justify-between">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-xl font-bold text-gray-900">Consumption & Logistics</Text>
                        <Text className="text-sm text-gray-500 mt-1">Manage usage, inter-project transfers, and log history</Text>
                    </View>
                    
                    <View className="flex-row items-center space-x-3">
                        <TouchableOpacity className="flex-row items-center justify-between px-3 py-1.5 border border-gray-200 rounded-lg bg-white w-48">
                            <View className="flex-row items-center">
                                <Text className="text-xs text-gray-500 mr-2">Project:</Text>
                                <Text className="text-xs font-bold text-gray-700">Sara City</Text>
                            </View>
                            <ChevronDown size={14} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tabs */}
                <View className="mb-6">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row items-center bg-white rounded-[24px] p-1 border border-gray-200">
                            {tabs.map((tab) => (
                                <TouchableOpacity 
                                    key={tab}
                                    onPress={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-[24px] ${activeTab === tab ? 'bg-gray-100 shadow-sm' : 'bg-transparent'}`}
                                >
                                    <Text className={`text-xs font-bold tracking-wider ${activeTab === tab ? 'text-gray-900' : 'text-gray-500'}`}>{tab}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Tab Content */}
                {activeTab === 'Usage' && renderUsage()}
                {activeTab === 'Transfers' && renderTransfers()}
                {activeTab === 'Transactions' && renderTransactions()}

                {/* Padding at bottom for safe area */}
                <View className="h-12" />
            </ScrollView>
        </View>
    );
}
