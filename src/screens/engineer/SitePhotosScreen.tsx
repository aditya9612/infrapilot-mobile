import React, { useEffect, useState, useRef } from 'react';
import {
    ActivityIndicator, Modal, ScrollView, Text, TextInput,
    TouchableOpacity, View, Pressable, RefreshControl, useWindowDimensions, Image, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
    Activity, AlertTriangle, CheckCircle, ChevronDown, ChevronLeft, ChevronRight,
    Eye, Plus, Search, X, Calendar, Briefcase, Trash2, Clock, Filter, UploadCloud,
    FileImage, LayoutGrid, List as ListIcon, Info, CheckCircle2, TrendingUp, Layers, MapPin
} from 'lucide-react-native';
import TopHeader from '../../components/TopHeader';
import { useProjectContext } from '../../contexts/ProjectContext';
import { sitePhotosService } from '../../services/sitePhotosService';
import { taskService } from '../../services/taskService';
import { dsrService } from '../../services/dsrService';
import type { SitePhotoItem } from '../../types/sitePhoto';

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

const getImageUrl = (rawUrl?: string) => {
    if (!rawUrl) return undefined;
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('file://') || rawUrl.startsWith('data:')) {
        return rawUrl;
    }
    const baseUrl = 'https://api-testing.infrapilot.in';
    return `${baseUrl}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
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
            paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF',
            borderTopWidth: 1, borderTopColor: '#E2E8F0', flexWrap: 'wrap', gap: 10, borderRadius: 12, marginTop: 16
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
                        padding: 6, borderRadius: 6,
                        backgroundColor: currentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                        borderWidth: 1, borderColor: currentPage === 1 ? '#E2E8F0' : '#CBD5E1',
                        opacity: currentPage === 1 ? 0.5 : 1
                    }}
                >
                    <ChevronLeft size={14} color={currentPage === 1 ? '#94A3B8' : '#334155'} />
                </TouchableOpacity>

                <View style={{
                    minWidth: 28, height: 28, borderRadius: 6,
                    backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center',
                    paddingHorizontal: 8
                }}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{currentPage}</Text>
                </View>

                <TouchableOpacity
                    disabled={currentPage >= totalPages}
                    onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    style={{
                        padding: 6, borderRadius: 6,
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

const ACTIVITIES_LIST = [
    'ALL ACTIVITIES',
    'FOUNDATION WORK',
    'RCC COLUMN CASTING',
    'SLAB POURING',
    'BRICKWORK / MASONRY',
    'SAFETY AUDIT',
    'QUALITY INSPECTION',
    'DSR DOCUMENTATION'
];

const LOCATIONS_LIST = [
    'ALL LOCATIONS',
    'BLOCK A – GROUND FLOOR',
    'BLOCK B – FIRST FLOOR',
    'BLOCK C – TERRACE',
    'SITE OFFICE',
    'MATERIAL YARD',
    'NORTH ZONE'
];

const FORM_LOCATIONS_LIST = [
    'Select Location',
    'BLOCK A – GROUND FLOOR',
    'BLOCK B – FIRST FLOOR',
    'BLOCK C – TERRACE',
    'SITE OFFICE',
    'MATERIAL YARD',
    'NORTH ZONE'
];

export default function SitePhotosScreen() {
    const { activeProjectId, activeProjectName, projects } = useProjectContext();
    const { width: windowWidth } = useWindowDimensions();
    const isMobile = windowWidth < 768;

    // Data State
    const [photos, setPhotos] = useState<SitePhotoItem[]>([]);
    const [tasksList, setTasksList] = useState<{ id: string | number; name: string }[]>([]);
    const [dsrList, setDsrList] = useState<{ id: string | number; name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Layout View Mode (grid vs list)
    const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterActivity, setFilterActivity] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

    // Dropdown Open States
    const [actFilterOpen, setActFilterOpen] = useState(false);
    const [locFilterOpen, setLocFilterOpen] = useState(false);
    const [sortFilterOpen, setSortFilterOpen] = useState(false);

    // Modal Dropdown Open States
    const [formProjOpen, setFormProjOpen] = useState(false);
    const [formTaskOpen, setFormTaskOpen] = useState(false);
    const [formDsrOpen, setFormDsrOpen] = useState(false);
    const [formActOpen, setFormActOpen] = useState(false);
    const [formLocOpen, setFormLocOpen] = useState(false);
    const [activeDatePicker, setActiveDatePicker] = useState<string | null>(null);

    // Modals State
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<SitePhotoItem | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Toast Notification State
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastMsg(msg);
        setToastType(type);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    // Form Validation Banner & Alert Toast (Matches Image 2 & 3)
    const [topErrorToastVisible, setTopErrorToastVisible] = useState(false);
    const [topErrorToastMsg, setTopErrorToastMsg] = useState('');
    const showTopErrorToast = (msg: string) => {
        setTopErrorToastMsg(msg);
        setTopErrorToastVisible(true);
        setTimeout(() => setTopErrorToastVisible(false), 5000);
    };

    const [formSubmittedAttempted, setFormSubmittedAttempted] = useState(false);
    const [formValidationBannerVisible, setFormValidationBannerVisible] = useState(false);

    // Form State for Register Site Evidence
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        project_id: activeProjectId || 1,
        observed_date: new Date().toISOString().split('T')[0],
        task_id: '',
        task_name: 'Select Task...',
        dsr_id: '',
        dsr_name: 'Select DSR...',
        activity_tag: 'Select Activity',
        location_zone: 'Select Location',
        narrative_insight: ''
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const pid = activeProjectId ? parseInt(activeProjectId.toString()) : undefined;
            const [photosData, tasksData, dsrData] = await Promise.all([
                sitePhotosService.getSitePhotos({ project_id: pid }).catch(() => []),
                taskService.getTasks(pid ? Number(pid) : undefined).catch(() => []),
                dsrService.getDsr({ limit: 100 }).catch(() => null)
            ]);

            setPhotos(photosData || []);

            // Process Tasks List
            if (Array.isArray(tasksData) && tasksData.length > 0) {
                const formattedTasks = tasksData.map((t: any) => ({
                    id: t.id || t.task_id,
                    name: t.title || t.name || t.task_name || `Task #${t.id}`
                }));
                setTasksList([{ id: '', name: 'Select Task...' }, ...formattedTasks]);
            } else {
                setTasksList([
                    { id: '', name: 'Select Task...' },
                    { id: 1, name: 'jhvjmhknllsdf' },
                    { id: 2, name: 'Illlllllllllllllll' },
                    { id: 3, name: 'testing pass' },
                    { id: 4, name: 'JKJKJKJKJKJK' },
                    { id: 5, name: 'DSASDFAS' },
                    { id: 6, name: 'wqerrfer' }
                ]);
            }

            // Process DSR List
            const rawDsr = Array.isArray(dsrData) ? dsrData : dsrData?.items || (dsrData as any)?.data || [];
            if (Array.isArray(rawDsr) && rawDsr.length > 0) {
                const formattedDsrs = rawDsr.map((d: any) => ({
                    id: d.id,
                    name: `DSR #${d.id} - ${toDisplay(d.entry_date || d.created_at)}`
                }));
                setDsrList([{ id: '', name: 'Select DSR...' }, ...formattedDsrs]);
            } else {
                setDsrList([
                    { id: '', name: 'Select DSR...' },
                    { id: 1, name: 'DSR #1 - 2026-09-28' },
                    { id: 2, name: 'DSR #2 - 2026-09-29' }
                ]);
            }
        } catch (error) {
            console.error('Error loading site photos:', error);
            showToast('Failed to load site photos', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeProjectId]);

    // Handle Image Selection via ImagePicker
    const handlePickImage = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                showToast('Media library permission is required!', 'error');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                setSelectedImageUri(uri);
                if (formSubmittedAttempted) {
                    setFormValidationBannerVisible(false);
                    setTopErrorToastVisible(false);
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
            showToast('Could not open image picker', 'error');
        }
    };

    // Handle Save Site Photo Upload
    const handleSaveSitePhoto = async () => {
        setFormSubmittedAttempted(true);

        if (!selectedImageUri) {
            setFormValidationBannerVisible(true);
            showTopErrorToast('Mandatory fields required: Visual Artifact');
            return;
        }

        setSubmitting(true);
        try {
            const uploadPayload = {
                file: selectedImageUri,
                project_id: activeProjectId || formData.project_id || 1,
                activity_id: formData.activity_tag !== 'Select Activity' ? formData.activity_tag : undefined,
                location_id: formData.location_zone !== 'Select Location' ? formData.location_zone : undefined,
                task_id: formData.task_id || undefined,
                dsr_id: formData.dsr_id || undefined,
                description: formData.narrative_insight.trim() || undefined,
                observed_date: formData.observed_date
            };

            await sitePhotosService.uploadSitePhoto(uploadPayload);
            showToast('Site photo registered successfully!', 'success');
            setUploadModalVisible(false);
            setFormSubmittedAttempted(false);
            setFormValidationBannerVisible(false);
            setTopErrorToastVisible(false);
            setSelectedImageUri(null);
            setFormData({
                project_id: activeProjectId || 1,
                observed_date: new Date().toISOString().split('T')[0],
                task_id: '',
                task_name: 'Select Task...',
                dsr_id: '',
                dsr_name: 'Select DSR...',
                activity_tag: 'Select Activity',
                location_zone: 'Select Location',
                narrative_insight: ''
            });
            loadData();
        } catch (error) {
            console.error('Error uploading photo:', error);
            showToast('Failed to upload site photo', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Delete Confirmation Modal State
    const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const confirmDeletePhoto = (photoId: number | string) => {
        setDeleteTargetId(photoId);
        setDeleteConfirmModalVisible(true);
    };

    const executeDeletePhoto = async () => {
        if (!deleteTargetId) return;
        setDeleting(true);
        try {
            await sitePhotosService.deleteSitePhoto(deleteTargetId);
            showToast('Site photo deleted successfully!', 'success');
            setDeleteConfirmModalVisible(false);
            setViewModalVisible(false);
            setDeleteTargetId(null);
            loadData();
        } catch (error) {
            showToast('Failed to delete photo', 'error');
        } finally {
            setDeleting(false);
        }
    };

    // Filter & Sort Logic
    const getFilteredPhotos = () => {
        let result = photos.filter(item => {
            const desc = item.description || item.title || item.label || '';
            const auditId = String(item.id || item.photo_id || '');
            const matchesSearch = searchQuery === '' ||
                desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                auditId.includes(searchQuery);

            const categoryStr = (item.activity_tag || item.category || item.activity_name || item.label || '').toUpperCase();
            const matchesAct = !filterActivity || filterActivity === 'ALL ACTIVITIES' || categoryStr.includes(filterActivity.toUpperCase());

            const locStr = (item.location_tag || item.location_name || '').toUpperCase();
            const matchesLoc = !filterLocation || filterLocation === 'ALL LOCATIONS' || locStr.includes(filterLocation.toUpperCase());

            return matchesSearch && matchesAct && matchesLoc;
        });

        if (sortOrder === 'latest') {
            result.sort((a, b) => new Date(b.date || b.observed_date || b.created_at || 0).getTime() - new Date(a.date || a.observed_date || a.created_at || 0).getTime());
        } else {
            result.sort((a, b) => new Date(a.date || a.observed_date || a.created_at || 0).getTime() - new Date(a.date || a.observed_date || a.created_at || 0).getTime());
        }

        return result;
    };

    const currentProjObj = projects.find(p => String(p.id || (p as any).project_id) === String(activeProjectId));
    const currentProjName = currentProjObj?.name || (currentProjObj as any)?.project_name || activeProjectName || 'Metro City';

    const filteredList = getFilteredPhotos();
    const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
    const paginatedList = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Calculate Stats
    const totalEvidenceCount = photos.length;
    const recentLogsCount = photos.filter(p => {
        const d = new Date(p.observed_date || p.created_at || 0).getTime();
        return d > Date.now() - 7 * 24 * 60 * 60 * 1000;
    }).length;

    // Top Right Error Toast Renderer (Matches Image 2 & 3)
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
                            Mandatory fields required: Visual Artifact
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
                title="Site Evidence"
                subtitle={`Engineer > Site Photos > ${currentProjName}`}
            />

            {/* Global Toast Message */}
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
                contentContainerStyle={{ padding: isMobile ? 12 : 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={loadData} colors={['#2563EB']} />
                }
            >
                {/* ── HEADER & MAIN ACTIONS ROW (EXACT MATCH TO IMAGE 1) ────────── */}
                <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <View>
                        <Text style={{ fontSize: isMobile ? 20 : 24, fontWeight: '800', color: '#0F172A' }}>Evidence Documentation Ledger</Text>
                        <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Maintain a chronological visual archive of project progress milestones.</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            setFormData({
                                project_id: activeProjectId || 1,
                                observed_date: new Date().toISOString().split('T')[0],
                                task_id: '',
                                task_name: 'Select Task...',
                                dsr_id: '',
                                dsr_name: 'Select DSR...',
                                activity_tag: 'Select Activity',
                                location_zone: 'Select Location',
                                narrative_insight: ''
                            });
                            setSelectedImageUri(null);
                            setFormSubmittedAttempted(false);
                            setFormValidationBannerVisible(false);
                            setTopErrorToastVisible(false);
                            setUploadModalVisible(true);
                        }}
                        style={{
                            flexDirection: 'row', alignItems: 'center', gap: 8,
                            backgroundColor: '#2563EB', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10,
                            shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4
                        }}
                    >
                        <UploadCloud size={18} color="#fff" />
                        <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>Log Site Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* ── STAT CARDS ROW (EXACT MATCH TO IMAGE 1) ───────────────────── */}
                <View style={{ flexDirection: 'row', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
                    <View style={{ flex: 1, minWidth: isMobile ? '100%' : 260, backgroundColor: '#fff', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#2563EB', letterSpacing: 0.8, marginBottom: 6 }}>TOTAL EVIDENCE</Text>
                        <Text style={{ fontSize: 30, fontWeight: '800', color: '#0F172A' }}>{totalEvidenceCount}</Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: '600' }}>Project Archive</Text>
                    </View>

                    <View style={{ flex: 1, minWidth: isMobile ? '100%' : 260, backgroundColor: '#fff', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#10B981', letterSpacing: 0.8, marginBottom: 6 }}>RECENT LOGS</Text>
                        <Text style={{ fontSize: 30, fontWeight: '800', color: '#10B981' }}>{recentLogsCount}</Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: '600' }}>Past 7 Days</Text>
                    </View>
                </View>

                {/* ── SEARCH & FILTERS TOOLBAR (EXACT MATCH TO IMAGE 1 & IMAGE 3) ── */}
                <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center', flex: 1 }}>
                            {/* Search Input */}
                            <View style={{ flex: 1, minWidth: 200, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 10, height: 38 }}>
                                <Search size={15} color="#94A3B8" />
                                <TextInput
                                    style={{ flex: 1, fontSize: 12, color: '#0F172A', marginLeft: 8 }}
                                    placeholder="Search by description or audit ID..."
                                    placeholderTextColor="#94A3B8"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                            </View>

                            {/* Activity Filter Dropdown */}
                            <FloatingDropdown
                                displayValue={filterActivity || 'ALL ACTIVITIES'}
                                placeholder="ALL ACTIVITIES"
                                isOpen={actFilterOpen}
                                onToggle={() => setActFilterOpen(v => !v)}
                                onClose={() => setActFilterOpen(false)}
                                style={{ height: 38, minWidth: 160 }}
                            >
                                {(close) => (
                                    <ScrollView style={{ maxHeight: 240, padding: 6 }}>
                                        {ACTIVITIES_LIST.map(act => (
                                            <TouchableOpacity
                                                key={act}
                                                onPress={() => {
                                                    setFilterActivity(act === 'ALL ACTIVITIES' ? '' : act);
                                                    close();
                                                }}
                                                style={{
                                                    paddingVertical: 8, paddingHorizontal: 10,
                                                    backgroundColor: (filterActivity === act || (!filterActivity && act === 'ALL ACTIVITIES')) ? '#2563EB' : 'transparent',
                                                    borderRadius: 6
                                                }}
                                            >
                                                <Text style={{ fontSize: 11, fontWeight: '700', color: (filterActivity === act || (!filterActivity && act === 'ALL ACTIVITIES')) ? '#fff' : '#0F172A' }}>
                                                    {act}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                            </FloatingDropdown>

                            {/* Location Filter Dropdown */}
                            <FloatingDropdown
                                displayValue={filterLocation || 'ALL LOCATIONS'}
                                placeholder="ALL LOCATIONS"
                                isOpen={locFilterOpen}
                                onToggle={() => setLocFilterOpen(v => !v)}
                                onClose={() => setLocFilterOpen(false)}
                                style={{ height: 38, minWidth: 150 }}
                            >
                                {(close) => (
                                    <ScrollView style={{ maxHeight: 220, padding: 6 }}>
                                        {LOCATIONS_LIST.map(loc => (
                                            <TouchableOpacity
                                                key={loc}
                                                onPress={() => {
                                                    setFilterLocation(loc === 'ALL LOCATIONS' ? '' : loc);
                                                    close();
                                                }}
                                                style={{
                                                    paddingVertical: 8, paddingHorizontal: 10,
                                                    backgroundColor: (filterLocation === loc || (!filterLocation && loc === 'ALL LOCATIONS')) ? '#2563EB' : 'transparent',
                                                    borderRadius: 6
                                                }}
                                            >
                                                <Text style={{ fontSize: 11, fontWeight: '700', color: (filterLocation === loc || (!filterLocation && loc === 'ALL LOCATIONS')) ? '#fff' : '#0F172A' }}>
                                                    {loc}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                            </FloatingDropdown>

                            {/* Sort Order Dropdown Pill */}
                            <FloatingDropdown
                                displayValue={sortOrder === 'latest' ? 'Latest First' : 'Oldest First'}
                                placeholder="Latest First"
                                isOpen={sortFilterOpen}
                                onToggle={() => setSortFilterOpen(v => !v)}
                                onClose={() => setSortFilterOpen(false)}
                                style={{ height: 38, minWidth: 120, borderRadius: 20, borderColor: '#2563EB', backgroundColor: '#EFF6FF' }}
                            >
                                {(close) => (
                                    <View style={{ padding: 6 }}>
                                        <TouchableOpacity
                                            onPress={() => { setSortOrder('latest'); close(); }}
                                            style={{ paddingVertical: 8, paddingHorizontal: 10, backgroundColor: sortOrder === 'latest' ? '#2563EB' : 'transparent', borderRadius: 6 }}
                                        >
                                            <Text style={{ fontSize: 11, fontWeight: '700', color: sortOrder === 'latest' ? '#fff' : '#0F172A' }}>Latest First</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => { setSortOrder('oldest'); close(); }}
                                            style={{ paddingVertical: 8, paddingHorizontal: 10, backgroundColor: sortOrder === 'oldest' ? '#2563EB' : 'transparent', borderRadius: 6 }}
                                        >
                                            <Text style={{ fontSize: 11, fontWeight: '700', color: sortOrder === 'oldest' ? '#fff' : '#0F172A' }}>Oldest First</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </FloatingDropdown>
                        </View>

                        {/* Layout View Toggle (Grid / List) */}
                        <View style={{ flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 8, padding: 3, borderWidth: 1, borderColor: '#E2E8F0' }}>
                            <TouchableOpacity
                                onPress={() => setViewLayout('grid')}
                                style={{ padding: 6, borderRadius: 6, backgroundColor: viewLayout === 'grid' ? '#2563EB' : 'transparent' }}
                            >
                                <LayoutGrid size={16} color={viewLayout === 'grid' ? '#fff' : '#64748B'} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setViewLayout('list')}
                                style={{ padding: 6, borderRadius: 6, backgroundColor: viewLayout === 'list' ? '#2563EB' : 'transparent' }}
                            >
                                <ListIcon size={16} color={viewLayout === 'list' ? '#fff' : '#64748B'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* ── PHOTO CARDS GRID / LIST (EXACT MATCH TO IMAGE 2 & IMAGE 3) ── */}
                {loading ? (
                    <View style={{ padding: 60, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#2563EB" />
                        <Text style={{ marginTop: 12, fontSize: 13, color: '#64748B', fontWeight: '600' }}>Loading site evidence archive...</Text>
                    </View>
                ) : filteredList.length === 0 ? (
                    <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <FileImage size={44} color="#94A3B8" />
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#0F172A', marginTop: 12 }}>No site photos registered yet.</Text>
                        <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Click "+ Log Site Photo" above to upload evidence for your project.</Text>
                    </View>
                ) : viewLayout === 'list' ? (
                    /* ── TABLE LIST VIEW (EXACT MATCH TO IMAGE 2) ── */
                    <View style={{ backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                            <View style={{ minWidth: 920 }}>
                                {/* Header Row */}
                                <View style={{ flexDirection: 'row', backgroundColor: '#FAFAFA', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
                                    <Text style={{ width: 100, fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 }}>EVIDENCE</Text>
                                    <Text style={{ width: 140, fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 }}>PROJECT</Text>
                                    <Text style={{ width: 260, fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 }}>AUDIT DETAILS</Text>
                                    <Text style={{ width: 220, fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 }}>CATEGORY & DOMAIN</Text>
                                    <Text style={{ width: 160, fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 }}>TECHNICAL AUDITOR</Text>
                                    <Text style={{ width: 40, fontSize: 10, fontWeight: '800', color: '#64748B', textAlign: 'right', letterSpacing: 0.5 }}>ACTIONS</Text>
                                </View>

                                {/* Row Items */}
                                {paginatedList.map((item, idx) => {
                                    const photoIdStr = String(item.id || item.photo_id || idx + 1);
                                    const categoryLabel = (item.activity_tag || item.category || item.activity_name || item.label || 'FOUNDATION WORK').toUpperCase();
                                    const locationLabel = (item.location_tag || item.location_name || 'BLOCK A – GROUND FLOOR').toUpperCase();
                                    const rawUri = item.photo_url || item.file_url || item.image_url || item.url;
                                    const imageUri = getImageUrl(rawUri);
                                    const titleStr = item.description || item.title || 'Site Evidence Photo';
                                    const dateStr = toDisplay(item.date || item.observed_date || item.created_at) || '2026-09-28';

                                    return (
                                        <View key={item.id || idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                                            {/* EVIDENCE Thumbnail - NON-CLICKABLE (Popup disabled as requested) */}
                                            <View style={{ width: 100 }}>
                                                <View
                                                    style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' }}
                                                >
                                                    {imageUri ? (
                                                        <Image source={{ uri: imageUri }} style={{ width: 44, height: 44 }} resizeMode="cover" />
                                                    ) : (
                                                        <FileImage size={20} color="#94A3B8" />
                                                    )}
                                                </View>
                                            </View>

                                            {/* PROJECT */}
                                            <View style={{ width: 140 }}>
                                                <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A' }}>{currentProjName.toUpperCase()}</Text>
                                            </View>

                                            {/* AUDIT DETAILS */}
                                            <View style={{ width: 260, paddingRight: 12 }}>
                                                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8' }}>AUDIT-#{photoIdStr}</Text>
                                                <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A', marginTop: 2 }} numberOfLines={1}>{titleStr}</Text>
                                            </View>

                                            {/* CATEGORY & DOMAIN */}
                                            <View style={{ width: 220, paddingRight: 12 }}>
                                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#2563EB' }}>{categoryLabel}</Text>
                                                <Text style={{ fontSize: 10, fontWeight: '600', color: '#64748B', marginTop: 2 }}>{locationLabel}</Text>
                                            </View>

                                            {/* TECHNICAL AUDITOR WITH DATE */}
                                            <View style={{ width: 160, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#2563EB' }}>I</Text>
                                                </View>
                                                <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B' }}>{dateStr}</Text>
                                            </View>

                                            {/* ACTIONS */}
                                            <View style={{ width: 40, alignItems: 'flex-end' }}>
                                                <TouchableOpacity onPress={() => confirmDeletePhoto(item.id)} style={{ padding: 4 }}>
                                                    <Trash2 size={16} color="#94A3B8" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                ) : (
                    /* ── GRID CARDS VIEW (EXACT MATCH TO IMAGE 3) ── */
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 }}>
                        {paginatedList.map((item, idx) => {
                            const photoIdStr = String(item.id || item.photo_id || idx + 1);
                            const categoryLabel = (item.activity_tag || item.category || item.activity_name || item.label || 'FOUNDATION WORK').toUpperCase();
                            const rawUri = item.photo_url || item.file_url || item.image_url || item.url;
                            const imageUri = getImageUrl(rawUri);
                            const titleStr = item.description || item.title || 'DSR #22 SITE PHOTO';
                            const dateStr = toDisplay(item.date || item.observed_date || item.created_at) || '2026-09-28';

                            const itemWidth = isMobile ? '100%' : '25%';

                            return (
                                <View key={item.id || idx} style={{ width: itemWidth, padding: 8 }}>
                                    <View
                                        style={{
                                            backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0',
                                            overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.06, shadowRadius: 6, elevation: 3
                                        }}
                                    >
                                        {/* Image Display & Overlay Badges - NON-CLICKABLE (Popup disabled as requested) */}
                                        <View style={{ height: 160, width: '100%', backgroundColor: '#0F172A', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                                            {imageUri ? (
                                                <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                                            ) : (
                                                <View style={{ width: '100%', height: '100%', backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' }}>
                                                    <FileImage size={40} color="#64748B" />
                                                    <Text style={{ fontSize: 10, color: '#94A3B8', marginTop: 4, fontWeight: '700' }}>SITE EVIDENCE</Text>
                                                </View>
                                            )}

                                            {/* Top Category Badge (Black pill with white text) */}
                                            <View style={{
                                                position: 'absolute', top: 10, left: 10, zIndex: 10,
                                                backgroundColor: 'rgba(15,23,42,0.85)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6
                                            }}>
                                                <Text style={{ fontSize: 9, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 }}>
                                                    {categoryLabel}
                                                </Text>
                                            </View>

                                            {/* Actions Trash Delete Icon */}
                                            <TouchableOpacity
                                                onPress={() => confirmDeletePhoto(item.id)}
                                                style={{
                                                    position: 'absolute', top: 10, right: 10, zIndex: 10,
                                                    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12, padding: 5
                                                }}
                                            >
                                                <Trash2 size={14} color="#EF4444" />
                                            </TouchableOpacity>
                                        </View>

                                        {/* Card Body Info */}
                                        <View style={{ padding: 14 }}>
                                            {/* Audit Tag + Status Badge */}
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5 }}>
                                                    AUDIT-#{photoIdStr}
                                                </Text>
                                                <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, borderWidth: 1, borderColor: '#DBEAFE' }}>
                                                    <Text style={{ fontSize: 9, fontWeight: '800', color: '#2563EB' }}>
                                                        LIVE PROGRESS
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Description Title */}
                                            <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 12, lineHeight: 18 }} numberOfLines={2}>
                                                {titleStr}
                                            </Text>

                                            {/* Footer Avatar + Date */}
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
                                                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: 9, fontWeight: '800', color: '#FFFFFF' }}>IP</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                    <Calendar size={12} color="#94A3B8" />
                                                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B' }}>{dateStr}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* ── PAGINATION FOOTER ─────────────────────────────────────────── */}
                <PaginationFooter
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={filteredList.length}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                />

            </ScrollView>

            {/* ── MODAL 1: REGISTER SITE EVIDENCE FORM MODAL (EXACT MATCH TO IMAGE 2 & IMAGE 4) ── */}
            <Modal visible={uploadModalVisible} transparent animationType="slide" onRequestClose={() => setUploadModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 16, position: 'relative' }}>
                    {renderTopErrorToast()}

                    <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', maxHeight: '90%', width: '100%', maxWidth: 540, alignSelf: 'center' }}>
                        {/* Modal Header */}
                        <View style={{ borderBottomWidth: 1, borderBottomColor: '#F1F5F9', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>Register Site Evidence</Text>
                            <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
                                <X size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 16 }}>
                            {/* Validation Warning Alert Card inside Modal (Exact match to Image 2) */}
                            {formValidationBannerVisible && (
                                <View style={{
                                    backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECDD3', borderRadius: 10,
                                    padding: 12, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                                        <AlertTriangle size={16} color="#DC2626" />
                                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#991B1B' }}>
                                            Validation Error: Mandatory fields required: Visual Artifact
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setFormValidationBannerVisible(false)}>
                                        <X size={14} color="#991B1B" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Section 1: Visual Artifact */}
                            <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, marginBottom: 16 }}>
                                <Text style={{ fontSize: 12, fontWeight: '800', color: '#334155', marginBottom: 8 }}>
                                    Visual Artifact <Text style={{ color: '#EF4444' }}>*</Text>
                                </Text>

                                <TouchableOpacity
                                    onPress={handlePickImage}
                                    style={{
                                        borderWidth: 1.5,
                                        borderColor: (formSubmittedAttempted && !selectedImageUri) ? '#EF4444' : '#CBD5E1',
                                        borderStyle: 'dashed',
                                        borderRadius: 12,
                                        paddingVertical: selectedImageUri ? 10 : 30,
                                        paddingHorizontal: 16,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#F8FAFC',
                                        position: 'relative'
                                    }}
                                >
                                    {selectedImageUri ? (
                                        <View style={{ width: '100%', alignItems: 'center' }}>
                                            <Image source={{ uri: selectedImageUri }} style={{ width: '100%', height: 160, borderRadius: 8, marginBottom: 10 }} resizeMode="cover" />
                                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                                <TouchableOpacity onPress={handlePickImage} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#2563EB', borderRadius: 6 }}>
                                                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>Change Image</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => setSelectedImageUri(null)} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#FEF2F2', borderRadius: 6, borderWidth: 1, borderColor: '#FECDD3' }}>
                                                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#EF4444' }}>Remove</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ) : (
                                        <>
                                            <UploadCloud size={32} color="#94A3B8" />
                                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', marginTop: 8, letterSpacing: 0.5 }}>
                                                SELECT ASSET IMAGE
                                            </Text>
                                            <Text style={{ fontSize: 9, fontWeight: '800', color: '#EF4444', marginTop: 12, alignSelf: 'flex-start' }}>
                                                REQUIRED
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Section 2: Contextual Metadata */}
                            <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, marginBottom: 16 }}>
                                <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A', marginBottom: 12 }}>Contextual Metadata</Text>

                                {/* PROJECT CONTEXT & OBSERVED DATE */}
                                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#334155', marginBottom: 4 }}>
                                            Project Context <Text style={{ color: '#EF4444' }}>*</Text>
                                        </Text>
                                        <View style={{
                                            backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8,
                                            paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                                        }}>
                                            <Text style={{ fontSize: 13, color: '#0F172A', fontWeight: '600' }}>{currentProjName}</Text>
                                            <ChevronDown size={14} color="#94A3B8" />
                                        </View>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <DatePickerField
                                            label="OBSERVED DATE"
                                            required
                                            value={formData.observed_date}
                                            onChange={(iso) => setFormData(prev => ({ ...prev, observed_date: iso }))}
                                            openKey="form_observed_date"
                                            activeKey={activeDatePicker}
                                            setActiveKey={setActiveDatePicker}
                                        />
                                    </View>
                                </View>

                                {/* TASK (OPTIONAL) & DSR (OPTIONAL) ROW */}
                                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                                            Task <Text style={{ color: '#94A3B8', fontWeight: '400' }}>(optional)</Text>
                                        </Text>
                                        <FloatingDropdown
                                            displayValue={formData.task_name}
                                            placeholder="Select Task..."
                                            isOpen={formTaskOpen}
                                            onToggle={() => setFormTaskOpen(v => !v)}
                                            onClose={() => setFormTaskOpen(false)}
                                            style={{ height: 40 }}
                                        >
                                            {(close) => (
                                                <ScrollView style={{ maxHeight: 180, padding: 6 }}>
                                                    {tasksList.map(t => (
                                                        <TouchableOpacity
                                                            key={String(t.id)}
                                                            onPress={() => {
                                                                setFormData(prev => ({ ...prev, task_id: String(t.id), task_name: t.name }));
                                                                close();
                                                            }}
                                                            style={{ padding: 8 }}
                                                        >
                                                            <Text style={{ fontSize: 12, color: formData.task_id === String(t.id) ? '#2563EB' : '#0F172A', fontWeight: formData.task_id === String(t.id) ? '700' : '400' }}>
                                                                {t.name}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            )}
                                        </FloatingDropdown>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                                            DSR <Text style={{ color: '#94A3B8', fontWeight: '400' }}>(optional)</Text>
                                        </Text>
                                        <FloatingDropdown
                                            displayValue={formData.dsr_name}
                                            placeholder="Select DSR..."
                                            isOpen={formDsrOpen}
                                            onToggle={() => setFormDsrOpen(v => !v)}
                                            onClose={() => setFormDsrOpen(false)}
                                            style={{ height: 40 }}
                                        >
                                            {(close) => (
                                                <ScrollView style={{ maxHeight: 180, padding: 6 }}>
                                                    {dsrList.map(d => (
                                                        <TouchableOpacity
                                                            key={String(d.id)}
                                                            onPress={() => {
                                                                setFormData(prev => ({ ...prev, dsr_id: String(d.id), dsr_name: d.name }));
                                                                close();
                                                            }}
                                                            style={{ padding: 8 }}
                                                        >
                                                            <Text style={{ fontSize: 12, color: formData.dsr_id === String(d.id) ? '#2563EB' : '#0F172A', fontWeight: formData.dsr_id === String(d.id) ? '700' : '400' }}>
                                                                {d.name}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            )}
                                        </FloatingDropdown>
                                    </View>
                                </View>

                                {/* ACTIVITY TAG & LOCATION ZONE ROW */}
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>Activity Tag</Text>
                                        <FloatingDropdown
                                            displayValue={formData.activity_tag}
                                            placeholder="Select Activity"
                                            isOpen={formActOpen}
                                            onToggle={() => setFormActOpen(v => !v)}
                                            onClose={() => setFormActOpen(false)}
                                            style={{ height: 40 }}
                                        >
                                            {(close) => (
                                                <ScrollView style={{ maxHeight: 180, padding: 6 }}>
                                                    {ACTIVITIES_LIST.map(a => (
                                                        <TouchableOpacity
                                                            key={a}
                                                            onPress={() => {
                                                                setFormData(prev => ({ ...prev, activity_tag: a }));
                                                                close();
                                                            }}
                                                            style={{ padding: 8 }}
                                                        >
                                                            <Text style={{ fontSize: 12, color: formData.activity_tag === a ? '#2563EB' : '#0F172A', fontWeight: formData.activity_tag === a ? '700' : '400' }}>
                                                                {a}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            )}
                                        </FloatingDropdown>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>Location Zone</Text>
                                        <FloatingDropdown
                                            displayValue={formData.location_zone}
                                            placeholder="Select Location"
                                            isOpen={formLocOpen}
                                            onToggle={() => setFormLocOpen(v => !v)}
                                            onClose={() => setFormLocOpen(false)}
                                            style={{ height: 40 }}
                                        >
                                            {(close) => (
                                                <ScrollView style={{ maxHeight: 180, padding: 6 }}>
                                                    {FORM_LOCATIONS_LIST.map(l => (
                                                        <TouchableOpacity
                                                            key={l}
                                                            onPress={() => {
                                                                setFormData(prev => ({ ...prev, location_zone: l }));
                                                                close();
                                                            }}
                                                            style={{ padding: 8 }}
                                                        >
                                                            <Text style={{ fontSize: 12, color: formData.location_zone === l ? '#2563EB' : '#0F172A', fontWeight: formData.location_zone === l ? '700' : '400' }}>
                                                                {l}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            )}
                                        </FloatingDropdown>
                                    </View>
                                </View>
                            </View>

                            {/* Section 3: Observation Narrative */}
                            <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, marginBottom: 20 }}>
                                <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A', marginBottom: 8 }}>Observation Narrative</Text>

                                <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 4 }}>NARRATIVE INSIGHT</Text>
                                <TextInput
                                    style={{
                                        backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8,
                                        padding: 12, minHeight: 80, textAlignVertical: 'top', fontSize: 13, color: '#0F172A'
                                    }}
                                    multiline
                                    numberOfLines={4}
                                    placeholder=""
                                    value={formData.narrative_insight}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, narrative_insight: text }))}
                                />
                            </View>

                            {/* Modal Footer Buttons */}
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginBottom: 20 }}>
                                <TouchableOpacity
                                    onPress={() => setUploadModalVisible(false)}
                                    style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F1F5F9' }}
                                >
                                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={submitting}
                                    onPress={handleSaveSitePhoto}
                                    style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, backgroundColor: '#2563EB', flexDirection: 'row', alignItems: 'center', gap: 6 }}
                                >
                                    {submitting ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Save Site Photo</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ── MODAL 2: VIEW PHOTO DETAIL MODAL ─────────────────────────────── */}
            <Modal visible={viewModalVisible} transparent animationType="fade" onRequestClose={() => setViewModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.7)', justifyContent: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', maxWidth: 500, alignSelf: 'center', width: '100%' }}>
                        {/* Header */}
                        <View style={{ paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>Site Evidence Insight</Text>
                            <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                                <X size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 20 }}>
                            {/* Full Image Preview */}
                            <View style={{ height: 220, width: '100%', borderRadius: 14, overflow: 'hidden', backgroundColor: '#0F172A', marginBottom: 16, justifyContent: 'center', alignItems: 'center' }}>
                                {selectedPhoto?.file_url || selectedPhoto?.image_url || selectedPhoto?.photo_url || selectedPhoto?.url ? (
                                    <Image source={{ uri: selectedPhoto.file_url || selectedPhoto.image_url || selectedPhoto.photo_url || selectedPhoto.url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                                ) : (
                                    <FileImage size={48} color="#64748B" />
                                )}
                            </View>

                            {/* Details Section */}
                            <View style={{ marginBottom: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#2563EB' }}>
                                        AUDIT-#{selectedPhoto?.id || '1'}
                                    </Text>
                                    <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#10B981' }}>LIVE PROGRESS</Text>
                                    </View>
                                </View>

                                <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 12 }}>
                                    {selectedPhoto?.description || selectedPhoto?.title || 'Site Evidence Photo'}
                                </Text>

                                <View style={{ backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 14 }}>
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', marginBottom: 4 }}>PROJECT</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A' }}>{currentProjName.toUpperCase()}</Text>

                                    <View style={{ flexDirection: 'row', gap: 14, marginTop: 10 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', marginBottom: 2 }}>OBSERVED DATE</Text>
                                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#334155' }}>
                                                {toDisplay(selectedPhoto?.observed_date || selectedPhoto?.created_at) || '2026-09-28'}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', marginBottom: 2 }}>CATEGORY</Text>
                                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#334155' }}>
                                                {(selectedPhoto?.category || selectedPhoto?.activity_name || selectedPhoto?.label || 'FOUNDATION WORK').toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Actions */}
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                {selectedPhoto?.id && (
                                    <TouchableOpacity
                                        onPress={() => confirmDeletePhoto(selectedPhoto.id)}
                                        style={{ flex: 1, backgroundColor: '#FEF2F2', borderBottomColor: '#FECDD3', borderWidth: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                                    >
                                        <Trash2 size={16} color="#DC2626" />
                                        <Text style={{ fontSize: 12, fontWeight: '800', color: '#DC2626' }}>Delete Photo</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    onPress={() => setViewModalVisible(false)}
                                    style={{ flex: 1, backgroundColor: '#2563EB', borderRadius: 10, paddingVertical: 12, alignItems: 'center' }}
                                >
                                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#fff' }}>Dismiss</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ── MODAL 3: DISCARD EVIDENCE ARTIFACT CONFIRMATION MODAL (EXACT MATCH TO IMAGE) ── */}
            <Modal visible={deleteConfirmModalVisible} transparent animationType="fade" onRequestClose={() => setDeleteConfirmModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 20, width: '100%', maxWidth: 420, overflow: 'hidden', padding: 24 }}>
                        {/* Header with Title and Close X */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Discard Evidence Artifact</Text>
                            <TouchableOpacity onPress={() => setDeleteConfirmModalVisible(false)} style={{ padding: 4 }}>
                                <X size={18} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>

                        {/* Soft border separator line */}
                        <View style={{ height: 1, backgroundColor: '#F1F5F9', marginHorizontal: -24, marginBottom: 20 }} />

                        {/* Warning Icon Badge in Center */}
                        <View style={{ alignItems: 'center', marginVertical: 8 }}>
                            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF1F2', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                <AlertTriangle size={26} color="#E11D48" />
                            </View>

                            {/* Warning Description */}
                            <Text style={{ fontSize: 14, color: '#475569', textAlign: 'center', lineHeight: 22, paddingHorizontal: 12 }}>
                                Are you sure you want to discard this photographic artifact from the project vault? This operation is irreversible.
                            </Text>
                        </View>

                        {/* Action Buttons: Cancel and Archive Artifact */}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 24 }}>
                            <TouchableOpacity
                                onPress={() => setDeleteConfirmModalVisible(false)}
                                style={{ paddingHorizontal: 16, paddingVertical: 10 }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748B' }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={deleting}
                                onPress={executeDeletePhoto}
                                style={{
                                    backgroundColor: '#FF0055',
                                    paddingHorizontal: 20,
                                    paddingVertical: 12,
                                    borderRadius: 12,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 6
                                }}
                            >
                                {deleting ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Archive Artifact</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
