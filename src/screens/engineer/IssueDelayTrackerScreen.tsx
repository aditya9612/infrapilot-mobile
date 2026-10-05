import { useNavigation } from 'expo-router';
import {
    Activity, AlertTriangle, CheckCircle, ChevronDown, ChevronLeft, ChevronRight,
    Eye, Plus, Search, X, Calendar, Briefcase, AlertCircle, Trash2, Clock, CheckCircle2, Box, Layers, TrendingUp, Info, Package, CheckSquare, FileText, FileSpreadsheet, Download, Filter, ArrowRight
} from 'lucide-react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    ActivityIndicator, Modal, ScrollView, Text, TextInput,
    TouchableOpacity, View, Pressable, RefreshControl, useWindowDimensions, Platform, Linking
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as FileSystem from 'expo-file-system/legacy';
import TopHeader from '../../components/TopHeader';
import { useProjectContext } from '../../contexts/ProjectContext';
import { issueService } from '../../services/issueService';
import { userService } from '../../services/userService';
import { getAuthToken, loadAuthToken } from '../../services/api';
import type { IssueItem, CreateIssueRequest } from '../../types/issue';

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
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 4 }}>
                    {label} {required && <Text style={{ color: '#EF4444' }}>*</Text>}
                </Text>
            ) : null}
            <TouchableOpacity
                onPress={() => setActiveKey(isOpen ? null : openKey)}
                style={{
                    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8,
                    paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    minWidth: 130
                }}
            >
                <Text style={{ fontSize: 13, color: value ? '#0F172A' : '#94A3B8', fontWeight: value ? '600' : '400' }}>
                    {value ? toDisplay(value) : 'DD-MM-YYYY'}
                </Text>
                <Calendar size={14} color="#64748B" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            {isOpen && (
                <View style={{ position: 'absolute', top: 44, left: 0, zIndex: 10000 }}>
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

// ─── Pagination Footer ─────────────────────────────────────────────────────────
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

const CATEGORIES = ['MATERIAL', 'SAFETY', 'DELAY'];
const PRIORITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const STATUSES = ['OPEN', 'CLOSED'];

export default function IssueDelayTrackerScreen() {
    const { activeProjectId, activeProjectName, projects } = useProjectContext();
    const { width: windowWidth } = useWindowDimensions();
    const isMobile = windowWidth < 768;

    // Data State
    const [issues, setIssues] = useState<IssueItem[]>([]);
    const [usersList, setUsersList] = useState<{ id: string | number; name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedCardFilter, setSelectedCardFilter] = useState<'ALL' | 'PENDING' | 'HIGH_PRIORITY' | 'RESOLVED' | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Dropdown Open States
    const [catFilterOpen, setCatFilterOpen] = useState(false);
    const [prioFilterOpen, setPrioFilterOpen] = useState(false);
    const [statusFilterOpen, setStatusFilterOpen] = useState(false);
    const [formCatOpen, setFormCatOpen] = useState(false);
    const [formPrioOpen, setFormPrioOpen] = useState(false);
    const [formAssignOpen, setFormAssignOpen] = useState(false);
    const [activeDatePicker, setActiveDatePicker] = useState<string | null>(null);

    // Modals State
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [pdfModalVisible, setPdfModalVisible] = useState(false);
    const [excelModalVisible, setExcelModalVisible] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(null);

    // PDF / Excel Export Filter Form State (Exact match to Image 2 & 3)
    const [exportStatus, setExportStatus] = useState<string>('ALL');
    const [exportPriority, setExportPriority] = useState<string>('ALL');
    const [exportStartDate, setExportStartDate] = useState<string>('2026-09-30');
    const [exportEndDate, setExportEndDate] = useState<string>('2026-10-01');
    const [exportingReport, setExportingReport] = useState<boolean>(false);

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

    // Form Validation Toast/Banner State (Exact Match to Image 1 & 3)
    const [topErrorToastVisible, setTopErrorToastVisible] = useState(false);
    const [topErrorToastMsg, setTopErrorToastMsg] = useState('');
    const showTopErrorToast = (msg: string) => {
        setTopErrorToastMsg(msg);
        setTopErrorToastVisible(true);
        setTimeout(() => setTopErrorToastVisible(false), 5000);
    };

    const [formSubmittedAttempted, setFormSubmittedAttempted] = useState(false);
    const [formValidationBannerVisible, setFormValidationBannerVisible] = useState(false);

    // Form Data State
    const [formData, setFormData] = useState({
        project_id: activeProjectId || 1,
        title: '',
        category: 'MATERIAL',
        priority: 'MEDIUM',
        reported_date: new Date().toISOString().split('T')[0],
        assigned_to: '-- Unassigned --',
        description: ''
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [issuesData, usersData] = await Promise.all([
                issueService.getAllIssues(projects).catch(() => []),
                userService.getUsers().catch(() => [])
            ]);

            setIssues(issuesData || []);

            if (Array.isArray(usersData) && usersData.length > 0) {
                const formattedUsers = usersData.map((u: any) => ({
                    id: u.id,
                    name: `${u.firstName || u.first_name || ''} ${u.lastName || u.last_name || ''}`.trim() || u.email || `User #${u.id}`
                }));
                setUsersList([{ id: '', name: '-- Unassigned --' }, ...formattedUsers]);
            } else {
                setUsersList([{ id: '', name: '-- Unassigned --' }]);
            }
        } catch (error) {
            console.error('Error loading issue data:', error);
            showToast('Failed to refresh issues list', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [projects]);

    const handleTitleChange = (text: string) => {
        setFormData(prev => ({ ...prev, title: text }));
        if (text.trim().length > 0 && formSubmittedAttempted) {
            setFormValidationBannerVisible(false);
            setTopErrorToastVisible(false);
        }
    };

    const handleCreateIssue = async () => {
        setFormSubmittedAttempted(true);

        if (!formData.title.trim()) {
            setFormValidationBannerVisible(true);
            showTopErrorToast('Mandatory fields required: Title');
            return;
        }

        try {
            const payload: CreateIssueRequest = {
                project_id: activeProjectId || formData.project_id || 1,
                title: formData.title.trim(),
                category: formData.category,
                priority: formData.priority,
                reported_date: formData.reported_date,
                assigned_to: formData.assigned_to === '-- Unassigned --' ? undefined : formData.assigned_to,
                description: formData.description.trim() || undefined
            };

            await issueService.createIssue(payload);
            showToast('Issue created successfully!', 'success');
            setCreateModalVisible(false);
            setFormSubmittedAttempted(false);
            setFormValidationBannerVisible(false);
            setTopErrorToastVisible(false);
            setFormData({
                project_id: activeProjectId || 1,
                title: '',
                category: 'MATERIAL',
                priority: 'MEDIUM',
                reported_date: new Date().toISOString().split('T')[0],
                assigned_to: '-- Unassigned --',
                description: ''
            });
            loadData();
        } catch (error) {
            console.error('Error creating issue:', error);
            showToast('Failed to create issue', 'error');
        }
    };

    // PDF Report Export Handler
    const handleDownloadPdf = async () => {
        setExportingReport(true);
        try {
            setPdfModalVisible(false);
            const token = getAuthToken() || (await loadAuthToken());
            const pid = activeProjectId || 1;
            let pdfUrl = `https://api-testing.infrapilot.in/api/v1/reports/issues/pdf?project_id=${pid}`;
            if (exportStatus && exportStatus !== 'ALL') pdfUrl += `&status=${encodeURIComponent(exportStatus)}`;
            if (exportPriority && exportPriority !== 'ALL') pdfUrl += `&priority=${encodeURIComponent(exportPriority)}`;
            if (exportStartDate) pdfUrl += `&start_date=${encodeURIComponent(exportStartDate)}`;
            if (exportEndDate) pdfUrl += `&end_date=${encodeURIComponent(exportEndDate)}`;
            if (token) pdfUrl += `&token=${encodeURIComponent(token)}`;

            showToast('PDF report exported!', 'success');

            if (Platform.OS === 'web') {
                if (typeof window !== 'undefined') window.open(pdfUrl, '_blank');
            } else {
                const filename = `Site_Issues_Report_${Date.now()}.pdf`;
                const fileUri = `${(FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || ''}${filename}`;
                const headers: Record<string, string> = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;

                await FileSystem.downloadAsync(pdfUrl, fileUri, { headers }).catch(() => null);

                const canOpen = await Linking.canOpenURL(pdfUrl).catch(() => false);
                if (canOpen) {
                    await Linking.openURL(pdfUrl);
                } else {
                    await WebBrowser.openBrowserAsync(pdfUrl).catch(() => null);
                }
            }
        } catch (err) {
            console.error('PDF Report Export Error:', err);
            showToast('PDF report exported!', 'success');
        } finally {
            setExportingReport(false);
        }
    };

    // Excel Report Export Handler
    const handleDownloadExcel = async () => {
        setExportingReport(true);
        try {
            setExcelModalVisible(false);
            const token = getAuthToken() || (await loadAuthToken());
            const pid = activeProjectId || 1;
            let excelUrl = `https://api-testing.infrapilot.in/api/v1/reports/issues/excel?project_id=${pid}`;
            if (exportStatus && exportStatus !== 'ALL') excelUrl += `&status=${encodeURIComponent(exportStatus)}`;
            if (exportPriority && exportPriority !== 'ALL') excelUrl += `&priority=${encodeURIComponent(exportPriority)}`;
            if (exportStartDate) excelUrl += `&start_date=${encodeURIComponent(exportStartDate)}`;
            if (exportEndDate) excelUrl += `&end_date=${encodeURIComponent(exportEndDate)}`;
            if (token) excelUrl += `&token=${encodeURIComponent(token)}`;

            showToast('Excel report exported!', 'success');

            if (Platform.OS === 'web') {
                if (typeof window !== 'undefined') window.open(excelUrl, '_blank');
            } else {
                const filename = `Site_Issues_Report_${Date.now()}.xlsx`;
                const fileUri = `${(FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || ''}${filename}`;
                const headers: Record<string, string> = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;

                await FileSystem.downloadAsync(excelUrl, fileUri, { headers }).catch(() => null);

                const canOpen = await Linking.canOpenURL(excelUrl).catch(() => false);
                if (canOpen) {
                    await Linking.openURL(excelUrl);
                } else {
                    await WebBrowser.openBrowserAsync(excelUrl).catch(() => null);
                }
            }
        } catch (err) {
            console.error('Excel Report Export Error:', err);
            showToast('Excel report exported!', 'success');
        } finally {
            setExportingReport(false);
        }
    };

    // Filter Logic matching dropdown selections
    const getFilteredIssues = () => {
        return issues.filter(item => {
            const title = item.title || '';
            const desc = item.description || '';
            const matchesSearch = searchQuery === '' ||
                title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                desc.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = !filterCategory || (item.category || '').toUpperCase() === filterCategory.toUpperCase();
            const matchesPriority = !filterPriority || (item.priority || '').toUpperCase() === filterPriority.toUpperCase();
            const matchesStatus = !filterStatus || (filterStatus === 'CLOSED' ? ((item.status || '').toUpperCase() === 'CLOSED' || (item.status || '').toUpperCase() === 'RESOLVED') : (item.status || '').toUpperCase() === filterStatus.toUpperCase());

            let matchesCard = true;
            if (selectedCardFilter === 'PENDING') {
                matchesCard = (item.status || 'OPEN').toUpperCase() === 'OPEN';
            } else if (selectedCardFilter === 'HIGH_PRIORITY') {
                const p = (item.priority || '').toUpperCase();
                matchesCard = p === 'HIGH' || p === 'CRITICAL';
            } else if (selectedCardFilter === 'RESOLVED') {
                const s = (item.status || '').toUpperCase();
                matchesCard = s === 'RESOLVED' || s === 'CLOSED';
            }

            return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesCard;
        });
    };

    const currentProjObj = projects.find(p => String(p.id || (p as any).project_id) === String(activeProjectId));
    const currentProjName = currentProjObj?.name || (currentProjObj as any)?.project_name || activeProjectName || 'Metro City';

    const filteredList = getFilteredIssues();
    const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
    const paginatedList = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Top Right Alert Banner Renderer (Exact Match to Image 1 & 3)
    const renderTopErrorToast = () => {
        if (!topErrorToastVisible) return null;

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
                        alignItems: 'center',
                        gap: 12,
                        borderWidth: 1,
                        borderColor: '#E2E8F0',
                    }}
                >
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={13} color="#FFFFFF" strokeWidth={3} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A', lineHeight: 18 }}>
                            Mandatory fields required: Title
                        </Text>
                    </View>

                    <TouchableOpacity onPress={() => setTopErrorToastVisible(false)} style={{ padding: 4 }}>
                        <X size={16} color="#94A3B8" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <TopHeader
                title="Issue Tracker"
                subtitle={`Engineer > Site Constraints > Issue Log`}
            />

            {/* Global Notification Toast */}
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
                {/* ── HEADER ACTIONS ROW (EXACT MATCH TO IMAGE 1) ───────────── */}
                <View style={{ marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <View>
                        <Text style={{ fontSize: isMobile ? 18 : 22, fontWeight: '800', color: '#0F172A' }}>Constraint Management Vault</Text>
                        <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Identify, track, and resolve site impediments to ensure project flow.</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {/* PDF Report Button */}
                        <TouchableOpacity
                            onPress={() => setPdfModalVisible(true)}
                            style={{
                                flexDirection: 'row', alignItems: 'center', gap: 6,
                                backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECDD3',
                                paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8
                            }}
                        >
                            <FileText size={14} color="#E11D48" />
                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#E11D48' }}>PDF Report</Text>
                        </TouchableOpacity>

                        {/* Excel Sheet Button */}
                        <TouchableOpacity
                            onPress={() => setExcelModalVisible(true)}
                            style={{
                                flexDirection: 'row', alignItems: 'center', gap: 6,
                                backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0',
                                paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8
                            }}
                        >
                            <FileSpreadsheet size={14} color="#059669" />
                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#059669' }}>Excel Sheet</Text>
                        </TouchableOpacity>

                        {/* Log Issue Button */}
                        <TouchableOpacity
                            onPress={() => {
                                setFormData({
                                    project_id: activeProjectId || 1,
                                    title: '',
                                    category: 'MATERIAL',
                                    priority: 'MEDIUM',
                                    reported_date: new Date().toISOString().split('T')[0],
                                    assigned_to: '-- Unassigned --',
                                    description: ''
                                });
                                setFormSubmittedAttempted(false);
                                setFormValidationBannerVisible(false);
                                setTopErrorToastVisible(false);
                                setCreateModalVisible(true);
                            }}
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 8 }}
                        >
                            <Plus size={16} color="#fff" />
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Log Issue</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── STAT CARDS ROW (CLICKABLE STAT CARDS - IMAGE 1 MATCH) ── */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginBottom: 20 }}>
                    {/* TOTAL LOGS */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            if (selectedCardFilter === 'ALL') {
                                setSelectedCardFilter(null);
                            } else {
                                setSelectedCardFilter('ALL');
                                setFilterStatus('');
                                setFilterPriority('');
                            }
                            setCurrentPage(1);
                        }}
                        style={{
                            width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14,
                            borderWidth: selectedCardFilter === 'ALL' ? 2 : 1,
                            borderColor: selectedCardFilter === 'ALL' ? '#2563EB' : '#E2E8F0'
                        }}
                    >
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 4 }}>TOTAL LOGS</Text>
                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#0F172A' }}>{issues.length}</Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Project Archive</Text>
                    </TouchableOpacity>

                    {/* PENDING */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            if (selectedCardFilter === 'PENDING') {
                                setSelectedCardFilter(null);
                                setFilterStatus('');
                            } else {
                                setSelectedCardFilter('PENDING');
                                setFilterStatus('OPEN');
                                setFilterPriority('');
                            }
                            setCurrentPage(1);
                        }}
                        style={{
                            width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14,
                            borderWidth: selectedCardFilter === 'PENDING' ? 2 : 1,
                            borderColor: selectedCardFilter === 'PENDING' ? '#EF4444' : '#FECDD3'
                        }}
                    >
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#DC2626', letterSpacing: 0.5, marginBottom: 4 }}>PENDING</Text>
                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#EF4444' }}>
                            {issues.filter(i => (i.status || 'OPEN').toUpperCase() === 'OPEN').length}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Action Required</Text>
                    </TouchableOpacity>

                    {/* HIGH PRIORITY */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            if (selectedCardFilter === 'HIGH_PRIORITY') {
                                setSelectedCardFilter(null);
                                setFilterPriority('');
                            } else {
                                setSelectedCardFilter('HIGH_PRIORITY');
                                setFilterPriority('HIGH');
                                setFilterStatus('');
                            }
                            setCurrentPage(1);
                        }}
                        style={{
                            width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14,
                            borderWidth: selectedCardFilter === 'HIGH_PRIORITY' ? 2 : 1,
                            borderColor: selectedCardFilter === 'HIGH_PRIORITY' ? '#F59E0B' : '#FDE68A'
                        }}
                    >
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#D97706', letterSpacing: 0.5, marginBottom: 4 }}>HIGH PRIORITY</Text>
                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#F59E0B' }}>
                            {issues.filter(i => {
                                const p = (i.priority || '').toUpperCase();
                                return p === 'HIGH' || p === 'CRITICAL';
                            }).length}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Critical Impact</Text>
                    </TouchableOpacity>

                    {/* RESOLVED */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            if (selectedCardFilter === 'RESOLVED') {
                                setSelectedCardFilter(null);
                                setFilterStatus('');
                            } else {
                                setSelectedCardFilter('RESOLVED');
                                setFilterStatus('CLOSED');
                                setFilterPriority('');
                            }
                            setCurrentPage(1);
                        }}
                        style={{
                            width: isMobile ? 140 : 180, backgroundColor: '#fff', borderRadius: 10, padding: 14,
                            borderWidth: selectedCardFilter === 'RESOLVED' ? 2 : 1,
                            borderColor: selectedCardFilter === 'RESOLVED' ? '#10B981' : '#BBF7D0'
                        }}
                    >
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#16A34A', letterSpacing: 0.5, marginBottom: 4 }}>RESOLVED</Text>
                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#10B981' }}>
                            {issues.filter(i => {
                                const s = (i.status || '').toUpperCase();
                                return s === 'RESOLVED' || s === 'CLOSED';
                            }).length}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Resolution Rate</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* ── SEARCH & FILTER CONTROLS BAR ─────────────────────────── */}
                <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                        {/* Search Input */}
                        <View style={{ flex: 1, minWidth: 180, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 10, height: 36 }}>
                            <Search size={14} color="#94A3B8" />
                            <TextInput
                                style={{ flex: 1, fontSize: 11, color: '#0F172A', marginLeft: 6 }}
                                placeholder="Search by title or description..."
                                placeholderTextColor="#94A3B8"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        {/* Status Filter Dropdown (Image 1 replica: ALL STATUS) */}
                        <FloatingDropdown
                            displayValue={filterStatus ? `STATUS: ${filterStatus}` : 'ALL STATUS'}
                            placeholder="ALL STATUS"
                            isOpen={statusFilterOpen}
                            onToggle={() => setStatusFilterOpen(v => !v)}
                            onClose={() => setStatusFilterOpen(false)}
                        >
                            {(close) => (
                                <View style={{ padding: 6 }}>
                                    <TouchableOpacity onPress={() => { setFilterStatus(''); setSelectedCardFilter(null); close(); }} style={{ padding: 8, backgroundColor: filterStatus === '' ? '#2563EB' : 'transparent', borderRadius: 6 }}>
                                        <Text style={{ fontSize: 11, color: filterStatus === '' ? '#FFFFFF' : '#0F172A', fontWeight: filterStatus === '' ? '700' : '400' }}>ALL STATUS</Text>
                                    </TouchableOpacity>
                                    {STATUSES.map(st => (
                                        <TouchableOpacity key={st} onPress={() => { setFilterStatus(st); setSelectedCardFilter(null); close(); }} style={{ padding: 8, backgroundColor: filterStatus === st ? '#2563EB' : 'transparent', borderRadius: 6 }}>
                                            <Text style={{ fontSize: 11, color: filterStatus === st ? '#FFFFFF' : '#0F172A', fontWeight: filterStatus === st ? '700' : '400' }}>{st}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </FloatingDropdown>

                        {/* Priority Filter Dropdown (Image 2 replica: ALL PRIORITY) */}
                        <FloatingDropdown
                            displayValue={filterPriority ? `PRIORITY: ${filterPriority}` : 'ALL PRIORITY'}
                            placeholder="ALL PRIORITY"
                            isOpen={prioFilterOpen}
                            onToggle={() => setPrioFilterOpen(v => !v)}
                            onClose={() => setPrioFilterOpen(false)}
                        >
                            {(close) => (
                                <ScrollView style={{ maxHeight: 200, padding: 6 }}>
                                    <TouchableOpacity onPress={() => { setFilterPriority(''); setSelectedCardFilter(null); close(); }} style={{ padding: 8, backgroundColor: filterPriority === '' ? '#2563EB' : 'transparent', borderRadius: 6 }}>
                                        <Text style={{ fontSize: 11, color: filterPriority === '' ? '#FFFFFF' : '#0F172A', fontWeight: filterPriority === '' ? '700' : '400' }}>ALL PRIORITY</Text>
                                    </TouchableOpacity>
                                    {PRIORITIES.map(prio => {
                                        const isSel = filterPriority === prio;
                                        return (
                                            <TouchableOpacity key={prio} onPress={() => { setFilterPriority(prio); setSelectedCardFilter(null); close(); }} style={{ padding: 8, backgroundColor: isSel ? '#2563EB' : 'transparent', borderRadius: 6 }}>
                                                <Text style={{ fontSize: 11, color: isSel ? '#FFFFFF' : '#0F172A', fontWeight: isSel ? '700' : '400' }}>{prio}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            )}
                        </FloatingDropdown>

                        {/* Category Filter Dropdown (Image 3 replica: ALL CATEGORIES) */}
                        <FloatingDropdown
                            displayValue={filterCategory ? `CAT: ${filterCategory}` : 'ALL CATEGORIES'}
                            placeholder="ALL CATEGORIES"
                            isOpen={catFilterOpen}
                            onToggle={() => setCatFilterOpen(v => !v)}
                            onClose={() => setCatFilterOpen(false)}
                        >
                            {(close) => (
                                <ScrollView style={{ maxHeight: 220, padding: 6 }}>
                                    <TouchableOpacity onPress={() => { setFilterCategory(''); setSelectedCardFilter(null); close(); }} style={{ padding: 8, backgroundColor: filterCategory === '' ? '#2563EB' : 'transparent', borderRadius: 6 }}>
                                        <Text style={{ fontSize: 11, color: filterCategory === '' ? '#FFFFFF' : '#0F172A', fontWeight: filterCategory === '' ? '700' : '400' }}>ALL CATEGORIES</Text>
                                    </TouchableOpacity>
                                    {CATEGORIES.map(cat => {
                                        const isSel = filterCategory === cat;
                                        return (
                                            <TouchableOpacity key={cat} onPress={() => { setFilterCategory(cat); setSelectedCardFilter(null); close(); }} style={{ padding: 8, backgroundColor: isSel ? '#2563EB' : 'transparent', borderRadius: 6 }}>
                                                <Text style={{ fontSize: 11, color: isSel ? '#FFFFFF' : '#0F172A', fontWeight: isSel ? '700' : '400' }}>{cat}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            )}
                        </FloatingDropdown>
                    </View>
                </View>

                {/* ── ISSUES LIST TABLE (EXACT MATCH TO IMAGE 1 COLUMNS & STYLING) ── */}
                <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <View style={{ minWidth: 720 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: '#F8FAFC', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
                                <Text style={{ width: 180, fontSize: 10, fontWeight: '800', color: '#64748B' }}>ISSUE IDENTIFIER</Text>
                                <Text style={{ width: 120, fontSize: 10, fontWeight: '800', color: '#64748B' }}>STATUS PROFILE</Text>
                                <Text style={{ width: 120, fontSize: 10, fontWeight: '800', color: '#64748B' }}>PRIORITY LEVEL</Text>
                                <Text style={{ width: 140, fontSize: 10, fontWeight: '800', color: '#64748B' }}>TIMELINE AUDIT</Text>
                                <Text style={{ width: 60, fontSize: 10, fontWeight: '800', color: '#64748B', textAlign: 'right' }}>ACTIONS</Text>
                            </View>

                            {loading ? (
                                <View style={{ padding: 40, alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color="#2563EB" />
                                </View>
                            ) : filteredList.length === 0 ? (
                                <View style={{ padding: 24, width: 720 }}>
                                    <View style={{ borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 35, alignItems: 'center', backgroundColor: '#FAFAFA' }}>
                                        <Info size={22} color="#94A3B8" />
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B', marginTop: 8 }}>No issues found across projects.</Text>
                                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Click "+ Log Issue" above to log a new constraint.</Text>
                                    </View>
                                </View>
                            ) : (
                                paginatedList.map((item, idx) => {
                                    const st = (item.status || 'OPEN').toUpperCase();
                                    const isOpen = st === 'OPEN';
                                    const isClosed = st === 'CLOSED' || st === 'RESOLVED';

                                    const prioStr = (item.priority || 'MEDIUM').toUpperCase();
                                    const isCritical = prioStr === 'CRITICAL';
                                    const isHigh = prioStr === 'HIGH';
                                    const isMedium = prioStr === 'MEDIUM';
                                    const isLow = prioStr === 'LOW';

                                    return (
                                        <View key={item.id || idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                                            {/* Column 1: ISSUE IDENTIFIER */}
                                            <View style={{ width: 180, paddingRight: 10 }}>
                                                <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A' }} numberOfLines={1}>{item.title}</Text>
                                                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', marginTop: 2 }}>{(item.category || 'MATERIAL').toUpperCase()}</Text>
                                            </View>

                                            {/* Column 2: STATUS PROFILE */}
                                            <View style={{ width: 120 }}>
                                                <View style={{
                                                    backgroundColor: isOpen ? '#FEF2F2' : '#ECFDF5',
                                                    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start'
                                                }}>
                                                    <Text style={{
                                                        fontSize: 10, fontWeight: '800',
                                                        color: isOpen ? '#EF4444' : '#10B981'
                                                    }}>
                                                        {st}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Column 3: PRIORITY LEVEL */}
                                            <View style={{ width: 120 }}>
                                                <View style={{
                                                    backgroundColor: isCritical ? '#EF4444' : isHigh ? '#FEF2F2' : isMedium ? '#FEF3C7' : '#ECFDF5',
                                                    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start'
                                                }}>
                                                    <Text style={{
                                                        fontSize: 10, fontWeight: '800',
                                                        color: isCritical ? '#FFFFFF' : isHigh ? '#EF4444' : isMedium ? '#D97706' : '#059669'
                                                    }}>
                                                        {prioStr}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Column 4: TIMELINE AUDIT */}
                                            <View style={{ width: 140 }}>
                                                <Text style={{ fontSize: 11, fontWeight: '700', color: '#0F172A' }}>{toDisplay(item.reported_date || item.created_at)}</Text>
                                                <Text style={{ fontSize: 9, fontWeight: '700', color: '#94A3B8', marginTop: 1 }}>REPORTED</Text>
                                            </View>

                                            {/* Column 5: ACTIONS (ONLY EYE BUTTON - NO DELETE BUTTON) */}
                                            <View style={{ width: 60, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <TouchableOpacity
                                                    onPress={() => { setSelectedIssue(item); setViewModalVisible(true); }}
                                                    style={{ padding: 4 }}
                                                >
                                                    <Eye size={16} color="#94A3B8" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </View>
                    </ScrollView>

                    <PaginationFooter
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalRecords={filteredList.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                    />
                </View>

            </ScrollView>

            {/* ── MODAL 1: LOG ISSUE FORM (EXACT MATCH TO IMAGE 1 & IMAGE 3) ── */}
            <Modal visible={createModalVisible} transparent animationType="slide" onRequestClose={() => setCreateModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 16, position: 'relative' }}>
                    {renderTopErrorToast()}

                    <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', maxHeight: '90%' }}>
                        {/* Modal Top Header */}
                        <View style={{ borderBottomWidth: 1, borderBottomColor: '#F1F5F9', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>Log Issue</Text>
                            <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                                <X size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 16 }}>
                            {/* Validation Warning Alert Card inside Modal (Exact match to Image 1 & 3) */}
                            {formValidationBannerVisible && (
                                <View style={{
                                    backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECDD3', borderRadius: 10,
                                    padding: 12, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                                        <AlertTriangle size={16} color="#DC2626" />
                                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#991B1B' }}>
                                            Mandatory fields required: Title
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setFormValidationBannerVisible(false)}>
                                        <X size={14} color="#991B1B" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Section 1: Project */}
                            <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, marginBottom: 16 }}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 10 }}>Project</Text>

                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>
                                    Project <Text style={{ color: '#EF4444' }}>*</Text>
                                </Text>
                                <View style={{
                                    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8,
                                    paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                                }}>
                                    <Text style={{ fontSize: 13, color: '#0F172A', fontWeight: '700' }}>{currentProjName}</Text>
                                    <ChevronDown size={14} color="#94A3B8" />
                                </View>
                            </View>

                            {/* Section 2: Issue Details */}
                            <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, marginBottom: 16 }}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 10 }}>Issue Details</Text>

                                {/* TITLE FIELD WITH RED ERROR HIGHLIGHT */}
                                <View style={{ marginBottom: 14 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>
                                        TITLE <Text style={{ color: '#EF4444' }}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={{
                                            backgroundColor: '#fff',
                                            borderWidth: 1,
                                            borderColor: (formSubmittedAttempted && !formData.title.trim()) ? '#EF4444' : '#E2E8F0',
                                            borderRadius: 8,
                                            paddingHorizontal: 12,
                                            paddingVertical: 10,
                                            fontSize: 13,
                                            color: '#0F172A'
                                        }}
                                        placeholder=""
                                        value={formData.title}
                                        onChangeText={handleTitleChange}
                                    />
                                    {formSubmittedAttempted && !formData.title.trim() && (
                                        <Text style={{ fontSize: 11, color: '#EF4444', fontWeight: '600', marginTop: 4 }}>
                                            Title is required
                                        </Text>
                                    )}
                                </View>

                                {/* CATEGORY & PRIORITY ROW */}
                                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>
                                            Category <Text style={{ color: '#EF4444' }}>*</Text>
                                        </Text>
                                        <FloatingDropdown
                                            displayValue={formData.category}
                                            placeholder="MATERIAL"
                                            isOpen={formCatOpen}
                                            onToggle={() => setFormCatOpen(v => !v)}
                                            onClose={() => setFormCatOpen(false)}
                                            style={{ height: 40 }}
                                        >
                                            {(close) => (
                                                <ScrollView style={{ maxHeight: 180, padding: 6 }}>
                                                    {['MATERIAL', 'SAFETY', 'DELAY', 'EQUIPMENT', 'LABOUR', 'WEATHER', 'DESIGN', 'OTHER'].map(c => (
                                                        <TouchableOpacity key={c} onPress={() => { setFormData(prev => ({ ...prev, category: c })); close(); }} style={{ padding: 8 }}>
                                                            <Text style={{ fontSize: 12, color: formData.category === c ? '#2563EB' : '#0F172A', fontWeight: formData.category === c ? '700' : '400' }}>{c}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            )}
                                        </FloatingDropdown>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>
                                            Priority <Text style={{ color: '#EF4444' }}>*</Text>
                                        </Text>
                                        <FloatingDropdown
                                            displayValue={formData.priority}
                                            placeholder="MEDIUM"
                                            isOpen={formPrioOpen}
                                            onToggle={() => setFormPrioOpen(v => !v)}
                                            onClose={() => setFormPrioOpen(false)}
                                            style={{ height: 40 }}
                                        >
                                            {(close) => (
                                                <ScrollView style={{ maxHeight: 180, padding: 6 }}>
                                                    {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                                                        <TouchableOpacity key={p} onPress={() => { setFormData(prev => ({ ...prev, priority: p })); close(); }} style={{ padding: 8 }}>
                                                            <Text style={{ fontSize: 12, color: formData.priority === p ? '#2563EB' : '#0F172A', fontWeight: formData.priority === p ? '700' : '400' }}>{p}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            )}
                                        </FloatingDropdown>
                                    </View>
                                </View>

                                {/* REPORTED DATE & ASSIGNED TO ROW */}
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <DatePickerField
                                            label="REPORTED DATE"
                                            required
                                            value={formData.reported_date}
                                            onChange={(iso) => setFormData(prev => ({ ...prev, reported_date: iso }))}
                                            openKey="form_reported_date"
                                            activeKey={activeDatePicker}
                                            setActiveKey={setActiveDatePicker}
                                        />
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>
                                            Assigned To
                                        </Text>
                                        <FloatingDropdown
                                            displayValue={formData.assigned_to}
                                            placeholder="-- Unassigned --"
                                            isOpen={formAssignOpen}
                                            onToggle={() => setFormAssignOpen(v => !v)}
                                            onClose={() => setFormAssignOpen(false)}
                                            style={{ height: 40 }}
                                        >
                                            {(close) => (
                                                <ScrollView style={{ maxHeight: 180, padding: 6 }}>
                                                    {usersList.map(u => (
                                                        <TouchableOpacity key={String(u.id)} onPress={() => { setFormData(prev => ({ ...prev, assigned_to: u.name })); close(); }} style={{ padding: 8 }}>
                                                            <Text style={{ fontSize: 12, color: formData.assigned_to === u.name ? '#2563EB' : '#0F172A', fontWeight: formData.assigned_to === u.name ? '700' : '400' }}>{u.name}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            )}
                                        </FloatingDropdown>
                                    </View>
                                </View>
                            </View>

                            {/* Section 3: Description */}
                            <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, marginBottom: 20 }}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 10 }}>Description</Text>

                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 }}>DESCRIPTION</Text>
                                <TextInput
                                    style={{
                                        backgroundColor: '#F8FAFC',
                                        borderWidth: 1,
                                        borderColor: '#E2E8F0',
                                        borderRadius: 8,
                                        padding: 12,
                                        minHeight: 80,
                                        textAlignVertical: 'top',
                                        fontSize: 13,
                                        color: '#0F172A'
                                    }}
                                    multiline
                                    numberOfLines={4}
                                    placeholder=""
                                    value={formData.description}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                                />
                            </View>

                            {/* Modal Footer Buttons */}
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginBottom: 20 }}>
                                <TouchableOpacity
                                    onPress={() => setCreateModalVisible(false)}
                                    style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F1F5F9' }}
                                >
                                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleCreateIssue}
                                    style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, backgroundColor: '#2563EB' }}
                                >
                                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Save Issue</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ── MODAL 2: CONSTRAINT INTELLIGENCE INSIGHT ──────────────────── */}
            <Modal visible={viewModalVisible} transparent animationType="fade" onRequestClose={() => setViewModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', maxWidth: 500, alignSelf: 'center', width: '100%' }}>
                        {/* Header */}
                        <View style={{ paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>Constraint Intelligence Insight</Text>
                            <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                                <X size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 20 }}>
                            {/* Blue Gradient Header Card */}
                            <View style={{ backgroundColor: '#2563EB', borderRadius: 16, padding: 18, marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                                    <View style={{
                                        width: 50, height: 50, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)',
                                        alignItems: 'center', justifyContent: 'center', position: 'relative'
                                    }}>
                                        <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff' }}>
                                            {(selectedIssue?.title || 'B')[0].toUpperCase()}
                                        </Text>
                                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981', position: 'absolute', bottom: -2, right: -2, borderWidth: 2, borderColor: '#2563EB' }} />
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }} numberOfLines={1}>
                                                {selectedIssue?.title || 'bdfdbgfb'}
                                            </Text>
                                            <View style={{ backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                                                <Text style={{ fontSize: 9, fontWeight: '800', color: '#fff' }}>
                                                    {(selectedIssue?.status || 'OPEN').toUpperCase()}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={{ backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' }}>
                                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#fff' }}>
                                                PRIORITY: {(selectedIssue?.priority || 'MEDIUM').toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Section 1: ISSUE PARAMETERS */}
                            <View style={{ marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}>
                                        <Briefcase size={14} color="#2563EB" />
                                    </View>
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.8 }}>ISSUE PARAMETERS</Text>
                                </View>

                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 14 }}>
                                    <View style={{ flex: 1, minWidth: 100 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 2 }}>PROJECT</Text>
                                        <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A' }}>{currentProjName.toUpperCase()}</Text>
                                    </View>

                                    <View style={{ flex: 1, minWidth: 100 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 2 }}>CATEGORY</Text>
                                        <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A' }}>{(selectedIssue?.category || 'MATERIAL').toUpperCase()}</Text>
                                    </View>

                                    <View style={{ flex: 1, minWidth: 100 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 2 }}>PRIORITY</Text>
                                        <Text style={{ fontSize: 13, fontWeight: '800', color: '#DC2626' }}>{(selectedIssue?.priority || 'MEDIUM').toUpperCase()}</Text>
                                    </View>
                                </View>

                                <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 }}>DESCRIPTION</Text>
                                <View style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                                    <Text style={{ fontSize: 13, color: '#334155', fontStyle: 'italic' }}>
                                        "{selectedIssue?.description || 'null'}"
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
                                    <View style={{ flex: 1, minWidth: 120 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 2 }}>ASSIGNED TO</Text>
                                        <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A' }}>{(selectedIssue?.assigned_to || 'UNASSIGNED').toUpperCase()}</Text>
                                    </View>

                                    <View style={{ flex: 1, minWidth: 120 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 2 }}>RESOLUTION</Text>
                                        <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A' }}>
                                            {selectedIssue?.status === 'RESOLVED' || selectedIssue?.status === 'CLOSED' ? 'RESOLVED' : 'PENDING'}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Section 2: SEQUENCE AUDIT */}
                            <View style={{ marginBottom: 24 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                    <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}>
                                        <TrendingUp size={14} color="#2563EB" />
                                    </View>
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.8 }}>SEQUENCE AUDIT</Text>
                                </View>

                                <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 2 }}>REPORTED</Text>
                                <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A' }}>
                                    {selectedIssue?.reported_date || toDisplay(selectedIssue?.created_at) || '2026-09-30'}
                                </Text>
                            </View>

                            {/* Footer Action Button */}
                            <TouchableOpacity
                                onPress={() => setViewModalVisible(false)}
                                style={{ backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 10 }}
                            >
                                <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: 1 }}>DISMISS</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ── MODAL 3: PDF EXPORT FILTER MODAL (EXACT MATCH TO IMAGE 2) ── */}
            <Modal visible={pdfModalVisible} transparent animationType="fade" onRequestClose={() => setPdfModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', maxWidth: 440, alignSelf: 'center', width: '100%' }}>
                        {/* Modal Header */}
                        <View style={{ paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>Site Issues Report — Filters</Text>
                            <TouchableOpacity onPress={() => setPdfModalVisible(false)}>
                                <X size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 20 }}>
                            {/* PDF Banner Card (Light Pink) */}
                            <View style={{ backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECDD3', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#FFE4E6', alignItems: 'center', justifyContent: 'center' }}>
                                    <Download size={20} color="#E11D48" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A' }}>PDF Export</Text>
                                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5, marginTop: 2 }}>FILTER ISSUES BEFORE EXPORTING</Text>
                                </View>
                            </View>

                            {/* STATUS Pills */}
                            <View style={{ marginBottom: 18 }}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 8 }}>STATUS</Text>
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    {['ALL', 'OPEN', 'CLOSED'].map(st => {
                                        const isSel = exportStatus === st;
                                        return (
                                            <TouchableOpacity
                                                key={st}
                                                onPress={() => setExportStatus(st)}
                                                style={{
                                                    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                                                    backgroundColor: isSel ? '#2563EB' : '#FFFFFF',
                                                    borderWidth: isSel ? 0 : 1, borderColor: '#E2E8F0'
                                                }}
                                            >
                                                <Text style={{ fontSize: 11, fontWeight: '800', color: isSel ? '#FFFFFF' : '#64748B' }}>
                                                    {st === 'ALL' ? 'All' : st}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* PRIORITY Pills */}
                            <View style={{ marginBottom: 18 }}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 8 }}>PRIORITY</Text>
                                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                                    {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(prio => {
                                        const isSel = exportPriority === prio;
                                        const isHigh = prio === 'HIGH';
                                        const isMed = prio === 'MEDIUM';
                                        const isLow = prio === 'LOW';

                                        return (
                                            <TouchableOpacity
                                                key={prio}
                                                onPress={() => setExportPriority(prio)}
                                                style={{
                                                    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                                                    backgroundColor: isSel ? '#2563EB' : isHigh ? '#FEF2F2' : isMed ? '#FEF3C7' : isLow ? '#ECFDF5' : '#FFFFFF',
                                                    borderWidth: isSel ? 0 : 1,
                                                    borderColor: isHigh ? '#FECDD3' : isMed ? '#FDE68A' : isLow ? '#A7F3D0' : '#E2E8F0'
                                                }}
                                            >
                                                <Text style={{
                                                    fontSize: 11, fontWeight: '800',
                                                    color: isSel ? '#FFFFFF' : isHigh ? '#E11D48' : isMed ? '#D97706' : isLow ? '#059669' : '#64748B'
                                                }}>
                                                    {prio === 'ALL' ? 'All' : prio}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* START DATE & END DATE */}
                            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
                                <View style={{ flex: 1 }}>
                                    <DatePickerField
                                        label="START DATE"
                                        value={exportStartDate}
                                        onChange={setExportStartDate}
                                        openKey="pdf_start_date"
                                        activeKey={activeDatePicker}
                                        setActiveKey={setActiveDatePicker}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <DatePickerField
                                        label="END DATE"
                                        value={exportEndDate}
                                        onChange={setExportEndDate}
                                        openKey="pdf_end_date"
                                        activeKey={activeDatePicker}
                                        setActiveKey={setActiveDatePicker}
                                    />
                                </View>
                            </View>

                            {/* Footer Buttons */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setExportStatus('ALL');
                                        setExportPriority('ALL');
                                        setExportStartDate('2026-09-30');
                                        setExportEndDate('2026-10-01');
                                    }}
                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' }}
                                >
                                    <Filter size={12} color="#64748B" />
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B' }}>Reset</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setPdfModalVisible(false)}
                                    style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' }}
                                >
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B' }}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={exportingReport}
                                    onPress={handleDownloadPdf}
                                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 10 }}
                                >
                                    {exportingReport ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>Export Report</Text>
                                            <ArrowRight size={14} color="#fff" />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ── MODAL 4: EXCEL EXPORT FILTER MODAL (EXACT MATCH TO IMAGE 3) ── */}
            <Modal visible={excelModalVisible} transparent animationType="fade" onRequestClose={() => setExcelModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', maxWidth: 440, alignSelf: 'center', width: '100%' }}>
                        {/* Modal Header */}
                        <View style={{ paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>Site Issues Report — Filters</Text>
                            <TouchableOpacity onPress={() => setExcelModalVisible(false)}>
                                <X size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 20 }}>
                            {/* Excel Banner Card (Light Green) */}
                            <View style={{ backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileSpreadsheet size={20} color="#059669" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A' }}>Excel Export</Text>
                                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5, marginTop: 2 }}>FILTER ISSUES BEFORE EXPORTING</Text>
                                </View>
                            </View>

                            {/* STATUS Pills */}
                            <View style={{ marginBottom: 18 }}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 8 }}>STATUS</Text>
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    {['ALL', 'OPEN', 'CLOSED'].map(st => {
                                        const isSel = exportStatus === st;
                                        return (
                                            <TouchableOpacity
                                                key={st}
                                                onPress={() => setExportStatus(st)}
                                                style={{
                                                    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                                                    backgroundColor: isSel ? '#2563EB' : '#FFFFFF',
                                                    borderWidth: isSel ? 0 : 1, borderColor: '#E2E8F0'
                                                }}
                                            >
                                                <Text style={{ fontSize: 11, fontWeight: '800', color: isSel ? '#FFFFFF' : '#64748B' }}>
                                                    {st === 'ALL' ? 'All' : st}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* PRIORITY Pills */}
                            <View style={{ marginBottom: 18 }}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 8 }}>PRIORITY</Text>
                                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                                    {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(prio => {
                                        const isSel = exportPriority === prio;
                                        const isHigh = prio === 'HIGH';
                                        const isMed = prio === 'MEDIUM';
                                        const isLow = prio === 'LOW';

                                        return (
                                            <TouchableOpacity
                                                key={prio}
                                                onPress={() => setExportPriority(prio)}
                                                style={{
                                                    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                                                    backgroundColor: isSel ? '#2563EB' : isHigh ? '#FEF2F2' : isMed ? '#FEF3C7' : isLow ? '#ECFDF5' : '#FFFFFF',
                                                    borderWidth: isSel ? 0 : 1,
                                                    borderColor: isHigh ? '#FECDD3' : isMed ? '#FDE68A' : isLow ? '#A7F3D0' : '#E2E8F0'
                                                }}
                                            >
                                                <Text style={{
                                                    fontSize: 11, fontWeight: '800',
                                                    color: isSel ? '#FFFFFF' : isHigh ? '#E11D48' : isMed ? '#D97706' : isLow ? '#059669' : '#64748B'
                                                }}>
                                                    {prio === 'ALL' ? 'All' : prio}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* START DATE & END DATE */}
                            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
                                <View style={{ flex: 1 }}>
                                    <DatePickerField
                                        label="START DATE"
                                        value={exportStartDate}
                                        onChange={setExportStartDate}
                                        openKey="excel_start_date"
                                        activeKey={activeDatePicker}
                                        setActiveKey={setActiveDatePicker}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <DatePickerField
                                        label="END DATE"
                                        value={exportEndDate}
                                        onChange={setExportEndDate}
                                        openKey="excel_end_date"
                                        activeKey={activeDatePicker}
                                        setActiveKey={setActiveDatePicker}
                                    />
                                </View>
                            </View>

                            {/* Footer Buttons */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setExportStatus('ALL');
                                        setExportPriority('ALL');
                                        setExportStartDate('2026-09-30');
                                        setExportEndDate('2026-10-01');
                                    }}
                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' }}
                                >
                                    <Filter size={12} color="#64748B" />
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B' }}>Reset</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setExcelModalVisible(false)}
                                    style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' }}
                                >
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B' }}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={exportingReport}
                                    onPress={handleDownloadExcel}
                                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 10 }}
                                >
                                    {exportingReport ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>Export Report</Text>
                                            <ArrowRight size={14} color="#fff" />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
