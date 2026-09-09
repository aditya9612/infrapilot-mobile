import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Upload, Download, Plus, Eye, Search, Edit2, Trash2, Eye as EyeIcon } from 'lucide-react-native';

const TABS = ['Assets', 'Liabilities', 'Income', 'Expenses'];

const DATA: Record<string, { hierarchy: { name: string; code: string }[]; accounts: { code: string; name: string; type: string; parent: string; opening: string; current: string; status: string }[] }> = {
    Assets: {
        hierarchy: [
            { name: 'accountyant', code: 'ACC005' },
            { name: 'IDBI Bank', code: 'IDBINH' },
            { name: 'Panjab National Bank', code: 'PNB27' },
            { name: 'CANERA BANK', code: 'M4126' },
            { name: 'Bank', code: 'BANK' },
            { name: 'Cash', code: 'CASH' },
            { name: 'Accounts Receivable', code: 'AR-001' },
            { name: 'Sai Construction', code: 'ACC-1011' },
            { name: 'Petty Cash Account', code: 'ACC-1005' },
            { name: 'Primary Cash Account', code: 'ACC-1004' },
        ],
        accounts: [
            { code: 'ACC005', name: 'accountyant', type: 'ASSET', parent: '—', opening: '₹0', current: '₹0.00', status: 'Active' },
            { code: 'IDBINH', name: 'IDBI Bank', type: 'ASSET', parent: '—', opening: '₹0', current: '₹0.00', status: 'Active' },
            { code: 'PNB27', name: 'Panjab National Bank', type: 'ASSET', parent: '—', opening: '₹0', current: '₹0.00', status: 'Active' },
            { code: 'M4126', name: 'CANERA BANK', type: 'ASSET', parent: '—', opening: '₹0', current: '₹0.00', status: 'Active' },
            { code: 'BANK', name: 'Bank', type: 'ASSET', parent: '—', opening: '₹0', current: '₹10.00', status: 'Active' },
            { code: 'CASH', name: 'Cash', type: 'ASSET', parent: '—', opening: '₹0', current: '₹0.00', status: 'Active' },
            { code: 'AR-001', name: 'Accounts Receivable', type: 'ASSET', parent: '—', opening: '₹0', current: '₹1,21,70,112.01', status: 'Active' },
            { code: 'ACC-1011', name: 'Sai Construction', type: 'ASSET', parent: '—', opening: '₹0', current: '₹0.00', status: 'Active' },
            { code: 'ACC-1005', name: 'Petty Cash Account', type: 'ASSET', parent: '—', opening: '₹0', current: '₹10.00', status: 'Active' },
            { code: 'ACC-1004', name: 'Primary Cash Account', type: 'ASSET', parent: '—', opening: '₹0', current: '-₹35,019.99', status: 'Active' },
        ],
    },
    Liabilities: {
        hierarchy: [
            { name: 'ICICI Bank', code: 'ICICIBNK' },
            { name: 'patil construction Bank acc', code: 'ACO6011' },
            { name: 'Output GST', code: 'GST-OUT' },
            { name: 'Retention Payable Account', code: 'ACC-1010' },
            { name: 'TDS Payable Account', code: 'ACC-1009' },
        ],
        accounts: [
            { code: 'ICICIBNK', name: 'ICICI Bank', type: 'LIABILITY', parent: '—', opening: '₹0', current: '₹0.00', status: 'Active' },
            { code: 'ACO6011', name: 'patil construction Bank acc', type: 'LIABILITY', parent: '—', opening: '₹0', current: '₹0.00', status: 'Active' },
            { code: 'GST-OUT', name: 'Output GST', type: 'LIABILITY', parent: '—', opening: '₹0', current: '₹18,57,172.90', status: 'Active' },
            { code: 'ACC-1010', name: 'Retention Payable Account', type: 'LIABILITY', parent: '—', opening: '₹0', current: '₹0.00', status: 'Active' },
            { code: 'ACC-1009', name: 'TDS Payable Account', type: 'LIABILITY', parent: '—', opening: '₹0', current: '₹0.00', status: 'Active' },
        ],
    },
    Income: {
        hierarchy: [
            { name: 'Federal Bank', code: 'FEDERALBNL' },
            { name: 'Indusind Bank', code: 'INDUS001' },
            { name: 'company revenue', code: 'REV-002' },
            { name: 'Revenue', code: 'REV-001' },
        ],
        accounts: [
            { code: 'FEDERALBNL', name: 'Federal Bank', type: 'INCOME', parent: '—', opening: '₹0', current: '₹0.00', status: 'Active' },
            { code: 'INDUS001', name: 'Indusind Bank', type: 'INCOME', parent: '—', opening: '₹0', current: '₹0.00', status: 'Active' },
            { code: 'REV-002', name: 'company revenue', type: 'INCOME', parent: '—', opening: '₹0', current: '₹0.00', status: 'Active' },
            { code: 'REV-001', name: 'Revenue', type: 'INCOME', parent: '—', opening: '₹0', current: '₹1,09,28,826.01', status: 'Active' },
        ],
    },
    Expenses: {
        hierarchy: [
            { name: 'BANK OF BARODA', code: 'BOB001' },
            { name: 'Construction example asset', code: 'ACC-1008' },
            { name: 'Staff Salary Expense Account', code: 'ACC-1007' },
            { name: 'Wages Expense Account', code: 'ACC-1006' },
        ],
        accounts: [
            { code: 'BOB001', name: 'BANK OF BARODA', type: 'EXPENSE', parent: '—', opening: '₹0', current: '₹0.00', status: 'Active' },
            { code: 'ACC-1008', name: 'Construction example asset', type: 'EXPENSE', parent: '—', opening: '₹0', current: '₹100.00', status: 'Active' },
            { code: 'ACC-1007', name: 'Staff Salary Expense Account', type: 'EXPENSE', parent: '—', opening: '₹0', current: '₹61,700.00', status: 'Active' },
            { code: 'ACC-1006', name: 'Wages Expense Account', type: 'EXPENSE', parent: '—', opening: '₹0', current: '₹37,418.99', status: 'Active' },
        ],
    },
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
    ASSET: { bg: '#DBEAFE', text: '#1D4ED8' },
    LIABILITY: { bg: '#FEE2E2', text: '#DC2626' },
    INCOME: { bg: '#D1FAE5', text: '#065F46' },
    EXPENSE: { bg: '#FEF3C7', text: '#92400E' },
};

