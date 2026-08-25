import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import TopHeader from '../../../components/TopHeader';
import { Search, RefreshCw, ChevronDown, ChevronLeft, ChevronRight, Link2 } from 'lucide-react-native';

const WORK_ORDERS = [
    { id: '1', no: 'WO017', project: 'Rohan Harita', desc: 'sdgdh', tQty: '1', cQty: '0', rate: '100', amount: '100', status: 'Assigned' },
    { id: '2', no: 'WO016', project: 'Rohan Harita', desc: 'khduehnudj', tQty: '100', cQty: '50', rate: '300', amount: '30000', status: 'In Progress' },
    { id: '3', no: 'WO015', project: 'Rohan Harita', desc: 'site measurement', tQty: '1000', cQty: '100', rate: '300', amount: '300000', status: 'In Progress' },
    { id: '4', no: 'WO014', project: 'Rohan Harita', desc: 'no worek order discription', tQty: '100', cQty: '135', rate: '200', amount: '20000', status: 'Assigned' },
    { id: '5', no: 'WO013', project: 'HARRICO', desc: 'HARRICO (From Quotation QT/2...', tQty: '1', cQty: '0', rate: '7625070', amount: '7625070', status: 'Assigned' },
    { id: '6', no: 'WO012', project: 'sundaram', desc: 'sundaram (From Quotation QT/2...', tQty: '1', cQty: '0', rate: '365648', amount: '365648', status: 'Assigned' },
    { id: '7', no: 'WO011', project: 'Rohan Harita', desc: 'work order create', tQty: '200', cQty: '200', rate: '500', amount: '100000', status: 'Completed' },
    { id: '8', no: 'WO010', project: 'Rohan Harita', desc: '--', tQty: '100', cQty: '0', rate: '5000', amount: '500000', status: 'Assigned' },
    { id: '9', no: 'WO009', project: 'Rohan Harita', desc: 'work not describe', tQty: '100', cQty: '252', rate: '5000', amount: '500000', status: 'Completed' },
    { id: '10', no: 'WO007', project: 'Sara City', desc: 'lufedkijkq', tQty: '100', cQty: '0', rate: '100', amount: '10000', status: 'Assigned' },
];

export default function WorkOrdersScreen() {
    return (
        <View className="flex-1 bg-gray-50">
            <TopHeader 
                title="Work Orders" 
                subtitle="InfraPilot > Engineer > Work Progress > Work Orders" 
            />
            
            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                
                {/* Header Section */}
                <View className="mb-6 flex-col md:flex-row md:items-center justify-between">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-xl font-bold text-gray-900">Work Orders</Text>
                        <Text className="text-sm text-gray-500 mt-1">View and track all work orders for the selected project.</Text>
                    </View>
                    
                    <View className="flex-row items-center space-x-3">
                        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
                            <RefreshCw size={18} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Table Section */}
                <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
                    <View className="p-4 border-b border-gray-100 flex-row items-center justify-between space-x-3">
                        <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex-1 max-w-sm">
                            <Search size={16} color="#9CA3AF" />
                            <TextInput placeholder="Search by WO# or description..." className="ml-2 flex-1 text-sm text-gray-700" />
                        </View>
                        
                        <View className="flex-row items-center">
                            <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-32">
                                <Text className="text-sm text-gray-700">All Status</Text>
                                <ChevronDown size={14} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <View>
                            <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">WORK ORDER NO.</Text>
                                <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">PROJECT</Text>
                                <Text className="w-64 text-[10px] font-bold text-gray-500 uppercase tracking-wider">WORK DESCRIPTION</Text>
                                <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">TOTAL QUANTITY</Text>
                                <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">COMPLETED QTY</Text>
                                <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider">RATE</Text>
                                <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">TOTAL AMOUNT</Text>
                                <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">STATUS</Text>
                                <Text className="w-16 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right"></Text>
                            </View>
                            {WORK_ORDERS.map((row, index) => (
                                <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                    <View className="w-32">
                                        <Text className="text-sm font-bold text-gray-800">{row.no}</Text>
                                    </View>
                                    <View className="w-40">
                                        <Text className="text-sm text-gray-600">{row.project}</Text>
                                    </View>
                                    <View className="w-64">
                                        <Text className="text-sm text-gray-600">{row.desc}</Text>
                                    </View>
                                    <View className="w-32">
                                        <Text className="text-sm text-gray-600">{row.tQty}</Text>
                                    </View>
                                    <View className="w-32">
                                        <Text className="text-sm text-gray-600">{row.cQty}</Text>
                                    </View>
                                    <View className="w-24">
                                        <Text className="text-sm text-gray-600">{row.rate}</Text>
                                    </View>
                                    <View className="w-32">
                                        <Text className="text-sm text-gray-600">{row.amount}</Text>
                                    </View>
                                    <View className="w-32">
                                        <View className={`px-3 py-1 rounded-full border self-start ${
                                            row.status === 'Completed' ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200'
                                        }`}>
                                            <Text className={`text-xs font-medium ${
                                                row.status === 'Completed' ? 'text-green-700' : 'text-gray-700'
                                            }`}>{row.status}</Text>
                                        </View>
                                    </View>
                                    <View className="w-16 flex-row justify-end">
                                        <TouchableOpacity>
                                            <Link2 size={16} color="#9CA3AF" />
                                        </TouchableOpacity>
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
                        <Text className="text-xs text-gray-500">Showing 1 - 10 of 16 records</Text>
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
