import { ChevronDown, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { boqService, CreateBoqData } from '../../services/boqService';
import { ActivityType, masterService } from '../../services/masterService';
import { projectService, ProjectSummary } from '../../services/projectService';

interface CreateBoqModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function CreateBoqModal({ visible, onClose, onSuccess }: CreateBoqModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Dropdown Data
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [isOpenProjectSelect, setIsOpenProjectSelect] = useState(false);
    const [isOpenActivitySelect, setIsOpenActivitySelect] = useState(false);

    const [form, setForm] = useState<CreateBoqData>({
        project_id: '',
        item_name: '',
        description: '',
        quantity: '',
        unit_cost: '',
        activity_type_id: '',
        status: 'Active'
    });

    useEffect(() => {
        if (!visible) return;
        let mounted = true;
        (async () => {
            try {
                const [projRes, actRes] = await Promise.all([
                    projectService.getProjects(),
                    masterService.getActivityTypes()
                ]);
                if (mounted) {
                    setProjects(projRes);
                    setActivities(actRes);
                }
            } catch (err) {
                console.error("Failed to load drop down data", err);
            }
        })();
        return () => { mounted = false; };
    }, [visible]);

    const handleCreateBoq = async () => {
        if (!form.project_id || !form.item_name || !form.activity_type_id) {
            Alert.alert("Missing Fields", "Please fill in Project, Item Name, and Activity Type.");
            return;
        }

        setIsLoading(true);
        try {
            await boqService.createBoq(form);
            Alert.alert("Success", "BOQ Item successfully created!");

            // Reset form
            setForm({ project_id: '', item_name: '', description: '', quantity: '', unit_cost: '', activity_type_id: '', status: 'Active' });
            setIsOpenProjectSelect(false);
            setIsOpenActivitySelect(false);

            onSuccess?.();
            onClose();
        } catch (error: any) {
            Alert.alert("Error", error?.response?.data?.detail || error?.response?.data?.message || "Failed to create BOQ. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl min-h-[75%] max-h-[85%] shadow-xl overflow-hidden p-0 m-0">
                    <View className="flex-row items-center justify-between px-6 py-5 border-b border-gray-100">
                        <View>
                            <Text className="text-lg font-extrabold text-gray-800">Add BOQ Item</Text>
                            <Text className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-1">Bill of Quantities entry</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                setIsOpenProjectSelect(false);
                                setIsOpenActivitySelect(false);
                                onClose();
                            }}
                            className="p-2 bg-gray-100 rounded-full"
                        >
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 px-6 pb-6 pt-4" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                        {/* Project Dropdown */}
                        <View className={`mb-4 ${isOpenProjectSelect ? 'z-50' : 'z-10'}`}>
                            <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Select Project *</Text>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    setIsOpenProjectSelect(!isOpenProjectSelect);
                                    setIsOpenActivitySelect(false);
                                }}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
                            >
                                <Text className={`font-semibold ${form.project_id ? 'text-gray-800' : 'text-gray-400'}`}>
                                    {form.project_id ? projects.find(p => p.id === form.project_id)?.project_name || form.project_id : "Tap to select project"}
                                </Text>
                                <ChevronDown size={18} color="#9CA3AF" />
                            </TouchableOpacity>

                            {isOpenProjectSelect && projects.length > 0 && (
                                <View className="mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-44 absolute top-[70px] w-full z-50 overflow-hidden">
                                    <ScrollView nestedScrollEnabled className="w-full">
                                        {projects.map(p => (
                                            <TouchableOpacity
                                                key={p.id}
                                                onPress={() => {
                                                    setForm(f => ({ ...f, project_id: p.id }));
                                                    setIsOpenProjectSelect(false);
                                                }}
                                                className={`p-3 border-b border-gray-100 ${form.project_id === p.id ? 'bg-blue-50' : 'bg-white'}`}
                                            >
                                                <Text className={`text-sm ${form.project_id === p.id ? 'text-blue-600 font-bold' : 'text-gray-700 font-medium'}`}>{p.project_name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                            {isOpenProjectSelect && projects.length === 0 && (
                                <View className="mt-1 bg-white border border-gray-200 rounded-xl p-4 absolute top-[70px] w-full z-50">
                                    <ActivityIndicator size="small" color="#2563EB" />
                                </View>
                            )}
                        </View>

                        {/* Activity Type Dropdown */}
                        <View className={`mb-4 ${isOpenActivitySelect ? 'z-40' : 'z-0'}`}>
                            <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Activity Type *</Text>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    setIsOpenActivitySelect(!isOpenActivitySelect);
                                    setIsOpenProjectSelect(false);
                                }}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
                            >
                                <Text className={`font-semibold ${form.activity_type_id ? 'text-gray-800' : 'text-gray-400'}`}>
                                    {form.activity_type_id ? activities.find(a => a.id === form.activity_type_id)?.name || form.activity_type_id : "Tap to select activity"}
                                </Text>
                                <ChevronDown size={18} color="#9CA3AF" />
                            </TouchableOpacity>

                            {isOpenActivitySelect && activities.length > 0 && (
                                <View className="mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-44 absolute top-[70px] w-full z-50 overflow-hidden">
                                    <ScrollView nestedScrollEnabled className="w-full">
                                        {activities.map(a => (
                                            <TouchableOpacity
                                                key={a.id}
                                                onPress={() => {
                                                    setForm(f => ({ ...f, activity_type_id: a.id }));
                                                    setIsOpenActivitySelect(false);
                                                }}
                                                className={`p-3 border-b border-gray-100 ${form.activity_type_id === a.id ? 'bg-blue-50' : 'bg-white'}`}
                                            >
                                                <Text className={`text-sm ${form.activity_type_id === a.id ? 'text-blue-600 font-bold' : 'text-gray-700 font-medium'}`}>{a.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                            {isOpenActivitySelect && activities.length === 0 && (
                                <View className="mt-1 bg-white border border-gray-200 rounded-xl p-4 absolute top-[70px] w-full z-50">
                                    <ActivityIndicator size="small" color="#2563EB" />
                                </View>
                            )}
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Item Name *</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold"
                                placeholder="e.g. Steel Rebar M20"
                                value={form.item_name}
                                onChangeText={v => setForm(f => ({ ...f, item_name: v }))}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Description (Optional)</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold min-h-[80px]"
                                placeholder="Technical specifications..."
                                multiline
                                textAlignVertical="top"
                                value={form.description}
                                onChangeText={v => setForm(f => ({ ...f, description: v }))}
                            />
                        </View>

                        <View className="flex-row justify-between mb-6">
                            <View className="w-[48%]">
                                <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Quantity</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold"
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={form.quantity as string}
                                    onChangeText={v => setForm(f => ({ ...f, quantity: v }))}
                                />
                            </View>
                            <View className="w-[48%]">
                                <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Unit Cost (₹)</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold"
                                    placeholder="0.00"
                                    keyboardType="numeric"
                                    value={form.unit_cost as string}
                                    onChangeText={v => setForm(f => ({ ...f, unit_cost: v }))}
                                />
                            </View>
                        </View>

                    </ScrollView>

                    <View className="p-5 border-t border-gray-100 bg-white shadow-xl pt-4 z-0">
                        <TouchableOpacity
                            onPress={handleCreateBoq}
                            disabled={isLoading}
                            className={`flex-row justify-center items-center py-4 rounded-xl ${isLoading ? 'bg-blue-400' : 'bg-[#0a276e]'}`}
                            style={styles.shadowButton}
                        >
                            {isLoading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white text-sm font-bold uppercase tracking-widest">Save BOQ Entry</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    shadowButton: { shadowColor: '#1d4ed8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }
});
