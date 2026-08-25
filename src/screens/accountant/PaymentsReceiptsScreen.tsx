import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Menu } from 'lucide-react-native';

export function PaymentsReceiptsScreen() {
    const navigation = useNavigation();
    return (
        <View className="flex-1 bg-gray-50">
            <View className="px-4 pt-14 pb-4 bg-blue-600">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => (navigation as any).openDrawer()} className="p-2 -ml-2 mr-3 bg-white/10 rounded-full">
                        <Menu size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">Payments & Receipts</Text>
                </View>
                <Text className="text-[10px] text-blue-100 mt-1">InfraPilot &gt; Accountant &gt; Payments & Receipts</Text>
            </View>
            <View className="flex-1 items-center justify-center">
                <Text className="text-xl font-bold text-gray-700">Payments & Receipts</Text>
                <Text className="text-sm text-gray-400 mt-2">Coming soon...</Text>
            </View>
        </View>
    );
}
