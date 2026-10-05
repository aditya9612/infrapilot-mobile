import { Edit2, Eye, Plus, Search, Trash2 } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { materialService } from '../../services/materialService';

export default function MaterialReceiptScreen() {
    const { activeProjectId, projects } = require('../../contexts/ProjectContext').useProjectContext();
    const activeProjectName = projects.find((p: any) => p.id === activeProjectId || p.project_id === activeProjectId)?.name || (projects.find((p: any) => p.id === activeProjectId || p.project_id === activeProjectId) as any)?.project_name || 'Sara City';
    const [activeTab, setActiveTab] = useState('Dashboard');
    const tabs = ['Dashboard', 'Materials', 'Suppliers', 'Purchase Orders'];

    const [isLoading, setIsLoading] = useState(false);
    const [alertsData, setAlertsData] = useState<any[]>([]);
    const [materialsData, setMaterialsData] = useState<any[]>([]);
    const [suppliersData, setSuppliersData] = useState<any[]>([]);
    const [poData, setPoData] = useState<any[]>([]);
    const [dashboardStats, setDashboardStats] = useState({
        totalMaterials: 0,
        inventoryValue: 0,
        pendingPayments: 0,
        lowStockAlerts: 0
    });

    const loadData = async () => {
        setIsLoading(true);
        try {
            const projectId = activeProjectId;
            if (activeTab === 'Dashboard') {
                try {
                    const alertsRes = await materialService.getAlerts(projectId);
                    setAlertsData(Array.isArray(alertsRes) ? alertsRes : (alertsRes?.alerts || []));
                } catch(e){}
                try {
                    const summaryRes = await materialService.getSummary(projectId);
                    setDashboardStats({
                        totalMaterials: summaryRes?.resource_types || 0,
                        inventoryValue: summaryRes?.total_valuation || 0,
                        pendingPayments: summaryRes?.pending_payment || 0,
                        lowStockAlerts: summaryRes?.critical_stock || 0
                    });
                } catch(e){}
            } else if (activeTab === 'Materials') {
                try {
                    const res = await materialService.getMasterMaterials(projectId);
                    setMaterialsData(Array.isArray(res) ? res : (res?.items || []));
                } catch(e){}
            } else if (activeTab === 'Suppliers') {
                try {
                    const res = await materialService.getSuppliers(projectId);
                    setSuppliersData(Array.isArray(res) ? res : (res?.suppliers || []));
                } catch(e){}
            } else if (activeTab === 'Purchase Orders') {
                try {
                    const res = await materialService.getPurchaseOrders(projectId);
                    setPoData(Array.isArray(res) ? res : (res?.purchase_orders || []));
                } catch(e){}
            }
        } catch (error) {
            console.error('Failed to load material receipt data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeTab, activeProjectId]);

    const getAlertStyle = (alertText: string) => {
        const text = (alertText || '').toUpperCase();
        if (text.includes('OUT OF STOCK')) return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' };
        if (text.includes('LOW STOCK')) return { bg: 'bg-red-50/50', text: 'text-red-500', border: 'border-red-100' };
        if (text.includes('NEAR LOW')) return { bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-200' };
        if (text.includes('IN STOCK')) return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' };
        if (text.includes('CREATED')) return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
        return { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' };
    };

    const renderDashboard = () => (
        <View>
            <View className="mb-6">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Quick Stats</Text>
                {isLoading && <ActivityIndicator color="#3B82F6" className="mb-4" />}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">Total Materials</Text>
                        <Text className="text-2xl font-bold text-gray-800">{dashboardStats.totalMaterials}</Text>
                        <Text className="text-xs text-gray-400 mt-1">Registered items</Text>
                    </View>
                    <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">Inventory Value</Text>
                        <Text className="text-2xl font-bold text-blue-600">₹{dashboardStats.inventoryValue}</Text>
                        <Text className="text-xs text-gray-400 mt-1">Total stock valuation</Text>
                    </View>
                    <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">Pending Payments</Text>
                        <Text className="text-2xl font-bold text-red-500">₹{dashboardStats.pendingPayments}</Text>
                        <Text className="text-xs text-gray-400 mt-1">Amount due</Text>
                    </View>
                    <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">Low Stock Alerts</Text>
                        <Text className="text-2xl font-bold text-orange-500">{dashboardStats.lowStockAlerts}</Text>
                        <Text className="text-xs text-gray-400 mt-1">Items below threshold</Text>
                    </View>
                </ScrollView>
            </View>

            <View>
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Alerts</Text>
                <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6">
                    <View className="flex-row items-center mb-4">
                        <View className="bg-orange-100 p-1.5 rounded mr-2">
                            <Text className="text-orange-500 font-bold">!</Text>
                        </View>
                        <Text className="text-lg font-bold text-gray-800">Material Alerts</Text>
                    </View>
                    {isLoading ? (
                        <ActivityIndicator color="#3B82F6" className="my-4" />
                    ) : alertsData.length === 0 ? (
                        <Text className="text-gray-500 py-4">No alerts currently.</Text>
                    ) : (
                        <View className="flex-row flex-wrap justify-between">
                            {alertsData.map((alert: any, index: number) => {
                                const alertStatus = alert.alert || alert.status || 'N/A';
                                return (
                                    <View key={alert.id || index} className={`w-[49%] p-4 rounded-lg mb-3 border ${getAlertStyle(alertStatus).bg} ${getAlertStyle(alertStatus).border}`}>
                                        <View className="flex-row justify-between items-start mb-2">
                                            <View>
                                                <Text className="font-semibold text-gray-800">{alert.name || alert.material_name} <Text className="text-gray-400 text-xs font-normal">({alert.code || alert.material_code || '-'})</Text></Text>
                                            </View>
                                            <View className={`px-2 py-0.5 rounded border ${getAlertStyle(alertStatus).border} ${getAlertStyle(alertStatus).bg}`}>
                                                <Text className={`text-[10px] font-bold ${getAlertStyle(alertStatus).text}`}>{alertStatus}</Text>
                                            </View>
                                        </View>
                                        <Text className="text-sm text-gray-600">Stock: {alert.stock ?? alert.quantity ?? 0}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );

    const renderMaterials = () => (
        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase">Data Register</Text>
                <TouchableOpacity className="flex-row items-center px-4 py-2 bg-blue-600 rounded-lg shadow-sm shadow-blue-200">
                    <Plus size={16} color="#ffffff" />
                    <Text className="ml-2 font-bold text-xs text-white">Add Material</Text>
                </TouchableOpacity>
            </View>
            <View className="p-4 border-b border-gray-100 flex-row">
                <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-64 mr-2">
                    <Search size={16} color="#9CA3AF" />
                    <TextInput placeholder="Search materials..." className="ml-2 flex-1 text-sm text-gray-700" />
                </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Name</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Category</Text>
                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Unit</Text>
                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Stock</Text>
                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Min Level</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Rate</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Alert</Text>
                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Supplier</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</Text>
                    </View>
                    {isLoading ? (
                        <View className="p-8 items-center"><ActivityIndicator color="#3B82F6" /></View>
                    ) : materialsData.length === 0 ? (
                        <View className="p-8 items-center"><Text className="text-gray-500">No data available</Text></View>
                    ) : (
                        materialsData.map((row: any, index: number) => {
                            const alertStatus = row.alert || row.status || 'IN STOCK';
                            return (
                                <View key={row.id || index} className={`flex-row items-center px-6 py-4 ${index !== materialsData.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                    <Text className="w-48 text-sm font-semibold text-gray-900">{row.name || row.material_name}</Text>
                                    <Text className="w-32 text-sm text-gray-500 text-center">{row.category || '-'}</Text>
                                    <Text className="w-24 text-sm text-gray-500 text-center">{row.unit || '-'}</Text>
                                    <Text className="w-24 text-sm font-bold text-gray-800 text-center">{row.stock ?? row.quantity ?? 0}</Text>
                                    <Text className="w-24 text-sm font-medium text-gray-500 text-center">{row.min ?? row.min_level ?? 0}</Text>
                                    <Text className="w-32 text-sm font-semibold text-gray-800 text-center">{row.rate ?? row.unit_price ?? '-'}</Text>
                                    <View className="w-32 items-center">
                                        <View className={`px-2 py-0.5 rounded border ${getAlertStyle(alertStatus).border} ${getAlertStyle(alertStatus).bg}`}>
                                            <Text className={`text-[10px] font-bold ${getAlertStyle(alertStatus).text}`}>{alertStatus}</Text>
                                        </View>
                                    </View>
                                    <Text className="w-48 text-sm text-gray-600">{row.supplier || row.supplier_name || '-'}</Text>
                                    <View className="w-32 flex-row justify-end space-x-3">
                                        <Eye size={16} color="#9CA3AF" />
                                        <Edit2 size={16} color="#9CA3AF" />
                                        <Trash2 size={16} color="#9CA3AF" />
                                    </View>
                                </View>
                            )
                        })
                    )}
                </View>
            </ScrollView>
        </View>
    );

    const renderSuppliers = () => (
        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase">Data Register</Text>
                <TouchableOpacity className="flex-row items-center px-4 py-2 bg-green-600 rounded-lg shadow-sm shadow-green-200">
                    <Plus size={16} color="#ffffff" />
                    <Text className="ml-2 font-bold text-xs text-white">Add Supplier</Text>
                </TouchableOpacity>
            </View>
            <View className="p-4 border-b border-gray-100 flex-row">
                <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-64 mr-2">
                    <Search size={16} color="#9CA3AF" />
                    <TextInput placeholder="Search suppliers..." className="ml-2 flex-1 text-sm text-gray-700" />
                </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Supplier Name</Text>
                        <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Contact Person</Text>
                        <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phone/Email</Text>
                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">GST Number</Text>
                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Address</Text>
                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</Text>
                    </View>
                    {isLoading ? (
                        <View className="p-8 items-center"><ActivityIndicator color="#3B82F6" /></View>
                    ) : suppliersData.length === 0 ? (
                        <View className="p-8 items-center"><Text className="text-gray-500">No data available</Text></View>
                    ) : (
                        suppliersData.map((row: any, index: number) => (
                            <View key={row.id || index} className={`flex-row items-center px-6 py-4 ${index !== suppliersData.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                <Text className="w-48 text-sm font-semibold text-gray-900">{row.name || row.supplier_name}</Text>
                                <Text className="w-40 text-sm text-gray-600">{row.contact || row.contact_person}</Text>
                                <Text className="w-40 text-sm text-gray-600">{row.phone || row.email}</Text>
                                <Text className="w-48 text-sm text-gray-600">{row.gst || row.gst_number || '-'}</Text>
                                <Text className="w-48 text-sm text-gray-600">{row.address || '-'}</Text>
                                <View className="w-24 flex-row justify-end space-x-3">
                                    <Eye size={16} color="#9CA3AF" />
                                    <Edit2 size={16} color="#9CA3AF" />
                                    <Trash2 size={16} color="#9CA3AF" />
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );

    const renderPurchaseOrders = () => (
        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase">Data Register</Text>
                <TouchableOpacity className="flex-row items-center px-4 py-2 bg-purple-600 rounded-lg shadow-sm shadow-purple-200">
                    <Plus size={16} color="#ffffff" />
                    <Text className="ml-2 font-bold text-xs text-white">Create PO</Text>
                </TouchableOpacity>
            </View>
            <View className="p-4 border-b border-gray-100 flex-row">
                <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-64 mr-2">
                    <Search size={16} color="#9CA3AF" />
                    <TextInput placeholder="Search purchase orders..." className="ml-2 flex-1 text-sm text-gray-700" />
                </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                        <Text className="w-64 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Material</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Qty</Text>
                        <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Rate</Text>
                        <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Total</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Status</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</Text>
                    </View>
                    {isLoading ? (
                        <View className="p-8 items-center"><ActivityIndicator color="#3B82F6" /></View>
                    ) : poData.length === 0 ? (
                        <View className="p-8 items-center"><Text className="text-gray-500">No data available</Text></View>
                    ) : (
                        poData.map((row: any, index: number) => {
                            const status = row.status || 'CREATED';
                            return (
                                <View key={row.id || index} className={`flex-row items-center px-6 py-4 ${index !== poData.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                    <Text className="w-64 text-sm font-semibold text-gray-900">{row.material || row.material_name}</Text>
                                    <Text className="w-32 text-sm font-bold text-gray-800 text-center">{row.qty ?? row.quantity ?? 0}</Text>
                                    <Text className="w-40 text-sm font-medium text-gray-600 text-center">{row.rate ?? row.unit_price ?? '-'}</Text>
                                    <Text className="w-40 text-sm font-bold text-gray-900 text-center">{row.total ?? row.total_value ?? '-'}</Text>
                                    <View className="w-32 items-center">
                                        <View className={`px-2 py-0.5 rounded border ${getAlertStyle(status).border} ${getAlertStyle(status).bg}`}>
                                            <Text className={`text-[10px] font-bold ${getAlertStyle(status).text}`}>{status}</Text>
                                        </View>
                                    </View>
                                    <View className="w-32 flex-row justify-end space-x-3">
                                        <Eye size={16} color="#9CA3AF" />
                                        <Edit2 size={16} color="#9CA3AF" />
                                        <Trash2 size={16} color="#9CA3AF" />
                                    </View>
                                </View>
                            )
                        })
                    )}
                </View>
            </ScrollView>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <TopHeader
                title="Material Receipt"
                subtitle={`Engineer > ${activeProjectName} > Receipt & Masters`}
            />

            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>

                {/* Header Section */}
                <View className="mb-6 flex-col md:flex-row md:items-center justify-between">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-xl font-bold text-gray-900">Material Management</Text>
                        <Text className="text-sm text-gray-500 mt-1">Manage materials, suppliers, purchase orders and inventory</Text>
                    </View>

                    <View className="flex-row items-center space-x-3">
                        <View className="flex-row items-center px-3 py-1.5 border border-gray-200 rounded-lg bg-white">
                            <Text className="text-xs text-gray-500 mr-2">Project:</Text>
                            <Text className="text-xs font-bold text-gray-700">{activeProjectName}</Text>
                        </View>
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
                {activeTab === 'Dashboard' && renderDashboard()}
                {activeTab === 'Materials' && renderMaterials()}
                {activeTab === 'Suppliers' && renderSuppliers()}
                {activeTab === 'Purchase Orders' && renderPurchaseOrders()}

                {/* Padding at bottom for safe area */}
                <View className="h-12" />
            </ScrollView>
        </View>
    );
}
