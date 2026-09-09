import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, TextInput } from 'react-native';
import { Menu, Search, Inbox, FileText, CreditCard, BookOpen, X, Bell, User } from 'lucide-react-native';
import { useNavigation } from 'expo-router';

type MainTab = 'RA Bills' | 'Payments' | 'Journals';

export function ApprovalsScreen() {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const [mainTab, setMainTab] = useState<MainTab>('RA Bills');
    const [searchQuery, setSearchQuery] = useState('');

    const getHeaderTitle = () => {
        switch (mainTab) {
            case 'RA Bills': return 'Pending RA Bills';
            case 'Payments': return 'Pending Payments';
            case 'Journals': return 'Pending Journals';
        }
    };

    const getHeaderSubtitle = () => {
        switch (mainTab) {
            case 'RA Bills': return 'Review and manage pending ra bills requiring your approval.';
            case 'Payments': return 'Review and manage pending payments requiring your approval.';
            case 'Journals': return 'Review and manage pending journals requiring your approval.';
        }
    };

    const getEmptyStateText = () => {
        switch (mainTab) {
            case 'RA Bills': return 'No RA Bills Found';
            case 'Payments': return 'No Payments Found';
            case 'Journals': return 'No Journals Found';
        }
    };

    return (
        <View className="flex-1 bg-[#F8F9FA]">
            {/* Header */}
            <View className="bg-[#2563EB] px-6 py-4 flex-row items-center justify-between z-10 relative">
                <View className="flex-row items-center">
                    {!isDesktop && (
                        <TouchableOpacity onPress={() => (navigation as any).toggleDrawer()} className="mr-4">
                            <Menu color="#fff" size={24} />
                        </TouchableOpacity>
                    )}
                    <View>
                        <Text className="text-white text-xl font-bold">Approval Center</Text>
                        <Text className="text-blue-200 text-xs mt-1">InfraPilot • Accountant • Approval Center</Text>
                    </View>
                </View>
                <View className="flex-row items-center space-x-4">
                    <TouchableOpacity className="relative">
                        <View className="w-4 h-4 bg-red-500 rounded-full absolute -top-1 -right-1 z-10 items-center justify-center">
                            <Text className="text-white text-[8px] font-bold">21</Text>
                        </View>
                        <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                            <Bell color="#fff" size={16} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                        <User color="#fff" size={16} />
                    </TouchableOpacity>
                </View>
                
                {/* Error Toast for Payments tab as shown in Image 2 */}
                {mainTab === 'Payments' && (
                    <View className="absolute right-6 top-4 bg-white rounded-md shadow-md border border-gray-100 p-2 flex-row items-center z-50">
                        <View className="bg-red-500 w-4 h-4 rounded-full items-center justify-center mr-2">
                            <X size={10} color="#fff" strokeWidth={3} />
                        </View>
                        <Text className="text-xs text-gray-700 font-medium">Failed to load Payments</Text>
                    </View>
                )}
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4 md:p-6">
                    {/* Main Tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                        <View className="flex-row bg-white rounded-lg p-1 border border-gray-200">
                            {(['RA Bills', 'Payments', 'Journals'] as MainTab[]).map((tab) => {
                                const Icon = tab === 'RA Bills' ? FileText : tab === 'Payments' ? CreditCard : BookOpen;
                                return (
                                    <TouchableOpacity
                                        key={tab}
                                        onPress={() => setMainTab(tab)}
                                        className={`flex-row items-center px-6 py-2 rounded-md ${mainTab === tab ? 'bg-blue-600' : 'bg-transparent'}`}
                                    >
                                        <Icon size={16} color={mainTab === tab ? '#ffffff' : '#6B7280'} className="mr-2" />
                                        <Text className={`font-medium ${mainTab === tab ? 'text-white' : 'text-gray-600'}`}>
                                            {tab}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>

                    {/* Title and Search */}
                    <View className="flex-col md:flex-row justify-between md:items-center mb-6 space-y-4 md:space-y-0">
                        <View>
                            <Text className="text-xl md:text-2xl font-bold text-gray-900">{getHeaderTitle()}</Text>
                            <Text className="text-sm text-gray-500 mt-1">{getHeaderSubtitle()}</Text>
                        </View>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2 w-full md:w-64">
                            <Search size={16} color="#9CA3AF" />
                            <TextInput
                                placeholder={`Search ${mainTab.toLowerCase()}...`}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                className="flex-1 ml-2 text-sm text-gray-700 outline-none"
                            />
                        </View>
                    </View>

                    {/* Empty State */}
                    <View className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[400px] flex items-center justify-center p-8">
                        <View className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Inbox size={32} color="#D1D5DB" />
                        </View>
                        <Text className="text-lg font-bold text-gray-800 mb-2">{getEmptyStateText()}</Text>
                        <Text className="text-sm text-gray-500 text-center">There are no pending items requiring your approval right now.</Text>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}
