import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRouter, usePathname } from 'expo-router';
import { Menu, Bell, User, Settings, LogOut } from 'lucide-react-native';

interface TopHeaderProps {
    title: string;
    subtitle: string;
}

export default function TopHeader({ title, subtitle }: TopHeaderProps) {
    const navigation = useNavigation();
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        setIsProfileOpen(false);
        router.replace('/');
    };

    const pathname = usePathname();
    const roleBase = pathname.split('/')[1] || 'engineer';


    return (
        <View className="px-4 pt-12 pb-4 bg-[#2563EB] flex-row items-center justify-between z-50">
            <View className="flex-row items-center">
                <TouchableOpacity onPress={() => (navigation as any).openDrawer()} className="p-2 -ml-2 mr-3 bg-white/20 rounded-full">
                    <Menu size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <View>
                    <Text className="text-xl font-bold text-white">{title}</Text>
                    <Text className="text-[10px] text-white/80">{subtitle}</Text>
                </View>
            </View>
            <View className="flex-row items-center">
                <TouchableOpacity className="relative mr-4">
                    <Bell size={20} color="#FFFFFF" />
                    <View className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full items-center justify-center">
                        <Text className="text-white font-bold" style={{ fontSize: 9 }}>9</Text>
                    </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    className="w-8 h-8 rounded-full border border-white items-center justify-center"
                    onPress={() => setIsProfileOpen(true)}
                >
                    <Text className="text-white font-bold text-sm">A</Text>
                </TouchableOpacity>
            </View>

            {/* Dropdown Modal */}
            <Modal
                visible={isProfileOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsProfileOpen(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsProfileOpen(false)}>
                    <View className="flex-1 bg-black/5" />
                </TouchableWithoutFeedback>
                
                <View 
                    className="absolute top-[80px] right-4 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[200px] overflow-hidden"
                    style={{ elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}
                >
                    {/* User Info */}
                    <View className="px-4 py-3 border-b border-gray-100">
                        <Text className="text-sm font-bold text-gray-800">Amit patil</Text>
                        <Text className="text-xs text-gray-500">SiteEngineer</Text>
                    </View>
                    
                    {/* Actions */}
                    <TouchableOpacity 
                        className="flex-row items-center px-4 py-3"
                        onPress={() => {
                            setIsProfileOpen(false);
                            router.push(`/${roleBase}/settings` as any);
                        }}
                    >
                        <User size={16} color="#6B7280" />
                        <Text className="ml-3 text-sm font-medium text-gray-700">My Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                        onPress={() => {
                            setIsProfileOpen(false);
                            router.push(`/${roleBase}/settings` as any);
                        }}
                    >
                        <Settings size={16} color="#6B7280" />
                        <Text className="ml-3 text-sm font-medium text-gray-700">Account Settings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-row items-center px-4 py-3"
                        onPress={handleLogout}
                    >
                        <LogOut size={16} color="#EF4444" />
                        <Text className="ml-3 text-sm font-bold text-red-500">Log Out</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}
