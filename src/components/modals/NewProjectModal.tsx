import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { Calendar, ChevronDown, Clock, MapPin, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { ownerService } from '../../services/ownerService';
import { CreateProjectData, projectService } from '../../services/projectService';

const PROJECT_TYPES = ["Residential", "Commercial", "Industrial", "Road", "Bridge", "Interior", "Villa", "Apartment", "Township", "Renovation"];
const PROJECT_STATUSES = ["PLANNED", "ONGOING", "COMPLETED", "ON HOLD", "DELAYED"];
const LOCATION_TYPES = ["Urban", "Rural", "Semi-Urban", "Highway", "Remote", "Industrial Zone"];

// --- Extracted Components to prevent keyboard dismissal on re-render ---
const SectionHeader = ({ title }: { title: string }) => (
    <Text className="text-[13px] font-extrabold text-gray-800 mb-4 mt-6">{title}</Text>
);

const Label = ({ title, required }: { title: string, required?: boolean }) => (
    <Text className="text-[11px] font-bold text-gray-500 mb-2 ml-1">
        {title} {required && <Text className="text-red-500">*</Text>}
    </Text>
);

const StandardInput = ({ placeholder, value, onChangeText, keyboardType = "default", multiline = false, height = undefined }: any) => (
    <TextInput
        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold"
        style={height ? { minHeight: height, textAlignVertical: multiline ? 'top' : 'center' } : {}}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
    />
);

const DropdownSelect = ({ value, onPress, options }: { value: string, onPress: () => void, options: any[] }) => {
    let displayLabel = value || 'Select';
    if (value && options.length > 0 && typeof options[0] === 'object') {
        const found = options.find(o => o.value === value);
        if (found) displayLabel = found.label;
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
        >
            <Text className={`font-semibold ${value ? 'text-gray-800' : 'text-gray-400'}`}>
                {displayLabel}
            </Text>
            <ChevronDown size={18} color="#6b7280" />
        </TouchableOpacity>
    );
};

// Replaces standard text input for Dates/Times with a Touchable trigger
const PickerInput = ({ placeholder, value, onPress, Icon, disabled = false }: any) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`flex-row items-center border border-gray-200 rounded-xl px-4 py-3 ${disabled ? 'bg-gray-100' : 'bg-gray-50'}`}
    >
        <Text className={`flex-1 font-semibold ${value ? 'text-gray-800' : 'text-gray-400'}`}>
            {value || placeholder}
        </Text>
        {Icon}
    </TouchableOpacity>
);

const IconInput = ({ placeholder, value, onChangeText, Icon, keyboardType = "default" }: any) => (
    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
        <TextInput
            className="flex-1 text-gray-800 font-semibold py-0"
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
        />
        {Icon}
    </View>
);

