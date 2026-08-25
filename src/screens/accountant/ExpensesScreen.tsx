import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Upload, Download, Plus, Eye, Edit2, Trash2, Search, FileText, BarChart2 } from 'lucide-react-native';

// ─── Types ───
type MainTab = 'Dashboard' | 'Expense Entry' | 'BOQ Comparison';
type ExpenseSubTab = 'Expense List' | 'Project Expenses' | 'Expense Ledger';

// ─── Mock Data ───
const EXPENSE_STATS = [
    { label: 'TOTAL EXPENSE', value: '₹6,13,083.49', highlight: true },
    { label: 'MONTHLY EXPENSE', value: '₹12,373.49', highlight: false },
    { label: 'PROJECT EXPENSE', value: '₹6,13,083.49', highlight: false },
    { label: 'DIRECT EXPENSE', value: '₹4,90,466.79', highlight: false },
    { label: 'INDIRECT EXPENSE', value: '₹1,22,616.90', highlight: false },
    { label: 'PENDING APPRVL', value: '0', highlight: false },
];

const CATEGORY_DATA = [
    { name: 'Construction', amount: '₹500', percent: '0.1%', color: '#EF4444' },
    { name: 'Construction', amount: '₹410', percent: '0.1%', color: '#3B82F6' },
    { name: 'Contractor', amount: '₹100', percent: '0.0%', color: '#F59E0B' },
    { name: 'equipment', amount: '₹2,000', percent: '0.0%', color: '#10B981' },
    { name: 'Fuel', amount: '₹2,000', percent: '0.3%', color: '#6366F1' },
    { name: 'Labour', amount: '₹3,363.6', percent: '0.6%', color: '#EC4899' },
    { name: 'Labour Advance', amount: '₹10', percent: '0.0%', color: '#8B5CF6' },
    { name: 'Maintenance', amount: '₹2,000', percent: '0.3%', color: '#F97316' },
    { name: 'Material', amount: '₹6,01,700', percent: '98.1%', color: '#F59E0B' },
    { name: 'Travel', amount: '₹999.89', percent: '0.2%', color: '#14B8A6' },
];

const EXPENSE_LIST = [
    { no: 'EXP-44', date: '2026-08-19', category: 'Labour', catColor: '#3B82F6', project: 'Sara City', description: 'Labour expense - 2026-08-19', amount: '₹571.62', paymentMode: 'auto', boqItem: '-' },
    { no: 'EXP-43', date: '2026-08-17', category: 'Labour', catColor: '#3B82F6', project: 'Sara City', description: 'Labour expense - 2026-08-17', amount: '₹727.81', paymentMode: 'auto', boqItem: '-' },
    { no: 'EXP-40', date: '2026-08-14', category: 'Travel', catColor: '#F97316', project: 'Sara City', description: 'Trip/Stay/Stay/Trip/Trial', amount: '₹999.99', paymentMode: 'Cheque', boqItem: 'Sand & Cement' },
    { no: 'EXP-39', date: '2026-08-14', category: 'Maintenance', catColor: '#6366F1', project: 'Rohan Harita', description: 'new maintenance entry', amount: '₹2,000', paymentMode: 'Cheque', boqItem: 'Sand & Cement' },
    { no: 'EXP-38', date: '2026-08-14', category: 'Fuel', catColor: '#14B8A6', project: 'Rohan Harita', description: 'G F0S6HT0000', amount: '₹1,000', paymentMode: 'Online', boqItem: 'Sand & Cement' },
    { no: 'EXP-37', date: '2026-08-14', category: 'Fuel', catColor: '#14B8A6', project: 'Rohan Harita', description: 'G F0S6HT0000', amount: '₹1,000', paymentMode: 'Online', boqItem: 'Sand & Cement' },
    { no: 'EXP-36', date: '2026-08-14', category: 'Material', catColor: '#10B981', project: 'Sara City', description: 'qwcrdeactFV', amount: '₹1,000', paymentMode: 'Cash', boqItem: 'Civil Work' },
    { no: 'EXP-35', date: '2026-08-12', category: 'Labour', catColor: '#3B82F6', project: 'Sara City', description: 'Labour expense - 2026-08-12', amount: '₹228.44', paymentMode: 'auto', boqItem: '-' },
    { no: 'EXP-34', date: '2026-08-12', category: 'equipment', catColor: '#F59E0B', project: 'Sara City', description: 'equipment expense', amount: '₹1,000', paymentMode: 'online', boqItem: '0' },
    { no: 'EXP-33', date: '2026-08-12', category: 'equipment', catColor: '#F59E0B', project: 'Sara City', description: 'equipment expense', amount: '₹1,000', paymentMode: 'cash', boqItem: '0' },
];

