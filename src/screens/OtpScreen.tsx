import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export function OtpScreen() {
    const router = useRouter();
    const { mobileNumber } = useLocalSearchParams();

    return (
        <View className="flex-1 bg-white items-center justify-center p-8">
            <TouchableOpacity
                onPress={() => router.back()}
                className="absolute top-16 left-6 p-2 rounded-full bg-slate-100"
            >
                <ArrowLeft size={24} color="#0f172a" />
            </TouchableOpacity>

            <Text className="text-3xl font-extrabold text-slate-800 mb-4 text-center">
                Enter OTP
            </Text>
            <Text className="text-slate-500 text-center mb-10 leading-6 px-4">
                A verification code has been sent to{'\n'}
                <Text className="font-bold text-slate-800">+91 {mobileNumber}</Text>
            </Text>

            <Text className="text-slate-400 italic">OTP Inputs & Verification Form Coming Soon...</Text>
        </View>
    );
}
