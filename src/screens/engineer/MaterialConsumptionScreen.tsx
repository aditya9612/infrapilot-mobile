import { ChevronDown, ChevronLeft, ChevronRight, Link, RefreshCw, Search } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { materialService } from '../../services/materialService';

export default function MaterialConsumptionScreen() {
    const { activeProjectId, projects } = require('../../contexts/ProjectContext').useProjectContext();
    const activeProjectName = projects.find((p: any) => p.id === activeProjectId || p.project_id === activeProjectId)?.name || (projects.find((p: any) => p.id === activeProjectId || p.project_id === activeProjectId) as any)?.project_name || 'Sara City';
    const [activeTab, setActiveTab] = useState('Usage');
    const tabs = ['Usage', 'Transfers', 'Transactions'];

    const [isLoading, setIsLoading] = useState(false);
    const [usageData, setUsageData] = useState<any[]>([]);
    const [transfersData, setTransfersData] = useState<any[]>([]);
    const [transactionsData, setTransactionsData] = useState<any[]>([]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const projectId = activeProjectId;
            if (activeTab === 'Usage') {
                try {
                    const res = await materialService.getStockOverview(projectId);
                    setUsageData(Array.isArray(res) ? res : (res?.items || []));
                } catch(e){}
            } else if (activeTab === 'Transfers') {
                try {
                    const res = await materialService.getTransfers(projectId);
                    setTransfersData(Array.isArray(res) ? res : (res?.transfers || []));
                } catch(e){}
            } else if (activeTab === 'Transactions') {
                try {
                    const res = await materialService.getTransactions(projectId);
                    setTransactionsData(Array.isArray(res) ? res : (res?.transactions || []));
                } catch(e){}
            }
        } catch (error) {
            console.error('Failed to load consumption data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeTab, activeProjectId]);

    const getTypeColor = (type: string) => {
        const uppercaseType = (type || '').toUpperCase();
        if (uppercaseType === 'PURCHASE') return 'text-blue-500';
        if (['TRANSFER_OUT', 'USAGE', 'ADJUSTMENT'].includes(uppercaseType)) return 'text-orange-500';
        return 'text-gray-500';
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
                <TouchableOpacity onPress={loadData} className="p-2 border border-gray-200 rounded-lg bg-gray-50">
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
                    {isLoading ? (
                        <View className="p-8 items-center"><ActivityIndicator color="#3B82F6" /></View>
                    ) : usageData.length === 0 ? (
                        <View className="p-8 items-center"><Text className="text-gray-500">No usage data found.</Text></View>
                    ) : (
                        usageData.map((row: any, index: number) => (
                            <View key={row.id || index} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <Text className="w-64 text-sm font-semibold text-gray-800">{row.name || row.material_name}</Text>
                                <Text className="w-32 text-sm font-bold text-green-600 text-center">{row.stock ?? row.quantity ?? 0}</Text>
                                <Text className="w-32 text-sm font-medium text-gray-600 text-center">{row.rate ?? row.unit_price ?? '-'}</Text>
                                <Text className="w-32 text-sm font-medium text-gray-600 text-center">{row.total ?? row.total_value ?? '-'}</Text>
                                <View className="w-32 flex-row justify-end">
                                    <TouchableOpacity className="bg-red-50 px-3 py-1.5 rounded border border-red-100">
                                        <Text className="text-red-500 text-[10px] font-bold uppercase tracking-wider">Record Usage</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
            {renderPagination(usageData.length)}
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
                    <TouchableOpacity onPress={loadData} className="p-2 border border-gray-200 rounded-lg bg-gray-50">
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
                    {isLoading ? (
                        <View className="p-8 items-center"><ActivityIndicator color="#3B82F6" /></View>
                    ) : transfersData.length === 0 ? (
                        <View className="p-8 items-center"><Text className="text-gray-500">No transfer data found.</Text></View>
                    ) : (
                        transfersData.map((row: any, index: number) => (
                            <View key={row.id || index} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <Text className="w-48 text-sm font-semibold text-gray-800">{row.material || row.material_name}</Text>
                                <Text className="w-40 text-sm text-gray-600">{row.from || row.from_project || '-'}</Text>
                                <Text className="w-40 text-sm text-gray-600">{row.to || row.to_project || '-'}</Text>
                                <Text className="w-24 text-sm font-medium text-gray-600 text-center">{row.qty ?? row.quantity ?? 0}</Text>
                                <View className="w-32 items-center">
                                    <View className="px-2 py-0.5 rounded border border-green-200 bg-green-50">
                                        <Text className="text-[10px] font-bold text-green-600">{row.status || 'COMPLETED'}</Text>
                                    </View>
                                </View>
                                <Text className="w-32 text-sm text-gray-500 text-center">{row.date || new Date(row.created_at || Date.now()).toLocaleDateString()}</Text>
                                <View className="w-32 flex-row justify-end items-center">
                                    <Link size={14} color="#3B82F6" className="mr-1" />
                                    <Text className="text-blue-500 text-xs font-medium">Update Status</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
            {renderPagination(transfersData.length)}
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
                <TouchableOpacity onPress={loadData} className="p-2 border border-gray-200 rounded-lg bg-gray-50">
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
                    {isLoading ? (
                        <View className="p-8 items-center"><ActivityIndicator color="#3B82F6" /></View>
                    ) : transactionsData.length === 0 ? (
                        <View className="p-8 items-center"><Text className="text-gray-500">No transaction data found.</Text></View>
                    ) : (
                        transactionsData.map((row: any, index: number) => (
                            <View key={row.id || index} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <Text className="w-48 text-sm text-gray-600">{row.date || new Date(row.created_at || Date.now()).toLocaleString()}</Text>
                                <View className="w-40 items-center">
                                    <View className={`px-2 py-0.5 rounded border border-gray-100 bg-gray-50`}>
                                        <Text className={`text-[10px] font-bold uppercase ${getTypeColor(row.type || row.transaction_type)}`}>{row.type || row.transaction_type || 'SYSTEM'}</Text>
                                    </View>
                                </View>
                                <Text className="w-48 text-sm font-semibold text-gray-800">{row.material || row.material_name}</Text>
                                <Text className="w-24 text-sm font-medium text-gray-600 text-center">{row.qty ?? row.quantity ?? 0}</Text>
                                <Text className="w-32 text-sm font-medium text-gray-600 text-center">{row.rate ?? row.unit_price ?? '-'}</Text>
                                <Text className="w-32 text-sm font-bold text-gray-900 text-center">{row.amount ?? row.total_value ?? '-'}</Text>
                                <Text className="w-32 text-sm text-gray-600">{row.issueType || row.issue_type || '-'}</Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
            {renderPagination(transactionsData.length)}
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <TopHeader
                title="Material Consumption"
                subtitle={`Engineer > ${activeProjectName} > Consumption`}
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
                                <Text className="text-xs font-bold text-gray-700">{activeProjectName}</Text>
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
