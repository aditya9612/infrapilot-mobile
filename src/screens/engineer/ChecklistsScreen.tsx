import TopHeader from '../../components/TopHeader';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Bell, Plus, Trash2, Edit3, Eye, FileText, Search, ChevronDown, CheckCircle, Clock } from 'lucide-react-native';
import { useProjectContext } from '../../contexts/ProjectContext';
import { checklistService } from '../../services/checklistService';

export default function ChecklistsScreen() {
    const { activeProjectId, projects } = useProjectContext();
    const activeProjectName = projects.find(p => String(p.id) === String(activeProjectId))?.name || 'All Projects';
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('DAILY CHECKLIST');
    
    const [checklists, setChecklists] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const pid = activeProjectId ? parseInt(activeProjectId.toString()) : undefined;
                if (activeTab === 'DAILY CHECKLIST') {
                    const res = await checklistService.getChecklists(pid).catch(() => null);
                    const arr = res?.data ?? res ?? [];
                    setChecklists(Array.isArray(arr) ? arr : []);
                } else {
                    const res = await checklistService.getChecklistLogs(pid).catch(() => null);
                    const arr = res?.data ?? res ?? [];
                    setLogs(Array.isArray(arr) ? arr : []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [activeProjectId, activeTab]);

    const StatCard = ({ title, value, subtitle, valueColor = 'text-gray-900', subtitleColor = 'text-gray-500' }: any) => (
        <View className="w-full sm:w-1/2 lg:w-1/4 p-2">
            <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full justify-center">
                <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">{title}</Text>
                <Text className={`text-2xl font-bold ${valueColor}`}>{value}</Text>
                <Text className={`text-xs mt-1 ${subtitleColor}`}>{subtitle}</Text>
            </View>
        </View>
    );

    const ChecklistCard = ({ item }: any) => {
        const title = item?.name || item?.title || 'Unnamed Checklist';
        const type = item?.type || activeTab;
        return (
            <View className="w-full lg:w-1/3 p-3">
                <View className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <View className="flex-row justify-between items-start mb-4">
                        <View>
                            <Text className="font-bold text-gray-900 text-lg mb-2">{title}</Text>
                            <View className="border border-blue-200 bg-blue-50 px-2.5 py-1 rounded-full self-start">
                                <Text className="text-[10px] font-bold text-blue-600 uppercase">{type}</Text>
                            </View>
                        </View>
                        <TouchableOpacity className="p-2 bg-gray-50 rounded-lg">
                            <Trash2 size={16} color="#4B5563" />
                        </TouchableOpacity>
                    </View>
                    
                    <View className="flex-row justify-between items-center mb-4 mt-6">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">INTELLIGENCE DOMAIN</Text>
                        <Text className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">VERIFIED VAULT</Text>
                    </View>
                    
                    <View className="flex-row items-center justify-between -mx-1 mt-2">
                        <TouchableOpacity className="flex-1 mx-1 bg-gray-50 border border-gray-200 py-3 rounded-lg flex-row items-center justify-center">
                            <FileText size={14} color="#6B7280" className="mr-2" />
                            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">MANAGE ITEMS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 mx-1 bg-blue-600 py-3 rounded-lg flex-row items-center justify-center shadow-sm">
                            <CheckCircle size={14} color="#FFF" className="mr-2" />
                            <Text className="text-[10px] font-bold text-white uppercase tracking-wider">EXECUTE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 mx-1 bg-gray-50 border border-gray-200 py-3 rounded-lg flex-row items-center justify-center">
                            <Trash2 size={14} color="#6B7280" className="mr-2" />
                            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">DELETE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50 flex-col">
            
            <TopHeader title="Checklists" subtitle={`Engineer > Checklists > ${activeProjectName}`} />

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
                {/* Secondary Header */}
                <View className="flex-row flex-wrap justify-between items-center mb-6">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-2xl font-bold text-gray-900">Checklist Intelligence Ledger</Text>
                        <Text className="text-sm text-gray-500 mt-1">Systematic verification protocols and site execution logs.</Text>
                    </View>
                    <TouchableOpacity className="bg-blue-600 flex-row items-center px-4 py-2.5 rounded-md self-start">
                        <Plus size={16} color="#FFF" className="mr-2" />
                        <Text className="text-white font-medium text-sm">New Checklist</Text>
                    </TouchableOpacity>
                </View>

                {/* Top Stats Cards */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard title="TOTAL CHECKLISTS" value={checklists.length || logs.length} subtitle="Protocols Logged" />
                    <StatCard title="COMPLIANCE" value="0%" subtitle="0 Passed" valueColor="text-gray-900" subtitleColor="text-gray-400" />
                    <StatCard title="PENDING AUDITS" value="0" subtitle="Need Action" valueColor="text-red-500" subtitleColor="text-gray-500" />
                    <StatCard title="GLOBAL HEALTH" value="0%" subtitle="Overall" valueColor="text-blue-500" subtitleColor="text-gray-500" />
                </View>

                {/* Tabs */}
                <View className="flex-row items-center mb-6 border-b border-gray-200">
                    <TouchableOpacity 
                        onPress={() => setActiveTab('DAILY CHECKLIST')}
                        className={`px-6 py-3 rounded-t-lg ${activeTab === 'DAILY CHECKLIST' ? 'bg-gray-900' : 'bg-transparent'}`}
                    >
                        <Text className={`font-bold text-xs tracking-wider ${activeTab === 'DAILY CHECKLIST' ? 'text-white' : 'text-gray-400'}`}>DAILY CHECKLIST</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setActiveTab('ACTIVITY CHECKLIST')}
                        className={`px-6 py-3 rounded-t-lg ${activeTab === 'ACTIVITY CHECKLIST' ? 'bg-gray-900' : 'bg-transparent'}`}
                    >
                        <Text className={`font-bold text-xs tracking-wider ${activeTab === 'ACTIVITY CHECKLIST' ? 'text-white' : 'text-gray-400'}`}>ACTIVITY CHECKLIST</Text>
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <View className="py-10 justify-center items-center">
                        <ActivityIndicator size="large" color="#2563EB" />
                        <Text className="text-gray-500 mt-4">Loading Data...</Text>
                    </View>
                ) : (
                    <>
                        {/* Cards Grid */}
                        <View className="flex-row flex-wrap -mx-3 mb-8">
                            {activeTab === 'DAILY CHECKLIST' ? (
                                checklists.length > 0 ? checklists.map((item, idx) => (
                                    <ChecklistCard key={idx} item={item} />
                                )) : <Text className="text-gray-500 ml-4">No daily checklists available</Text>
                            ) : (
                                logs.length > 0 ? logs.map((item, idx) => (
                                    <ChecklistCard key={idx} item={item} />
                                )) : <Text className="text-gray-500 ml-4">No activity logs available</Text>
                            )}
                        </View>
                        
                        {/* Data Table Area */}
                        <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                            <View className="p-4 border-b border-gray-100 flex-row flex-wrap items-center justify-between">
                                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 w-full md:w-1/3 lg:w-1/4 mb-4 md:mb-0">
                                    <Search size={16} color="#9CA3AF" className="mr-2" />
                                    <TextInput className="flex-1 font-medium text-sm text-gray-800" placeholder="Search by protocol or remarks..." placeholderTextColor="#9CA3AF" />
                                </View>
                                <View className="flex-row items-center">
                                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-3">FILTER:</Text>
                                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 min-w-[120px] justify-between">
                                        <Text className="font-bold text-sm text-gray-800">ALL</Text>
                                        <ChevronDown size={16} color="#4B5563" />
                                    </View>
                                </View>
                            </View>
                            
                            <ScrollView horizontal showsHorizontalScrollIndicator={true} className="w-full">
                                <View className="min-w-[900px] flex-1">
                                    <View className="flex-row items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
                                        <Text className="flex-2 w-1/4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">PROTOCOL IDENTITY</Text>
                                        <Text className="flex-1 w-1/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">COMPLIANCE PROFILE</Text>
                                        <Text className="flex-2 w-1/4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">INTELLIGENCE REMARKS</Text>
                                        <Text className="flex-1 w-1/6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">AUDIT SEQUENCE</Text>
                                        <Text className="flex-1 w-1/6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">ACTIONS</Text>
                                    </View>
                                    
                                    {(activeTab === 'DAILY CHECKLIST' ? checklists : logs).map((row, i) => (
                                        <View key={i} className="flex-row items-center px-6 py-5 border-b border-gray-50">
                                            <View className="flex-2 w-1/4">
                                                <Text className="font-bold text-gray-900 text-sm">{row?.name || row?.title || `Checklist #${row?.id || i}`}</Text>
                                            </View>
                                            <View className="flex-1 w-1/5 items-center">
                                                <View className="bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
                                                    <Text className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider">{row?.status || 'PENDING'}</Text>
                                                </View>
                                            </View>
                                            <View className="flex-2 w-1/4 items-center flex-row justify-center">
                                                <FileText size={14} color="#6B7280" className="mr-2" />
                                                <Text className="text-sm font-medium text-gray-600">{row?.remarks || 'N/A'}</Text>
                                            </View>
                                            <View className="flex-1 w-1/6 items-center">
                                                <Text className="text-xs font-bold text-gray-900">{row?.audit_status || 'Not Audited'}</Text>
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">TIMESTAMP</Text>
                                            </View>
                                            <View className="flex-1 w-1/6 flex-row justify-end items-center space-x-3">
                                                <TouchableOpacity className="p-1">
                                                    <Eye size={16} color="#6B7280" />
                                                </TouchableOpacity>
                                                <TouchableOpacity className="p-1 mx-2">
                                                    <Edit3 size={16} color="#6B7280" />
                                                </TouchableOpacity>
                                                <TouchableOpacity className="p-1">
                                                    <Trash2 size={16} color="#6B7280" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                    {((activeTab === 'DAILY CHECKLIST' ? checklists : logs).length === 0) && (
                                        <View className="py-8 items-center">
                                            <Text className="text-gray-500">No records found</Text>
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

