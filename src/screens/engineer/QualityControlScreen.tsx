import TopHeader from '../../components/TopHeader';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Bell, Search, ChevronDown, Plus, Info, Edit3, ShieldAlert, ShieldCheck, User } from 'lucide-react-native';
import { useProjectContext } from '../../contexts/ProjectContext';
import { qualityService } from '../../services/qualityService';

export default function QualityControlScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('inspection');
    const { activeProjectId, projects } = useProjectContext();
    const activeProjectName = projects.find((p: any) => p.id === activeProjectId || p.project_id === activeProjectId)?.name || (projects.find((p: any) => p.id === activeProjectId || p.project_id === activeProjectId) as any)?.project_name || 'Sara City';

    const [loading, setLoading] = useState(true);
    const [inspections, setInspections] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const pid = activeProjectId ? Number(activeProjectId) : undefined;
                
                if (activeTab === 'inspection') {
                    const [inspectionsRes, statsRes] = await Promise.all([
                        qualityService.getInspections(pid),
                        qualityService.getDashboardStats(pid)
                    ]);
                    setInspections(Array.isArray(inspectionsRes) ? inspectionsRes : (inspectionsRes?.data || []));
                    setStats(statsRes || {});
                } else {
                    const reportsRes = await qualityService.getReports(pid);
                    setReports(Array.isArray(reportsRes) ? reportsRes : (reportsRes?.data || []));
                }
            } catch (error) {
                console.error('Error fetching quality control data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeProjectId, activeTab]);

    const StatCard = ({ title, value, subtitle, valueColor = "text-gray-900" }: any) => (
        <View className="flex-1 min-w-[200px] p-2">
            <View className="bg-white p-5 rounded-xl border border-gray-200 h-full justify-center">
                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</Text>
                <Text className={`text-3xl font-bold ${valueColor}`}>{value}</Text>
                <Text className="text-[10px] font-medium text-gray-400 mt-2">{subtitle}</Text>
            </View>
        </View>
    );

    const PassFailBadge = ({ status }: any) => {
        const isPass = status === 'PASS' || status === 'COMPLIANT' || status === 'Pass';
        const colors = isPass ? "bg-emerald-50 border-emerald-500 text-emerald-600" : "bg-rose-50 border-rose-500 text-rose-600";
        return (
            <View className={`px-4 py-1 rounded-full border ${colors}`}>
                <Text className={`text-[10px] font-bold uppercase tracking-wider ${isPass ? 'text-emerald-600' : 'text-rose-600'}`}>{status || 'UNKNOWN'}</Text>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#F8FAFC] flex-col">
            
            <TopHeader title="QC Inspection" subtitle={`Engineer > ${activeProjectName} > Quality Control`} />


            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
                {/* Header & Main Actions */}
                <View className="flex-row flex-wrap justify-between items-center mb-6">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-2xl font-bold text-gray-900">Quality Control Ledger</Text>
                        <Text className="text-xs text-gray-500 mt-1">Historical record of site inspections and material quality audits.</Text>
                    </View>
                    
                    <TouchableOpacity className="bg-blue-600 flex-row items-center px-4 py-2.5 rounded-lg shadow-sm">
                        <Plus size={16} color="#FFF" className="mr-2" />
                        <Text className="text-white font-bold text-sm">Log QC Entry</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Row */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard title="TOTAL AUDITS" value={stats?.total_audits || "0"} subtitle="Verified Logs" />
                    <StatCard title="PASS TESTS" value={stats?.pass_tests || "0"} subtitle="Pass Tests" valueColor="text-emerald-500" />
                    <StatCard title="FAILED TESTS" value={stats?.failed_tests || "0"} subtitle="Failed Tests" valueColor="text-rose-500" />
                    <StatCard title="AUDIT MOMENTUM" value={stats?.pass_percentage ? `${stats.pass_percentage}%` : "0%"} subtitle="Overall Pass Percentage" valueColor="text-blue-500" />
                </View>

                {/* Tabs */}
                <View className="flex-row mb-6">
                    <TouchableOpacity onPress={() => setActiveTab('inspection')} className={`px-5 py-2.5 rounded-full mr-2 ${activeTab === 'inspection' ? 'bg-white shadow-sm border border-gray-200' : 'bg-transparent'}`}>
                        <Text className={`text-sm font-bold ${activeTab === 'inspection' ? 'text-gray-900' : 'text-gray-500'}`}>QC Inspection</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('reports')} className={`px-5 py-2.5 rounded-full ${activeTab === 'reports' ? 'bg-white shadow-sm border border-gray-200' : 'bg-transparent'}`}>
                        <Text className={`text-sm font-bold ${activeTab === 'reports' ? 'text-gray-900' : 'text-gray-500'}`}>Test Reports</Text>
                    </TouchableOpacity>
                </View>

                {/* Main Content Area */}
                <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                    
                    {/* Filters Toolbar */}
                    {activeTab === 'inspection' && (
                        <View className="p-4 border-b border-gray-100 flex-row flex-wrap items-center">
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 min-w-[280px] mr-4 mb-3 lg:mb-0">
                                <Search size={16} color="#9CA3AF" className="mr-2" />
                                <TextInput className="flex-1 font-medium text-sm text-gray-800" placeholder="Search by test type or engineer..." placeholderTextColor="#9CA3AF" />
                            </View>
                            
                            <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-4 py-2 justify-between min-w-[140px] mr-3 mb-3 lg:mb-0">
                                <Text className="font-bold text-xs text-gray-700">ALL TYPES</Text>
                                <ChevronDown size={14} color="#4B5563" className="ml-2" />
                            </View>
                            <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-4 py-2 justify-between min-w-[140px] mr-3 mb-3 lg:mb-0">
                                <Text className="font-bold text-xs text-gray-700">ALL STATUS</Text>
                                <ChevronDown size={14} color="#4B5563" className="ml-2" />
                            </View>
                            <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-4 py-2 justify-between min-w-[140px] mb-3 lg:mb-0">
                                <Text className="font-bold text-xs text-gray-700">LATEST FIRST</Text>
                                <ChevronDown size={14} color="#4B5563" className="ml-2" />
                            </View>
                        </View>
                    )}
                    
                    {activeTab === 'reports' && (
                        <View className="p-4 border-b border-gray-100">
                            <Text className="font-bold text-gray-900 uppercase tracking-widest text-[11px]">TEST PROTOCOL BREAKDOWN</Text>
                        </View>
                    )}

                    {loading ? (
                        <View className="py-10 items-center">
                            <ActivityIndicator size="large" color="#3B82F6" />
                            <Text className="text-gray-500 mt-4">Loading data...</Text>
                        </View>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={true} className="w-full">
                            
                            {activeTab === 'inspection' && (
                                <View className="min-w-[1200px] flex-1">
                                    {/* Table Header */}
                                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-widest">PROJECT</Text>
                                        <Text className="w-40 text-[9px] font-bold text-gray-400 uppercase tracking-widest">AUDIT DETAILS</Text>
                                        <Text className="w-48 text-[9px] font-bold text-gray-400 uppercase tracking-widest">TEST DESCRIPTION</Text>
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">STATUS</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">VALUES</Text>
                                        <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">AUDITOR</Text>
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">ACTIONS</Text>
                                    </View>

                                    {/* Data Rows */}
                                    {inspections.map((row: any, i: number) => (
                                        <View key={row.id || i} className="flex-row items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50">
                                            <Text className="w-32 text-[11px] font-bold text-gray-900">{row.project_name || activeProjectName}</Text>
                                            <Text className="w-40 text-[11px] font-bold text-gray-900">{row.audit_details || row.category || '-'}</Text>
                                            <View className="w-48 pr-4">
                                                <Text className="text-[11px] font-bold text-gray-900 mb-0.5">{row.test_description || row.title || '-'}</Text>
                                                <View className="flex-row items-center">
                                                    <Edit3 size={8} color="#9CA3AF" className="mr-1" />
                                                    <Text className="text-[9px] text-gray-400" numberOfLines={1}>{row.remarks || 'No remarks'}</Text>
                                                </View>
                                            </View>
                                            <View className="w-24 items-center">
                                                <PassFailBadge status={row.status || 'PENDING'} />
                                            </View>
                                            <View className="w-32 items-center">
                                                <Text className="text-[10px] font-bold text-gray-900">Result: <Text className="text-gray-700">{row.result || '-'}</Text></Text>
                                                <Text className="text-[9px] text-gray-500 font-bold">STD: {row.standard_value || '-'}</Text>
                                            </View>
                                            <View className="flex-1 flex-row items-center">
                                                <User size={12} color="#9CA3AF" className="mr-2" />
                                                <Text className="text-[10px] font-bold text-gray-900 uppercase">{row.auditor_name || '-'}</Text>
                                            </View>
                                            <View className="w-24 flex-row justify-end space-x-3 pr-2">
                                                <Info size={14} color="#9CA3AF" />
                                                <Edit3 size={14} color="#9CA3AF" />
                                                <ShieldAlert size={14} color="#9CA3AF" />
                                            </View>
                                        </View>
                                    ))}
                                    
                                    {inspections.length === 0 && (
                                        <View className="py-8 items-center justify-center">
                                            <Text className="text-gray-500">No inspections found.</Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            {activeTab === 'reports' && (
                                <View className="min-w-[1000px] flex-1">
                                    {/* Table Header */}
                                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                        <Text className="w-1/3 text-[9px] font-bold text-gray-400 uppercase tracking-widest">TEST PROTOCOL</Text>
                                        <Text className="w-1/6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">SAMPLES COUNT</Text>
                                        <Text className="w-1/6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">COMPLIANT</Text>
                                        <Text className="w-1/6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">NON-COMPLIANT</Text>
                                        <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">VELOCITY</Text>
                                    </View>

                                    {/* Data Rows */}
                                    {reports.map((row: any, i: number) => (
                                        <View key={row.id || i} className="flex-row items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50">
                                            <Text className="w-1/3 text-[11px] font-bold text-gray-900">{row.test_protocol || row.title || '-'}</Text>
                                            <Text className="w-1/6 text-[11px] font-bold text-gray-600 text-center">{row.samples_count || '0'}</Text>
                                            <Text className="w-1/6 text-[11px] font-bold text-emerald-500 text-center">{row.compliant || '0'}</Text>
                                            <Text className="w-1/6 text-[11px] font-bold text-rose-500 text-center">{row.non_compliant || '0'}</Text>
                                            <Text className="flex-1 text-[11px] font-bold text-blue-600 text-right pr-4">{row.velocity || '0%'}</Text>
                                        </View>
                                    ))}

                                    {reports.length === 0 && (
                                        <View className="py-8 items-center justify-center">
                                            <Text className="text-gray-500">No test reports found.</Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </ScrollView>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
