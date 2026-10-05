import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, ScrollView, TextInput, TouchableOpacity,
    ActivityIndicator, Modal, Pressable, RefreshControl, useWindowDimensions
} from 'react-native';
import {
    Plus, Search, ChevronDown, RefreshCw, Check, X, Box,
    Eye, Filter, Clock, CheckCircle2, AlertTriangle, Layers, Building2
} from 'lucide-react-native';
import TopHeader from '../../components/TopHeader';
import { useProjectContext } from '../../contexts/ProjectContext';
import { siteRequestService } from '../../services/siteRequestService';
import { projectService } from '../../services/projectService';
import type { SiteRequestItem } from '../../types/siteRequest';

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

const RESOURCE_TYPES = ['ALL RESOURCES', 'MATERIAL', 'WORK', 'LABOUR', 'EQUIPMENT'];
const FORM_RESOURCE_TYPES = ['Material', 'Work', 'Labour', 'Equipment'];
const STATUS_TYPES = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

export default function ResourcesRequestScreen() {
    const { activeProjectId, activeProjectName, projects } = useProjectContext();
    const { width: windowWidth } = useWindowDimensions();
    const isMobile = windowWidth < 768;

    // Data State
    const [requests, setRequests] = useState<SiteRequestItem[]>([]);
    const [projectsList, setProjectsList] = useState<{ id: string | number; name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterResource, setFilterResource] = useState('ALL RESOURCES');
    const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

    // Dropdown open states
    const [statusFilterOpen, setStatusFilterOpen] = useState(false);
    const [resourceFilterOpen, setResourceFilterOpen] = useState(false);
    const [sortFilterOpen, setSortFilterOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Modal States
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<SiteRequestItem | null>(null);

    // Form Modal Dropdown Open States
    const [formProjOpen, setFormProjOpen] = useState(false);
    const [formResOpen, setFormResOpen] = useState(false);

    // Validation State for Form Modal
    const [formSubmittedAttempted, setFormSubmittedAttempted] = useState(false);
    const [formValidationBannerVisible, setFormValidationBannerVisible] = useState(false);
    const [topErrorToastVisible, setTopErrorToastVisible] = useState(false);

    const showTopErrorToast = () => {
        setTopErrorToastVisible(true);
        setTimeout(() => setTopErrorToastVisible(false), 5000);
    };

    // Form Data State
    const [formData, setFormData] = useState({
        project_id: activeProjectId || '',
        project_name: '-- Select Project --',
        resource_type: 'Material',
        description: '',
        quantity: '',
        unit: 'Units'
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
            const [resData, projData] = await Promise.all([
                siteRequestService.getRequests({ project_id: pid }).catch(() => null),
                projectService.getProjects().catch(() => [])
            ]);

            const arr = Array.isArray(resData) ? resData : (resData?.data || resData?.items || []);
            setRequests(arr || []);

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
            console.error('Error loading site requests:', error);
            showToast('Failed to load resource requests', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeProjectId]);

    // Handle Create Request
    const handleSaveRequest = async () => {
        setFormSubmittedAttempted(true);

        const hasProject = Boolean(formData.project_id);
        const hasNarrative = Boolean(formData.description.trim());
        const hasQuantity = Boolean(formData.quantity.trim()) && !isNaN(Number(formData.quantity));

        if (!hasProject || !hasNarrative || !hasQuantity) {
            setFormValidationBannerVisible(true);
            showTopErrorToast();
            return;
        }

        setSubmitting(true);
        try {
            await siteRequestService.createRequest({
                project_id: formData.project_id,
                resource_type: formData.resource_type,
                description: formData.description.trim(),
                quantity: Number(formData.quantity),
                unit: formData.unit || 'Units'
            });

            showToast('Resource request created successfully!', 'success');
            setFormModalVisible(false);
            setFormSubmittedAttempted(false);
            setFormValidationBannerVisible(false);
            setTopErrorToastVisible(false);
            setFormData({
                project_id: activeProjectId || '',
                project_name: '-- Select Project --',
                resource_type: 'Material',
                description: '',
                quantity: '',
                unit: 'Units'
            });
            loadData();
        } catch (error) {
            console.error('Error saving site request:', error);
            showToast('Failed to save resource request', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Approve
    const handleApprove = async (id: number | string) => {
        try {
            await siteRequestService.approveRequest(id);
            showToast('Resource request approved!', 'success');
            loadData();
        } catch (error) {
            showToast('Failed to approve request', 'error');
        }
    };

    // Handle Reject
    const handleReject = async (id: number | string) => {
        try {
            await siteRequestService.rejectRequest(id);
            showToast('Resource request rejected!', 'success');
            loadData();
        } catch (error) {
            showToast('Failed to reject request', 'error');
        }
    };

    // Filter & Sort Logic
    const getFilteredRequests = () => {
        let result = requests.filter(item => {
            const desc = (item.description || item.narrative || item.category || '').toLowerCase();
            const resType = (item.resource_type || item.category || '').toLowerCase();
            const reqId = String(item.id || '');
            const matchesSearch = searchQuery === '' ||
                desc.includes(searchQuery.toLowerCase()) ||
                resType.includes(searchQuery.toLowerCase()) ||
                reqId.includes(searchQuery);

            const itemStatus = (item.status || 'PENDING').toUpperCase();
            const matchesStatus = filterStatus === 'ALL' || itemStatus === filterStatus;

            const itemResource = (item.resource_type || item.category || 'MATERIAL').toUpperCase();
            const matchesResource = filterResource === 'ALL RESOURCES' || itemResource.includes(filterResource.toUpperCase());

            return matchesSearch && matchesStatus && matchesResource;
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

    const filteredList = getFilteredRequests();
    const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
    const paginatedList = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Calculate Stats
    const totalLogsCount = requests.length;
    const approvedCount = requests.filter(r => (r.status || '').toUpperCase() === 'APPROVED').length;
    const pendingCount = requests.filter(r => (r.status || 'PENDING').toUpperCase() === 'PENDING').length;
    const fulfillmentRate = totalLogsCount > 0 ? Math.round((approvedCount / totalLogsCount) * 100) : 13;

    // Render Top Error Toast (Matching Image 2 & 3)
    const renderTopErrorToast = () => {
        if (!topErrorToastVisible) return null;

        return (
            <View
                pointerEvents="box-none"
                style={{
                    position: 'absolute',
                    top: 12, right: 16, left: 16,
                    zIndex: 9999999, elevation: 9999,
                    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.18, shadowRadius: 16,
                }}
            >
                <View style={{
                    backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16,
                    flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#E2E8F0'
                }}>
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={13} color="#FFFFFF" strokeWidth={3} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A', lineHeight: 18 }}>
                            Please fill all mandatory fields: Project, Descriptive Narrative, Required Quantum (Units)
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
                title="Resources Requests"
                subtitle={`Engineer > Approvals > Material Requisition`}
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
                {/* ── HEADER & ACTIONS ROW (EXACT MATCH TO IMAGE 1) ────────── */}
                <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <View>
                        <Text style={{ fontSize: isMobile ? 20 : 24, fontWeight: '800', color: '#0F172A' }}>Resources Request</Text>
                        <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Formal procurement requests for structural and consumable site resources.</Text>
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
                                    resource_type: 'Material',
                                    description: '',
                                    quantity: '',
                                    unit: 'Units'
                                });
                                setFormSubmittedAttempted(false);
                                setFormValidationBannerVisible(false);
                                setTopErrorToastVisible(false);
                                setFormModalVisible(true);
                            }}
                            style={{
                                flexDirection: 'row', alignItems: 'center', gap: 6,
                                backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 8,
                                shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4
                            }}
                        >
                            <Plus size={16} color="#fff" />
                            <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>New Entry</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── STAT CARDS ROW (EXACT MATCH TO IMAGE 1) ───────────────────── */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                    <View style={{ flex: 1, minWidth: isMobile ? '47%' : 200, backgroundColor: '#fff', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 6 }}>TOTAL LOGS</Text>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: '#0F172A' }}>{totalLogsCount}</Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: '600' }}>All Requests</Text>
                    </View>

                    <View style={{ flex: 1, minWidth: isMobile ? '47%' : 200, backgroundColor: '#fff', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#10B981', letterSpacing: 0.8, marginBottom: 6 }}>APPROVED</Text>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: '#10B981' }}>{approvedCount}</Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: '600' }}>Released for Site</Text>
                    </View>

                    <View style={{ flex: 1, minWidth: isMobile ? '47%' : 200, backgroundColor: '#fff', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#F59E0B', letterSpacing: 0.8, marginBottom: 6 }}>PENDING REVIEW</Text>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: '#F59E0B' }}>{pendingCount}</Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: '600' }}>PM Validation</Text>
                    </View>

                    <View style={{ flex: 1, minWidth: isMobile ? '47%' : 200, backgroundColor: '#fff', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#2563EB', letterSpacing: 0.8, marginBottom: 6 }}>FULFILLMENT</Text>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: '#2563EB' }}>{fulfillmentRate}%</Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: '600' }}>Procurement Yield</Text>
                    </View>
                </View>

                {/* ── SEARCH & FILTERS TOOLBAR (EXACT MATCH TO IMAGE 1) ─────────── */}
                <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, minWidth: 220, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 10, height: 38 }}>
                            <Search size={15} color="#94A3B8" />
                            <TextInput
                                style={{ flex: 1, fontSize: 12, color: '#0F172A', marginLeft: 8 }}
                                placeholder="Search by material type or requisition ID..."
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

                            {/* Resource Filter */}
                            <FloatingDropdown
                                displayValue={filterResource}
                                placeholder="ALL RESOURCES"
                                isOpen={resourceFilterOpen}
                                onToggle={() => setResourceFilterOpen(v => !v)}
                                onClose={() => setResourceFilterOpen(false)}
                                style={{ height: 36, minWidth: 140 }}
                            >
                                {(close) => (
                                    <View style={{ padding: 6 }}>
                                        {RESOURCE_TYPES.map(rt => (
                                            <TouchableOpacity
                                                key={rt}
                                                onPress={() => { setFilterResource(rt); close(); }}
                                                style={{ paddingVertical: 6, paddingHorizontal: 10, backgroundColor: filterResource === rt ? '#EFF6FF' : 'transparent', borderRadius: 6 }}
                                            >
                                                <Text style={{ fontSize: 11, fontWeight: '700', color: filterResource === rt ? '#2563EB' : '#0F172A' }}>{rt}</Text>
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
                        </View>
                    </View>
                </View>

                {/* ── TABLE LIST VIEW (EXACT MATCH TO IMAGE 1) ──────────────────── */}
                {loading ? (
                    <View style={{ padding: 60, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#2563EB" />
                        <Text style={{ marginTop: 12, fontSize: 13, color: '#64748B', fontWeight: '600' }}>Loading resource requests...</Text>
                    </View>
                ) : filteredList.length === 0 ? (
                    <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Box size={40} color="#94A3B8" />
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#0F172A', marginTop: 12 }}>No resource requests found.</Text>
                        <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Click "+ New Entry" above to submit a procurement request.</Text>
                    </View>
                ) : (
                    <View style={{ backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                            <View style={{ minWidth: 800 }}>
                                {/* Table Header */}
                                <View style={{ flexDirection: 'row', backgroundColor: '#FAFAFA', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
                                    <Text style={{ width: 220, fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 }}>RESOURCE REQUISITION</Text>
                                    <Text style={{ width: 160, fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 }}>OPERATIONAL STATUS</Text>
                                    <Text style={{ width: 220, fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 }}>VOLUME / QUANTITY</Text>
                                    <Text style={{ width: 140, fontSize: 10, fontWeight: '800', color: '#64748B', textAlign: 'right', letterSpacing: 0.5 }}>ACTIONS</Text>
                                </View>

                                {/* Table Row Mapping */}
                                {paginatedList.map((item, idx) => {
                                    const resTitle = (item.resource_type || item.category || 'MATERIAL').toUpperCase();
                                    const subTitle = (item.description || item.narrative || 'SDSD').toUpperCase();
                                    const statusStr = (item.status || 'PENDING').toUpperCase();
                                    const qtyStr = `${item.quantity || item.units || 100} ${item.unit || 'Units'}`;
                                    const isPending = statusStr === 'PENDING';

                                    return (
                                        <View key={item.id || idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                                            {/* RESOURCE REQUISITION */}
                                            <View style={{ width: 220, paddingRight: 12 }}>
                                                <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A' }}>{resTitle}</Text>
                                                <Text style={{ fontSize: 10, fontWeight: '600', color: '#94A3B8', marginTop: 2 }}>{subTitle}</Text>
                                            </View>

                                            {/* OPERATIONAL STATUS */}
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

                                            {/* VOLUME / QUANTITY */}
                                            <View style={{ width: 220, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <Box size={16} color="#3B82F6" />
                                                <Text style={{ fontSize: 12, fontWeight: '800', color: '#0F172A' }}>{qtyStr}</Text>
                                            </View>

                                            {/* ACTIONS */}
                                            <View style={{ width: 140, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
                                                <TouchableOpacity onPress={() => { setSelectedRequest(item); setViewModalVisible(true); }} style={{ padding: 4 }}>
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

            {/* ── MODAL 1: SAVE RESOURCES REQUEST FORM MODAL (EXACT MATCH TO IMAGE 2 & 3) ── */}
            <Modal visible={formModalVisible} transparent animationType="slide" onRequestClose={() => setFormModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 16, position: 'relative' }}>
                    {renderTopErrorToast()}

                    <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', maxHeight: '90%', width: '100%', maxWidth: 560, alignSelf: 'center' }}>
                        {/* Modal Header */}
                        <View style={{ borderBottomWidth: 1, borderBottomColor: '#F1F5F9', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>Save Resources Request</Text>
                            <TouchableOpacity onPress={() => setFormModalVisible(false)}>
                                <X size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 16 }}>
                            {/* Validation Warning Alert Banner inside Modal (Exact match to Image 2 & 3) */}
                            {formValidationBannerVisible && (
                                <View style={{
                                    backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECDD3', borderRadius: 10,
                                    padding: 12, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                                        <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' }}>
                                            <X size={10} color="#FFFFFF" strokeWidth={3} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#991B1B' }}>Validation Error</Text>
                                            <Text style={{ fontSize: 11, fontWeight: '600', color: '#991B1B', marginTop: 1 }}>
                                                Please fill all mandatory fields: Project, Descriptive Narrative, Required Quantum (Units)
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => setFormValidationBannerVisible(false)}>
                                        <X size={14} color="#991B1B" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Section 1: REQUISITION CORE IDENTITY */}
                            <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                                    <Box size={14} color="#2563EB" />
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.8 }}>REQUISITION CORE IDENTITY</Text>
                                </View>

                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    {/* Project Selection */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#334155', marginBottom: 4 }}>
                                            Project <Text style={{ color: '#EF4444' }}>*</Text>
                                        </Text>

                                        <FloatingDropdown
                                            displayValue={formData.project_name}
                                            placeholder="-- Select Project --"
                                            isOpen={formProjOpen}
                                            onToggle={() => setFormProjOpen(v => !v)}
                                            onClose={() => setFormProjOpen(false)}
                                            style={{
                                                height: 40,
                                                borderColor: (formSubmittedAttempted && !formData.project_id) ? '#EF4444' : '#E2E8F0'
                                            }}
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
                                        {formSubmittedAttempted && !formData.project_id && (
                                            <Text style={{ fontSize: 9, fontWeight: '800', color: '#EF4444', marginTop: 3 }}>PROJECT ID IS REQUIRED</Text>
                                        )}
                                    </View>

                                    {/* Resource Classification */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#334155', marginBottom: 4 }}>
                                            Resource Classification <Text style={{ color: '#EF4444' }}>*</Text>
                                        </Text>

                                        <FloatingDropdown
                                            displayValue={formData.resource_type}
                                            placeholder="Material"
                                            isOpen={formResOpen}
                                            onToggle={() => setFormResOpen(v => !v)}
                                            onClose={() => setFormResOpen(false)}
                                            style={{ height: 40 }}
                                        >
                                            {(close) => (
                                                <View style={{ padding: 6 }}>
                                                    {FORM_RESOURCE_TYPES.map(rt => (
                                                        <TouchableOpacity
                                                            key={rt}
                                                            onPress={() => {
                                                                setFormData(prev => ({ ...prev, resource_type: rt }));
                                                                close();
                                                            }}
                                                            style={{ padding: 8 }}
                                                        >
                                                            <Text style={{ fontSize: 12, color: formData.resource_type === rt ? '#2563EB' : '#0F172A', fontWeight: formData.resource_type === rt ? '700' : '400' }}>
                                                                {rt}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            )}
                                        </FloatingDropdown>
                                    </View>
                                </View>
                            </View>

                            {/* Section 2: TECHNICAL SPECIFICATIONS NARRATIVE */}
                            <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                                    <Layers size={14} color="#2563EB" />
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.8 }}>TECHNICAL SPECIFICATIONS NARRATIVE</Text>
                                </View>

                                {/* DESCRIPTIVE NARRATIVE */}
                                <View style={{ marginBottom: 14 }}>
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#334155', marginBottom: 4, letterSpacing: 0.5 }}>
                                        DESCRIPTIVE NARRATIVE <Text style={{ color: '#EF4444' }}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={{
                                            backgroundColor: '#FFF', borderWidth: 1,
                                            borderColor: (formSubmittedAttempted && !formData.description.trim()) ? '#EF4444' : '#E2E8F0',
                                            borderRadius: 8, padding: 12, minHeight: 80, textAlignVertical: 'top', fontSize: 13, color: '#0F172A'
                                        }}
                                        multiline
                                        numberOfLines={4}
                                        placeholder=""
                                        value={formData.description}
                                        onChangeText={(txt) => setFormData(prev => ({ ...prev, description: txt }))}
                                    />
                                    {formSubmittedAttempted && !formData.description.trim() && (
                                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#EF4444', marginTop: 3 }}>TECHNICAL NARRATIVE IS REQUIRED</Text>
                                    )}
                                </View>

                                {/* REQUIRED QUANTUM (UNITS) */}
                                <View style={{ marginBottom: 4 }}>
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#334155', marginBottom: 4, letterSpacing: 0.5 }}>
                                        REQUIRED QUANTUM (UNITS) <Text style={{ color: '#EF4444' }}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={{
                                            backgroundColor: '#FFF', borderWidth: 1,
                                            borderColor: (formSubmittedAttempted && (!formData.quantity.trim() || isNaN(Number(formData.quantity)))) ? '#EF4444' : '#E2E8F0',
                                            borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, color: '#0F172A', height: 40
                                        }}
                                        keyboardType="numeric"
                                        placeholder=""
                                        value={formData.quantity}
                                        onChangeText={(txt) => setFormData(prev => ({ ...prev, quantity: txt }))}
                                    />
                                    {formSubmittedAttempted && (!formData.quantity.trim() || isNaN(Number(formData.quantity))) && (
                                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#EF4444', marginTop: 3 }}>VALID NUMERIC QUANTITY IS REQUIRED</Text>
                                    )}
                                </View>
                            </View>

                            {/* Modal Footer Buttons */}
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginBottom: 20 }}>
                                <TouchableOpacity
                                    onPress={() => setFormModalVisible(false)}
                                    style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#fff' }}
                                >
                                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#475569' }}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={submitting}
                                    onPress={handleSaveRequest}
                                    style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, backgroundColor: '#2563EB', flexDirection: 'row', alignItems: 'center', gap: 6 }}
                                >
                                    {submitting ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>SAVE RESOURCES REQUEST</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ── MODAL 2: VIEW REQUEST DETAIL MODAL ─────────────────────────── */}
            <Modal visible={viewModalVisible} transparent animationType="fade" onRequestClose={() => setViewModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, maxWidth: 460, width: '100%', alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 12 }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>Requisition Detail</Text>
                            <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                                <X size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#2563EB', marginBottom: 2 }}>
                                {(selectedRequest?.resource_type || selectedRequest?.category || 'MATERIAL').toUpperCase()}
                            </Text>
                            <Text style={{ fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 10 }}>
                                {selectedRequest?.description || selectedRequest?.narrative || 'SDSD'}
                            </Text>

                            <View style={{ backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 8 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>Status:</Text>
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: selectedRequest?.status === 'APPROVED' ? '#059669' : selectedRequest?.status === 'REJECTED' ? '#DC2626' : '#D97706' }}>
                                        {selectedRequest?.status || 'PENDING'}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>Quantity:</Text>
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#0F172A' }}>
                                        {selectedRequest?.quantity || selectedRequest?.units || 100} {selectedRequest?.unit || 'Units'}
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
