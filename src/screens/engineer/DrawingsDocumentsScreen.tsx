import TopHeader from '../../components/TopHeader';
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Bell, Search, ChevronDown, Plus, RefreshCw, FileImage, Info, Edit3, Download, Clock } from 'lucide-react-native';

export default function DrawingsDocumentsScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('drawings');

    const StatCard = ({ title, value, subtitle }: any) => (
        <View className="flex-1 min-w-[200px] p-2">
            <View className="bg-white p-5 rounded-xl border border-gray-200 h-full justify-center">
                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</Text>
                <Text className="text-3xl font-bold text-indigo-900">{value}</Text>
                <Text className="text-[10px] font-medium text-gray-400 mt-2">{subtitle}</Text>
            </View>
        </View>
    );

    const Badge = ({ text }: any) => {
        let colors = "bg-gray-50 border-gray-200 text-gray-500";
        if (text === 'UNDER REVIEW' || text === 'PENDING') colors = "bg-blue-50 border-blue-100 text-blue-500";
        if (text === 'APPROVED') colors = "bg-emerald-50 border-emerald-100 text-emerald-500";

        return (
            <View className={`px-3 py-1 rounded-full border ${colors}`}>
                <Text className={`text-[9px] font-bold uppercase tracking-wider ${colors.split(' ').pop()}`}>{text}</Text>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#F8FAFC] flex-col">
            
            <TopHeader title="Drawings & Documents" subtitle="Engineer • Document Vault • Blueprints" />


            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
                {/* Header & Main Actions */}
                <View className="flex-row flex-wrap justify-between items-center mb-6">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-2xl font-bold text-gray-900">Engineering Document Vault</Text>
                        <Text className="text-xs text-gray-500 mt-1">Centralized repository for structural blueprints and technical revisions.</Text>
                    </View>
                    
                    <View className="flex-row items-center space-x-4">
                        <TouchableOpacity>
                            <RefreshCw size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-blue-600 flex-row items-center px-4 py-2.5 rounded-lg shadow-sm">
                            <Plus size={16} color="#FFF" className="mr-2" />
                            <Text className="text-white font-bold text-sm">{activeTab === 'drawings' ? 'Upload Drawing' : 'Upload Document'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Row */}
                {activeTab === 'drawings' ? (
                    <View className="flex-row flex-wrap -mx-2 mb-6">
                        <StatCard title="ALL FILES" value="12" subtitle="Total Assets" />
                        <StatCard title="DRAWINGS" value="11" subtitle="Images & CAD" />
                    </View>
                ) : (
                    <View className="flex-row flex-wrap -mx-2 mb-6">
                        <StatCard title="TOTAL STORAGE BYTES" value="251504" subtitle="Total Consumption" />
                        <StatCard title="TOTAL STORAGE GB" value="0" subtitle="Total Consumption GB" />
                        <StatCard title="PENDING APPROVALS" value="12" subtitle="Awaiting Review" />
                        <StatCard title="TOTAL DOCUMENTS" value="12" subtitle="All Vault Assets" />
                    </View>
                )}

                {/* Tabs */}
                <View className="flex-row mb-6">
                    <TouchableOpacity onPress={() => setActiveTab('drawings')} className={`px-5 py-2.5 rounded-full mr-2 ${activeTab === 'drawings' ? 'bg-white shadow-sm border border-gray-200' : 'bg-transparent'}`}>
                        <Text className={`text-sm font-bold ${activeTab === 'drawings' ? 'text-gray-900' : 'text-gray-500'}`}>Drawings List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('documents')} className={`px-5 py-2.5 rounded-full ${activeTab === 'documents' ? 'bg-white shadow-sm border border-gray-200' : 'bg-transparent'}`}>
                        <Text className={`text-sm font-bold ${activeTab === 'documents' ? 'text-gray-900' : 'text-gray-500'}`}>Documents List</Text>
                    </TouchableOpacity>
                </View>

                {/* Main Content Area */}
                <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                    
                    {/* Filters Toolbar */}
                    <View className="p-4 border-b border-gray-100 flex-row flex-wrap items-center">
                        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 min-w-[280px] mr-4 mb-3 lg:mb-0">
                            <Search size={16} color="#9CA3AF" className="mr-2" />
                            <TextInput className="flex-1 font-medium text-sm text-gray-800" placeholder="Search by document name or ID..." placeholderTextColor="#9CA3AF" />
                        </View>
                        
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-4 py-2.5 justify-between min-w-[140px] mb-3 lg:mb-0">
                            <Text className="font-bold text-xs text-gray-700">Latest First</Text>
                            <ChevronDown size={14} color="#4B5563" className="ml-2" />
                        </View>
                    </View>

                    {/* Responsive Data Table */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} className="w-full">
                        
                        {activeTab === 'drawings' && (
                            <View className="min-w-[1100px] flex-1">
                                {/* Table Header */}
                                <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                    <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-widest">ASSET</Text>
                                    <Text className="w-2/5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">ENGINEERING ASSET</Text>
                                    <Text className="w-1/6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">VERSION PROFILE</Text>
                                    <Text className="w-1/6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">APPROVAL STATUS</Text>
                                    <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">VAULT DATE</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">ACTIONS</Text>
                                </View>

                                {/* Dummy Rows */}
                                {[
                                    { t: 'fan drawing', u: 'UPLOADS/DRAWINGS/91B...0D0.PNG', s: 'UNDER REVIEW', d: '2026-08-21' },
                                    { t: 'new dr', u: 'UPLOADS/DRAWINGS/235...823.PNG', s: 'APPROVED', d: '2026-08-21' },
                                    { t: 'site clean drawing', u: 'UPLOADS/DRAWINGS/8R6...DF0.PNG', s: 'APPROVED', d: '2026-08-20' },
                                    { t: 'tfghfgh', u: 'UPLOADS/DRAWINGS/FB0...746.PNG', s: 'APPROVED', d: '2026-08-18' },
                                    { t: 'rcc work', u: 'UPLOADS/DRAWINGS/411...F20.PNG', s: 'UNDER REVIEW', d: '2026-08-18' },
                                    { t: 'board painting designs', u: 'UPLOADS/DRAWINGS/472...091.PNG', s: 'APPROVED', d: '2026-08-10' },
                                ].map((row, i) => (
                                    <View key={i} className="flex-row items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50">
                                        <View className="w-24">
                                            <View className="w-10 h-12 bg-purple-50 border border-purple-100 rounded items-center justify-center">
                                                <Text className="text-[10px] font-bold text-purple-600 mb-1">IMG</Text>
                                                <FileImage size={12} color="#9333EA" />
                                            </View>
                                        </View>
                                        <View className="w-2/5 pr-4">
                                            <Text className="text-xs font-bold text-gray-900 mb-1">{row.t}</Text>
                                            <Text className="text-[9px] font-bold text-gray-400 tracking-widest uppercase" numberOfLines={1}>{row.u}</Text>
                                        </View>
                                        <View className="w-1/6 items-center">
                                            <View className="bg-gray-100 px-3 py-1 rounded-sm border border-gray-200">
                                                <Text className="text-[10px] font-bold text-gray-600">V1</Text>
                                            </View>
                                        </View>
                                        <View className="w-1/6 items-center">
                                            <Badge text={row.s} />
                                        </View>
                                        <View className="flex-1 items-center">
                                            <Text className="text-[10px] font-bold text-gray-700">{row.d}</Text>
                                        </View>
                                        <View className="w-32 flex-row justify-end space-x-3 pr-2">
                                            <Info size={14} color="#9CA3AF" />
                                            <Edit3 size={14} color="#9CA3AF" />
                                            <Download size={14} color="#9CA3AF" />
                                            <Clock size={14} color="#6366F1" />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        {activeTab === 'documents' && (
                            <View className="min-w-[1400px] flex-1">
                                {/* Table Header */}
                                <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                    <Text className="w-40 text-[9px] font-bold text-gray-400 uppercase tracking-widest">PROJECT_NAME</Text>
                                    <Text className="w-48 text-[9px] font-bold text-gray-400 uppercase tracking-widest">TITLE</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-widest">DOCUMENT_TYPE</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">VERSION</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">STATUS</Text>
                                    <Text className="w-48 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">UPLOADED_AT</Text>
                                    <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">REMARKS</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">ACTIONS</Text>
                                </View>

                                {/* Dummy Rows */}
                                {[
                                    { p: 'Sara City', t: 'ghbfgb', d: 'Contract', v: 'v1.0', s: 'PENDING', time: '2026-08-21T09:46:20', r: 'qrtghtr' },
                                    { p: 'Sara City', t: 'kkkkkkkkkkkkkkkkkkkkkkkk', d: 'contract', v: 'v1.0', s: 'PENDING', time: '2026-08-20T13:41:37', r: 'uy7kohio' },
                                    { p: 'Sara City', t: 'site clean documennt', d: 'Other', v: 'v1.0', s: 'PENDING', time: '2026-08-19T12:25:35', r: 'dfsgsdfg' },
                                    { p: 'Sara City', t: 'jtyjkui', d: 'Report', v: 'v1.0', s: 'PENDING', time: '2026-08-18T13:53:14', r: 'null' },
                                    { p: 'Sara City', t: 'rental document', d: 'Contract', v: 'v1.0', s: 'PENDING', time: '2026-08-11T17:54:18', r: 'rfgewrfqw3r' },
                                    { p: 'Sara City', t: 'new document', d: 'lease document', v: 'v1.0', s: 'PENDING', time: '2026-08-07T11:16:53', r: 'null' },
                                    { p: 'Sara City', t: 'sjcghjajbchjc', d: 'lease document', v: 'v1.0', s: 'PENDING', time: '2026-08-06T11:09:39', r: 'null' },
                                ].map((row, i) => (
                                    <View key={i} className="flex-row items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50">
                                        <Text className="w-40 text-[11px] font-bold text-gray-900">{row.p}</Text>
                                        <Text className="w-48 text-[11px] font-bold text-gray-900" numberOfLines={1}>{row.t}</Text>
                                        <Text className="w-32 text-[11px] text-gray-600">{row.d}</Text>
                                        <View className="w-24 items-center">
                                            <Text className="text-[11px] text-gray-500">{row.v}</Text>
                                        </View>
                                        <View className="w-32 items-center">
                                            <Badge text={row.s} />
                                        </View>
                                        <View className="w-48 items-center">
                                            <Text className="text-[10px] text-gray-500">{row.time}</Text>
                                        </View>
                                        <Text className="flex-1 text-[11px] text-gray-500" numberOfLines={1}>{row.r}</Text>
                                        <View className="w-24 flex-row justify-end space-x-3 pr-2">
                                            <Info size={14} color="#9CA3AF" />
                                            <Edit3 size={14} color="#9CA3AF" />
                                            <Download size={14} color="#9CA3AF" />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
}
