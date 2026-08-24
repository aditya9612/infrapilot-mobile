import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, BarChart2, Box, ShieldCheck, Target, Lock } from 'lucide-react-native';
import React, { useState, useRef } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Keyboard
} from 'react-native';
import { authService } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';

const { height } = Dimensions.get('window');

interface JwtPayload {
    role?: string;
    sub?: string;
    [key: string]: any;
}

export function OtpScreen() {
    const router = useRouter();
    const { mobileNumber } = useLocalSearchParams();
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const handleVerifyOTP = async () => {
        if (!otp || otp.length < 6) return;
        setIsLoading(true);

        try {
            // Note: If you're testing and getting an error, ensure you enter a valid OTP.
            // A 401 error just means the OTP is invalid or expired.
            const response = await authService.verifyOtp(mobileNumber as string, otp);
            console.log('OTP verified successfully', response);
            
            let role = 'engineer';
            
            // Extract role from JWT token
            if (response && response.token && response.token.access_token) {
                try {
                    const decoded = jwtDecode<JwtPayload>(response.token.access_token);
                    if (decoded.role) {
                        role = decoded.role.toLowerCase();
                    }
                } catch (e) {
                    console.error("Failed to decode token", e);
                }
            }

            let dashboardRoute = '/engineer/dashboard';

            switch (role) {
                case 'admin':
                    dashboardRoute = '/admin/admindashboard';
                    break;
                case 'accountant':
                    dashboardRoute = '/accountant/dashboard';
                    break;
                case 'client':
                    dashboardRoute = '/client/dashboard';
                    break;
                case 'projectmanager':
                case 'manager':
                    dashboardRoute = '/manager/dashboard';
                    break;
                case 'labour':
                    dashboardRoute = '/labour/dashboard';
                    break;
                case 'siteengineer':
                case 'engineer':
                default:
                    dashboardRoute = '/engineer/dashboard';
                    break;
            }

            // Immediately route without alert to match screenshot seamless flow
            router.replace(dashboardRoute as any);
            
        } catch (error: any) {
            console.error(error);
            Alert.alert('Verification Failed', error.response?.data?.detail || 'Invalid OTP or connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper for 6 boxes
    const renderOtpBoxes = () => {
        const boxes = [];
        for (let i = 0; i < 6; i++) {
            const digit = otp[i] || '';
            const isFocused = otp.length === i;
            boxes.push(
                <View 
                    key={i} 
                    className={`w-[45px] h-[55px] rounded-xl items-center justify-center border-2 ${isFocused ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 bg-white'}`}
                >
                    <Text className="text-2xl font-black text-gray-900">{digit}</Text>
                </View>
            );
        }
        return boxes;
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            {/* Top Background Section (Dark Blue area) */}
            <View style={{ height: height * 0.55 }} className="w-full bg-[#0a1e3f]">

                <View className="flex-1 items-center justify-between pt-12 pb-20 w-full">
                    <View className="w-full px-4 pt-2">
                        <TouchableOpacity
                            onPress={() => {
                                if (router.canGoBack()) {
                                    router.back();
                                } else {
                                    router.replace('/');
                                }
                            }}
                            className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
                        >
                            <ArrowLeft size={20} color="#ffffff" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1 w-full items-center justify-center px-4 -mt-4">
                        <Image
                            source={require('../../../assets/images/logo-full.png')}
                            className="w-full h-full max-h-[75%] ml-[52px]"
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
                        <View className="h-1.5 w-6 bg-blue-600 rounded-full opacity-30" />
                        <View className="h-1.5 w-6 bg-blue-600 rounded-full" />
                    </View>
                    <Text className="text-gray-400 text-xs font-semibold">Step 2 of 2</Text>
                </View>

                {/* Header content */}
                <View className="flex-row items-start mb-6">
                    <View className="bg-blue-50 p-3 rounded-2xl mr-4">
                        <ShieldCheck size={24} color="#2563eb" fill="#2563eb" className="opacity-90" />
                    </View>
                    <View className="flex-1 gap-1 pt-1">
                        <Text className="text-2xl font-extrabold text-gray-800">Verify OTP</Text>
                        <Text className="text-sm font-medium text-gray-500 leading-snug pr-4">
                            Sent to <Text className="font-bold text-gray-800">+91 {mobileNumber}</Text>
                        </Text>
                        <TouchableOpacity>
                            <Text className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">CHANGE NUMBER</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Hidden Input for OTP */}
                <TextInput
                    ref={inputRef}
                    value={otp}
                    onChangeText={(val) => setOtp(val.replace(/[^0-9]/g, ''))}
                    keyboardType="number-pad"
                    maxLength={6}
                    className="absolute opacity-0" // Hidden but functional
                    style={{ width: 1, height: 1 }}
                />

                {/* 6 Individual Boxes UI */}
                <TouchableOpacity 
                    className="flex-row justify-between w-full mb-2 mt-2" 
                    onPress={() => inputRef.current?.focus()}
                    activeOpacity={1}
                >
                    {renderOtpBoxes()}
                </TouchableOpacity>

                <View className="flex-row justify-end w-full mb-8">
                    <TouchableOpacity>
                        <Text className="text-xs font-bold text-blue-600 tracking-widest">RESEND IN 26S</Text>
                    </TouchableOpacity>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleVerifyOTP}
                    disabled={isLoading || otp.length < 6}
                    style={styles.shadowButton}
                    className={`flex-row items-center justify-between rounded-xl px-5 py-4 ${otp.length >= 6 ? 'bg-[#0a276e]' : 'bg-[#0a276e]/50'}`}
                >
                    <View className="flex-row items-center">
                        {isLoading ? (
                            <ActivityIndicator size="small" color="white" className="mr-3" />
                        ) : (
                            <Lock size={16} color="white" className="mr-3 opacity-80" />
                        )}
                        <Text className="text-white text-[13px] font-extrabold tracking-widest">
                            VERIFY SECURE OTP
                        </Text>
                    </View>
                    <ArrowRight size={20} color="white" />
                </TouchableOpacity>

                <View className="mt-8 items-center">
                    <Lock size={16} color="#cbd5e1" className="mb-2" />
                    <Text className="text-[9px] font-black text-gray-400 tracking-widest text-center uppercase">
                        SECURE ACCESS FOR{'\n'}INFRAPILOT VERIFIED PERSONNEL
                    </Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    bottomSheet: {
        marginTop: -30,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    shadowButton: {
        shadowColor: '#1d4ed8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    }
});