const PROJECTS = [
    { name: 'Rohan Harita', total: '₹6,04,007.88', selected: true, allocations: [
        { label: 'Material Cost', amount: '₹3,02,003.94', color: '#3B82F6' },
        { label: 'Labor Cost', amount: '₹1,81,202.364', color: '#F97316' },
        { label: 'Equipment Cost', amount: '₹60,400.768', color: '#6366F1' },
        { label: 'Other Expense', amount: '₹60,400.768', color: '#10B981' },
    ]},
    { name: 'Sara City', total: '₹9,075.61', selected: false, allocations: [] },
];

const RECENT_ALLOCATIONS = [
    { project: 'Sara City', category: 'Labour', amount: '₹571.62', date: '2026-08-19', center: 'Main' },
    { project: 'Sara City', category: 'Labour', amount: '₹727.81', date: '2026-08-17', center: 'Main' },
    { project: 'Sara City', category: 'Travel', amount: '₹999.89', date: '2026-08-14', center: 'Main' },
    { project: 'Rohan Harita', category: 'Maintenance', amount: '₹2,000', date: '2026-08-14', center: 'Main' },
    { project: 'Rohan Harita', category: 'Fuel', amount: '₹1,000', date: '2026-08-14', center: 'Main' },
];

const LEDGER_ENTRIES = [
    { date: '2026-08-25', particulars: 'Staff Salary Payment for 8', debit: '₹4,000', credit: '-', balance: '₹4,000' },
    { date: '2026-08-25', particulars: 'Staff Salary Payment for 2026-08', debit: '₹9,350', credit: '-', balance: '₹13,200' },
    { date: '2026-08-25', particulars: 'Staff Salary Payment for 7', debit: '₹100', credit: '-', balance: '₹14,200' },
    { date: '2026-08-25', particulars: 'Staff Salary Payment for 2026-07', debit: '₹17,500', credit: '-', balance: '₹81,700' },
    { date: '2026-07-16', particulars: 'Labour Wages 2026-07-16', debit: '₹500', credit: '-', balance: '₹82,200' },
    { date: '2026-07-21', particulars: 'Steel Purchase', debit: '₹100', credit: '-', balance: '₹82,400' },
    { date: '2026-07-21', particulars: 'Steel Purchase', debit: '₹10,000', credit: '-', balance: '₹72,400' },
    { date: '2026-07-21', particulars: 'Steel Purchase', debit: '₹10,000', credit: '-', balance: '₹82,400' },
    { date: '2026-07-22', particulars: 'metro community', debit: '₹10,00', credit: '-', balance: '₹83,400' },
    { date: '2026-07-27', particulars: 'iam Expenses', debit: '₹500', credit: '-', balance: '₹83,900' },
];

const BOQ_ITEMS = [
    { item: 'cleaning material', estimated: '₹10,050', actual: '₹3,610', variance: '₹6,190' },
    { item: 'ctil rod', estimated: '₹1,00,000', actual: '₹250', variance: '₹99,750' },
    { item: 'ctil rod', estimated: '₹4,000', actual: '₹1,000', variance: '₹3,000' },
    { item: 'jhfdkndfrjp', estimated: '₹1,000', actual: '₹0', variance: '₹1,000' },
    { item: 'Plumbing', estimated: '₹10,000', actual: '₹100', variance: '₹9,900' },
    { item: 'sand bags', estimated: '₹10,000', actual: '₹1,000', variance: '₹9,000' },
    { item: 'pue45jbufbjugjh', estimated: '₹1,000', actual: '₹0', variance: '₹1,000' },
    { item: 'Concrete Pouring Work', estimated: '₹100', actual: '₹0', variance: '₹100' },
    { item: 'Plumbing', estimated: '₹10,000', actual: '₹0', variance: '₹10,000' },
    { item: 'sand material', estimated: '₹20,000', actual: '₹30,000', variance: '-₹10,000' },
];

