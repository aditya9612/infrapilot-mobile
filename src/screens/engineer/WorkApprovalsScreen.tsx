import TopHeader from '../../components/TopHeader';
import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Bell, Plus, Search, ChevronDown, RefreshCw, Check, X, Ban, Clock } from 'lucide-react-native';

export default function WorkApprovalsScreen() {
    const navigation = useNavigation();

    const StatCard = ({ title, value, subtitle, valueColor = 'text-gray-900', subtitleColor = 'text-gray-500' }: any) => (
        <View className="w-full sm:w-1/2 lg:w-1/4 p-2">
            <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full justify-center">
                <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">{title}</Text>
                <Text className={`text-2xl font-bold ${valueColor}`}>{value}</Text>
                <Text className={`text-[10px] mt-1 ${subtitleColor}`}>{subtitle}</Text>
            </View>
        </View>
    );

    const TableRow = ({ type, id, status, remarks, canApprove = false }: any) => (
        <View className="flex-row items-center px-6 py-4 border-b border-gray-50">
            <View className="flex-1">
                <Text className="font-bold text-gray-900 text-xs mb-1 uppercase">{type}</Text>
                <Text className="text-[10px] text-gray-400 font-medium uppercase">{id}</Text>
            </View>
            <View className="flex-1 items-center">
                {status === 'PENDING' && (
                    <View className="bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
                        <Text className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider">PENDING</Text>
                    </View>
                )}
                {status === 'APPROVED' && (
                    <View className="bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                        <Text className="text-[10px] font-bold text-green-600 uppercase tracking-wider">APPROVED</Text>
                    </View>
                )}
                {status === 'REJECTED' && (
                    <View className="bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                        <Text className="text-[10px] font-bold text-red-600 uppercase tracking-wider">REJECTED</Text>
                    </View>
                )}
            </View>
            <View className="flex-2 items-start justify-center pr-4">
                <Text className="text-xs font-medium text-gray-600">{remarks}</Text>
            </View>
            <View className="flex-1 flex-row justify-end items-center space-x-4">
                {canApprove ? (
                    <>
                        <TouchableOpacity className="w-6 h-6 rounded-full bg-green-50 items-center justify-center border border-green-200">
                            <Check size={12} color="#16A34A" />
                        </TouchableOpacity>
                        <TouchableOpacity className="w-6 h-6 rounded-full bg-red-50 items-center justify-center border border-red-200 ml-3">
                            <X size={12} color="#DC2626" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <View className="w-6 h-6 items-center justify-center mr-4">
                        <Ban size={14} color="#D1D5DB" />
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50 flex-col">
            
            <TopHeader title="Work Approvals" subtitle="{title}" />


            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
                {/* Secondary Header */}
                <View className="flex-row flex-wrap justify-between items-center mb-6">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-2xl font-bold text-gray-900">Approvals</Text>
                        <Text className="text-sm text-gray-500 mt-1">Technical clearance portal for critical site activities and execution milestones.</Text>
                    </View>
                    <View className="flex-row items-center space-x-3">
                        <TouchableOpacity className="bg-white border border-gray-300 flex-row items-center px-4 py-2.5 rounded-md mr-3">
                            <RefreshCw size={16} color="#4B5563" className="mr-2" />
                            <Text className="text-gray-700 font-bold text-sm">Refresh</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-blue-600 flex-row items-center px-4 py-2.5 rounded-md">
                            <Plus size={16} color="#FFF" className="mr-2" />
                            <Text className="text-white font-bold text-sm">Approvals</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Top Stats Cards */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard title="TOTAL LOGS" value="72" subtitle="Activity Baseline" valueColor="text-gray-900" />
                    <StatCard title="APPROVED" value="39" subtitle="Work Authorized" valueColor="text-green-500" />
                    <StatCard title="PENDING / REJECT" value="33" subtitle="Awaiting Clearance" valueColor="text-red-500" />
                    <StatCard title="CLEARANCE RATE" value="54%" subtitle="Avg Site Precision" valueColor="text-blue-500" />
                </View>

                {/* Data Table Area */}
                <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                    {/* Table Filters */}
                    <View className="p-4 border-b border-gray-100 flex-row flex-wrap items-center justify-between">
                        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 w-full md:w-1/3 lg:w-1/3 mb-4 md:mb-0">
                            <Search size={16} color="#9CA3AF" className="mr-2" />
                            <TextInput className="flex-1 font-medium text-sm text-gray-800" placeholder="Search by activity, ID or remarks..." placeholderTextColor="#9CA3AF" />
                        </View>
                        <View className="flex-row items-center space-x-4 w-full md:w-auto">
                            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">ACTIVE FILTER:</Text>
                            
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mr-3 justify-between min-w-[100px]">
                                <Text className="font-bold text-xs text-blue-600">SELECT</Text>
                                <ChevronDown size={14} color="#3B82F6" />
                            </View>
                            
                            <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mr-3 justify-between min-w-[100px]">
                                <Clock size={12} color="#3B82F6" className="mr-1.5" />
                                <Text className="font-bold text-xs text-blue-700">Latest First</Text>
                                <ChevronDown size={14} color="#3B82F6" className="ml-1" />
                            </View>

                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 justify-between min-w-[120px]">
                                <Text className="font-bold text-xs text-blue-600">All Categories</Text>
                                <ChevronDown size={14} color="#3B82F6" />
                            </View>
                        </View>
                    </View>
                    
                    {/* Responsive Table Wrapper */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} className="w-full">
                        <View className="min-w-[900px] flex-1">
                            {/* Table Header */}
                            <View className="flex-row items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
                                <Text className="flex-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">WORK AUTHORIZATION</Text>
                                <Text className="flex-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">STATUS</Text>
                                <Text className="flex-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">REMARKS</Text>
                                <Text className="flex-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">ACTIONS</Text>
                            </View>
                            
                            {/* Table Rows */}
                            <TableRow type="BOQ" id="AUTH LOG" status="APPROVED" remarks="approve" canApprove={false} />
                            <TableRow type="JOURNAL_ENTRY" id="AUTH LOG" status="PENDING" remarks="No technical narrative narrated" canApprove={true} />
                            <TableRow type="JOURNAL_ENTRY" id="AUTH LOG" status="PENDING" remarks="No technical narrative narrated" canApprove={true} />
                            <TableRow type="BOQ" id="AUTH LOG" status="APPROVED" remarks="Approved" canApprove={false} />
                            <TableRow type="BOQ" id="AUTH LOG" status="APPROVED" remarks="Approved" canApprove={false} />
                            <TableRow type="BOQ" id="AUTH LOG" status="APPROVED" remarks="gfghgh" canApprove={false} />
                            <TableRow type="DRAWING" id="AUTH LOG" status="PENDING" remarks="Approval requested for drawing: fan drawing" canApprove={true} />
                            <TableRow type="DRAWING" id="AUTH LOG" status="REJECTED" remarks="Reject" canApprove={false} />
                            <TableRow type="DRAWING" id="AUTH LOG" status="APPROVED" remarks="Approve" canApprove={false} />
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
}
