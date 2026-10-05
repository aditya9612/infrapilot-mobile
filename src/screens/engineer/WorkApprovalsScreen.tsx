import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, ScrollView, TextInput, TouchableOpacity,
    ActivityIndicator, Modal, Pressable, RefreshControl, useWindowDimensions
} from 'react-native';
import {
    Plus, Search, ChevronDown, RefreshCw, Check, X,
    Eye, Filter, Clock, CheckCircle2, ShieldCheck, FileText, Layers
} from 'lucide-react-native';
import TopHeader from '../../components/TopHeader';
import { useProjectContext } from '../../contexts/ProjectContext';
import { approvalService } from '../../services/approvalService';
import { projectService } from '../../services/projectService';
import type { WorkApprovalItem } from '../../types/approval';

// ─── Floating Dropdown Component ──────────────────────────────────────────────
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

// ─── Pagination Footer Dropdown ───────────────────────────────────────────────
function RecordsPerPageDropdown({ value, onChange }: { value: number; onChange: (limit: number) => void; }) {
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

const CATEGORIES_LIST = ['ALL CATEGORIES', 'PURCHASE_ORDER', 'BOQ', 'DRAWING', 'SAFETY_INSPECTION', 'OTHER'];
const STATUS_TYPES = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

export default function WorkApprovalsScreen() {
    const { activeProjectId, activeProjectName, projects } = useProjectContext();
    const { width: windowWidth } = useWindowDimensions();
    const isMobile = windowWidth < 768;

    // Data State
    const [approvals, setApprovals] = useState<WorkApprovalItem[]>([]);
    const [projectsList, setProjectsList] = useState<{ id: string | number; name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterCategory, setFilterCategory] = useState('ALL CATEGORIES');
    const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

    // Dropdown open states
    const [statusFilterOpen, setStatusFilterOpen] = useState(false);
    const [catFilterOpen, setCatFilterOpen] = useState(false);
    const [sortFilterOpen, setSortFilterOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Modal States
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedApproval, setSelectedApproval] = useState<WorkApprovalItem | null>(null);

    // Form Modal Dropdown Open States
    const [formProjOpen, setFormProjOpen] = useState(false);
    const [formCatOpen, setFormCatOpen] = useState(false);

    // Form Validation State
    const [formSubmittedAttempted, setFormSubmittedAttempted] = useState(false);

    // Form Data State
    const [formData, setFormData] = useState({
        project_id: activeProjectId || '',
        project_name: '-- Select Project --',
        approval_type: 'PURCHASE_ORDER',
        remarks: ''
    });

    // Toast Notification
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastMsg(msg);
        setToastType(type);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const pid = activeProjectId ? parseInt(activeProjectId.toString()) : undefined;
            const [appData, projData] = await Promise.all([
                approvalService.getApprovals({ project_id: pid }).catch(() => null),
                projectService.getProjects().catch(() => [])
            ]);

            const arr = Array.isArray(appData) ? appData : (appData?.data || appData?.items || []);
            setApprovals(arr || []);

            // Normalize Projects
            const rawProjArr = Array.isArray(projData) ? projData : ((projData as any)?.items || (projData as any)?.data || []);
            if (rawProjArr.length > 0) {
                const norm = rawProjArr.map((p: any) => ({
                    id: p.id ?? p.project_id,
                    name: p.name || p.project_name || p.title || `Project #${p.id}`
                }));
                setProjectsList(norm);
            } else if (projects.length > 0) {
                setProjectsList(projects.map(p => ({ id: p.id, name: p.name || (p as any).project_name || `Project #${p.id}` })));
            }
        } catch (error) {
            console.error('Error loading work approvals:', error);
            showToast('Failed to load work approvals', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeProjectId]);

    // Handle Create Approval
    const handleSaveApproval = async () => {
        setFormSubmittedAttempted(true);

        const hasProject = Boolean(formData.project_id);
        const hasRemarks = Boolean(formData.remarks.trim());

        if (!hasProject || !hasRemarks) {
            showToast('Please fill all required fields', 'error');
            return;
        }

        setSubmitting(true);
        try {
            await approvalService.createApproval({
                project_id: formData.project_id,
                approval_type: formData.approval_type,
                remarks: formData.remarks.trim()
            });

            showToast('Approval request submitted successfully!', 'success');
            setFormModalVisible(false);
            setFormSubmittedAttempted(false);
            setFormData({
                project_id: activeProjectId || '',
                project_name: '-- Select Project --',
                approval_type: 'PURCHASE_ORDER',
                remarks: ''
            });
            loadData();
        } catch (error) {
            console.error('Error saving approval:', error);
            showToast('Failed to save approval request', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Approve
    const handleApprove = async (id: number | string) => {
        try {
            await approvalService.approve(id);
            showToast('Work request approved successfully!', 'success');
            loadData();
        } catch (error) {
            showToast('Failed to approve request', 'error');
        }
    };

    // Handle Reject
    const handleReject = async (id: number | string) => {
        try {
            await approvalService.reject(id);
            showToast('Work request rejected!', 'success');
            loadData();
        } catch (error) {
            showToast('Failed to reject request', 'error');
        }
    };

    // Filter & Sort Logic
    const getFilteredApprovals = () => {
        let result = approvals.filter(item => {
            const remarksStr = (item.remarks || item.description || item.title || '').toLowerCase();
            const typeStr = (item.approval_type || item.type || item.category || '').toLowerCase();
            const idStr = String(item.id || '');
            const matchesSearch = searchQuery === '' ||
                remarksStr.includes(searchQuery.toLowerCase()) ||
                typeStr.includes(searchQuery.toLowerCase()) ||
                idStr.includes(searchQuery);

            const itemStatus = (item.status || 'PENDING').toUpperCase();
            const matchesStatus = filterStatus === 'ALL' || itemStatus === filterStatus;

            const itemCategory = (item.approval_type || item.type || item.category || 'PURCHASE_ORDER').toUpperCase();
            const matchesCategory = filterCategory === 'ALL CATEGORIES' || itemCategory.includes(filterCategory.toUpperCase());

            return matchesSearch && matchesStatus && matchesCategory;
        });

        if (sortOrder === 'latest') {
            result.sort((a, b) => new Date(b.created_at || b.updated_at || 0).getTime() - new Date(a.created_at || a.updated_at || 0).getTime());
        } else {
            result.sort((a, b) => new Date(a.created_at || a.updated_at || 0).getTime() - new Date(b.created_at || b.updated_at || 0).getTime());
        }

        return result;
    };

    const currentProjObj = projects.find(p => String(p.id || (p as any).project_id) === String(activeProjectId));
    const currentProjName = currentProjObj?.name || (currentProjObj as any)?.project_name || activeProjectName || 'Metro City';

    const filteredList = getFilteredApprovals();
    const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
    const paginatedList = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Calculate Stats (Matching Image 4)
    const totalLogsCount = approvals.length;
    const approvedCount = approvals.filter(a => (a.status || '').toUpperCase() === 'APPROVED').length;
    const pendingRejectCount = approvals.filter(a => (a.status || 'PENDING').toUpperCase() === 'PENDING' || (a.status || '').toUpperCase() === 'REJECTED').length;
    const clearanceRate = totalLogsCount > 0 ? Math.round((approvedCount / totalLogsCount) * 100) : 62;

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <TopHeader
                title="Work Approvals"
                subtitle={`Engineer > Approvals > Technical Clearance`}
            />

            {/* Global Toast */}
            {toastVisible && (
                <View style={{
                    position: 'absolute', top: 70, left: 16, right: 16, zIndex: 9999,
                    backgroundColor: toastType === 'error' ? '#DC2626' : '#16A34A',
                    padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 8,
                    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 6
                }}>
                    <CheckCircle2 size={16} color="#fff" />
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
                {/* ── HEADER & ACTIONS ROW (EXACT MATCH TO IMAGE 4) ────────── */}
                <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <View>
                        <Text style={{ fontSize: isMobile ? 20 : 24, fontWeight: '800', color: '#0F172A' }}>Approvals</Text>
                        <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Technical clearance portal for critical site activities and execution milestones.</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <TouchableOpacity
                            onPress={loadData}
                            style={{
                                flexDirection: 'row', alignItems: 'center', gap: 6,
                                backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1',
                                paddingHorizontal: 14, paddingVertical: 9, borderRadius: 8
                            }}
                        >
                            <RefreshCw size={14} color="#475569" />
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#334155' }}>Refresh</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                const defaultProj = projectsList[0] || { id: activeProjectId || 1, name: currentProjName };
                                setFormData({
                                    project_id: defaultProj.id,
                                    project_name: defaultProj.name,
                                    approval_type: 'PURCHASE_ORDER',
                                    remarks: ''
                                });
                                setFormSubmittedAttempted(false);
                                setFormModalVisible(true);
                            }}
                            style={{
                                flexDirection: 'row', alignItems: 'center', gap: 6,
                                backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 8,
                                shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4
                            }}
                        >
                            <Plus size={16} color="#fff" />
                            <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>Approval</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── STAT CARDS ROW (EXACT MATCH TO IMAGE 4) ───────────────────── */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                    <View style={{ flex: 1, minWidth: isMobile ? '47%' : 200, backgroundColor: '#fff', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 6 }}>TOTAL LOGS</Text>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: '#0F172A' }}>{totalLogsCount}</Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: '600' }}>Activity Baseline</Text>
                    </View>

                    <View style={{ flex: 1, minWidth: isMobile ? '47%' : 200, backgroundColor: '#fff', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#10B981', letterSpacing: 0.8, marginBottom: 6 }}>APPROVED</Text>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: '#10B981' }}>{approvedCount}</Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: '600' }}>Work Authorized</Text>
                    </View>

                    <View style={{ flex: 1, minWidth: isMobile ? '47%' : 200, backgroundColor: '#fff', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#EF4444', letterSpacing: 0.8, marginBottom: 6 }}>PENDING/ REJECT</Text>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: '#EF4444' }}>{pendingRejectCount}</Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: '600' }}>Awaiting Clearance</Text>
                    </View>

                    <View style={{ flex: 1, minWidth: isMobile ? '47%' : 200, backgroundColor: '#fff', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#2563EB', letterSpacing: 0.8, marginBottom: 6 }}>CLEARANCE RATE</Text>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: '#2563EB' }}>{clearanceRate}%</Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: '600' }}>Avg Site Precision</Text>
                    </View>
                </View>

                {/* ── SEARCH & FILTERS TOOLBAR (EXACT MATCH TO IMAGE 4) ─────────── */}
                <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, minWidth: 220, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 10, height: 38 }}>
                            <Search size={15} color="#94A3B8" />
                            <TextInput
                                style={{ flex: 1, fontSize: 12, color: '#0F172A', marginLeft: 8 }}
                                placeholder="Search by activity, ID or remarks..."
                                placeholderTextColor="#94A3B8"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8 }}>ACTIVE FILTER:</Text>

                            {/* Status Filter */}
                            <FloatingDropdown
                                displayValue={filterStatus}
                                placeholder="SELECT"
                                isOpen={statusFilterOpen}
                                onToggle={() => setStatusFilterOpen(v => !v)}
                                onClose={() => setStatusFilterOpen(false)}
                                style={{ height: 36, minWidth: 100 }}
                            >
                                {(close) => (
                                    <View style={{ padding: 6 }}>
                                        {STATUS_TYPES.map(st => (
                                            <TouchableOpacity
                                                key={st}
                                                onPress={() => { setFilterStatus(st); close(); }}
                                                style={{ paddingVertical: 6, paddingHorizontal: 10, backgroundColor: filterStatus === st ? '#EFF6FF' : 'transparent', borderRadius: 6 }}
                                            >
                                                <Text style={{ fontSize: 11, fontWeight: '700', color: filterStatus === st ? '#2563EB' : '#0F172A' }}>{st}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </FloatingDropdown>

                            {/* Sort Filter */}
                            <FloatingDropdown
                                displayValue={sortOrder === 'latest' ? 'LATEST FIRST' : 'OLDEST FIRST'}
                                placeholder="LATEST FIRST"
                                isOpen={sortFilterOpen}
                                onToggle={() => setSortFilterOpen(v => !v)}
                                onClose={() => setSortFilterOpen(false)}
                                style={{ height: 36, minWidth: 120, borderColor: '#2563EB', backgroundColor: '#EFF6FF' }}
                            >
                                {(close) => (
                                    <View style={{ padding: 6 }}>
                                        <TouchableOpacity onPress={() => { setSortOrder('latest'); close(); }} style={{ paddingVertical: 6, paddingHorizontal: 10, backgroundColor: sortOrder === 'latest' ? '#2563EB' : 'transparent', borderRadius: 6 }}>
                                            <Text style={{ fontSize: 11, fontWeight: '700', color: sortOrder === 'latest' ? '#fff' : '#0F172A' }}>LATEST FIRST</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { setSortOrder('oldest'); close(); }} style={{ paddingVertical: 6, paddingHorizontal: 10, backgroundColor: sortOrder === 'oldest' ? '#2563EB' : 'transparent', borderRadius: 6 }}>
                                            <Text style={{ fontSize: 11, fontWeight: '700', color: sortOrder === 'oldest' ? '#fff' : '#0F172A' }}>OLDEST FIRST</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </FloatingDropdown>

                            {/* Category Filter */}
                            <FloatingDropdown
                                displayValue={filterCategory}
                                placeholder="ALL CATEGORIES"
                                isOpen={catFilterOpen}
                                onToggle={() => setCatFilterOpen(v => !v)}
                                onClose={() => setCatFilterOpen(false)}
                                style={{ height: 36, minWidth: 140 }}
                            >
                                {(close) => (
                                    <View style={{ padding: 6 }}>
                                        {CATEGORIES_LIST.map(cat => (
                                            <TouchableOpacity
                                                key={cat}
                                                onPress={() => { setFilterCategory(cat); close(); }}
                                                style={{ paddingVertical: 6, paddingHorizontal: 10, backgroundColor: filterCategory === cat ? '#EFF6FF' : 'transparent', borderRadius: 6 }}
                                            >
                                                <Text style={{ fontSize: 11, fontWeight: '700', color: filterCategory === cat ? '#2563EB' : '#0F172A' }}>{cat}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </FloatingDropdown>
                        </View>
                    </View>
                </View>

                {/* ── TABLE LIST VIEW (EXACT MATCH TO IMAGE 4) ──────────────────── */}
                {loading ? (
                    <View style={{ padding: 60, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#2563EB" />
                        <Text style={{ marginTop: 12, fontSize: 13, color: '#64748B', fontWeight: '600' }}>Loading work approvals...</Text>
                    </View>
                ) : filteredList.length === 0 ? (
                    <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <ShieldCheck size={40} color="#94A3B8" />
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#0F172A', marginTop: 12 }}>No work approvals found.</Text>
                        <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Click "+ Approval" above to request clearance for a site activity.</Text>
                    </View>
                ) : (
                    <View style={{ backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                            <View style={{ minWidth: 840 }}>
                                {/* Table Header */}
                                <View style={{ flexDirection: 'row', backgroundColor: '#FAFAFA', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
                                    <Text style={{ width: 220, fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 }}>WORK AUTHORIZATION</Text>
                                    <Text style={{ width: 160, fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 }}>STATUS</Text>
                                    <Text style={{ width: 320, fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 }}>REMARKS</Text>
                                    <Text style={{ width: 140, fontSize: 10, fontWeight: '800', color: '#64748B', textAlign: 'right', letterSpacing: 0.5 }}>ACTIONS</Text>
                                </View>

                                {/* Table Row Mapping */}
                                {paginatedList.map((item, idx) => {
                                    const authTitle = (item.approval_type || item.type || item.category || 'PURCHASE_ORDER').toUpperCase();
                                    const statusStr = (item.status || 'PENDING').toUpperCase();
                                    const remarksStr = item.remarks || item.description || item.title || 'No technical narrative narrated';
                                    const isPending = statusStr === 'PENDING';

                                    return (
                                        <View key={item.id || idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                                            {/* WORK AUTHORIZATION */}
                                            <View style={{ width: 220, paddingRight: 12 }}>
                                                <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A' }}>{authTitle}</Text>
                                                <Text style={{ fontSize: 10, fontWeight: '600', color: '#94A3B8', marginTop: 2 }}>AUTH LOG</Text>
                                            </View>

                                            {/* STATUS */}
                                            <View style={{ width: 160 }}>
                                                <View style={{
                                                    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
                                                    backgroundColor: statusStr === 'APPROVED' ? '#ECFDF5' : statusStr === 'REJECTED' ? '#FEF2F2' : '#FFFBEB',
                                                    borderWidth: 1, borderColor: statusStr === 'APPROVED' ? '#A7F3D0' : statusStr === 'REJECTED' ? '#FECDD3' : '#FDE68A'
                                                }}>
                                                    <Text style={{
                                                        fontSize: 10, fontWeight: '800', letterSpacing: 0.5,
                                                        color: statusStr === 'APPROVED' ? '#059669' : statusStr === 'REJECTED' ? '#DC2626' : '#D97706'
                                                    }}>
                                                        {statusStr}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* REMARKS */}
                                            <View style={{ width: 320, paddingRight: 16 }}>
                                                <Text style={{ fontSize: 11, color: '#475569', fontWeight: '500' }} numberOfLines={2}>
                                                    {remarksStr}
                                                </Text>
                                            </View>

                                            {/* ACTIONS */}
                                            <View style={{ width: 140, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
                                                <TouchableOpacity onPress={() => { setSelectedApproval(item); setViewModalVisible(true); }} style={{ padding: 4 }}>
                                                    <Eye size={16} color="#94A3B8" />
                                                </TouchableOpacity>

                                                {isPending && (
                                                    <>
                                                        <TouchableOpacity onPress={() => handleApprove(item.id)} style={{ padding: 4 }}>
                                                            <Check size={16} color="#16A34A" />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => handleReject(item.id)} style={{ padding: 4 }}>
                                                            <X size={16} color="#DC2626" />
                                                        </TouchableOpacity>
                                                    </>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                )}

                {/* ── PAGINATION FOOTER ─────────────────────────────────────────── */}
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF',
                    borderTopWidth: 1, borderTopColor: '#E2E8F0', flexWrap: 'wrap', gap: 10, borderRadius: 12, marginTop: 16
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{ fontSize: 11, color: '#64748B' }}>Records per page:</Text>
                        <RecordsPerPageDropdown value={pageSize} onChange={(sz) => { setPageSize(sz); setCurrentPage(1); }} />
                    </View>

                    <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '500' }}>
                        Showing {filteredList.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredList.length)} of {filteredList.length} records
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <TouchableOpacity
                            disabled={currentPage === 1}
                            onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
                            style={{ padding: 6, borderRadius: 6, backgroundColor: currentPage === 1 ? '#F1F5F9' : '#FFF', borderWidth: 1, borderColor: '#CBD5E1', opacity: currentPage === 1 ? 0.5 : 1 }}
                        >
                            <Text style={{ fontSize: 12, color: '#334155' }}>{'<'}</Text>
                        </TouchableOpacity>
                        <View style={{ minWidth: 26, height: 26, borderRadius: 6, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{currentPage}</Text>
                        </View>
                        <TouchableOpacity
                            disabled={currentPage >= totalPages}
                            onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            style={{ padding: 6, borderRadius: 6, backgroundColor: currentPage >= totalPages ? '#F1F5F9' : '#FFF', borderWidth: 1, borderColor: '#CBD5E1', opacity: currentPage >= totalPages ? 0.5 : 1 }}
                        >
                            <Text style={{ fontSize: 12, color: '#334155' }}>{'>'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>

            {/* ── MODAL 1: CREATE WORK APPROVAL FORM MODAL ───────────────────── */}
            <Modal visible={formModalVisible} transparent animationType="slide" onRequestClose={() => setFormModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 16 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', maxHeight: '90%', width: '100%', maxWidth: 520, alignSelf: 'center' }}>
                        {/* Modal Header */}
                        <View style={{ borderBottomWidth: 1, borderBottomColor: '#F1F5F9', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>Create Work Approval</Text>
                            <TouchableOpacity onPress={() => setFormModalVisible(false)}>
                                <X size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 16 }}>
                            {/* Project Field */}
                            <View style={{ marginBottom: 14 }}>
                                <Text style={{ fontSize: 11, fontWeight: '700', color: '#334155', marginBottom: 4 }}>
                                    Project <Text style={{ color: '#EF4444' }}>*</Text>
                                </Text>
                                <FloatingDropdown
                                    displayValue={formData.project_name}
                                    placeholder="-- Select Project --"
                                    isOpen={formProjOpen}
                                    onToggle={() => setFormProjOpen(v => !v)}
                                    onClose={() => setFormProjOpen(false)}
                                    style={{ height: 40 }}
                                >
                                    {(close) => (
                                        <ScrollView style={{ maxHeight: 180, padding: 6 }}>
                                            {projectsList.map(p => (
                                                <TouchableOpacity
                                                    key={String(p.id)}
                                                    onPress={() => {
                                                        setFormData(prev => ({ ...prev, project_id: p.id, project_name: p.name }));
                                                        close();
                                                    }}
                                                    style={{ padding: 8 }}
                                                >
                                                    <Text style={{ fontSize: 12, color: formData.project_id === p.id ? '#2563EB' : '#0F172A', fontWeight: formData.project_id === p.id ? '700' : '400' }}>
                                                        {p.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    )}
                                </FloatingDropdown>
                            </View>

                            {/* Approval Type Field */}
                            <View style={{ marginBottom: 14 }}>
                                <Text style={{ fontSize: 11, fontWeight: '700', color: '#334155', marginBottom: 4 }}>
                                    Approval Category / Type <Text style={{ color: '#EF4444' }}>*</Text>
                                </Text>
                                <FloatingDropdown
                                    displayValue={formData.approval_type}
                                    placeholder="PURCHASE_ORDER"
                                    isOpen={formCatOpen}
                                    onToggle={() => setFormCatOpen(v => !v)}
                                    onClose={() => setFormCatOpen(false)}
                                    style={{ height: 40 }}
                                >
                                    {(close) => (
                                        <View style={{ padding: 6 }}>
                                            {['PURCHASE_ORDER', 'BOQ', 'DRAWING', 'SAFETY_INSPECTION', 'OTHER'].map(cat => (
                                                <TouchableOpacity
                                                    key={cat}
                                                    onPress={() => {
                                                        setFormData(prev => ({ ...prev, approval_type: cat }));
                                                        close();
                                                    }}
                                                    style={{ padding: 8 }}
                                                >
                                                    <Text style={{ fontSize: 12, color: formData.approval_type === cat ? '#2563EB' : '#0F172A', fontWeight: formData.approval_type === cat ? '700' : '400' }}>
                                                        {cat}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </FloatingDropdown>
                            </View>

                            {/* Remarks Field */}
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#334155', marginBottom: 4 }}>
                                    TECHNICAL NARRATIVE / REMARKS <Text style={{ color: '#EF4444' }}>*</Text>
                                </Text>
                                <TextInput
                                    style={{
                                        backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8,
                                        padding: 12, minHeight: 90, textAlignVertical: 'top', fontSize: 13, color: '#0F172A'
                                    }}
                                    multiline
                                    numberOfLines={4}
                                    placeholder="Describe technical approval request..."
                                    value={formData.remarks}
                                    onChangeText={(txt) => setFormData(prev => ({ ...prev, remarks: txt }))}
                                />
                            </View>

                            {/* Modal Footer */}
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginBottom: 16 }}>
                                <TouchableOpacity
                                    onPress={() => setFormModalVisible(false)}
                                    style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#fff' }}
                                >
                                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#475569' }}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={submitting}
                                    onPress={handleSaveApproval}
                                    style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, backgroundColor: '#2563EB', flexDirection: 'row', alignItems: 'center', gap: 6 }}
                                >
                                    {submitting ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>SAVE APPROVAL</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ── MODAL 2: VIEW APPROVAL DETAIL MODAL ────────────────────────── */}
            <Modal visible={viewModalVisible} transparent animationType="fade" onRequestClose={() => setViewModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, maxWidth: 460, width: '100%', alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 12 }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>Work Authorization Detail</Text>
                            <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                                <X size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#2563EB', marginBottom: 2 }}>
                                {(selectedApproval?.approval_type || selectedApproval?.type || selectedApproval?.category || 'PURCHASE_ORDER').toUpperCase()}
                            </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 10 }}>
                                {selectedApproval?.remarks || selectedApproval?.description || 'No technical narrative narrated'}
                            </Text>

                            <View style={{ backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 8 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>Status:</Text>
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: selectedApproval?.status === 'APPROVED' ? '#059669' : selectedApproval?.status === 'REJECTED' ? '#DC2626' : '#D97706' }}>
                                        {selectedApproval?.status || 'PENDING'}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>Project:</Text>
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#0F172A' }}>{currentProjName}</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => setViewModalVisible(false)} style={{ backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
