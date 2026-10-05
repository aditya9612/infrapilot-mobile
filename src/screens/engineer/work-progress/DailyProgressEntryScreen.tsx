import { useNavigation } from 'expo-router';
import {
    Activity, AlertTriangle, BarChart2, CheckCircle, ChevronDown, ChevronLeft, ChevronRight,
    Edit3, Eye, FileSpreadsheet, FileText, Plus, RefreshCw, Search, X, Calendar, Briefcase,
    AlertCircle, Trash2, Clock, CheckCircle2, Box, Layers, Play, TrendingUp, Info, Hourglass, Package, CheckSquare
} from 'lucide-react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    Linking, ActivityIndicator, Image, Modal, ScrollView, Text, TextInput,
    TouchableOpacity, View, Dimensions, Animated, Pressable, Platform, RefreshControl, useWindowDimensions
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as FileSystem from 'expo-file-system/legacy';
import TopHeader from '../../../components/TopHeader';
import { useProjectContext } from '../../../contexts/ProjectContext';
import { workProgressService } from '../../../services/workProgressService';
import { getAuthToken, loadAuthToken } from '../../../services/api';
import type { DailyProgressItem, CreateDailyProgressRequest, ActivityItem } from '../../../types/workProgress';

// ─── Date Utilities ────────────────────────────────────────────────────────────
const toDisplay = (iso?: string) => {
    if (!iso) return '-';
    if (iso.includes(',')) return iso;
    if (iso.includes('T')) {
        const [datePart, timePart] = iso.split('T');
        const [y, m, d] = datePart.split('-');
        if (y && m && d) {
            return `${d}-${m}-${y} ${timePart ? timePart.substring(0, 8) : ''}`.trim();
        }
    }
    const parts = iso.split('-');
    if (parts.length === 3) {
        const [y, m, d] = parts;
        return `${d}-${m}-${y}`;
    }
    return iso;
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
            {label ? (
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>
                    {label} {required && <Text style={{ color: '#EF4444' }}>*</Text>}
                </Text>
            ) : null}
            <TouchableOpacity
                onPress={() => setActiveKey(isOpen ? null : openKey)}
                style={{
                    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8,
                    paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    minWidth: 130
                }}
            >
                <Text style={{ fontSize: 12, color: value ? '#0F172A' : '#94A3B8', fontWeight: value ? '600' : '400' }}>
                    {value ? toDisplay(value) : 'DD-MM-YYYY'}
                </Text>
                <Calendar size={14} color="#64748B" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            {isOpen && (
                <View style={{ position: 'absolute', top: 42, left: 0, zIndex: 10000 }}>
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
    displayValue, placeholder, isOpen, onToggle, onClose, children, style
}: {
    displayValue: string; placeholder: string; isOpen: boolean;
    onToggle: () => void; onClose: () => void;
    children: (close: () => void) => React.ReactNode;
    style?: any;
}) {
    const triggerRef = useRef<any>(null);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

    const handleOpen = () => {
        if (triggerRef.current) {
            triggerRef.current.measureInWindow((x: number, y: number, w: number, h: number) => {
                setPos({ top: y + h + 4, left: Math.max(10, x), width: Math.max(w, 160) });
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
                style={[{
                    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
                    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7,
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }, style]}
            >
                <Text style={{ fontSize: 11, color: displayValue ? '#0F172A' : '#94A3B8', fontWeight: displayValue ? '700' : '500' }} numberOfLines={1}>
                    {displayValue || placeholder}
                </Text>
                <ChevronDown size={14} color="#64748B" style={{ marginLeft: 4 }} />
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

// ─── Records Per Page Dropdown ────────────────────────────────────────────────
function RecordsPerPageDropdown({
    value, onChange
}: {
    value: number; onChange: (limit: number) => void;
}) {
    const [open, setOpen] = useState(false);
    return (
        <FloatingDropdown
            displayValue={String(value)}
            placeholder="10"
            isOpen={open}
            onToggle={() => setOpen(v => !v)}
            onClose={() => setOpen(false)}
            style={{ paddingHorizontal: 8, paddingVertical: 4, height: 30, minWidth: 60 }}
        >
            {(close) => (
                <View style={{ padding: 4 }}>
                    {[5, 10, 20, 50].map(opt => (
                        <TouchableOpacity
                            key={opt}
                            onPress={() => {
                                onChange(opt);
                                close();
                            }}
                            style={{
                                paddingVertical: 6, paddingHorizontal: 12,
                                backgroundColor: value === opt ? '#EFF6FF' : 'transparent',
                                borderRadius: 6
                            }}
                        >
                            <Text style={{ fontSize: 11, fontWeight: value === opt ? '700' : '400', color: value === opt ? '#2563EB' : '#0F172A' }}>
                                {opt}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </FloatingDropdown>
    );
}

// ─── Shared Pagination Footer Component ───────────────────────────────────────
function PaginationFooter({
    currentPage,
    totalPages,
    totalRecords,
    pageSize,
    onPageChange,
    onPageSizeChange
}: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    pageSize: number;
    onPageChange: (p: number) => void;
    onPageSizeChange: (s: number) => void;
}) {
    const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalRecords);

    return (
        <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#FAFAFA',
            borderTopWidth: 1, borderTopColor: '#E2E8F0', flexWrap: 'wrap', gap: 10
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 11, color: '#64748B' }}>Records per page:</Text>
                <RecordsPerPageDropdown value={pageSize} onChange={onPageSizeChange} />
            </View>

            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '500' }}>
                Showing {startRecord} - {endRecord} of {totalRecords} records
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <TouchableOpacity
                    disabled={currentPage === 1}
                    onPress={() => onPageChange(Math.max(1, currentPage - 1))}
                    style={{
                        padding: 5, borderRadius: 6,
                        backgroundColor: currentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                        borderWidth: 1, borderColor: currentPage === 1 ? '#E2E8F0' : '#CBD5E1',
                        opacity: currentPage === 1 ? 0.5 : 1
                    }}
                >
                    <ChevronLeft size={14} color={currentPage === 1 ? '#94A3B8' : '#334155'} />
                </TouchableOpacity>

                <View style={{
                    minWidth: 26, height: 26, borderRadius: 6,
                    backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center',
                    paddingHorizontal: 6
                }}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{currentPage}</Text>
                </View>

                <TouchableOpacity
                    disabled={currentPage >= totalPages}
                    onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    style={{
                        padding: 5, borderRadius: 6,
                        backgroundColor: currentPage >= totalPages ? '#F1F5F9' : '#FFFFFF',
                        borderWidth: 1, borderColor: currentPage >= totalPages ? '#E2E8F0' : '#CBD5E1',
                        opacity: currentPage >= totalPages ? 0.5 : 1
                    }}
                >
                    <ChevronRight size={14} color={currentPage >= totalPages ? '#94A3B8' : '#334155'} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const TABS = [
    'ALL DAILY ENTRIES',
    'TODAY\'S PROGRESS',
    'PROJECT SUMMARY',
    'ACTIVITY HISTORY',
    'DELAY REPORT'
];

export default function DailyProgressEntryScreen() {
    const { activeProjectId, activeProjectName, projects, setActiveProject } = useProjectContext();
    const { width: windowWidth } = useWindowDimensions();
    const isMobile = windowWidth < 768;

    const [activeTab, setActiveTab] = useState(TABS[0]);

    // Selected Project Filter
    const [selectedProjectId, setSelectedProjectId] = useState<number | string | null>(activeProjectId);

    useEffect(() => {
        if (activeProjectId) {
            setSelectedProjectId(activeProjectId);
        }
    }, [activeProjectId]);

    // Data State
    const [entries, setEntries] = useState<DailyProgressItem[]>([]);
    const [todayEntries, setTodayEntries] = useState<DailyProgressItem[]>([]);
    const [historyEntries, setHistoryEntries] = useState<any[]>([]);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [projectSummary, setProjectSummary] = useState<any>(null);
    const [delayedActivities, setDelayedActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterActivity, setFilterActivity] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Pagination State per Tab
    const [pageMap, setPageMap] = useState<Record<string, number>>({
        'ALL DAILY ENTRIES': 1,
        "TODAY'S PROGRESS": 1,
        'ACTIVITY HISTORY': 1,
        'DELAY REPORT': 1,
    });

    const [pageSizeMap, setPageSizeMap] = useState<Record<string, number>>({
        'ALL DAILY ENTRIES': 10,
        "TODAY'S PROGRESS": 10,
        'ACTIVITY HISTORY': 10,
        'DELAY REPORT': 10,
    });

    // Helper functions to handle pagination per tab
    const getPage = (tab: string) => pageMap[tab] || 1;
    const getPageSize = (tab: string) => pageSizeMap[tab] || 10;

    const setPageForTab = (tab: string, page: number) => {
        setPageMap(prev => ({ ...prev, [tab]: page }));
    };

    const setPageSizeForTab = (tab: string, size: number) => {
        setPageSizeMap(prev => ({ ...prev, [tab]: size }));
        setPageMap(prev => ({ ...prev, [tab]: 1 }));
    };

    // Pickers
    const [formActOpen, setFormActOpen] = useState(false);
    const [projPickerOpen, setProjPickerOpen] = useState(false);
    const [actFilterOpen, setActFilterOpen] = useState(false);
    const [statusFilterOpen, setStatusFilterOpen] = useState(false);
    const [activeDatePicker, setActiveDatePicker] = useState<string | null>(null);

    // Modals
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

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

    // Error Toast
    const [topErrorToastVisible, setTopErrorToastVisible] = useState(false);
    const [topErrorToastMsg, setTopErrorToastMsg] = useState('');
    const showTopErrorToast = (msg: string) => {
        setTopErrorToastMsg(msg);
        setTopErrorToastVisible(true);
        setTimeout(() => setTopErrorToastVisible(false), 5000);
    };

    const [formSubmittedAttempted, setFormSubmittedAttempted] = useState(false);
    const [formValidationBannerVisible, setFormValidationBannerVisible] = useState(false);

    const getMissingDsrFields = (actId: string, eDate: string, qDone: string) => {
        const missing: string[] = [];
        if (!actId) missing.push('Target Activity');
        if (!eDate) missing.push('Entry Date');
        if (!qDone || isNaN(Number(qDone)) || Number(qDone) <= 0) missing.push('Quantity Completed Today');
        return missing;
    };

    const updateDsrValidationState = (actId: string, eDate: string, qDone: string) => {
        if (!formSubmittedAttempted) return;
        const missing = getMissingDsrFields(actId, eDate, qDone);
        if (missing.length === 0) {
            setFormValidationBannerVisible(false);
            setTopErrorToastVisible(false);
        } else {
            setFormValidationBannerVisible(true);
            showTopErrorToast(`Please fill in all mandatory details correctly.\nMissing: ${missing.join(', ')}`);
        }
    };

    const renderTopErrorToast = () => {
        if (!topErrorToastVisible) return null;

        const lines = topErrorToastMsg.split('\n');
        const mainTitle = lines[0] || 'Please fill in all mandatory details correctly.';
        const subTitle = lines.length > 1 ? lines.slice(1).join(' ') : '';

        return (
            <View
                pointerEvents="box-none"
                style={{
                    position: 'absolute',
                    top: 12,
                    right: 16,
                    left: 16,
                    zIndex: 9999999,
                    elevation: 9999,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.18,
                    shadowRadius: 16,
                }}
            >
                <View
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 14,
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: 12,
                        borderWidth: 1,
                        borderColor: '#E2E8F0',
                    }}
                >
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                        <X size={13} color="#FFFFFF" strokeWidth={3} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A', lineHeight: 18 }}>
                            {mainTitle}
                        </Text>
                        {Boolean(subTitle) && (
                            <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748B', marginTop: 2 }}>
                                {subTitle}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity onPress={() => setTopErrorToastVisible(false)} style={{ padding: 4 }}>
                        <X size={16} color="#94A3B8" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // Form Data State
    const [formData, setFormData] = useState({
        activity_id: '',
        entry_date: new Date().toISOString().split('T')[0],
        quantity_done: '',
        remarks: ''
    });

    const loadData = async (targetPid?: number | string | null) => {
        const pidToFetch = targetPid !== undefined ? targetPid : selectedProjectId;
        if (!pidToFetch) return;
        setLoading(true);
        try {
            const [actsRes, entRes, todayRes, histRes, sumRes, delRes] = await Promise.all([
                workProgressService.getActivities(pidToFetch).catch(() => null),
                workProgressService.getDailyEntries(pidToFetch).catch(() => null),
                workProgressService.getTodayProgress(pidToFetch).catch(() => null),
                workProgressService.getProgressHistory(pidToFetch).catch(() => null),
                workProgressService.getProjectSummary(pidToFetch).catch(() => null),
                workProgressService.getDelayedActivities(pidToFetch).catch(() => null),
            ]);

            const rawActs = Array.isArray(actsRes?.data) ? actsRes.data : (Array.isArray(actsRes) ? actsRes : (actsRes?.items || []));
            const rawEnts = Array.isArray(entRes?.data) ? entRes.data : (Array.isArray(entRes) ? entRes : (entRes?.items || []));
            const rawToday = Array.isArray(todayRes?.data) ? todayRes.data : (Array.isArray(todayRes) ? todayRes : (todayRes?.items || []));

            // Extract history array from { message, history, pagination }
            const rawHist = histRes?.history || (Array.isArray(histRes?.data) ? histRes.data : (Array.isArray(histRes) ? histRes : (histRes?.items || [])));

            // Extract delayed activities array from { success, data }
            const rawDel = Array.isArray(delRes?.data) ? delRes.data : (Array.isArray(delRes) ? delRes : (delRes?.items || []));

            setActivities(rawActs);
            setEntries(rawEnts);
            setTodayEntries(rawToday);
            setHistoryEntries(rawHist);
            setProjectSummary(sumRes);
            setDelayedActivities(rawDel);
        } catch (error) {
            console.error('Error loading daily progress data:', error);
            showToast('Failed to refresh data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let pidToUse = selectedProjectId || activeProjectId;
        if (!pidToUse && projects && projects.length > 0) {
            pidToUse = projects[0].id ?? (projects[0] as any).project_id;
            setSelectedProjectId(pidToUse);
        }
        if (pidToUse) {
            loadData(pidToUse);
        }
    }, [selectedProjectId, activeProjectId, projects]);

    const handleCreateEntry = async () => {
        const selectedAct = activities.find(a => String(a.id) === String(formData.activity_id));
        const remQty = Number(selectedAct?.remaining_quantity ?? selectedAct?.planned_quantity ?? 100);

        // Check if remaining quantity is 0
        if (remQty <= 0) {
            showTopErrorToast("Today's progress quantity is not available for this activity.");
            return;
        }

        const missing = getMissingDsrFields(formData.activity_id, formData.entry_date, formData.quantity_done);

        if (missing.length > 0) {
            setFormSubmittedAttempted(true);
            setFormValidationBannerVisible(true);
            showTopErrorToast(`Please fill in all mandatory details correctly.\nMissing: ${missing.join(', ')}`);
            return;
        }

        try {
            const payload: CreateDailyProgressRequest = {
                project_id: selectedProjectId || activeProjectId || 1,
                activity_id: Number(formData.activity_id),
                entry_date: formData.entry_date,
                quantity_done: Number(formData.quantity_done),
                remarks: formData.remarks
            };

            await workProgressService.createDailyEntry(payload);
            showToast('Daily progress logged successfully!', 'success');
            setAddModalVisible(false);
            setFormData({
                activity_id: '',
                entry_date: new Date().toISOString().split('T')[0],
                quantity_done: '',
                remarks: ''
            });
            setFormSubmittedAttempted(false);
            setFormValidationBannerVisible(false);
            loadData();
        } catch (error) {
            showToast('Failed to log daily progress', 'error');
        }
    };

    const handleDeleteEntry = async (id: number | string) => {
        try {
            await workProgressService.deleteDailyEntry(id);
            showToast('Daily progress entry deleted!', 'success');
            loadData();
        } catch (error) {
            showToast('Failed to delete entry', 'error');
        }
    };

    // Filter functions per dataset
    const getFilteredEntries = () => {
        return entries.filter(item => {
            const name = item.activity_name || '';
            const remarks = item.remarks || '';
            const matchesSearch = searchQuery === '' ||
                name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                remarks.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDate = !filterDate || (item.entry_date || '').startsWith(filterDate);
            const matchesActivity = !filterActivity || name === filterActivity;
            const matchesStatus = !filterStatus || item.status === filterStatus;

            return matchesSearch && matchesDate && matchesActivity && matchesStatus;
        });
    };

    const getFilteredTodayEntries = () => {
        const sourceList = todayEntries;
        return sourceList.filter(item => {
            const name = item.activity_name || (item as any).name || '';
            const remarks = item.remarks || '';
            return searchQuery === '' ||
                name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                remarks.toLowerCase().includes(searchQuery.toLowerCase());
        });
    };

    const getFilteredHistory = () => {
        return historyEntries.filter(item => {
            const actName = item.activity_name || item.activity || '';
            const remarks = item.remarks || '';
            const matchesSearch = searchQuery === '' ||
                actName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                remarks.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesActivity = !filterActivity || actName.toLowerCase() === filterActivity.toLowerCase();
            return matchesSearch && matchesActivity;
        });
    };

    const getFilteredDelay = () => {
        return delayedActivities.filter(item => {
            const actName = item.activity_name || item.activity || item.name || '';
            const remarks = item.remarks || '';
            return searchQuery === '' ||
                actName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                remarks.toLowerCase().includes(searchQuery.toLowerCase());
        });
    };

    const currentProjObj = projects.find(p => String(p.id || (p as any).project_id) === String(selectedProjectId));
    const currentProjName = currentProjObj?.name || (currentProjObj as any)?.project_name || activeProjectName || 'Metro City';

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <TopHeader
                title="Daily Work Progress"
                subtitle={`Engineer > Work Progress > Daily Progress`}
            />

            {/* Global Toast */}
            {toastVisible && (
                <View style={{
                    position: 'absolute', top: 70, left: 16, right: 16, zIndex: 9999,
                    backgroundColor: toastType === 'error' ? '#DC2626' : '#16A34A',
                    padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 8,
                    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 6
                }}>
                    <CheckCircle size={16} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700', flex: 1 }}>{toastMsg}</Text>
                </View>
            )}

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: isMobile ? 12 : 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={() => loadData()} colors={['#2563EB']} />
                }
            >

                {/* ── HEADER ACTIONS ROW ────────────────────────────────────── */}
                <View style={{ marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <View>
                        <Text style={{ fontSize: isMobile ? 18 : 20, fontWeight: '800', color: '#0F172A' }}>Daily Work Progress</Text>
                        <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Log and track daily execution activities on site.</Text>
                    </View>

                    {activeTab === 'ALL DAILY ENTRIES' && (
                        <TouchableOpacity
                            onPress={() => setAddModalVisible(true)}
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}
                        >
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Add Daily Progress</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* ── STAT CARDS ROW (CALCULATED FROM BACKEND DATASET) ───────── */}
                {activeTab === 'ALL DAILY ENTRIES' && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginBottom: 20 }}>
                        <View style={{ width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 4 }}>ALL LOGS</Text>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#0F172A' }}>{entries.length}</Text>
                            <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Total Entries</Text>
                        </View>

                        <View style={{ width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 4 }}>ON TRACK LOGS</Text>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#2563EB' }}>
                                {entries.filter(e => (e.status || '').toUpperCase() !== 'DELAY' && (e.status || '').toUpperCase() !== 'DELAYED').length}
                            </Text>
                            <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Performing as expected</Text>
                        </View>

                        <View style={{ width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 4 }}>COMPLETED LOGS</Text>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#16A34A' }}>
                                {entries.filter(e => (e.status || '').toUpperCase() === 'COMPLETED').length}
                            </Text>
                            <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>100% Progress</Text>
                        </View>
                    </ScrollView>
                )}

                {activeTab === "TODAY'S PROGRESS" && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginBottom: 20 }}>
                        <View style={{ width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 4 }}>ALL LOGS</Text>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#0F172A' }}>{todayEntries.length}</Text>
                            <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Total Entries</Text>
                        </View>

                        <View style={{ width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 4 }}>ON TRACK LOGS</Text>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#2563EB' }}>
                                {todayEntries.filter(e => (e.status || '').toUpperCase() !== 'DELAY' && (e.status || '').toUpperCase() !== 'DELAYED').length}
                            </Text>
                            <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Performing as expected</Text>
                        </View>

                        <View style={{ width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#16A34A', letterSpacing: 0.5, marginBottom: 4 }}>COMPLETED LOGS</Text>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#16A34A' }}>
                                {todayEntries.filter(e => (e.status || '').toUpperCase() === 'COMPLETED').length}
                            </Text>
                            <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>100% Progress</Text>
                        </View>
                    </ScrollView>
                )}

                {activeTab === 'ACTIVITY HISTORY' && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginBottom: 20 }}>
                        <View style={{ width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 4 }}>ALL HISTORY</Text>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#0F172A' }}>{historyEntries.length}</Text>
                            <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Complete Log</Text>
                        </View>

                        <View style={{ width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 4 }}>PROGRESS UPDATES</Text>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#2563EB' }}>{historyEntries.length}</Text>
                            <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Actual Progress Added</Text>
                        </View>
                    </ScrollView>
                )}

                {activeTab === 'DELAY REPORT' && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginBottom: 20 }}>
                        <View style={{ width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 4 }}>ALL DELAYED</Text>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#DC2626' }}>{delayedActivities.length}</Text>
                            <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Total Delayed</Text>
                        </View>

                        <View style={{ width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#FECDD3' }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#DC2626', letterSpacing: 0.5, marginBottom: 4 }}>CRITICAL (&lt; 25%)</Text>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#DC2626' }}>
                                {delayedActivities.filter(a => Number(a.completion_percentage ?? a.progress ?? 0) < 25).length}
                            </Text>
                            <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>High Risk</Text>
                        </View>

                        <View style={{ width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#FDE68A' }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#D97706', letterSpacing: 0.5, marginBottom: 4 }}>MODERATE (25% - 75%)</Text>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#D97706' }}>
                                {delayedActivities.filter(a => {
                                    const p = Number(a.completion_percentage ?? a.progress ?? 0);
                                    return p >= 25 && p <= 75;
                                }).length}
                            </Text>
                            <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>At Risk</Text>
                        </View>

                        <View style={{ width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#BBF7D0' }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#16A34A', letterSpacing: 0.5, marginBottom: 4 }}>ALMOST DONE (&gt; 75%)</Text>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#16A34A' }}>
                                {delayedActivities.filter(a => Number(a.completion_percentage ?? a.progress ?? 0) > 75).length}
                            </Text>
                            <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Near Completion</Text>
                        </View>
                    </ScrollView>
                )}

                {/* ── TABS UNDERLINE NAVIGATION STRIP ─────────────────────── */}
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#E2E8F0', marginBottom: 16 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', gap: 20 }}>
                            {TABS.map(tab => {
                                const isSelected = activeTab === tab;
                                return (
                                    <TouchableOpacity
                                        key={tab}
                                        onPress={() => setActiveTab(tab)}
                                        style={{
                                            paddingVertical: 10,
                                            borderBottomWidth: isSelected ? 2 : 0,
                                            borderBottomColor: '#2563EB',
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 12,
                                            fontWeight: isSelected ? '800' : '600',
                                            color: isSelected ? '#2563EB' : '#64748B'
                                        }}>
                                            {tab}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>

                {/* ── FILTER & SEARCH BAR FOR TAB CONTENT ─────────────────── */}
                {activeTab !== 'PROJECT SUMMARY' && (
                    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                            {/* Search Box */}
                            <View style={{ flex: 1, minWidth: 180, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 10, height: 36 }}>
                                <Search size={14} color="#94A3B8" />
                                <TextInput
                                    style={{ flex: 1, fontSize: 11, color: '#0F172A', marginLeft: 6 }}
                                    placeholder="Search by activity ref or BOQ identity..."
                                    placeholderTextColor="#94A3B8"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                            </View>

                            {/* Date Filter (Tab 1) */}
                            {activeTab === 'ALL DAILY ENTRIES' && (
                                <DatePickerField
                                    label=""
                                    value={filterDate}
                                    onChange={setFilterDate}
                                    openKey="filter_date"
                                    activeKey={activeDatePicker}
                                    setActiveKey={setActiveDatePicker}
                                />
                            )}

                            {/* Project Filter Dropdown (Lists all assigned projects from backend/context) */}
                            <FloatingDropdown
                                displayValue={`PROJECT: ${currentProjName}`}
                                placeholder="PROJECT: METRO CITY"
                                isOpen={projPickerOpen}
                                onToggle={() => setProjPickerOpen(v => !v)}
                                onClose={() => setProjPickerOpen(false)}
                            >
                                {(close) => (
                                    <ScrollView style={{ maxHeight: 200, padding: 6 }}>
                                        {projects.map(p => {
                                            const pId = p.id ?? (p as any).project_id;
                                            const pName = p.name || (p as any).project_name || 'Unnamed Project';
                                            const isSelected = String(pId) === String(selectedProjectId);
                                            return (
                                                <TouchableOpacity
                                                    key={pId}
                                                    onPress={() => {
                                                        setSelectedProjectId(pId);
                                                        setActiveProject(pId);
                                                        close();
                                                    }}
                                                    style={{
                                                        padding: 8,
                                                        backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                                                        borderRadius: 6,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: '#F1F5F9'
                                                    }}
                                                >
                                                    <Text style={{ fontSize: 11, fontWeight: isSelected ? '700' : '400', color: isSelected ? '#2563EB' : '#0F172A' }}>
                                                        {pName}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                )}
                            </FloatingDropdown>

                            {/* Activity Filter Dropdown (Lists project activities) */}
                            {(activeTab === 'ALL DAILY ENTRIES' || activeTab === 'ACTIVITY HISTORY') && (
                                <FloatingDropdown
                                    displayValue={filterActivity ? `ACT: ${filterActivity}` : 'ALL ACTIVITIES'}
                                    placeholder="ALL ACTIVITIES"
                                    isOpen={actFilterOpen}
                                    onToggle={() => setActFilterOpen(v => !v)}
                                    onClose={() => setActFilterOpen(false)}
                                >
                                    {(close) => (
                                        <ScrollView style={{ maxHeight: 180, padding: 6 }}>
                                            <TouchableOpacity onPress={() => { setFilterActivity(''); close(); }} style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                                                <Text style={{ fontSize: 11, color: filterActivity === '' ? '#2563EB' : '#64748B', fontWeight: filterActivity === '' ? '700' : '400' }}>All Activities</Text>
                                            </TouchableOpacity>
                                            {activities.map(a => {
                                                const aName = a.name || a.activity_name || '';
                                                const isSel = filterActivity === aName;
                                                return (
                                                    <TouchableOpacity key={a.id} onPress={() => { setFilterActivity(aName); close(); }} style={{ padding: 8, backgroundColor: isSel ? '#EFF6FF' : 'transparent', borderRadius: 6 }}>
                                                        <Text style={{ fontSize: 11, color: isSel ? '#2563EB' : '#0F172A', fontWeight: isSel ? '700' : '400' }}>{aName}</Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </ScrollView>
                                    )}
                                </FloatingDropdown>
                            )}

                            {/* Status Filter Dropdown */}
                            {activeTab === 'ALL DAILY ENTRIES' && (
                                <FloatingDropdown
                                    displayValue={filterStatus ? `STATUS: ${filterStatus}` : 'ALL STATUS'}
                                    placeholder="ALL STATUS"
                                    isOpen={statusFilterOpen}
                                    onToggle={() => setStatusFilterOpen(v => !v)}
                                    onClose={() => setStatusFilterOpen(false)}
                                >
                                    {(close) => (
                                        <View style={{ padding: 6 }}>
                                            <TouchableOpacity onPress={() => { setFilterStatus(''); close(); }} style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                                                <Text style={{ fontSize: 11, color: filterStatus === '' ? '#2563EB' : '#64748B', fontWeight: filterStatus === '' ? '700' : '400' }}>All Statuses</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { setFilterStatus('ON_TRACK'); close(); }} style={{ padding: 8 }}>
                                                <Text style={{ fontSize: 11, color: '#2563EB', fontWeight: filterStatus === 'ON_TRACK' ? '700' : '400' }}>ON_TRACK</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { setFilterStatus('COMPLETED'); close(); }} style={{ padding: 8 }}>
                                                <Text style={{ fontSize: 11, color: '#16A34A', fontWeight: filterStatus === 'COMPLETED' ? '700' : '400' }}>COMPLETED</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </FloatingDropdown>
                            )}
                        </View>
                    </View>
                )}

                {/* ── TAB 1: ALL DAILY ENTRIES ────────────────────────────── */}
                {activeTab === 'ALL DAILY ENTRIES' && (() => {
                    const filtered = getFilteredEntries();
                    const page = getPage('ALL DAILY ENTRIES');
                    const pageSize = getPageSize('ALL DAILY ENTRIES');
                    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
                    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

                    return (
                        <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <View style={{ minWidth: 680 }}>
                                    <View style={{ flexDirection: 'row', backgroundColor: '#F8FAFC', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
                                        <Text style={{ width: 160, fontSize: 10, fontWeight: '800', color: '#64748B' }}>ACTIVITY</Text>
                                        <Text style={{ width: 100, fontSize: 10, fontWeight: '800', color: '#64748B' }}>DATE</Text>
                                        <Text style={{ width: 120, fontSize: 10, fontWeight: '800', color: '#64748B' }}>PROGRESS ADDED</Text>
                                        <Text style={{ width: 120, fontSize: 10, fontWeight: '800', color: '#64748B' }}>REMARKS</Text>
                                        <Text style={{ width: 110, fontSize: 10, fontWeight: '800', color: '#64748B' }}>LOGGED AT</Text>
                                        <Text style={{ width: 70, fontSize: 10, fontWeight: '800', color: '#64748B', textAlign: 'right' }}>ACTIONS</Text>
                                    </View>

                                    {loading ? (
                                        <View style={{ padding: 40, alignItems: 'center' }}>
                                            <ActivityIndicator size="large" color="#2563EB" />
                                        </View>
                                    ) : filtered.length === 0 ? (
                                        <View style={{ padding: 24, width: 680 }}>
                                            <View style={{
                                                borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed',
                                                borderRadius: 12, paddingVertical: 40, paddingHorizontal: 20,
                                                alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA'
                                            }}>
                                                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                                                    <Info size={22} color="#94A3B8" />
                                                </View>
                                                <Text style={{ fontSize: 13, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 }}>FIELD REGISTRY EXHAUSTED</Text>
                                                <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, textAlign: 'center' }}>NO EXECUTION LOGS DISCOVERED FOR TODAY.</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        paginated.map((item, idx) => (
                                            <View key={item.id || idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                                                <Text style={{ width: 160, fontSize: 12, fontWeight: '700', color: '#0F172A' }} numberOfLines={1}>{item.activity_name || `Activity #${item.activity_id}`}</Text>
                                                <Text style={{ width: 100, fontSize: 11, color: '#64748B' }}>{toDisplay(item.entry_date)}</Text>
                                                <Text style={{ width: 120, fontSize: 12, fontWeight: '800', color: '#2563EB' }}>{item.quantity_done} {item.unit || 'Kg'}</Text>
                                                <Text style={{ width: 120, fontSize: 11, color: '#64748B' }} numberOfLines={1}>{item.remarks || '-'}</Text>
                                                <Text style={{ width: 110, fontSize: 11, color: '#64748B' }}>{toDisplay(item.created_at || item.entry_date)}</Text>
                                                <View style={{ width: 70, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                                                    <TouchableOpacity onPress={() => { setSelectedEntry(item); setViewModalVisible(true); }}>
                                                        <Eye size={14} color="#64748B" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => handleDeleteEntry(item.id)}>
                                                        <Trash2 size={14} color="#DC2626" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))
                                    )}
                                </View>
                            </ScrollView>

                            <PaginationFooter
                                currentPage={page}
                                totalPages={totalPages}
                                totalRecords={filtered.length}
                                pageSize={pageSize}
                                onPageChange={(p) => setPageForTab('ALL DAILY ENTRIES', p)}
                                onPageSizeChange={(s) => setPageSizeForTab('ALL DAILY ENTRIES', s)}
                            />
                        </View>
                    );
                })()}

                {/* ── TAB 2: TODAY'S PROGRESS ─────────────────────────────── */}
                {activeTab === "TODAY'S PROGRESS" && (() => {
                    const filtered = getFilteredTodayEntries();
                    const page = getPage("TODAY'S PROGRESS");
                    const pageSize = getPageSize("TODAY'S PROGRESS");
                    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
                    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

                    return (
                        <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <View style={{ minWidth: 640 }}>
                                    <View style={{ flexDirection: 'row', backgroundColor: '#F8FAFC', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
                                        <Text style={{ width: 160, fontSize: 10, fontWeight: '800', color: '#64748B' }}>ACTIVITY</Text>
                                        <Text style={{ width: 100, fontSize: 10, fontWeight: '800', color: '#64748B' }}>DATE</Text>
                                        <Text style={{ width: 130, fontSize: 10, fontWeight: '800', color: '#64748B' }}>PROGRESS ADDED</Text>
                                        <Text style={{ width: 120, fontSize: 10, fontWeight: '800', color: '#64748B' }}>REMARKS</Text>
                                        <Text style={{ width: 130, fontSize: 10, fontWeight: '800', color: '#64748B' }}>LOGGED AT</Text>
                                    </View>

                                    {loading ? (
                                        <View style={{ padding: 40, alignItems: 'center' }}>
                                            <ActivityIndicator size="large" color="#2563EB" />
                                        </View>
                                    ) : filtered.length === 0 ? (
                                        <View style={{ padding: 24, width: 640 }}>
                                            <View style={{ borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 30, alignItems: 'center', backgroundColor: '#FAFAFA' }}>
                                                <Info size={20} color="#94A3B8" />
                                                <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginTop: 6 }}>No logs recorded today for this project.</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        paginated.map((item: any, idx: number) => (
                                            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                                                <Text style={{ width: 160, fontSize: 12, fontWeight: '700', color: '#0F172A' }} numberOfLines={1}>{item.activity_name || item.name || 'mkmkmkmk'}</Text>
                                                <Text style={{ width: 100, fontSize: 11, color: '#64748B' }}>{toDisplay(item.entry_date)}</Text>
                                                <Text style={{ width: 130, fontSize: 12, fontWeight: '800', color: '#2563EB' }}>{item.quantity_done || item.today_progress || '70.00'} {item.unit || 'Kg'}</Text>
                                                <Text style={{ width: 120, fontSize: 11, color: '#64748B' }}>{item.remarks || '-'}</Text>
                                                <Text style={{ width: 130, fontSize: 11, color: '#64748B' }}>{toDisplay(item.created_at || item.entry_date)}</Text>
                                            </View>
                                        ))
                                    )}
                                </View>
                            </ScrollView>

                            <PaginationFooter
                                currentPage={page}
                                totalPages={totalPages}
                                totalRecords={filtered.length}
                                pageSize={pageSize}
                                onPageChange={(p) => setPageForTab("TODAY'S PROGRESS", p)}
                                onPageSizeChange={(s) => setPageSizeForTab("TODAY'S PROGRESS", s)}
                            />
                        </View>
                    );
                })()}

                {/* ── TAB 3: PROJECT SUMMARY (RESPONSIVE CARDS GRID) ───────── */}
                {activeTab === 'PROJECT SUMMARY' && (() => {
                    const summaryData = projectSummary?.summary || projectSummary || {};
                    const projectData = projectSummary?.project || {};

                    const projName = projectData?.project_name || currentProjName;
                    const overallProg = summaryData?.overall_progress_percentage !== undefined
                        ? `${summaryData.overall_progress_percentage}%`
                        : (summaryData?.overall_progress ? `${summaryData.overall_progress}%` : '0.00%');
                    const avgProg = summaryData?.average_activity_progress !== undefined
                        ? `${summaryData.average_activity_progress}%`
                        : (summaryData?.avg_activity_progress ? `${summaryData.avg_activity_progress}%` : '0.00%');

                    return (
                        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: isMobile ? 14 : 18, borderWidth: 1, borderColor: '#E2E8F0', gap: 20 }}>
                            {/* Section 1: PROJECT DETAILS */}
                            <View>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 10 }}>PROJECT DETAILS</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                    <View style={{ flex: 1, minWidth: isMobile ? '100%' : 160, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#94A3B8', marginBottom: 4 }}>PROJECT NAME</Text>
                                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{projName}</Text>
                                    </View>
                                    <View style={{ flex: 1, minWidth: isMobile ? '48%' : 160, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#94A3B8', marginBottom: 4 }}>OVERALL PROGRESS</Text>
                                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#2563EB' }}>{overallProg}</Text>
                                    </View>
                                    <View style={{ flex: 1, minWidth: isMobile ? '48%' : 160, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#94A3B8', marginBottom: 4 }}>AVG ACTIVITY PROGRESS</Text>
                                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#16A34A' }}>{avgProg}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Section 2: ACTIVITY METRICS */}
                            <View>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 10 }}>ACTIVITY METRICS</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                                    <View style={{ width: 100, backgroundColor: '#fff', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#E2E8F0' }}>
                                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#64748B', marginBottom: 2 }}>TOTAL</Text>
                                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{summaryData?.total_activities ?? 0}</Text>
                                    </View>

                                    <View style={{ width: 100, backgroundColor: '#ECFDF5', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#A7F3D0' }}>
                                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#059669', marginBottom: 2 }}>COMPLETED</Text>
                                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#059669' }}>
                                            {summaryData?.completed_activities ?? 0}
                                        </Text>
                                    </View>

                                    <View style={{ width: 100, backgroundColor: '#EFF6FF', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#BFDBFE' }}>
                                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#2563EB', marginBottom: 2 }}>ON TRACK</Text>
                                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#2563EB' }}>
                                            {summaryData?.on_track_activities ?? 0}
                                        </Text>
                                    </View>

                                    <View style={{ width: 100, backgroundColor: '#FEF2F2', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#FECDD3' }}>
                                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#DC2626', marginBottom: 2 }}>DELAYED</Text>
                                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#DC2626' }}>
                                            {summaryData?.delayed_activities ?? 0}
                                        </Text>
                                    </View>

                                    <View style={{ width: 100, backgroundColor: '#FEF3C7', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#FDE68A' }}>
                                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#D97706', marginBottom: 2 }}>NOT STARTED</Text>
                                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#D97706' }}>
                                            {summaryData?.not_started_activities ?? 0}
                                        </Text>
                                    </View>
                                </ScrollView>
                            </View>

                            {/* Section 3: QUANTITY METRICS */}
                            <View>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 10 }}>QUANTITY METRICS</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                    <View style={{ flex: 1, minWidth: isMobile ? '100%' : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <Text style={{ fontSize: 9, fontWeight: '800', color: '#94A3B8', marginBottom: 4 }}>PLANNED QUANTITY</Text>
                                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>{summaryData?.planned_quantity || '0.00'}</Text>
                                        </View>
                                        <Package size={22} color="#B45309" />
                                    </View>

                                    <View style={{ flex: 1, minWidth: isMobile ? '100%' : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <Text style={{ fontSize: 9, fontWeight: '800', color: '#94A3B8', marginBottom: 4 }}>COMPLETED QUANTITY</Text>
                                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>{summaryData?.completed_quantity || '0.00'}</Text>
                                        </View>
                                        <View style={{ width: 22, height: 22, borderRadius: 4, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' }}>
                                            <CheckSquare size={14} color="#fff" />
                                        </View>
                                    </View>

                                    <View style={{ flex: 1, minWidth: isMobile ? '100%' : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <Text style={{ fontSize: 9, fontWeight: '800', color: '#94A3B8', marginBottom: 4 }}>REMAINING QUANTITY</Text>
                                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>{summaryData?.remaining_quantity || '0.00'}</Text>
                                        </View>
                                        <Hourglass size={20} color="#F59E0B" />
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                })()}

                {/* ── TAB 4: ACTIVITY HISTORY (PARSED BACKEND API SCHEMA) ───── */}
                {activeTab === 'ACTIVITY HISTORY' && (() => {
                    const filtered = getFilteredHistory();
                    const page = getPage('ACTIVITY HISTORY');
                    const pageSize = getPageSize('ACTIVITY HISTORY');
                    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
                    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

                    return (
                        <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <View style={{ minWidth: 680 }}>
                                    <View style={{ flexDirection: 'row', backgroundColor: '#F8FAFC', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
                                        <Text style={{ width: 140, fontSize: 10, fontWeight: '800', color: '#64748B' }}>DATE & TIME</Text>
                                        <Text style={{ width: 150, fontSize: 10, fontWeight: '800', color: '#64748B' }}>ACTIVITY</Text>
                                        <Text style={{ width: 130, fontSize: 10, fontWeight: '800', color: '#64748B' }}>PROGRESS ADDED</Text>
                                        <Text style={{ width: 130, fontSize: 10, fontWeight: '800', color: '#64748B' }}>TOTAL COMPLETED</Text>
                                        <Text style={{ width: 130, fontSize: 10, fontWeight: '800', color: '#64748B' }}>REMAINING QUANTITY</Text>
                                    </View>

                                    {loading ? (
                                        <View style={{ padding: 40, alignItems: 'center' }}>
                                            <ActivityIndicator size="large" color="#2563EB" />
                                        </View>
                                    ) : filtered.length === 0 ? (
                                        <View style={{ padding: 24, width: 680 }}>
                                            <View style={{ borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 30, alignItems: 'center', backgroundColor: '#FAFAFA' }}>
                                                <Info size={20} color="#94A3B8" />
                                                <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginTop: 6 }}>No history logs found for this project.</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        paginated.map((item: any, idx: number) => {
                                            const actName = item.activity_name || item.activity || 'Activity Entry';
                                            const dateTimeStr = toDisplay(item.created_at || item.entry_date);
                                            const progAdded = item.today_progress ? `${item.today_progress} ${item.unit || 'Kg'}` : (item.progress_added || '0.00 Kg');
                                            const runningTot = item.running_total ? `${item.running_total} ${item.unit || 'Kg'}` : (item.total_completed || '0.00 Kg');
                                            const remQty = item.remaining_quantity ? `${item.remaining_quantity} ${item.unit || 'Kg'}` : '0.00 Kg';

                                            return (
                                                <View key={item.id || idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                                                    <Text style={{ width: 140, fontSize: 11, color: '#64748B' }}>{dateTimeStr}</Text>
                                                    <Text style={{ width: 150, fontSize: 12, fontWeight: '700', color: '#0F172A' }} numberOfLines={1}>{actName}</Text>
                                                    <View style={{ width: 130, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                        <TrendingUp size={12} color="#2563EB" />
                                                        <Text style={{ fontSize: 12, fontWeight: '800', color: '#2563EB' }}>{progAdded}</Text>
                                                    </View>
                                                    <Text style={{ width: 130, fontSize: 11, color: '#0F172A', fontWeight: '600' }}>{runningTot}</Text>
                                                    <Text style={{ width: 130, fontSize: 11, color: '#64748B' }}>{remQty}</Text>
                                                </View>
                                            );
                                        })
                                    )}
                                </View>
                            </ScrollView>

                            <PaginationFooter
                                currentPage={page}
                                totalPages={totalPages}
                                totalRecords={filtered.length}
                                pageSize={pageSize}
                                onPageChange={(p) => setPageForTab('ACTIVITY HISTORY', p)}
                                onPageSizeChange={(s) => setPageSizeForTab('ACTIVITY HISTORY', s)}
                            />
                        </View>
                    );
                })()}

                {/* ── TAB 5: DELAY REPORT (PARSED BACKEND API SCHEMA) ─────────── */}
                {activeTab === 'DELAY REPORT' && (() => {
                    const filtered = getFilteredDelay();
                    const page = getPage('DELAY REPORT');
                    const pageSize = getPageSize('DELAY REPORT');
                    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
                    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

                    return (
                        <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <View style={{ minWidth: 720 }}>
                                    <View style={{ flexDirection: 'row', backgroundColor: '#F8FAFC', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
                                        <Text style={{ width: 140, fontSize: 10, fontWeight: '800', color: '#64748B' }}>ACTIVITY</Text>
                                        <Text style={{ width: 90, fontSize: 10, fontWeight: '800', color: '#64748B' }}>STATUS</Text>
                                        <Text style={{ width: 100, fontSize: 10, fontWeight: '800', color: '#64748B' }}>PROGRESS (%)</Text>
                                        <Text style={{ width: 130, fontSize: 10, fontWeight: '800', color: '#64748B' }}>COMPLETED / PLANNED</Text>
                                        <Text style={{ width: 90, fontSize: 10, fontWeight: '800', color: '#64748B' }}>REMAINING</Text>
                                        <Text style={{ width: 85, fontSize: 10, fontWeight: '800', color: '#64748B' }}>START DATE</Text>
                                        <Text style={{ width: 85, fontSize: 10, fontWeight: '800', color: '#64748B' }}>END DATE</Text>
                                    </View>

                                    {loading ? (
                                        <View style={{ padding: 40, alignItems: 'center' }}>
                                            <ActivityIndicator size="large" color="#2563EB" />
                                        </View>
                                    ) : filtered.length === 0 ? (
                                        <View style={{ padding: 24, width: 720 }}>
                                            <View style={{ borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 30, alignItems: 'center', backgroundColor: '#FAFAFA' }}>
                                                <CheckCircle size={20} color="#16A34A" />
                                                <Text style={{ fontSize: 12, fontWeight: '700', color: '#16A34A', marginTop: 6 }}>No delayed activities for this project.</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        paginated.map((item: any, idx: number) => {
                                            const actName = item.activity_name || item.activity || item.name || 'Delayed Activity';
                                            const statusTxt = item.status || 'DELAY';
                                            const isDelay = statusTxt.toUpperCase() === 'DELAY' || statusTxt.toUpperCase() === 'DELAYED';
                                            const isTrack = statusTxt.toUpperCase() === 'ON_TRACK' || statusTxt.toUpperCase() === 'IN_PROGRESS';
                                            const isNotStarted = statusTxt.toUpperCase() === 'NOT_STARTED';
                                            const isComp = statusTxt.toUpperCase() === 'COMPLETED';

                                            const progPct = item.completion_percentage !== undefined ? `${Number(item.completion_percentage).toFixed(2)}%` : (item.progress || '0.00%');
                                            const compPlanStr = item.completed_quantity !== undefined && item.planned_quantity !== undefined ? `${item.completed_quantity} / ${item.planned_quantity}` : (item.comp_plan || '0 / 100.00');
                                            const remQtyStr = item.remaining_quantity !== undefined ? String(item.remaining_quantity) : (item.remaining || '100.00');

                                            return (
                                                <View key={item.id || idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                                                    <Text style={{ width: 140, fontSize: 12, fontWeight: '700', color: '#0F172A' }} numberOfLines={1}>{actName}</Text>
                                                    <View style={{ width: 90 }}>
                                                        <View style={{
                                                            backgroundColor: isDelay ? '#FEF2F2' : isTrack ? '#EFF6FF' : isComp ? '#F0FDF4' : '#FEF3C7',
                                                            paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start'
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 9, fontWeight: '800',
                                                                color: isDelay ? '#DC2626' : isTrack ? '#2563EB' : isComp ? '#16A34A' : '#D97706'
                                                            }}>
                                                                {statusTxt}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <Text style={{ width: 100, fontSize: 11, fontWeight: '800', color: '#2563EB' }}>{progPct}</Text>
                                                    <Text style={{ width: 130, fontSize: 11, color: '#0F172A' }}>{compPlanStr}</Text>
                                                    <Text style={{ width: 90, fontSize: 11, color: '#64748B' }}>{remQtyStr}</Text>
                                                    <Text style={{ width: 85, fontSize: 11, color: '#64748B' }}>{toDisplay(item.start_date)}</Text>
                                                    <Text style={{ width: 85, fontSize: 11, color: '#64748B' }}>{toDisplay(item.end_date)}</Text>
                                                </View>
                                            );
                                        })
                                    )}
                                </View>
                            </ScrollView>

                            <PaginationFooter
                                currentPage={page}
                                totalPages={totalPages}
                                totalRecords={filtered.length}
                                pageSize={pageSize}
                                onPageChange={(p) => setPageForTab('DELAY REPORT', p)}
                                onPageSizeChange={(s) => setPageSizeForTab('DELAY REPORT', s)}
                            />
                        </View>
                    );
                })()}

            </ScrollView>

            {/* ── ADD DAILY PROGRESS MODAL ──────────────────────────────── */}
            <Modal visible={addModalVisible} transparent animationType="slide" onRequestClose={() => setAddModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 16, position: 'relative' }}>
                    {renderTopErrorToast()}
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' }}>
                        <View style={{ backgroundColor: '#2563EB', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>Add Daily Progress Entry</Text>
                            <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                                <X size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 16 }}>
                            {/* Validation Error Banner inside Modal */}
                            {formValidationBannerVisible && (() => {
                                const missing = getMissingDsrFields(formData.activity_id, formData.entry_date, formData.quantity_done);
                                const missingText = missing.length > 0 ? missing.join(', ') : 'Target Activity, Entry Date, Quantity Completed Today';
                                return (
                                    <View style={{
                                        backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECDD3', borderRadius: 12,
                                        padding: 14, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'
                                    }}>
                                        <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                                            <AlertTriangle size={18} color="#EF4444" style={{ marginTop: 2 }} />
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 13, fontWeight: '800', color: '#991B1B' }}>Validation Error</Text>
                                                <Text style={{ fontSize: 12, color: '#B91C1C', marginTop: 2, marginBottom: 8 }}>
                                                    Mandatory fields required: {missingText}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => setFormValidationBannerVisible(false)}>
                                            <X size={16} color="#B91C1C" />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })()}

                            {/* Select Activity */}
                            <View style={{ marginBottom: 12 }}>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>Target Activity <Text style={{ color: '#EF4444' }}>*</Text></Text>
                                <FloatingDropdown
                                    displayValue={formData.activity_id ? (activities.find(a => String(a.id) === String(formData.activity_id))?.name || activities.find(a => String(a.id) === String(formData.activity_id))?.activity_name || `Activity #${formData.activity_id}`) : ''}
                                    placeholder="Select Activity"
                                    isOpen={formActOpen}
                                    onToggle={() => setFormActOpen(v => !v)}
                                    onClose={() => setFormActOpen(false)}
                                >
                                    {(close) => (
                                        <ScrollView style={{ maxHeight: 200 }}>
                                            {activities.map(act => (
                                                <TouchableOpacity
                                                    key={act.id}
                                                    onPress={() => {
                                                        const newActId = String(act.id);
                                                        setFormData(p => ({ ...p, activity_id: newActId }));
                                                        updateDsrValidationState(newActId, formData.entry_date, formData.quantity_done);
                                                        close();
                                                    }}
                                                    style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}
                                                >
                                                    <Text style={{ fontSize: 12, color: '#334155', fontWeight: '600' }}>{act.name || act.activity_name}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    )}
                                </FloatingDropdown>
                            </View>

                            {/* Date */}
                            <View style={{ marginBottom: 12 }}>
                                <DatePickerField
                                    label="Entry Date"
                                    required
                                    value={formData.entry_date}
                                    onChange={(iso) => {
                                        setFormData(p => ({ ...p, entry_date: iso }));
                                        updateDsrValidationState(formData.activity_id, iso, formData.quantity_done);
                                    }}
                                    openKey="entry_date"
                                    activeKey={activeDatePicker}
                                    setActiveKey={setActiveDatePicker}
                                />
                            </View>

                            {/* Quantity Done */}
                            <View style={{ marginBottom: 12 }}>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>Quantity Completed Today <Text style={{ color: '#EF4444' }}>*</Text></Text>
                                <TextInput
                                    style={{
                                        backgroundColor: '#fff',
                                        borderWidth: 1,
                                        borderColor: (formSubmittedAttempted && (!formData.quantity_done || isNaN(Number(formData.quantity_done)) || Number(formData.quantity_done) <= 0)) ? '#EF4444' : '#E2E8F0',
                                        borderRadius: 8, padding: 10, fontSize: 13, color: '#0F172A'
                                    }}
                                    placeholder="e.g. 25"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="numeric"
                                    value={formData.quantity_done}
                                    onChangeText={t => {
                                        setFormData(p => ({ ...p, quantity_done: t }));
                                        updateDsrValidationState(formData.activity_id, formData.entry_date, t);
                                    }}
                                />
                                {formSubmittedAttempted && (!formData.quantity_done || isNaN(Number(formData.quantity_done)) || Number(formData.quantity_done) <= 0) && (
                                    <View style={{ marginTop: 4 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#EF4444' }}>REQUIRED</Text>
                                        <Text style={{ fontSize: 10, color: '#EF4444' }}>Valid positive quantity is required.</Text>
                                    </View>
                                )}
                            </View>

                            {/* Remarks */}
                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>Remarks & Observations</Text>
                                <TextInput
                                    style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, fontSize: 13, color: '#0F172A', minHeight: 60 }}
                                    placeholder="e.g. Completed section B footing pouring..."
                                    placeholderTextColor="#94A3B8"
                                    multiline
                                    value={formData.remarks}
                                    onChangeText={t => setFormData(p => ({ ...p, remarks: t }))}
                                />
                            </View>

                            <TouchableOpacity
                                onPress={handleCreateEntry}
                                style={{ backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Submit Daily Progress</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ── VIEW LOG DETAIL MODAL ──────────────────────────────────── */}
            <Modal visible={viewModalVisible} transparent animationType="fade" onRequestClose={() => setViewModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 16 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' }}>
                        <View style={{ backgroundColor: '#2563EB', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>Log Details</Text>
                            <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                                <X size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {selectedEntry && (
                            <View style={{ padding: 16 }}>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 }}>{selectedEntry.activity_name || `Activity #${selectedEntry.activity_id}`}</Text>
                                <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>Recorded on {toDisplay(selectedEntry.entry_date)}</Text>

                                <View style={{ backgroundColor: '#EFF6FF', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                                    <Text style={{ fontSize: 13, fontWeight: '800', color: '#2563EB' }}>
                                        Quantity Executed: +{selectedEntry.quantity_done || selectedEntry.today_progress} {selectedEntry.unit || 'SQM'}
                                    </Text>
                                </View>

                                {selectedEntry.remarks && (
                                    <View style={{ backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                                        <Text style={{ fontSize: 12, color: '#334155' }}>"{selectedEntry.remarks}"</Text>
                                    </View>
                                )}

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