export function ChartOfAccountsScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Assets');
    const tabData = DATA[activeTab];

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            {/* Blue Top Header */}
            <View className="px-4 pt-14 pb-3 bg-blue-600">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => (navigation as any).openDrawer()} className="p-2 -ml-2 mr-3 bg-white/10 rounded-full">
                            <Menu size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text className="text-base font-bold text-white">Chart of Accounts</Text>
                    </View>
                    <View className="flex-row items-center space-x-3">
                        <View className="w-7 h-7 bg-white/20 rounded-full items-center justify-center">
                            <Text className="text-white text-xs font-bold">A</Text>
                        </View>
                    </View>
                </View>
                <Text className="text-[10px] text-blue-100 mt-0.5">Accountant &gt; Finance &gt; COA</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4">

                    {/* Title + Action Row */}
                    <View className="flex-col mb-4 gap-y-3">
                        <View>
                            <Text className="text-lg font-bold text-gray-900">Chart of Accounts</Text>
                            <Text className="text-xs text-gray-500 mt-0.5">Manage hierarchical general ledger accounts for the organization.</Text>
                        </View>
                        <View className="flex-row items-center flex-wrap gap-2">
                            {/* List View */}
                            <View className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-lg">
                                <View className="w-3.5 h-3.5 border-2 border-blue-600 rounded-sm bg-blue-600 items-center justify-center mr-1.5">
                                    <Text className="text-white text-[8px] font-bold">✓</Text>
                                </View>
                                <Text className="text-xs font-medium text-gray-700">List View</Text>
                            </View>
                            {/* Search */}
                            <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2 w-40">
                                <Search size={13} color="#9CA3AF" />
                                <TextInput placeholder="Search accounts..." className="ml-1.5 text-xs text-gray-700 flex-1" placeholderTextColor="#9CA3AF" />
                            </View>
                            {/* Import COA */}
                            <TouchableOpacity className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-lg">
                                <Upload size={13} color="#6B7280" />
                                <Text className="ml-1.5 text-xs font-medium text-gray-700">Import COA</Text>
                            </TouchableOpacity>
                            {/* Export COA */}
                            <TouchableOpacity className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-lg">
                                <Download size={13} color="#6B7280" />
                                <Text className="ml-1.5 text-xs font-medium text-gray-700">Export COA</Text>
                            </TouchableOpacity>
                            {/* Add Account */}
                            <TouchableOpacity className="flex-row items-center px-3 py-2 bg-blue-600 rounded-lg shadow-sm">
                                <Plus size={13} color="#FFFFFF" />
                                <Text className="ml-1.5 text-xs font-bold text-white">Add Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View className="flex-row mb-4 bg-white border border-gray-200 rounded-xl overflow-hidden self-start">
                        {TABS.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 ${activeTab === tab ? 'bg-blue-50 border-b-2 border-blue-600' : 'bg-transparent'}`}
                            >
                                <Text className={`text-xs font-semibold ${activeTab === tab ? 'text-blue-600' : 'text-gray-600'}`}>{tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Two Column Layout */}
                    <View className="flex-row gap-4">

                        {/* Left Panel — Account Hierarchy */}
                        <View className="w-56 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <View className="px-4 py-3 border-b border-gray-100">
                                <Text className="text-xs font-bold text-gray-800">Account Hierarchy</Text>
                            </View>
                            <ScrollView className="p-3" showsVerticalScrollIndicator={false}>
                                {tabData.hierarchy.map((item, i) => (
                                    <TouchableOpacity key={i} className="flex-row items-center justify-between py-2 px-1 rounded-lg mb-0.5">
                                        <Text className="text-xs text-blue-600 font-medium flex-1 mr-2" numberOfLines={1}>{item.name}</Text>
                                        <Text className="text-[9px] text-gray-400 font-mono">{item.code}</Text>
                                    </TouchableOpacity>
                                ))}
                                <Text className="text-[10px] text-gray-400 mt-2 px-1">1-{tabData.hierarchy.length} of {tabData.hierarchy.length}</Text>
                            </ScrollView>
                        </View>

                        {/* Right Panel — All Accounts Table */}
                        <View className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <View className="px-4 py-3 border-b border-gray-100 flex-row items-center justify-between">
                                <Text className="text-xs font-bold text-gray-800">All Accounts</Text>
                                <Text className="text-[10px] text-gray-400">Showing {tabData.accounts.length} entries</Text>
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <View>
                                    {/* Table Header */}
                                    <View className="flex-row items-center px-4 py-3 bg-gray-50/60 border-b border-gray-100">
                                        <Text className="w-28 text-[9px] font-bold text-gray-400 uppercase tracking-wider">ACCOUNT CODE</Text>
                                        <Text className="w-48 text-[9px] font-bold text-gray-400 uppercase tracking-wider">ACCOUNT NAME</Text>
                                        <Text className="w-28 text-[9px] font-bold text-gray-400 uppercase tracking-wider">ACCOUNT TYPE</Text>
                                        <Text className="w-36 text-[9px] font-bold text-gray-400 uppercase tracking-wider">PARENT ACCOUNT</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">OPENING BALANCE</Text>
                                        <Text className="w-36 text-[9px] font-bold text-gray-400 uppercase tracking-wider">CURRENT BALANCE</Text>
                                        <Text className="w-20 text-[9px] font-bold text-gray-400 uppercase tracking-wider">STATUS</Text>
                                        <Text className="w-20 text-[9px] font-bold text-gray-400 uppercase tracking-wider">ACTIONS</Text>
                                    </View>

                                    {/* Table Rows */}
                                    {tabData.accounts.map((row, index) => {
                                        const typeColor = TYPE_COLORS[row.type] || { bg: '#F3F4F6', text: '#374151' };
                                        const isNegative = row.current.startsWith('-');
                                        return (
                                            <View key={index} className={`flex-row items-center px-4 py-3.5 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}>
                                                {/* Account Code */}
                                                <View className="w-28">
                                                    <View className="px-2 py-0.5 rounded self-start" style={{ backgroundColor: typeColor.bg }}>
                                                        <Text className="text-[10px] font-bold font-mono" style={{ color: typeColor.text }}>{row.code}</Text>
                                                    </View>
                                                </View>
                                                {/* Account Name */}
                                                <View className="w-48">
                                                    <Text className="text-xs font-semibold text-gray-800">{row.name}</Text>
                                                </View>
                                                {/* Account Type */}
                                                <View className="w-28">
                                                    <View className="px-2 py-0.5 rounded self-start" style={{ backgroundColor: typeColor.bg }}>
                                                        <Text className="text-[10px] font-bold" style={{ color: typeColor.text }}>{row.type}</Text>
                                                    </View>
                                                </View>
                                                {/* Parent Account */}
                                                <View className="w-36">
                                                    <Text className="text-xs text-gray-500">{row.parent}</Text>
                                                </View>
                                                {/* Opening Balance */}
                                                <View className="w-32">
                                                    <Text className="text-xs text-gray-600">{row.opening}</Text>
                                                </View>
                                                {/* Current Balance */}
                                                <View className="w-36">
                                                    <Text className={`text-xs font-semibold ${isNegative ? 'text-red-500' : 'text-gray-800'}`}>{row.current}</Text>
                                                </View>
                                                {/* Status */}
                                                <View className="w-20">
                                                    <Text className="text-xs text-green-600 font-medium">{row.status}</Text>
                                                </View>
                                                {/* Actions */}
                                                <View className="w-20 flex-row items-center space-x-2">
                                                    <TouchableOpacity className="p-1">
                                                        <EyeIcon size={13} color="#9CA3AF" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity className="p-1">
                                                        <Edit2 size={13} color="#F59E0B" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity className="p-1">
                                                        <Trash2 size={13} color="#9CA3AF" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View className="h-12" />
            </ScrollView>
        </View>
    );
}
