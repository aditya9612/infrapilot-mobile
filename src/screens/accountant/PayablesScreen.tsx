import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Upload, Download, Plus, Edit2, Search, Link } from 'lucide-react-native';

// ────────── Types ──────────
type MainTab = 'Dashboard' | 'Vendor Bills' | 'Outstanding' | 'Payment Requests';
type VendorSubTab = 'Create Vendor Bill' | 'Vendor List' | 'Vendor Approval' | 'Vendor Payment';

// ────────── Mock Data ──────────
const VENDOR_LIST = [
    {
        id: '1',
        name: 'Venom',
        code: 'RA B8-05',
        status: 'PENDING',
        project: 'Sara City',
        poNumber: '27',
        billDate: '2026-06-27',
        dueDate: '2026-09-19',
        grossAmount: '₹1,06,000',
        gstAmount: '₹6,000',
        tdsAmount: '₹2,000',
        totalPayable: '₹1,06,000',
        billItems: [
            { name: 'Cement', qty: 'Qty: 100 BAGS × ₹400', amount: '₹40,000' },
            { name: 'Sand', qty: 'Qty: 20 TON × ₹2,000', amount: '₹40,000' },
            { name: 'Aggregate', qty: 'Qty: 10 ITEM × ₹2,000', amount: '₹20,000' },
        ],
    },
];

const OUTSTANDING_LIST = [
    { party: 'TATA Steel Dist.', type: 'VENDOR', billNo: 'TATAFE700', billDate: '2024-04-25', dueDate: '2024-04-15', amount: '₹3,85,800', paid: '₹3,83,800', balance: '₹2,00,000', overdue: true },
    { party: 'Shree Bricks', type: 'VENDOR', billNo: 'SB-102', billDate: '2024-04-22', dueDate: '2021-09-56', amount: '₹89,250', paid: '₹0', balance: '₹89,250', overdue: true },
    { party: 'Apex Civil Works', type: 'CONTRACTOR', billNo: 'ACW005', billDate: '2024-04-10', dueDate: '2024-04-20', amount: '₹14,04,000', paid: '₹0', balance: '₹14,04,000', overdue: false },
    { party: 'Skyline Electricals', type: 'CONTRACTOR', billNo: 'SERA-1', billDate: '2024-04-15', dueDate: '2024-04-25', amount: '₹4,09,500', paid: '₹0', balance: '₹4,09,500', overdue: false },
];

// ────────── FormField ──────────
const FormField = ({ label, placeholder, isUrl = false }: { label: string; placeholder?: string; isUrl?: boolean }) => (
    <View className="mb-3 flex-1">
        <Text className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</Text>
        <View className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
            {isUrl && <Link size={12} color="#9CA3AF" />}
            <TextInput
                placeholder={isUrl ? 'https://...' : (placeholder || (label.toLowerCase().includes('date') ? 'dd-mm-yyyy' : '0'))}
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-xs text-gray-700 ml-1"
            />
        </View>
    </View>
);

const FormDropdown = ({ label, placeholder }: { label: string; placeholder: string }) => (
    <View className="mb-3 flex-1">
        <Text className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</Text>
        <View className="flex-row items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
            <Text className="text-xs text-gray-400">{placeholder}</Text>
            <Text className="text-gray-400 text-xs">▼</Text>
        </View>
    </View>
);