export function ExpensesScreen() {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const isTablet = width >= 600;

    const [mainTab, setMainTab] = useState<MainTab>('Dashboard');
    const [expenseSubTab, setExpenseSubTab] = useState<ExpenseSubTab>('Expense List');
    const [selectedProject, setSelectedProject] = useState('Rohan Harita');

    const activeProject = PROJECTS.find(p => p.name === selectedProject) || PROJECTS[0];

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            {/* ── Blue Header ── */}
            <View className="px-4 pt-14 pb-3 bg-blue-600">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1 mr-2">
                        <TouchableOpacity onPress={() => (navigation as any).openDrawer()} className="p-2 -ml-2 mr-3 bg-white/10 rounded-full">
                            <Menu size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text className="text-base font-bold text-white" numberOfLines={1}>Expenses</Text>
                    </View>
                    <View className="w-7 h-7 bg-white/20 rounded-full items-center justify-center">
                        <Text className="text-white text-xs font-bold">A</Text>
                    </View>
                </View>
                <Text className="text-[10px] text-blue-100 mt-0.5">Accountant &gt; Expenses</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4">

                    {/* ── Title + Action Buttons ── */}
                    <View className="mb-4">
                        <Text className="text-lg font-bold text-gray-900">Expenses</Text>
                        <Text className="text-xs text-gray-500 mt-0.5 mb-3">Manage and track your expense records, ledgers, and BOQ comparisons.</Text>

                        {mainTab !== 'Dashboard' && (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View className="flex-row items-center gap-2">
                                    <TouchableOpacity className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-lg">
                                        <FileText size={13} color="#6B7280" />
                                        <Text className="ml-1.5 text-xs font-medium text-gray-700">Template</Text>
                                    </TouchableOpacity>
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
                                        <Text className="ml-1.5 text-xs font-bold text-white">Create Expense</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )}
                    </View>

                    {/* ── Main Tabs ── */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                        <View className="flex-row bg-white border border-gray-200 rounded-xl overflow-hidden">
                            {(['Dashboard', 'Expense Entry', 'BOQ Comparison'] as MainTab[]).map((tab) => (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => setMainTab(tab)}
                                    className={`px-5 py-2.5 ${mainTab === tab ? 'bg-blue-50 border-b-2 border-blue-600' : ''}`}
                                >
                                    <Text className={`text-xs font-semibold ${mainTab === tab ? 'text-blue-600' : 'text-gray-600'}`}>{tab}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* ══════════════════════════════════════
                        DASHBOARD TAB
                    ══════════════════════════════════════ */}
                    {mainTab === 'Dashboard' && (
                        <View>
                            {/* Stat Cards — horizontal scroll on mobile */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
                                <View className="flex-row gap-3 pr-4">
                                    {EXPENSE_STATS.map((stat, i) => (
                                        <View key={i} className={`bg-white rounded-xl border shadow-sm p-4 w-44 ${stat.highlight ? 'border-red-400 border-2' : 'border-gray-100'}`}>
                                            <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">{stat.label}</Text>
                                            <Text className={`text-lg font-bold ${stat.highlight ? 'text-red-500' : 'text-gray-800'}`}>{stat.value}</Text>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>

                            {/* Two panels */}
                            <View className={isTablet ? 'flex-row gap-4' : 'gap-4'}>
                                {/* Expense Trend */}
                                <View className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${isTablet ? 'flex-1' : ''}`}>
                                    <View className="px-4 py-3 border-b border-gray-50">
                                        <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">EXPENSE TREND</Text>
                                    </View>
                                    <View className="h-48 items-center justify-center">
                                        <BarChart2 size={32} color="#E5E7EB" />
                                        <Text className="text-xs text-gray-400 mt-2 italic">No trend data available</Text>
                                    </View>
                                </View>

                                {/* Category-Wise Donut */}
                                <View className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${isTablet ? 'flex-1' : ''}`}>
                                    <View className="px-4 py-3 border-b border-gray-50">
                                        <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">CATEGORY-WISE</Text>
                                    </View>
                                    <View className="p-4">
                                        {/* Mock donut chart */}
                                        <View className="items-center mb-4">
                                            <View className="w-28 h-28 rounded-full border-[14px] border-yellow-400 items-center justify-center" style={{ borderLeftColor: '#EF4444', borderTopColor: '#EF4444' }}>
                                                <View className="items-center">
                                                    <Text className="text-base font-bold text-gray-800">98.1%</Text>
                                                    <Text className="text-[10px] text-gray-500 font-medium">MATERIAL</Text>
                                                </View>
                                            </View>
                                        </View>
                                        {/* Legend */}
                                        {CATEGORY_DATA.map((cat, i) => (
                                            <View key={i} className="flex-row items-center justify-between py-1 border-b border-gray-50">
                                                <View className="flex-row items-center flex-1">
                                                    <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: cat.color }} />
                                                    <Text className="text-[11px] text-gray-700">{cat.name}</Text>
                                                </View>
                                                <Text className="text-[11px] font-semibold text-gray-700 w-24 text-right">{cat.amount}</Text>
                                                <View className="w-12 items-end">
                                                    <View className="bg-gray-100 px-1.5 py-0.5 rounded">
                                                        <Text className="text-[9px] text-gray-500 font-bold">{cat.percent}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* ══════════════════════════════════════
                        EXPENSE ENTRY TAB
                    ══════════════════════════════════════ */}
                    {mainTab === 'Expense Entry' && (
                        <View>
                            {/* Sub-tabs */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                                <View className="flex-row bg-white border border-gray-200 rounded-xl overflow-hidden">
                                    {(['Expense List', 'Project Expenses', 'Expense Ledger'] as ExpenseSubTab[]).map((sub) => (
                                        <TouchableOpacity
                                            key={sub}
                                            onPress={() => setExpenseSubTab(sub)}
                                            className={`px-4 py-2.5 ${expenseSubTab === sub ? 'bg-blue-50 border-b-2 border-blue-600' : ''}`}
                                        >
                                            <Text className={`text-xs font-semibold ${expenseSubTab === sub ? 'text-blue-600' : 'text-gray-600'}`}>{sub}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>

                            {/* ── Expense List ── */}
                            {expenseSubTab === 'Expense List' && (
                                <View>
                                    <Text className="text-sm font-bold text-gray-800 mb-3">All Expense Entrys</Text>

                                    {/* Filters */}
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                                        <View className="flex-row gap-2 items-center">
                                            <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2 w-44">
                                                <Search size={12} color="#9CA3AF" />
                                                <TextInput placeholder="Search expense..." placeholderTextColor="#9CA3AF" className="ml-1 text-xs text-gray-700 flex-1" />
                                            </View>
                                            {['All Projects', 'All Categories', 'All Payment Modes'].map((f) => (
                                                <View key={f} className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-1">
                                                    <Text className="text-xs text-gray-600">{f}</Text>
                                                    <Text className="text-gray-400 text-xs">▼</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </ScrollView>

                                    {/* Mobile: Card view / Tablet: Table */}
                                    {!isTablet ? (
                                        <View>
                                            {EXPENSE_LIST.map((row, i) => (
                                                <View key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3">
                                                    <View className="flex-row items-start justify-between mb-2">
                                                        <View>
                                                            <Text className="text-xs font-bold text-blue-500 font-mono">{row.no}</Text>
                                                            <Text className="text-[10px] text-gray-400 mt-0.5">{row.date}</Text>
                                                        </View>
                                                        <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: row.catColor + '20' }}>
                                                            <Text className="text-[10px] font-bold" style={{ color: row.catColor }}>{row.category}</Text>
                                                        </View>
                                                    </View>
                                                    <Text className="text-xs font-semibold text-gray-700 mb-1">{row.project}</Text>
                                                    <Text className="text-[11px] text-gray-500 mb-2" numberOfLines={1}>{row.description}</Text>
                                                    <View className="flex-row items-center justify-between">
                                                        <View>
                                                            <Text className="text-[9px] text-gray-400 uppercase">Payment Mode</Text>
                                                            <Text className="text-xs text-gray-600">{row.paymentMode}</Text>
                                                        </View>
                                                        <View>
                                                            <Text className="text-[9px] text-gray-400 uppercase">BOQ Item</Text>
                                                            <Text className="text-xs text-gray-600">{row.boqItem}</Text>
                                                        </View>
                                                        <Text className="text-sm font-bold text-red-500">{row.amount}</Text>
                                                    </View>
                                                    <View className="flex-row items-center justify-end gap-3 mt-2 pt-2 border-t border-gray-50">
                                                        <TouchableOpacity><Eye size={14} color="#9CA3AF" /></TouchableOpacity>
                                                        <TouchableOpacity><Edit2 size={14} color="#F59E0B" /></TouchableOpacity>
                                                        <TouchableOpacity><Trash2 size={14} color="#9CA3AF" /></TouchableOpacity>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    ) : (
                                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                                <View>
                                                    <View className="flex-row items-center px-4 py-3 bg-gray-50/60 border-b border-gray-100">
                                                        {['EXPENSE NO','DATE','CATEGORY','PROJECT','DESCRIPTION','AMOUNT','PAYMENT MODE','BOQ ITEM','ACTIONS'].map((h, hi) => (
                                                            <Text key={hi} className={`text-[9px] font-bold text-gray-400 uppercase tracking-wider ${hi === 4 ? 'w-44' : hi === 8 ? 'w-24' : 'w-28'}`}>{h}</Text>
                                                        ))}
                                                    </View>
                                                    {EXPENSE_LIST.map((row, i) => (
                                                        <View key={i} className={`flex-row items-center px-4 py-3 border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}>
                                                            <Text className="w-28 text-xs font-bold text-blue-500 font-mono">{row.no}</Text>
                                                            <Text className="w-28 text-xs text-gray-600">{row.date}</Text>
                                                            <View className="w-28">
                                                                <View className="px-2 py-0.5 rounded-full self-start" style={{ backgroundColor: row.catColor + '20' }}>
                                                                    <Text className="text-[10px] font-bold" style={{ color: row.catColor }}>{row.category}</Text>
                                                                </View>
                                                            </View>
                                                            <Text className="w-28 text-xs text-gray-700">{row.project}</Text>
                                                            <Text className="w-44 text-xs text-gray-500" numberOfLines={1}>{row.description}</Text>
                                                            <Text className="w-28 text-xs font-bold text-red-500">{row.amount}</Text>
                                                            <Text className="w-28 text-xs text-gray-600">{row.paymentMode}</Text>
                                                            <Text className="w-28 text-xs text-gray-500">{row.boqItem}</Text>
                                                            <View className="w-24 flex-row gap-2">
                                                                <TouchableOpacity><Eye size={13} color="#9CA3AF" /></TouchableOpacity>
                                                                <TouchableOpacity><Edit2 size={13} color="#F59E0B" /></TouchableOpacity>
                                                                <TouchableOpacity><Trash2 size={13} color="#9CA3AF" /></TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    ))}
                                                </View>
                                            </ScrollView>
                                        </View>
                                    )}
                                    <View className="flex-row items-center justify-between mt-3 px-1">
                                        <Text className="text-[10px] text-gray-400">Records per page: 10</Text>
                                        <Text className="text-[10px] text-gray-400">Showing 1-10 of 26 records</Text>
                                    </View>
                                </View>
                            )}

                            {/* ── Project Expenses ── */}
                            {expenseSubTab === 'Project Expenses' && (
                                <View>
                                    {/* Project Cards */}
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                                        <View className="flex-row gap-3">
                                            {PROJECTS.map((proj) => (
                                                <TouchableOpacity
                                                    key={proj.name}
                                                    onPress={() => setSelectedProject(proj.name)}
                                                    className={`bg-white rounded-xl border p-4 w-52 ${selectedProject === proj.name ? 'border-blue-500 border-2' : 'border-gray-200'}`}
                                                >
                                                    <View className="w-8 h-8 bg-blue-100 rounded-lg items-center justify-center mb-2">
                                                        <Text className="text-blue-600 text-sm font-bold">📁</Text>
                                                    </View>
                                                    <Text className="text-xs font-bold text-gray-800">{proj.name}</Text>
                                                    <Text className="text-[10px] text-gray-400 mt-0.5">Total Allocated: {proj.total}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </ScrollView>

                                    {/* Allocation Details */}
                                    <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
                                        <Text className="text-sm font-bold text-gray-800 mb-4">
                                            Allocation Details - <Text className="text-blue-600">{selectedProject}</Text>
                                        </Text>
                                        {activeProject.allocations.map((alloc, i) => (
                                            <View key={i} className="flex-row items-center justify-between py-2 border-b border-gray-50">
                                                <View className="flex-row items-center">
                                                    <View className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: alloc.color }} />
                                                    <Text className="text-xs text-gray-700">{alloc.label}</Text>
                                                </View>
                                                <Text className="text-xs font-bold text-gray-800">{alloc.amount}</Text>
                                            </View>
                                        ))}
                                        <View className="flex-row items-center justify-between pt-3 mt-1">
                                            <Text className="text-xs font-bold text-gray-700">Total Allocated</Text>
                                            <Text className="text-sm font-bold text-blue-600">{activeProject.total}</Text>
                                        </View>
                                    </View>

                                    {/* Recent Allocations */}
                                    <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                        <View className="p-4 border-b border-gray-50">
                                            <Text className="text-sm font-bold text-gray-800">Recent Allocations</Text>
                                            <Text className="text-[10px] text-gray-400 mt-0.5">Detailed breakdown of project cost allocations</Text>
                                        </View>
                                        {!isTablet ? (
                                            <View className="p-3">
                                                {RECENT_ALLOCATIONS.map((alloc, i) => (
                                                    <View key={i} className="flex-row items-center justify-between py-2.5 border-b border-gray-50">
                                                        <View>
                                                            <Text className="text-xs font-bold text-blue-500">{alloc.project}</Text>
                                                            <Text className="text-[10px] text-gray-500">{alloc.category} • {alloc.date}</Text>
                                                        </View>
                                                        <View className="items-end">
                                                            <Text className="text-xs font-bold text-gray-800">{alloc.amount}</Text>
                                                            <Text className="text-[10px] text-gray-400">{alloc.center}</Text>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        ) : (
                                            <View>
                                                <View className="flex-row items-center px-4 py-3 bg-gray-50/60 border-b border-gray-100">
                                                    {['PROJECT NAME','EXPENSE CATEGORY','AMOUNT','ALLOCATED DATE','COST CENTER'].map((h, hi) => (
                                                        <Text key={hi} className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">{h}</Text>
                                                    ))}
                                                </View>
                                                {RECENT_ALLOCATIONS.map((alloc, i) => (
                                                    <View key={i} className={`flex-row items-center px-4 py-3 border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}>
                                                        <Text className="flex-1 text-xs font-bold text-blue-500">{alloc.project}</Text>
                                                        <Text className="flex-1 text-xs text-gray-600">{alloc.category}</Text>
                                                        <Text className="flex-1 text-xs font-semibold text-gray-800">{alloc.amount}</Text>
                                                        <Text className="flex-1 text-xs text-gray-500">{alloc.date}</Text>
                                                        <Text className="flex-1 text-xs text-gray-500">{alloc.center}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}

                            {/* ── Expense Ledger ── */}
                            {expenseSubTab === 'Expense Ledger' && (
                                <View>
                                    {/* Breadcrumb */}
                                    <View className="flex-row items-center mb-1">
                                        <Text className="text-[10px] font-bold text-gray-400 uppercase">EXPENSES</Text>
                                        <Text className="text-[10px] text-gray-300 mx-1">/</Text>
                                        <Text className="text-[10px] font-bold text-blue-500 uppercase">EXPENSE LEDGER</Text>
                                    </View>
                                    <Text className="text-base font-bold text-gray-900 mb-4">EXPENSE LEDGER</Text>

                                    <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                        <View className="p-4 border-b border-gray-50 flex-row items-center justify-between">
                                            <Text className="text-sm font-semibold text-gray-800">Expense Ledger Entries</Text>
                                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-36">
                                                <Search size={11} color="#9CA3AF" />
                                                <TextInput placeholder="Search ledger..." placeholderTextColor="#9CA3AF" className="ml-1 text-xs text-gray-700 flex-1" />
                                            </View>
                                        </View>

                                        {!isTablet ? (
                                            <View className="p-3">
                                                {LEDGER_ENTRIES.map((entry, i) => (
                                                    <View key={i} className="py-3 border-b border-gray-50">
                                                        <View className="flex-row items-start justify-between mb-1">
                                                            <Text className="text-[10px] text-gray-400">{entry.date}</Text>
                                                            <Text className="text-xs font-bold text-gray-700">{entry.balance}</Text>
                                                        </View>
                                                        <Text className="text-xs text-gray-700 mb-1">{entry.particulars}</Text>
                                                        <View className="flex-row gap-4">
                                                            <View><Text className="text-[9px] text-gray-400 uppercase">DEBIT</Text><Text className="text-xs font-semibold text-red-500">{entry.debit}</Text></View>
                                                            <View><Text className="text-[9px] text-gray-400 uppercase">CREDIT</Text><Text className="text-xs text-gray-400">{entry.credit}</Text></View>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        ) : (
                                            <View>
                                                <View className="flex-row items-center px-4 py-3 bg-gray-50/60 border-b border-gray-100">
                                                    {['DATE','PARTICULARS','DEBIT','CREDIT','RUNNING BALANCE'].map((h, hi) => (
                                                        <Text key={hi} className={`text-[9px] font-bold text-gray-400 uppercase tracking-wider ${hi === 1 ? 'flex-1' : 'w-32'}`}>{h}</Text>
                                                    ))}
                                                </View>
                                                {LEDGER_ENTRIES.map((entry, i) => (
                                                    <View key={i} className={`flex-row items-center px-4 py-3 border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}>
                                                        <Text className="w-32 text-xs text-gray-600">{entry.date}</Text>
                                                        <Text className="flex-1 text-xs text-gray-700">{entry.particulars}</Text>
                                                        <Text className="w-32 text-xs font-semibold text-red-500">{entry.debit}</Text>
                                                        <Text className="w-32 text-xs text-gray-400">{entry.credit}</Text>
                                                        <Text className="w-32 text-xs font-bold text-gray-800">{entry.balance}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                        <View className="flex-row items-center justify-between p-3 border-t border-gray-50">
                                            <Text className="text-[10px] text-gray-400">Records per page: 10</Text>
                                            <Text className="text-[10px] text-gray-400">Showing 1-10 of 36 records</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {/* ══════════════════════════════════════
                        BOQ COMPARISON TAB
                    ══════════════════════════════════════ */}
                    {mainTab === 'BOQ Comparison' && (
                        <View>
                            {/* Breadcrumb */}
                            <View className="flex-row items-center mb-1">
                                <Text className="text-[10px] font-bold text-gray-400 uppercase">EXPENSES</Text>
                                <Text className="text-[10px] text-gray-300 mx-1">/</Text>
                                <Text className="text-[10px] font-bold text-blue-500 uppercase">BOQ COMPARISON</Text>
                            </View>

                            {/* Title + Project Selector */}
                            <View className="flex-row items-center justify-between mb-4 flex-wrap gap-2">
                                <Text className="text-base font-bold text-gray-900">BOQ COMPARISON</Text>
                                <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2">
                                    <Text className="text-xs text-gray-600">Select Project:</Text>
                                    <Text className="text-xs font-semibold text-gray-800">Sara City</Text>
                                    <Text className="text-gray-400 text-xs">▼</Text>
                                </View>
                            </View>

                            {/* Stat Cards */}
                            <View className={`mb-5 ${isTablet ? 'flex-row gap-4' : 'gap-3'}`}>
                                {[
                                    { label: 'TOTAL PROJECT EXPENSE', value: '₹9,075.61', color: '#EF4444', iconBg: '#FEE2E2' },
                                    { label: 'TOTAL ALLOCATED BOQ', value: '₹2,58,08,102', color: '#6B7280', iconBg: '#F3F4F6' },
                                ].map((card, i) => (
                                    <View key={i} className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex-row items-center justify-between ${isTablet ? 'flex-1' : 'mb-1'}`}>
                                        <View>
                                            <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">{card.label}</Text>
                                            <Text className="text-xl font-bold" style={{ color: card.color }}>{card.value}</Text>
                                        </View>
                                        <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: card.iconBg }}>
                                            <Text style={{ color: card.color }}>🔥</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            {/* BOQ Table */}
                            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <View className="p-4 border-b border-gray-50 flex-row items-center justify-between">
                                    <Text className="text-sm font-bold text-gray-800">All BOQ Comparisons</Text>
                                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-36">
                                        <Search size={11} color="#9CA3AF" />
                                        <TextInput placeholder="Search BOQ Item..." placeholderTextColor="#9CA3AF" className="ml-1 text-xs text-gray-700 flex-1" />
                                    </View>
                                </View>

                                {!isTablet ? (
                                    <View className="p-3">
                                        {BOQ_ITEMS.map((row, i) => (
                                            <View key={i} className="py-3 border-b border-gray-50">
                                                <Text className="text-xs font-semibold text-gray-800 mb-2">{row.item}</Text>
                                                <View className="flex-row justify-between">
                                                    <View>
                                                        <Text className="text-[9px] font-bold text-gray-400 uppercase">ESTIMATED</Text>
                                                        <Text className="text-xs text-gray-700">{row.estimated}</Text>
                                                    </View>
                                                    <View>
                                                        <Text className="text-[9px] font-bold text-gray-400 uppercase">ACTUAL</Text>
                                                        <Text className="text-xs font-semibold text-green-600">{row.actual}</Text>
                                                    </View>
                                                    <View>
                                                        <Text className="text-[9px] font-bold text-gray-400 uppercase">VARIANCE</Text>
                                                        <Text className={`text-xs font-bold ${row.variance.startsWith('-') ? 'text-red-500' : 'text-blue-600'}`}>{row.variance}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <View>
                                        <View className="flex-row items-center px-4 py-3 bg-gray-50/60 border-b border-gray-100">
                                            <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">BOQ ITEM</Text>
                                            <Text className="w-36 text-[9px] font-bold text-gray-400 uppercase tracking-wider">ESTIMATED AMOUNT</Text>
                                            <Text className="w-36 text-[9px] font-bold text-gray-400 uppercase tracking-wider">ACTUAL AMOUNT</Text>
                                            <Text className="w-36 text-[9px] font-bold text-gray-400 uppercase tracking-wider">VARIANCE</Text>
                                        </View>
                                        {BOQ_ITEMS.map((row, i) => (
                                            <View key={i} className={`flex-row items-center px-4 py-3 border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}>
                                                <Text className="flex-1 text-xs font-semibold text-gray-800">{row.item}</Text>
                                                <Text className="w-36 text-xs text-gray-600">{row.estimated}</Text>
                                                <Text className="w-36 text-xs font-semibold text-green-600">{row.actual}</Text>
                                                <Text className={`w-36 text-xs font-bold ${row.variance.startsWith('-') ? 'text-red-500' : 'text-blue-600'}`}>{row.variance}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                                <View className="flex-row items-center justify-between p-3 border-t border-gray-50">
                                    <Text className="text-[10px] text-gray-400">Records per page: 10</Text>
                                    <Text className="text-[10px] text-gray-400">Showing 1-10 of 46 records</Text>
                                </View>
                            </View>
                        </View>
                    )}

                </View>
                <View className="h-12" />
            </ScrollView>
        </View>
    );
}
