import { X } from 'lucide-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { CreateUserData, userService } from '../../services/userService';

interface AddUserModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ROLES: CreateUserData['role'][] = ["Admin", "ProjectManager", "SiteEngineer", "Accountant", "Client"];

export function AddUserModal({ visible, onClose, onSuccess }: AddUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState<CreateUserData>({
        full_name: '',
        mobile_number: '',
        email: '',
        role: 'Client',
        password: '',
        designation: '',
        joining_date: '',
        pan_number: '',
        aadhaar_number: '',
        address: '',
        is_active: true,
    });

    const handleCreateUser = async () => {
        if (!form.full_name || !form.mobile_number || !form.email || !form.password) {
            Alert.alert("Missing Fields", "Please fill in all mandatory fields (Name, Mobile, Email, Password).");
            return;
        }

        setIsLoading(true);
        try {
            // Note: profileImageUri can be passed as the second argument if user selects one.
            // Keeping it undefined for now until an image picker is added.
            await userService.createUser(form, undefined);
            Alert.alert("Success", "User has been successfully added!");

            // Reset form
            setForm({
                full_name: '',
                mobile_number: '',
                email: '',
                role: 'Client',
                password: '',
                designation: '',
                joining_date: '',
                pan_number: '',
                aadhaar_number: '',
                address: '',
                is_active: true,
            });

            onSuccess?.();
            onClose();
        } catch (error: any) {
            Alert.alert(
                "Error",
                error?.response?.data?.detail || error?.response?.data?.message || "Failed to create user. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-end bg-black/50"
            >
                <View className="bg-white rounded-t-3xl min-h-[85%] max-h-[90%] shadow-xl overflow-hidden p-0 m-0">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 py-5 border-b border-gray-100">
                        <View>
                            <Text className="text-lg font-extrabold text-gray-800">Add New User</Text>
                            <Text className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-1">Create user profile in system</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Form ScrollView */}
                    <ScrollView className="flex-1 px-6 pb-6 pt-4" showsVerticalScrollIndicator={false}>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Name *</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold"
                                placeholder="Enter full name"
                                value={form.full_name}
                                onChangeText={v => setForm(f => ({ ...f, full_name: v }))}
                            />
                        </View>

                        <View className="flex-row justify-between mb-4">
                            <View className="w-[48%]">
                                <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Mobile *</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold"
                                    placeholder="10 digit number"
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    value={form.mobile_number}
                                    onChangeText={v => setForm(f => ({ ...f, mobile_number: v }))}
                                />
                            </View>
                            <View className="w-[48%]">
                                <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email *</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold"
                                    placeholder="email@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={form.email}
                                    onChangeText={v => setForm(f => ({ ...f, email: v }))}
                                />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Password *</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold"
                                placeholder="Create a secure password"
                                secureTextEntry
                                value={form.password}
                                onChangeText={v => setForm(f => ({ ...f, password: v }))}
                            />
                        </View>

                        {/* Roles */}
                        <View className="mb-6">
                            <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">User Role *</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {ROLES.map(role => (
                                    <TouchableOpacity
                                        key={role}
                                        onPress={() => setForm(f => ({ ...f, role }))}
                                        className={`px-3 py-2 rounded-lg border ${form.role === role ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
                                    >
                                        <Text className={`text-xs font-bold ${form.role === role ? 'text-white' : 'text-gray-600'}`}>{role}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View className="flex-row justify-between mb-4">
                            <View className="w-[48%]">
                                <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Designation</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold"
                                    placeholder="Optional"
                                    value={form.designation}
                                    onChangeText={v => setForm(f => ({ ...f, designation: v }))}
                                />
                            </View>
                            <View className="w-[48%]">
                                <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Joining Date</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold"
                                    placeholder="YYYY-MM-DD"
                                    value={form.joining_date}
                                    onChangeText={v => setForm(f => ({ ...f, joining_date: v }))}
                                />
                            </View>
                        </View>

                        <View className="flex-row justify-between mb-4">
                            <View className="w-[48%]">
                                <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">PAN Number</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold"
                                    placeholder="Optional"
                                    autoCapitalize="characters"
                                    value={form.pan_number}
                                    onChangeText={v => setForm(f => ({ ...f, pan_number: v }))}
                                />
                            </View>
                            <View className="w-[48%]">
                                <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Aadhaar (Last 4)</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold"
                                    placeholder="Optional"
                                    keyboardType="number-pad"
                                    maxLength={4}
                                    value={form.aadhaar_number}
                                    onChangeText={v => setForm(f => ({ ...f, aadhaar_number: v }))}
                                />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Address</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold min-h-[80px]"
                                placeholder="Full residential address"
                                multiline
                                textAlignVertical="top"
                                value={form.address}
                                onChangeText={v => setForm(f => ({ ...f, address: v }))}
                            />
                        </View>

                        <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 mb-10">
                            <View>
                                <Text className="text-sm font-bold text-gray-700">Account Active</Text>
                                <Text className="text-[10px] text-gray-400 font-medium">User can log into the app</Text>
                            </View>
                            <Switch
                                value={form.is_active}
                                onValueChange={v => setForm(f => ({ ...f, is_active: v }))}
                                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                                thumbColor={form.is_active ? '#2563eb' : '#f3f4f6'}
                            />
                        </View>

                    </ScrollView>

                    {/* Footer / Submit */}
                    <View className="p-5 border-t border-gray-100 bg-white shadow-xl pt-4">
                        <TouchableOpacity
                            onPress={handleCreateUser}
                            disabled={isLoading}
                            className={`flex-row justify-center items-center py-4 rounded-xl ${isLoading ? 'bg-blue-400' : 'bg-[#0a276e]'}`}
                            style={styles.shadowButton}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text className="text-white text-sm font-bold uppercase tracking-widest">Create User Profile</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    shadowButton: {
        shadowColor: '#1d4ed8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    }
});
