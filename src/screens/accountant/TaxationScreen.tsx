import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, TextInput } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, FileText, ChevronDown, Check, ArrowUpRight, ArrowDownRight, DollarSign, Calendar, Paperclip, Eye, Edit3, Trash2, Download, Upload, BarChart3 } from 'lucide-react-native';

type Tab = 'Dashboard' | 'GST' | 'TDS' | 'Returns' | 'Reconciliation';

export function TaxationScreen() {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const [activeTab, setActiveTab] = useState<Tab>('Dashboard');

    return (
        <View className="flex-1 bg-gray-50">
            {/* Top Blue Header */}
            <View className="px-4 pt-14 pb-4 bg-blue-600">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => (navigation as any).openDrawer()} className="p-2 -ml-2 mr-3 bg-white/10 rounded-full md:hidden">
                            <Menu size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-white">GST & Taxation</Text>
                    </View>
                </View>
                <Text className="text-[10px] text-blue-100 mt-1">Accountant &gt; Taxation</Text>
            </View>

            <ScrollView className="flex-1 px-4 md:px-8 py-6" showsVerticalScrollIndicator={false}>
                
                {/* Page Title & Subtitle */}
                <Text className="text-2xl font-extrabold text-gray-800">GST & Taxation</Text>
                <Text className="text-sm text-gray-400 mt-1 mb-6">Manage GST invoices, returns, TDS deductions, and reconciliations.</Text>

                {/* Tabs */}
                <View className="mb-8">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row bg-white border border-gray-100 rounded-xl p-1 self-start shadow-sm">
                            {(['Dashboard', 'GST', 'TDS', 'Returns', 'Reconciliation'] as Tab[]).map((tab) => (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 rounded-lg ${activeTab === tab ? 'bg-blue-50/50 border border-blue-100' : ''}`}
                                >
                                    <Text className={`text-sm font-semibold whitespace-nowrap ${activeTab === tab ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Breadcrumbs */}
                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    TAXATION / <Text className="text-blue-600">{activeTab.toUpperCase()}</Text>
                </Text>

                {/* ══════════════════════════════════════
                    DASHBOARD TAB
                ══════════════════════════════════════ */}
                {activeTab === 'Dashboard' && (
                    <View className="mb-12">
                        <Text className="text-lg font-bold text-gray-800 mb-4">GST DASHBOARD</Text>
                        
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                            <View className="flex-row space-x-4 pr-4">
                                {/* INPUT GST */}
                                <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 w-48">
                                    <View className="w-8 h-8 rounded-lg bg-green-50 items-center justify-center mb-3">
                                        <ArrowDownRight size={16} color="#00A15D" />
                                    </View>
                                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">INPUT GST</Text>
                                    <Text className="text-lg font-bold text-gray-800">₹0</Text>
                                </View>
                                {/* OUTPUT GST */}
                                <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 w-48">
                                    <View className="w-8 h-8 rounded-lg bg-red-50 items-center justify-center mb-3">
                                        <ArrowUpRight size={16} color="#FF0055" />
                                    </View>
                                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">OUTPUT GST</Text>
                                    <Text className="text-lg font-bold text-gray-800">₹0</Text>
                                </View>
                                {/* NET GST */}
                                <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 w-48">
                                    <View className="w-8 h-8 rounded-lg bg-blue-50 items-center justify-center mb-3">
                                        <FileText size={16} color="#2563EB" />
                                    </View>
                                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">NET GST</Text>
                                    <Text className="text-lg font-bold text-gray-800">₹0</Text>
                                </View>
                                {/* TDS COLLECTED */}
                                <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 w-48">
                                    <View className="w-8 h-8 rounded-lg bg-purple-50 items-center justify-center mb-3">
                                        <DollarSign size={16} color="#8B5CF6" />
                                    </View>
                                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">TDS COLLECTED</Text>
                                    <Text className="text-lg font-bold text-gray-800">₹0</Text>
                                </View>
                                {/* UPCOMING RETURN */}
                                <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 w-48">
                                    <View className="w-8 h-8 rounded-lg bg-orange-50 items-center justify-center mb-3">
                                        <Calendar size={16} color="#F59E0B" />
                                    </View>
                                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">UPCOMING RETURN</Text>
                                    <Text className="text-sm font-bold text-gray-800">GSTR-3B due 20th</Text>
                                </View>
                            </View>
                        </ScrollView>

                        <View className={isDesktop ? "flex-row space-x-6" : "flex-col space-y-6"}>
                            {/* Monthly GST Graph */}
                            <View className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1 ${!isDesktop && 'mb-6'}`}>
                                <Text className="text-sm font-bold text-gray-800 mb-10">Monthly GST Graph</Text>
                                <View className="flex-1 items-center justify-center py-20">
                                    <BarChart3 size={32} color="#E5E7EB" className="mb-3" />
                                    <Text className="text-xs text-gray-400 font-medium">No trend data available yet.</Text>
                                </View>
                                <View className="flex-row justify-center space-x-6 mt-10">
                                    <View className="flex-row items-center">
                                        <View className="w-2 h-2 rounded-full bg-[#00A15D] mr-2" />
                                        <Text className="text-[10px] font-bold text-gray-500 uppercase">Input GST</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <View className="w-2 h-2 rounded-full bg-[#FF0055] mr-2" />
                                        <Text className="text-[10px] font-bold text-gray-500 uppercase">Output GST</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Right Column */}
                            <View className="w-full md:w-96">
                                {/* Return Status */}
                                <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
                                    <Text className="text-sm font-bold text-gray-800 mb-4">Return Status</Text>
                                    
                                    <View className="bg-gray-50 rounded-lg p-3 flex-row justify-between items-center mb-3">
                                        <View>
                                            <Text className="text-xs font-bold text-gray-800">GSTR-3B</Text>
                                            <Text className="text-[10px] text-gray-400 mt-1">Due: 2026-05-20 | Period: 2026-04</Text>
                                        </View>
                                        <View className="bg-gray-200 px-2.5 py-1 rounded-md">
                                            <Text className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Draft</Text>
                                        </View>
                                    </View>
                                    
                                    <View className="bg-gray-50 rounded-lg p-3 flex-row justify-between items-center">
                                        <View>
                                            <Text className="text-xs font-bold text-gray-800">GSTR-1</Text>
                                            <Text className="text-[10px] text-gray-400 mt-1">Due: 2026-06-09 | Period: 2026-03</Text>
                                        </View>
                                        <View className="bg-gray-200 px-2.5 py-1 rounded-md">
                                            <Text className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Draft</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Recent Filing */}
                                <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                    <Text className="text-sm font-bold text-gray-800 mb-4">Recent Filing</Text>
                                    
                                    <View className="flex-row items-start mb-4">
                                        <View className="w-4 h-4 rounded-full bg-green-100 items-center justify-center mt-0.5 mr-3">
                                            <Check size={10} color="#00A15D" />
                                        </View>
                                        <View>
                                            <Text className="text-xs font-bold text-gray-800">GSTR-3B (2026-08)</Text>
                                            <Text className="text-[10px] text-gray-400 mt-0.5">Filed on 2026-09-01</Text>
                                        </View>
                                    </View>
                                    
                                    <View className="flex-row items-start">
                                        <View className="w-4 h-4 rounded-full bg-green-100 items-center justify-center mt-0.5 mr-3">
                                            <Check size={10} color="#00A15D" />
                                        </View>
                                        <View>
                                            <Text className="text-xs font-bold text-gray-800">GSTR-1 (2026-09)</Text>
                                            <Text className="text-[10px] text-gray-400 mt-0.5">Filed on 2026-09-01</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* ══════════════════════════════════════
                    GST TAB
                ══════════════════════════════════════ */}
                {activeTab === 'GST' && (
                    <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-12">
                        <View className="p-4 border-b border-gray-50 flex-col sm:flex-row justify-between items-start sm:items-center">
                            <View className="mb-4 sm:mb-0">
                                <Text className="text-sm font-bold text-gray-800">Invoice Register</Text>
                                <Text className="text-xs text-gray-400 mt-0.5">View and manage all GST Invoices</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View className="flex-row items-center space-x-2">
                                    <TouchableOpacity className="px-4 py-2 bg-gray-50 rounded-full">
                                        <Text className="text-xs font-bold text-gray-600">Export</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="px-4 py-2 bg-gray-50 rounded-full">
                                        <Text className="text-xs font-bold text-gray-600">Import</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="px-4 py-2 bg-gray-50 rounded-full">
                                        <Text className="text-xs font-bold text-gray-600">+ Purchase Invoice</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="px-4 py-2 bg-blue-600 rounded-full">
                                        <Text className="text-xs font-bold text-white">+ Sales Invoice</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                            <View className="min-w-full">
                                <View className="flex-row items-center px-4 py-3 border-b border-gray-50 bg-gray-50/30">
                                    <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DATE</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">INVOICE NO</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">TYPE</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">PARTY NAME</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">GSTIN</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">TAXABLE AMT</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">TOTAL GST</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">INVOICE TOTAL</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">ATTACHMENTS</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">ACTION</Text>
                                </View>
                                
                                {/* Rows */}
                                {[
                                    { date: '2026-09-01', id: '1', type: 'SALES', party: 'Customer', amt: '₹1,001', gst: '₹0', total: '₹94,625.4' },
                                    { date: '2026-09-01', id: '2', type: 'SALES', party: 'Customer', amt: '₹1,400', gst: '₹0', total: '₹1,400' },
                                    { date: '2026-09-01', id: '3', type: 'SALES', party: 'Customer', amt: '₹1,00,00,000', gst: '₹0', total: '₹1,29,50,200' },
                                    { date: '2026-09-02', id: '4', type: 'SALES', party: 'Customer', amt: '₹10,000.3', gst: '₹0', total: '₹10,000.3' },
                                    { date: '2026-09-02', id: '5', type: 'SALES', party: 'Customer', amt: '₹12,37,500', gst: '₹0', total: '₹14,45,650' },
                                    { date: '2026-09-02', id: '6', type: 'SALES', party: 'Customer', amt: '₹2,501.03', gst: '₹0', total: '₹2,501.03' },
                                    { date: '2026-09-07', id: '7', type: 'SALES', party: 'Customer', amt: '₹714', gst: '₹0', total: '₹714' },
                                    { date: '2026-09-01', id: 'bill-0001', type: 'PURCHASE', party: 'Vendor', amt: '₹0', gst: '₹0', total: '₹0' },
                                ].map((row, idx) => (
                                    <View key={idx} className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                        <Text className="w-24 text-xs font-medium text-gray-500">{row.date}</Text>
                                        <Text className="w-24 text-xs font-bold text-blue-600">{row.id}</Text>
                                        <View className="w-24">
                                            <View className={`rounded-md px-2 py-0.5 self-start ${row.type === 'SALES' ? 'bg-blue-50' : 'bg-green-50'}`}>
                                                <Text className={`text-[10px] font-bold ${row.type === 'SALES' ? 'text-blue-600' : 'text-green-600'}`}>{row.type}</Text>
                                            </View>
                                        </View>
                                        <Text className="w-32 text-xs font-semibold text-gray-800">{row.party}</Text>
                                        <Text className="w-24 text-xs font-medium text-gray-400">N/A</Text>
                                        <Text className="w-32 text-xs font-medium text-gray-800 text-right">{row.amt}</Text>
                                        <Text className="w-32 text-xs font-medium text-gray-800 text-right">{row.gst}</Text>
                                        <Text className="w-32 text-xs font-bold text-gray-800 text-right">{row.total}</Text>
                                        <View className="w-32 flex-row justify-center space-x-3">
                                            <Paperclip size={14} color="#9CA3AF" />
                                            <FileText size={14} color="#9CA3AF" />
                                        </View>
                                        <View className="w-24 flex-row justify-center space-x-3">
                                            <Eye size={14} color="#9CA3AF" />
                                            <Edit3 size={14} color="#9CA3AF" />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                        
                        {/* Pagination */}
                        <View className="flex-row justify-between items-center p-4 border-t border-gray-50">
                            <View className="flex-row items-center">
                                <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                                <View className="border border-gray-200 rounded px-2 py-1 flex-row items-center">
                                    <Text className="text-xs font-medium mr-2">10</Text>
                                    <ChevronDown size={12} color="#6B7280" />
                                </View>
                            </View>
                            <Text className="text-xs text-gray-400">Showing 1 - 8 of 8 records</Text>
                            <View className="flex-row items-center space-x-2">
                                <TouchableOpacity className="w-6 h-6 rounded border border-gray-200 items-center justify-center opacity-50">
                                    <Text className="text-xs text-gray-400">&lt;</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="w-6 h-6 rounded bg-blue-600 items-center justify-center">
                                    <Text className="text-xs text-white">1</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="w-6 h-6 rounded border border-gray-200 items-center justify-center opacity-50">
                                    <Text className="text-xs text-gray-400">&gt;</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* ══════════════════════════════════════
                    TDS TAB
                ══════════════════════════════════════ */}
                {activeTab === 'TDS' && (
                    <View className="mb-12">
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <View className="mb-4 sm:mb-0">
                                <Text className="text-sm font-bold text-gray-800">TDS Management</Text>
                                <Text className="text-xs text-gray-400 mt-0.5">Manage TDS deductions and payments</Text>
                            </View>
                            <TouchableOpacity className="px-4 py-2 bg-orange-500 rounded-full">
                                <Text className="text-xs font-bold text-white">+ Create TDS Deduction</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <View className="p-4 border-b border-gray-50">
                                <Text className="text-sm font-bold text-gray-800">Recent TDS Deductions</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <View className="min-w-full">
                                    <View className="flex-row items-center px-4 py-3 border-b border-gray-50 bg-gray-50/30">
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">PARTY NAME</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">PAN NUMBER</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">INVOICE NUMBER</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">PAYMENT AMOUNT</Text>
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">TDS SECTION</Text>
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">TDS RATE</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">TDS AMOUNT</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">DEPOSIT DATE</Text>
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">STATUS</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">ACTIONS</Text>
                                    </View>
                                    <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                        <Text className="w-32 text-xs font-semibold text-gray-800">TEJAS</Text>
                                        <Text className="w-32 text-xs font-medium text-gray-500">HDBRY7412E</Text>
                                        <Text className="w-32 text-xs font-medium text-gray-500">INV-0001</Text>
                                        <Text className="w-32 text-xs font-medium text-gray-800 text-right">₹100</Text>
                                        <Text className="w-24 text-xs font-medium text-gray-500 text-center">194J</Text>
                                        <Text className="w-24 text-xs font-medium text-gray-500 text-center">0%</Text>
                                        <Text className="w-32 text-xs font-bold text-orange-500 text-right">₹0</Text>
                                        <Text className="w-32 text-xs font-medium text-gray-500 text-center">2026-09-01</Text>
                                        <View className="w-24 items-center">
                                            <View className="bg-yellow-50 rounded-md px-2 py-0.5">
                                                <Text className="text-[10px] font-bold text-yellow-600">PENDING</Text>
                                            </View>
                                        </View>
                                        <View className="w-32 flex-row justify-center space-x-3">
                                            <Eye size={14} color="#2563EB" />
                                            <Edit3 size={14} color="#8B5CF6" />
                                            <Trash2 size={14} color="#EF4444" />
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                            {/* Pagination */}
                            <View className="flex-row justify-between items-center p-4 border-t border-gray-50">
                                <View className="flex-row items-center">
                                    <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                                    <View className="border border-gray-200 rounded px-2 py-1 flex-row items-center">
                                        <Text className="text-xs font-medium mr-2">10</Text>
                                        <ChevronDown size={12} color="#6B7280" />
                                    </View>
                                </View>
                                <Text className="text-xs text-gray-400">Showing 1 - 1 of 1 records</Text>
                                <View className="flex-row items-center space-x-2">
                                    <TouchableOpacity className="w-6 h-6 rounded border border-gray-200 items-center justify-center opacity-50">
                                        <Text className="text-xs text-gray-400">&lt;</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="w-6 h-6 rounded bg-orange-500 items-center justify-center">
                                        <Text className="text-xs text-white">1</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="w-6 h-6 rounded border border-gray-200 items-center justify-center opacity-50">
                                        <Text className="text-xs text-gray-400">&gt;</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* ══════════════════════════════════════
                    RETURNS TAB
                ══════════════════════════════════════ */}
                {activeTab === 'Returns' && (
                    <View className="mb-12">
                        <View className="flex-row justify-end mb-4">
                            <TouchableOpacity className="px-4 py-2 bg-blue-600 rounded-full">
                                <Text className="text-xs font-bold text-white">Create GST Return</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <View className="p-4 border-b border-gray-50">
                                <Text className="text-sm font-bold text-gray-800">Previous Returns</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <View className="min-w-full">
                                    <View className="flex-row items-center px-4 py-3 border-b border-gray-50 bg-gray-50/30">
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">FILING PERIOD</Text>
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">TYPE</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">TAXABLE VALUE</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">GST LIABILITY</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">ITC AVAILABLE</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">NET PAYABLE</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">STATUS</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">FILING DATE</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">ACTIONS</Text>
                                    </View>
                                    
                                    {/* Row 1 */}
                                    <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                        <Text className="w-24 text-xs font-bold text-gray-800">2026-09</Text>
                                        <View className="w-24 items-center">
                                            <View className="bg-blue-50 rounded-md px-2 py-0.5">
                                                <Text className="text-[10px] font-bold text-blue-600">GSTR-3B</Text>
                                            </View>
                                        </View>
                                        <Text className="w-32 text-xs font-medium text-gray-500 text-right">500</Text>
                                        <Text className="w-32 text-xs font-medium text-gray-500 text-right">500</Text>
                                        <Text className="w-32 text-xs font-medium text-gray-500 text-right">500</Text>
                                        <Text className="w-32 text-xs font-bold text-blue-600 text-right">0</Text>
                                        <View className="w-32 items-center">
                                            <View className="bg-yellow-50 border border-yellow-200 rounded-full px-3 py-0.5">
                                                <Text className="text-[10px] font-bold text-yellow-600">DRAFT</Text>
                                            </View>
                                        </View>
                                        <Text className="w-32 text-xs font-medium text-gray-500 text-center">2026-09-01</Text>
                                        <View className="w-32 flex-row justify-center space-x-3">
                                            <Eye size={14} color="#3B82F6" />
                                            <Edit3 size={14} color="#8B5CF6" />
                                            <Trash2 size={14} color="#EF4444" />
                                        </View>
                                    </View>

                                    {/* Row 2 */}
                                    <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                        <Text className="w-24 text-xs font-bold text-gray-800">2026-09</Text>
                                        <View className="w-24 items-center">
                                            <View className="bg-gray-100 rounded-md px-2 py-0.5">
                                                <Text className="text-[10px] font-bold text-gray-600">GSTR-1</Text>
                                            </View>
                                        </View>
                                        <Text className="w-32 text-xs font-medium text-gray-500 text-right">100</Text>
                                        <Text className="w-32 text-xs font-medium text-gray-500 text-right">100</Text>
                                        <Text className="w-32 text-xs font-medium text-gray-500 text-right">100</Text>
                                        <Text className="w-32 text-xs font-bold text-blue-600 text-right">0</Text>
                                        <View className="w-32 items-center">
                                            <View className="bg-yellow-50 border border-yellow-200 rounded-full px-3 py-0.5">
                                                <Text className="text-[10px] font-bold text-yellow-600">DRAFT</Text>
                                            </View>
                                        </View>
                                        <Text className="w-32 text-xs font-medium text-gray-500 text-center">2026-09-01</Text>
                                        <View className="w-32 flex-row justify-center space-x-3">
                                            <Eye size={14} color="#3B82F6" />
                                            <Edit3 size={14} color="#8B5CF6" />
                                            <Trash2 size={14} color="#EF4444" />
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>

                            {/* Pagination */}
                            <View className="flex-row justify-between items-center p-4 border-t border-gray-50">
                                <View className="flex-row items-center">
                                    <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                                    <View className="border border-gray-200 rounded px-2 py-1 flex-row items-center">
                                        <Text className="text-xs font-medium mr-2">10</Text>
                                        <ChevronDown size={12} color="#6B7280" />
                                    </View>
                                </View>
                                <Text className="text-xs text-gray-400">Showing 1 - 2 of 2 records</Text>
                                <View className="flex-row items-center space-x-2">
                                    <TouchableOpacity className="w-6 h-6 rounded border border-gray-200 items-center justify-center opacity-50">
                                        <Text className="text-xs text-gray-400">&lt;</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="w-6 h-6 rounded bg-blue-600 items-center justify-center">
                                        <Text className="text-xs text-white">1</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="w-6 h-6 rounded border border-gray-200 items-center justify-center opacity-50">
                                        <Text className="text-xs text-gray-400">&gt;</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* ══════════════════════════════════════
                    RECONCILIATION TAB
                ══════════════════════════════════════ */}
                {activeTab === 'Reconciliation' && (
                    <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-12">
                        <View className="p-4 border-b border-gray-50 flex-col sm:flex-row justify-between items-start sm:items-center">
                            <View className="mb-4 sm:mb-0">
                                <Text className="text-sm font-bold text-gray-800">GST Reconciliation</Text>
                                <Text className="text-xs text-gray-400 mt-0.5">Match ERP data with Portal (2A/2B)</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View className="flex-row items-center space-x-2">
                                    <TouchableOpacity className="px-4 py-2 border border-green-500 rounded-full">
                                        <Text className="text-xs font-bold text-green-600">Reconcile GST (Upload JSON)</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="px-4 py-2 border border-gray-200 rounded-full">
                                        <Text className="text-xs font-bold text-gray-600">Download Mismatch Report</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                            <View className="min-w-full">
                                <View className="flex-row items-center px-4 py-3 border-b border-gray-50 bg-gray-50/30">
                                    <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">INVOICE NO</Text>
                                    <Text className="w-48 text-[9px] font-bold text-gray-400 uppercase tracking-wider">VENDOR</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">GST (ERP)</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">GST (PORTAL)</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">DIFFERENCE</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">STATUS</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">ACTIONS</Text>
                                </View>
                                
                                {/* Row 1 */}
                                <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                    <Text className="w-32 text-xs font-bold text-blue-600">INV-UTC-001</Text>
                                    <Text className="w-48 text-xs font-medium text-gray-600">UltraTech Cement</Text>
                                    <Text className="w-32 text-xs font-bold text-gray-800 text-right">₹1,40,000</Text>
                                    <Text className="w-32 text-xs font-bold text-gray-800 text-right">₹1,40,000</Text>
                                    <Text className="w-32 text-xs font-bold text-green-500 text-right">₹0</Text>
                                    <View className="w-32 items-center">
                                        <View className="bg-green-50 border border-green-200 rounded-md px-2 py-0.5">
                                            <Text className="text-[10px] font-bold text-green-600">MATCHED</Text>
                                        </View>
                                    </View>
                                    <View className="w-32 items-center">
                                        <View className="border border-gray-200 rounded-md px-2 py-1 flex-row items-center justify-between w-24">
                                            <Text className="text-[10px] text-gray-600">Select Action</Text>
                                            <ChevronDown size={12} color="#9CA3AF" />
                                        </View>
                                    </View>
                                </View>

                                {/* Row 2 */}
                                <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                    <Text className="w-32 text-xs font-bold text-blue-600">INV-STEEL-44</Text>
                                    <Text className="w-48 text-xs font-medium text-gray-600">Jindal Steel</Text>
                                    <Text className="w-32 text-xs font-bold text-gray-800 text-right">₹85,000</Text>
                                    <Text className="w-32 text-xs font-bold text-gray-800 text-right">₹90,000</Text>
                                    <Text className="w-32 text-xs font-bold text-red-500 text-right">-₹5,000</Text>
                                    <View className="w-32 items-center">
                                        <View className="bg-red-50 border border-red-200 rounded-md px-2 py-0.5">
                                            <Text className="text-[10px] font-bold text-red-600">MISMATCH</Text>
                                        </View>
                                    </View>
                                    <View className="w-32 items-center">
                                        <View className="border border-gray-200 rounded-md px-2 py-1 flex-row items-center justify-between w-24">
                                            <Text className="text-[10px] text-gray-600">Reconcile</Text>
                                            <ChevronDown size={12} color="#9CA3AF" />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