// ────────── Main Screen ──────────
export function PayablesScreen() {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const isTablet = width >= 600;

    const [mainTab, setMainTab] = useState<MainTab>('Dashboard');
    const [vendorSubTab, setVendorSubTab] = useState<VendorSubTab>('Create Vendor Bill');

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            {/* ── Blue Header ── */}
            <View className="px-4 pt-14 pb-3 bg-blue-600">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1 mr-2">
                        <TouchableOpacity
                            onPress={() => (navigation as any).openDrawer()}
                            className="p-2 -ml-2 mr-3 bg-white/10 rounded-full"
                        >
                            <Menu size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text className="text-sm font-bold text-white flex-shrink" numberOfLines={1}>
                            Payables (Vendors / Contractors)
                        </Text>
                    </View>
                    <View className="w-7 h-7 bg-white/20 rounded-full items-center justify-center">
                        <Text className="text-white text-xs font-bold">A</Text>
                    </View>
                </View>
                <Text className="text-[10px] text-blue-100 mt-0.5">Accountant &gt; Payables</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4">

                    {/* ── Title + Action Buttons ── */}
                    <View className="mb-4">
                        <View className="mb-3">
                            <Text className="text-lg font-bold text-gray-900">Payables</Text>
                            <Text className="text-xs text-gray-500 mt-0.5">Manage vendor bills, contractor payments, and outstanding liabilities.</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="flex-row items-center gap-2">
                                <TouchableOpacity className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-lg">
                                    <Upload size={13} color="#6B7280" />
                                    <Text className="ml-1.5 text-xs font-medium text-gray-700">Import</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-lg">
                                    <Download size={13} color="#6B7280" />
                                    <Text className="ml-1.5 text-xs font-medium text-gray-700">Export</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-row items-center px-3 py-2 bg-blue-600 rounded-lg shadow-sm">
                                    <Plus size={13} color="#FFFFFF" />
                                    <Text className="ml-1.5 text-xs font-bold text-white">New Payable</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>

                    {/* ── Main Tabs ── */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-1">
                        <View className="flex-row bg-white border border-gray-200 rounded-xl overflow-hidden">
                            {(['Dashboard', 'Vendor Bills', 'Outstanding', 'Payment Requests'] as MainTab[]).map((tab) => (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => setMainTab(tab)}
                                    className={`px-4 py-2.5 ${mainTab === tab ? 'bg-blue-50 border-b-2 border-blue-600' : ''}`}
                                >
                                    <Text className={`text-xs font-semibold ${mainTab === tab ? 'text-blue-600' : 'text-gray-600'}`}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Breadcrumb */}
                    <View className="flex-row items-center mb-4 mt-2">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase">PAYABLES</Text>
                        <Text className="text-[10px] text-gray-300 mx-1">/</Text>
                        <Text className="text-[10px] font-bold text-blue-500 uppercase">{mainTab.toUpperCase()}</Text>
                    </View>

                    {/* ══════════════════════════════════════
                        DASHBOARD TAB
                    ══════════════════════════════════════ */}
                    {mainTab === 'Dashboard' && (
                        <View>
                            {/* Stat Cards — stack vertically on mobile, row on tablet */}
                            <View className={`mb-5 ${isTablet ? 'flex-row gap-3' : 'gap-3'}`}>
                                {[
                                    { label: 'TOTAL OUTSTANDING', value: '₹ 0', emoji: '₹', bg: 'bg-red-100', color: 'text-red-500' },
                                    { label: 'PENDING APPROVALS', value: '0', emoji: '⏳', bg: 'bg-yellow-100', color: 'text-yellow-500' },
                                    { label: 'TOTAL PAID (THIS MONTH)', value: '₹ 0', emoji: '✓', bg: 'bg-green-100', color: 'text-green-500' },
                                ].map((card, i) => (
                                    <View key={i} className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex-row items-center justify-between ${isTablet ? 'flex-1' : 'mb-1'}`}>
                                        <View>
                                            <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">{card.label}</Text>
                                            <Text className="text-2xl font-bold text-gray-800">{card.value}</Text>
                                        </View>
                                        <View className={`w-10 h-10 ${card.bg} rounded-full items-center justify-center`}>
                                            <Text className={`${card.color} text-base`}>{card.emoji}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            {/* Date Range Filter */}
                            <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
                                <Text className="text-sm font-bold text-gray-800 mb-4">Payables By Date Range</Text>
                                <View className={`${isTablet ? 'flex-row gap-3 items-end' : 'gap-3'}`}>
                                    <View className={isTablet ? 'flex-1' : 'mb-3'}>
                                        <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">START DATE</Text>
                                        <View className="border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
                                            <TextInput placeholder="dd-mm-yyyy" placeholderTextColor="#9CA3AF" className="text-xs text-gray-700" />
                                        </View>
                                    </View>
                                    <View className={isTablet ? 'flex-1' : 'mb-3'}>
                                        <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">END DATE</Text>
                                        <View className="border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
                                            <TextInput placeholder="dd-mm-yyyy" placeholderTextColor="#9CA3AF" className="text-xs text-gray-700" />
                                        </View>
                                    </View>
                                    <TouchableOpacity className={`px-5 py-2.5 bg-blue-600 rounded-lg ${!isTablet ? 'self-start' : ''}`}>
                                        <Text className="text-xs font-bold text-white">Search</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="mt-6 py-4 items-center">
                                    <Text className="text-xs text-gray-400 italic text-center">
                                        No payables found in this date range. Select dates and search.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* ══════════════════════════════════════
                        VENDOR BILLS TAB
                    ══════════════════════════════════════ */}
                    {mainTab === 'Vendor Bills' && (
                        <View>
                            {/* Sub-tabs (scrollable) */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                                <View className="flex-row gap-2">
                                    {(['Create Vendor Bill', 'Vendor List', 'Vendor Approval', 'Vendor Payment'] as VendorSubTab[]).map((sub) => (
                                        <TouchableOpacity
                                            key={sub}
                                            onPress={() => setVendorSubTab(sub)}
                                            className={`px-3 py-2 rounded-lg border ${vendorSubTab === sub ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
                                        >
                                            <Text className={`text-xs font-semibold ${vendorSubTab === sub ? 'text-white' : 'text-gray-600'}`}>{sub}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>

                            {/* Search bar */}
                            <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2 mb-4">
                                <Search size={13} color="#9CA3AF" />
                                <TextInput
                                    placeholder="Search bills, vendors, projects..."
                                    placeholderTextColor="#9CA3AF"
                                    className="ml-1.5 text-xs text-gray-700 flex-1"
                                />
                            </View>

                            {/* Sub-tab breadcrumb */}
                            <View className="flex-row items-center mb-4">
                                <Text className="text-[10px] font-bold text-gray-400 uppercase">PAYABLES</Text>
                                <Text className="text-[10px] text-gray-300 mx-1">/</Text>
                                <Text className="text-[10px] font-bold text-blue-500 uppercase">VENDOR BILLS</Text>
                            </View>

                            {/* ── Create Vendor Bill ── */}
                            {vendorSubTab === 'Create Vendor Bill' && (
                                <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                    {/* Form Header */}
                                    <View className="mb-5">
                                        <View className="flex-row items-center justify-between flex-wrap gap-2 mb-1">
                                            <Text className="text-sm font-bold text-gray-800">
                                                Create Vendor <Text className="text-blue-600">Bill</Text>
                                            </Text>
                                            <View className="flex-row gap-2">
                                                <TouchableOpacity className="px-3 py-2 border border-gray-200 rounded-lg">
                                                    <Text className="text-xs font-medium text-gray-600">Cancel</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity className="px-3 py-2 bg-blue-600 rounded-lg">
                                                    <Text className="text-xs font-bold text-white">Save Vendor Bill</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Dropdowns: stack on mobile, row on tablet */}
                                    <View className={isTablet ? 'flex-row gap-3' : ''}>
                                        <FormDropdown label="SUPPLIES" placeholder="Select Supplier..." />
                                        {isTablet && <View className="w-3" />}
                                        <FormDropdown label="PROJECT" placeholder="Select Project..." />
                                        {isTablet && <View className="w-3" />}
                                        <FormDropdown label="PURCHASE ORDER" placeholder="Select PO..." />
                                    </View>

                                    {/* Row fields: 2 per row on mobile, 3 on tablet */}
                                    {[
                                        [
                                            { label: 'BILL NUMBER', placeholder: 'String' },
                                            { label: 'BILL DATE', placeholder: 'dd-mm-yyyy' },
                                            { label: 'DUE DATE', placeholder: 'dd-mm-yyyy' },
                                        ],
                                        [
                                            { label: 'GRN NUMBER', placeholder: 'String' },
                                            { label: 'GROSS AMOUNT' },
                                            { label: 'GST PERCENT' },
                                        ],
                                        [
                                            { label: 'GST AMOUNT' },
                                            { label: 'TDS PERCENT' },
                                            { label: 'TDS AMOUNT' },
                                        ],
                                        [
                                            { label: 'ADVANCE PAID' },
                                            { label: 'TOTAL AMOUNT' },
                                            { label: 'VENDOR INVOICE URL', isUrl: true },
                                        ],
                                    ].map((row, ri) => (
                                        <View key={ri} className={isTablet ? 'flex-row gap-3' : ''}>
                                            {row.map((field, fi) => (
                                                <FormField key={fi} label={field.label} placeholder={(field as any).placeholder} isUrl={(field as any).isUrl} />
                                            ))}
                                        </View>
                                    ))}

                                    {/* URL fields */}
                                    <View className={isTablet ? 'flex-row gap-3' : ''}>
                                        <FormField label="PO COPY URL" isUrl={true} />
                                        {isTablet && <View className="w-3" />}
                                        <FormField label="GRN COPY URL" isUrl={true} />
                                        {isTablet && <View className="w-3" />}
                                        <FormField label="SUPPORTING DOCS URL" isUrl={true} />
                                    </View>

                                    <View className={isTablet ? 'flex-row gap-3' : ''}>
                                        <FormField label="PARTY GSTIN" placeholder="String" />
                                        {isTablet && <View className="w-3" />}
                                        <FormField label="COST" />
                                        {isTablet && <View className="w-3" />}
                                        <FormField label="SGST" />
                                    </View>

                                    <View className={isTablet ? 'flex-row gap-3' : ''}>
                                        <FormField label="IGST" />
                                        {isTablet && <View className="w-3" />}
                                        <FormField label="GST DOCUMENT URL" isUrl={true} />
                                        {isTablet && <View className="flex-1" />}
                                    </View>

                                    {/* Bill Items */}
                                    <View className="border-t border-gray-100 mt-2 pt-4">
                                        <View className="flex-row items-center justify-between mb-3">
                                            <View>
                                                <Text className="text-sm font-bold text-gray-800">Bill Items</Text>
                                                <Text className="text-[10px] text-gray-400">Add line items for this bill</Text>
                                            </View>
                                            <TouchableOpacity className="flex-row items-center px-3 py-1.5 border border-blue-600 rounded-lg">
                                                <Plus size={12} color="#2563EB" />
                                                <Text className="ml-1 text-xs font-bold text-blue-600">Add Item</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/* Bill item row header */}
                                        <View className="flex-row gap-1 px-2 py-1.5 bg-gray-50 rounded-t-lg border border-gray-200 border-b-0">
                                            <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase">ITEM NAME</Text>
                                            <Text className="w-16 text-[9px] font-bold text-gray-400 uppercase">HSN/SAC</Text>
                                            <Text className="w-10 text-[9px] font-bold text-gray-400 uppercase">QTY</Text>
                                            <Text className="w-14 text-[9px] font-bold text-gray-400 uppercase">RATE</Text>
                                            <Text className="w-16 text-[9px] font-bold text-gray-400 uppercase text-right">AMOUNT</Text>
                                        </View>
                                        <View className="flex-row gap-1 px-2 py-2 border border-gray-200 rounded-b-lg bg-white">
                                            <TextInput placeholder="Item description" placeholderTextColor="#9CA3AF" className="flex-1 text-xs text-gray-700 border border-gray-100 rounded px-2 py-1.5 bg-gray-50" />
                                            <TextInput placeholder="Code" placeholderTextColor="#9CA3AF" className="w-16 text-xs text-gray-700 border border-gray-100 rounded px-2 py-1.5 bg-gray-50" />
                                            <TextInput placeholder="0" placeholderTextColor="#9CA3AF" className="w-10 text-xs text-gray-700 border border-gray-100 rounded px-2 py-1.5 bg-gray-50" />
                                            <TextInput placeholder="0" placeholderTextColor="#9CA3AF" className="w-14 text-xs text-gray-700 border border-gray-100 rounded px-2 py-1.5 bg-gray-50" />
                                            <View className="w-16 items-end justify-center">
                                                <Text className="text-xs font-semibold text-gray-600">₹0</Text>
                                            </View>
                                            <TouchableOpacity className="self-center ml-1 w-5 items-center">
                                                <Text className="text-red-400 text-base font-bold">×</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* ── Vendor List ── */}
                            {vendorSubTab === 'Vendor List' && (
                                <View>
                                    <Text className="text-sm font-bold text-gray-800 mb-1">Vendor List</Text>
                                    <Text className="text-xs text-gray-400 mb-4">Manage financial supplier bills in detailed card view</Text>
                                    {VENDOR_LIST.map((vendor) => (
                                        <View key={vendor.id} className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 overflow-hidden">
                                            {/* Card Header */}
                                            <View className="p-4 border-b border-gray-100 flex-row items-start justify-between">
                                                <View>
                                                    <Text className="text-sm font-bold text-gray-800">{vendor.name}</Text>
                                                    <Text className="text-xs text-blue-500 mt-0.5">{vendor.code}</Text>
                                                </View>
                                                <View className="flex-row items-center gap-2">
                                                    <View className="px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                                                        <Text className="text-[10px] font-bold text-red-500">{vendor.status}</Text>
                                                    </View>
                                                    <TouchableOpacity><Edit2 size={14} color="#9CA3AF" /></TouchableOpacity>
                                                </View>
                                            </View>

                                            {/* Card Body */}
                                            <View className="p-4">
                                                {/* Info Grid */}
                                                <View className={`mb-4 ${isTablet ? 'flex-row flex-wrap gap-x-6' : ''}`}>
                                                    {[
                                                        { label: 'PROJECT', value: vendor.project },
                                                        { label: 'PO NUMBER', value: vendor.poNumber },
                                                        { label: 'BILL DATE', value: vendor.billDate },
                                                        { label: 'DUE DATE', value: vendor.dueDate },
                                                    ].map((info, i) => (
                                                        <View key={i} className={isTablet ? 'mb-2' : 'flex-row items-center justify-between py-1.5 border-b border-gray-50'}>
                                                            <Text className="text-[9px] font-bold text-gray-400 uppercase">{info.label}</Text>
                                                            <Text className="text-xs font-semibold text-gray-700">{info.value}</Text>
                                                        </View>
                                                    ))}
                                                </View>

                                                {/* Amount Grid */}
                                                <View className={`mb-4 p-3 bg-blue-50/50 rounded-xl ${isTablet ? 'flex-row flex-wrap gap-x-8' : ''}`}>
                                                    {[
                                                        { label: 'GROSS AMOUNT', value: vendor.grossAmount, color: 'text-gray-800' },
                                                        { label: 'GST AMOUNT', value: vendor.gstAmount, color: 'text-gray-800' },
                                                        { label: 'TDS AMOUNT', value: vendor.tdsAmount, color: 'text-gray-800' },
                                                        { label: 'TOTAL PAYABLE', value: vendor.totalPayable, color: 'text-blue-600' },
                                                    ].map((amt, i) => (
                                                        <View key={i} className={isTablet ? 'mb-2' : 'flex-row items-center justify-between py-1.5'}>
                                                            <Text className="text-[9px] font-bold text-gray-400 uppercase">{amt.label}</Text>
                                                            <Text className={`text-sm font-bold ${amt.color}`}>{amt.value}</Text>
                                                        </View>
                                                    ))}
                                                </View>

                                                {/* Bill Items */}
                                                <Text className="text-[9px] font-bold text-gray-500 uppercase mb-2">
                                                    BILL ITEMS {vendor.billItems.length}
                                                </Text>
                                                {vendor.billItems.map((item, i) => (
                                                    <View key={i} className="flex-row items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 mb-2">
                                                        <View>
                                                            <Text className="text-xs font-bold text-blue-600">{item.name}</Text>
                                                            <Text className="text-[10px] text-gray-400">{item.qty}</Text>
                                                        </View>
                                                        <Text className="text-xs font-bold text-gray-700">{item.amount}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* ── Stubs ── */}
                            {(vendorSubTab === 'Vendor Approval' || vendorSubTab === 'Vendor Payment') && (
                                <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 items-center">
                                    <Text className="text-sm font-bold text-gray-600">{vendorSubTab}</Text>
                                    <Text className="text-xs text-gray-400 mt-2">No records found.</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* ══════════════════════════════════════
                        OUTSTANDING TAB
                    ══════════════════════════════════════ */}
                    {mainTab === 'Outstanding' && (
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <View className="p-4 border-b border-gray-50">
                                <Text className="text-sm font-bold text-gray-800">Outstanding Payables</Text>
                                <Text className="text-xs text-gray-400 mt-0.5">All pending vendor and contractor bills</Text>
                            </View>

                            {/* Mobile Card View */}
                            {!isTablet ? (
                                <View className="p-3">
                                    {OUTSTANDING_LIST.map((row, index) => (
                                        <View key={index} className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100">
                                            <View className="flex-row items-start justify-between mb-3">
                                                <View>
                                                    <Text className="text-sm font-bold text-gray-800">{row.party}</Text>
                                                    <Text className="text-xs text-blue-500 mt-0.5 font-mono">{row.billNo}</Text>
                                                </View>
                                                <View className={`px-2 py-0.5 rounded-full border ${row.type === 'VENDOR' ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'}`}>
                                                    <Text className={`text-[9px] font-bold ${row.type === 'VENDOR' ? 'text-blue-600' : 'text-purple-600'}`}>{row.type}</Text>
                                                </View>
                                            </View>
                                            <View className="flex-row flex-wrap gap-x-4 gap-y-2">
                                                <View>
                                                    <Text className="text-[9px] font-bold text-gray-400 uppercase">BILL DATE</Text>
                                                    <Text className="text-xs text-gray-700">{row.billDate}</Text>
                                                </View>
                                                <View>
                                                    <Text className="text-[9px] font-bold text-gray-400 uppercase">DUE DATE</Text>
                                                    <Text className={`text-xs font-medium ${row.overdue ? 'text-red-500' : 'text-gray-700'}`}>{row.dueDate}</Text>
                                                </View>
                                                <View>
                                                    <Text className="text-[9px] font-bold text-gray-400 uppercase">AMOUNT</Text>
                                                    <Text className="text-xs font-semibold text-gray-800">{row.amount}</Text>
                                                </View>
                                                <View>
                                                    <Text className="text-[9px] font-bold text-gray-400 uppercase">PAID</Text>
                                                    <Text className="text-xs text-blue-500">{row.paid}</Text>
                                                </View>
                                                <View>
                                                    <Text className="text-[9px] font-bold text-gray-400 uppercase">BALANCE</Text>
                                                    <Text className="text-xs font-bold text-red-500">{row.balance}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                /* Tablet/Desktop Table View */
                                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                    <View>
                                        <View className="flex-row items-center px-4 py-3 bg-gray-50/60 border-b border-gray-100">
                                            <Text className="w-36 text-[9px] font-bold text-gray-400 uppercase tracking-wider">PARTY NAME</Text>
                                            <Text className="w-28 text-[9px] font-bold text-gray-400 uppercase tracking-wider">TYPE</Text>
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">BILL NO</Text>
                                            <Text className="w-28 text-[9px] font-bold text-gray-400 uppercase tracking-wider">BILL DATE</Text>
                                            <Text className="w-28 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DUE DATE</Text>
                                            <Text className="w-28 text-[9px] font-bold text-gray-400 uppercase tracking-wider">AMOUNT</Text>
                                            <Text className="w-28 text-[9px] font-bold text-gray-400 uppercase tracking-wider">PAID</Text>
                                            <Text className="w-28 text-[9px] font-bold text-gray-400 uppercase tracking-wider">BALANCE</Text>
                                        </View>
                                        {OUTSTANDING_LIST.map((row, index) => (
                                            <View key={index} className={`flex-row items-center px-4 py-3.5 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}>
                                                <Text className="w-36 text-xs font-semibold text-gray-800">{row.party}</Text>
                                                <View className="w-28">
                                                    <View className={`px-2 py-0.5 rounded self-start ${row.type === 'VENDOR' ? 'bg-blue-50 border border-blue-200' : 'bg-purple-50 border border-purple-200'}`}>
                                                        <Text className={`text-[9px] font-bold ${row.type === 'VENDOR' ? 'text-blue-600' : 'text-purple-600'}`}>{row.type}</Text>
                                                    </View>
                                                </View>
                                                <Text className="w-32 text-xs font-medium text-blue-500">{row.billNo}</Text>
                                                <Text className="w-28 text-xs text-gray-600">{row.billDate}</Text>
                                                <Text className={`w-28 text-xs font-medium ${row.overdue ? 'text-red-500' : 'text-gray-600'}`}>{row.dueDate}</Text>
                                                <Text className="w-28 text-xs font-semibold text-gray-800">{row.amount}</Text>
                                                <Text className="w-28 text-xs font-medium text-blue-500">{row.paid}</Text>
                                                <Text className="w-28 text-xs font-bold text-red-500">{row.balance}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                            )}
                        </View>
                    )}

                    {/* ══════════════════════════════════════
                        PAYMENT REQUESTS TAB
                    ══════════════════════════════════════ */}
                    {mainTab === 'Payment Requests' && (
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 items-center">
                            <Text className="text-sm font-bold text-gray-600">Payment Requests</Text>
                            <Text className="text-xs text-gray-400 mt-2">No payment requests found.</Text>
                        </View>
                    )}

                </View>
                <View className="h-12" />
            </ScrollView>
        </View>
    );
}
