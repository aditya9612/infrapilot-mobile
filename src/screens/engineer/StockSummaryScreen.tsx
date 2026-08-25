import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { Search, RefreshCw, ChevronDown, ChevronLeft, ChevronRight, FileText, FileSpreadsheet, PlusCircle } from 'lucide-react-native';

const STOCK_OVERVIEW_DATA = [
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

const GLOBAL_INVENTORY_DATA = [
    { id: '1', name: 'Ultratech Cement Opc 53', stock: 609, stockColor: 'text-green-500', unit: 'KG', rate: '₹415.25', total: '₹2,52,887.04' },
    { id: '2', name: 'Ultratech Cement Opc 53', stock: 32, stockColor: 'text-green-500', unit: 'KG', rate: '₹420', total: '₹21,840' },
    { id: '3', name: 'Cement', stock: 0, stockColor: 'text-red-500', unit: 'KG', rate: '₹1,000', total: '₹0' },
    { id: '4', name: 'Material Master', stock: 6, stockColor: 'text-red-500', unit: 'KG', rate: '₹100', total: '₹600' },
    { id: '5', name: 'Cement', stock: 0, stockColor: 'text-red-500', unit: 'KG', rate: '₹100', total: '₹0' },
    { id: '6', name: 'Material Master', stock: 3, stockColor: 'text-red-500', unit: 'KG', rate: '₹100', total: '₹300' },
    { id: '7', name: 'Ultratech Cement Opc 53', stock: 8, stockColor: 'text-red-500', unit: 'KG', rate: '₹100', total: '₹800' },
    { id: '8', name: 'Ultratech Cement Opc 53', stock: 1, stockColor: 'text-red-500', unit: 'KG', rate: '₹100', total: '₹100' },
    { id: '9', name: 'Material Master', stock: 1, stockColor: 'text-red-500', unit: 'KG', rate: '₹100', total: '₹100' },
    { id: '10', name: 'Material Master', stock: 1, stockColor: 'text-red-500', unit: 'KG', rate: '₹100', total: '₹100' },
];

const REPORTS_DATA = [
    { id: '1', name: 'GI Pipe', purchased: 120, used: 0, remaining: 120, cost: '₹60,000', pending: '₹57,000', alert: 'IN STOCK' },
    { id: '2', name: 'electric buttons', purchased: 210, used: 198, remaining: 12, cost: '₹17,200', pending: '₹3,00,800', alert: 'IN STOCK' },
    { id: '3', name: 'GI Pipe', purchased: 100, used: 0, remaining: 100, cost: '₹10,000', pending: '₹9,000', alert: 'LOW STOCK' },
    { id: '4', name: 'Binding Wire', purchased: 10, used: 0, remaining: 10, cost: '₹500', pending: '₹0', alert: 'LOW STOCK' },
    { id: '5', name: 'asdfadsf', purchased: 170, used: 70, remaining: 100, cost: '₹50,000', pending: '₹83,000', alert: 'IN STOCK' },
    { id: '6', name: 'GI Pipe', purchased: 100, used: 0, remaining: 100, cost: '₹10,000', pending: '₹49,800', alert: 'IN STOCK' },
    { id: '7', name: 'cement', purchased: 100, used: 0, remaining: 100, cost: '₹10,000', pending: '₹9,980', alert: 'IN STOCK' },
    { id: '8', name: 'material master', purchased: 262, used: 40, remaining: 222, cost: '₹88,800', pending: '₹1,04,700', alert: 'IN STOCK' },
    { id: '9', name: 'Rapid Hardening Cement', purchased: 36, used: 2, remaining: 34, cost: '₹17,000', pending: '₹16,000', alert: 'IN STOCK' },
];

const ADJUSTMENTS_DATA = [
    { id: '1', date: '24 Aug 2026\n5:12:34 AM', name: 'Electric Buttons', type: 'ADJUSTMENT / SYSTEM', qtyChange: '-195', qtyColor: 'text-red-500', rate: '₹1,500', reason: 'Manual Audit Adjustment' },
    { id: '2', date: '22 Aug 2026\n5:11:25 AM', name: 'Material Master', type: 'ADJUSTMENT / SYSTEM', qtyChange: '-9', qtyColor: 'text-red-500', rate: '₹100', reason: 'Manual Audit Adjustment' },
    { id: '3', date: '21 Aug 2026\n8:22:33 AM', name: 'Asdfadsf', type: 'ADJUSTMENT / SYSTEM', qtyChange: '+70', qtyColor: 'text-green-500', rate: '₹500', reason: 'Manual Audit Adjustment' },
    { id: '4', date: '19 Aug 2026\n3:16:34 PM', name: 'Material Master', type: 'ADJUSTMENT / SYSTEM', qtyChange: '+212', qtyColor: 'text-green-500', rate: '₹400', reason: 'Manual Audit Adjustment' },
    { id: '5', date: '19 Aug 2026\n6:19:49 AM', name: 'Rapid Hardening Cement', type: 'ADJUSTMENT / SYSTEM', qtyChange: '+8', qtyColor: 'text-green-500', rate: '₹500', reason: 'Manual Audit Adjustment' },
    { id: '6', date: '19 Aug 2026\n6:19:10 AM', name: 'Rapid Hardening Cement', type: 'ADJUSTMENT / SYSTEM', qtyChange: '-1', qtyColor: 'text-red-500', rate: '₹500', reason: 'Manual Audit Adjustment' },
    { id: '7', date: '19 Aug 2026\n6:09:45 AM', name: 'Material Master', type: 'ADJUSTMENT / SYSTEM', qtyChange: '-40', qtyColor: 'text-red-500', rate: '₹400', reason: 'Manual Audit Adjustment' },
    { id: '8', date: '18 Aug 2026\n12:38:02 PM', name: 'Ultratech Cement Opc 53', type: 'ADJUSTMENT / SYSTEM', qtyChange: '-70', qtyColor: 'text-red-500', rate: '₹1,000', reason: 'Manual Audit Adjustment' },
    { id: '9', date: '17 Aug 2026\n4:21:38 AM', name: 'Ultratech Cement Opc 53', type: 'ADJUSTMENT / SYSTEM', qtyChange: '+20', qtyColor: 'text-green-500', rate: '₹100', reason: 'Manual Audit Adjustment' },
    { id: '10', date: '12 Aug 2026\n6:26:42 PM', name: 'Cement', type: 'ADJUSTMENT / SYSTEM', qtyChange: '-60', qtyColor: 'text-red-500', rate: '₹1,000', reason: 'Manual Audit Adjustment' },
];

export default function StockSummaryScreen() {
    const [activeTab, setActiveTab] = useState('Stock Overview');
    const tabs = ['Stock Overview', 'Global Inventory', 'Reports', 'Inventory Adjustment'];

    const getAlertStyle = (alert: string) => {
        if (alert === 'IN STOCK') return 'text-green-600 bg-green-50 border-green-200';
        if (alert === 'LOW STOCK') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (alert === 'OUT OF STOCK') return 'text-red-600 bg-red-50 border-red-200';
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

    const renderStockOverview = () => (
        <View>
            <View className="mb-4">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Stock Valuation Stats</Text>
                <View className="flex-row justify-between space-x-4">
                    <View className="flex-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Inventory Scope</Text>
                        <Text className="text-2xl font-bold text-blue-500 mb-1">25</Text>
                        <Text className="text-xs text-gray-400">Resource Types</Text>
                    </View>
                    <View className="flex-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Order Valuation</Text>
                        <Text className="text-2xl font-bold text-green-500 mb-1">₹7,35,000</Text>
                        <Text className="text-xs text-gray-400">Current Stock Value</Text>
                    </View>
                    <View className="flex-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Critical Stock</Text>
                        <Text className="text-2xl font-bold text-red-500 mb-1">8</Text>
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
                    <TouchableOpacity className="p-2 border border-gray-200 rounded-lg bg-gray-50">
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
                        {STOCK_OVERVIEW_DATA.map((row, index) => (
                            <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <Text className="w-80 text-sm font-semibold text-gray-800">{row.name}</Text>
                                <Text className="w-48 text-sm font-bold text-green-600 text-center">{row.stock}</Text>
                                <Text className="w-48 text-sm font-medium text-gray-600 text-center">{row.rate}</Text>
                                <Text className="w-48 text-sm font-bold text-gray-900 text-right">{row.total}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
                {renderPagination(25)}
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
                <TouchableOpacity className="p-2 border border-gray-200 rounded-lg bg-gray-50">
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
                    {GLOBAL_INVENTORY_DATA.map((row, index) => (
                        <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                            <Text className="w-80 text-sm font-semibold text-gray-800">{row.name}</Text>
                            <Text className={`w-32 text-sm font-bold ${row.stockColor} text-center`}>{row.stock}</Text>
                            <Text className="w-32 text-sm text-gray-500 font-medium text-center">{row.unit}</Text>
                            <Text className="w-48 text-sm font-medium text-gray-600 text-center">{row.rate}</Text>
                            <Text className="w-48 text-sm font-bold text-gray-900 text-right">{row.total}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {renderPagination(21)}
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
            
            <View className="flex-row flex-wrap justify-between mb-4">
                <View className="w-[19%] bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Materials</Text>
                    <Text className="text-xl font-bold text-blue-500 mb-1">25</Text>
                    <Text className="text-[10px] text-gray-400">Unique Items</Text>
                </View>
                <View className="w-[19%] bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Purchased</Text>
                    <Text className="text-xl font-bold text-green-500 mb-1">2707</Text>
                    <Text className="text-[10px] text-gray-400">Units Procured</Text>
                </View>
                <View className="w-[19%] bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Used</Text>
                    <Text className="text-xl font-bold text-orange-500 mb-1">798</Text>
                    <Text className="text-[10px] text-gray-400">Units Consumed</Text>
                </View>
                <View className="w-[19%] bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Remaining</Text>
                    <Text className="text-xl font-bold text-gray-800 mb-1">1909</Text>
                    <Text className="text-[10px] text-gray-400">In Stock</Text>
                </View>
                <View className="w-[19%] bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Stock Value</Text>
                    <Text className="text-xl font-bold text-blue-700 mb-1">₹7,35,000</Text>
                    <Text className="text-[10px] text-gray-400">Current Inventory</Text>
                </View>
                
                <View className="w-[19%] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Amount Paid</Text>
                    <Text className="text-xl font-bold text-green-600 mb-1">₹14,660</Text>
                    <Text className="text-[10px] text-gray-400">Payment Given</Text>
                </View>
                <View className="w-[19%] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Pay</Text>
                    <Text className="text-xl font-bold text-red-500 mb-1">₹12,76,740</Text>
                    <Text className="text-[10px] text-gray-400">Outstanding</Text>
                </View>
                <View className="w-[19%] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">In Stock</Text>
                    <Text className="text-xl font-bold text-green-500 mb-1">17</Text>
                    <Text className="text-[10px] text-gray-400">Sufficient</Text>
                </View>
                <View className="w-[19%] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Low Stock</Text>
                    <Text className="text-xl font-bold text-yellow-500 mb-1">6</Text>
                    <Text className="text-[10px] text-gray-400">Need Reorder</Text>
                </View>
                <View className="w-[19%] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Out Of Stock</Text>
                    <Text className="text-xl font-bold text-red-500 mb-1">2</Text>
                    <Text className="text-[10px] text-gray-400">Stockout Alert</Text>
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
                    <TouchableOpacity className="p-2 border border-gray-200 rounded-lg bg-gray-50">
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
                        {REPORTS_DATA.map((row, index) => (
                            <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <Text className="w-48 text-sm font-semibold text-gray-800">{row.name}</Text>
                                <Text className="w-32 text-sm font-medium text-blue-500 text-center">{row.purchased}</Text>
                                <Text className="w-32 text-sm font-medium text-orange-500 text-center">{row.used}</Text>
                                <Text className="w-32 text-sm font-bold text-green-500 text-center">{row.remaining}</Text>
                                <Text className="w-40 text-sm font-medium text-gray-700 text-center">{row.cost}</Text>
                                <Text className="w-40 text-sm font-bold text-red-500 text-center">{row.pending}</Text>
                                <View className="w-32 flex-row justify-end">
                                    <View className={`px-2 py-0.5 rounded border ${getAlertStyle(row.alert)}`}>
                                        <Text className={`text-[10px] font-bold ${getAlertStyle(row.alert).split(' ')[0]}`}>{row.alert}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
                {renderPagination(25)}
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
                <TouchableOpacity className="p-2 border border-gray-200 rounded-lg bg-gray-50">
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
                    {ADJUSTMENTS_DATA.map((row, index) => (
                        <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                            <Text className="w-40 text-xs text-gray-600 leading-tight">{row.date}</Text>
                            <Text className="w-56 text-sm font-semibold text-gray-800">{row.name}</Text>
                            <View className="w-48 items-center">
                                <Text className="text-[10px] font-bold text-orange-500 uppercase">{row.type}</Text>
                            </View>
                            <Text className={`w-32 text-sm font-bold ${row.qtyColor} text-center`}>{row.qtyChange}</Text>
                            <Text className="w-32 text-sm font-medium text-gray-600 text-center">{row.rate}</Text>
                            <Text className="w-48 text-sm text-gray-500">{row.reason}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {renderPagination(45)}
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <TopHeader 
                title="Material Stock" 
                subtitle="Engineer > Material Management > Stock & Inventory" 
            />
            
            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                
                {/* Header Section */}
                <View className="mb-6 flex-col md:flex-row md:items-center justify-between">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-xl font-bold text-gray-900">Stock & Inventory Management</Text>
                        <Text className="text-sm text-gray-500 mt-1">Monitor inventory levels, view strategic reports, and perform physical audits.</Text>
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
                {activeTab === 'Stock Overview' && renderStockOverview()}
                {activeTab === 'Global Inventory' && renderGlobalInventory()}
                {activeTab === 'Reports' && renderReports()}
                {activeTab === 'Inventory Adjustment' && renderInventoryAdjustment()}

                {/* Padding at bottom for safe area */}
                <View className="h-12" />
            </ScrollView>
        </View>
    );
}
