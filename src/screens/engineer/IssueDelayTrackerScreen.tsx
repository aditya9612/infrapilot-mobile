import TopHeader from '../../components/TopHeader';
import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Bell, Search, ChevronDown, Filter, FileText, Download, Plus, Info } from 'lucide-react-native';

export default function IssueTrackerScreen() {
    const navigation = useNavigation();

    const StatCard = ({ title, value, subtitle, valueColor = "text-gray-900", titleColor = "text-gray-400" }: any) => (
        <View className="flex-1 min-w-[200px] p-2">
            <View className="bg-white p-5 rounded-xl border border-gray-200 h-full justify-center">
                <Text className={`text-[10px] font-bold ${titleColor} uppercase tracking-widest mb-1`}>{title}</Text>
                <Text className={`text-3xl font-bold ${valueColor}`}>{value}</Text>
                <Text className="text-[10px] font-medium text-gray-400 mt-2">{subtitle}</Text>
            </View>
        </View>
    );

    const Badge = ({ type, text }: any) => {
        let colors = "";
        if (type === 'OPEN') colors = "bg-rose-50 border-rose-100 text-rose-500";
        if (type === 'CLOSED') colors = "bg-emerald-50 border-emerald-100 text-emerald-500";
        if (type === 'LOW') colors = "bg-emerald-50 border-emerald-100 text-emerald-500";
        if (type === 'MEDIUM') colors = "bg-amber-50 border-amber-100 text-amber-500";
        if (type === 'HIGH') colors = "bg-rose-50 border-rose-100 text-rose-600";

        return (
            <View className={`px-3 py-1 rounded-sm border ${colors}`}>
                <Text className={`text-[9px] font-bold uppercase tracking-wider ${colors.split(' ').pop()}`}>{text}</Text>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#F8FAFC] flex-col">
            
            <TopHeader title="Issue Tracker" subtitle="Engineer • Site Constraints • Issue Log" />


            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
                {/* Header & Main Actions */}
                <View className="flex-row flex-wrap justify-between items-center mb-6">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-2xl font-bold text-gray-900">Constraint Management Vault</Text>
                        <Text className="text-xs text-gray-500 mt-1">Identify, track, and resolve site impediments to ensure project flow.</Text>
                    </View>
                    
                    <View className="flex-row items-center space-x-3">
                        <TouchableOpacity className="bg-rose-50 border border-rose-100 flex-row items-center px-4 py-2 rounded-lg">
                            <FileText size={14} color="#E11D48" className="mr-2" />
                            <Text className="text-rose-600 font-bold text-xs">PDF Report</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-emerald-50 border border-emerald-100 flex-row items-center px-4 py-2 rounded-lg">
                            <Download size={14} color="#059669" className="mr-2" />
                            <Text className="text-emerald-600 font-bold text-xs">Excel Sheet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-blue-600 flex-row items-center px-4 py-2 rounded-lg shadow-sm">
                            <Plus size={16} color="#FFF" className="mr-2" />
                            <Text className="text-white font-bold text-sm">Log Issue</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Row */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard title="TOTAL LOGS" value="18" subtitle="Project Archive" />
                    <StatCard title="PENDING" value="14" subtitle="Action Required" valueColor="text-rose-500" titleColor="text-gray-400" />
                    <StatCard title="HIGH PRIORITY" value="5" subtitle="Critical Impact" valueColor="text-amber-500" titleColor="text-gray-400" />
                    <StatCard title="RESOLVED" value="4" subtitle="Resolution Rate" valueColor="text-emerald-500" titleColor="text-gray-400" />
                </View>

                {/* Main Content Area */}
                <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                    
                    {/* Filters Toolbar */}
                    <View className="p-4 border-b border-gray-100 flex-row flex-wrap items-center">
                        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 min-w-[250px] mr-4 mb-3 lg:mb-0">
                            <Search size={16} color="#9CA3AF" className="mr-2" />
                            <TextInput className="flex-1 font-medium text-sm text-gray-800" placeholder="Search by title or description..." placeholderTextColor="#9CA3AF" />
                        </View>
                        
                        <Filter size={16} color="#9CA3AF" className="mr-3 mb-3 lg:mb-0" />
                        
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-4 py-2 justify-between min-w-[140px] mr-3 mb-3 lg:mb-0">
                            <Text className="font-bold text-xs text-gray-700">ALL STATUS</Text>
                            <ChevronDown size={14} color="#4B5563" className="ml-2" />
                        </View>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-4 py-2 justify-between min-w-[140px] mr-3 mb-3 lg:mb-0">
                            <Text className="font-bold text-xs text-gray-700">ALL PRIORITY</Text>
                            <ChevronDown size={14} color="#4B5563" className="ml-2" />
                        </View>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-4 py-2 justify-between min-w-[160px] mb-3 lg:mb-0">
                            <Text className="font-bold text-xs text-gray-700">ALL CATEGORIES</Text>
                            <ChevronDown size={14} color="#4B5563" className="ml-2" />
                        </View>
                    </View>

                    {/* Responsive Data Table */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} className="w-full">
                        <View className="min-w-[1000px] flex-1">
                            {/* Table Header */}
                            <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                <Text className="w-1/3 text-[9px] font-bold text-gray-400 uppercase tracking-widest">ISSUE IDENTIFIER</Text>
                                <Text className="w-1/6 text-[9px] font-bold text-gray-400 uppercase tracking-widest">STATUS PROFILE</Text>
                                <Text className="w-1/6 text-[9px] font-bold text-gray-400 uppercase tracking-widest">PRIORITY LEVEL</Text>
                                <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">TIMELINE AUDIT</Text>
                                <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">ACTIONS</Text>
                            </View>

                            {/* Dummy Rows */}
                            {[
                                { t: 'issue5', c: 'MATERIAL', s: 'OPEN', pr: 'MEDIUM', d: '2026-08-22' },
                                { t: 'clean issue new', c: 'MATERIAL', s: 'OPEN', pr: 'LOW', d: '2026-08-20' },
                                { t: '7uliku', c: 'MATERIAL', s: 'OPEN', pr: 'MEDIUM', d: '2026-08-20' },
                                { t: 'kkkkkkkkkkkkkkkkkk', c: 'MATERIAL', s: 'OPEN', pr: 'HIGH', d: '2026-08-20' },
                                { t: 'visity issue', c: 'MATERIAL', s: 'CLOSED', pr: 'LOW', d: '2026-08-20' },
                                { t: 'visit issue', c: 'MATERIAL', s: 'CLOSED', pr: 'LOW', d: '2026-08-18' },
                                { t: 'new material arrival', c: 'MATERIAL', s: 'OPEN', pr: 'MEDIUM', d: '2026-08-18' },
                                { t: 'vbncbvgvb', c: 'SAFETY', s: 'OPEN', pr: 'LOW', d: '2026-08-17' },
                            ].map((row, i) => (
                                <View key={i} className="flex-row items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50">
                                    <View className="w-1/3 pr-4">
                                        <Text className="text-xs font-bold text-gray-900 mb-1">{row.t}</Text>
                                        <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{row.c}</Text>
                                    </View>
                                    <View className="w-1/6">
                                        <Badge type={row.s} text={row.s} />
                                    </View>
                                    <View className="w-1/6">
                                        <Badge type={row.pr} text={row.pr} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-[10px] font-bold text-gray-700 mb-1">{row.d}</Text>
                                        <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">REPORTED</Text>
                                    </View>
                                    <View className="w-24 flex-row justify-end pr-2">
                                        <Info size={14} color="#9CA3AF" />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
}
