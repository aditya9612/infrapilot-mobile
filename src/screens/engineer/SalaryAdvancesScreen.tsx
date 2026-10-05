import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { Search, Filter, Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useProjectContext } from '../../contexts/ProjectContext';
import { payrollService } from '../../services/payrollService';

export default function SalaryAdvancesScreen() {
    const { activeProjectId, activeProjectName } = useProjectContext();
    const [activeTab, setActiveTab] = useState('ACTIVE PAYROLL');
    const tabs = ['ACTIVE PAYROLL', 'PAYMENT HISTORY', 'CONTRACTOR PAYMENT PENDING', 'WEEKLY VELOCITY'];

    const [activePayroll, setActivePayroll] = useState<any[]>([]);
    const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
    const [contractorPending, setContractorPending] = useState<any[]>([]);
    const [weeklyVelocity, setWeeklyVelocity] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const pid = activeProjectId ? parseInt(activeProjectId.toString()) : undefined;
            if (activeTab === 'ACTIVE PAYROLL') {
                const res = await payrollService.getActivePayroll(pid).catch(() => null);
                setActivePayroll(Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
            } else if (activeTab === 'PAYMENT HISTORY') {
                const res = await payrollService.getDisbursementHistory(pid).catch(() => null);
                setPaymentHistory(Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
            } else if (activeTab === 'CONTRACTOR PAYMENT PENDING') {
                const res = await payrollService.getContractorLiability(pid).catch(() => null);
                setContractorPending(Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
            } else if (activeTab === 'WEEKLY VELOCITY') {
                const res = await payrollService.getWeeklyVelocity(pid).catch(() => null);
                setWeeklyVelocity(Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeTab, activeProjectId]);

    const renderActivePayrollTable = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
                <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                    <Text className="w-56 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Workforce Identity</Text>
                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Attendance</Text>
                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Intensity (Hrs)</Text>
                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Daily Rate</Text>
                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Accrued Wage</Text>
                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Audit Status</Text>
                    <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Execution</Text>
                </View>

                {isLoading ? (
                    <View className="py-8"><ActivityIndicator /></View>
                ) : activePayroll.map((row, index) => {
                    const initials = row?.worker_name?.charAt(0) || row?.labour_name?.charAt(0) || 'U';
                    const name = row?.worker_name || row?.labour_name || 'Unknown';
                    const labId = row?.labour_id || 'LAB-000';
                    const attendance = row?.attendance || '-';
                    const ot = row?.overtime ? `+${row.overtime}H OT` : '-';
                    const rate = row?.daily_rate ? `₹${row.daily_rate}` : '-';
                    const wage = row?.accrued_wage ? `₹${row.accrued_wage}` : row?.amount ? `₹${row.amount}` : '₹0';
                    const status = row?.status || 'PENDING';

                    return (
                        <View key={row.id || index} className={`flex-row items-center px-6 py-4 ${index !== activePayroll.length - 1 ? 'border-b border-gray-50' : ''}`}>
                            <View className="w-56 flex-row items-center">
                                <View className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 items-center justify-center mr-3">
                                    <Text className="text-gray-600 font-bold uppercase">{initials}</Text>
                                </View>
                                <View>
                                    <Text className="text-sm font-semibold text-gray-900">{name}</Text>
                                    <Text className="text-[10px] text-gray-400 font-medium">{labId}</Text>
                                </View>
                            </View>
                            
                            <View className="w-32 items-center">
                                <Text className="text-gray-400 font-bold">-</Text>
                            </View>
                            
                            <View className="w-32 items-center">
                                <Text className="text-sm font-bold text-gray-900">{attendance}</Text>
                                <Text className="text-[10px] font-bold text-orange-500">{ot}</Text>
                            </View>
                            
                            <Text className="w-32 text-sm font-medium text-gray-600 text-center">{rate}</Text>
                            <Text className="w-32 text-sm font-bold text-gray-900 text-center">{wage}</Text>
                            
                            <View className="w-32 items-center">
                                <View className={`px-2 py-1 rounded border ${status === 'PAID' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                                    <Text className={`text-[10px] font-bold uppercase ${status === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>{status}</Text>
                                </View>
                            </View>

                            <View className="w-48 flex-row justify-end space-x-2">
                                <TouchableOpacity className="px-3 py-1.5 bg-orange-500 rounded-full shadow-sm">
                                    <Text className="text-xs font-bold text-white uppercase tracking-wider">Advance</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="px-3 py-1.5 bg-blue-600 rounded-full shadow-sm">
                                    <Text className="text-xs font-bold text-white uppercase tracking-wider">₹ Pay Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );

    const renderPaymentHistoryTable = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
                <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                    <Text className="w-56 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Workforce Identity</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Protocol</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Channel</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Quantum (Amt)</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Audit Date</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Verification</Text>
                </View>
                {isLoading ? (
                    <View className="py-8"><ActivityIndicator /></View>
                ) : paymentHistory.length === 0 ? (
                    <View className="px-6 py-8 items-center justify-center">
                        <Text className="text-gray-400 font-medium">No payment history available.</Text>
                    </View>
                ) : paymentHistory.map((row, index) => (
                    <View key={row.id || index} className="flex-row items-center px-6 py-4 border-b border-gray-50">
                        <Text className="w-56 text-sm font-semibold text-gray-900">{row.name || 'Unknown'}</Text>
                        <Text className="w-40 text-sm font-medium text-gray-600 text-center">{row.protocol || '-'}</Text>
                        <Text className="w-40 text-sm font-medium text-gray-600 text-center">{row.channel || '-'}</Text>
                        <Text className="w-40 text-sm font-bold text-gray-900 text-center">{row.amount ? `₹${row.amount}` : '-'}</Text>
                        <Text className="w-40 text-sm font-medium text-gray-400 text-center">{row.date || '-'}</Text>
                        <Text className="w-40 text-sm font-medium text-green-600 text-right">{row.status || 'Verified'}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );

    const renderContractorPaymentPendingTable = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
                <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                    <Text className="w-64 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Vendor Entity</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Gross Liability</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Liquidated</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Pending</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Last Transaction</Text>
                </View>

                {isLoading ? (
                    <View className="py-8"><ActivityIndicator /></View>
                ) : contractorPending.map((row, index) => (
                    <View key={row.id || index} className={`flex-row items-center px-6 py-4 ${index !== contractorPending.length - 1 ? 'border-b border-gray-50' : ''}`}>
                        <Text className="w-64 text-sm font-semibold text-gray-900">{row.vendor || row.contractor_name || 'Vendor'}</Text>
                        <Text className="w-40 text-sm font-bold text-gray-600 text-center">₹{row.liability || row.total_amount || 0}</Text>
                        <Text className="w-40 text-sm font-bold text-green-500 text-center">₹{row.liquidated || row.paid_amount || 0}</Text>
                        <Text className="w-40 text-sm font-bold text-red-500 text-center">₹{row.pending || row.balance_amount || 0}</Text>
                        <Text className="w-40 text-sm font-medium text-gray-400 text-right">{row.lastTrans || row.last_payment_date || '-'}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );

    const renderWeeklyVelocityTable = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
                <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                    <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Interval Velocity</Text>
                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Duty Days</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Verified Presence</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Operational Hrs</Text>
                    <Text className="w-40 text-[10px] font-bold text-orange-400 uppercase tracking-wider text-center">OT Efficiency</Text>
                    <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Gross Disbursement</Text>
                </View>

                {isLoading ? (
                    <View className="py-8"><ActivityIndicator /></View>
                ) : weeklyVelocity.map((row, index) => (
                    <View key={row.id || index} className={`flex-row items-center px-6 py-4 ${index !== weeklyVelocity.length - 1 ? 'border-b border-gray-50' : ''}`}>
                        <View className="w-48 flex-row items-center">
                            <View className="p-1.5 bg-gray-100 rounded mr-2">
                                <Calendar size={12} color="#6B7280" />
                            </View>
                            <Text className="text-sm font-semibold text-gray-900">{row.cycle || `Week ${row.week || '-'}`}</Text>
                        </View>
                        <Text className="w-32 text-sm font-bold text-gray-400 text-center">{row.dutyDays || '-'}</Text>
                        <Text className="w-40 text-sm font-bold text-green-600 text-center">{row.verified || row.attendance_count || '-'}</Text>
                        <Text className="w-40 text-sm font-bold text-gray-400 text-center">{row.opsHrs || '-'}</Text>
                        <Text className="w-40 text-sm font-bold text-orange-400 text-center">{row.otEff || row.overtime_hours || '-'}</Text>
                        <Text className="w-48 text-sm font-bold text-gray-900 text-right">₹{row.gross || row.total_amount || 0}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <TopHeader 
                title="Financial Operations" 
                subtitle={`Engineer > ${activeProjectName} > Payroll`} 
            />
            
            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                
                {/* Header Section */}
                <View className="mb-6 flex-col md:flex-row md:items-center justify-between">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-xl font-bold text-gray-900">Workforce Disbursement Terminal</Text>
                        <Text className="text-sm text-gray-500 mt-1">Secure wage distribution and advance request management with full audit trails.</Text>
                    </View>
                    
                    <View className="flex-row items-center space-x-3">
                        <TouchableOpacity className="flex-row items-center px-4 py-2 border border-gray-200 rounded-lg bg-white mr-3">
                            <Calendar size={16} color="#6B7280" />
                            <Text className="ml-2 font-bold text-xs text-gray-600 tracking-wider">AUGUST 2026</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center px-6 py-2 bg-blue-600 rounded-lg shadow-sm shadow-blue-200">
                            <Text className="font-bold text-xs text-white uppercase tracking-wider">Generate Payroll</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Cards Row */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                    <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">Total Payout</Text>
                        <Text className="text-2xl font-bold text-green-600">₹3,098.75</Text>
                        <Text className="text-xs text-gray-400 mt-1">Disbursed Capital</Text>
                    </View>
                    <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">High Payouts</Text>
                        <Text className="text-2xl font-bold text-red-500">0</Text>
                        <Text className="text-xs text-gray-400 mt-1">Alert Count</Text>
                    </View>
                    <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">OT Intensive</Text>
                        <Text className="text-2xl font-bold text-blue-600">2</Text>
                        <Text className="text-xs text-gray-400 mt-1">High OT Workers</Text>
                    </View>
                    <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mr-4 w-64">
                        <Text className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">Advance Adjusted</Text>
                        <Text className="text-2xl font-bold text-orange-500">₹10.00</Text>
                        <Text className="text-xs text-gray-400 mt-1">Recovered Capital</Text>
                    </View>
                </ScrollView>

                {/* Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 border-b border-gray-200">
                    <View className="flex-row">
                        {tabs.map((tab) => (
                            <TouchableOpacity 
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                className={`px-5 py-2 mr-2 rounded-t-lg border-b-2 ${activeTab === tab ? 'bg-gray-900 border-gray-900' : 'bg-white border-transparent border border-gray-200'}`}
                            >
                                <Text className={`text-xs font-bold tracking-wider ${activeTab === tab ? 'text-white' : 'text-gray-500'}`}>{tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Table Container */}
                <View className="bg-white rounded-xl border border-gray-100 shadow-sm mb-8 overflow-hidden z-10">
                    {/* Toolbar */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4 border-b border-gray-100">
                        <View className="flex-row items-center w-full min-w-[800px]">
                            <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 mr-3 w-64">
                                <Search size={16} color="#9CA3AF" />
                                <TextInput
                                    placeholder="Search by workforce name or ID..."
                                    className="ml-2 flex-1 text-sm text-gray-700"
                                />
                            </View>
                            
                            <TouchableOpacity className="flex-row items-center px-4 py-2 border border-gray-200 rounded-lg bg-gray-50/50">
                                <Filter size={14} color="#6B7280" />
                                <Text className="ml-2 text-xs font-bold text-gray-700 uppercase">All Contractors v</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* Data Table */}
                    {activeTab === 'ACTIVE PAYROLL' && renderActivePayrollTable()}
                    {activeTab === 'PAYMENT HISTORY' && renderPaymentHistoryTable()}
                    {activeTab === 'CONTRACTOR PAYMENT PENDING' && renderContractorPaymentPendingTable()}
                    {activeTab === 'WEEKLY VELOCITY' && renderWeeklyVelocityTable()}

                    {/* Footer */}
                    <View className="px-6 py-4 border-t border-gray-100 flex-row justify-between items-center bg-gray-50/30">
                        <View className="flex-row items-center">
                            <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                            <View className="border border-gray-200 rounded px-2 py-1 bg-white">
                                <Text className="text-xs font-medium">10</Text>
                            </View>
                        </View>
                        <Text className="text-xs text-gray-500">Showing 1 - 6 of 6 records</Text>
                        <View className="flex-row">
                            <TouchableOpacity className="px-2 py-1 border border-gray-200 rounded mr-1 bg-white items-center justify-center">
                                <ChevronLeft size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                            <TouchableOpacity className="px-3 py-1 border border-blue-500 rounded bg-blue-600 mr-1 items-center justify-center shadow-sm shadow-blue-200">
                                <Text className="text-white font-bold text-xs">1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="px-2 py-1 border border-gray-200 rounded bg-white items-center justify-center">
                                <ChevronRight size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
