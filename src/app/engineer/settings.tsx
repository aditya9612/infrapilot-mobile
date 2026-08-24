import TopHeader from '../../components/TopHeader';
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Menu, Bell, Check, UploadCloud, Calendar, AlertTriangle, ShieldAlert, User, BellRing, Settings2 } from 'lucide-react-native';

export default function SettingsScreen() {
    const navigation = useNavigation();
    
    // State variables
    const [accountActive, setAccountActive] = useState(true);
    const [unitSystem, setUnitSystem] = useState('Metric');
    const [massUnit, setMassUnit] = useState('Kg');
    const [lengthUnit, setLengthUnit] = useState('Meter');
    
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [dsrReminders, setDsrReminders] = useState(true);
    const [issueAlerts, setIssueAlerts] = useState(true);
    const [materialAlerts, setMaterialAlerts] = useState(true);

    const [autoSave, setAutoSave] = useState(true);
    const [compactView, setCompactView] = useState(false);
    const [weatherWidget, setWeatherWidget] = useState(true);
    const [autoGps, setAutoGps] = useState(true);

    const renderToggle = (label: string, desc: string, value: boolean, onValueChange: (val: boolean) => void) => (
        <View className="flex-row items-center justify-between py-4 border-b border-gray-100 last:border-0">
            <View className="flex-1 pr-4">
                <Text className="text-gray-800 font-medium">{label}</Text>
                <Text className="text-gray-500 text-xs mt-1">{desc}</Text>
            </View>
            <View className="flex-row items-center">
                <Text className="text-xs font-bold mr-2 text-gray-400">{value ? 'ON' : 'OFF'}</Text>
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
                    thumbColor="#FFFFFF"
                />
            </View>
        </View>
    );

    const SectionHeader = ({ title, icon: Icon }: any) => (
        <View className="flex-row items-center mb-4">
            <Icon size={16} color="#6B7280" className="mr-2" />
            <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</Text>
        </View>
    );

    const SelectButton = ({ active, label, onPress }: any) => (
        <TouchableOpacity 
            onPress={onPress}
            className={`flex-1 py-3 px-2 rounded-md border items-center justify-center mx-1 ${active ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'} ${active && label === 'Kg' || active && label === 'Meter' || active && label === 'Metric' && label !== 'Imperial' ? 'bg-blue-600 border-blue-600' : ''}`}
        >
            <Text className={`font-medium text-sm ${active ? 'text-white' : 'text-gray-600'}`}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50 flex-col">
            
            <TopHeader title="Settings" subtitle="InfraPilot • Engineer • Settings" />


            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Secondary Header */}
                <View className="flex-row flex-wrap justify-between items-center mb-6">
                    <View className="mb-4 w-full md:w-auto">
                        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
                        <Text className="text-sm text-gray-500 mt-1">Configure your project, units, notifications, and personal preferences.</Text>
                    </View>
                    <TouchableOpacity className="bg-blue-600 flex-row items-center px-4 py-2.5 rounded-md self-start">
                        <Check size={16} color="#FFF" className="mr-2" />
                        <Text className="text-white font-medium text-sm">Save Settings</Text>
                    </TouchableOpacity>
                </View>

                {/* Top Stats Cards */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <View className="w-full md:w-1/2 lg:w-1/4 p-2">
                        <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-xs text-gray-400 font-bold uppercase mb-1">ACTIVE PROJECT</Text>
                            <Text className="text-blue-600 font-bold text-lg">Sara City</Text>
                            <Text className="text-xs text-gray-400 mt-2">Primary project workspace</Text>
                        </View>
                    </View>
                    <View className="w-full md:w-1/2 lg:w-1/4 p-2">
                        <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-xs text-gray-400 font-bold uppercase mb-1">UNIT SYSTEM</Text>
                            <Text className="text-green-500 font-bold text-lg">Metric</Text>
                            <Text className="text-xs text-gray-400 mt-2">Kg - Meter</Text>
                        </View>
                    </View>
                    <View className="w-full md:w-1/2 lg:w-1/4 p-2">
                        <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-xs text-gray-400 font-bold uppercase mb-1">NOTIFICATIONS</Text>
                            <Text className="text-orange-500 font-bold text-lg">5 / 6</Text>
                            <Text className="text-xs text-gray-400 mt-2">Channels enabled</Text>
                        </View>
                    </View>
                    <View className="w-full md:w-1/2 lg:w-1/4 p-2">
                        <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-xs text-gray-400 font-bold uppercase mb-1">LANGUAGE</Text>
                            <Text className="text-gray-800 font-bold text-lg">English</Text>
                            <Text className="text-xs text-gray-400 mt-2">IST (UTC+5:30)</Text>
                        </View>
                    </View>
                </View>

                {/* Profile & Account Section */}
                <View className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                    <SectionHeader title="PROFILE & ACCOUNT" icon={User} />
                    
                    <View className="flex-row flex-wrap lg:flex-nowrap">
                        <View className="items-center mr-8 mb-6 lg:mb-0 w-full lg:w-auto">
                            <View className="w-24 h-24 bg-blue-50 rounded-full items-center justify-center relative border border-blue-100">
                                <Text className="text-blue-800 text-3xl font-bold">A</Text>
                                <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-2 border-white">
                                    <UploadCloud size={14} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <View className="flex-1">
                            <View className="flex-row flex-wrap -mx-2">
                                <View className="w-full md:w-1/2 p-2">
                                    <Text className="text-xs font-bold text-gray-500 mb-1">FULL NAME</Text>
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 font-medium" value="Amit patil" />
                                </View>
                                <View className="w-full md:w-1/2 p-2">
                                    <Text className="text-xs font-bold text-gray-500 mb-1">DESIGNATION</Text>
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 font-medium" value="Site Engineer" />
                                </View>
                                <View className="w-full md:w-1/2 p-2">
                                    <Text className="text-xs font-bold text-gray-500 mb-1">EMAIL ADDRESS</Text>
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 font-medium" value="amitpatil123@gmail.com" />
                                </View>
                                <View className="w-full md:w-1/2 p-2">
                                    <Text className="text-xs font-bold text-gray-500 mb-1">MOBILE NUMBER</Text>
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 font-medium" value="7474747474" />
                                </View>
                                <View className="w-full md:w-1/2 p-2">
                                    <Text className="text-xs font-bold text-gray-500 mb-1">PAN NUMBER</Text>
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800" placeholder="Enter PAN" />
                                </View>
                                <View className="w-full md:w-1/2 p-2">
                                    <Text className="text-xs font-bold text-gray-500 mb-1">AADHAAR NUMBER</Text>
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800" placeholder="Enter Aadhaar" />
                                </View>
                                <View className="w-full md:w-1/2 p-2">
                                    <Text className="text-xs font-bold text-gray-500 mb-1">ROLE</Text>
                                    <TextInput className="bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-gray-500" value="SiteEngineer" editable={false} />
                                </View>
                                <View className="w-full md:w-1/2 p-2 relative">
                                    <Text className="text-xs font-bold text-gray-500 mb-1">JOINING DATE</Text>
                                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-md px-4">
                                        <TextInput className="flex-1 py-3 text-gray-800" value="dd-mm-yyyy" />
                                        <Calendar size={18} color="#9CA3AF" />
                                    </View>
                                </View>
                                <View className="w-full p-2">
                                    <Text className="text-xs font-bold text-gray-500 mb-1">ADDRESS</Text>
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800" value="pune" />
                                </View>
                            </View>
                            
                            <View className="mt-6 flex-row items-center justify-between bg-gray-50 p-5 rounded-lg border border-gray-100">
                                <View>
                                    <Text className="text-gray-900 font-bold text-base">Account Status</Text>
                                    <Text className="text-gray-500 text-xs mt-1">Toggle active status of this profile</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Text className="text-green-600 font-bold text-xs mr-3 tracking-widest">ACTIVE</Text>
                                    <Switch
                                        value={accountActive}
                                        onValueChange={setAccountActive}
                                        trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
                                        thumbColor="#FFFFFF"
                                    />
                                </View>
                            </View>

                            <View className="mt-6 items-end">
                                <TouchableOpacity className="bg-gray-900 flex-row items-center px-6 py-3.5 rounded-md">
                                    <Check size={16} color="#FFF" className="mr-2" />
                                    <Text className="text-white font-bold text-xs tracking-wider">SAVE PROFILE SETTINGS</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Split Row for Config */}
                <View className="flex-row flex-wrap -mx-3">
                    <View className="w-full lg:w-1/2 px-3 mb-6">
                        {/* Project Selection */}
                        <View className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                            <SectionHeader title="PROJECT SELECTION" icon={AlertTriangle} />
                            <Text className="text-xs font-bold text-gray-500 mb-2 mt-2">ACTIVE PROJECT</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 font-medium" value="Sara City" />
                        </View>
                        
                        {/* Notification Settings */}
                        <View className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <SectionHeader title="NOTIFICATION SETTINGS" icon={BellRing} />
                            <View className="mt-2">
                                {renderToggle("Email Alerts", "Receive daily summary via email", emailAlerts, setEmailAlerts)}
                                {renderToggle("SMS Alerts", "Critical site alerts via SMS", smsAlerts, setSmsAlerts)}
                                {renderToggle("Push Notifications", "Real-time app notifications", pushNotifications, setPushNotifications)}
                                {renderToggle("DSR Reminders", "Daily reminder to submit DSR", dsrReminders, setDsrReminders)}
                                {renderToggle("Issue Alerts", "Notify on new high-priority issues", issueAlerts, setIssueAlerts)}
                                {renderToggle("Material Alerts", "Low stock threshold notifications", materialAlerts, setMaterialAlerts)}
                            </View>
                        </View>
                    </View>

                    <View className="w-full lg:w-1/2 px-3 mb-6">
                        {/* Units Settings */}
                        <View className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                            <SectionHeader title="UNITS" icon={Settings2} />
                            
                            <Text className="text-xs font-bold text-gray-500 mb-2 mt-2">UNIT SYSTEM</Text>
                            <View className="flex-row mb-5 -mx-1">
                                <SelectButton active={unitSystem === 'Metric'} label="Metric" onPress={() => setUnitSystem('Metric')} />
                                <SelectButton active={unitSystem === 'Imperial'} label="Imperial" onPress={() => setUnitSystem('Imperial')} />
                            </View>
                            
                            <Text className="text-xs font-bold text-gray-500 mb-2">MASS / WEIGHT</Text>
                            <View className="flex-row mb-5 -mx-1">
                                <SelectButton active={massUnit === 'Kg'} label="Kg" onPress={() => setMassUnit('Kg')} />
                                <SelectButton active={massUnit === 'Pound'} label="Pound" onPress={() => setMassUnit('Pound')} />
                                <SelectButton active={massUnit === 'Meter'} label="Meter" onPress={() => setMassUnit('Meter')} />
                            </View>
                            
                            <Text className="text-xs font-bold text-gray-500 mb-2">LENGTH / DISTANCE</Text>
                            <View className="flex-row mb-6 -mx-1">
                                <SelectButton active={lengthUnit === 'Meter'} label="Meter" onPress={() => setLengthUnit('Meter')} />
                                <SelectButton active={lengthUnit === 'Feet'} label="Feet" onPress={() => setLengthUnit('Feet')} />
                                <SelectButton active={lengthUnit === 'Inch'} label="Inch" onPress={() => setLengthUnit('Inch')} />
                                <SelectButton active={lengthUnit === 'Cm'} label="Cm" onPress={() => setLengthUnit('Cm')} />
                            </View>

                            <View className="bg-gray-50 p-5 rounded-lg border border-gray-100 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-xs text-gray-500 font-bold mb-1">CURRENT UNITS</Text>
                                    <Text className="font-bold text-gray-800 text-sm">{unitSystem} • {massUnit} • {lengthUnit}</Text>
                                </View>
                                <View className="bg-orange-100 p-2.5 rounded-full">
                                    <AlertTriangle size={18} color="#F97316" />
                                </View>
                            </View>
                        </View>

                        {/* User Preferences */}
                        <View className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <SectionHeader title="USER PREFERENCES" icon={User} />
                            
                            <Text className="text-xs font-bold text-gray-500 mb-1 mt-2">LANGUAGE</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 mb-5 font-medium" value="English" />
                            
                            <View className="flex-row flex-wrap -mx-2 mb-6">
                                <View className="w-full md:w-1/2 p-2">
                                    <Text className="text-xs font-bold text-gray-500 mb-1">TIMEZONE</Text>
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 font-medium" value="IST (UTC+5:30)" />
                                </View>
                                <View className="w-full md:w-1/2 p-2">
                                    <Text className="text-xs font-bold text-gray-500 mb-1">DATE FORMAT</Text>
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 font-medium" value="DD/MM/YYYY" />
                                </View>
                            </View>

                            <View className="border-t border-gray-100 pt-2">
                                {renderToggle("Auto Save", "Auto-save form drafts every 60s", autoSave, setAutoSave)}
                                {renderToggle("Compact View", "Reduce padding for denser layout", compactView, setCompactView)}
                                {renderToggle("Show Weather Widget", "Display weather on dashboard", weatherWidget, setWeatherWidget)}
                                {renderToggle("Auto GPS Capture", "Capture GPS on DSR form open", autoGps, setAutoGps)}
                            </View>
                            
                            <View className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-6 flex-row">
                                <ShieldAlert size={20} color="#D97706" className="mr-3 mt-0.5" />
                                <View className="flex-1">
                                    <Text className="text-amber-800 font-bold text-sm">Admin-Restricted Settings</Text>
                                    <Text className="text-amber-700 text-xs mt-1 leading-relaxed">Global project configuration and security settings are restricted to Admin/Project Director roles. Contact your administrator for changes.</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Sticky Action Bar */}
            <View className="absolute bottom-6 right-6 z-20 shadow-xl">
                <TouchableOpacity className="bg-gray-900 flex-row items-center px-6 py-4 rounded-full shadow-2xl elevation-xl border border-gray-700">
                    <Check size={18} color="#FFF" className="mr-2" />
                    <Text className="text-white font-bold tracking-wider text-xs">SAVE ALL SETTINGS</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
