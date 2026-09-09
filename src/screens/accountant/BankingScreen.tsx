import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, FileText, Download, Upload, ChevronDown, CheckCircle, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight, Wallet, Landmark } from 'lucide-react-native';

type MainTab = 'Bank Accounts' | 'Cash Book' | 'Bank Book' | 'Bank Reconciliation';
type BankAccSubTab = 'Bank Accounts' | 'Statements' | 'Account Details';
type ReconSubTab = 'Dashboard' | 'Pending' | 'Matched' | 'History';

export function BankingScreen() {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const [mainTab, setMainTab] = useState<MainTab>('Bank Accounts');
    const [bankAccSubTab, setBankAccSubTab] = useState<BankAccSubTab>('Bank Accounts');
    const [reconSubTab, setReconSubTab] = useState<ReconSubTab>('Dashboard');

    // Header Title logic
    const getHeaderTitle = () => {
        switch (mainTab) {
            case 'Bank Accounts': return 'BANK ACCOUNTS';
            case 'Cash Book': return 'CASH BOOK';
            case 'Bank Book': return 'BANK BOOK';
            case 'Bank Reconciliation': return 'BANK RECONCILIATION';
        }
    };

    const getHeaderSubtitle = () => {
        switch (mainTab) {
            case 'Bank Accounts': return 'Manage and track your accounts records.';
            case 'Cash Book': return 'Manage and track your cash records.';
            case 'Bank Book': return 'Manage and track your bank book records.';
            case 'Bank Reconciliation': return 'Manage and track your reconciliation records.';
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Top Blue Header */}
            <View className="px-4 pt-14 pb-4 bg-blue-600">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => (navigation as any).openDrawer()} className="p-2 -ml-2 mr-3 bg-white/10 rounded-full md:hidden">
                        <Menu size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">Bank & Cash Management</Text>
                </View>
                <Text className="text-[10px] text-blue-100 mt-1">Accountant &gt; Banking</Text>
            </View>

            <ScrollView className="flex-1 px-4 md:px-8 py-6" showsVerticalScrollIndicator={false}>
                
                {/* Dynamic Title and Action Buttons */}
                <View className="flex-col md:flex-row md:items-center justify-between mb-6">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-2xl font-extrabold text-gray-800">{getHeaderTitle()}</Text>
                        <Text className="text-sm text-gray-400 mt-1">{getHeaderSubtitle()}</Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row items-center space-x-2">
                            <TouchableOpacity className="flex-row items-center px-4 py-2 border border-gray-200 bg-white rounded-lg">
                                <FileText size={14} color="#6B7280" className="mr-2" />
                                <Text className="text-xs font-bold text-gray-600">Template</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center px-4 py-2 border border-gray-200 bg-white rounded-lg">
                                <Download size={14} color="#6B7280" className="mr-2" />
                                <Text className="text-xs font-bold text-gray-600">Import {mainTab === 'Bank Reconciliation' ? 'Bank Transactions' : mainTab}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center px-4 py-2 border border-gray-200 bg-white rounded-lg">
                                <Upload size={14} color="#6B7280" className="mr-2" />
                                <Text className="text-xs font-bold text-gray-600">Export {mainTab === 'Bank Reconciliation' ? 'Reconciliation CSV' : mainTab}</Text>
                            </TouchableOpacity>
                            {mainTab === 'Bank Accounts' && (
                                <TouchableOpacity className="flex-row items-center px-4 py-2 bg-blue-600 rounded-lg">
                                    <Text className="text-xs font-bold text-white">+ Add Account</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>
                </View>

                {/* Main Tabs */}
                <View className="mb-6">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row bg-white border border-gray-100 rounded-xl p-1 self-start shadow-sm">
                            {(['Bank Accounts', 'Cash Book', 'Bank Book', 'Bank Reconciliation'] as MainTab[]).map((tab) => (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => setMainTab(tab)}
                                    className={`px-6 py-2.5 rounded-lg ${mainTab === tab ? 'bg-blue-50/50 border border-blue-100' : ''}`}
                                >
                                    <Text className={`text-sm font-semibold whitespace-nowrap ${mainTab === tab ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* 4 Overview Cards */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
                    <View className="flex-row space-x-4 pr-4">
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 w-64 md:w-72">
                            <View className="w-8 h-8 rounded-lg bg-blue-50 items-center justify-center mb-4">
                                <Landmark size={16} color="#2563EB" />
                            </View>
                            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">TOTAL BANK BALANCE</Text>
                            <Text className="text-xl font-bold text-gray-800">₹0</Text>
                        </View>

                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 w-64 md:w-72">
                            <View className="w-8 h-8 rounded-lg bg-green-50 items-center justify-center mb-4">
                                <CheckCircle size={16} color="#00A15D" />
                            </View>
                            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">AVAILABLE CASH</Text>
                            <Text className="text-xl font-bold text-gray-800">₹0</Text>
                        </View>

                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 w-64 md:w-72">
                            <View className="w-8 h-8 rounded-lg bg-indigo-50 items-center justify-center mb-4">
                                <ArrowDownRight size={16} color="#6366F1" />
                            </View>
                            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">TODAY'S DEPOSIT</Text>
                            <Text className="text-xl font-bold text-gray-800">₹0</Text>
                        </View>

                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 w-64 md:w-72">
                            <View className="w-8 h-8 rounded-lg bg-red-50 items-center justify-center mb-4">
                                <ArrowUpRight size={16} color="#EF4444" />
                            </View>
                            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">TODAY'S WITHDRAWAL</Text>
                            <Text className="text-xl font-bold text-gray-800">₹0</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* ══════════════════════════════════════
                    BANK ACCOUNTS
                ══════════════════════════════════════ */}
                {mainTab === 'Bank Accounts' && (
                    <View className="mb-12">
                        {/* Sub-tabs */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                            <View className="flex-row space-x-2">
                                {(['Bank Accounts', 'Statements', 'Account Details'] as BankAccSubTab[]).map(tab => (
                                    <TouchableOpacity
                                        key={tab}
                                        onPress={() => setBankAccSubTab(tab)}
                                        className={`px-4 py-2 rounded-lg ${bankAccSubTab === tab ? 'bg-blue-50' : 'bg-transparent'}`}
                                    >
                                        <Text className={`text-xs font-bold whitespace-nowrap ${bankAccSubTab === tab ? 'text-blue-600' : 'text-gray-500'}`}>{tab}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <View className="p-4 border-b border-gray-50 flex-row justify-between items-center">
                                <Text className="text-sm font-bold text-gray-800">{bankAccSubTab}</Text>
                                {bankAccSubTab === 'Bank Accounts' && (
                                    <TouchableOpacity>
                                        <Text className="text-xs font-bold text-blue-600">Refresh</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <View className="min-w-full">
                                    {bankAccSubTab === 'Bank Accounts' && (
                                        <>
                                            <View className="flex-row items-center px-4 py-3 border-b border-gray-50 bg-gray-50/30">
                                                <Text className="w-40 text-[9px] font-bold text-gray-400 uppercase tracking-wider">ACCOUNT NAME</Text>
                                                <Text className="w-48 text-[9px] font-bold text-gray-400 uppercase tracking-wider">BANK NAME</Text>
                                                <Text className="w-40 text-[9px] font-bold text-gray-400 uppercase tracking-wider">ACCOUNT NO</Text>
                                                <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">IFSC</Text>
                                                <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">BALANCE</Text>
                                                <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">STATUS</Text>
                                                <Text className="w-40 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">ACTIONS</Text>
                                            </View>
                                            {[
                                                { acc: 'Primary Current', bank: 'Central Bank of India', no: 'xxxxxxxxx1015', ifsc: 'CBIN012437X', bal: '₹-100' },
                                                { acc: 'Primary Current', bank: 'Bank of Baroda', no: '8451237658965', ifsc: 'BARB0123456', bal: '₹100' },
                                            ].map((row, idx) => (
                                                <View key={idx} className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                                    <Text className="w-40 text-xs font-semibold text-gray-800">{row.acc}</Text>
                                                    <Text className="w-48 text-xs font-medium text-gray-500">{row.bank}</Text>
                                                    <Text className="w-40 text-xs font-medium text-gray-500">{row.no}</Text>
                                                    <Text className="w-32 text-xs font-medium text-gray-500">{row.ifsc}</Text>
                                                    <Text className="w-32 text-xs font-bold text-green-500">{row.bal}</Text>
                                                    <View className="w-24 items-center">
                                                        <View className="bg-green-50 rounded-md px-2 py-0.5">
                                                            <Text className="text-[10px] font-bold text-green-600">ACTIVE</Text>
                                                        </View>
                                                    </View>
                                                    <View className="w-40 flex-row justify-center space-x-2">
                                                        <TouchableOpacity className="px-3 py-1 bg-blue-50 rounded">
                                                            <Text className="text-xs font-bold text-blue-600">View Ledger</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity className="px-3 py-1 bg-gray-50 rounded border border-gray-100">
                                                            <Text className="text-xs font-bold text-gray-600">Edit</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            ))}
                                        </>
                                    )}

                                    {bankAccSubTab === 'Statements' && (
                                        <>
                                            <View className="flex-row items-center px-4 py-3 border-b border-gray-50 bg-gray-50/30">
                                                <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DATE</Text>
                                                <Text className="w-64 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DESCRIPTION</Text>
                                                <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">REF</Text>
                                                <Text className="w-48 text-[9px] font-bold text-gray-400 uppercase tracking-wider">AMOUNT</Text>
                                            </View>
                                            <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                                <Text className="w-32 text-xs font-medium text-gray-500">2024-11-01</Text>
                                                <Text className="w-64 text-xs font-medium text-gray-800">Opening Balance</Text>
                                                <Text className="w-32 text-xs font-medium text-gray-500">-</Text>
                                                <Text className="w-48 text-xs font-medium text-gray-500">₹0</Text>
                                            </View>
                                        </>
                                    )}
                                    {bankAccSubTab === 'Account Details' && (
                                        <View className="p-8 items-center justify-center">
                                            <Text className="text-gray-400 text-sm">Select an account to view details.</Text>
                                        </View>
                                    )}
                                </View>
                            </ScrollView>

                            {/* Pagination for Bank Accounts */}
                            {bankAccSubTab === 'Bank Accounts' && (
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
                            )}
                        </View>
                    </View>
                )}

                {/* ══════════════════════════════════════
                    CASH BOOK
                ══════════════════════════════════════ */}
                {mainTab === 'Cash Book' && (
                    <View className="mb-12">
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                            <View className="flex-row space-x-2">
                                <TouchableOpacity className="px-4 py-2 rounded-lg bg-blue-50">
                                    <Text className="text-xs font-bold whitespace-nowrap text-blue-600">Cash Ledger</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <View className="p-4 border-b border-gray-50">
                                <Text className="text-sm font-bold text-gray-800">Cash Ledger</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <View className="min-w-full">
                                    <View className="flex-row items-center px-4 py-3 border-b border-gray-50 bg-gray-50/30">
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DATE</Text>
                                        <Text className="w-40 text-[9px] font-bold text-gray-400 uppercase tracking-wider">VOUCHER NO</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">TYPE</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DEBIT</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">CREDIT</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">BALANCE</Text>
                                    </View>
                                    <View className="py-12 items-center justify-center">
                                        <Text className="text-xs font-medium text-gray-500">No ledger entries found.</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                )}

                {/* ══════════════════════════════════════
                    BANK BOOK
                ══════════════════════════════════════ */}
                {mainTab === 'Bank Book' && (
                    <View className="mb-12">
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-4">
                            <View className="p-4 border-b border-gray-50">
                                <Text className="text-sm font-bold text-gray-800">Bank Book Ledger</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <View className="min-w-full">
                                    <View className="flex-row items-center px-4 py-3 border-b border-gray-50 bg-gray-50/30">
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DATE</Text>
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">REF</Text>
                                        <Text className="w-64 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DETAILS</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">WITHDRAWAL</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DEPOSIT</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">BALANCE</Text>
                                    </View>

                                    {[
                                        { ref: 'JV-8', det: 'Fund transfer: i\'p/', w: '-', d: '₹100', bal: '₹100', wc: 'text-red-500', dc: 'text-green-500' },
                                        { ref: 'JV-8', det: 'Fund transfer: i\'p/', w: '₹100', d: '-', bal: '₹0', wc: 'text-red-500', dc: 'text-green-500' },
                                        { ref: 'JV-9', det: 'general entry', w: '₹100', d: '₹100', bal: '₹0', wc: 'text-red-500', dc: 'text-green-500' },
                                        { ref: 'JV-10', det: 'general entry created', w: '₹5000', d: '₹5000', bal: '₹0', wc: 'text-red-500', dc: 'text-green-500' },
                                        { ref: 'JV-11', det: 'purchase of cement', w: '₹1000', d: '₹1000', bal: '₹0', wc: 'text-red-500', dc: 'text-green-500' },
                                        { ref: 'JV-12', det: 'purchase sand', w: '₹5000', d: '₹5000', bal: '₹0', wc: 'text-red-500', dc: 'text-green-500' },
                                    ].map((row, idx) => (
                                        <View key={idx} className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                            <Text className="w-32 text-xs font-medium text-gray-500">2026-09-01</Text>
                                            <Text className="w-24 text-xs font-bold text-gray-800">{row.ref}</Text>
                                            <Text className="w-64 text-xs font-medium text-gray-600">{row.det}</Text>
                                            <Text className={`w-32 text-xs font-bold ${row.wc}`}>{row.w}</Text>
                                            <Text className={`w-32 text-xs font-bold ${row.dc}`}>{row.d}</Text>
                                            <Text className="w-32 text-xs font-bold text-gray-800">{row.bal}</Text>
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
                                <Text className="text-xs text-gray-400">Showing 1 - 6 of 6 records</Text>
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
                    BANK RECONCILIATION
                ══════════════════════════════════════ */}
                {mainTab === 'Bank Reconciliation' && (
                    <View className="mb-12">
                        {/* Sub-tabs and Actions */}
                        <View className="flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 sm:mb-0">
                                <View className="flex-row space-x-2">
                                    {(['Dashboard', 'Pending', 'Matched', 'History'] as ReconSubTab[]).map(tab => (
                                        <TouchableOpacity
                                            key={tab}
                                            onPress={() => setReconSubTab(tab)}
                                            className={`px-4 py-2 rounded-lg ${reconSubTab === tab ? 'bg-blue-50' : 'bg-transparent'}`}
                                        >
                                            <Text className={`text-xs font-bold whitespace-nowrap ${reconSubTab === tab ? 'text-blue-600' : 'text-gray-500'}`}>{tab}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>

                            <View className="flex-row items-center space-x-2 w-full sm:w-auto overflow-hidden">
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View className="flex-row space-x-2">
                                        <TouchableOpacity className="px-4 py-2 border border-gray-200 rounded-full">
                                            <Text className="text-xs font-bold text-gray-600">+ Add Bank Txn</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="px-4 py-2 bg-blue-600 rounded-full">
                                            <Text className="text-xs font-bold text-white">Auto Run Recon</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>

                        {/* Subtab Content */}
                        {reconSubTab === 'Dashboard' && (
                            <View className={isDesktop ? "flex-row space-x-4" : "flex-col space-y-4"}>
                                {/* Pending Items */}
                                <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1">
                                    <Text className="text-sm font-bold text-gray-800 mb-2">Pending Items</Text>
                                    <Text className="text-2xl font-extrabold text-orange-500">0</Text>
                                    <Text className="text-xs text-gray-400 mt-1">Unmatched ERP transactions</Text>
                                </View>
                                {/* Matched Today */}
                                <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1">
                                    <Text className="text-sm font-bold text-gray-800 mb-2">Matched Today</Text>
                                    <Text className="text-2xl font-extrabold text-green-500">0</Text>
                                    <Text className="text-xs text-gray-400 mt-1">Successfully reconciled</Text>
                                </View>
                                {/* Discrepancy */}
                                <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1">
                                    <Text className="text-sm font-bold text-gray-800 mb-2">Discrepancy</Text>
                                    <Text className="text-2xl font-extrabold text-red-500">₹0</Text>
                                    <Text className="text-xs text-gray-400 mt-1">Bank vs ERP Difference</Text>
                                </View>
                            </View>
                        )}
                        {reconSubTab !== 'Dashboard' && (
                            <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 items-center justify-center">
                                <Text className="text-gray-400 text-sm">No {reconSubTab.toLowerCase()} data found.</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
