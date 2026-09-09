import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, TextInput } from 'react-native';
import { Menu, Plus, Edit3, Eye, Search, ChevronDown, Filter, Calendar } from 'lucide-react-native';
import { useNavigation } from 'expo-router';

type MainTab = 'Assets' | 'Depreciation' | 'Maintenance';
type AssetSubTab = 'Asset List' | 'Asset Details';
type DepreciationSubTab = 'Depreciation Setup' | 'Monthly Depreciation' | 'Annual Depreciation' | 'Depreciation History';
type MaintenanceSubTab = 'Maintenance Schedule' | 'Service History' | 'Repair Cost' | 'AMC Tracking';

export function FixedAssetsScreen() {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const [mainTab, setMainTab] = useState<MainTab>('Assets');
    const [assetSubTab, setAssetSubTab] = useState<AssetSubTab>('Asset List');
    const [deprSubTab, setDeprSubTab] = useState<DepreciationSubTab>('Monthly Depreciation');
    const [maintSubTab, setMaintSubTab] = useState<MaintenanceSubTab>('Maintenance Schedule');

    const assetsList = [
        { id: 'AST-2', name: 'mixer', category: 'General', purchaseValue: '₹10,000', purchaseDate: '2026-09-01', currentValue: '₹10,000', location: 'Metro City', status: 'Active' },
        { id: 'AST-1', name: 'bulldozer', category: 'General', purchaseValue: '₹5,000', purchaseDate: '2026-09-01', currentValue: '₹5,000', location: 'Metro City', status: 'Active' },
    ];

    const assetDetails = [
        { id: 'AST-2', name: 'mixer', projectName: 'Metro City', purchaseValue: '₹10,000', deprRate: '10.00%', currentValue: '₹10,000' },
        { id: 'AST-1', name: 'bulldozer', projectName: 'Metro City', purchaseValue: '₹5,000', deprRate: '10.00%', currentValue: '₹5,000' },
    ];

    const deprSetupData = [
        { category: 'Vehicles', method: 'SLM', rate: '15', status: 'Active' },
        { category: 'Machinery', method: 'WDV', rate: '20', status: 'Active' },
    ];

    const annualDeprData = [
        { year: '2023-24', grossBlock: '₹4,50,00,000', claimed: '₹45,20,000', netBlock: '₹4,04,80,000' }
    ];

    const upcomingMaintData = [
        { asset: 'Concrete Mixer 2', dueDate: '2024-12-02', serviceType: 'Oil change', status: 'Pending' }
    ];

    const getHeaderTitle = () => {
        switch (mainTab) {
            case 'Assets': return 'Assets Register';
            case 'Depreciation': return 'Depreciation';
            case 'Maintenance': return 'Maintenance';
        }
    };

    const getHeaderSubtitle = () => {
        switch (mainTab) {
            case 'Assets': return 'Manage and track all company fixed assets.';
            case 'Depreciation': return 'Calculate and manage asset depreciation.';
            case 'Maintenance': return 'Log and track asset maintenance activities.';
        }
    };

    return (
        <View className="flex-1 bg-[#F8F9FA]">
            {/* Header */}
            <View className="bg-[#2563EB] px-6 py-4 flex-row items-center justify-between z-10">
                <View className="flex-row items-center">
                    {!isDesktop && (
                        <TouchableOpacity onPress={() => (navigation as any).toggleDrawer()} className="mr-4">
                            <Menu color="#fff" size={24} />
                        </TouchableOpacity>
                    )}
                    <View>
                        <Text className="text-white text-xl font-bold">Fixed Assets Management</Text>
                        <Text className="text-blue-200 text-xs mt-1">Accountant • Fixed Assets</Text>
                    </View>
                </View>
                <View className="flex-row items-center space-x-4">
                    <View className="relative">
                        <View className="w-4 h-4 bg-red-500 rounded-full absolute -top-1 -right-1 z-10 items-center justify-center">
                            <Text className="text-white text-[8px] font-bold">21</Text>
                        </View>
                        <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                            <Menu color="#fff" size={16} />
                        </View>
                    </View>
                    <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                        <Text className="text-white font-bold">A</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4 md:p-6">
                    {/* Title */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900">{getHeaderTitle()}</Text>
                        <Text className="text-gray-500 mt-1">{getHeaderSubtitle()}</Text>
                    </View>

                    {/* Main Tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                        <View className="flex-row bg-white rounded-lg p-1 border border-gray-200">
                            {(['Assets', 'Depreciation', 'Maintenance'] as MainTab[]).map((tab) => (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => setMainTab(tab)}
                                    className={`px-4 py-2 rounded-md ${mainTab === tab ? 'bg-blue-50' : 'bg-transparent'}`}
                                >
                                    <Text className={`font-medium ${mainTab === tab ? 'text-blue-600' : 'text-gray-600'}`}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* SubTabs Area (if Assets) */}
                    {mainTab === 'Assets' && (
                        <View className="space-y-6">
                            <View className="bg-white rounded-xl border border-gray-200 p-2 flex-row justify-between items-center shadow-sm flex-wrap gap-2">
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
                                    <View className="flex-row items-center space-x-2 p-1">
                                        <TouchableOpacity 
                                            onPress={() => setAssetSubTab('Asset List')}
                                            className={`flex-row items-center px-4 py-2 rounded-lg ${assetSubTab === 'Asset List' ? 'bg-orange-50' : 'bg-transparent'}`}
                                        >
                                            <Menu size={16} color={assetSubTab === 'Asset List' ? '#F97316' : '#6B7280'} className="mr-2" />
                                            <Text className={`font-medium text-sm ${assetSubTab === 'Asset List' ? 'text-orange-600' : 'text-gray-600'}`}>Asset List</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity 
                                            onPress={() => setAssetSubTab('Asset Details')}
                                            className={`flex-row items-center px-4 py-2 rounded-lg ${assetSubTab === 'Asset Details' ? 'bg-blue-50' : 'bg-transparent'}`}
                                        >
                                            <Menu size={16} color={assetSubTab === 'Asset Details' ? '#3B82F6' : '#6B7280'} className="mr-2" />
                                            <Text className={`font-medium text-sm ${assetSubTab === 'Asset Details' ? 'text-blue-600' : 'text-gray-600'}`}>Asset Details</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                                <TouchableOpacity className="bg-[#2563EB] rounded-full px-5 py-2 m-2">
                                    <Text className="text-white font-bold text-sm">Add Asset</Text>
                                </TouchableOpacity>
                            </View>

                            {assetSubTab === 'Asset List' && (
                                <>
                                    {/* Filters */}
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex-row items-center space-x-4 mb-2">
                                            <View className="flex-row items-center">
                                                <Search size={16} color="#6B7280" className="mr-2" />
                                                <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider">FILTER BY:</Text>
                                            </View>
                                            
                                            <View className="flex-row items-center">
                                                <Text className="text-xs text-gray-500 uppercase mr-2">CATEGORY</Text>
                                                <View className="flex-row items-center border-b border-gray-300 pb-1">
                                                    <Text className="text-sm text-gray-800 mr-2">All</Text>
                                                    <ChevronDown size={14} color="#6B7280" />
                                                </View>
                                            </View>

                                            <View className="flex-row items-center">
                                                <Text className="text-xs text-gray-500 uppercase mr-2">PROJECT</Text>
                                                <View className="flex-row items-center border-b border-gray-300 pb-1">
                                                    <Text className="text-sm text-gray-800 mr-2">All</Text>
                                                    <ChevronDown size={14} color="#6B7280" />
                                                </View>
                                            </View>

                                            <View className="flex-row items-center">
                                                <Text className="text-xs text-gray-500 uppercase mr-2">LOCATION</Text>
                                                <View className="flex-row items-center border-b border-gray-300 pb-1">
                                                    <Text className="text-sm text-gray-800 mr-2">All</Text>
                                                    <ChevronDown size={14} color="#6B7280" />
                                                </View>
                                            </View>

                                            <View className="flex-row items-center">
                                                <Text className="text-xs text-gray-500 uppercase mr-2">STATUS</Text>
                                                <View className="flex-row items-center border-b border-gray-300 pb-1">
                                                    <Text className="text-sm text-gray-800 mr-2">Active</Text>
                                                    <ChevronDown size={14} color="#6B7280" />
                                                </View>
                                            </View>

                                            <View className="flex-row items-center">
                                                <Text className="text-xs text-gray-500 uppercase mr-2">PURCHASE DATE</Text>
                                                <View className="flex-row items-center border-b border-gray-300 pb-1">
                                                    <Text className="text-sm text-gray-800 mr-2">dd-mm-yyyy</Text>
                                                    <Calendar size={14} color="#6B7280" />
                                                </View>
                                            </View>
                                            
                                            <TouchableOpacity className="bg-[#111827] rounded-lg px-4 py-2">
                                                <Text className="text-white font-medium text-xs">Apply</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>

                                    {/* Asset List Table */}
                                    <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                        <View className="p-4 border-b border-gray-100">
                                            <Text className="font-bold text-gray-800">Asset List</Text>
                                        </View>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={{ minWidth: 1000 }}>
                                                {/* Header */}
                                                <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-100">
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">ASSET ID</Text>
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">NAME</Text>
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">CATEGORY</Text>
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">PURCHASE VALUE</Text>
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">PURCHASE DATE</Text>
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">CURRENT VALUE</Text>
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">PROJECT / LOCATION</Text>
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">STATUS</Text>
                                                    <Text className="w-20 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">ACTION</Text>
                                                </View>
                                                {/* Body */}
                                                {assetsList.map((row, idx) => (
                                                    <View key={idx} className="flex-row items-center p-4 border-b border-gray-50 hover:bg-gray-50">
                                                        <Text className="flex-1 text-sm font-medium text-gray-800">{row.id}</Text>
                                                        <Text className="flex-1 text-sm text-gray-600">{row.name}</Text>
                                                        <Text className="flex-1 text-sm text-gray-600">{row.category}</Text>
                                                        <Text className="flex-1 text-sm font-medium text-gray-800">{row.purchaseValue}</Text>
                                                        <Text className="flex-1 text-sm text-gray-600">{row.purchaseDate}</Text>
                                                        <Text className="flex-1 text-sm font-medium text-gray-800">{row.currentValue}</Text>
                                                        <Text className="flex-1 text-sm text-gray-600">{row.location}</Text>
                                                        <Text className="flex-1 text-sm font-medium text-gray-800">{row.status}</Text>
                                                        <View className="w-20 flex-row items-center justify-center space-x-2">
                                                            <TouchableOpacity className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center">
                                                                <Eye size={14} color="#3B82F6" />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                                                                <Edit3 size={14} color="#6B7280" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        </ScrollView>
                                        {/* Pagination Footer */}
                                        <View className="p-4 border-t border-gray-100 flex-row items-center justify-between bg-gray-50">
                                            <View className="flex-row items-center">
                                                <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                                                <View className="bg-white border border-gray-200 rounded px-2 py-1 flex-row items-center">
                                                    <Text className="text-xs text-gray-700 mr-1">10</Text>
                                                    <ChevronDown size={12} color="#6B7280" />
                                                </View>
                                            </View>
                                            <Text className="text-xs text-gray-500">Showing 1 - 2 of 2 records</Text>
                                            <View className="flex-row items-center space-x-1">
                                                <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                                    <Text className="text-gray-400">{'<'}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity className="w-6 h-6 items-center justify-center rounded bg-blue-600">
                                                    <Text className="text-white text-xs font-bold">1</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                                    <Text className="text-gray-400">{'>'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            )}

                            {assetSubTab === 'Asset Details' && (
                                <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <View className="p-4 border-b border-gray-100">
                                        <Text className="font-bold text-gray-800">Asset Details Lookup</Text>
                                    </View>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View style={{ minWidth: 900 }}>
                                            {/* Header */}
                                            <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-100">
                                                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">ASSET ID</Text>
                                                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">NAME</Text>
                                                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">PROJECT NAME</Text>
                                                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">PURCHASE VALUE</Text>
                                                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">DEPR. RATE</Text>
                                                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">CURRENT VALUE</Text>
                                            </View>
                                            {/* Body */}
                                            {assetDetails.map((row, idx) => (
                                                <View key={idx} className="flex-row items-center p-4 border-b border-gray-50 hover:bg-gray-50">
                                                    <Text className="flex-1 text-sm font-medium text-gray-800">{row.id}</Text>
                                                    <Text className="flex-1 text-sm text-gray-600">{row.name}</Text>
                                                    <Text className="flex-1 text-sm text-gray-600">{row.projectName}</Text>
                                                    <Text className="flex-1 text-sm font-medium text-gray-800">{row.purchaseValue}</Text>
                                                    <Text className="flex-1 text-sm text-gray-600">{row.deprRate}</Text>
                                                    <Text className="flex-1 text-sm font-medium text-gray-800">{row.currentValue}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </ScrollView>
                                    {/* Pagination Footer */}
                                    <View className="p-4 border-t border-gray-100 flex-row items-center justify-between bg-gray-50">
                                        <View className="flex-row items-center">
                                            <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                                            <View className="bg-white border border-gray-200 rounded px-2 py-1 flex-row items-center">
                                                <Text className="text-xs text-gray-700 mr-1">10</Text>
                                                <ChevronDown size={12} color="#6B7280" />
                                            </View>
                                        </View>
                                        <Text className="text-xs text-gray-500">Showing 1 - 2 of 2 records</Text>
                                        <View className="flex-row items-center space-x-1">
                                            <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                                <Text className="text-gray-400">{'<'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className="w-6 h-6 items-center justify-center rounded bg-blue-600">
                                                <Text className="text-white text-xs font-bold">1</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                                <Text className="text-gray-400">{'>'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Depreciation Tabs Area */}
                    {mainTab === 'Depreciation' && (
                        <View className="space-y-6">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                                <View className="flex-row space-x-6">
                                    {(['Depreciation Setup', 'Monthly Depreciation', 'Annual Depreciation', 'Depreciation History'] as DepreciationSubTab[]).map((subtab) => (
                                        <TouchableOpacity
                                            key={subtab}
                                            onPress={() => setDeprSubTab(subtab)}
                                            className={`flex-row items-center pb-2 border-b-2 ${deprSubTab === subtab ? 'border-blue-600' : 'border-transparent'}`}
                                        >
                                            <Menu size={16} color={deprSubTab === subtab ? '#2563EB' : '#9CA3AF'} className="mr-2" />
                                            <Text className={`font-medium text-sm ${deprSubTab === subtab ? 'text-blue-600' : 'text-gray-500'}`}>
                                                {subtab}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>

                            {deprSubTab === 'Monthly Depreciation' && (
                                <>
                                    <View className="bg-white rounded-xl border border-gray-200 p-6 flex-col md:flex-row md:items-center justify-between shadow-sm">
                                        <View className="mb-4 md:mb-0">
                                            <Text className="font-bold text-gray-800 text-base">Monthly Depreciation Processing</Text>
                                            <Text className="text-sm text-gray-500">Review and process depreciation for current month</Text>
                                        </View>
                                        <TouchableOpacity className="bg-[#6366F1] rounded-lg px-6 py-2">
                                            <Text className="text-white font-medium text-sm">Process & Auto Journal Entry</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <Text className="font-bold text-gray-800 mb-4 text-base">Auto Journal Entry Preview</Text>
                                        <View className="bg-[#F8FAFC] p-4 rounded-lg border border-gray-100">
                                            <View className="flex-row justify-between mb-2">
                                                <Text className="text-sm font-medium text-gray-800 flex-1">Depreciation Expense A/c</Text>
                                                <Text className="text-sm font-medium text-gray-500 w-16 text-right">Dr</Text>
                                                <Text className="text-sm font-bold text-gray-800 w-24 text-right">₹1,25,000</Text>
                                            </View>
                                            <View className="flex-row justify-between">
                                                <Text className="text-sm font-medium text-gray-500 flex-1 ml-6">To Accumulated Depreciation A/c</Text>
                                                <Text className="text-sm font-medium text-gray-500 w-16 text-right">Cr</Text>
                                                <Text className="text-sm font-bold text-gray-800 w-24 text-right">₹1,25,000</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                        <View className="p-4 border-b border-gray-100">
                                            <Text className="font-bold text-gray-800">Monthly Depreciation Schedule</Text>
                                        </View>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={{ minWidth: 900 }}>
                                                {/* Header */}
                                                <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-100">
                                                    <Text className="flex-2 text-xs font-bold text-gray-500 uppercase tracking-wider">ASSET</Text>
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">PURCHASE COST</Text>
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">DEPRECIATION RATE</Text>
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">CURRENT VALUE</Text>
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">MONTHLY DEPRECIATION</Text>
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">ACTION</Text>
                                                </View>
                                                {/* Body */}
                                                <View className="p-6 items-center justify-center">
                                                    <Text className="text-sm text-gray-500">No assets found.</Text>
                                                </View>
                                            </View>
                                        </ScrollView>
                                        {/* Pagination Footer */}
                                        <View className="p-4 border-t border-gray-100 flex-row items-center justify-between bg-gray-50">
                                            <View className="flex-row items-center">
                                                <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                                                <View className="bg-white border border-gray-200 rounded px-2 py-1 flex-row items-center">
                                                    <Text className="text-xs text-gray-700 mr-1">10</Text>
                                                    <ChevronDown size={12} color="#6B7280" />
                                                </View>
                                            </View>
                                            <Text className="text-xs text-gray-500">Showing 1 - 1 of 1 records</Text>
                                            <View className="flex-row items-center space-x-1">
                                                <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                                    <Text className="text-gray-400">{'<'}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity className="w-6 h-6 items-center justify-center rounded bg-blue-600">
                                                    <Text className="text-white text-xs font-bold">1</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                                    <Text className="text-gray-400">{'>'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            )}

                            {deprSubTab === 'Depreciation Setup' && (
                                <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <View className="p-4 border-b border-gray-100">
                                        <Text className="font-bold text-gray-800">Depreciation Methods Configured</Text>
                                    </View>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View style={{ minWidth: 900 }}>
                                            {/* Header */}
                                            <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-100">
                                                <Text className="flex-2 text-xs font-bold text-gray-500 uppercase tracking-wider">ASSET CATEGORY</Text>
                                                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">METHOD</Text>
                                                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">RATE (%)</Text>
                                                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">STATUS</Text>
                                            </View>
                                            {/* Body */}
                                            {deprSetupData.map((row, idx) => (
                                                <View key={idx} className="flex-row items-center p-4 border-b border-gray-50 hover:bg-gray-50">
                                                    <Text className="flex-2 text-sm font-medium text-gray-800">{row.category}</Text>
                                                    <Text className="flex-1 text-sm text-gray-600">{row.method}</Text>
                                                    <Text className="flex-1 text-sm text-gray-600">{row.rate}</Text>
                                                    <View className="flex-1 items-end">
                                                        <View className="bg-green-100 px-2 py-1 rounded-full">
                                                            <Text className="text-[10px] font-bold text-green-700">{row.status}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    </ScrollView>
                                    {/* Pagination Footer */}
                                    <View className="p-4 border-t border-gray-100 flex-row items-center justify-between bg-gray-50">
                                        <View className="flex-row items-center">
                                            <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                                            <View className="bg-white border border-gray-200 rounded px-2 py-1 flex-row items-center">
                                                <Text className="text-xs text-gray-700 mr-1">10</Text>
                                                <ChevronDown size={12} color="#6B7280" />
                                            </View>
                                        </View>
                                        <Text className="text-xs text-gray-500">Showing 1 - 2 of 2 records</Text>
                                        <View className="flex-row items-center space-x-1">
                                            <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                                <Text className="text-gray-400">{'<'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className="w-6 h-6 items-center justify-center rounded bg-blue-600">
                                                <Text className="text-white text-xs font-bold">1</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                                <Text className="text-gray-400">{'>'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {deprSubTab === 'Annual Depreciation' && (
                                <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <View className="p-4 border-b border-gray-100">
                                        <Text className="font-bold text-gray-800">Annual Depreciation Summary</Text>
                                    </View>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View style={{ minWidth: 900 }}>
                                            {/* Header */}
                                            <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-100">
                                                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">FINANCIAL YEAR</Text>
                                                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">TOTAL GROSS BLOCK</Text>
                                                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">DEPRECIATION CLAIMED</Text>
                                                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">NET BLOCK</Text>
                                            </View>
                                            {/* Body */}
                                            {annualDeprData.map((row, idx) => (
                                                <View key={idx} className="flex-row items-center p-4 border-b border-gray-50 hover:bg-gray-50">
                                                    <Text className="flex-1 text-sm font-medium text-gray-800">{row.year}</Text>
                                                    <Text className="flex-1 text-sm text-gray-600">{row.grossBlock}</Text>
                                                    <Text className="flex-1 text-sm text-gray-600">{row.claimed}</Text>
                                                    <Text className="flex-1 text-sm font-medium text-gray-800 text-right">{row.netBlock}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </ScrollView>
                                    {/* Pagination Footer */}
                                    <View className="p-4 border-t border-gray-100 flex-row items-center justify-between bg-gray-50">
                                        <View className="flex-row items-center">
                                            <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                                            <View className="bg-white border border-gray-200 rounded px-2 py-1 flex-row items-center">
                                                <Text className="text-xs text-gray-700 mr-1">10</Text>
                                                <ChevronDown size={12} color="#6B7280" />
                                            </View>
                                        </View>
                                        <Text className="text-xs text-gray-500">Showing 1 - 1 of 1 records</Text>
                                        <View className="flex-row items-center space-x-1">
                                            <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                                <Text className="text-gray-400">{'<'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className="w-6 h-6 items-center justify-center rounded bg-blue-600">
                                                <Text className="text-white text-xs font-bold">1</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                                <Text className="text-gray-400">{'>'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}

                        </View>
                    )}

                    {/* Maintenance Tabs Area */}
                    {mainTab === 'Maintenance' && (
                        <View className="space-y-6">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                                <View className="flex-row space-x-6">
                                    {(['Maintenance Schedule', 'Service History', 'Repair Cost', 'AMC Tracking'] as MaintenanceSubTab[]).map((subtab) => (
                                        <TouchableOpacity
                                            key={subtab}
                                            onPress={() => setMaintSubTab(subtab)}
                                            className={`flex-row items-center pb-2 border-b-2 ${maintSubTab === subtab ? 'border-blue-600' : 'border-transparent'}`}
                                        >
                                            <Menu size={16} color={maintSubTab === subtab ? '#2563EB' : '#9CA3AF'} className="mr-2" />
                                            <Text className={`font-medium text-sm ${maintSubTab === subtab ? 'text-blue-600' : 'text-gray-500'}`}>
                                                {subtab}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>

                            {maintSubTab === 'Maintenance Schedule' && (
                                <View className="flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
                                    {/* Left Column: Form */}
                                    <View className="lg:w-1/3 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                        <Text className="font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2 text-base">Log Maintenance</Text>

                                        <View className="space-y-4">
                                            <View>
                                                <Text className="text-xs font-bold text-gray-500 mb-1">ASSET NAME *</Text>
                                                <View className="flex-row items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                                                    <Text className="text-sm text-gray-800">CAT 320 Excavator</Text>
                                                    <ChevronDown size={16} color="#6B7280" />
                                                </View>
                                            </View>

                                            <View>
                                                <Text className="text-xs font-bold text-gray-500 mb-1">SERVICE DATE *</Text>
                                                <View className="flex-row items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-white">
                                                    <Text className="text-sm text-gray-500">dd-mm-yyyy</Text>
                                                    <Calendar size={16} color="#6B7280" />
                                                </View>
                                            </View>

                                            <View>
                                                <Text className="text-xs font-bold text-gray-500 mb-1">SERVICE VENDOR</Text>
                                                <TextInput className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none" />
                                            </View>

                                            <View>
                                                <Text className="text-xs font-bold text-gray-500 mb-1">MAINTENANCE COST (₹) *</Text>
                                                <TextInput className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none" />
                                            </View>

                                            <View>
                                                <Text className="text-xs font-bold text-gray-500 mb-1">NEXT SERVICE DATE</Text>
                                                <View className="flex-row items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-white">
                                                    <Text className="text-sm text-gray-500">dd-mm-yyyy</Text>
                                                    <Calendar size={16} color="#6B7280" />
                                                </View>
                                            </View>

                                            <View>
                                                <Text className="text-xs font-bold text-gray-500 mb-1">REMARKS</Text>
                                                <TextInput 
                                                    placeholder="e.g. Engine overhaul" 
                                                    placeholderTextColor="#9CA3AF"
                                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none" 
                                                />
                                            </View>
                                        </View>

                                        <TouchableOpacity className="bg-[#2563EB] rounded-lg p-3 mt-6 items-center">
                                            <Text className="text-white font-bold text-sm">Log Service</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Right Column: Table */}
                                    <View className="lg:w-2/3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
                                        <View className="p-4 border-b border-gray-100">
                                            <Text className="font-bold text-gray-800 text-base">Upcoming Maintenance</Text>
                                        </View>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={{ minWidth: 600 }} className="flex-1">
                                                {/* Header */}
                                                <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-100">
                                                    <Text className="flex-2 text-xs font-bold text-gray-500 uppercase tracking-wider">ASSET</Text>
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">DUE DATE</Text>
                                                    <Text className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">SERVICE TYPE</Text>
                                                    <Text className="w-24 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">STATUS</Text>
                                                </View>
                                                {/* Body */}
                                                {upcomingMaintData.map((row, idx) => (
                                                    <View key={idx} className="flex-row items-center p-4 border-b border-gray-50 hover:bg-gray-50">
                                                        <Text className="flex-2 text-sm text-gray-600">{row.asset}</Text>
                                                        <Text className="flex-1 text-sm text-gray-600">{row.dueDate}</Text>
                                                        <Text className="flex-1 text-sm text-gray-600">{row.serviceType}</Text>
                                                        <View className="w-24 items-end">
                                                            <Text className="text-sm font-medium text-gray-400">{row.status}</Text>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        </ScrollView>
                                        {/* Pagination Footer */}
                                        <View className="p-4 border-t border-gray-100 flex-row items-center justify-between bg-gray-50 mt-auto">
                                            <View className="flex-row items-center">
                                                <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                                                <View className="bg-white border border-gray-200 rounded px-2 py-1 flex-row items-center">
                                                    <Text className="text-xs text-gray-700 mr-1">10</Text>
                                                    <ChevronDown size={12} color="#6B7280" />
                                                </View>
                                            </View>
                                            <Text className="text-xs text-gray-500">Showing 1 - 1 of 1 records</Text>
                                            <View className="flex-row items-center space-x-1">
                                                <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                                    <Text className="text-gray-400">{'<'}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity className="w-6 h-6 items-center justify-center rounded bg-blue-600">
                                                    <Text className="text-white text-xs font-bold">1</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                                                    <Text className="text-gray-400">{'>'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                </View>
            </ScrollView>
        </View>
    );
}