// Format helpers
const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
};
const formatTime = (date: Date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours < 10 ? '0' + hours : hours}:${strMinutes} ${ampm}`;
};
// --------------------------------------------------------------------------

interface NewProjectModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function NewProjectModal({ visible, onClose, onSuccess }: NewProjectModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [owners, setOwners] = useState<any[]>([]);

    // Dropdown Modal logic
    const [dropdownState, setDropdownState] = useState<{ visible: boolean, field: keyof CreateProjectData | null, options: any[] }>({
        visible: false,
        field: null,
        options: []
    });

    // Date/Time Picker Logic
    const [datePickerState, setDatePickerState] = useState<{
        visible: boolean;
        mode: 'date' | 'time';
        field: keyof CreateProjectData | null;
        currentDate: Date;
    }>({
        visible: false,
        mode: 'date',
        field: null,
        currentDate: new Date()
    });

    const [form, setForm] = useState<CreateProjectData>({
        project_name: '',
        owner_id: '',
        description: '',
        site_address: '',
        city: '',
        pincode: '',
        start_date: '',
        end_date: '',
        type: 'Residential',
        location_type: 'Urban',
        state: '',
        country: 'India',
        latitude: '',
        longitude: '',
        status: 'PLANNED',
        budget_amount: '',
        shift_start_time: '09:00 AM',
        shift_end_time: '06:00 PM',
        grace_period_minutes: '15',
    });

    useEffect(() => {
        if (visible) {
            ownerService.getOwners()
                .then(data => {
                    const items = Array.isArray(data) ? data : (data?.items || data?.data || []);
                    setOwners(items);
                })
                .catch(err => console.error("Failed to fetch owners:", err));
        }
    }, [visible]);

    const ownerOptions = owners.map(o => ({
        label: o.owner_name || o.name || `Owner ${o.owner_id || o.id}`,
        value: String(o.owner_id || o.id)
    }));

    const handleCreateProject = async () => {
        if (!form.project_name || !form.owner_id || !form.description || !form.site_address || !form.city || !form.pincode || !form.start_date || !form.end_date) {
            Alert.alert("Missing Fields", "Please fill in all mandatory fields.");
            return;
        }

        setIsLoading(true);
        try {
            await projectService.createProject(form);
            Alert.alert("Success", "Project has been successfully created!");

            setForm({
                project_name: '', owner_id: '', description: '', site_address: '', city: '', pincode: '', start_date: '', end_date: '',
                type: 'Residential', location_type: 'Urban', state: '', country: 'India', latitude: '', longitude: '', status: 'PLANNED', budget_amount: '',
                shift_start_time: '09:00 AM', shift_end_time: '06:00 PM', grace_period_minutes: '15',
            });

            onSuccess?.();
            onClose();
        } catch (error: any) {
            Alert.alert("Error", error?.response?.data?.detail || error?.response?.data?.message || "Failed to create project. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetLiveLocation = async () => {
        setIsFetchingLocation(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location was denied. Please enable it in your device settings.');
                setIsFetchingLocation(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setForm(f => ({
                ...f,
                latitude: location.coords.latitude.toString(),
                longitude: location.coords.longitude.toString()
            }));
            Alert.alert('Success', 'Location coordinates fetched successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch location. Please try again or enter manually.');
        } finally {
            setIsFetchingLocation(false);
        }
    };

    const openDropdown = (field: keyof CreateProjectData, options: any[]) => {
        setDropdownState({ visible: true, field, options });
    };

    const selectOption = (value: string) => {
        if (dropdownState.field) {
            setForm(f => ({ ...f, [dropdownState.field as string]: value }));
        }
        setDropdownState({ visible: false, field: null, options: [] });
    };

    const openDateTimePicker = (field: keyof CreateProjectData, mode: 'date' | 'time') => {
        setDatePickerState({ visible: true, mode, field, currentDate: new Date() });
    };

    const handlePickerChange = (event: any, selectedDate?: Date) => {
        // Always dismiss on Android immediately
        if (Platform.OS === 'android') {
            setDatePickerState(prev => ({ ...prev, visible: false }));
        }

        if (selectedDate && datePickerState.field) {
            setDatePickerState(prev => ({ ...prev, currentDate: selectedDate }));

            const formattedValue = datePickerState.mode === 'date'
                ? formatDate(selectedDate)
                : formatTime(selectedDate);

            setForm(f => ({ ...f, [datePickerState.field as string]: formattedValue }));
        }
    };

    const confirmIOSPicker = () => {
        setDatePickerState(prev => ({ ...prev, visible: false, field: null }));
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl min-h-[85%] max-h-[95%] shadow-xl overflow-hidden p-0 m-0">
                    <View className="flex-row items-center justify-between px-6 py-5 border-b border-gray-100">
                        <View>
                            <Text className="text-xl font-extrabold text-gray-800">Create New Project</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 px-6 pb-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                        {/* 1. Project Details */}
                        <SectionHeader title="Project Details" />

                        <View className="mb-4">
                            <Label title="Project Name" required />
                            <StandardInput placeholder="e.g. SARA CITY" value={form.project_name} onChangeText={(v: string) => setForm({ ...form, project_name: v })} />
                        </View>

                        <View className="flex-row justify-between mb-4">
                            <View className="w-[48%] relative z-10">
                                <Label title="Project Type" />
                                <DropdownSelect value={form.type || ''} onPress={() => openDropdown('type', PROJECT_TYPES)} options={PROJECT_TYPES} />
                            </View>
                            <View className="w-[48%] relative z-10">
                                <Label title="Project Status" />
                                <DropdownSelect value={form.status || ''} onPress={() => openDropdown('status', PROJECT_STATUSES)} options={PROJECT_STATUSES} />
                            </View>
                        </View>

                        <View className="w-[48%] mb-4 relative z-10">
                            <Label title="Owner Name" required />
                            <DropdownSelect value={form.owner_id as string} onPress={() => openDropdown('owner_id', ownerOptions)} options={ownerOptions} />
                        </View>

                        <View className="mb-4">
                            <Label title="Description" required />
                            <StandardInput placeholder="Project Details" value={form.description} onChangeText={(v: string) => setForm({ ...form, description: v })} multiline height={80} />
                        </View>

                        <View className="mb-4">
                            <Label title="Budget Amount (₹)" />
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                                <Text className="text-gray-400 mr-2 font-bold">₹</Text>
                                <TextInput
                                    className="flex-1 text-gray-800 font-semibold py-0"
                                    placeholder="e.g. 5000000"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="numeric"
                                    value={form.budget_amount as string}
                                    onChangeText={(v: string) => setForm({ ...form, budget_amount: v })}
                                />
                            </View>
                        </View>

                        {/* 2. Location Information */}
                        <SectionHeader title="Location Information" />

                        <View className="mb-4">
                            <Label title="Site Address" required />
                            <StandardInput placeholder="Full site address" value={form.site_address} onChangeText={(v: string) => setForm({ ...form, site_address: v })} />
                        </View>

                        <View className="flex-row justify-between mb-4">
                            <View className="w-[48%]">
                                <Label title="City" required />
                                <StandardInput placeholder="e.g. Pune" value={form.city} onChangeText={(v: string) => setForm({ ...form, city: v })} />
                            </View>
                            <View className="w-[48%]">
                                <Label title="State" />
                                <StandardInput placeholder="e.g. Maharashtra" value={form.state} onChangeText={(v: string) => setForm({ ...form, state: v })} />
                            </View>
                        </View>

                        <View className="flex-row justify-between mb-4">
                            <View className="w-[48%]">
                                <Label title="Pincode" required />
                                <StandardInput placeholder="e.g. 411033" value={form.pincode} onChangeText={(v: string) => setForm({ ...form, pincode: v })} keyboardType="numeric" />
                            </View>
                            <View className="w-[48%] relative z-10">
                                <Label title="Location Type" />
                                <DropdownSelect value={form.location_type || ''} onPress={() => openDropdown('location_type', LOCATION_TYPES)} options={LOCATION_TYPES} />
                            </View>
                        </View>

                        {/* 3. GPS COORDINATES */}
                        <View className="flex-row justify-between items-center mt-6 mb-4">
                            <Text className="text-[13px] font-extrabold text-gray-800 uppercase">GPS Coordinates</Text>
                            <TouchableOpacity onPress={handleGetLiveLocation} disabled={isFetchingLocation} className={`flex-row items-center px-3 py-1.5 rounded-lg border ${isFetchingLocation ? 'bg-gray-100 border-gray-200' : 'bg-blue-50 border-blue-100'}`}>
                                {isFetchingLocation ? <ActivityIndicator size="small" color="#6B7280" className="mr-1" /> : <MapPin size={14} color="#2563EB" className="mr-1" />}
                                <Text className={`font-bold text-xs ${isFetchingLocation ? 'text-gray-500' : 'text-blue-600'}`}>
                                    {isFetchingLocation ? 'Location...' : 'Get Live Location'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-between mb-4">
                            <View className="w-[48%]">
                                <Label title="Latitude" />
                                <StandardInput placeholder="e.g. 18.5204" value={form.latitude as string} onChangeText={(v: string) => setForm({ ...form, latitude: v })} keyboardType="numeric" />
                            </View>
                            <View className="w-[48%]">
                                <Label title="Longitude" />
                                <StandardInput placeholder="e.g. 73.8567" value={form.longitude as string} onChangeText={(v: string) => setForm({ ...form, longitude: v })} keyboardType="numeric" />
                            </View>
                        </View>

                        {/* 4. Schedule */}
                        <SectionHeader title="Schedule" />

                        <View className="flex-row justify-between mb-4">
                            <View className="w-[48%]">
                                <Label title="Start Date" required />
                                <PickerInput
                                    placeholder="YYYY-MM-DD"
                                    value={form.start_date}
                                    onPress={() => openDateTimePicker('start_date', 'date')}
                                    Icon={<Calendar size={18} color="#6b7280" />}
                                />
                            </View>
                            <View className="w-[48%]">
                                <Label title="End Date" required />
                                <PickerInput
                                    placeholder="YYYY-MM-DD"
                                    value={form.end_date}
                                    onPress={() => openDateTimePicker('end_date', 'date')}
                                    Icon={<Calendar size={18} color="#6b7280" />}
                                />
                            </View>
                        </View>

                        {/* 5. SHIFT & ATTENDANCE SETTINGS */}
                        <Text className="text-[11px] font-extrabold text-gray-500 uppercase mt-4 mb-4">Shift & Attendance Settings</Text>

                        <View className="flex-row justify-between mb-4">
                            <View className="w-[31%]">
                                <Label title="Shift Start Time" />
                                <PickerInput
                                    placeholder="09:00 AM"
                                    value={form.shift_start_time}
                                    onPress={() => openDateTimePicker('shift_start_time', 'time')}
                                    Icon={<Clock size={14} color="#6b7280" />}
                                />
                            </View>
                            <View className="w-[31%]">
                                <Label title="Shift End Time" />
                                <PickerInput
                                    placeholder="06:00 PM"
                                    value={form.shift_end_time}
                                    onPress={() => openDateTimePicker('shift_end_time', 'time')}
                                    Icon={<Clock size={14} color="#6b7280" />}
                                />
                            </View>
                            <View className="w-[31%]">
                                <Label title="Grace Period (Mins)" />
                                <StandardInput placeholder="15" value={form.grace_period_minutes as string} onChangeText={(v: string) => setForm({ ...form, grace_period_minutes: v })} keyboardType="numeric" />
                            </View>
                        </View>

                        <View className="h-10" />

                    </ScrollView>

                    <View className="p-4 border-t border-gray-100 bg-white flex-row justify-end space-x-3">
                        <TouchableOpacity onPress={onClose} className="px-6 py-3 rounded-full border border-gray-200">
                            <Text className="text-sm font-bold text-gray-700">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCreateProject} disabled={isLoading} className={`px-6 py-3 rounded-full ${isLoading ? 'bg-blue-400' : 'bg-blue-600'}`} style={styles.shadowButton}>
                            {isLoading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white text-sm font-bold">Create Project</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* Custom Centered Dropdown Modal */}
            <Modal visible={dropdownState.visible} transparent animationType="fade" onRequestClose={() => setDropdownState({ visible: false, field: null, options: [] })}>
                <TouchableOpacity activeOpacity={1} onPress={() => setDropdownState({ visible: false, field: null, options: [] })} className="flex-1 justify-center px-8 bg-black/30">
                    <View className="bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200" style={{ maxHeight: '70%' }}>
                        <FlatList
                            data={dropdownState.options}
                            keyExtractor={(item, index) => typeof item === 'string' ? item : item.value + index}
                            contentContainerStyle={{ paddingVertical: 8 }}
                            renderItem={({ item }) => {
                                const label = typeof item === 'string' ? item : item.label;
                                const value = typeof item === 'string' ? item : item.value;
                                const isSelected = form[dropdownState.field as keyof CreateProjectData] === value;

                                return (
                                    <TouchableOpacity
                                        onPress={() => selectOption(value)}
                                        className={`px-6 py-4 flex-row items-center justify-between ${isSelected ? 'bg-blue-50' : 'bg-white'}`}
                                    >
                                        <Text className={`text-base ${isSelected ? 'font-bold text-blue-700' : 'text-gray-700 font-medium'}`}>
                                            {label}
                                        </Text>
                                        {isSelected && (
                                            <View className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm shadow-blue-500" />
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Native Date and Time Picker Wrapper */}
            {datePickerState.visible && Platform.OS === 'android' && (
                <DateTimePicker
                    value={datePickerState.currentDate}
                    mode={datePickerState.mode}
                    display="default"
                    onChange={handlePickerChange}
                />
            )}

            {datePickerState.visible && Platform.OS === 'ios' && (
                <Modal visible transparent animationType="fade">
                    <TouchableOpacity activeOpacity={1} onPress={confirmIOSPicker} className="flex-1 justify-end bg-black/40">
                        <TouchableOpacity activeOpacity={1} className="bg-white p-4 pb-8 rounded-t-3xl">
                            <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-2">
                                <Text className="font-bold text-gray-800 text-lg mx-2 capitalize">Select {datePickerState.mode}</Text>
                                <TouchableOpacity onPress={confirmIOSPicker}>
                                    <Text className="text-blue-600 font-bold mx-2">Done</Text>
                                </TouchableOpacity>
                            </View>
                            <DateTimePicker
                                value={datePickerState.currentDate}
                                mode={datePickerState.mode}
                                display="spinner"
                                onChange={handlePickerChange}
                                style={{ width: '100%', height: 200 }}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            )}

        </Modal>
    );
}

const styles = StyleSheet.create({
    shadowButton: { shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }
});
