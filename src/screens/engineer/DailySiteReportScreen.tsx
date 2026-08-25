import TopHeader from '../../components/TopHeader';
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Bell, Plus, Search, ChevronDown, FileText, FileSpreadsheet, RefreshCw, Image as ImageIcon, Edit3, Eye, CheckCircle, BarChart2, Activity, AlertTriangle } from 'lucide-react-native';

export default function DailySiteReportScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('ledger');

    const StatCard = ({ title, value, subtitle, valueColor = 'text-gray-900', subtitleColor = 'text-gray-500' }: any) => (
        <View className="w-full sm:w-1/2 lg:w-1/4 p-2">
            <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full justify-center">
                <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">{title}</Text>
                <Text className={`text-2xl font-bold ${valueColor}`}>{value}</Text>
                <Text className={`text-[10px] mt-1 ${subtitleColor}`}>{subtitle}</Text>
            </View>
        </View>
    );

    const DsrRow = ({ date, title, location, contractor, user, status }: any) => (
        <View className="flex-row items-center px-6 py-4 border-b border-gray-50">
            <View className="flex-1 lg:w-1/6">
                <Text className="font-bold text-gray-900 text-xs mb-1">{date}</Text>
                <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">DAILY LEDGER</Text>
            </View>
            <View className="flex-2 lg:w-1/3">
                <Text className="font-bold text-gray-800 text-xs mb-1">{title}</Text>
                <Text className="text-[10px] text-gray-500">{location}</Text>
            </View>
            <View className="flex-1 lg:w-1/5">
                <Text className="text-xs font-bold text-gray-700 mb-1">Contractor: <Text className="text-blue-600">{contractor}</Text></Text>
                <Text className="text-[10px] text-gray-500">By: {user}</Text>
            </View>
            <View className="flex-1 lg:w-1/6 items-center">
                {status === 'DRAFT' && (
                    <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">DRAFT</Text>
                )}
                {status === 'SUBMITTED' && (
                    <View className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                        <Text className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">SUBMITTED</Text>
                    </View>
                )}
            </View>
            <View className="flex-1 lg:w-1/12 items-center">
                <View className="w-8 h-8 rounded bg-gray-50 border border-gray-100 items-center justify-center">
                    <ImageIcon size={14} color="#D1D5DB" />
                </View>
            </View>
            <View className="flex-1 lg:w-1/6 flex-row justify-end items-center space-x-3">
                <TouchableOpacity className="w-6 h-6 rounded-full bg-blue-50 items-center justify-center border border-blue-100">
                    <CheckCircle size={12} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity className="p-1 mx-2">
                    <Eye size={14} color="#9CA3AF" />
                </TouchableOpacity>
                <TouchableOpacity className="p-1">
                    <Edit3 size={14} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50 flex-col">
            
            <TopHeader title="Daily Site Reports" subtitle="{title}" />


            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
                {/* Secondary Header */}
                <View className="flex-row flex-wrap justify-between items-center mb-6">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-2xl font-bold text-gray-900">Project Daily Ledger</Text>
                        <Text className="text-xs text-gray-500 mt-1">Historical record of activities, labour, and material movements.</Text>
                    </View>
                    <View className="flex-row items-center space-x-3">
                        <TouchableOpacity className="w-10 h-10 bg-white border border-gray-200 rounded-lg items-center justify-center mr-2">
                            <RefreshCw size={16} color="#4B5563" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-red-50 border border-red-200 flex-row items-center px-4 py-2.5 rounded-md mr-2">
                            <FileText size={14} color="#DC2626" className="mr-2" />
                            <Text className="text-red-700 font-bold text-sm">Export PDF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-emerald-50 border border-emerald-200 flex-row items-center px-4 py-2.5 rounded-md mr-3">
                            <FileSpreadsheet size={14} color="#059669" className="mr-2" />
                            <Text className="text-emerald-700 font-bold text-sm">Export Excel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-blue-600 flex-row items-center px-4 py-2.5 rounded-md">
                            <Plus size={16} color="#FFF" className="mr-2" />
                            <Text className="text-white font-bold text-sm">New Entry</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Top Stats Cards */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard title="TOTAL LOGS" value="13" subtitle="All Time Records" valueColor="text-gray-900" />
                    <StatCard title="DRAFT REPORTS" value="8" subtitle="Pending Submission" valueColor="text-gray-600" />
                    <StatCard title="SUBMITTED REPORTS" value="3" subtitle="Pending Audit" valueColor="text-blue-500" />
                    <StatCard title="APPROVED REPORTS" value="2" subtitle="Verified & Approved" valueColor="text-green-500" />
                </View>

                {/* Tabs */}
                <View className="flex-row items-center mb-8">
                    <TouchableOpacity 
                        onPress={() => setActiveTab('ledger')}
                        className={`px-6 py-2.5 rounded-xl ${activeTab === 'ledger' ? 'bg-white shadow-sm border border-gray-100' : 'bg-gray-100'}`}
                    >
                        <Text className={`font-bold text-xs ${activeTab === 'ledger' ? 'text-blue-600' : 'text-gray-500'}`}>DSR Ledger</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setActiveTab('analytics')}
                        className={`px-6 py-2.5 rounded-xl ml-2 ${activeTab === 'analytics' ? 'bg-white shadow-sm border border-gray-100' : 'bg-transparent'}`}
                    >
                        <Text className={`font-bold text-xs ${activeTab === 'analytics' ? 'text-blue-600' : 'text-gray-500'}`}>Analytics Overview</Text>
                    </TouchableOpacity>
                </View>

                {/* Content Area */}
                {activeTab === 'ledger' ? (
                    <View>
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">DSR LEDGER</Text>
                        
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                            {/* Table Filters */}
                            <View className="p-4 border-b border-gray-50 flex-row flex-wrap items-center">
                                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 w-full md:w-1/3 lg:w-1/4 mr-4">
                                    <Search size={16} color="#9CA3AF" className="mr-2" />
                                    <TextInput className="flex-1 font-medium text-xs text-gray-800" placeholder="Search by activity, location or ID..." placeholderTextColor="#9CA3AF" />
                                </View>
                                <View className="flex-row items-center">
                                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-3">STATUS:</Text>
                                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 justify-between min-w-[120px]">
                                        <Text className="font-bold text-xs text-gray-800">ALL STATUS</Text>
                                        <ChevronDown size={14} color="#4B5563" />
                                    </View>
                                </View>
                            </View>
                            
                            {/* Responsive Table Wrapper */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={true} className="w-full">
                                <View className="min-w-[900px] flex-1">
                                    {/* Table Header */}
                                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                        <Text className="flex-1 lg:w-1/6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">REPORT DETAILS</Text>
                                        <Text className="flex-2 lg:w-1/3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">WORK SUMMARY</Text>
                                        <Text className="flex-1 lg:w-1/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">PERSONNEL</Text>
                                        <Text className="flex-1 lg:w-1/6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">STATUS</Text>
                                        <Text className="flex-1 lg:w-1/12 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">SITE MEDIA</Text>
                                        <Text className="flex-1 lg:w-1/6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">ACTIONS</Text>
                                    </View>
                                    
                                    {/* Table Rows */}
                                    <DsrRow date="2026-08-21" title="site monitoring" location="Bhor, Pune District, Maharashtra, 412213, India" contractor="-" user="Amit patil" status="DRAFT" />
                                    <DsrRow date="2026-08-20" title="wall mounting" location="" contractor="-" user="Amit patil" status="DRAFT" />
                                    <DsrRow date="2026-08-19" title="site wall filling" location="Bundi Garden T.P.S, Ghorpari, Pune, Pune City Subdistr..." contractor="-" user="Amit patil" status="SUBMITTED" />
                                    <DsrRow date="2026-08-18" title="site watering work done" location="" contractor="-" user="Amit patil" status="DRAFT" />
                                    <DsrRow date="2026-08-17" title="site visit" location="SH188, Bamnoda, Yawal, Jalgaon District, Maharashtra..." contractor="KOMAL BHA..." user="Amit patil" status="DRAFT" />
                                    <DsrRow date="2026-08-16" title="site visite work done" location="SH188, Bamnoda, Yawal, Jalgaon District, Maharashtra..." contractor="KOMAL BHA..." user="Amit patil" status="DRAFT" />
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                ) : (
                    <View>
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">ANALYTICS OVERVIEW</Text>
                        
                        <View className="flex-row flex-wrap -mx-2">
                            {/* Line Chart Mock */}
                            <View className="w-full lg:w-5/12 p-2">
                                <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-64 flex-col">
                                    <View className="flex-row items-center mb-6">
                                        <Activity size={16} color="#3B82F6" className="mr-2" />
                                        <Text className="font-bold text-gray-800 text-sm">Labour Trend</Text>
                                    </View>
                                    <View className="flex-1 border-l border-b border-gray-200 relative pt-4 pl-2 flex-col justify-end">
                                        <View className="flex-row justify-between h-32 items-end px-2">
                                            {/* Mock Chart Line Points */}
                                            <View className="w-2 h-2 rounded-full bg-blue-500 mb-0" />
                                            <View className="w-2 h-2 rounded-full bg-blue-500 mb-2" />
                                            <View className="w-2 h-2 rounded-full bg-blue-500 mb-2" />
                                            <View className="w-2 h-2 rounded-full bg-blue-500 mb-2" />
                                            <View className="w-2 h-2 rounded-full bg-blue-500 mb-10" />
                                            <View className="w-2 h-2 rounded-full bg-blue-500 mb-20" />
                                            <View className="w-2 h-2 rounded-full bg-blue-500 mb-20" />
                                            <View className="w-2 h-2 rounded-full bg-blue-500 mb-20" />
                                            <View className="w-2 h-2 rounded-full bg-blue-500 mb-20" />
                                            <View className="w-2 h-2 rounded-full bg-blue-500 mb-20" />
                                        </View>
                                        <View className="absolute inset-0 top-12 border-t border-dashed border-gray-200 z-0" />
                                    </View>
                                    <View className="flex-row justify-between px-2 mt-2">
                                        <Text className="text-[9px] text-gray-400">Jul 15</Text>
                                        <Text className="text-[9px] text-gray-400">Aug 12</Text>
                                        <Text className="text-[9px] text-gray-400">Aug 21</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Bar Chart Mock */}
                            <View className="w-full lg:w-4/12 p-2">
                                <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-64 flex-col">
                                    <View className="flex-row items-center mb-6">
                                        <BarChart2 size={16} color="#10B981" className="mr-2" />
                                        <Text className="font-bold text-gray-800 text-sm">Contractor Performance</Text>
                                    </View>
                                    <View className="flex-1 border-l border-b border-gray-200 flex-row items-end justify-around pb-0">
                                        <View className="items-center">
                                            <View className="w-6 h-24 bg-emerald-500 rounded-t-sm" />
                                            <Text className="text-[8px] text-gray-400 mt-2 uppercase">KOMAL BH...</Text>
                                        </View>
                                        <View className="items-center">
                                            <View className="w-6 h-12 bg-emerald-500 rounded-t-sm" />
                                            <Text className="text-[8px] text-gray-400 mt-2 uppercase">Unknown</Text>
                                        </View>
                                    </View>
                                    <View className="mt-4 pt-3 border-t border-gray-50 flex-row justify-between">
                                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CONTRACTOR</Text>
                                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ENTRIES</Text>
                                    </View>
                                    <View className="flex-row justify-between mt-2">
                                        <Text className="text-xs font-bold text-gray-700 uppercase">KOMAL BHANGALE</Text>
                                        <Text className="text-xs font-bold text-emerald-600">8</Text>
                                    </View>
                                    <View className="flex-row justify-between mt-1">
                                        <Text className="text-xs font-medium text-gray-500">Unknown</Text>
                                        <Text className="text-xs font-bold text-emerald-600">5</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Issue Analytics Mock */}
                            <View className="w-full lg:w-3/12 p-2">
                                <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-64 flex-col">
                                    <View className="flex-row items-center mb-6">
                                        <AlertTriangle size={16} color="#EF4444" className="mr-2" />
                                        <Text className="font-bold text-gray-800 text-sm">Issue Analytics</Text>
                                    </View>
                                    
                                    <View className="flex-row space-x-3 h-20 mb-4">
                                        <View className="flex-1 bg-red-50 border border-red-100 rounded-lg items-center justify-center">
                                            <Text className="text-2xl font-bold text-red-600">13</Text>
                                            <Text className="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-1">TOTAL REPORTS</Text>
                                        </View>
                                        <View className="flex-1 bg-amber-50 border border-amber-100 rounded-lg items-center justify-center ml-2">
                                            <Text className="text-2xl font-bold text-amber-500">8</Text>
                                            <Text className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mt-1">WITH ISSUES</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
