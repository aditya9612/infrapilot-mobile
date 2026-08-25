import { useNavigation, useRouter } from 'expo-router';
import { Menu, Download, RefreshCw, IndianRupee, Wallet, ArrowDownRight, ArrowUpRight, TrendingUp, FileText, Activity } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';

const SUMMARY_CARDS = [
    { id: 1, title: 'CASH', amount: '₹-35019.99', icon: IndianRupee, iconColor: '#10B981', iconBg: '#D1FAE5' },
    { id: 2, title: 'BANK', amount: '₹-61996.11', icon: Wallet, iconColor: '#3B82F6', iconBg: '#DBEAFE' },
    { id: 3, title: 'RECEIVABLE', amount: '₹8788559.43', icon: ArrowDownRight, iconColor: '#8B5CF6', iconBg: '#EDE9FE' },
    { id: 4, title: 'PAYABLE', amount: '₹106000', icon: ArrowUpRight, iconColor: '#EF4444', iconBg: '#FEE2E2' },
    { id: 5, title: 'TOTAL BUDGET', amount: '₹30683907', icon: Wallet, iconColor: '#10B981', iconBg: '#D1FAE5' },
    { id: 6, title: 'TOTAL SPENT', amount: '₹613083.49', icon: Activity, iconColor: '#F59E0B', iconBg: '#FEF3C7' },
    { id: 7, title: 'GST DUE', amount: '₹447144.74', icon: FileText, iconColor: '#F59E0B', iconBg: '#FEF3C7' },
    { id: 8, title: 'PROFIT', amount: '₹30070823.51', icon: TrendingUp, iconColor: '#8B5CF6', iconBg: '#EDE9FE' },
];

const RECEIVABLE_AGING = [
    { period: '0-30 Days', amount: '₹8788559.43', percent: '100%' },
    { period: '31-60 Days', amount: '₹5000', percent: '0%' },
    { period: '61-90 Days', amount: '₹0', percent: '0%' },
    { period: '> 90 Days', amount: '₹0', percent: '0%' },
];

const PAYABLE_AGING = [
    { period: '0-30 Days', amount: '₹106000', percent: '100%' },
    { period: '31-60 Days', amount: '₹0', percent: '0%' },
    { period: '61-90 Days', amount: '₹0', percent: '0%' },
    { period: '> 90 Days', amount: '₹0', percent: '0%' },
];

const PROJECT_COST = [
    { name: 'Rohan Harita', budget: '₹2853604', expense: '₹604007.88', remaining: '₹2249596.12' },
    { name: 'Sara City', budget: '₹25969303', expense: '₹9075.61', remaining: '₹25960227.39' },
];

const UPCOMING_PAYMENTS = [
    { name: 'Venom', date: '19 Sep 2026', amount: '₹106000' },
];

const UPCOMING_COLLECTIONS = [
    { name: 'tejas', date: '10 Aug 2026', amount: '₹5000' },
    { name: 'tejas', date: '16 Aug 2026', amount: '₹0' },
    { name: 'tejas', date: '25 Aug 2026', amount: '₹100' },
    { name: 'tejas', date: '03 Sep 2026', amount: '₹100' },
    { name: 'tejas', date: '05 Sep 2026', amount: '₹55000' },
];

const RECENT_ACTIVITIES = [
    { type: 'RAISE_ISSUE', time: '09:41 AM' },
    { type: 'CREATE_PO', time: '09:11 AM' },
    { type: 'CREATE_PO', time: '08:14 AM' },
    { type: 'RECEIVE_MATERIAL', time: '08:14 AM' },
    { type: 'CREATE_PO', time: '08:13 AM' },
];

const NOTIFICATIONS = [
    'GST Return filling due for 6 periods.',
    'Pending approval for 25 vouchers.',
];

