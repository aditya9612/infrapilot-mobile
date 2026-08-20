import { useRouter } from 'expo-router';
import { ArrowRight, BarChart2, Box, ChevronDown, Lock, Shield, Target } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { authService } from '../services/authService';

const { height } = Dimensions.get('window');

export function LoginScreen() {
    const [mobileNumber, setMobileNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleGetOTP = async () => {
        if (!mobileNumber || mobileNumber.length < 10) return;
        setIsLoading(true);

        try {
            // Hit the actual testing API endpoint via our unified service
            await authService.requestOtp(mobileNumber);

            // If successful, navigate to the OTP verification screen via Expo Router
            console.log('OTP requested, navigating to OTP screen');
            router.push({ pathname: '/otp', params: { mobileNumber } });
        } catch (error) {
            Alert.alert('Connection Error', 'Failed to request OTP. Please verify your connection to the test server and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            {/* Top Background Section (Dark Blue area) */}
            <View style={{ height: height * 0.55 }} className="w-full bg-[#0a1e3f]">

                <View className="flex-1 items-center justify-between pt-12 pb-20 w-full">

                    <View className="flex-1 w-full items-center justify-center px-4">
                        <Image
                            source={require('../../assets/images/logo-full.png')}
                            className="w-full h-full max-h-[85%] ml-[52px]"
                            resizeMode="contain"
                        />
                    </View>

                    {/* Three Feature Tags */}
                    <View className="flex-row items-center justify-center gap-2 w-full px-5 mt-2">
                        <View className="flex-row items-center bg-[#0d2a58] border border-blue-400/20 rounded-xl px-2 py-2 flex-1 justify-center">
                            <Target size={12} color="#2563EB" />
                            <Text className="text-[8px] font-bold text-blue-100 ml-1.5 leading-tight text-center">REAL-TIME{'\n'}TRACKING</Text>
                        </View>
                        <View className="flex-row items-center bg-[#0d2a58] border border-blue-400/20 rounded-xl px-2 py-2 flex-1 justify-center">
                            <Box size={12} color="#2563EB" />
                            <Text className="text-[8px] font-bold text-blue-100 ml-1.5 leading-tight text-center">SMART{'\n'}ALLOCATION</Text>
                        </View>
                        <View className="flex-row items-center bg-[#0d2a58] border border-blue-400/20 rounded-xl px-2 py-2 flex-1 justify-center">
                            <BarChart2 size={12} color="#2563EB" />
                            <Text className="text-[8px] font-bold text-blue-100 ml-1.5 leading-tight text-center">PROJECT{'\n'}INSIGHTS</Text>
                        </View>
                    </View>
                </View>

            </View>

            {/* Bottom Sheet Section (White Card) */}
            <View
                className="flex-1 bg-white px-6 pt-6 pb-8"
                style={styles.bottomSheet}
            >
                {/* Drag Handle Indicator */}
                <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-5" />

                {/* Step Indicator */}
                <View className="flex-row items-center mb-6">
                    <View className="flex-row gap-1 mr-3">
                        <View className="h-1.5 w-6 bg-blue-600 rounded-full" />
                        <View className="h-1.5 w-6 bg-gray-200 rounded-full" />
                    </View>
                    <Text className="text-gray-400 text-xs font-semibold">Step 1 of 2</Text>
                </View>

                {/* Header content */}
                <View className="flex-row items-start mb-6">
                    <View className="bg-blue-50 p-3 rounded-2xl mr-4">
                        <Shield size={24} color="#2563eb" fill="#2563eb" className="opacity-90" />
                    </View>
                    <View className="flex-1 gap-1 pt-1">
                        <Text className="text-2xl font-extrabold text-gray-800">Secure Login</Text>
                        <Text className="text-sm font-medium text-gray-500 leading-snug pr-4">
                            Enter your mobile number to receive a secure OTP
                        </Text>
                    </View>
                </View>

                {/* Mobile Number Input */}
                <View className="mb-8">
                    <Text className="text-sm font-bold text-gray-800 mb-3 ml-1">Mobile Number</Text>

                    <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl overflow-hidden focus:border-blue-600 focus:bg-blue-50/20 transition-all">

                        {/* Country Code Picker (Fake dropdown) */}
                        <TouchableOpacity className="flex-row items-center pl-3 pr-2 py-4 border-r border-gray-200 bg-gray-50/50">
                            <Text className="text-[15px] mr-1">🇮🇳</Text>
                            <Text className="text-gray-700 text-[15px] font-bold mr-1">+91</Text>
                            <ChevronDown size={14} color="#94a3b8" />
                        </TouchableOpacity>

                        {/* Input Field */}
                        <TextInput
                            className="flex-1 px-3 py-4 text-gray-900 text-base font-semibold"
                            placeholder="Enter your registered mobile number"
                            placeholderTextColor="#cbd5e1"
                            keyboardType="phone-pad"
                            maxLength={10}
                            value={mobileNumber}
                            onChangeText={setMobileNumber}
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleGetOTP}
                    disabled={isLoading || mobileNumber.length < 10}
                    style={styles.shadowButton}
                    className={`flex-row items-center justify-between rounded-xl px-5 py-4 ${mobileNumber.length >= 10 ? 'bg-[#0a276e]' : 'bg-[#0a276e]/50'
                        }`}
                >
                    <View className="flex-row items-center">
                        <Lock size={18} color="white" className="mr-3 opacity-90" />
                        <Text className="text-white text-[13px] font-extrabold tracking-widest">
                            GET ONE-TIME OTP
                        </Text>
                    </View>
                    <ArrowRight size={20} color="white" />
                </TouchableOpacity>

                {/* Developer Mock Logins - Temporary */}
                <View className="mt-8 pt-4 border-t border-gray-200">
                    <Text className="text-xs font-bold text-gray-400 text-center mb-3">DEV ONLY: MOCK LOGINS</Text>
                    <View className="flex-row flex-wrap justify-center gap-2">
                        {[
                            { name: 'Admin', path: '/(admin)/dashboard' },
                            { name: 'Site Engineer', path: '/engineer/dashboard' },
                            { name: 'Project Manager', path: '/manager/dashboard' },
                            { name: 'Client', path: '/client/dashboard' },
                            { name: 'Accountant', path: '/accountant/dashboard' },
                            { name: 'Labour', path: '/labour/dashboard' }
                        ].map((role) => (
                            <TouchableOpacity
                                key={role.name}
                                onPress={() => router.push(role.path as any)}
                                className="bg-gray-100 rounded-lg px-3 py-2 border border-gray-200"
                            >
                                <Text className="text-xs font-semibold text-gray-600">{role.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

            </View>
        </KeyboardAvoidingView>
    );
}

// React Native often needs custom StyleSheet for certain visual overlaps that Tailwind struggles with
const styles = StyleSheet.create({
    bottomSheet: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -40, // overlap the background
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    shadowButton: {
        shadowColor: '#1d4ed8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    }
});
