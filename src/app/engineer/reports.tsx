import TopHeader from '../../components/TopHeader';
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Bell, RefreshCw, Filter, Search, Calendar as CalendarIcon, ChevronDown, Download, FileText, FileSpreadsheet, Eye, ClipboardList, Users, Package, AlertTriangle } from 'lucide-react-native';

export default function ReportsScreen() {
    const navigation = useNavigation();

    const StatCard = ({ title, value, subtitle, valueColor = 'text-blue-600' }: any) => (
        <View className="w-full sm:w-1/2 lg:w-1/4 p-2">
            <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full">
                <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">{title}</Text>
                <Text className={`text-2xl font-bold ${valueColor}`}>{value}</Text>
                <Text className="text-xs text-gray-500 mt-2">{subtitle}</Text>
            </View>
        </View>
    );

    const ReportCard = ({ icon: Icon, iconColor, title, size, description, stats, timestamp }: any) => (
        <View className="w-full lg:w-1/3 p-3">
            <View className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full flex-col">
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-row items-center">
                        <View className={`w-10 h-10 rounded-lg items-center justify-center mr-3 bg-gray-50 border border-gray-100`}>
                            <Icon size={20} color={iconColor} />
                        </View>
                        <View>
                            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">DAILY</Text>
                            <Text className="font-bold text-gray-900 text-base">{title}</Text>
                        </View>
                    </View>
                    <Text className="text-xs font-medium text-gray-400">{size}</Text>
                </View>
                
                <Text className="text-xs text-gray-600 mb-5 leading-relaxed">{description}</Text>
                
                <View className="flex-row flex-wrap -mx-2 mb-4 flex-1">
                    {stats.map((stat: any, index: number) => (
                        <View key={index} className="w-1/2 p-2 mb-1">
                            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</Text>
                            <Text className="font-bold text-gray-900 text-sm">{stat.value}</Text>
                        </View>
                    ))}
                </View>
                
                <View className="pt-4 border-t border-gray-100 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                        <Text className="text-xs text-gray-500">{timestamp}</Text>
                    </View>
                    <View className="flex-row items-center space-x-2">
                        <TouchableOpacity className="w-8 h-8 rounded-full items-center justify-center border border-gray-200 mr-2">
                            <Eye size={14} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center border border-red-200 bg-red-50 px-3 py-1.5 rounded-full mr-2">
                            <FileText size={12} color="#DC2626" className="mr-1.5" />
                            <Text className="text-red-600 font-bold text-xs">PDF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center bg-blue-600 px-3 py-1.5 rounded-full">
                            <FileSpreadsheet size={12} color="#FFF" className="mr-1.5" />
                            <Text className="text-white font-bold text-xs">Excel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50 flex-col">
            
            <TopHeader title="Reports" subtitle="{title}" />


            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
                {/* Secondary Header */}
                <View className="flex-row flex-wrap justify-between items-center mb-6">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-2xl font-bold text-gray-900">Reports</Text>
                        <Text className="text-sm text-gray-500 mt-1">Generate, view, and export daily, weekly, labour, material, and issue reports.</Text>
                    </View>
                    <TouchableOpacity className="bg-blue-600 flex-row items-center px-4 py-2.5 rounded-md self-start">
                        <RefreshCw size={16} color="#FFF" className="mr-2" />
                        <Text className="text-white font-medium text-sm">Refresh Reports</Text>
                    </TouchableOpacity>
                </View>

                {/* Top Stats Cards */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard title="TOTAL REPORTS" value="7" subtitle="Available in Catalog" valueColor="text-blue-600" />
                    <StatCard title="GENERATED TODAY" value="2" subtitle="Recent Site Logs" valueColor="text-emerald-500" />
                    <StatCard title="AVG. REPORT SIZE" value="4.7 MB" subtitle="Inventory Volume" valueColor="text-amber-500" />
                    <StatCard title="OPEN ISSUES" value="14" subtitle="High Priority Items" valueColor="text-rose-500" />
                </View>

                {/* Filter Bar */}
                <ScrollView horizontal showsHorizontalScrollIndicator={true} className="w-full mb-6">
                    <View className="min-w-[900px] flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-row items-center justify-between">
                        <View className="flex-row items-center mr-6">
                            <View className="w-10 h-10 bg-blue-600 rounded-lg items-center justify-center mr-3 shadow-sm">
                                <Filter size={20} color="#FFF" />
                            </View>
                            <Text className="font-bold text-gray-900 text-sm">Report Catalog Filter</Text>
                        </View>
                        
                        <View className="flex-row items-center flex-1 space-x-4 mr-6">
                            <View className="flex-1 min-w-[200px]">
                                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">SEARCH</Text>
                                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                                    <Search size={16} color="#9CA3AF" className="mr-2" />
                                    <TextInput className="flex-1 font-medium text-sm text-gray-800" placeholder="Search reports..." placeholderTextColor="#9CA3AF" />
                                </View>
                            </View>
                            
                            <View className="w-36">
                                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">START DATE</Text>
                                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                                    <Text className="flex-1 font-medium text-sm text-gray-800">23-08-2026</Text>
                                    <CalendarIcon size={16} color="#4B5563" className="ml-2" />
                                </View>
                            </View>
                            
                            <View className="w-36">
                                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">END DATE</Text>
                                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                                    <Text className="flex-1 font-medium text-sm text-gray-800">23-08-2026</Text>
                                    <CalendarIcon size={16} color="#4B5563" className="ml-2" />
                                </View>
                            </View>
                            
                            <View className="w-32">
                                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">FREQUENCY</Text>
                                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 justify-between">
                                    <Text className="font-medium text-sm text-gray-800">daily</Text>
                                    <ChevronDown size={16} color="#4B5563" className="ml-2" />
                                </View>
                            </View>
                        </View>
                        
                        <View className="flex-row items-center border-l border-gray-100 pl-4 justify-end">
                            <TouchableOpacity className="flex-row items-center bg-blue-600 px-4 py-2 rounded-lg mr-3">
                                <FileText size={14} color="#FFF" className="mr-2" />
                                <Text className="text-white font-bold text-sm">PDF</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center bg-white border border-gray-300 px-4 py-2 rounded-lg">
                                <Download size={14} color="#4B5563" className="mr-2" />
                                <Text className="text-gray-700 font-bold text-sm">Export</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/* Reports Grid */}
                <View className="flex-row flex-wrap -mx-3">
                    <ReportCard 
                        icon={ClipboardList} iconColor="#F59E0B"
                        title="Daily Report" size="1.2 MB"
                        description="Full summary of today's site operations — labour deployed, work completed, materials consumed, and any issues logged."
                        stats={[
                            { label: 'TOTAL LABOUR', value: '5 Labour' },
                            { label: 'SKILLED', value: '5' },
                            { label: 'WEATHER', value: 'Sunny' },
                            { label: 'LOCATION', value: 'Bhor, Pune District, Maharashtra, 412213, India' },
                        ]}
                        timestamp="Generated: 10:03 AM"
                    />
                    
                    <ReportCard 
                        icon={Users} iconColor="#F59E0B"
                        title="Labour Report" size="0.8 MB"
                        description="Workforce breakdown by skill category, attendance, overtime, and contractor-wise deployment summary."
                        stats={[
                            { label: 'SKILLED LABOUR', value: '45' },
                            { label: 'UNSKILLED LABOUR', value: '88' },
                            { label: 'SUPERVISORS', value: '9' },
                            { label: 'OVERTIME HOURS', value: '24 hrs' },
                        ]}
                        timestamp="Today, 07:15 AM"
                    />
                    
                    <ReportCard 
                        icon={Package} iconColor="#EF4444"
                        title="Material Consumption" size="2.1 MB"
                        description="Inflow vs outflow reconciliation for all materials — cement, steel, aggregates — with stock closing balances."
                        stats={[
                            { label: 'TOTAL STOCK ITEMS', value: '24' },
                            { label: 'STOCK QTY', value: '1987.0' },
                            { label: 'STOCK VALUE', value: '₹1230.4k' },
                            { label: 'STATUS', value: 'Updated' },
                        ]}
                        timestamp="Yesterday, 05:45 PM"
                    />
                    
                    <ReportCard 
                        icon={AlertTriangle} iconColor="#F59E0B"
                        title="Issue Report" size="0.5 MB"
                        description="Logged site issues, safety observations, delays, and their current resolution status and priority levels."
                        stats={[
                            { label: 'OPEN ISSUES', value: '14' },
                            { label: 'CRITICAL', value: '5' },
                            { label: 'RESOLVED', value: '4' },
                            { label: 'TOTAL', value: '18' },
                        ]}
                        timestamp="Today, 11:30 AM"
                    />
                </View>
            </ScrollView>
        </View>
    );
}
