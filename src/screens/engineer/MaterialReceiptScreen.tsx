import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { Search, Filter, Plus, Eye, Edit2, Trash2, ArrowRight } from 'lucide-react-native';

const ALERTS_DATA = [
    { id: '1', name: 'Cement', code: 'MAT002', stock: 0, alert: 'OUT OF STOCK' },
    { id: '2', name: 'Material Master', code: 'MAT022', stock: 0, alert: 'OUT OF STOCK' },
    { id: '3', name: 'Ultratech Cement Opc 53', code: 'MAT027', stock: 3, alert: 'LOW STOCK' },
    { id: '4', name: 'Pvc Pipe', code: 'MAT003', stock: 7, alert: 'LOW STOCK' },
    { id: '5', name: 'Electric Buttons', code: 'MAT045', stock: 12, alert: 'NEAR LOW' },
    { id: '6', name: 'Cement', code: 'MAT016', stock: 90, alert: 'NEAR LOW' },
    { id: '7', name: 'Tmt Bar 16 Mm', code: 'MAT023', stock: 100, alert: 'NEAR LOW' },
    { id: '8', name: 'Gi Pipe', code: 'MAT038', stock: 100, alert: 'NEAR LOW' },
];

const MATERIALS_DATA = [
    { id: '1', name: 'Gi Pipe', category: 'Civil', unit: 'meter', stock: 120, min: 8, rate: '₹500', alert: 'IN STOCK', supplier: 'Om Traders' },
    { id: '2', name: 'Electric Buttons', category: 'Construction', unit: 'Bag', stock: 12, min: 10, rate: '₹1,433.33', alert: 'IN STOCK', supplier: 'Express' },
    { id: '3', name: 'Gi Pipe', category: 'Civil', unit: 'meter', stock: 100, min: 200, rate: '₹100', alert: 'LOW STOCK', supplier: 'Krishna Logistics' },
    { id: '4', name: 'Binding Wire', category: 'Construction', unit: 'Kg', stock: 10, min: 10, rate: '₹50', alert: 'LOW STOCK', supplier: 'Krishna Logistics' },
    { id: '5', name: 'Aadfsdf', category: 'aadfsdf', unit: 'Can', stock: 100, min: 10, rate: '₹500', alert: 'IN STOCK', supplier: 'Om Traders' },
    { id: '6', name: 'Gi Pipe', category: 'Civil', unit: 'meter', stock: 100, min: 10, rate: '₹500', alert: 'IN STOCK', supplier: 'Hariom Traders' },
    { id: '7', name: 'Cement', category: 'Construction', unit: 'Kg', stock: 100, min: 1, rate: '₹100', alert: 'IN STOCK', supplier: 'Om Traders' },
    { id: '8', name: 'Material Master', category: 'Construction', unit: 'Kg', stock: 222, min: 100, rate: '₹400', alert: 'IN STOCK', supplier: 'Shan Logistics' },
];

const SUPPLIERS_DATA = [
    { id: '1', name: 'Venom', contact: 'Tejas', phone: '7458962356', gst: '27HDDU8541L6Z0', address: 'PUNE' },
    { id: '2', name: 'Krishna Logistics', contact: 'Krishna Bharmal', phone: '8541235698', gst: '27HFYRU7410G6Z8', address: 'RTGVRT3GTHRTH' },
    { id: '3', name: 'Om Traders', contact: 'Sumit', phone: '7415862589', gst: '270DYEK7415U7Z8', address: 'PUNE' },
    { id: '4', name: 'Shan Logistics', contact: 'Sunny', phone: '7452136895', gst: '27QSTEY9512H7Z9', address: 'pune maharastra' },
    { id: '5', name: 'Hariom Traders', contact: 'Sumit', phone: '9854120023', gst: '27HDREY7430G7Z0', address: 'Mumbai' },
    { id: '6', name: 'Express', contact: 'Komal', phone: '8542698563', gst: '27HSGEY7458I7Z9', address: 'pune' },
];

const PO_DATA = [
    { id: '1', material: 'Cement', qty: 100, rate: '₹100', total: '₹10,000', status: 'CREATED' },
    { id: '2', material: 'Gi Pipe', qty: 10, rate: '₹500', total: '₹5,000', status: 'CREATED' },
    { id: '3', material: 'Pvc Pipe', qty: 120, rate: '₹200', total: '₹24,000', status: 'CREATED' },
    { id: '4', material: 'Aadfsdf', qty: 100, rate: '₹500', total: '₹50,000', status: 'CREATED' },
    { id: '5', material: 'Gi Pipe', qty: 1000, rate: '₹500', total: '₹5,00,000', status: 'CREATED' },
];

