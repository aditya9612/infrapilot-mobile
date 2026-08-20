import { useNavigation, useRouter } from 'expo-router';
import { Menu } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Dashboard() {
    const router = useRouter();
    const navigation = useNavigation();

    return (
        <View className="flex-1 bg-gray-50 flex-col">
            {/* Fixed Custom Navbar */}
            <View className="px-4 pt-14 pb-4 bg-white shadow-sm border-b border-gray-200">
                <View className="flex-row items-center mb-0.5">
                    <TouchableOpacity onPress={() => (navigation as any).openDrawer()} className="p-2 -ml-2 mr-3 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
                        <Menu size={20} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-extrabold text-gray-800 tracking-tight flex-1">Labour Dashboard</Text>
                </View>
                <Text className="text-xs text-gray-500 font-medium mt-0.5 mb-2">Real-time mock interface module.</Text>
            </View>

            {/* Dashboard Content */}
            <View className="flex-1 items-center justify-center p-8">
                <Text className="text-3xl font-extrabold text-gray-800 mb-4 text-center">
                    Labour Dashboard
                </Text>
                <Text className="text-gray-400 italic text-center">Mock Dashboard under construction...</Text>
            </View>
        </View>
    );
}