export default function Dashboard() {
    const router = useRouter();
    const navigation = useNavigation();

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            <View className="px-4 pt-14 pb-4 bg-blue-600 shadow-sm">
                <View className="flex-row items-center mb-0.5">
                    <TouchableOpacity onPress={() => (navigation as any).openDrawer()} className="p-2 -ml-2 mr-3 bg-white/10 rounded-full">
                        <Menu size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white tracking-tight flex-1">Dashboard</Text>
                    <View className="flex-row items-center space-x-4">
                        <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center">
                            <Text className="text-white text-xs font-bold">A</Text>
                        </View>
                    </View>
                </View>
                <Text className="text-[10px] text-blue-100 font-medium">InfraPilot &gt; Accountant &gt; Dashboard</Text>
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                
                {/* Header Actions */}
                <View className="flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                    <View>
                        <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">OVERVIEW</Text>
                        <Text className="text-xl font-extrabold text-gray-800 uppercase tracking-tight">FINANCIAL DASHBOARD</Text>
                    </View>
                    <View className="flex-row items-center space-x-3">
                        <TouchableOpacity className="flex-row items-center px-4 py-2.5 bg-indigo-600 rounded-lg shadow-sm">
                            <Download size={14} color="#ffffff" className="mr-2" />
                            <Text className="font-bold text-xs text-white">Export Dashboard Report</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <RefreshCw size={14} color="#6B7280" className="mr-2" />
                            <Text className="font-bold text-xs text-gray-700">Refresh</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Summary Cards */}
                <View className="flex-row flex-wrap -mx-2 mb-4">
                    {SUMMARY_CARDS.map((card) => {
                        const Icon = card.icon;
                        return (
                            <View key={card.id} className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
                                <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                    <View className="w-8 h-8 rounded-lg items-center justify-center mb-4" style={{ backgroundColor: card.iconBg }}>
                                        <Icon size={16} color={card.iconColor} />
                                    </View>
                                    <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{card.title}</Text>
                                    <Text className="text-xl font-bold text-gray-900 tracking-tight">{card.amount}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Charts Section (Mocked) */}
                <View className="flex-col md:flex-row md:space-x-4 mb-6">
                    {/* Revenue vs Expense Chart */}
                    <View className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-4 md:mb-0 min-h-[300px]">
                        <Text className="text-xs font-bold text-gray-800 mb-6">Revenue vs Expense Chart</Text>
                        
                        <View className="flex-1 flex-row items-end justify-between px-2 pb-8 border-b border-gray-100 relative">
                            {/* Y-axis labels */}
                            <View className="absolute left-0 top-0 bottom-8 justify-between z-10">
                                <Text className="text-[10px] text-gray-400">10000000L</Text>
                                <Text className="text-[10px] text-gray-400">7500000L</Text>
                                <Text className="text-[10px] text-gray-400">5000000L</Text>
                                <Text className="text-[10px] text-gray-400">2500000L</Text>
                                <Text className="text-[10px] text-gray-400">₹0L</Text>
                            </View>

                            <View className="w-8" />
                            
                            <View className="items-center">
                                <View className="w-2 bg-red-500 h-2 rounded-t-sm" />
                                <Text className="text-[10px] text-gray-500 mt-2 absolute -bottom-6">Apr</Text>
                            </View>
                            <View className="items-center">
                                <View className="w-2 bg-blue-600 h-0 rounded-t-sm" />
                                <Text className="text-[10px] text-gray-500 mt-2 absolute -bottom-6">May</Text>
                            </View>
                            <View className="items-center">
                                <View className="w-2 bg-blue-600 h-0 rounded-t-sm" />
                                <Text className="text-[10px] text-gray-500 mt-2 absolute -bottom-6">Jun</Text>
                            </View>
                            <View className="items-center">
                                <View className="w-2 bg-blue-600 h-24 rounded-t-sm" />
                                <Text className="text-[10px] text-gray-500 mt-2 absolute -bottom-6">Jul</Text>
                            </View>
                            <View className="items-center">
                                <View className="w-2 bg-blue-600 h-40 rounded-t-sm" />
                                <Text className="text-[10px] text-gray-500 mt-2 absolute -bottom-6">Aug</Text>
                            </View>
                            
                            <View className="w-4" />
                        </View>
                        <View className="flex-row items-center justify-center mt-8 space-x-4">
                            <View className="flex-row items-center">
                                <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                                <Text className="text-[10px] text-gray-600 font-medium">Expense</Text>
                            </View>
                            <View className="flex-row items-center">
                                <View className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
                                <Text className="text-[10px] text-gray-600 font-medium">Revenue</Text>
                            </View>
                        </View>
                    </View>

                    {/* Cash Flow Graph */}
                    <View className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
                        <Text className="text-xs font-bold text-gray-800 mb-6">Cash Flow Graph</Text>
                        
                        <View className="flex-1 flex-row items-end justify-between px-2 pb-8 border-b border-gray-100 relative">
                            {/* Y-axis labels */}
                            <View className="absolute left-0 top-0 bottom-8 justify-between z-10">
                                <Text className="text-[10px] text-gray-400">₹320000L</Text>
                                <Text className="text-[10px] text-gray-400">₹240000L</Text>
                                <Text className="text-[10px] text-gray-400">₹160000L</Text>
                                <Text className="text-[10px] text-gray-400">₹80000L</Text>
                                <Text className="text-[10px] text-gray-400">₹0L</Text>
                            </View>

                            <View className="w-10" />

                            {/* Mock Line Chart SVGs or simple absolute positioned elements */}
                            <View className="absolute left-10 right-4 bottom-8 h-full">
                                {/* Inflow Line (Green) */}
                                <View className="absolute left-0 right-0 bottom-0 h-[100px] border-b-2 border-green-500" style={{ transform: [{ skewY: '-15deg' }], transformOrigin: 'bottom left' }} />
                                {/* Outflow Line (Yellow) */}
                                <View className="absolute left-0 right-0 bottom-0 border-b-2 border-yellow-500" />
                            </View>

                            <View className="flex-1 justify-between flex-row absolute left-10 right-4 -bottom-6">
                                <Text className="text-[10px] text-gray-500">Mar</Text>
                                <Text className="text-[10px] text-gray-500">Apr</Text>
                                <Text className="text-[10px] text-gray-500">May</Text>
                                <Text className="text-[10px] text-gray-500">Jun</Text>
                                <Text className="text-[10px] text-gray-500">Jul</Text>
                                <Text className="text-[10px] text-gray-500">Aug</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center justify-center mt-8 space-x-4">
                            <View className="flex-row items-center">
                                <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                                <Text className="text-[10px] text-gray-600 font-medium">Inflow</Text>
                            </View>
                            <View className="flex-row items-center">
                                <View className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                                <Text className="text-[10px] text-gray-600 font-medium">Outflow</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Aging Section */}
                <View className="flex-col md:flex-row md:space-x-4 mb-6">
                    {/* Receivable Aging */}
                    <View className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm mb-4 md:mb-0">
                        <View className="p-4 border-b border-gray-50">
                            <Text className="text-xs font-bold text-gray-800">Receivable Aging</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="w-full min-w-[400px]">
                                <View className="flex-row items-center px-4 py-3 bg-gray-50/50">
                                    <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">PERIOD</Text>
                                    <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">AMOUNT</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">% OF TOTAL</Text>
                                </View>
                                {RECEIVABLE_AGING.map((row, index) => (
                                    <View key={index} className="flex-row items-center px-4 py-3 border-b border-gray-50">
                                        <Text className="flex-1 text-xs font-bold text-gray-800">{row.period}</Text>
                                        <Text className="flex-1 text-xs font-bold text-indigo-600 text-center">{row.amount}</Text>
                                        <Text className="w-24 text-xs font-medium text-gray-500 text-right">{row.percent}</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Payable Aging */}
                    <View className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <View className="p-4 border-b border-gray-50">
                            <Text className="text-xs font-bold text-gray-800">Payable Aging</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="w-full min-w-[400px]">
                                <View className="flex-row items-center px-4 py-3 bg-gray-50/50">
                                    <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">PERIOD</Text>
                                    <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">AMOUNT</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">% OF TOTAL</Text>
                                </View>
                                {PAYABLE_AGING.map((row, index) => (
                                    <View key={index} className="flex-row items-center px-4 py-3 border-b border-gray-50">
                                        <Text className="flex-1 text-xs font-bold text-gray-800">{row.period}</Text>
                                        <Text className="flex-1 text-xs font-bold text-red-500 text-center">{row.amount}</Text>
                                        <Text className="w-24 text-xs font-medium text-gray-500 text-right">{row.percent}</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>

                {/* Project Cost Summary */}
                <View className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
                    <View className="p-4 border-b border-gray-50">
                        <Text className="text-xs font-bold text-gray-800">Project Cost Summary</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="w-full min-w-[700px]">
                            <View className="flex-row items-center px-4 py-3 bg-gray-50/50">
                                <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">PROJECT</Text>
                                <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">BUDGET</Text>
                                <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">EXPENSE</Text>
                                <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">REMAINING</Text>
                            </View>
                            {PROJECT_COST.map((project, index) => (
                                <View key={index} className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                    <Text className="flex-1 text-xs font-bold text-gray-800">{project.name}</Text>
                                    <Text className="flex-1 text-xs font-medium text-gray-600">{project.budget}</Text>
                                    <Text className="flex-1 text-xs font-bold text-red-500">{project.expense}</Text>
                                    <Text className="flex-1 text-xs font-bold text-green-500 text-right">{project.remaining}</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Bottom Widgets */}
                <View className="flex-col md:flex-row flex-wrap -mx-2">
                    {/* Upcoming Payments */}
                    <View className="w-full md:w-1/4 px-2 mb-4">
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm h-full">
                            <View className="p-4 border-b border-gray-50">
                                <Text className="text-xs font-bold text-gray-800">Upcoming Payments</Text>
                            </View>
                            <ScrollView className="p-4 max-h-[300px]">
                                {UPCOMING_PAYMENTS.map((payment, i) => (
                                    <View key={i} className="flex-row items-center justify-between mb-4">
                                        <View>
                                            <Text className="text-xs font-bold text-gray-800">{payment.name}</Text>
                                            <Text className="text-[10px] text-gray-500 mt-1">{payment.date}</Text>
                                        </View>
                                        <Text className="text-xs font-bold text-red-500">{payment.amount}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    {/* Upcoming Collections */}
                    <View className="w-full md:w-1/4 px-2 mb-4">
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm h-full">
                            <View className="p-4 border-b border-gray-50">
                                <Text className="text-xs font-bold text-gray-800">Upcoming Collections</Text>
                            </View>
                            <ScrollView className="p-4 max-h-[300px]">
                                {UPCOMING_COLLECTIONS.map((col, i) => (
                                    <View key={i} className="flex-row items-center justify-between mb-4">
                                        <View>
                                            <Text className="text-xs font-bold text-gray-800">{col.name}</Text>
                                            <Text className="text-[10px] text-gray-500 mt-1">{col.date}</Text>
                                        </View>
                                        <Text className="text-xs font-bold text-indigo-600">{col.amount}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    {/* Recent Activities */}
                    <View className="w-full md:w-1/4 px-2 mb-4">
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm h-full">
                            <View className="p-4 border-b border-gray-50 flex-row items-center">
                                <Activity size={14} color="#6B7280" className="mr-2" />
                                <Text className="text-xs font-bold text-gray-800">Recent Activities</Text>
                            </View>
                            <ScrollView className="p-4 max-h-[300px]">
                                {RECENT_ACTIVITIES.map((act, i) => (
                                    <View key={i} className="flex-row mb-4">
                                        <View className="items-center mr-3">
                                            <View className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                                            {i !== RECENT_ACTIVITIES.length - 1 && <View className="w-0.5 flex-1 bg-gray-200 mt-1 mb-1" />}
                                        </View>
                                        <View className="pb-1">
                                            <Text className="text-xs font-bold text-gray-700">{act.type}</Text>
                                            <Text className="text-[10px] text-gray-400 mt-1">{act.time}</Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    {/* Notifications */}
                    <View className="w-full md:w-1/4 px-2 mb-4">
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm h-full">
                            <View className="p-4 border-b border-gray-50">
                                <Text className="text-xs font-bold text-gray-800">Notifications</Text>
                            </View>
                            <ScrollView className="p-4 max-h-[300px]">
                                {NOTIFICATIONS.map((notif, i) => (
                                    <View key={i} className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-100">
                                        <Text className="text-xs font-medium text-blue-800">{notif}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>

                <View className="h-12" />
            </ScrollView>
        </View>
    );
}