export default function MaterialReceiptScreen() {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const tabs = ['Dashboard', 'Materials', 'Suppliers', 'Purchase Orders'];

    const getAlertStyle = (alertText: string) => {
        switch (alertText) {
            case 'OUT OF STOCK':
                return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' };
            case 'LOW STOCK':
                return { bg: 'bg-red-50/50', text: 'text-red-500', border: 'border-red-100' };
            case 'NEAR LOW':
                return { bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-200' };
            case 'IN STOCK':
                return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' };
            case 'CREATED':
                return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
            default:
                return { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' };
        }
    };

    const renderDashboard = () => (
        <View>
            <View className="mb-6">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Quick Stats</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">Total Materials</Text>
                        <Text className="text-2xl font-bold text-gray-800">25</Text>
                        <Text className="text-xs text-gray-400 mt-1">Registered items</Text>
                    </View>
                    <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">Inventory Value</Text>
                        <Text className="text-2xl font-bold text-blue-600">₹7,35,000</Text>
                        <Text className="text-xs text-gray-400 mt-1">Total stock valuation</Text>
                    </View>
                    <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">Pending Payments</Text>
                        <Text className="text-2xl font-bold text-red-500">₹12,76,740</Text>
                        <Text className="text-xs text-gray-400 mt-1">Amount due</Text>
                    </View>
                    <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">Low Stock Alerts</Text>
                        <Text className="text-2xl font-bold text-orange-500">23</Text>
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
                    <View className="flex-row flex-wrap justify-between">
                        {ALERTS_DATA.map((alert, index) => (
                            <View key={alert.id} className={`w-[49%] p-4 rounded-lg mb-3 border ${getAlertStyle(alert.alert).bg} ${getAlertStyle(alert.alert).border}`}>
                                <View className="flex-row justify-between items-start mb-2">
                                    <View>
                                        <Text className="font-semibold text-gray-800">{alert.name} <Text className="text-gray-400 text-xs font-normal">({alert.code})</Text></Text>
                                    </View>
                                    <View className={`px-2 py-0.5 rounded border ${getAlertStyle(alert.alert).border} ${getAlertStyle(alert.alert).bg}`}>
                                        <Text className={`text-[10px] font-bold ${getAlertStyle(alert.alert).text}`}>{alert.alert}</Text>
                                    </View>
                                </View>
                                <Text className="text-sm text-gray-600">Stock: {alert.stock}</Text>
                            </View>
                        ))}
                    </View>
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
                    {MATERIALS_DATA.map((row, index) => (
                        <View key={row.id} className={`flex-row items-center px-6 py-4 ${index !== MATERIALS_DATA.length - 1 ? 'border-b border-gray-50' : ''}`}>
                            <Text className="w-48 text-sm font-semibold text-gray-900">{row.name}</Text>
                            <Text className="w-32 text-sm text-gray-500 text-center">{row.category}</Text>
                            <Text className="w-24 text-sm text-gray-500 text-center">{row.unit}</Text>
                            <Text className="w-24 text-sm font-bold text-gray-800 text-center">{row.stock}</Text>
                            <Text className="w-24 text-sm font-medium text-gray-500 text-center">{row.min}</Text>
                            <Text className="w-32 text-sm font-semibold text-gray-800 text-center">{row.rate}</Text>
                            <View className="w-32 items-center">
                                <View className={`px-2 py-0.5 rounded border ${getAlertStyle(row.alert).border} ${getAlertStyle(row.alert).bg}`}>
                                    <Text className={`text-[10px] font-bold ${getAlertStyle(row.alert).text}`}>{row.alert}</Text>
                                </View>
                            </View>
                            <Text className="w-48 text-sm text-gray-600">{row.supplier}</Text>
                            <View className="w-32 flex-row justify-end space-x-3">
                                <Eye size={16} color="#9CA3AF" />
                                <Edit2 size={16} color="#9CA3AF" />
                                <Trash2 size={16} color="#9CA3AF" />
                            </View>
                        </View>
                    ))}
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
                    {SUPPLIERS_DATA.map((row, index) => (
                        <View key={row.id} className={`flex-row items-center px-6 py-4 ${index !== SUPPLIERS_DATA.length - 1 ? 'border-b border-gray-50' : ''}`}>
                            <Text className="w-48 text-sm font-semibold text-gray-900">{row.name}</Text>
                            <Text className="w-40 text-sm text-gray-600">{row.contact}</Text>
                            <Text className="w-40 text-sm text-gray-600">{row.phone}</Text>
                            <Text className="w-48 text-sm text-gray-600">{row.gst}</Text>
                            <Text className="w-48 text-sm text-gray-600">{row.address}</Text>
                            <View className="w-24 flex-row justify-end space-x-3">
                                <Eye size={16} color="#9CA3AF" />
                                <Edit2 size={16} color="#9CA3AF" />
                                <Trash2 size={16} color="#9CA3AF" />
                            </View>
                        </View>
                    ))}
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
                    {PO_DATA.map((row, index) => (
                        <View key={row.id} className={`flex-row items-center px-6 py-4 ${index !== PO_DATA.length - 1 ? 'border-b border-gray-50' : ''}`}>
                            <Text className="w-64 text-sm font-semibold text-gray-900">{row.material}</Text>
                            <Text className="w-32 text-sm font-bold text-gray-800 text-center">{row.qty}</Text>
                            <Text className="w-40 text-sm font-medium text-gray-600 text-center">{row.rate}</Text>
                            <Text className="w-40 text-sm font-bold text-gray-900 text-center">{row.total}</Text>
                            <View className="w-32 items-center">
                                <View className={`px-2 py-0.5 rounded border ${getAlertStyle(row.status).border} ${getAlertStyle(row.status).bg}`}>
                                    <Text className={`text-[10px] font-bold ${getAlertStyle(row.status).text}`}>{row.status}</Text>
                                </View>
                            </View>
                            <View className="w-32 flex-row justify-end space-x-3">
                                <Eye size={16} color="#9CA3AF" />
                                <Edit2 size={16} color="#9CA3AF" />
                                <Trash2 size={16} color="#9CA3AF" />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <TopHeader 
                title="Material Receipt" 
                subtitle="Engineer > Material Management > Receipt & Masters" 
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
                            <Text className="text-xs font-bold text-gray-700">Sara City</Text>
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
