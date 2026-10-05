import TopHeader from '../../components/TopHeader';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Bell, Search, ChevronDown, Plus, Info, Edit3, ShieldAlert, ShieldCheck } from 'lucide-react-native';
import { useProjectContext } from '../../contexts/ProjectContext';
import { safetyService } from '../../services/safetyService';

export default function SafetyManagementScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('checklist');
    const { activeProjectId, projects } = useProjectContext();
    const activeProjectName = projects.find((p: any) => p.id === activeProjectId || p.project_id === activeProjectId)?.name || (projects.find((p: any) => p.id === activeProjectId || p.project_id === activeProjectId) as any)?.project_name || 'Sara City';

    const [loading, setLoading] = useState(true);
    const [audits, setAudits] = useState<any[]>([]);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const pid = activeProjectId ? Number(activeProjectId) : undefined;
                
                if (activeTab === 'checklist') {
                    const [auditsRes, statsRes] = await Promise.all([
                        safetyService.getSafetyAudits(pid),
                        safetyService.getIncidentStats(pid)
                    ]);
                    setAudits(Array.isArray(auditsRes) ? auditsRes : (auditsRes?.data || []));
                    setStats(statsRes || {});
                } else {
                    const incidentsRes = await safetyService.getIncidents(pid);
                    setIncidents(Array.isArray(incidentsRes) ? incidentsRes : (incidentsRes?.data || []));
                }
            } catch (error) {
                console.error('Error fetching safety data:', error);
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

    const ViolationBadge = ({ text }: any) => {
        const type = String(text || '').toLowerCase();
        let colors = "bg-gray-50 border-gray-100 text-gray-500";
        if (type.includes('hazard')) colors = "bg-gray-100 border-gray-200 text-gray-600";
        if (type.includes('helmet')) colors = "bg-rose-50 border-rose-100 text-rose-500";
        if (type.includes('scaffolding')) colors = "bg-amber-50 border-amber-100 text-amber-500";
        if (type.includes('equipment')) colors = "bg-orange-50 border-orange-100 text-orange-500";

        return (
            <View className={`px-2 py-1 rounded-sm border ${colors}`}>
                <Text className={`text-[9px] font-bold uppercase tracking-wider ${colors.split(' ').pop()}`}>{text || 'UNKNOWN'}</Text>
            </View>
        );
    };

    const StatusBadge = ({ text }: any) => {
        let colors = "bg-gray-50 border-gray-100 text-gray-500";
        const status = String(text || '').toUpperCase();
        if (status === 'PENDING') colors = "bg-amber-50 border-amber-100 text-amber-500";
        if (status === 'COMPLETED' || status === 'RESOLVED') colors = "bg-emerald-50 border-emerald-100 text-emerald-500";
        if (status === 'FAILED' || status === 'UNRESOLVED') colors = "bg-rose-50 border-rose-100 text-rose-500";

        return (
            <View className={`px-2 py-1 rounded-sm border ${colors}`}>
                <Text className={`text-[9px] font-bold uppercase tracking-wider ${colors.split(' ').pop()}`}>{status || 'UNKNOWN'}</Text>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#F8FAFC] flex-col">
            
            <TopHeader title="Safety Management" subtitle={`Engineer > ${activeProjectName} > Safety`} />


            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
                {/* Header & Main Actions */}
                <View className="flex-row flex-wrap justify-between items-center mb-6">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-2xl font-bold text-gray-900">{activeTab === 'checklist' ? 'Safety Audit Registry' : 'Incident Response Vault'}</Text>
                        <Text className="text-xs text-gray-500 mt-1">{activeTab === 'checklist' ? 'Historical record of safety inspections and site compliance audits.' : 'Detailed archive of site accidents, injuries, and corrective actions taken.'}</Text>
                    </View>
                    
                    <TouchableOpacity className="bg-blue-600 flex-row items-center px-4 py-2.5 rounded-lg shadow-sm">
                        <Plus size={16} color="#FFF" className="mr-2" />
                        <Text className="text-white font-bold text-sm">{activeTab === 'checklist' ? 'Log Audit Entry' : 'Log Incident Report'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Row */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard title="TOTAL AUDITS" value={stats?.total_audits || "0"} subtitle="Verified Logs" />
                    <StatCard title="COMPLIANCE" value={stats?.compliance_percentage ? `${stats.compliance_percentage}%` : "0%"} subtitle="Safe Operations" valueColor="text-emerald-500" />
                    <StatCard title="HIGH RISKS" value={stats?.high_risks || "0"} subtitle="Critical Hazards" valueColor="text-rose-500" />
                    <StatCard title="SITE SAFETY" value={stats?.safety_momentum ? `${stats.safety_momentum}%` : "0%"} subtitle="Safety Momentum" valueColor="text-blue-500" />
                </View>

                {/* Tabs */}
                <View className="flex-row mb-6">
                    <TouchableOpacity onPress={() => setActiveTab('checklist')} className={`px-5 py-2.5 rounded-full mr-2 ${activeTab === 'checklist' ? 'bg-white shadow-sm border border-gray-200' : 'bg-transparent'}`}>
                        <Text className={`text-sm font-bold ${activeTab === 'checklist' ? 'text-gray-900' : 'text-gray-500'}`}>Safety Checklist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('incident')} className={`px-5 py-2.5 rounded-full ${activeTab === 'incident' ? 'bg-white shadow-sm border border-gray-200' : 'bg-transparent'}`}>
                        <Text className={`text-sm font-bold ${activeTab === 'incident' ? 'text-gray-900' : 'text-gray-500'}`}>Incident Report</Text>
                    </TouchableOpacity>
                </View>

                {/* Main Content Area */}
                <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                    
                    {/* Filters Toolbar */}
                    {activeTab === 'checklist' && (
                        <View className="p-4 border-b border-gray-100 flex-row flex-wrap items-center">
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 min-w-[280px] mr-4 mb-3 lg:mb-0">
                                <Search size={16} color="#9CA3AF" className="mr-2" />
                                <TextInput className="flex-1 font-medium text-sm text-gray-800" placeholder="Search by description, person or violation..." placeholderTextColor="#9CA3AF" />
                            </View>
                            
                            <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-4 py-2 justify-between min-w-[180px] mr-3 mb-3 lg:mb-0">
                                <Text className="font-bold text-xs text-gray-700">ALL VIOLATION TYPES</Text>
                                <ChevronDown size={14} color="#4B5563" className="ml-2" />
                            </View>
                            <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-4 py-2 justify-between min-w-[140px] mb-3 lg:mb-0">
                                <Text className="font-bold text-xs text-gray-700">LATEST FIRST</Text>
                                <ChevronDown size={14} color="#4B5563" className="ml-2" />
                            </View>
                        </View>
                    )}
                    
                    {activeTab === 'incident' && (
                        <View className="p-4 border-b border-gray-100">
                            <Text className="font-bold text-gray-900 uppercase tracking-widest text-[11px]">SAFETY INCIDENT BREAKDOWN</Text>
                        </View>
                    )}

                    {loading ? (
                        <View className="py-10 items-center">
                            <ActivityIndicator size="large" color="#3B82F6" />
                            <Text className="text-gray-500 mt-4">Loading data...</Text>
                        </View>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={true} className="w-full">
                            
                            {activeTab === 'checklist' && (
                                <View className="min-w-[1300px] flex-1">
                                    {/* Table Header */}
                                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-widest">INCIDENT DETAILS</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-widest">PROJECT NAME</Text>
                                        <Text className="w-32 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">TASK</Text>
                                        <Text className="w-48 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">INCIDENT SUMMARY</Text>
                                        <Text className="w-40 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">VIOLATION TYPE</Text>
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">STATUS</Text>
                                        <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">RESOURCES</Text>
                                        <Text className="w-24 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">ACTIONS</Text>
                                    </View>

                                    {/* Data Rows */}
                                    {audits.map((row: any, i: number) => (
                                        <View key={row.id || i} className="flex-row items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50">
                                            <Text className="w-32 text-xs font-bold text-gray-900">{row.date || row.created_at?.split('T')[0] || '-'}</Text>
                                            <Text className="w-32 text-[11px] text-gray-600">{row.project_name || activeProjectName}</Text>
                                            <View className="w-32 items-center">
                                                <View className="bg-gray-100 rounded px-2 py-0.5"><Text className="text-[10px] text-gray-500" numberOfLines={1}>{row.task_name || row.task || '-'}</Text></View>
                                            </View>
                                            <View className="w-48 items-center flex-col">
                                                <Text className="text-xs font-bold text-gray-900 mb-0.5">{row.incident_summary || row.summary || '-'}</Text>
                                                <View className="flex-row items-center">
                                                    {row.no_injuries ? <ShieldCheck size={10} color="#10B981" className="mr-1" /> : <ShieldAlert size={10} color="#EF4444" className="mr-1" />}
                                                    <Text className={`text-[9px] ${row.no_injuries ? 'text-emerald-500' : 'text-gray-400'}`} numberOfLines={1}>{row.sub_incident || row.remarks || 'No injuries'}</Text>
                                                </View>
                                            </View>
                                            <View className="w-40 items-center">
                                                <ViolationBadge text={row.violation_type || row.type || 'SAFETY HAZARD'} />
                                            </View>
                                            <View className="w-24 items-center">
                                                <StatusBadge text={row.status || 'PENDING'} />
                                            </View>
                                            <View className="flex-1 items-center">
                                                <Text className="text-[10px] font-bold text-gray-900 mb-0.5 uppercase">{row.responsible_person || row.assignee || '-'}</Text>
                                                <Text className="text-[8px] font-medium text-gray-500 uppercase">ACTION: {row.corrective_action || row.action || '-'}</Text>
                                            </View>
                                            <View className="w-24 flex-row justify-end space-x-3 pr-2">
                                                <Info size={14} color="#9CA3AF" />
                                                <Edit3 size={14} color="#9CA3AF" />
                                            </View>
                                        </View>
                                    ))}
                                    
                                    {audits.length === 0 && (
                                        <View className="py-8 items-center justify-center">
                                            <Text className="text-gray-500">No safety audits found.</Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            {activeTab === 'incident' && (
                                <View className="min-w-[1000px] flex-1">
                                    {/* Table Header */}
                                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                        <Text className="w-1/3 text-[9px] font-bold text-gray-400 uppercase tracking-widest">VIOLATION PROFILE</Text>
                                        <Text className="w-1/6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">INCIDENT COUNT</Text>
                                        <Text className="w-1/6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">RESOLVED</Text>
                                        <Text className="w-1/6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">UNRESOLVED</Text>
                                        <Text className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">RESOLUTION VELOCITY</Text>
                                    </View>

                                    {/* Data Rows */}
                                    {incidents.map((row: any, i: number) => (
                                        <View key={row.id || i} className="flex-row items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50">
                                            <Text className="w-1/3 text-xs font-bold text-gray-900">{row.violation_profile || row.type || '-'}</Text>
                                            <Text className="w-1/6 text-[11px] text-gray-600 text-center">{row.incident_count || '0'}</Text>
                                            <Text className="w-1/6 text-[11px] font-bold text-emerald-500 text-center">{row.resolved_count || '0'}</Text>
                                            <Text className="w-1/6 text-[11px] font-bold text-rose-500 text-center">{row.unresolved_count || '0'}</Text>
                                            <Text className="flex-1 text-xs font-bold text-gray-900 text-right pr-4">{row.resolution_velocity || '0%'}</Text>
                                        </View>
                                    ))}

                                    {incidents.length === 0 && (
                                        <View className="py-8 items-center justify-center">
                                            <Text className="text-gray-500">No incident reports found.</Text>
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
