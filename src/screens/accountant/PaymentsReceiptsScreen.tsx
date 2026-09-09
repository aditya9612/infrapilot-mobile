import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Plus, ChevronDown, Check } from 'lucide-react-native';

type MainTab = 'Receipt' | 'Payment' | 'Fund Transfer' | 'Petty Cash';
type PaymentSubTab = 'Make Payment' | 'Payments List';
type FundTransferSubTab = 'Bank Deposits' | 'Bank Withdrawals' | 'Fund Transfers' | 'Transaction History';

export function PaymentsReceiptsScreen() {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const [mainTab, setMainTab] = useState<MainTab>('Receipt');
    const [paymentSubTab, setPaymentSubTab] = useState<PaymentSubTab>('Make Payment');
    const [fundTransferSubTab, setFundTransferSubTab] = useState<FundTransferSubTab>('Bank Deposits');
    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="px-4 pt-14 pb-4 bg-blue-600">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => (navigation as any).openDrawer()} className="p-2 -ml-2 mr-3 bg-white/10 rounded-full md:hidden">
                        <Menu size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">Payments & Receipts</Text>
                </View>
                <Text className="text-[10px] text-blue-100 mt-1">Accountant &gt; Payments & Receipts</Text>
            </View>

            <ScrollView className="flex-1 px-4 md:px-8 py-6" showsVerticalScrollIndicator={false}>
                
                {/* Screen Title */}
                <Text className="text-2xl font-extrabold text-gray-800">Payments & Receipts</Text>
                <Text className="text-sm text-gray-400 mt-1 mb-6">Manage all cash inflows, outflows, petty cash, and bank transactions.</Text>

                {/* Main Tabs */}
                <View className="mb-8">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row bg-white border border-gray-100 rounded-xl p-1 self-start shadow-sm">
                            {(['Receipt', 'Payment', 'Fund Transfer', 'Petty Cash'] as MainTab[]).map((tab) => (
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

                {/* ══════════════════════════════════════
                    RECEIPT TAB
                ══════════════════════════════════════ */}
                {mainTab === 'Receipt' && (
                    <View className="mb-12">
                        {/* Subheader */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold text-gray-800">Receipts</Text>
                            <TouchableOpacity className="flex-row items-center bg-[#00A15D] px-4 py-2 rounded-full">
                                <Plus size={16} color="#FFFFFF" />
                                <Text className="text-white text-xs font-bold ml-1">Create Receipt</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Card */}
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                            <View className="p-4 border-b border-gray-50">
                                <Text className="text-sm font-bold text-gray-800">Cash & Bank Receipts</Text>
                                <Text className="text-xs text-gray-400 mt-0.5">Manage all incoming payments</Text>
                            </View>
                            
                            {/* Summaries */}
                            <View className="flex-row p-4 space-x-4">
                                <View className="flex-1 bg-gray-50/50 rounded-xl p-4 border border-gray-50">
                                    <Text className="text-[10px] font-bold text-gray-400 uppercase">TOTAL RECEIPTS</Text>
                                    <Text className="text-lg font-bold text-[#00A15D] mt-1">₹ 300</Text>
                                </View>
                                <View className="flex-1 bg-gray-50/50 rounded-xl p-4 border border-gray-50">
                                    <Text className="text-[10px] font-bold text-gray-400 uppercase">TOTAL COUNT</Text>
                                    <Text className="text-lg font-bold text-gray-800 mt-1">2</Text>
                                </View>
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <View className="min-w-full pb-4">
                                    <View className="flex-row items-center px-4 py-3 border-y border-gray-50 bg-gray-50/30">
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Type</Text>
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Mode</Text>
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Linked To</Text>
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Invoice</Text>
                                        <Text className="w-36 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Project</Text>
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Amount</Text>
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Reference</Text>
                                        <Text className="w-48 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Dates</Text>
                                    </View>
                                    
                                    {/* Row 1 */}
                                    <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                        <Text className="w-24 text-xs font-medium text-gray-600">Receipt</Text>
                                        <Text className="w-24 text-xs font-medium text-gray-600">Cash</Text>
                                        <Text className="w-24 text-xs font-medium text-gray-600">-</Text>
                                        <Text className="w-24 text-xs font-medium text-gray-600">-</Text>
                                        <Text className="w-36 text-xs font-semibold text-blue-900">METRO HEIGHTS</Text>
                                        <Text className="w-24 text-xs font-bold text-[#00A15D]">₹ 200</Text>
                                        <Text className="w-24 text-xs font-medium text-gray-600">-</Text>
                                        <View className="w-48">
                                            <Text className="text-[10px] text-gray-400">Cre: 2026-09-02T16:14:09</Text>
                                            <Text className="text-[10px] text-gray-400">Upd: 2026-09-02T16:14:09</Text>
                                        </View>
                                    </View>

                                    {/* Row 2 */}
                                    <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                        <Text className="w-24 text-xs font-medium text-gray-600">Receipt</Text>
                                        <Text className="w-24 text-xs font-medium text-gray-600">Cash</Text>
                                        <Text className="w-24 text-xs font-medium text-gray-600">-</Text>
                                        <Text className="w-24 text-xs font-medium text-gray-600">-</Text>
                                        <Text className="w-36 text-xs font-semibold text-blue-900">METRO HEIGHTS</Text>
                                        <Text className="w-24 text-xs font-bold text-[#00A15D]">₹ 100</Text>
                                        <Text className="w-24 text-xs font-medium text-gray-600">-</Text>
                                        <View className="w-48">
                                            <Text className="text-[10px] text-gray-400">Cre: 2026-09-01T16:32:54</Text>
                                            <Text className="text-[10px] text-gray-400">Upd: 2026-09-01T16:32:54</Text>
                                        </View>
                                    </View>

                                    {/* Footer */}
                                    <View className="flex-row justify-between items-center px-4 py-4 mt-2">
                                        <View className="flex-row items-center">
                                            <Text className="text-[10px] font-medium text-gray-500 mr-2">Records per page:</Text>
                                            <TouchableOpacity className="flex-row items-center border border-gray-200 rounded px-2 py-1">
                                                <Text className="text-[10px] font-medium text-gray-700 mr-1">10</Text>
                                                <ChevronDown size={10} color="#6B7280" />
                                            </TouchableOpacity>
                                        </View>
                                        <Text className="text-[10px] font-medium text-gray-500">Showing 1 - 2 of 2 records</Text>
                                        <View className="flex-row items-center space-x-1">
                                            <Text className="text-[10px] font-medium text-gray-400 px-2 py-1">Prev</Text>
                                            <View className="bg-[#E6F4EA] rounded px-2 py-1">
                                                <Text className="text-[10px] font-bold text-[#00A15D]">1</Text>
                                            </View>
                                            <Text className="text-[10px] font-medium text-gray-400 px-2 py-1">Next</Text>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                )}

                {/* ══════════════════════════════════════
                    PAYMENT TAB
                ══════════════════════════════════════ */}
                {mainTab === 'Payment' && (
                    <View className="mb-12">
                        {/* Sub-tabs */}
                        <View className="mb-6">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View className="flex-row items-center self-start bg-white border border-gray-100 rounded-full shadow-sm p-1">
                                    {(['Make Payment', 'Payments List'] as PaymentSubTab[]).map((tab) => (
                                        <TouchableOpacity
                                            key={tab}
                                            onPress={() => setPaymentSubTab(tab)}
                                            className={`px-4 py-2 rounded-full ${paymentSubTab === tab ? 'bg-[#FF0055]' : 'bg-transparent'}`}
                                        >
                                            <Text className={`text-xs font-bold whitespace-nowrap ${paymentSubTab === tab ? 'text-white' : 'text-gray-500'}`}>
                                                {tab}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* SUB-TAB: Make Payment */}
                        {paymentSubTab === 'Make Payment' && (
                            <View className={isDesktop ? "flex-row items-start space-x-4" : "flex-col"}>
                                {/* Left Column: Form Sections */}
                                <View className={`flex-1 ${!isDesktop && 'mb-4'}`}>
                                    {/* 1. Voucher Information */}
                                    <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
                                        <View className="flex-row items-center mb-5">
                                            <View className="w-5 h-5 bg-[#FF0055] rounded-full items-center justify-center mr-2">
                                                <Text className="text-[10px] font-bold text-white">1</Text>
                                            </View>
                                            <Text className="text-sm font-bold text-gray-800">Voucher Information</Text>
                                        </View>
                                        <View className={isDesktop ? "flex-row space-x-4 mb-4" : "flex-col mb-4"}>
                                            <View className={`flex-1 ${!isDesktop && 'mb-4'}`}>
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">PAYMENT DATE *</Text>
                                                <TouchableOpacity className="border border-gray-200 rounded-lg px-3 py-2.5 flex-row justify-between items-center bg-gray-50/30">
                                                    <Text className="text-sm text-gray-500">dd-mm-yyyy --:-- --</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">PARTY TYPE *</Text>
                                                <TouchableOpacity className="border border-gray-200 rounded-lg px-3 py-2.5 flex-row justify-between items-center bg-white">
                                                    <Text className="text-sm text-gray-400">Select Type...</Text>
                                                    <ChevronDown size={14} color="#9CA3AF" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View className={isDesktop ? "flex-row space-x-4 mb-4" : "flex-col mb-4"}>
                                            <View className={`flex-1 ${!isDesktop && 'mb-4'}`}>
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">SUPPLIER *</Text>
                                                <TouchableOpacity className="border border-gray-200 rounded-lg px-3 py-2.5 flex-row justify-between items-center bg-white">
                                                    <Text className="text-sm text-gray-800">None</Text>
                                                    <ChevronDown size={14} color="#9CA3AF" />
                                                </TouchableOpacity>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">CONTRACTOR *</Text>
                                                <TouchableOpacity className="border border-gray-200 rounded-lg px-3 py-2.5 flex-row justify-between items-center bg-white">
                                                    <Text className="text-sm text-gray-800">None</Text>
                                                    <ChevronDown size={14} color="#9CA3AF" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View className="w-full">
                                            <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">VENDOR BILL *</Text>
                                            <TouchableOpacity className="border border-gray-200 rounded-lg px-3 py-2.5 flex-row justify-between items-center bg-white">
                                                <Text className="text-sm text-gray-800">None</Text>
                                                <ChevronDown size={14} color="#9CA3AF" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* 2. Amount Details */}
                                    <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
                                        <View className="flex-row items-center mb-5">
                                            <View className="w-5 h-5 bg-[#FF0055] rounded-full items-center justify-center mr-2">
                                                <Text className="text-[10px] font-bold text-white">2</Text>
                                            </View>
                                            <Text className="text-sm font-bold text-gray-800">Amount Details</Text>
                                        </View>
                                        <View className={isDesktop ? "flex-row space-x-4 mb-4" : "flex-col mb-4"}>
                                            <View className={`flex-1 ${!isDesktop && 'mb-4'}`}>
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">BASE AMOUNT *</Text>
                                                <TextInput className="border border-gray-100 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 bg-gray-50/50" value="0" editable={false} />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">GST AMOUNT</Text>
                                                <TextInput className="border border-gray-100 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 bg-gray-50/50" value="0" editable={false} />
                                            </View>
                                        </View>
                                        <View className="w-full mb-4">
                                            <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">GROSS AMOUNT</Text>
                                            <TextInput className="border border-gray-100 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 bg-gray-50/50" value="0" editable={false} />
                                        </View>
                                        <View className={isDesktop ? "flex-row space-x-4 mb-4" : "flex-col mb-4"}>
                                            <View className={`flex-1 ${!isDesktop && 'mb-4'}`}>
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">TDS AMOUNT</Text>
                                                <TextInput className="border border-gray-100 rounded-lg px-3 py-2.5 text-sm font-medium text-[#FF0055] bg-gray-50/50" value="0" editable={false} />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">RETENTION AMOUNT</Text>
                                                <TextInput className="border border-gray-100 rounded-lg px-3 py-2.5 text-sm font-medium text-[#FF0055] bg-gray-50/50" value="0" editable={false} />
                                            </View>
                                        </View>
                                        <View className="w-full">
                                            <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">NET PAYABLE AMOUNT *</Text>
                                            <TextInput className="border border-gray-100 rounded-lg px-3 py-2.5 text-sm font-bold text-[#FF0055] bg-gray-50/50" value="0" editable={false} />
                                        </View>
                                    </View>

                                    {/* 3. Payment Execution */}
                                    <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
                                        <View className="flex-row items-center mb-5">
                                            <View className="w-5 h-5 bg-[#FF0055] rounded-full items-center justify-center mr-2">
                                                <Text className="text-[10px] font-bold text-white">3</Text>
                                            </View>
                                            <Text className="text-sm font-bold text-gray-800">Payment Execution</Text>
                                        </View>
                                        <View className={isDesktop ? "flex-row space-x-4 mb-4" : "flex-col mb-4"}>
                                            <View className={`flex-1 ${!isDesktop && 'mb-4'}`}>
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">PAYMENT METHOD *</Text>
                                                <TouchableOpacity className="border border-gray-200 rounded-lg px-3 py-2.5 flex-row justify-between items-center bg-white">
                                                    <Text className="text-sm text-gray-800">Bank Transfer</Text>
                                                    <ChevronDown size={14} color="#9CA3AF" />
                                                </TouchableOpacity>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">BANK ACCOUNT *</Text>
                                                <TouchableOpacity className="border border-gray-200 rounded-lg px-3 py-2.5 flex-row justify-between items-center bg-white">
                                                    <Text className="text-sm text-gray-400">Select Bank Account...</Text>
                                                    <ChevronDown size={14} color="#9CA3AF" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View className="w-full">
                                            <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">REFERENCE NO</Text>
                                            <TextInput className="border border-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50/50" placeholder="Ref No." placeholderTextColor="#9CA3AF" />
                                        </View>
                                    </View>
                                </View>

                                {/* Right Column: Payment Workflow */}
                                <View className={isDesktop ? "w-80" : "w-full"}>
                                    <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                        <Text className="text-sm font-bold text-gray-800 mb-5">Payment Workflow</Text>
                                        
                                        <View className="flex-row justify-between items-center mb-3">
                                            <Text className="text-[10px] font-bold text-gray-400 uppercase">BASE AMOUNT</Text>
                                            <Text className="text-sm font-medium text-gray-600">--</Text>
                                        </View>
                                        <View className="flex-row justify-between items-center mb-3">
                                            <Text className="text-[10px] font-bold text-[#FF0055] uppercase">Deductions</Text>
                                            <Text className="text-sm font-medium text-[#FF0055]">--</Text>
                                        </View>
                                        <View className="border-t border-gray-100 pt-3 mb-5 flex-row justify-between items-center">
                                            <Text className="text-[10px] font-bold text-[#FF0055] uppercase">Net Payment</Text>
                                            <Text className="text-sm font-bold text-[#FF0055]">--</Text>
                                        </View>

                                        <View className="mb-6">
                                            <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">INITIAL STATUS *</Text>
                                            <TouchableOpacity className="border border-gray-200 rounded-lg px-3 py-2 flex-row justify-between items-center bg-white">
                                                <Text className="text-sm font-semibold text-[#D97706]">Pending</Text>
                                                <ChevronDown size={14} color="#D97706" />
                                            </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity className="bg-[#FF0055] rounded-xl py-3 items-center shadow-sm mb-3">
                                            <Text className="text-white text-sm font-bold">Submit Payment Voucher</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="bg-white border border-gray-200 rounded-xl py-3 items-center">
                                            <Text className="text-gray-600 text-sm font-bold">Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* SUB-TAB: Payments List */}
                        {paymentSubTab === 'Payments List' && (
                            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                                <View className="p-4 border-b border-gray-50">
                                    <Text className="text-sm font-bold text-gray-800">Cash & Bank Payments</Text>
                                    <Text className="text-xs text-gray-400 mt-0.5">Manage all outgoing payments</Text>
                                </View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                    <View className="min-w-full">
                                        <View className="flex-row items-center px-4 py-3 border-b border-gray-50">
                                            <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DATE</Text>
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">PAYMENT NO</Text>
                                            <Text className="w-40 text-[9px] font-bold text-gray-400 uppercase tracking-wider">PARTY</Text>
                                            <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">TYPE</Text>
                                            <Text className="w-28 text-[9px] font-bold text-gray-400 uppercase tracking-wider">AMOUNT</Text>
                                            <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">MODE</Text>
                                            <Text className="w-28 text-[9px] font-bold text-gray-400 uppercase tracking-wider">STATUS</Text>
                                            <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">ACTIONS</Text>
                                        </View>
                                        {/* Empty state, no rows */}
                                        <View className="h-32 bg-gray-50/10" />
                                    </View>
                                </ScrollView>
                            </View>
                        )}
                    </View>
                )}

                {/* ══════════════════════════════════════
                    FUND TRANSFER TAB
                ══════════════════════════════════════ */}
                {mainTab === 'Fund Transfer' && (
                    <View className="mb-12">
                        {/* Sub-tabs */}
                        <View className="mb-6">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View className="flex-row items-center self-start bg-white border border-gray-100 rounded-full shadow-sm p-1">
                                    {(['Bank Deposits', 'Bank Withdrawals', 'Fund Transfers', 'Transaction History'] as FundTransferSubTab[]).map((tab) => (
                                        <TouchableOpacity
                                            key={tab}
                                            onPress={() => setFundTransferSubTab(tab)}
                                            className={`px-4 py-2 rounded-full ${fundTransferSubTab === tab ? 'bg-[#5B63FA]' : 'bg-transparent'}`}
                                        >
                                            <Text className={`text-xs font-bold whitespace-nowrap ${fundTransferSubTab === tab ? 'text-white' : 'text-gray-500'}`}>
                                                {tab}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* SUB-TAB: Bank Deposits */}
                        {fundTransferSubTab === 'Bank Deposits' && (
                            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                                <View className="p-4 border-b border-gray-50">
                                    <Text className="text-sm font-bold text-gray-800">Bank Deposits</Text>
                                    <Text className="text-xs text-gray-400 mt-0.5">Manage and record bank transactions</Text>
                                </View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                    <View className="min-w-full">
                                        <View className="flex-row items-center px-4 py-3 border-b border-gray-50">
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DATE</Text>
                                            <Text className="w-48 text-[9px] font-bold text-gray-400 uppercase tracking-wider">REF NO</Text>
                                            <Text className="w-64 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DESCRIPTION</Text>
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">AMOUNT</Text>
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">STATUS</Text>
                                        </View>
                                        <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                            <Text className="w-32 text-xs font-medium text-gray-500">2024-05-18</Text>
                                            <Text className="w-48 text-xs font-bold text-[#5B63FA]">TRX-001</Text>
                                            <Text className="w-64 text-xs font-medium text-gray-800">Sample Bank Deposits</Text>
                                            <Text className="w-32 text-xs font-bold text-gray-800">₹1,50,000</Text>
                                            <View className="w-32">
                                                <View className="bg-[#E6F4EA] rounded-full px-2 py-1 self-start">
                                                    <Text className="text-[10px] font-bold text-[#00A15D]">Completed</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        )}

                        {/* SUB-TAB: Bank Withdrawals */}
                        {fundTransferSubTab === 'Bank Withdrawals' && (
                            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                                <View className="p-4 border-b border-gray-50">
                                    <Text className="text-sm font-bold text-gray-800">Bank Withdrawals</Text>
                                    <Text className="text-xs text-gray-400 mt-0.5">Manage and record bank transactions</Text>
                                </View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                    <View className="min-w-full">
                                        <View className="flex-row items-center px-4 py-3 border-b border-gray-50">
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DATE</Text>
                                            <Text className="w-48 text-[9px] font-bold text-gray-400 uppercase tracking-wider">REF NO</Text>
                                            <Text className="w-64 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DESCRIPTION</Text>
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">AMOUNT</Text>
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">STATUS</Text>
                                        </View>
                                        <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                            <Text className="w-32 text-xs font-medium text-gray-500">2024-05-18</Text>
                                            <Text className="w-48 text-xs font-bold text-[#5B63FA]">TRX-001</Text>
                                            <Text className="w-64 text-xs font-medium text-gray-800">Sample Bank Withdrawals</Text>
                                            <Text className="w-32 text-xs font-bold text-gray-800">₹1,50,000</Text>
                                            <View className="w-32">
                                                <View className="bg-[#E6F4EA] rounded-full px-2 py-1 self-start">
                                                    <Text className="text-[10px] font-bold text-[#00A15D]">Completed</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        )}

                        {/* SUB-TAB: Fund Transfers */}
                        {fundTransferSubTab === 'Fund Transfers' && (
                            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                                <View className="p-4 border-b border-gray-50 flex-row justify-between items-center">
                                    <View>
                                        <Text className="text-sm font-bold text-gray-800">Fund Transfers</Text>
                                        <Text className="text-xs text-gray-400 mt-0.5">Manage fund transfers between accounts</Text>
                                    </View>
                                    <TouchableOpacity className="flex-row items-center bg-[#5B63FA] px-4 py-2 rounded-full shadow-sm">
                                        <Plus size={16} color="#FFFFFF" />
                                        <Text className="text-white text-xs font-bold ml-1">New Transfer</Text>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                    <View className="min-w-full">
                                        <View className="flex-row items-center px-4 py-3 border-b border-gray-50">
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DATE</Text>
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">REF NO</Text>
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">FROM</Text>
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">TO</Text>
                                            <Text className="w-48 text-[9px] font-bold text-gray-400 uppercase tracking-wider">REMARKS</Text>
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">AMOUNT</Text>
                                        </View>
                                        <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                            <Text className="w-32 text-xs font-medium text-gray-500">2026-09-01</Text>
                                            <Text className="w-32 text-xs font-bold text-[#5B63FA]">2</Text>
                                            <Text className="w-32 text-xs font-medium text-gray-600">1</Text>
                                            <Text className="w-32 text-xs font-medium text-gray-600">2</Text>
                                            <Text className="w-48 text-xs font-medium text-gray-600">Ipi</Text>
                                            <Text className="w-32 text-xs font-bold text-gray-800">₹100</Text>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        )}

                        {/* SUB-TAB: Transaction History */}
                        {fundTransferSubTab === 'Transaction History' && (
                            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                                <View className="p-4 border-b border-gray-50">
                                    <Text className="text-sm font-bold text-gray-800">All Transactions</Text>
                                    <Text className="text-xs text-gray-400 mt-0.5">List of all cash inflows and outflows</Text>
                                </View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                    <View className="min-w-full">
                                        <View className="flex-row items-center px-4 py-3 border-b border-gray-50 bg-gray-50/30">
                                            <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">TYPE</Text>
                                            <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-wider">MODE</Text>
                                            <Text className="w-48 text-[9px] font-bold text-gray-400 uppercase tracking-wider">PROJECT</Text>
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">AMOUNT</Text>
                                            <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-wider">REFERENCE</Text>
                                            <Text className="w-48 text-[9px] font-bold text-gray-400 uppercase tracking-wider">DATES</Text>
                                        </View>
                                        {/* Row 1 */}
                                        <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                            <Text className="w-24 text-xs font-medium text-gray-600">Receipt</Text>
                                            <Text className="w-24 text-xs font-medium text-gray-600">Cash</Text>
                                            <Text className="w-48 text-xs font-semibold text-gray-800">METRO HEIGHTS</Text>
                                            <Text className="w-32 text-xs font-bold text-gray-800">₹ 200</Text>
                                            <Text className="w-32 text-xs font-medium text-gray-600">-</Text>
                                            <View className="w-48">
                                                <Text className="text-[10px] text-gray-400">Cre: 2026-09-02T16:14:09</Text>
                                                <Text className="text-[10px] text-gray-400">Upd: 2026-09-02T16:14:09</Text>
                                            </View>
                                        </View>
                                        {/* Row 2 */}
                                        <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
                                            <Text className="w-24 text-xs font-medium text-gray-600">Receipt</Text>
                                            <Text className="w-24 text-xs font-medium text-gray-600">Cash</Text>
                                            <Text className="w-48 text-xs font-semibold text-gray-800">METRO HEIGHTS</Text>
                                            <Text className="w-32 text-xs font-bold text-gray-800">₹ 100</Text>
                                            <Text className="w-32 text-xs font-medium text-gray-600">-</Text>
                                            <View className="w-48">
                                                <Text className="text-[10px] text-gray-400">Cre: 2026-09-01T16:32:54</Text>
                                                <Text className="text-[10px] text-gray-400">Upd: 2026-09-01T16:32:54</Text>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        )}
                    </View>
                )}

                {/* Petty Cash placeholder */}
                {mainTab === 'Petty Cash' && (
                    <View className="bg-white rounded-xl border border-gray-100 p-8 items-center mb-12">
                        <Text className="text-gray-500 font-medium">Petty Cash coming soon...</Text>
                    </View>
                )}

            </ScrollView>
        </View>
    );
}
