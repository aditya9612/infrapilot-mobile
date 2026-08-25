import TopHeader from '../../components/TopHeader';
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Bell, Search, ChevronDown, Filter, List, Calendar, Clock, CheckCircle, XCircle, Plus, User, Play, Pause, Square, Edit3, Trash2, Eye, FileText, Image as ImageIcon, Briefcase, FileSignature, Folder, ChevronUp, Layers, CheckSquare, Activity } from 'lucide-react-native';

export default function TaskManagementScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('all');
    const [isSaraCityExpanded, setIsSaraCityExpanded] = useState(true);

    const StatCard = ({ title, value, icon: Icon, color = 'blue' }: any) => {
        const bgColors: any = { blue: 'bg-blue-50', gray: 'bg-gray-50', green: 'bg-emerald-50', red: 'bg-rose-50' };
        const borderColors: any = { blue: 'border-blue-200', gray: 'border-gray-200', green: 'border-emerald-200', red: 'border-rose-200' };
        const textColors: any = { blue: 'text-blue-600', gray: 'text-gray-400', green: 'text-emerald-500', red: 'text-rose-500' };
        const titleColors: any = { blue: 'text-blue-500', gray: 'text-gray-500', green: 'text-gray-500', red: 'text-gray-500' };
        
        return (
            <View className="flex-1 min-w-[150px] p-2">
                <View className={`bg-white p-4 rounded-xl border ${activeTab === 'all' && color === 'blue' ? 'border-blue-600 shadow-sm shadow-blue-200' : 'border-gray-200'} h-full flex-row justify-between items-start`}>
                    <View>
                        <Text className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${titleColors[color]}`}>{title}</Text>
                        <Text className="text-3xl font-bold text-gray-900">{value}</Text>
                    </View>
                    <View className={`w-8 h-8 rounded-full ${bgColors[color]} border ${borderColors[color]} items-center justify-center`}>
                        <Icon size={14} className={textColors[color]} />
                    </View>
                </View>
            </View>
        );
    };

    const Badge = ({ text, color }: any) => {
        const colors: any = {
            low: 'bg-green-500',
            medium: 'bg-blue-500',
            high: 'bg-rose-500',
            critical: 'bg-purple-600'
        };
        return (
            <View className={`${colors[color.toLowerCase()] || 'bg-gray-500'} px-2 py-1 rounded-sm items-center justify-center`}>
                <Text className="text-[9px] font-bold text-white uppercase tracking-wider">{text}</Text>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#F8FAFC] flex-col">
            
            <TopHeader title="Task Management" subtitle="Engineer • Task Management" />


            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
                {/* Header & Main Actions */}
                <View className="flex-row flex-wrap justify-between items-center mb-6">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-2xl font-bold text-gray-900">Task Management</Text>
                        <Text className="text-xs text-gray-500 mt-1">Efficiently organize, track, and manage all your tasks in one place.</Text>
                    </View>
                    
                    <View className="flex-row space-x-3">
                        {activeTab !== 'requests' && (
                            <TouchableOpacity className="bg-indigo-500 flex-row items-center px-4 py-2.5 rounded-lg mr-3 shadow-sm">
                                <FileSignature size={14} color="#FFF" className="mr-2" />
                                <Text className="text-white font-bold text-sm">Generate BOQ to Task</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity className="bg-blue-600 flex-row items-center px-4 py-2.5 rounded-lg shadow-sm">
                            <Plus size={16} color="#FFF" className="mr-2" />
                            <Text className="text-white font-bold text-sm">{activeTab === 'requests' ? 'Create Task Request' : 'Create Task'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tabs */}
                <View className="flex-row mb-6">
                    <TouchableOpacity onPress={() => setActiveTab('all')} className={`px-5 py-2.5 rounded-full mr-2 ${activeTab === 'all' ? 'bg-white shadow-sm border border-gray-200' : 'bg-transparent'}`}>
                        <Text className={`text-sm font-bold ${activeTab === 'all' ? 'text-gray-900' : 'text-gray-500'}`}>All Tasks</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('project')} className={`px-5 py-2.5 rounded-full mr-2 ${activeTab === 'project' ? 'bg-white shadow-sm border border-gray-200' : 'bg-transparent'}`}>
                        <Text className={`text-sm font-bold ${activeTab === 'project' ? 'text-gray-900' : 'text-gray-500'}`}>Project Tasks</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('requests')} className={`px-5 py-2.5 rounded-full ${activeTab === 'requests' ? 'bg-white shadow-sm border border-gray-200' : 'bg-transparent'}`}>
                        <Text className={`text-sm font-bold ${activeTab === 'requests' ? 'text-gray-900' : 'text-gray-500'}`}>Task Requests</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Row */}
                {activeTab !== 'requests' ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-2 px-2 pb-2">
                        <StatCard title="TOTAL TASKS" value="33" icon={List} color="blue" />
                        <StatCard title="PLANNED" value="10" icon={Calendar} color="gray" />
                        <StatCard title="IN PROGRESS" value="10" icon={Clock} color="blue" />
                        <StatCard title="COMPLETED" value="9" icon={CheckCircle} color="green" />
                        <StatCard title="CANCELLED" value="4" icon={XCircle} color="red" />
                    </ScrollView>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-2 px-2 pb-2">
                        <StatCard title="TOTAL REQUESTS" value="14" icon={List} color="gray" />
                        <StatCard title="PENDING" value="12" icon={Clock} color="blue" />
                        <StatCard title="APPROVED" value="1" icon={CheckCircle} color="green" />
                        <StatCard title="REJECTED" value="0" icon={XCircle} color="red" />
                    </ScrollView>
                )}

                {/* Main Content Area */}
                <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                    
                    {/* Filters Toolbar */}
                    {activeTab === 'all' && (
                        <View className="p-4 border-b border-gray-100 flex-row flex-wrap items-center justify-between">
                            <View className="flex-row items-center space-x-3 mb-4 lg:mb-0">
                                <View className="bg-gray-800 p-2 rounded-lg mr-3">
                                    <Filter size={16} color="#FFF" />
                                </View>
                                <Text className="font-bold text-gray-800 text-sm mr-4">All Tasks Filters</Text>
                                
                                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 min-w-[200px]">
                                    <Search size={14} color="#9CA3AF" className="mr-2" />
                                    <TextInput className="flex-1 font-medium text-xs text-gray-800" placeholder="Search tasks..." placeholderTextColor="#9CA3AF" />
                                </View>
                            </View>
                            
                            <View className="flex-row items-center space-x-4">
                                <View>
                                    <Text className="text-[9px] font-bold text-gray-900 mb-1">Status</Text>
                                    <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 justify-between min-w-[120px] mr-3">
                                        <Text className="font-bold text-xs text-gray-700">ALL STATUS</Text>
                                        <ChevronDown size={14} color="#4B5563" />
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-[9px] font-bold text-gray-900 mb-1">Filter</Text>
                                    <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 justify-between min-w-[120px] mr-3">
                                        <Text className="font-bold text-xs text-gray-700">ALL TASKS</Text>
                                        <ChevronDown size={14} color="#4B5563" />
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-[9px] font-bold text-gray-900 mb-1">Department</Text>
                                    <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 justify-between min-w-[150px] mr-3">
                                        <Text className="font-bold text-xs text-gray-700">ALL DEPARTMENTS</Text>
                                        <ChevronDown size={14} color="#4B5563" />
                                    </View>
                                </View>
                                <View className="flex-row items-end pb-0.5">
                                    <View className="bg-indigo-500 p-2 rounded-l-lg border border-indigo-500">
                                        <List size={14} color="#FFF" />
                                    </View>
                                    <View className="bg-white p-2 rounded-r-lg border border-l-0 border-gray-200">
                                        <CheckSquare size={14} color="#9CA3AF" />
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {activeTab === 'project' && (
                        <View className="p-4 border-b border-gray-100 flex-row flex-wrap items-center justify-between">
                            <View className="flex-row items-center space-x-3 mb-4 lg:mb-0">
                                <View className="bg-gray-800 p-2 rounded-lg mr-3">
                                    <Filter size={16} color="#FFF" />
                                </View>
                                <Text className="font-bold text-gray-800 text-sm mr-4">Filter Projects</Text>
                                
                                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 min-w-[200px]">
                                    <Search size={14} color="#9CA3AF" className="mr-2" />
                                    <TextInput className="flex-1 font-medium text-xs text-gray-800" placeholder="Search projects or task..." placeholderTextColor="#9CA3AF" />
                                </View>
                            </View>
                            
                            <View className="flex-row items-center space-x-4">
                                <View>
                                    <Text className="text-[9px] font-bold text-gray-900 mb-1">Status</Text>
                                    <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 justify-between min-w-[120px] mr-3">
                                        <Text className="font-bold text-xs text-gray-700">ALL STATUS</Text>
                                        <ChevronDown size={14} color="#4B5563" />
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-[9px] font-bold text-gray-900 mb-1">Ownership</Text>
                                    <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 justify-between min-w-[120px]">
                                        <Text className="font-bold text-xs text-gray-700">ENTIRE VIEW</Text>
                                        <ChevronDown size={14} color="#4B5563" />
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {activeTab === 'requests' && (
                        <View className="p-4 border-b border-gray-100 flex-row flex-wrap items-center justify-between">
                            <View className="flex-row items-center bg-gray-700 rounded-lg px-3 py-1.5 mr-3">
                                <CheckSquare size={14} color="#FFF" className="mr-2" />
                                <Text className="font-bold text-white text-xs">Task Requests for Approval</Text>
                            </View>
                            
                            <View className="flex-row items-center space-x-3">
                                <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 justify-between min-w-[120px] mr-2">
                                    <Text className="font-medium text-xs text-gray-500">All Projects</Text>
                                    <Filter size={12} color="#9CA3AF" />
                                </View>
                                <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 justify-between min-w-[120px]">
                                    <Text className="font-medium text-xs text-gray-500">All Status</Text>
                                    <Filter size={12} color="#9CA3AF" />
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Responsive Data Tables Wrapper */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} className="w-full">
                        
                        {/* TAB 1: ALL TASKS TABLE */}
                        {activeTab === 'all' && (
                            <View className="min-w-[1600px] flex-1">
                                <View className="flex-row items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
                                    <Text className="w-24 text-[9px] font-bold text-gray-900 uppercase tracking-widest">PROJECT</Text>
                                    <Text className="w-48 text-[9px] font-bold text-gray-900 uppercase tracking-widest">TITLE</Text>
                                    <Text className="w-40 text-[9px] font-bold text-gray-900 uppercase tracking-widest">DESCRIPTION</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">PRIORITY</Text>
                                    <Text className="w-36 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">STATUS</Text>
                                    <Text className="w-40 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">START / END DATE</Text>
                                    <Text className="w-40 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">ACTUAL START / END</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">CREATED BY</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">ASSIGNED USERS</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">COMPLETION %</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">DELAY DAYS</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">COST (A/P)</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">AUDIO INSTRUCTION</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">INSTRUCTION IMAGE</Text>
                                    <Text className="flex-1 min-w-[100px] text-[9px] font-bold text-gray-900 uppercase tracking-widest text-right">ACTIONS</Text>
                                </View>

                                {/* Dummy Rows mimicking the image */}
                                {[
                                    { p: 'Sara City', t: 'create kala task', d: 'mcv nmmnmkmkmk', pr: 'LOW', s: 'Planned', sColor: 'gray', aU: 'rahul patil', comp: '43', audio: false, img: true },
                                    { p: 'Sara City', t: 'hfhfhhfhhfhfhhfhf', d: '', pr: 'MEDIUM', s: 'Planned', sColor: 'gray', aU: 'Unassigned', comp: '0', audio: false, img: false },
                                    { p: 'Sara City', t: 'kkkkkkkkkkkkkkkk', d: 'fdfdsdf', pr: 'CRITICAL', s: 'In Progress', sColor: 'blue', aU: 'rahul patil', comp: '59', audio: true, img: true },
                                    { p: 'Sara City', t: 'jghmjghjtyjuy', d: 'fdfdsgh', pr: 'MEDIUM', s: 'Planned', sColor: 'gray', aU: 'Ramesh Sharma', comp: '75', audio: false, img: false },
                                    { p: 'Sara City', t: 'ukmmj', d: '', pr: 'MEDIUM', s: 'Planned', sColor: 'gray', aU: 'Unassigned', comp: '0', audio: false, img: false },
                                    { p: 'Sara City', t: 'JOUJLIO', d: 'kjsdlf', pr: 'LOW', s: 'Planned', sColor: 'gray', aU: 'keshav patil', comp: '0', audio: false, img: false },
                                    { p: 'Sara City', t: 'Testing TV', d: 'Tv start', pr: 'HIGH', s: 'Planned', sColor: 'gray', aU: 'Unassigned', comp: '0', audio: true, img: true }
                                ].map((row, i) => (
                                    <View key={i} className="flex-row items-center px-6 py-4 border-b border-gray-50 bg-white hover:bg-gray-50">
                                        <Text className="w-24 text-[10px] text-gray-800">{row.p}</Text>
                                        <Text className="w-48 text-[11px] font-bold text-gray-900">{row.t}</Text>
                                        <Text className="w-40 text-[10px] text-gray-500" numberOfLines={1}>{row.d}</Text>
                                        <View className="w-24 items-center">
                                            <Badge text={row.pr} color={row.pr} />
                                        </View>
                                        <View className="w-36 items-center">
                                            <View className="flex-row items-center border border-gray-200 rounded-md px-2 py-1 bg-white">
                                                <View className={`w-1.5 h-1.5 rounded-full mr-2 ${row.sColor === 'blue' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                                <Text className="text-[10px] font-bold text-gray-700">{row.s}</Text>
                                                <ChevronDown size={10} color="#9CA3AF" className="ml-2" />
                                            </View>
                                        </View>
                                        <View className="w-40 items-center">
                                            <Text className="text-[9px] text-gray-500 font-bold">Start: <Text className="text-gray-900">2026-08-21</Text></Text>
                                            <Text className="text-[9px] text-gray-500 font-bold mt-1">End: <Text className="text-gray-900">2026-08-31</Text></Text>
                                        </View>
                                        <View className="w-40 items-center">
                                            <Text className="text-[9px] text-gray-400 font-bold">Start: NA</Text>
                                            <Text className="text-[9px] text-gray-400 font-bold mt-1">End: NA</Text>
                                        </View>
                                        <Text className="w-24 text-[10px] text-gray-700 text-center">Amit patil</Text>
                                        <Text className="w-32 text-[10px] text-gray-700 text-center">{row.aU}</Text>
                                        <Text className="w-24 text-[10px] text-gray-700 text-center">{row.comp}</Text>
                                        <Text className="w-24 text-[10px] text-gray-700 text-center">0</Text>
                                        <Text className="w-24 text-[10px] text-gray-700 text-center">₹0 / ₹0</Text>
                                        <View className="w-32 items-center justify-center">
                                            {row.audio ? (
                                                <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-1">
                                                    <Play size={10} color="#374151" />
                                                    <View className="w-6 h-0.5 bg-gray-300 mx-2" />
                                                    <Text className="text-[8px] font-bold">:</Text>
                                                </View>
                                            ) : <Text className="text-[9px] text-gray-400 italic">null</Text>}
                                        </View>
                                        <View className="w-32 items-center justify-center">
                                            {row.img ? (
                                                <View className="w-6 h-6 bg-blue-50 rounded items-center justify-center border border-blue-100">
                                                    <ImageIcon size={12} color="#3B82F6" />
                                                </View>
                                            ) : <Text className="text-[9px] text-gray-400 italic">null</Text>}
                                        </View>
                                        <View className="flex-1 min-w-[100px] flex-row items-center justify-end space-x-2 pr-2">
                                            <Activity size={12} color="#9CA3AF" />
                                            <Eye size={12} color="#3B82F6" />
                                            <Edit3 size={12} color="#9CA3AF" />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* TAB 2: PROJECT TASKS TABLE */}
                        {activeTab === 'project' && (
                            <View className="min-w-[1100px] flex-1">
                                <View className="bg-indigo-50/50 p-4 border-b border-indigo-100 flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <View className="w-10 h-10 bg-indigo-500 rounded-lg items-center justify-center mr-4">
                                            <Folder size={20} color="#FFF" />
                                        </View>
                                        <View>
                                            <Text className="font-bold text-gray-900 text-sm">Sara City</Text>
                                            <View className="flex-row items-center mt-1">
                                                <List size={10} color="#6B7280" className="mr-1" />
                                                <Text className="text-[9px] font-medium text-gray-500 uppercase tracking-widest mr-3">33 Tasks</Text>
                                                <Text className="text-[9px] font-medium text-gray-500 uppercase tracking-widest">Planned</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <ChevronUp size={20} color="#4F46E5" />
                                </View>
                                
                                <View className="flex-row items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
                                    <Text className="flex-2 w-1/3 text-[9px] font-bold text-gray-900 uppercase tracking-widest">TASK INTELLIGENCE</Text>
                                    <Text className="flex-1 w-1/6 text-[9px] font-bold text-gray-900 uppercase tracking-widest">ASSIGNED TO</Text>
                                    <Text className="flex-1 w-1/6 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">DEADLINE</Text>
                                    <Text className="flex-1 w-1/6 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">STATUS</Text>
                                    <Text className="flex-1 w-1/6 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">PRIORITY</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-right">ACTIONS</Text>
                                </View>

                                {/* Project Task Rows */}
                                {[
                                    { t: 'create kala task', d: 'mcv nmmnmkmkmk', pr: 'LOW', s: 'Planned', sColor: 'gray', aN: 'rahul patil', aRole: 'Admin', audio: false },
                                    { t: 'hfhfhhfhhfhfhhfhf', d: '', pr: 'MEDIUM', s: 'Planned', sColor: 'gray', aN: 'Unassigned', aRole: 'Engineer', audio: false },
                                    { t: 'kkkkkkkkkkkkkkkk', d: 'fdfdsdf', pr: 'CRITICAL', s: 'In Progress', sColor: 'blue', aN: 'rahul patil', aRole: 'Admin', audio: true },
                                    { t: 'jghmjghjtyjuy', d: 'fdfdsgh', pr: 'MEDIUM', s: 'Planned', sColor: 'gray', aN: 'Ramesh Sharma', aRole: 'Labour', audio: false }
                                ].map((row, i) => (
                                    <View key={i} className="flex-row items-center px-6 py-5 border-b border-gray-50">
                                        <View className="flex-2 w-1/3 pr-4">
                                            <Text className="text-sm font-bold text-gray-900 mb-1">{row.t}</Text>
                                            <Text className="text-[10px] text-gray-500 mb-2">{row.d}</Text>
                                            {row.audio && (
                                                <View className="flex-row items-center w-32 bg-green-50 rounded-full px-2 py-1 border border-green-100">
                                                    <View className="w-4 h-4 bg-green-500 rounded-full items-center justify-center mr-2">
                                                        <Play size={8} color="#FFF" />
                                                    </View>
                                                    <View className="flex-1 h-0.5 bg-green-300 mr-2" />
                                                    <Text className="text-[8px] font-bold text-green-700">0:00</Text>
                                                </View>
                                            )}
                                        </View>
                                        <View className="flex-1 w-1/6 flex-row items-center">
                                            <View className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 items-center justify-center mr-2">
                                                <User size={12} color="#9CA3AF" />
                                            </View>
                                            <View>
                                                <Text className="text-xs font-bold text-gray-900">{row.aN}</Text>
                                                <Text className="text-[10px] text-gray-500">{row.aRole}</Text>
                                            </View>
                                        </View>
                                        <View className="flex-1 w-1/6 items-center flex-row justify-center">
                                            <Calendar size={12} color="#9CA3AF" className="mr-2" />
                                            <Text className="text-xs font-bold text-gray-700">8/31/2026</Text>
                                        </View>
                                        <View className="flex-1 w-1/6 items-center">
                                            <View className="flex-row items-center border border-gray-200 rounded-md px-3 py-1.5 bg-white">
                                                <View className={`w-1.5 h-1.5 rounded-full mr-2 ${row.sColor === 'blue' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                                <Text className="text-[10px] font-bold text-gray-700">{row.s}</Text>
                                                <ChevronDown size={12} color="#9CA3AF" className="ml-3" />
                                            </View>
                                        </View>
                                        <View className="flex-1 w-1/6 items-center">
                                            <Badge text={row.pr} color={row.pr} />
                                        </View>
                                        <View className="w-24 items-end pr-4">
                                            <View className="w-6 h-6 bg-blue-50 rounded-full items-center justify-center border border-blue-100">
                                                <Eye size={12} color="#3B82F6" />
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* TAB 3: TASK REQUESTS TABLE */}
                        {activeTab === 'requests' && (
                            <View className="min-w-[1400px] flex-1">
                                <View className="flex-row items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
                                    <Text className="w-40 text-[9px] font-bold text-gray-900 uppercase tracking-widest">TITLE</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-900 uppercase tracking-widest">CATEGORY</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-900 uppercase tracking-widest">PROJECT NAME</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">PRIORITY</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-900 uppercase tracking-widest">DESCRIPTION</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">ATTACHMENT URL</Text>
                                    <Text className="w-32 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">ASSIGNED NAME</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">STATUS</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">IS DELETED</Text>
                                    <Text className="w-36 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">CREATED AT</Text>
                                    <Text className="w-36 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-center">UPDATED AT</Text>
                                    <Text className="w-24 text-[9px] font-bold text-gray-900 uppercase tracking-widest text-right">ACTIONS</Text>
                                </View>

                                {/* Request Rows */}
                                {[
                                    { t: 'new task request', c: 'construction', p: 'Sara City', pr: 'LOW', d: '-', a: '-', user: 'Unassigned' },
                                    { t: 'new task 2', c: 'saddfksj', p: 'Sara City', pr: 'MEDIUM', d: 'sacdfjs', a: '-', user: 'ramu dixit' },
                                    { t: 'new task request', c: 'construction', p: 'Sara City', pr: 'HIGH', d: 'dfdsguyuitiu', a: '-', user: 'Amit patil' },
                                    { t: 'vdujvjdn', c: 'fduvdvr', p: 'Sara City', pr: 'MEDIUM', d: 'grhvdz', a: '-', user: 'Unassigned' },
                                    { t: 'the new equest', c: 'electricalq', p: 'Rohan Harita', pr: 'MEDIUM', d: 'fdjfjsvmf', a: '-', user: 'Unassigned' },
                                    { t: 'TV TASK', c: 'New Task', p: 'Sara City', pr: 'MEDIUM', d: 'good working', a: 'View', user: 'Unassigned' },
                                    { t: 'TV TASK', c: 'New Task', p: 'Sara City', pr: 'MEDIUM', d: 'good working', a: 'View', user: 'Unassigned' }
                                ].map((row, i) => (
                                    <View key={i} className="flex-row items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50">
                                        <Text className="w-40 text-xs font-bold text-gray-900">{row.t}</Text>
                                        <Text className="w-24 text-[10px] text-gray-600">{row.c}</Text>
                                        <Text className="w-32 text-xs font-bold text-gray-800">{row.p}</Text>
                                        <View className="w-24 items-center">
                                            <Badge text={row.pr} color={row.pr} />
                                        </View>
                                        <Text className="w-32 text-[10px] text-gray-600" numberOfLines={1}>{row.d}</Text>
                                        <View className="w-32 items-center">
                                            <Text className={`text-[10px] ${row.a === 'View' ? 'text-blue-500 underline font-bold' : 'text-blue-500 font-bold'}`}>{row.a}</Text>
                                        </View>
                                        <Text className="w-32 text-[10px] text-gray-600 text-center">{row.user}</Text>
                                        <View className="w-24 items-center">
                                            <View className="bg-yellow-100 px-2 py-0.5 rounded-sm">
                                                <Text className="text-[9px] font-bold text-yellow-600 uppercase">PENDING</Text>
                                            </View>
                                        </View>
                                        <Text className="w-24 text-[10px] text-gray-600 text-center">No</Text>
                                        <Text className="w-36 text-[9px] text-gray-400 text-center">8/21/2026, 12:32:15 PM</Text>
                                        <Text className="w-36 text-[9px] text-gray-400 text-center">8/21/2026, 12:32:15 PM</Text>
                                        <View className="w-24 flex-row justify-end space-x-3 pr-2">
                                            <Edit3 size={12} color="#9CA3AF" />
                                            <Trash2 size={12} color="#9CA3AF" />
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
