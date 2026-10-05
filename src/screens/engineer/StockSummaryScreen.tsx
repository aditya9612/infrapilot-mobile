import { ChevronDown, ChevronLeft, ChevronRight, FileSpreadsheet, FileText, PlusCircle, RefreshCw, Search } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { materialService } from '../../services/materialService';

export default function StockSummaryScreen() {
    const { activeProjectId, projects } = require('../../contexts/ProjectContext').useProjectContext();
    const activeProjectName = projects.find((p: any) => String(p.id) === String(activeProjectId) || String(p.project_id) === String(activeProjectId))?.name || (projects.find((p: any) => String(p.id) === String(activeProjectId) || String(p.project_id) === String(activeProjectId)) as any)?.project_name || 'Project';
    const [activeTab, setActiveTab] = useState('Stock Overview');
    const tabs = ['Stock Overview', 'Global Inventory', 'Reports', 'Inventory Adjustment'];

    const [isLoading, setIsLoading] = useState(false);
    const [summaryData, setSummaryData] = useState<any>(null);
    const [stockOverview, setStockOverview] = useState<any[]>([]);
    const [globalInventory, setGlobalInventory] = useState<any[]>([]);
    const [reportsData, setReportsData] = useState<any[]>([]);
    const [adjustmentsData, setAdjustmentsData] = useState<any[]>([]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const projectId = activeProjectId;
            if (activeTab === 'Stock Overview') {
                try {
                    const data = await materialService.getStockOverview(projectId);
                    setStockOverview(Array.isArray(data) ? data : (data?.items || []));
                } catch(e){}
                try {
                    const summary = await materialService.getSummary(projectId);
                    setSummaryData(summary);
                } catch(e){}
            } else if (activeTab === 'Global Inventory') {
                try {
                    const data = await materialService.getGlobalInventory();
                    setGlobalInventory(Array.isArray(data) ? data : (data?.items || []));
                } catch(e){}
            } else if (activeTab === 'Reports') {
                try {
                    const data = await materialService.getReports(projectId);
                    setReportsData(Array.isArray(data) ? data : (data?.reports || []));
                } catch(e){}
            } else if (activeTab === 'Inventory Adjustment') {
                try {
                    const data = await materialService.getTransactions(projectId);
                    setAdjustmentsData(Array.isArray(data) ? data : (data?.transactions || []));
                } catch(e){}
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeTab, activeProjectId]);

    const getAlertStyle = (alert: string) => {
        const status = (alert || '').toUpperCase();
        if (status === 'IN STOCK') return 'text-green-600 bg-green-50 border-green-200';
        if (status === 'LOW STOCK') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (status === 'OUT OF STOCK') return 'text-red-600 bg-red-50 border-red-200';
        return 'text-gray-600 bg-gray-50 border-gray-200';
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

    const renderStockOverview = () => (
        <View>
            <View className="mb-4">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Stock Valuation Stats</Text>
                <View className="flex-row justify-between space-x-4">
                    <View className="flex-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Inventory Scope</Text>
                        <Text className="text-2xl font-bold text-blue-500 mb-1">{summaryData?.resource_types || '0'}</Text>
                        <Text className="text-xs text-gray-400">Resource Types</Text>
                    </View>
                    <View className="flex-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Order Valuation</Text>
                        <Text className="text-2xl font-bold text-green-500 mb-1">₹{summaryData?.total_valuation || '0'}</Text>
                        <Text className="text-xs text-gray-400">Current Stock Value</Text>
                    </View>
                    <View className="flex-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Critical Stock</Text>
                        <Text className="text-2xl font-bold text-red-500 mb-1">{summaryData?.critical_stock || '0'}</Text>
                        <Text className="text-xs text-gray-400">Refill Required</Text>
                    </View>
                </View>
            </View>

            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10">
                <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                    <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase">Project Inventory</Text>
                </View>
                <View className="p-4 border-b border-gray-100 flex-row items-center">
                    <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-64 mr-2">
                        <Search size={16} color="#9CA3AF" />
                        <TextInput placeholder="Search inventory..." className="ml-2 flex-1 text-sm text-gray-700" />
                    </View>
                    <TouchableOpacity onPress={loadData} className="p-2 border border-gray-200 rounded-lg bg-gray-50">
                        <RefreshCw size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View>
                        <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                            <Text className="w-80 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Material Name</Text>
                            <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Remaining Stock</Text>
                            <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Avg Rate</Text>
                            <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Total Value</Text>
                        </View>
                        {isLoading ? (
                            <View className="p-8 items-center"><ActivityIndicator color="#3B82F6" /></View>
                        ) : stockOverview.length === 0 ? (
                            <View className="p-8 items-center"><Text className="text-gray-500">No stock data available</Text></View>
                        ) : (
                            stockOverview.map((row, index) => (
                                <View key={row.id || index} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                    <Text className="w-80 text-sm font-semibold text-gray-800">{row.name || row.material_name}</Text>
                                    <Text className="w-48 text-sm font-bold text-green-600 text-center">{row.stock ?? row.quantity ?? 0}</Text>
                                    <Text className="w-48 text-sm font-medium text-gray-600 text-center">{row.rate ?? row.unit_price ?? '-'}</Text>
                                    <Text className="w-48 text-sm font-bold text-gray-900 text-right">{row.total ?? row.total_value ?? '-'}</Text>
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
                {renderPagination(stockOverview.length)}
            </View>
        </View>
    );

    const renderGlobalInventory = () => (
        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase">All Projects Stock</Text>
            </View>
            <View className="p-4 border-b border-gray-100 flex-row items-center">
                <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-64 mr-2">
                    <Search size={16} color="#9CA3AF" />
                    <TextInput placeholder="Search across all projects..." className="ml-2 flex-1 text-sm text-gray-700" />
                </View>
                <TouchableOpacity onPress={loadData} className="p-2 border border-gray-200 rounded-lg bg-gray-50">
                    <RefreshCw size={16} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                        <Text className="w-80 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Material Name</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Remaining Stock</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Unit</Text>
                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Avg Rate</Text>
                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Total Value</Text>
                    </View>
                    {isLoading ? (
                        <View className="p-8 items-center"><ActivityIndicator color="#3B82F6" /></View>
                    ) : globalInventory.length === 0 ? (
                        <View className="p-8 items-center"><Text className="text-gray-500">No global inventory data available</Text></View>
                    ) : (
                        globalInventory.map((row, index) => (
                            <View key={row.id || index} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <Text className="w-80 text-sm font-semibold text-gray-800">{row.name || row.material_name}</Text>
                                <Text className={`w-32 text-sm font-bold ${row.stockColor || 'text-green-500'} text-center`}>{row.stock ?? row.quantity ?? 0}</Text>
                                <Text className="w-32 text-sm text-gray-500 font-medium text-center">{row.unit ?? '-'}</Text>
                                <Text className="w-48 text-sm font-medium text-gray-600 text-center">{row.rate ?? row.unit_price ?? '-'}</Text>
                                <Text className="w-48 text-sm font-bold text-gray-900 text-right">{row.total ?? row.total_value ?? '-'}</Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
            {renderPagination(globalInventory.length)}
        </View>
    );

    const renderReports = () => (
        <View>
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase">Consumption & Stock Reports</Text>
                <View className="flex-row space-x-3">
                    <TouchableOpacity className="flex-row items-center px-3 py-1.5 border border-red-200 bg-red-50 rounded-lg">
                        <FileText size={14} color="#EF4444" className="mr-2" />
                        <Text className="text-xs font-bold text-red-500">PDF Report</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center px-3 py-1.5 border border-green-200 bg-green-50 rounded-lg">
                        <FileSpreadsheet size={14} color="#10B981" className="mr-2" />
                        <Text className="text-xs font-bold text-green-600">Excel Sheet</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10">
                <View className="p-4 flex-row items-center">
                    <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-64 mr-3">
                        <Search size={16} color="#9CA3AF" />
                        <TextInput placeholder="Search reports..." className="ml-2 flex-1 text-sm text-gray-700" />
                    </View>
                    <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-48 mr-2">
                        <Text className="text-sm text-gray-700">All Alerts</Text>
                        <ChevronDown size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={loadData} className="p-2 border border-gray-200 rounded-lg bg-gray-50">
                        <RefreshCw size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View>
                        <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                            <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Material Name</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Total Purchased</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Total Used</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Remaining</Text>
                            <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Total Cost</Text>
                            <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Pending Pay</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Alert</Text>
                        </View>
                        {isLoading ? (
                            <View className="p-8 items-center"><ActivityIndicator color="#3B82F6" /></View>
                        ) : reportsData.length === 0 ? (
                            <View className="p-8 items-center"><Text className="text-gray-500">No reports available</Text></View>
                        ) : (
                            reportsData.map((row, index) => (
                                <View key={row.id || index} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                    <Text className="w-48 text-sm font-semibold text-gray-800">{row.name || row.material_name}</Text>
                                    <Text className="w-32 text-sm font-medium text-blue-500 text-center">{row.purchased ?? row.total_purchased ?? 0}</Text>
                                    <Text className="w-32 text-sm font-medium text-orange-500 text-center">{row.used ?? row.total_used ?? 0}</Text>
                                    <Text className="w-32 text-sm font-bold text-green-500 text-center">{row.remaining ?? row.total_remaining ?? 0}</Text>
                                    <Text className="w-40 text-sm font-medium text-gray-700 text-center">{row.cost ?? row.total_cost ?? '-'}</Text>
                                    <Text className="w-40 text-sm font-bold text-red-500 text-center">{row.pending ?? row.pending_payment ?? '-'}</Text>
                                    <View className="w-32 flex-row justify-end">
                                        <View className={`px-2 py-0.5 rounded border ${getAlertStyle(row.alert || row.status)}`}>
                                            <Text className={`text-[10px] font-bold ${getAlertStyle(row.alert || row.status).split(' ')[0]}`}>{row.alert || row.status || 'N/A'}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
                {renderPagination(reportsData.length)}
            </View>
        </View>
    );

    const renderInventoryAdjustment = () => (
        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase">Audit Adjustments Log</Text>
                <TouchableOpacity className="flex-row items-center px-4 py-2 bg-orange-500 rounded-lg shadow-sm">
                    <PlusCircle size={16} color="#ffffff" className="mr-2" />
                    <Text className="font-bold text-xs text-white">Audit Adjustment</Text>
                </TouchableOpacity>
            </View>
            <View className="p-4 border-b border-gray-100 flex-row items-center">
                <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-64 mr-3">
                    <Search size={16} color="#9CA3AF" />
                    <TextInput placeholder="Search logs..." className="ml-2 flex-1 text-sm text-gray-700" />
                </View>
                <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-48 mr-2">
                    <Text className="text-sm text-gray-700">Adjustment</Text>
                    <ChevronDown size={16} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity onPress={loadData} className="p-2 border border-gray-200 rounded-lg bg-gray-50">
                    <RefreshCw size={16} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                        <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date</Text>
                        <Text className="w-56 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Material Name</Text>
                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Type</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Qty Change</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Avg Rate</Text>
                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Reason</Text>
                    </View>
                    {isLoading ? (
                        <View className="p-8 items-center"><ActivityIndicator color="#3B82F6" /></View>
                    ) : adjustmentsData.length === 0 ? (
                        <View className="p-8 items-center"><Text className="text-gray-500">No adjustment logs available</Text></View>
                    ) : (
                        adjustmentsData.map((row, index) => (
                            <View key={row.id || index} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <Text className="w-40 text-xs text-gray-600 leading-tight">{row.date || new Date(row.created_at).toLocaleDateString()}</Text>
                                <Text className="w-56 text-sm font-semibold text-gray-800">{row.name || row.material_name}</Text>
                                <View className="w-48 items-center">
                                    <Text className="text-[10px] font-bold text-orange-500 uppercase">{row.type || row.transaction_type}</Text>
                                </View>
                                <Text className={`w-32 text-sm font-bold ${row.qtyColor || 'text-red-500'} text-center`}>{row.qtyChange ?? row.quantity ?? 0}</Text>
                                <Text className="w-32 text-sm font-medium text-gray-600 text-center">{row.rate ?? row.unit_price ?? '-'}</Text>
                                <Text className="w-48 text-sm text-gray-500">{row.reason ?? row.remarks ?? '-'}</Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
            {renderPagination(adjustmentsData.length)}
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <TopHeader
                title="Material Stock"
                subtitle={`Engineer > ${activeProjectName} > Stock & Inventory`}
            />

            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                <View className="mb-6 flex-col md:flex-row md:items-center justify-between">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-xl font-bold text-gray-900">Stock & Inventory Management</Text>
                        <Text className="text-sm text-gray-500 mt-1">Monitor inventory levels, view strategic reports, and perform physical audits.</Text>
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

                {activeTab === 'Stock Overview' && renderStockOverview()}
                {activeTab === 'Global Inventory' && renderGlobalInventory()}
                {activeTab === 'Reports' && renderReports()}
                {activeTab === 'Inventory Adjustment' && renderInventoryAdjustment()}

                <View className="h-12" />
            </ScrollView>
        </View>
    );
}
