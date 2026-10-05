import { useNavigation } from 'expo-router';
import { AlertTriangle, BellRing, Calendar, Check, Settings2, ShieldAlert, UploadCloud, User } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert, Image, Modal } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { settingsService, AppSettings, UserProfile, DEFAULT_SETTINGS, DEFAULT_PROFILE } from '../../services/settingsService';
import * as ImagePicker from 'expo-image-picker';
import { useProjectContext } from '../../contexts/ProjectContext';
import { ChevronDown } from 'lucide-react-native';

// ─── Modal Dropdown ───────────────────────────────────────────────────────────
function ModalDropdown({
    options, value, onSelect, label, placeholder
}: { options: {id: string | null, name: string}[]; value: string | null; onSelect: (v: string | null) => void; label: string, placeholder?: string }) {
    const [open, setOpen] = useState(false);
    const selectedObj = options.find(o => String(o.id) === String(value)) || options[0];
    
    return (
        <>
            <TouchableOpacity
                onPress={() => setOpen(true)}
                style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB',
                    borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12,
                    minWidth: 150, width: '100%', justifyContent: 'space-between'
                }}
            >
                <Text style={{ flex: 1, fontSize: 14, color: '#374151', fontWeight: '500' }} numberOfLines={1}>
                    {selectedObj?.name || placeholder || 'Select...'}
                </Text>
                <ChevronDown size={16} color="#6B7280" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
            <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.38)', justifyContent: 'center' }}
                    activeOpacity={1}
                    onPress={() => setOpen(false)}
                >
                    <View style={{ marginHorizontal: 28, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', elevation: 20 }}>
                        <View style={{ paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937' }}>{label}</Text>
                        </View>
                        <ScrollView style={{ maxHeight: 300 }}>
                            {options.map(opt => {
                                const isSelected = String(value) === String(opt.id);
                                return (
                                    <TouchableOpacity
                                        key={String(opt.id)}
                                        onPress={() => { onSelect(opt.id); setOpen(false); }}
                                        style={{
                                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                            paddingHorizontal: 16, paddingVertical: 13,
                                            backgroundColor: isSelected ? '#EFF6FF' : '#fff',
                                            borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
                                        }}
                                    >
                                        <Text style={{ fontSize: 14, color: isSelected ? '#2563EB' : '#374151', fontWeight: isSelected ? '700' : '400' }}>
                                            {opt.name}
                                        </Text>
                                        {isSelected && (
                                            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '900' }}>✓</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}
export default function SettingsScreen() {
    const navigation = useNavigation();
    const { projects, activeProjectId, setActiveProject, loading: contextLoading } = useProjectContext();

    // Profile State
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
    const [profileLoading, setProfileLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);

    // Settings State
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [savingSettings, setSavingSettings] = useState(false);

    useEffect(() => {
        const fetchSettingsAndProfile = async () => {
            try {
                const [settingsData, profileData] = await Promise.all([
                    settingsService.getSettings(),
                    settingsService.getProfile()
                ]);
                
                // Merge preferences if not fully present
                const mergedPreferences = { ...DEFAULT_SETTINGS.preferences, ...(settingsData.preferences || {}) };
                setSettings({ ...DEFAULT_SETTINGS, ...settingsData, preferences: mergedPreferences });
                setProfile({ ...DEFAULT_PROFILE, ...profileData });
            } catch (error) {
                console.error('Failed to fetch settings/profile:', error);
                // Non-blocking error
            } finally {
                setSettingsLoading(false);
                setProfileLoading(false);
            }
        };

        fetchSettingsAndProfile();
    }, []);

    const updateProfileField = (key: keyof UserProfile, value: any) => {
        setProfile(prev => ({ ...prev, [key]: value }));
    };

    const updateSettingsField = (key: keyof AppSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const updatePreference = (key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            preferences: {
                ...(prev.preferences || {}),
                [key]: value
            }
        }));
    };

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        try {
            await settingsService.updateProfile(profile);
            Alert.alert('Success', 'Profile updated successfully.');
        } catch (error) {
            console.error('Failed to update profile:', error);
            Alert.alert('Error', 'Failed to update profile.');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleSaveSettings = async () => {
        setSavingSettings(true);
        try {
            const updatedSettings = { ...settings };
            if (activeProjectId) {
                updatedSettings.default_project_id = activeProjectId;
            }
            await settingsService.updateSettings(updatedSettings);
            Alert.alert('Success', 'Settings updated successfully.');
        } catch (error) {
            console.error('Failed to update settings:', error);
            Alert.alert('Error', 'Failed to update settings.');
        } finally {
            setSavingSettings(false);
        }
    };

    const handleUploadLogo = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
                Alert.alert('Permission Denied', 'You need to allow access to your photos.');
                return;
            }
            
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                const uriParts = asset.uri.split('.');
                const fileType = uriParts[uriParts.length - 1];
                
                const fileData = {
                    uri: asset.uri,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`,
                };
                
                setProfileLoading(true);
                await settingsService.uploadLogo(fileData);
                // Refetch profile to get the new avatar
                try {
                    const updatedProfile = await settingsService.getProfile();
                    setProfile({ ...profile, avatar_url: updatedProfile.avatar_url });
                } catch(e) {}
                Alert.alert('Success', 'Profile image uploaded successfully.');
            }
        } catch (error) {
            console.error('Upload logo error:', error);
            Alert.alert('Error', 'Failed to upload profile image.');
        } finally {
            setProfileLoading(false);
        }
    };

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

    const activeProjectName = projects.find(p => p.id === activeProjectId || (p as any).project_id === activeProjectId)?.name || (projects.find(p => p.id === activeProjectId || (p as any).project_id === activeProjectId) as any)?.project_name || 'Sara City';

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
                    <TouchableOpacity onPress={handleSaveSettings} disabled={savingSettings} className="bg-blue-600 flex-row items-center px-4 py-2.5 rounded-md self-start">
                        {savingSettings ? <ActivityIndicator size="small" color="#FFF" /> : <Check size={16} color="#FFF" className="mr-2" />}
                        <Text className="text-white font-medium text-sm ml-1">Save Settings</Text>
                    </TouchableOpacity>
                </View>

                {/* Top Stats Cards */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <View className="w-full md:w-1/2 lg:w-1/4 p-2">
                        <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-xs text-gray-400 font-bold uppercase mb-1">ACTIVE PROJECT</Text>
                            <Text className="text-blue-600 font-bold text-lg">{activeProjectName}</Text>
                            <Text className="text-xs text-gray-400 mt-2">Primary project workspace</Text>
                        </View>
                    </View>
                    <View className="w-full md:w-1/2 lg:w-1/4 p-2">
                        <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-xs text-gray-400 font-bold uppercase mb-1">UNIT SYSTEM</Text>
                            <Text className="text-green-500 font-bold text-lg">{settings.preferences?.unit_system || 'Metric'}</Text>
                            <Text className="text-xs text-gray-400 mt-2">{settings.unit || 'Kg'} - {settings.preferences?.length_unit || 'Meter'}</Text>
                        </View>
                    </View>
                    <View className="w-full md:w-1/2 lg:w-1/4 p-2">
                        <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-xs text-gray-400 font-bold uppercase mb-1">NOTIFICATIONS</Text>
                            <Text className="text-orange-500 font-bold text-lg">{settings.notifications_enabled ? 'Enabled' : 'Disabled'}</Text>
                            <Text className="text-xs text-gray-400 mt-2">Global status</Text>
                        </View>
                    </View>
                    <View className="w-full md:w-1/2 lg:w-1/4 p-2">
                        <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <Text className="text-xs text-gray-400 font-bold uppercase mb-1">LANGUAGE</Text>
                            <Text className="text-gray-800 font-bold text-lg">{settings.preferences?.language || 'English'}</Text>
                            <Text className="text-xs text-gray-400 mt-2">{settings.preferences?.timezone || 'IST (UTC+5:30)'}</Text>
                        </View>
                    </View>
                </View>

                {/* Profile & Account Section */}
                <View className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                    <SectionHeader title="PROFILE & ACCOUNT" icon={User} />
                    {profileLoading ? (
                        <ActivityIndicator size="large" color="#2563EB" className="py-8" />
                    ) : (
                        <View className="flex-row flex-wrap lg:flex-nowrap">
                            <View className="items-center mr-8 mb-6 lg:mb-0 w-full lg:w-auto">
                                <View className="w-24 h-24 bg-blue-50 rounded-full items-center justify-center relative border border-blue-100 overflow-hidden">
                                    {profile.avatar_url ? (
                                        <Image source={{ uri: profile.avatar_url }} className="w-full h-full rounded-full" />
                                    ) : (
                                        <Text className="text-blue-800 text-3xl font-bold">{(profile.full_name || 'A')[0].toUpperCase()}</Text>
                                    )}
                                </View>
                                <TouchableOpacity onPress={handleUploadLogo} className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-2 border-white">
                                    <UploadCloud size={14} color="#FFF" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-1">
                                <View className="flex-row flex-wrap -mx-2">
                                    <View className="w-full md:w-1/2 p-2">
                                        <Text className="text-xs font-bold text-gray-500 mb-1">FULL NAME</Text>
                                        <TextInput 
                                            className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 font-medium" 
                                            value={profile.full_name || ''} 
                                            onChangeText={(text) => updateProfileField('full_name', text)}
                                        />
                                    </View>
                                    <View className="w-full md:w-1/2 p-2">
                                        <Text className="text-xs font-bold text-gray-500 mb-1">DESIGNATION</Text>
                                        <TextInput 
                                            className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 font-medium" 
                                            value={profile.designation || ''} 
                                            onChangeText={(text) => updateProfileField('designation', text)}
                                        />
                                    </View>
                                    <View className="w-full md:w-1/2 p-2">
                                        <Text className="text-xs font-bold text-gray-500 mb-1">EMAIL ADDRESS</Text>
                                        <TextInput 
                                            className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 font-medium" 
                                            value={profile.email || ''} 
                                            onChangeText={(text) => updateProfileField('email', text)}
                                        />
                                    </View>
                                    <View className="w-full md:w-1/2 p-2">
                                        <Text className="text-xs font-bold text-gray-500 mb-1">MOBILE NUMBER</Text>
                                        <TextInput 
                                            className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 font-medium" 
                                            value={profile.mobile || ''} 
                                            onChangeText={(text) => updateProfileField('mobile', text)}
                                        />
                                    </View>
                                    <View className="w-full md:w-1/2 p-2">
                                        <Text className="text-xs font-bold text-gray-500 mb-1">PAN NUMBER</Text>
                                        <TextInput 
                                            className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800" 
                                            placeholder="Enter PAN" 
                                            value={profile.pan_number || ''} 
                                            onChangeText={(text) => updateProfileField('pan_number', text)}
                                        />
                                    </View>
                                    <View className="w-full md:w-1/2 p-2">
                                        <Text className="text-xs font-bold text-gray-500 mb-1">AADHAAR NUMBER</Text>
                                        <TextInput 
                                            className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800" 
                                            placeholder="Enter Aadhaar" 
                                            value={profile.aadhaar_number || ''} 
                                            onChangeText={(text) => updateProfileField('aadhaar_number', text)}
                                        />
                                    </View>
                                    <View className="w-full md:w-1/2 p-2">
                                        <Text className="text-xs font-bold text-gray-500 mb-1">ROLE</Text>
                                        <TextInput 
                                            className="bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-gray-500" 
                                            value={profile.role || ''} 
                                            editable={false} 
                                        />
                                    </View>
                                    <View className="w-full md:w-1/2 p-2 relative">
                                        <Text className="text-xs font-bold text-gray-500 mb-1">JOINING DATE</Text>
                                        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-md px-4">
                                            <TextInput 
                                                className="flex-1 py-3 text-gray-800" 
                                                value={profile.joining_date || ''} 
                                                onChangeText={(text) => updateProfileField('joining_date', text)}
                                            />
                                            <Calendar size={18} color="#9CA3AF" />
                                        </View>
                                    </View>
                                    <View className="w-full p-2">
                                        <Text className="text-xs font-bold text-gray-500 mb-1">ADDRESS</Text>
                                        <TextInput 
                                            className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800" 
                                            value={profile.address || ''} 
                                            onChangeText={(text) => updateProfileField('address', text)}
                                        />
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
                                            value={profile.account_active || false}
                                            onValueChange={(val) => updateProfileField('account_active', val)}
                                            trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
                                            thumbColor="#FFFFFF"
                                        />
                                    </View>
                                </View>

                                <View className="mt-6 items-end">
                                    <TouchableOpacity onPress={handleSaveProfile} disabled={savingProfile} className="bg-gray-900 flex-row items-center px-6 py-3.5 rounded-md">
                                        {savingProfile ? <ActivityIndicator size="small" color="#FFF" /> : <Check size={16} color="#FFF" className="mr-2" />}
                                        <Text className="text-white font-bold text-xs tracking-wider ml-1">SAVE PROFILE SETTINGS</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* Split Row for Config */}
                {settingsLoading || contextLoading ? (
                    <ActivityIndicator size="large" color="#2563EB" className="py-8" />
                ) : (
                <View className="flex-row flex-wrap -mx-3">
                    <View className="w-full lg:w-1/2 px-3 mb-6">
                        {/* Project Selection */}
                        <View className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                            <SectionHeader title="PROJECT SELECTION" icon={AlertTriangle} />
                            <Text className="text-xs font-bold text-gray-500 mb-2 mt-2">ASSIGNED PROJECTS</Text>
                            
                            <View className="mt-2">
                                <ModalDropdown 
                                    label="Select Project"
                                    placeholder="Choose a project..."
                                    value={activeProjectId ? String(activeProjectId) : null}
                                    onSelect={(v) => { if (v) setActiveProject(Number(v)); }}
                                    options={(projects || []).map((project: any, idx: number) => ({
                                        id: project?.id ?? project?.project_id ?? String(idx),
                                        name: project?.name || project?.project_name || 'Unnamed Project'
                                    }))}
                                />
                                {(projects || []).length === 0 && (
                                    <Text className="text-sm text-gray-500 mt-4 italic">No projects assigned.</Text>
                                )}
                            </View>
                        </View>

                        {/* Notification Settings */}
                        <View className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <SectionHeader title="NOTIFICATION SETTINGS" icon={BellRing} />
                            <View className="mt-2">
                                {renderToggle("Global Push Notifications", "Real-time app notifications", settings.notifications_enabled || false, (val) => updateSettingsField('notifications_enabled', val))}
                                {renderToggle("Email Alerts", "Receive daily summary via email", settings.preferences?.email_alerts || false, (val) => updatePreference('email_alerts', val))}
                                {renderToggle("SMS Alerts", "Critical site alerts via SMS", settings.preferences?.sms_alerts || false, (val) => updatePreference('sms_alerts', val))}
                                {renderToggle("DSR Reminders", "Daily reminder to submit DSR", settings.preferences?.dsr_reminders || false, (val) => updatePreference('dsr_reminders', val))}
                                {renderToggle("Issue Alerts", "Notify on new high-priority issues", settings.preferences?.issue_alerts || false, (val) => updatePreference('issue_alerts', val))}
                                {renderToggle("Material Alerts", "Low stock threshold notifications", settings.preferences?.material_alerts || false, (val) => updatePreference('material_alerts', val))}
                            </View>
                        </View>
                    </View>

                    <View className="w-full lg:w-1/2 px-3 mb-6">
                        {/* Units Settings */}
                        <View className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                            <SectionHeader title="UNITS" icon={Settings2} />

                            <Text className="text-xs font-bold text-gray-500 mb-2 mt-2">UNIT SYSTEM</Text>
                            <View className="flex-row mb-5 -mx-1">
                                <SelectButton active={settings.preferences?.unit_system === 'Metric'} label="Metric" onPress={() => updatePreference('unit_system', 'Metric')} />
                                <SelectButton active={settings.preferences?.unit_system === 'Imperial'} label="Imperial" onPress={() => updatePreference('unit_system', 'Imperial')} />
                            </View>

                            <Text className="text-xs font-bold text-gray-500 mb-2">MASS / WEIGHT</Text>
                            <View className="flex-row mb-5 -mx-1">
                                <SelectButton active={settings.unit === 'Kg'} label="Kg" onPress={() => updateSettingsField('unit', 'Kg')} />
                                <SelectButton active={settings.unit === 'Pound'} label="Pound" onPress={() => updateSettingsField('unit', 'Pound')} />
                                <SelectButton active={settings.unit === 'Tonne'} label="Tonne" onPress={() => updateSettingsField('unit', 'Tonne')} />
                            </View>

                            <Text className="text-xs font-bold text-gray-500 mb-2">LENGTH / DISTANCE</Text>
                            <View className="flex-row mb-6 -mx-1">
                                <SelectButton active={settings.preferences?.length_unit === 'Meter'} label="Meter" onPress={() => updatePreference('length_unit', 'Meter')} />
                                <SelectButton active={settings.preferences?.length_unit === 'Feet'} label="Feet" onPress={() => updatePreference('length_unit', 'Feet')} />
                                <SelectButton active={settings.preferences?.length_unit === 'Inch'} label="Inch" onPress={() => updatePreference('length_unit', 'Inch')} />
                                <SelectButton active={settings.preferences?.length_unit === 'Cm'} label="Cm" onPress={() => updatePreference('length_unit', 'Cm')} />
                            </View>

                            <View className="bg-gray-50 p-5 rounded-lg border border-gray-100 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-xs text-gray-500 font-bold mb-1">CURRENT UNITS</Text>
                                    <Text className="font-bold text-gray-800 text-sm">{settings.preferences?.unit_system || 'Metric'} • {settings.unit || 'Kg'} • {settings.preferences?.length_unit || 'Meter'}</Text>
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
                            <TextInput 
                                className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 mb-5 font-medium" 
                                value={settings.preferences?.language || ''} 
                                onChangeText={(text) => updatePreference('language', text)}
                            />

                            <View className="flex-row flex-wrap -mx-2 mb-6">
                                <View className="w-full md:w-1/2 p-2">
                                    <Text className="text-xs font-bold text-gray-500 mb-1">TIMEZONE</Text>
                                    <TextInput 
                                        className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 font-medium" 
                                        value={settings.preferences?.timezone || ''} 
                                        onChangeText={(text) => updatePreference('timezone', text)}
                                    />
                                </View>
                                <View className="w-full md:w-1/2 p-2">
                                    <Text className="text-xs font-bold text-gray-500 mb-1">DATE FORMAT</Text>
                                    <TextInput 
                                        className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 font-medium" 
                                        value={settings.preferences?.date_format || ''} 
                                        onChangeText={(text) => updatePreference('date_format', text)}
                                    />
                                </View>
                            </View>

                            <View className="border-t border-gray-100 pt-2">
                                {renderToggle("Auto Save", "Auto-save form drafts every 60s", settings.preferences?.auto_save || false, (val) => updatePreference('auto_save', val))}
                                {renderToggle("Compact View", "Reduce padding for denser layout", settings.preferences?.compact_view || false, (val) => updatePreference('compact_view', val))}
                                {renderToggle("Show Weather Widget", "Display weather on dashboard", settings.preferences?.weather_widget || false, (val) => updatePreference('weather_widget', val))}
                                {renderToggle("Auto GPS Capture", "Capture GPS on DSR form open", settings.preferences?.auto_gps || false, (val) => updatePreference('auto_gps', val))}
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
                )}
            </ScrollView>

            {/* Bottom Sticky Action Bar */}
            <View className="absolute bottom-6 right-6 z-20 shadow-xl">
                <TouchableOpacity onPress={handleSaveSettings} disabled={savingSettings} className="bg-gray-900 flex-row items-center px-6 py-4 rounded-full shadow-2xl elevation-xl border border-gray-700">
                    {savingSettings ? <ActivityIndicator size="small" color="#FFF" /> : <Check size={18} color="#FFF" className="mr-2" />}
                    <Text className="text-white font-bold tracking-wider text-xs ml-1">SAVE ALL SETTINGS</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
