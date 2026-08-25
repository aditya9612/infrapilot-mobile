import TopHeader from '../../components/TopHeader';
import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Bell, Search, ChevronDown, Filter, Plus, Calendar as CalendarIcon, FileImage, LayoutGrid, List as ListIcon, UploadCloud } from 'lucide-react-native';

export default function SitePhotosScreen() {
    const navigation = useNavigation();

    const StatCard = ({ title, value, subtitle, valueColor = "text-gray-900" }: any) => (
        <View className="flex-1 min-w-[250px] p-2">
            <View className="bg-white p-5 rounded-xl border border-gray-200 h-full justify-center">
                <Text className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">{title}</Text>
                <Text className={`text-3xl font-bold ${valueColor}`}>{value}</Text>
                <Text className="text-[10px] font-bold text-gray-400 mt-2">{subtitle}</Text>
            </View>
        </View>
    );

    const EvidenceCard = ({ id, label, title, date, imageUri }: any) => (
        <View className="w-full md:w-1/2 lg:w-1/3 p-3">
            <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 h-full">
                <View className="relative h-48 w-full bg-gray-100">
                    {/* Checkbox mock */}
                    <View className="absolute top-3 left-3 z-10 w-5 h-5 rounded border-2 border-white/80 bg-black/20" />
                    
                    {/* Label Badge */}
                    {label && (
                        <View className="absolute top-3 left-10 z-10 bg-white/90 backdrop-blur-md px-2 py-1 rounded">
                            <Text className="text-[9px] font-bold text-gray-800 uppercase tracking-widest">{label}</Text>
                        </View>
                    )}
                    
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <View className="w-full h-full items-center justify-center bg-gray-200">
                            <FileImage size={40} color="#9CA3AF" />
                        </View>
                    )}
                </View>
                
                <View className="p-4 flex-1 justify-between flex-col">
                    <View>
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AUDIT-{id}</Text>
                            <View className="bg-blue-50 px-2 py-1 rounded-sm border border-blue-100">
                                <Text className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">LIVE PROGRESS</Text>
                            </View>
                        </View>
                        <Text className="text-sm font-bold text-gray-900 mb-4" numberOfLines={2}>{title}</Text>
                    </View>
                    
                    <View className="flex-row justify-between items-center mt-auto pt-4 border-t border-gray-50">
                        <View className="w-6 h-6 rounded-full bg-blue-600 items-center justify-center">
                            <Text className="text-[8px] font-bold text-white">IP</Text>
                        </View>
                        <View className="flex-row items-center">
                            <CalendarIcon size={12} color="#9CA3AF" className="mr-1.5" />
                            <Text className="text-[10px] font-bold text-gray-500">{date}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-[#F8FAFC] flex-col">
            
            <TopHeader title="Site Evidence" subtitle="Engineer • Site Photos • Gallery" />


            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
                {/* Header & Main Actions */}
                <View className="flex-row flex-wrap justify-between items-center mb-6">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-2xl font-bold text-gray-900">Evidence Documentation Ledger</Text>
                        <Text className="text-xs text-gray-500 mt-1">Maintain a chronological visual archive of project progress milestones.</Text>
                    </View>
                    
                    <TouchableOpacity className="bg-blue-600 flex-row items-center px-5 py-2.5 rounded-lg shadow-sm">
                        <UploadCloud size={16} color="#FFF" className="mr-2" />
                        <Text className="text-white font-bold text-sm">Log Site Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Row */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard title="TOTAL EVIDENCE" value="18" subtitle="Project Archive" />
                    <StatCard title="RECENT LOGS" value="15" subtitle="Past 7 Days" valueColor="text-emerald-500" />
                </View>

                {/* Filters Toolbar */}
                <View className="flex-row flex-wrap items-center justify-between mb-6">
                    <View className="flex-row flex-wrap items-center space-y-3 lg:space-y-0 space-x-0 lg:space-x-3 w-full lg:w-auto">
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5 min-w-[250px] w-full lg:w-auto mb-3 lg:mb-0 shadow-sm">
                            <Search size={16} color="#9CA3AF" className="mr-2" />
                            <TextInput className="flex-1 font-medium text-xs text-gray-800" placeholder="Search by description or audit ID..." placeholderTextColor="#9CA3AF" />
                        </View>
                        
                        <View className="flex-row space-x-3 w-full lg:w-auto">
                            <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-4 py-2.5 justify-between min-w-[140px] shadow-sm flex-1 lg:flex-none">
                                <View className="flex-row items-center">
                                    <Filter size={14} color="#9CA3AF" className="mr-2" />
                                    <Text className="font-bold text-xs text-gray-700">ALL ACTIVITIES</Text>
                                </View>
                                <ChevronDown size={14} color="#4B5563" />
                            </View>
                            
                            <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-4 py-2.5 justify-between min-w-[140px] shadow-sm flex-1 lg:flex-none">
                                <View className="flex-row items-center">
                                    <Filter size={14} color="#9CA3AF" className="mr-2" />
                                    <Text className="font-bold text-xs text-gray-700">ALL LOCATIONS</Text>
                                </View>
                                <ChevronDown size={14} color="#4B5563" />
                            </View>

                            <View className="flex-row items-center bg-white border border-blue-500 rounded-full px-4 py-2.5 justify-between shadow-sm">
                                <Text className="font-bold text-xs text-blue-600 mr-2">Latest First</Text>
                                <ChevronDown size={14} color="#3B82F6" />
                            </View>
                        </View>
                    </View>
                    
                    <View className="flex-row items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm hidden md:flex">
                        <TouchableOpacity className="p-1.5 bg-blue-50 rounded">
                            <LayoutGrid size={16} color="#3B82F6" />
                        </TouchableOpacity>
                        <TouchableOpacity className="p-1.5">
                            <ListIcon size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Photo Grid */}
                <View className="flex-row flex-wrap -mx-3">
                    <EvidenceCard 
                        id="#36" 
                        title="" 
                        date="2026-08-21" 
                        imageUri="https://images.unsplash.com/photo-1541888082460-705fc0869eb0?q=80&w=200&auto=format&fit=crop"
                    />
                    <EvidenceCard 
                        id="#35" 
                        label="FOUNDATION WORK" 
                        title="HNJHNMYHJN" 
                        date="2026-08-21" 
                        imageUri="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=200&auto=format&fit=crop"
                    />
                    <EvidenceCard 
                        id="#34" 
                        title="" 
                        date="2026-08-20" 
                        imageUri="https://images.unsplash.com/photo-1541888082460-705fc0869eb0?q=80&w=200&auto=format&fit=crop"
                    />
                    <EvidenceCard 
                        id="#33" 
                        title="RFGHBFGJNHGDJH" 
                        date="2026-08-19" 
                        imageUri="https://images.unsplash.com/photo-1541888082460-705fc0869eb0?q=80&w=200&auto=format&fit=crop"
                    />
                </View>
            </ScrollView>
        </View>
    );
}
