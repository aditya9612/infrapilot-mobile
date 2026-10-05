import { useNavigation } from 'expo-router';
import {
    Activity, AlertTriangle, BarChart2, CheckCircle, ChevronDown, ChevronLeft, ChevronRight,
    Edit3, Eye, FileSpreadsheet, FileText, Plus, RefreshCw, Search, X, Calendar, Briefcase,
    AlertCircle, Trash2, Clock, CheckCircle2, Box, Layers, Play, DollarSign, FileCheck, Clipboard
} from 'lucide-react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    Linking, ActivityIndicator, Image, Modal, ScrollView, Text, TextInput,
    TouchableOpacity, View, Dimensions, Animated, Pressable
} from 'react-native';
import TopHeader from '../../../components/TopHeader';
import { useProjectContext } from '../../../contexts/ProjectContext';
import { workProgressService } from '../../../services/workProgressService';
import type { WorkOrderItem, CreateWorkOrderRequest } from '../../../types/workProgress';

// ─── Date Utilities ────────────────────────────────────────────────────────────
const toDisplay = (iso: string) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    if (!y || !m || !d) return iso;
    return `${d}-${m}-${y}`;
};

// ─── Inline Calendar Component ────────────────────────────────────────────────
function InlineCalendar({ value, onChange, onClose }: { value: string; onChange: (iso: string) => void; onClose: () => void }) {
    const today = new Date();
    const initialDate = value ? new Date(value) : today;
    const [viewYear, setViewYear] = useState(isNaN(initialDate.getTime()) ? today.getFullYear() : initialDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(isNaN(initialDate.getTime()) ? today.getMonth() : initialDate.getMonth());

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

    const selectedIso = value || '';

    const handlePrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(v => v - 1);
        } else {
            setViewMonth(v => v - 1);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(v => v + 1);
        } else {
            setViewMonth(v => v + 1);
        }
    };

    const handleSelectDay = (day: number) => {
        const mm = String(viewMonth + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        const iso = `${viewYear}-${mm}-${dd}`;
        onChange(iso);
        onClose();
    };

    const grid: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) grid.push(d);

    return (
        <View style={{
            backgroundColor: '#fff', borderRadius: 16, padding: 16,
            borderWidth: 1, borderColor: '#E2E8F0',
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12, shadowRadius: 10, elevation: 8,
            width: 290,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <TouchableOpacity onPress={handlePrevMonth} style={{ padding: 6, borderRadius: 8, backgroundColor: '#F1F5F9' }}>
                    <ChevronLeft size={16} color="#334155" />
                </TouchableOpacity>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A' }}>
                    {monthNames[viewMonth]} {viewYear}
                </Text>
                <TouchableOpacity onPress={handleNextMonth} style={{ padding: 6, borderRadius: 8, backgroundColor: '#F1F5F9' }}>
                    <ChevronRight size={16} color="#334155" />
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                {daysOfWeek.map(d => (
                    <Text key={d} style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700', color: '#94A3B8' }}>
                        {d}
                    </Text>
                ))}
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {grid.map((cell, idx) => {
                    if (cell === null) {
                        return <View key={`empty-${idx}`} style={{ width: '14.28%', height: 34 }} />;
                    }
                    const mm = String(viewMonth + 1).padStart(2, '0');
                    const dd = String(cell).padStart(2, '0');
                    const cellIso = `${viewYear}-${mm}-${dd}`;
                    const isSelected = cellIso === selectedIso;
                    const isToday = cellIso === today.toISOString().split('T')[0];

                    return (
                        <TouchableOpacity
                            key={`day-${cell}`}
                            onPress={() => handleSelectDay(cell)}
                            style={{
                                width: '14.28%', height: 34,
                                alignItems: 'center', justifyContent: 'center',
                                borderRadius: 8,
                                backgroundColor: isSelected ? '#2563EB' : isToday ? '#EFF6FF' : 'transparent',
                            }}
                        >
                            <Text style={{
                                fontSize: 12,
                                fontWeight: isSelected || isToday ? '700' : '400',
                                color: isSelected ? '#fff' : isToday ? '#2563EB' : '#1E293B',
                            }}>
                                {cell}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

// ─── Floating DatePicker Field ────────────────────────────────────────────────
function DatePickerField({
    label, required, value, onChange, openKey, activeKey, setActiveKey
}: {
    label: string; required?: boolean; value: string; onChange: (iso: string) => void;
    openKey: string; activeKey: string | null; setActiveKey: (k: string | null) => void;
}) {
    const isOpen = activeKey === openKey;
    return (
        <View style={{ position: 'relative', zIndex: isOpen ? 9999 : 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>
                {label} {required && <Text style={{ color: '#EF4444' }}>*</Text>}
            </Text>
            <TouchableOpacity
                onPress={() => setActiveKey(isOpen ? null : openKey)}
                style={{
                    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8,
                    padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }}
            >
                <Text style={{ fontSize: 13, color: value ? '#0F172A' : '#94A3B8' }}>
                    {value ? toDisplay(value) : 'DD-MM-YYYY'}
                </Text>
                <Calendar size={16} color="#64748B" />
            </TouchableOpacity>

            {isOpen && (
                <View style={{ position: 'absolute', top: 62, left: 0, zIndex: 10000 }}>
                    <InlineCalendar
                        value={value}
                        onChange={onChange}
                        onClose={() => setActiveKey(null)}
                    />
                </View>
            )}
        </View>
    );
}

// ─── FloatingDropdown ──────────────────────────────────────────────────────────
function FloatingDropdown({
    displayValue, placeholder, isOpen, onToggle, onClose, children
}: {
    displayValue: string; placeholder: string; isOpen: boolean;
    onToggle: () => void; onClose: () => void;
    children: (close: () => void) => React.ReactNode;
}) {
    const triggerRef = useRef<any>(null);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

    const handleOpen = () => {
        if (triggerRef.current) {
            triggerRef.current.measureInWindow((x: number, y: number, w: number, h: number) => {
                setPos({ top: y + h + 4, left: x, width: Math.max(w, 150) });
                onToggle();
            });
        } else {
            onToggle();
        }
    };

    return (
        <>
            <TouchableOpacity
                ref={triggerRef}
                onPress={handleOpen}
                style={{
                    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
                    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8,
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }}
            >
                <Text style={{ fontSize: 12, color: displayValue ? '#0F172A' : '#94A3B8', fontWeight: displayValue ? '600' : '400' }} numberOfLines={1}>
                    {displayValue || placeholder}
                </Text>
                <ChevronDown size={14} color="#64748B" />
            </TouchableOpacity>

            <Modal visible={isOpen} transparent animationType="none" onRequestClose={onClose}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <Pressable
                        style={{
                            position: 'absolute',
                            top: pos.top,
                            left: pos.left,
                            width: pos.width,
                            backgroundColor: '#fff',
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: '#E2E8F0',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 10,
                            elevation: 10,
                            overflow: 'hidden',
                        }}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {children(onClose)}
                    </Pressable>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

// ─── Form Toast Component ────────────────────────────────────────────────────
function FormToastBanner({ visible, message, type }: { visible: boolean; message: string; type: 'success' | 'error' }) {
    if (!visible || !message) return null;
    const isError = type === 'error';
    return (
        <Animated.View style={{
            backgroundColor: isError ? '#FEF2F2' : '#F0FDF4',
            borderWidth: 1,
            borderColor: isError ? '#FECACA' : '#BBF7D0',
            borderRadius: 10,
            padding: 12,
            marginBottom: 14,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        }}>
            {isError ? <AlertCircle size={16} color="#DC2626" /> : <CheckCircle size={16} color="#16A34A" />}
            <Text style={{ color: isError ? '#991B1B' : '#166534', fontSize: 12, fontWeight: '600', flex: 1 }}>
                {message}
            </Text>
        </Animated.View>
    );
}

export default function WorkOrdersScreen() {
    const { activeProjectId, activeProjectName } = useProjectContext();

    // Data State
    const [workOrders, setWorkOrders] = useState<WorkOrderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [limitDropdownOpen, setLimitDropdownOpen] = useState(false);

    const getPageNumbers = (current: number, total: number): (number | string)[] => {
        if (total <= 5) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }
        if (current <= 3) {
            return [1, 2, 3, 4, '...', total];
        }
        if (current >= total - 2) {
            return [1, '...', total - 3, total - 2, total - 1, total];
        }
        return [1, '...', current - 1, current, current + 1, '...', total];
    };

    // Pickers
    const [statusFilterOpen, setStatusFilterOpen] = useState(false);
    const [formStatusOpen, setFormStatusOpen] = useState(false);
    const [activeDatePicker, setActiveDatePicker] = useState<string | null>(null);

    // Modals
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedWo, setSelectedWo] = useState<WorkOrderItem | null>(null);
    const [editId, setEditId] = useState<number | string | null>(null);
    const [exportPdfModalVisible, setExportPdfModalVisible] = useState(false);
    const [exportExcelModalVisible, setExportExcelModalVisible] = useState(false);

    // Toast State
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastMsg(msg);
        setToastType(type);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    // Form Toast State
    const [formToastVisible, setFormToastVisible] = useState(false);
    const [formToastMsg, setFormToastMsg] = useState('');
    const [formToastType, setFormToastType] = useState<'success' | 'error'>('success');
    const showFormToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setFormToastMsg(msg);
        setFormToastType(type);
        setFormToastVisible(true);
        setTimeout(() => setFormToastVisible(false), 3000);
    };

    // Form Data State
    const [formData, setFormData] = useState({
        work_order_no: '',
        description: '',
        total_quantity: '',
        unit: 'SQM',
        rate: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        status: 'Assigned'
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const pid = activeProjectId ? parseInt(activeProjectId.toString()) : undefined;
            const res = await workProgressService.getWorkOrders(pid).catch(() => null);
            const raw = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : (res?.items || []));
            setWorkOrders(raw);
        } catch (error) {
            console.error('Error loading work orders:', error);
            showToast('Failed to fetch work orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        setPage(1);
    }, [activeProjectId]);

    // Filtering
    const filteredWos = workOrders.filter(wo => {
        const matchesSearch = searchQuery === '' ||
            (wo.work_order_no && wo.work_order_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (wo.description && wo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (wo.project_name && wo.project_name.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'ALL' || (wo.status || '').toUpperCase() === statusFilter.toUpperCase();
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredWos.length / limit) || 1;
    const paginatedWos = filteredWos.slice((page - 1) * limit, page * limit);

    const openAddModal = () => {
        setEditId(null);
        setFormData({
            work_order_no: `WO0${(workOrders.length + 1).toString().padStart(2, '0')}`,
            description: '',
            total_quantity: '',
            unit: 'SQM',
            rate: '',
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
            status: 'Assigned'
        });
        setFormModalVisible(true);
    };

    const openEditModal = (wo: WorkOrderItem) => {
        setEditId(wo.id);
        setFormData({
            work_order_no: wo.work_order_no || '',
            description: wo.description || '',
            total_quantity: wo.total_quantity ? String(wo.total_quantity) : '',
            unit: wo.unit || 'SQM',
            rate: wo.rate ? String(wo.rate) : '',
            start_date: wo.start_date || new Date().toISOString().split('T')[0],
            end_date: wo.end_date || '',
            status: wo.status || 'Assigned'
        });
        setFormModalVisible(true);
    };

    const handleSaveWorkOrder = async () => {
        if (!formData.work_order_no.trim()) {
            showFormToast('Please enter Work Order Number', 'error');
            return;
        }
        if (!formData.description.trim()) {
            showFormToast('Please enter Description', 'error');
            return;
        }
        if (!formData.total_quantity || isNaN(Number(formData.total_quantity))) {
            showFormToast('Please enter a valid Total Quantity', 'error');
            return;
        }

        try {
            const payload: CreateWorkOrderRequest = {
                project_id: activeProjectId || 1,
                work_order_no: formData.work_order_no,
                description: formData.description,
                total_quantity: Number(formData.total_quantity),
                unit: formData.unit,
                rate: Number(formData.rate) || 0,
                start_date: formData.start_date,
                end_date: formData.end_date
            };

            if (editId) {
                await workProgressService.updateWorkOrder(editId, payload);
                showToast('Work Order updated successfully!', 'success');
            } else {
                await workProgressService.createWorkOrder(payload);
                showToast('New Work Order created successfully!', 'success');
            }
            setFormModalVisible(false);
            loadData();
        } catch (error) {
            showFormToast('Failed to save Work Order', 'error');
        }
    };

    const handleDeleteWo = async (id: number | string) => {
        try {
            await workProgressService.deleteWorkOrder(id);
            showToast('Work Order deleted!', 'success');
            loadData();
        } catch (error) {
            showToast('Failed to delete work order', 'error');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <TopHeader
                title="Work Orders"
                subtitle="InfraPilot › Engineer › Work Progress › Work Orders"
            />

            {/* Global Toast */}
            {toastVisible && (
                <View style={{
                    position: 'absolute', top: 80, left: 20, right: 20, zIndex: 9999,
                    backgroundColor: toastType === 'error' ? '#DC2626' : '#16A34A',
                    padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 8,
                    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 6
                }}>
                    <CheckCircle size={16} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700', flex: 1 }}>{toastMsg}</Text>
                </View>
            )}

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

                {/* ── TITLE ROW (Exact Image 2) ──────────────────────────────── */}
                <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}>
                            <Clipboard size={20} color="#2563EB" />
                        </View>
                        <View>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 }}>Work Orders</Text>
                            <Text style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>View and track all work orders for the selected project.</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={loadData}
                        style={{ width: 38, height: 38, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <RefreshCw size={16} color="#64748B" />
                    </TouchableOpacity>
                </View>

                {/* ── SEARCH & FILTER BAR (Exact Image 2) ────────────────────── */}
                <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                    {/* Search Input */}
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 10 }}>
                        <Search size={16} color="#94A3B8" />
                        <TextInput
                            placeholder="Search by Work Order Name or description..."
                            placeholderTextColor="#94A3B8"
                            style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 8, fontSize: 12, color: '#0F172A' }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Status Dropdown */}
                    <View style={{ width: 140 }}>
                        <FloatingDropdown
                            displayValue={statusFilter === 'ALL' ? 'All Status' : statusFilter}
                            placeholder="All Status"
                            isOpen={statusFilterOpen}
                            onToggle={() => setStatusFilterOpen(v => !v)}
                            onClose={() => setStatusFilterOpen(false)}
                        >
                            {(close) => (
                                <ScrollView style={{ maxHeight: 180 }}>
                                    {['ALL', 'Assigned', 'Completed', 'In Progress'].map(st => (
                                        <TouchableOpacity
                                            key={st}
                                            onPress={() => { setStatusFilter(st); close(); }}
                                            style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}
                                        >
                                            <Text style={{ fontSize: 12, color: statusFilter === st ? '#2563EB' : '#334155', fontWeight: statusFilter === st ? '700' : '400' }}>
                                                {st === 'ALL' ? 'All Status' : st}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </FloatingDropdown>
                    </View>
                </View>

                {/* ── RESPONSIVE TABLE & PAGINATION CONTAINER (Exact Image 2) ─── */}
                <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', marginBottom: 20 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <View style={{ minWidth: 960 }}>
                            {/* Table Header */}
                            <View style={{ flexDirection: 'row', backgroundColor: '#F8FAFC', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
                                <Text style={{ width: 130, fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8 }}>WORK ORDER NO.</Text>
                                <Text style={{ width: 140, fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8 }}>PROJECT</Text>
                                <Text style={{ width: 220, fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8 }}>WORK DESCRIPTION</Text>
                                <Text style={{ width: 120, fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8 }}>TOTAL QUANTITY</Text>
                                <Text style={{ width: 120, fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8 }}>COMPLETED QTY</Text>
                                <Text style={{ width: 100, fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8 }}>RATE</Text>
                                <Text style={{ width: 120, fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8 }}>TOTAL AMOUNT</Text>
                                <Text style={{ width: 120, fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8 }}>STATUS</Text>
                                <Text style={{ width: 50, fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8, textAlign: 'right' }}>ACTIONS</Text>
                            </View>

                            {/* Table Content */}
                            {loading ? (
                                <View style={{ padding: 40, alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color="#2563EB" />
                                </View>
                            ) : paginatedWos.length === 0 ? (
                                <View style={{ padding: 32, alignItems: 'center' }}>
                                    <FileCheck size={32} color="#94A3B8" />
                                    <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600', marginTop: 8 }}>No Work Orders Found</Text>
                                </View>
                            ) : (
                                paginatedWos.map((wo, idx) => {
                                    const rawStatus = wo.status || 'Assigned';
                                    const isCompleted = rawStatus === 'Completed' || rawStatus === 'COMPLETED';
                                    const isInProgress = rawStatus === 'In Progress' || rawStatus === 'IN_PROGRESS';

                                    const totalQty = wo.total_quantity || 0;
                                    const compQty = wo.completed_quantity || 0;
                                    const rate = wo.rate || 0;
                                    const totalAmount = wo.total_amount || (totalQty * rate);

                                    return (
                                        <View
                                            key={wo.id || idx}
                                            style={{
                                                flexDirection: 'row', alignItems: 'center',
                                                paddingVertical: 14, paddingHorizontal: 16,
                                                backgroundColor: idx % 2 === 0 ? '#fff' : '#F8FAFC',
                                                borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
                                            }}
                                        >
                                            <View style={{ width: 130 }}>
                                                <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A' }}>
                                                    {wo.work_order_no || `WO0${idx + 1}`}
                                                </Text>
                                            </View>

                                            <View style={{ width: 140 }}>
                                                <Text style={{ fontSize: 12, color: '#334155', fontWeight: '600' }} numberOfLines={1}>
                                                    {wo.project_name || activeProjectName || 'Metro City'}
                                                </Text>
                                            </View>

                                            <View style={{ width: 220, paddingRight: 10 }}>
                                                <Text style={{ fontSize: 12, color: '#475569' }} numberOfLines={1}>
                                                    {wo.description || 'No Description'}
                                                </Text>
                                            </View>

                                            <View style={{ width: 120 }}>
                                                <Text style={{ fontSize: 12, color: '#334155', fontWeight: '600' }}>
                                                    {totalQty}
                                                </Text>
                                            </View>

                                            <View style={{ width: 120 }}>
                                                <Text style={{ fontSize: 12, color: '#334155', fontWeight: '600' }}>
                                                    {compQty}
                                                </Text>
                                            </View>

                                            <View style={{ width: 100 }}>
                                                <Text style={{ fontSize: 12, color: '#334155', fontWeight: '600' }}>
                                                    {rate}
                                                </Text>
                                            </View>

                                            <View style={{ width: 120 }}>
                                                <Text style={{ fontSize: 12, color: '#334155', fontWeight: '700' }}>
                                                    {totalAmount}
                                                </Text>
                                            </View>

                                            <View style={{ width: 120 }}>
                                                <View style={{
                                                    alignSelf: 'flex-start',
                                                    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20,
                                                    backgroundColor: isCompleted ? '#DCFCE7' : isInProgress ? '#DBEAFE' : '#FEF3C7',
                                                    borderWidth: 1,
                                                    borderColor: isCompleted ? '#86EFAC' : isInProgress ? '#93C5FD' : '#FDE68A',
                                                }}>
                                                    <Text style={{
                                                        fontSize: 11, fontWeight: '700',
                                                        color: isCompleted ? '#15803D' : isInProgress ? '#1D4ED8' : '#D97706'
                                                    }}>
                                                        {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Assigned'}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={{ width: 50, alignItems: 'flex-end' }}>
                                                <TouchableOpacity onPress={() => { setSelectedWo(wo); setViewModalVisible(true); }}>
                                                    <Eye size={16} color="#94A3B8" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </View>
                    </ScrollView>

                    {/* Integrated Footer Pagination */}
                    <View style={{ backgroundColor: '#fff', padding: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={{ fontSize: 12, color: '#64748B' }}>Records per page:</Text>
                            <View style={{ width: 75 }}>
                                <FloatingDropdown
                                    displayValue={String(limit)}
                                    placeholder="10"
                                    isOpen={limitDropdownOpen}
                                    onToggle={() => setLimitDropdownOpen(v => !v)}
                                    onClose={() => setLimitDropdownOpen(false)}
                                >
                                    {(close) => (
                                        <ScrollView style={{ maxHeight: 160 }}>
                                            {[10, 20, 50, 100].map(lim => (
                                                <TouchableOpacity
                                                    key={lim}
                                                    onPress={() => { setLimit(lim); setPage(1); close(); }}
                                                    style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}
                                                >
                                                    <Text style={{ fontSize: 12, color: limit === lim ? '#2563EB' : '#334155', fontWeight: limit === lim ? '700' : '400' }}>
                                                        {lim}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    )}
                                </FloatingDropdown>
                            </View>
                        </View>

                        <Text style={{ fontSize: 12, color: '#64748B' }}>
                            Showing {filteredWos.length > 0 ? (page - 1) * limit + 1 : 0} - {Math.min(page * limit, filteredWos.length)} of {filteredWos.length} records
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <TouchableOpacity
                                disabled={page === 1}
                                onPress={() => setPage(p => Math.max(1, p - 1))}
                                style={{ width: 30, height: 30, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}
                            >
                                <ChevronLeft size={14} color="#64748B" />
                            </TouchableOpacity>

                            {getPageNumbers(page, totalPages).map((pNum, index) => {
                                if (pNum === '...') {
                                    return (
                                        <Text key={`ellipsis-${index}`} style={{ fontSize: 11, color: '#94A3B8', paddingHorizontal: 2 }}>...</Text>
                                    );
                                }
                                const num = pNum as number;
                                const isSelected = page === num;
                                return (
                                    <TouchableOpacity
                                        key={`page-${num}`}
                                        onPress={() => setPage(num)}
                                        style={{
                                            width: 30, height: 30, borderRadius: 6,
                                            backgroundColor: isSelected ? '#2563EB' : '#fff',
                                            borderWidth: isSelected ? 0 : 1, borderColor: '#E2E8F0',
                                            alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        <Text style={{ fontSize: 12, fontWeight: '700', color: isSelected ? '#fff' : '#64748B' }}>
                                            {num}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}

                            <TouchableOpacity
                                disabled={page >= totalPages}
                                onPress={() => setPage(p => Math.min(totalPages, p + 1))}
                                style={{ width: 30, height: 30, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', opacity: page >= totalPages ? 0.4 : 1 }}
                            >
                                <ChevronRight size={14} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* ── CREATE / EDIT WORK ORDER MODAL ───────────────────────── */}
            <Modal visible={formModalVisible} transparent animationType="slide" onRequestClose={() => setFormModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 16 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, maxHeight: '85%', overflow: 'hidden' }}>
                        <View style={{ backgroundColor: '#2563EB', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>{editId ? 'Edit Work Order' : 'Create Work Order'}</Text>
                            <TouchableOpacity onPress={() => setFormModalVisible(false)}>
                                <X size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 16 }}>
                            <FormToastBanner visible={formToastVisible} message={formToastMsg} type={formToastType} />

                            <View style={{ marginBottom: 12 }}>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>Work Order Number <Text style={{ color: '#EF4444' }}>*</Text></Text>
                                <TextInput
                                    style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, fontSize: 13, color: '#0F172A' }}
                                    placeholder="e.g. WO013"
                                    placeholderTextColor="#94A3B8"
                                    value={formData.work_order_no}
                                    onChangeText={t => setFormData(p => ({ ...p, work_order_no: t }))}
                                />
                            </View>

                            <View style={{ marginBottom: 12 }}>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>Work Description <Text style={{ color: '#EF4444' }}>*</Text></Text>
                                <TextInput
                                    style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, fontSize: 13, color: '#0F172A' }}
                                    placeholder="e.g. RCC Slab Work"
                                    placeholderTextColor="#94A3B8"
                                    value={formData.description}
                                    onChangeText={t => setFormData(p => ({ ...p, description: t }))}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                                <View style={{ flex: 1.5 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>Total Quantity <Text style={{ color: '#EF4444' }}>*</Text></Text>
                                    <TextInput
                                        style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, fontSize: 13, color: '#0F172A' }}
                                        placeholder="e.g. 500"
                                        placeholderTextColor="#94A3B8"
                                        keyboardType="numeric"
                                        value={formData.total_quantity}
                                        onChangeText={t => setFormData(p => ({ ...p, total_quantity: t }))}
                                    />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>Unit</Text>
                                    <TextInput
                                        style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, fontSize: 13, color: '#0F172A' }}
                                        placeholder="SQM, CUM"
                                        placeholderTextColor="#94A3B8"
                                        value={formData.unit}
                                        onChangeText={t => setFormData(p => ({ ...p, unit: t }))}
                                    />
                                </View>
                            </View>

                            <View style={{ marginBottom: 12 }}>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>Rate</Text>
                                <TextInput
                                    style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, fontSize: 13, color: '#0F172A' }}
                                    placeholder="e.g. 100"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="numeric"
                                    value={formData.rate}
                                    onChangeText={t => setFormData(p => ({ ...p, rate: t }))}
                                />
                            </View>

                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>Status</Text>
                                <FloatingDropdown
                                    displayValue={formData.status}
                                    placeholder="Select Status"
                                    isOpen={formStatusOpen}
                                    onToggle={() => setFormStatusOpen(v => !v)}
                                    onClose={() => setFormStatusOpen(false)}
                                >
                                    {(close) => (
                                        <ScrollView style={{ maxHeight: 180 }}>
                                            {['Assigned', 'In Progress', 'Completed'].map(st => (
                                                <TouchableOpacity key={st} onPress={() => { setFormData(p => ({ ...p, status: st })); close(); }} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                                                    <Text style={{ fontSize: 12, color: '#334155' }}>{st}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    )}
                                </FloatingDropdown>
                            </View>

                            <TouchableOpacity
                                onPress={handleSaveWorkOrder}
                                style={{ backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>{editId ? 'Save Changes' : 'Create Work Order'}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ── VIEW WORK ORDER DETAIL MODAL ─────────────────────────── */}
            <Modal visible={viewModalVisible} transparent animationType="fade" onRequestClose={() => setViewModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 16 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' }}>
                        <View style={{ backgroundColor: '#2563EB', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>Work Order Details</Text>
                            <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                                <X size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {selectedWo && (
                            <View style={{ padding: 16 }}>
                                <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 2 }}>{selectedWo.work_order_no}</Text>
                                <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>{selectedWo.description}</Text>

                                <View style={{ backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, gap: 8, marginBottom: 16 }}>
                                    <Text style={{ fontSize: 12, color: '#64748B' }}>Total Amount: <Text style={{ fontWeight: '800', color: '#2563EB' }}>{selectedWo.total_amount || (selectedWo.total_quantity * selectedWo.rate)}</Text></Text>
                                    <Text style={{ fontSize: 12, color: '#64748B' }}>Rate: <Text style={{ fontWeight: '700', color: '#0F172A' }}>{selectedWo.rate}</Text></Text>
                                    <Text style={{ fontSize: 12, color: '#64748B' }}>Total Quantity: <Text style={{ fontWeight: '700', color: '#0F172A' }}>{selectedWo.total_quantity}</Text></Text>
                                    <Text style={{ fontSize: 12, color: '#64748B' }}>Completed Quantity: <Text style={{ fontWeight: '700', color: '#16A34A' }}>{selectedWo.completed_quantity || 0}</Text></Text>
                                    <Text style={{ fontSize: 12, color: '#64748B' }}>Status: <Text style={{ fontWeight: '700', color: '#2563EB' }}>{selectedWo.status}</Text></Text>
                                </View>

                                <TouchableOpacity onPress={() => setViewModalVisible(false)} style={{ backgroundColor: '#F1F5F9', paddingVertical: 10, borderRadius: 8, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#334155' }}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>

        </View>
    );
}
