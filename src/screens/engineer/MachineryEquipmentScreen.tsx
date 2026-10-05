import {
    Activity,
    AlertTriangle,
    ArrowRightLeft,
    BarChart3,
    CheckCircle2,
    ChevronDown, ChevronLeft, ChevronRight,
    Clock,
    Copy,
    Edit2,
    Eye,
    FileText,
    Grid,
    Key,
    Link,
    Plus,
    RefreshCw,
    RotateCcw,
    Search,
    ShieldAlert,
    ShoppingCart,
    Trash2,
    Truck,
    Wrench,
    X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import TopHeader from '../../components/TopHeader';
import { useProjectContext } from '../../contexts/ProjectContext';
import { equipmentService } from '../../services/equipmentService';

const TABS = [
    'Dashboard', 'Machinery & Equipment List', 'Usage', 'Transfer Equipment',
    'Maintenance', 'Rental', 'Purchase', 'Reports', 'Project Report'
];

const TAB_ICONS: Record<string, any> = {
    'Dashboard': Activity,
    'Machinery & Equipment List': Wrench,
    'Usage': Clock,
    'Transfer Equipment': ArrowRightLeft,
    'Maintenance': ShieldAlert,
    'Rental': Truck,
    'Purchase': ShoppingCart,
    'Reports': BarChart3,
    'Project Report': FileText,
};

const ALL_PROJECTS = [
    { id: 'all', name: 'All Projects' },
    { id: '1', name: 'Sara City' },
    { id: '2', name: 'Gini Viviana' },
    { id: '3', name: 'Rohan Harita' },
    { id: '4', name: 'Metro City' },
    { id: '5', name: 'Kohinoor' },
    { id: '6', name: 'Mangalam' },
];

const CONDITIONS = ['All Conditions', 'GOOD', 'REPAIR', 'DAMAGED', 'MAINTENANCE'];
const ALLOCATION_OPTS = ['All Projects', 'Allocated', 'Deallocated'];

const STAT_CONFIGS = [
    { color: '#2563EB', bg: '#EFF6FF', borderColor: '#BFDBFE', icon: Wrench },
    { color: '#16A34A', bg: '#F0FDF4', borderColor: '#BBF7D0', icon: CheckCircle2 },
    { color: '#3B82F6', bg: '#DBEAFE', borderColor: '#93C5FD', icon: Activity },
    { color: '#D97706', bg: '#FFFBEB', borderColor: '#FDE68A', icon: Clock },
    { color: '#DC2626', bg: '#FEF2F2', borderColor: '#FECACA', icon: AlertTriangle },
    { color: '#7C3AED', bg: '#F5F3FF', borderColor: '#DDD6FE', icon: ShoppingCart },
];

// ─── Modal Dropdown With ID ───────────────────────────────────────────────────
function ModalDropdownWithId({
    options, value, onSelect, label
}: { options: {id: string | null, name: string}[]; value: string | null; onSelect: (v: string | null) => void; label: string }) {
    const [open, setOpen] = useState(false);
    const selectedObj = options.find(o => String(o.id) === String(value)) || options[0] || {name: 'Select'};
    
    return (
        <>
            <TouchableOpacity
                onPress={() => setOpen(true)}
                style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB',
                    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
                    minWidth: 150
                }}
            >
                <Text style={{ flex: 1, fontSize: 13, color: '#374151', fontWeight: '600' }} numberOfLines={1}>
                    {selectedObj.name}
                </Text>
                <ChevronDown size={14} color="#6B7280" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
            <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.38)', justifyContent: 'center' }}
                    activeOpacity={1}
                    onPress={() => setOpen(false)}
                >
                    <View style={{ marginHorizontal: 28, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', elevation: 20 }}>
                        <View style={{ paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937' }}>{label}</Text>
                        </View>
                        <ScrollView style={{ maxHeight: 300 }}>
                            {options.map(opt => {
                                const isSelected = String(value) === String(opt.id);
                                return (
                                    <TouchableOpacity
                                        key={String(opt.id)}
                                        onPress={() => { onSelect(opt.id); setOpen(false); }}
                                        style={{
                                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                            paddingHorizontal: 16, paddingVertical: 13,
                                            backgroundColor: isSelected ? '#EFF6FF' : '#fff',
                                            borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
                                        }}
                                    >
                                        <Text style={{ fontSize: 14, color: isSelected ? '#2563EB' : '#374151', fontWeight: isSelected ? '700' : '400' }}>
                                            {opt.name}
                                        </Text>
                                        {isSelected && (
                                            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '900' }}>✓</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

// ─── Modal Dropdown ───────────────────────────────────────────────────────────
function ModalDropdown({
    options, value, onSelect, label
}: { options: string[]; value: string; onSelect: (v: string) => void; label: string }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <TouchableOpacity
                onPress={() => setOpen(true)}
                style={{
                    flex: 1,
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB',
                    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 9,
                }}
            >
                <Text style={{ flex: 1, fontSize: 12, color: '#374151' }} numberOfLines={1}>{value}</Text>
                <ChevronDown size={13} color="#6B7280" />
            </TouchableOpacity>
            <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.38)', justifyContent: 'center' }}
                    activeOpacity={1}
                    onPress={() => setOpen(false)}
                >
                    <View style={{ marginHorizontal: 28, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', elevation: 20 }}>
                        <View style={{ paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937' }}>{label}</Text>
                        </View>
                        {options.map(opt => (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => { onSelect(opt); setOpen(false); }}
                                style={{
                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                    paddingHorizontal: 16, paddingVertical: 13,
                                    backgroundColor: value === opt ? '#EFF6FF' : '#fff',
                                    borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
                                }}
                            >
                                <Text style={{ fontSize: 14, color: value === opt ? '#2563EB' : '#374151', fontWeight: value === opt ? '700' : '400' }}>
                                    {opt}
                                </Text>
                                {value === opt && (
                                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: '#fff', fontSize: 11, fontWeight: '900' }}>✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

// ─── Badges ───────────────────────────────────────────────────────────────────
function ConditionBadge({ condition }: { condition: string }) {
    const map: Record<string, { bg: string; text: string; border: string }> = {
        GOOD: { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' },
        REPAIR: { bg: '#FFEDD5', text: '#C2410C', border: '#FDBA74' },
        DAMAGED: { bg: '#FEE2E2', text: '#B91C1C', border: '#FCA5A5' },
        MAINTENANCE: { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
    };
    const key = (condition || '').toUpperCase();
    const c = map[key] || { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1' };
    return (
        <View style={{ backgroundColor: c.bg, borderWidth: 1, borderColor: c.border, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' }}>
            <Text style={{ fontSize: 10, fontWeight: '800', color: c.text, letterSpacing: 0.5 }}>{key || 'N/A'}</Text>
        </View>
    );
}

function ProjectBadge({ project }: { project: any }) {
    const projName = typeof project === 'string' ? project : (project?.name || project?.project_name || '');
    const ok = projName && projName.trim() !== '' && projName !== 'null' && projName !== 'undefined' && projName.toLowerCase() !== 'not allocated';
    return (
        <View style={{
            borderWidth: 1,
            borderColor: ok ? '#BFDBFE' : '#E2E8F0',
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 3,
            alignSelf: 'flex-start',
            backgroundColor: ok ? '#EFF6FF' : '#F8FAFC',
        }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: ok ? '#1D4ED8' : '#64748B' }}>
                {ok ? projName : 'Not Allocated'}
            </Text>
        </View>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function MachineryEquipmentScreen() {

    const { activeProjectId, projects, setActiveProject } = useProjectContext();
    const projectOptions = [
        { id: null, name: 'All Projects' },
        ...projects.map(p => ({ id: String(p.id), name: p.name || (p as any).project_name || 'Unnamed Project' }))
    ];
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [page, setPage] = useState(1);
    const [transferEqPage, setTransferEqPage] = useState(1);
    const [transferHistPage, setTransferHistPage] = useState(1);
    const [usageRepPage, setUsageRepPage] = useState(1);
    const [usageLogPage, setUsageLogPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const activeProjectName = projects.find((p: any) => String(p.id) === String(activeProjectId) || String(p.project_id) === String(activeProjectId))?.name || (projects.find((p: any) => String(p.id) === String(activeProjectId) || String(p.project_id) === String(activeProjectId)) as any)?.project_name || 'Sara City';
    const [selectedProject, setSelectedProject] = useState({ id: activeProjectId, name: activeProjectName });
    const [projectModalOpen, setProjectModalOpen] = useState(false);

    useEffect(() => {
        setSelectedProject({ id: activeProjectId, name: activeProjectName });
    }, [activeProjectId, activeProjectName]);

    // Equipment list filters
    const [searchText, setSearchText] = useState('');
    const [conditionFilter, setConditionFilter] = useState('All Conditions');
    const [allocationFilter, setAllocationFilter] = useState('All Projects');
    const [showArchived, setShowArchived] = useState(false);

    // Data state
    const [kpiStats, setKpiStats] = useState([
        { label: 'Total Equipment', value: '-', sub: 'Registered Units' },
        { label: 'Available', value: '-', sub: 'Ready for deploy' },
        { label: 'Allocated', value: '-', sub: 'Currently in use' },
        { label: 'Maintenance Due', value: '-', sub: 'Upcoming/Overdue' },
        { label: 'Equipment Alerts', value: '-', sub: 'Issues detected' },
        { label: 'Total Rental', value: '-', sub: 'Estimated cost' },
    ]);
    const [maintenanceAlerts, setMaintenanceAlerts] = useState<any[]>([]);
    const [equipmentList, setEquipmentList] = useState<any[]>([]);
    const [usageReport, setUsageReport] = useState<any[]>([]);
    const [usageList, setUsageList] = useState<any[]>([]);
    const [selectedUsageEqId, setSelectedUsageEqId] = useState<any>(null);
    const [selectedTransferEqId, setSelectedTransferEqId] = useState<any>(null);
    const [usageTotals, setUsageTotals] = useState({ hours: 0, fuel: 0, entries: 0 });
    const [transferHistory, setTransferHistory] = useState<any[]>([]);
    const [maintenanceList, setMaintenanceList] = useState<any[]>([]);
    const [rentalList, setRentalList] = useState<any[]>([]);
    const [purchaseList, setPurchaseList] = useState<any[]>([]);
    const [utilizationReport, setUtilizationReport] = useState<any[]>([]);
    const [costReport, setCostReport] = useState<any[]>([]);
    const [purchaseReport, setPurchaseReport] = useState<any[]>([]);
    const [availabilityReport, setAvailabilityReport] = useState<any[]>([]);

    useEffect(() => { setPage(1); }, [activeTab, conditionFilter, allocationFilter, searchText]);

    useEffect(() => {
        const pid = selectedProject.id ? parseInt(String(selectedProject.id)) : undefined;
        const load = async () => {
            setIsLoading(true);
            try {
                if (activeTab === 'Dashboard') {
                    const [k, a] = await Promise.allSettled([
                        equipmentService.getKpi(pid),
                        equipmentService.getMaintenanceAlerts(pid),
                    ]);
                    if (k.status === 'fulfilled' && k.value) {
                        const d = k.value?.data ?? k.value;
                        setKpiStats([
                            { label: 'Total Equipment', value: String(d.total_equipment ?? d.total ?? 0), sub: 'Registered Units' },
                            { label: 'Available', value: String(d.available ?? 0), sub: 'Ready for deploy' },
                            { label: 'Allocated', value: String(d.allocated ?? 0), sub: 'Currently in use' },
                            { label: 'Maintenance Due', value: String(d.maintenance_due ?? d.maintenance ?? 0), sub: 'Upcoming/Overdue' },
                            { label: 'Equipment Alerts', value: String(d.alerts ?? 0), sub: 'Issues detected' },
                            { label: 'Total Rental', value: '\u20B9' + (d.total_rental_cost ?? d.rental_cost ?? 0).toLocaleString(), sub: 'Estimated cost' },
                        ]);
                    }
                    if (a.status === 'fulfilled' && a.value) {
                        const arr = a.value?.data ?? a.value ?? [];
                        setMaintenanceAlerts(Array.isArray(arr) ? arr : []);
                    }
                } else if (activeTab === 'Machinery & Equipment List') {
                    const r = await equipmentService.getEquipmentList(pid).catch(() => null);
                    const arr = r?.data ?? r?.items ?? r?.equipment ?? r ?? [];
                    setEquipmentList(Array.isArray(arr) ? arr : []);
                } else if (activeTab === 'Usage') {
                    const [ur, ul] = await Promise.allSettled([
                        equipmentService.getUsageReport(pid),
                        equipmentService.getUsageList(pid)
                    ]);
                    if (ur.status === 'fulfilled') {
                        const arr = ur.value?.data ?? ur.value ?? [];
                        const list = Array.isArray(arr) ? arr : [];
                        setUsageReport(list);
                        setUsageTotals({
                            hours: list.reduce((s: number, x: any) => s + (x.total_hours ?? x.hours ?? 0), 0),
                            fuel: list.reduce((s: number, x: any) => s + (x.total_fuel ?? x.fuel ?? 0), 0),
                            entries: list.reduce((s: number, x: any) => s + (x.entries ?? x.log_count ?? 0), 0),
                        });
                    }
                    if (ul.status === 'fulfilled') {
                        const arr = ul.value?.data ?? ul.value ?? [];
                        setUsageList(Array.isArray(arr) ? arr : []);
                    }
                } else if (activeTab === 'Transfer Equipment') {
                    const [th, eq] = await Promise.allSettled([
                        equipmentService.getTransferHistory(pid),
                        equipmentService.getEquipmentList(pid)
                    ]);
                    if (th.status === 'fulfilled') {
                        const arr = th.value?.data ?? th.value?.items ?? th.value ?? [];
                        setTransferHistory(Array.isArray(arr) ? arr : []);
                    }
                    if (eq.status === 'fulfilled') {
                        const arr = eq.value?.data ?? eq.value?.items ?? eq.value?.equipment ?? eq.value ?? [];
                        setEquipmentList(Array.isArray(arr) ? arr : []);
                    }
                } else if (activeTab === 'Maintenance') {
                    const r = await equipmentService.getMaintenanceList(pid).catch(() => null);
                    const arr = r?.data ?? r ?? [];
                    setMaintenanceList(Array.isArray(arr) ? arr : []);
                } else if (activeTab === 'Rental') {
                    const r = await equipmentService.getRentalList(pid).catch(() => null);
                    const arr = r?.data ?? r ?? [];
                    setRentalList(Array.isArray(arr) ? arr : []);
                } else if (activeTab === 'Purchase') {
                    const r = await equipmentService.getPurchaseList(pid).catch(() => null);
                    const arr = r?.data ?? r ?? [];
                    setPurchaseList(Array.isArray(arr) ? arr : []);
                } else if (activeTab === 'Reports' || activeTab === 'Project Report') {
                    const [u, c, p, av] = await Promise.allSettled([
                        equipmentService.getUtilizationReport(pid),
                        equipmentService.getCostReport(pid),
                        equipmentService.getPurchaseReport(pid),
                        equipmentService.getAvailabilityReport(pid),
                    ]);
                    if (u.status === 'fulfilled') { const a = u.value?.data ?? u.value ?? []; setUtilizationReport(Array.isArray(a) ? a : []); }
                    if (c.status === 'fulfilled') { const a = c.value?.data ?? c.value ?? []; setCostReport(Array.isArray(a) ? a : []); }
                    if (p.status === 'fulfilled') { const a = p.value?.data ?? p.value ?? []; setPurchaseReport(Array.isArray(a) ? a : []); }
                    if (av.status === 'fulfilled') { const a = av.value?.data ?? av.value ?? []; setAvailabilityReport(Array.isArray(a) ? a : []); }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [activeTab, selectedProject]);

    // ─── Pagination ────────────────────────────────────────────────────────────
    const renderPagination = (total: number, currentPage = page, onPageChange: any = setPage) => {
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const p = Math.min(currentPage, totalPages);
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6', backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 11, color: '#6B7280', marginRight: 6 }}>Per page:</Text>
                    <TouchableOpacity
                        onPress={() => { const n = limit === 10 ? 20 : limit === 20 ? 50 : 10; setLimit(n); onPageChange(1); }}
                        style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 }}
                    >
                        <Text style={{ fontSize: 12, color: '#374151', marginRight: 4 }}>{limit}</Text>
                        <ChevronDown size={11} color="#6B7280" />
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 11, color: '#6B7280' }}>
                    {total === 0 ? '0' : `${(p - 1) * limit + 1}-${Math.min(p * limit, total)}`} / {total}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <TouchableOpacity
                        disabled={p === 1}
                        onPress={() => onPageChange((x: number) => x - 1)}
                        style={{ width: 28, height: 28, borderRadius: 6, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', opacity: p === 1 ? 0.4 : 1 }}
                    >
                        <ChevronLeft size={13} color="#6B7280" />
                    </TouchableOpacity>
                    {Array.from({ length: Math.min(4, totalPages) }).map((_, i) => {
                        const n = i + 1;
                        return (
                            <TouchableOpacity
                                key={n}
                                onPress={() => onPageChange(n)}
                                style={{ width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: p === n ? '#2563EB' : '#fff', borderWidth: p === n ? 0 : 1, borderColor: '#E5E7EB' }}
                            >
                                <Text style={{ fontSize: 12, color: p === n ? '#fff' : '#374151', fontWeight: p === n ? '700' : '400' }}>{n}</Text>
                            </TouchableOpacity>
                        );
                    })}
                    <TouchableOpacity
                        disabled={p === totalPages}
                        onPress={() => onPageChange((x: number) => x + 1)}
                        style={{ width: 28, height: 28, borderRadius: 6, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', opacity: p === totalPages ? 0.4 : 1 }}
                    >
                        <ChevronRight size={13} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // ─── Dashboard ─────────────────────────────────────────────────────────────
    const renderDashboard = () => (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase' }}>Fleet Key Metrics</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 6 }} />
                    <Text style={{ fontSize: 11, color: '#16A34A', fontWeight: '700' }}>Live Updates</Text>
                </View>
            </View>

            {/* 2-column grid of stat cards */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, gap: 12 }}>
                {kpiStats.map((s, i) => {
                    const cfg = STAT_CONFIGS[i] || STAT_CONFIGS[0];
                    const IconComp = cfg.icon;
                    return (
                        <View
                            key={s.label}
                            style={{
                                width: '48%',
                                backgroundColor: '#fff',
                                borderRadius: 14,
                                borderWidth: 1,
                                borderColor: '#E2E8F0',
                                padding: 16,
                                shadowColor: '#0F172A',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.04,
                                shadowRadius: 6,
                                elevation: 2,
                            }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: cfg.bg, borderWidth: 1, borderColor: cfg.borderColor, alignItems: 'center', justifyContent: 'center' }}>
                                    <IconComp size={18} color={cfg.color} />
                                </View>
                                <View style={{ backgroundColor: cfg.bg, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 }}>
                                    <Text style={{ fontSize: 9, fontWeight: '800', color: cfg.color }}>ACTIVE</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{s.label}</Text>
                            <Text style={{ fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 4 }}>{s.value}</Text>
                            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '500' }}>{s.sub}</Text>
                        </View>
                    );
                })}
            </View>

            <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>Alerts & Diagnostics</Text>

            {/* Maintenance alerts */}
            <View style={{ backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.03, elevation: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: '#F8FAFC' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                            <Wrench size={15} color="#2563EB" />
                        </View>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A', textTransform: 'uppercase', letterSpacing: 0.5 }}>Maintenance Alerts</Text>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#2563EB' }}>{maintenanceAlerts.length} Total</Text>
                </View>
                {maintenanceAlerts.length === 0 ? (
                    <View style={{ padding: 36, alignItems: 'center' }}>
                        <CheckCircle2 size={32} color="#CBD5E1" style={{ marginBottom: 8 }} />
                        <Text style={{ color: '#64748B', fontSize: 14, fontWeight: '600' }}>No pending maintenance alerts</Text>
                        <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>All machinery operating within optimal parameters</Text>
                    </View>
                ) : (
                    <View style={{ padding: 14, gap: 10 }}>
                        {maintenanceAlerts.map((a: any, i: number) => (
                            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A' }}>{a.equipment_name ?? a.name ?? 'Equipment'}</Text>
                                    <Text style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>Due: {a.due_date ?? a.maintenance_date ?? 'Not Specified'}</Text>
                                </View>
                                <View style={{ backgroundColor: a.status === 'OVERDUE' ? '#FEE2E2' : '#FEF3C7', borderWidth: 1, borderColor: a.status === 'OVERDUE' ? '#FCA5A5' : '#FDE68A', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 }}>
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: a.status === 'OVERDUE' ? '#DC2626' : '#D97706' }}>{a.status ?? 'UPCOMING'}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Equipment alerts */}
            <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                    <Text style={{ fontSize: 15, marginRight: 8 }}>⚠️</Text>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#EF4444', textTransform: 'uppercase', letterSpacing: 0.8 }}>Equipment Alerts</Text>
                </View>
                <View style={{ padding: 32, alignItems: 'center' }}>
                    <Text style={{ color: '#9CA3AF', fontSize: 13 }}>No equipment alerts</Text>
                </View>
            </View>
        </View>
    );

    // ─── Equipment List ────────────────────────────────────────────────────────
    const renderList = () => {
        const q = searchText.toLowerCase();
        const filteredEq = equipmentList.filter(row => {
            const matchSearch = !q || (row.name ?? row.equipment_name ?? '').toLowerCase().includes(q) || (row.equipment_code ?? row.code ?? '').toLowerCase().includes(q) || (row.operator_name ?? row.operator ?? '').toLowerCase().includes(q);
            const cond = (row.condition ?? '').toUpperCase();
            const matchCond = conditionFilter === 'All Conditions' || cond === conditionFilter;
            const allocated = !!(row.project_name ?? row.project);
            const matchAlloc = allocationFilter === 'All Projects' || (allocationFilter === 'Allocated' && allocated) || (allocationFilter === 'Deallocated' && !allocated);
            return matchSearch && matchCond && matchAlloc;
        });

        return (
            <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' }}>
                <View style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.5 }}>Equipment Register</Text>
                </View>

                <View style={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 9 }}>
                        <Search size={15} color="#9CA3AF" />
                        <TextInput
                            value={searchText} onChangeText={setSearchText}
                            placeholder="Search equipment..." placeholderTextColor="#9CA3AF"
                            style={{ flex: 1, marginLeft: 8, fontSize: 13, color: '#374151', padding: 0 }}
                        />
                        {searchText.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchText('')} style={{ padding: 4 }}><X size={14} color="#9CA3AF" /></TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 8, gap: 8 }}>
                    <ModalDropdown options={CONDITIONS} value={conditionFilter} onSelect={v => { setConditionFilter(v); setPage(1); }} label="Filter by Condition" />
                    <ModalDropdown options={ALLOCATION_OPTS} value={allocationFilter} onSelect={v => { setAllocationFilter(v); setPage(1); }} label="Filter by Allocation" />
                    <TouchableOpacity
                        onPress={() => setShowArchived(a => !a)}
                        style={{
                            flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 9,
                            borderWidth: 1, borderColor: showArchived ? '#2563EB' : '#E5E7EB', borderRadius: 8,
                            backgroundColor: showArchived ? '#EFF6FF' : '#fff',
                        }}
                    >
                        <View style={{
                            width: 15, height: 15, borderRadius: 3, borderWidth: 1.5, borderColor: showArchived ? '#2563EB' : '#D1D5DB',
                            backgroundColor: showArchived ? '#2563EB' : '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 6,
                        }}>
                            {showArchived && <Text style={{ color: '#fff', fontSize: 9, fontWeight: '900' }}>✓</Text>}
                        </View>
                        <Text style={{ fontSize: 12, color: showArchived ? '#2563EB' : '#374151', fontWeight: showArchived ? '700' : '400' }}>Archived</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingBottom: 12, gap: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                    <TouchableOpacity
                        onPress={() => {
                            const pid = selectedProject.id ? parseInt(String(selectedProject.id)) : undefined;
                            setIsLoading(true);
                            equipmentService.getEquipmentList(pid).then(r => { const a = r?.data ?? r?.items ?? r?.equipment ?? r ?? []; setEquipmentList(Array.isArray(a) ? a : []); }).catch(() => { }).finally(() => setIsLoading(false));
                        }}
                        style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: '#fff' }}
                    >
                        <RefreshCw size={14} color="#6B7280" />
                        <Text style={{ fontSize: 13, color: '#374151', marginLeft: 6, fontWeight: '500' }}>Refresh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 9 }}>
                        <Plus size={15} color="#fff" />
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff', marginLeft: 6 }}>Add Equipment</Text>
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <View style={{ padding: 48, alignItems: 'center' }}><ActivityIndicator color="#2563EB" size="large" /></View>
                ) : filteredEq.length === 0 ? (
                    <View style={{ padding: 48, alignItems: 'center' }}>
                        <Text style={{ color: '#9CA3AF', fontSize: 14 }}>No equipment found</Text>
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator>
                        <View style={{ minWidth: 1000 }}>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                                <Text style={{ width: 160, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>Equipment</Text>
                                <Text style={{ width: 130, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>Project</Text>
                                <Text style={{ width: 100, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>Ownership</Text>
                                <Text style={{ width: 120, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>Operator</Text>
                                <Text style={{ width: 65, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>Usage</Text>
                                <Text style={{ width: 95, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>Condition</Text>
                                <Text style={{ width: 115, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>Maintenance</Text>
                                <Text style={{ width: 200, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', textAlign: 'right' }}>Actions</Text>
                            </View>
                            {filteredEq.slice((page - 1) * limit, page * limit).map((row: any, i: number) => {
                                const projVal = row.project_name ?? row.current_project_name ?? row.allocated_project ?? row.project?.name ?? (typeof row.project === 'string' ? row.project : null);
                                const ownershipVal = row.ownership ?? row.ownership_type ?? row.ownership_status ?? (row.is_rented ? 'RENTED' : row.is_owned ? 'OWNED' : '-');
                                const operatorVal = row.operator_name ?? row.operator ?? row.driver_name ?? '-';
                                const usageVal = row.total_usage_hours ?? row.usage_hours ?? row.total_hours ?? row.hours ?? row.usage ?? '0';
                                const maintenanceVal = row.next_maintenance_date ?? row.maintenance_date ?? row.last_maintenance_date ?? row.maintenance_due ?? row.next_service_date ?? row.maintenance ?? '-';

                                return (
                                    <View key={row.id ?? i} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F9FAFB', backgroundColor: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                                        <View style={{ width: 160 }}>
                                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1F2937' }}>{row.name ?? row.equipment_name ?? '-'}</Text>
                                            <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{row.equipment_code ?? row.code ?? ''}</Text>
                                        </View>
                                        <View style={{ width: 130 }}>
                                            <ProjectBadge project={projVal} />
                                        </View>
                                        <Text style={{ width: 100, fontSize: 12, fontWeight: '600', color: '#374151' }}>{ownershipVal}</Text>
                                        <Text style={{ width: 120, fontSize: 13, color: '#374151' }}>{operatorVal}</Text>
                                        <Text style={{ width: 65, fontSize: 12, color: '#2563EB', fontWeight: '700' }}>{usageVal} hrs</Text>
                                        <View style={{ width: 95 }}>
                                            <ConditionBadge condition={row.condition ?? 'GOOD'} />
                                        </View>
                                        <Text style={{ width: 115, fontSize: 11, color: '#374151', fontWeight: '500' }}>{maintenanceVal}</Text>
                                        <View style={{ width: 200, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
                                            <TouchableOpacity style={{ padding: 4 }}><Eye size={16} color="#9CA3AF" /></TouchableOpacity>
                                            <TouchableOpacity style={{ padding: 4 }}><Edit2 size={16} color="#9CA3AF" /></TouchableOpacity>
                                            <TouchableOpacity style={{ padding: 4 }}><Link size={16} color="#9CA3AF" /></TouchableOpacity>
                                            <TouchableOpacity style={{ padding: 4 }}><RotateCcw size={16} color="#9CA3AF" /></TouchableOpacity>
                                            <TouchableOpacity style={{ padding: 4 }}><Key size={16} color="#9CA3AF" /></TouchableOpacity>
                                            <TouchableOpacity style={{ padding: 4 }}><Copy size={16} color="#9CA3AF" /></TouchableOpacity>
                                            <TouchableOpacity style={{ padding: 4 }}><Clock size={16} color="#9CA3AF" /></TouchableOpacity>
                                            <TouchableOpacity style={{ padding: 4 }}><Grid size={16} color="#9CA3AF" /></TouchableOpacity>
                                            <TouchableOpacity style={{ padding: 4 }}><Trash2 size={16} color="#EF4444" /></TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                )}
                {renderPagination(filteredEq.length)}
            </View>
        );
    };

    // ─── Shared Wrapper for other lists ──────────────────────────────────────────
    const SharedList = ({
        title, data, headers, widths, getRow, searchPlaceholder, onRefresh,
        addButtonText, onAdd, renderHeaderExtra
    }: {
        title: string;
        data: any[];
        headers: string[];
        widths: (number | 'flex')[];
        getRow: (r: any) => string[];
        searchPlaceholder?: string;
        onRefresh: () => void;
        addButtonText?: string;
        onAdd?: () => void;
        renderHeaderExtra?: () => React.ReactNode;
    }) => {
        const q = searchText.toLowerCase();
        const filtered = data.filter(row => {
            if (!q) return true;
            const json = JSON.stringify(row).toLowerCase();
            return json.includes(q);
        });

        return (
            <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' }}>
                <View style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.5 }}>{title}</Text>
                </View>

                {renderHeaderExtra && renderHeaderExtra()}

                <View style={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 9 }}>
                        <Search size={15} color="#9CA3AF" />
                        <TextInput
                            value={searchText} onChangeText={setSearchText}
                            placeholder={searchPlaceholder || "Search..."} placeholderTextColor="#9CA3AF"
                            style={{ flex: 1, marginLeft: 8, fontSize: 13, color: '#374151', padding: 0 }}
                        />
                        {searchText.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchText('')} style={{ padding: 4 }}><X size={14} color="#9CA3AF" /></TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingBottom: 12, gap: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                    <TouchableOpacity
                        onPress={onRefresh}
                        style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: '#fff' }}
                    >
                        <RefreshCw size={14} color="#6B7280" />
                        <Text style={{ fontSize: 13, color: '#374151', marginLeft: 6, fontWeight: '500' }}>Refresh</Text>
                    </TouchableOpacity>
                    {addButtonText && onAdd && (
                        <TouchableOpacity onPress={onAdd} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 9 }}>
                            <Plus size={15} color="#fff" />
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff', marginLeft: 6 }}>{addButtonText}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {isLoading ? (
                    <View style={{ padding: 48, alignItems: 'center' }}><ActivityIndicator color="#2563EB" size="large" /></View>
                ) : filtered.length === 0 ? (
                    <View style={{ padding: 48, alignItems: 'center' }}>
                        <Text style={{ color: '#9CA3AF', fontSize: 14 }}>No records found</Text>
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator>
                        <View style={{ minWidth: 700 }}>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                                {headers.map((h, hi) => (
                                    <Text key={h} style={widths[hi] === 'flex' ? { flex: 1, minWidth: 120, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' } : { width: widths[hi] as number, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>{h}</Text>
                                ))}
                            </View>
                            {filtered.slice((page - 1) * limit, page * limit).map((row, i) => {
                                const cells = getRow(row);
                                return (
                                    <View key={row.id ?? i} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F9FAFB', backgroundColor: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                                        {cells.map((cell, ci) => (
                                            <Text key={ci} style={widths[ci] === 'flex' ? { flex: 1, minWidth: 120, fontSize: 13, color: '#374151' } : { width: widths[ci] as number, fontSize: 13, color: '#374151' }}>{cell}</Text>
                                        ))}
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                )}
                {renderPagination(filtered.length)}
            </View>
        );
    };

    // ─── Usage ─────────────────────────────────────────────────────────────────

    const renderUsage = () => {
        const selectedEqName = selectedUsageEqId ? (usageReport.find(r => r.equipment_id === selectedUsageEqId || r.id === selectedUsageEqId)?.equipment_name || usageReport.find(r => r.equipment_id === selectedUsageEqId || r.id === selectedUsageEqId)?.name || 'Equipment') : '';
        const filteredLogs = selectedUsageEqId ? usageList.filter(l => l.equipment_id === selectedUsageEqId || l.equipment?.id === selectedUsageEqId || l.id === selectedUsageEqId) : [];

        return (
            <View style={{ minHeight: 600 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                    {[
                        { label: 'Total Hours Logged', value: String(usageTotals.hours), sub: 'All equipment', color: '#2563EB' },
                        { label: 'Total Fuel Consumed', value: usageTotals.fuel + ' L', sub: 'All equipment', color: '#F97316' },
                        { label: 'Usage Entries', value: String(usageTotals.entries), sub: 'Total logs recorded', color: '#16A34A' },
                    ].map(s => (
                        <View key={s.label} style={{ flex: 1, minWidth: '30%', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#F3F4F6', padding: 12 }}>
                            <Text style={{ fontSize: 9, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{s.label}</Text>
                            <Text style={{ fontSize: 24, fontWeight: '800', color: s.color, marginBottom: 2 }}>{s.value}</Text>
                            <Text style={{ fontSize: 11, color: '#9CA3AF' }}>{s.sub}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 14 }}>
                    <TouchableOpacity style={{ backgroundColor: '#10B981', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Plus size={16} color="#fff" />
                        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700', marginLeft: 6 }}>Log Usage</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'column', gap: 16, flex: 1 }}>
                    {/* Left Panel: Usage Report Summary */}
                    <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937' }}>Usage Summary Report</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator><View style={{ width: 600 }}>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#F9FAFB' }}>
                                <Text style={{ width: 200, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>Equipment</Text>
                                <Text style={{ width: 100, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>Total Hrs</Text>
                                <Text style={{ width: 100, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>Total Fuel</Text>
                                <Text style={{ width: 100, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>Avg Hrs</Text>
                                <Text style={{ width: 100, fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>Entries</Text>
                            </View>
                            <ScrollView style={{ minHeight: 400 }}>
                                {usageReport.slice((usageRepPage - 1) * limit, usageRepPage * limit).map((row, i) => (
                                    <TouchableOpacity key={i} onPress={() => setSelectedUsageEqId(row.equipment_id || row.id)} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F9FAFB', backgroundColor: (selectedUsageEqId === (row.equipment_id || row.id)) ? '#EFF6FF' : (i % 2 === 0 ? '#fff' : '#FAFAFA') }}>
                                        <Text style={{ width: 200, fontSize: 12, fontWeight: '700', color: (selectedUsageEqId === (row.equipment_id || row.id)) ? '#1D4ED8' : '#374151' }}>{row.equipment_name ?? row.equipment?.name ?? row.equipmentName ?? row.name ?? row.title ?? (typeof row.eq === 'string' ? row.eq : '-')}</Text>
                                        <Text style={{ width: 100, fontSize: 12, color: '#374151', fontWeight: '500' }}>{row.total_hours ?? row.hours ?? row.total_usage ?? 0}</Text>
                                        <Text style={{ width: 100, fontSize: 12, color: '#374151', fontWeight: '500' }}>{row.total_fuel ?? row.fuel ?? row.fuel_consumed ?? 0}</Text>
                                        <Text style={{ width: 100, fontSize: 12, color: '#374151' }}>{row.avg_hours ?? ((row.total_hours ?? row.hours ?? row.total_usage ?? 0) / Math.max(1, (row.entries ?? row.log_count ?? 1))).toFixed(1)}</Text>
                                        <Text style={{ width: 100, fontSize: 12, color: '#374151' }}>{row.entries ?? row.log_count ?? row.logCount ?? row.total_entries ?? 0}</Text>
                                    </TouchableOpacity>
                                ))}
                                {usageReport.length === 0 && (
                                    <View style={{ padding: 40, alignItems: 'center' }}>
                                        <Text style={{ color: '#9CA3AF', fontSize: 13 }}>No usage reports found</Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View></ScrollView>
                        {renderPagination(usageReport.length, usageRepPage, setUsageRepPage)}
                    </View>

                    {/* Right Panel: Logs */}
                    <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden', minHeight: 400 }}>
                        <View style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1F2937' }}>Logs — {selectedEqName || 'Select Equipment'}</Text>
                        </View>
                        <ScrollView style={{ minHeight: 400, padding: 12, backgroundColor: '#F9FAFB' }}>
                            {!selectedUsageEqId ? (
                                <View style={{ padding: 40, alignItems: 'center' }}>
                                    <Text style={{ color: '#9CA3AF', fontSize: 13 }}>Select equipment to view logs</Text>
                                </View>
                            ) : filteredLogs.length === 0 ? (
                                <View style={{ padding: 40, alignItems: 'center' }}>
                                    <Text style={{ color: '#9CA3AF', fontSize: 13 }}>No logs to display</Text>
                                </View>
                            ) : (
                                filteredLogs.slice((usageLogPage - 1) * limit, usageLogPage * limit).map((log, i) => (
                                    <View key={i} style={{ padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, backgroundColor: '#fff' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <View>
                                                <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151' }}>{log.usage_date ?? log.date ?? log.created_at ?? '-'}</Text>
                                                <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Logged by {log.logged_by ?? log.operator ?? 'Operator'}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                                <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                                                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#16A34A' }}>{log.hours_used ?? log.hours ?? log.usage_hours ?? 0} hrs</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', gap: 6 }}>
                                                    <TouchableOpacity><Edit2 size={14} color="#9CA3AF" /></TouchableOpacity>
                                                    <TouchableOpacity><Trash2 size={14} color="#EF4444" /></TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                            <Text style={{ fontSize: 12, fontWeight: '600', color: '#F59E0B' }}>{log.fuel_consumed ?? log.fuel ?? 0} L Fuel</Text>
                                        </View>
                                        <Text style={{ fontSize: 12, color: '#4B5563' }}>{log.remarks ?? log.notes ?? log.description ?? 'No remarks provided.'}</Text>
                                    </View>
                                ))
                            )}
                        </ScrollView>
                        {selectedUsageEqId && renderPagination(filteredLogs.length, usageLogPage, setUsageLogPage)}
                    </View>
                </View>
            </View>
        );
    };

    const renderTransfer = () => {
        const filteredHistory = selectedTransferEqId === 'all' || !selectedTransferEqId
            ? transferHistory
            : transferHistory.filter(t => t.equipment_id === selectedTransferEqId || t.eq_id === selectedTransferEqId);

        return (
            <View style={{ flexDirection: 'column', gap: 16, minHeight: 600 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: -4 }}>
                    <TouchableOpacity style={{ backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Plus size={16} color="#fff" />
                        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700', marginLeft: 6 }}>Transfer Equipment</Text>
                    </TouchableOpacity>
                </View>
                {/* Left Sidebar */}
                <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', maxHeight: 300 }}>
                    <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#FAFAFA' }}>
                        <Text style={{ fontSize: 11, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 }}>Select Equipment</Text>
                    </View>
                    <ScrollView style={{ minHeight: 150 }}>
                        <TouchableOpacity onPress={() => setSelectedTransferEqId('all')} style={{ paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: (!selectedTransferEqId || selectedTransferEqId === 'all') ? '#EFF6FF' : '#fff' }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: (!selectedTransferEqId || selectedTransferEqId === 'all') ? '#1D4ED8' : '#374151' }}>All Equipment</Text>
                        </TouchableOpacity>
                        {equipmentList.slice((transferEqPage - 1) * limit, transferEqPage * limit).map((eq, i) => (
                            <TouchableOpacity key={i} onPress={() => setSelectedTransferEqId(eq.id)} style={{ paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: selectedTransferEqId === eq.id ? '#EFF6FF' : '#fff' }}>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: selectedTransferEqId === eq.id ? '#1D4ED8' : '#374151' }}>{eq.name ?? eq.equipment_name ?? '-'}</Text>
                                <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{eq.code ?? eq.equipment_code ?? ''}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#fff' }}>
                        <TouchableOpacity disabled={transferEqPage === 1} onPress={() => setTransferEqPage(p => p - 1)}><Text style={{ color: transferEqPage === 1 ? '#D1D5DB' : '#2563EB', fontSize: 13, fontWeight: '600' }}>Prev</Text></TouchableOpacity>
                        <Text style={{ fontSize: 12, color: '#6B7280' }}>Page {transferEqPage}</Text>
                        <TouchableOpacity disabled={transferEqPage * limit >= equipmentList.length} onPress={() => setTransferEqPage(p => p + 1)}><Text style={{ color: transferEqPage * limit >= equipmentList.length ? '#D1D5DB' : '#2563EB', fontSize: 13, fontWeight: '600' }}>Next</Text></TouchableOpacity>
                    </View>
                </View>

                {/* Right Panel */}
                <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827' }}>Transfer History</Text>
                            <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{filteredHistory.length} records found</Text>
                        </View>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator><View style={{ width: 800 }}>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
                            <Text style={{ width: 180, fontSize: 11, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase' }}>Equipment</Text>
                            <Text style={{ width: 160, fontSize: 11, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase' }}>From Project</Text>
                            <Text style={{ width: 160, fontSize: 11, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase' }}>To Project</Text>
                            <Text style={{ width: 140, fontSize: 11, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase' }}>Transferred By</Text>
                            <Text style={{ width: 160, fontSize: 11, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase' }}>Details</Text>
                        </View>
                        <ScrollView style={{ minHeight: 400 }}>
                            {filteredHistory.length === 0 ? (
                                <View style={{ padding: 60, alignItems: 'center' }}>
                                    <Text style={{ color: '#9CA3AF', fontSize: 14 }}>No transfer history found for this selection.</Text>
                                </View>
                            ) : (
                                filteredHistory.slice((transferHistPage - 1) * limit, transferHistPage * limit).map((row, i) => (
                                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                                        <View style={{ width: 180 }}>
                                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1F2937' }}>{row.equipment_name ?? row.equipment?.name ?? (typeof row.eq === 'string' ? row.eq : '-')}</Text>
                                        </View>
                                        <View style={{ width: 160 }}>
                                            <Text style={{ fontSize: 13, color: '#4B5563', fontWeight: '500' }}>{row.from_project_name ?? row.from_project?.name ?? (typeof row.from_project === 'string' ? row.from_project : (typeof row.from === 'string' ? row.from : '-'))}</Text>
                                        </View>
                                        <View style={{ width: 160 }}>
                                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#2563EB' }}>{row.to_project_name ?? row.to_project?.name ?? (typeof row.to_project === 'string' ? row.to_project : (typeof row.to === 'string' ? row.to : '-'))}</Text>
                                        </View>
                                        <View style={{ width: 140 }}>
                                            <Text style={{ fontSize: 13, color: '#374151' }}>{row.transferred_by ?? row.by ?? row.user ?? '-'}</Text>
                                        </View>
                                        <View style={{ width: 160 }}>
                                            <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600' }}>{row.transfer_date ?? row.transferred_at ?? row.created_at ?? row.date ?? '-'}</Text>
                                            <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>IP: {row.ip ?? row.ip_address ?? '192.168.1.1'}</Text>
                                        </View>
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    </View></ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#fff' }}>
                        <TouchableOpacity disabled={transferHistPage === 1} onPress={() => setTransferHistPage(p => p - 1)}><Text style={{ color: transferHistPage === 1 ? '#D1D5DB' : '#2563EB', fontSize: 13, fontWeight: '600' }}>Prev</Text></TouchableOpacity>
                        <Text style={{ fontSize: 12, color: '#6B7280' }}>Page {transferHistPage}</Text>
                        <TouchableOpacity disabled={transferHistPage * limit >= filteredHistory.length} onPress={() => setTransferHistPage(p => p + 1)}><Text style={{ color: transferHistPage * limit >= filteredHistory.length ? '#D1D5DB' : '#2563EB', fontSize: 13, fontWeight: '600' }}>Next</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const renderMaintenance = () => (
        <SharedList
            title="Maintenance Records"
            data={maintenanceList}
            headers={['Equipment', 'Code', 'Due Date', 'Status']}
            widths={['flex', 120, 130, 120]}
            getRow={r => [r.equipment_name ?? r.name ?? '-', r.equipment_code ?? '-', r.due_date ?? r.maintenance_date ?? '-', r.status ?? 'UPCOMING']}
            searchPlaceholder="Search maintenance..."
            onRefresh={() => {
                const pid = selectedProject.id ? parseInt(String(selectedProject.id)) : undefined;
                setIsLoading(true);
                equipmentService.getMaintenanceList(pid).then(r => setMaintenanceList(Array.isArray(r?.data ?? r) ? (r?.data ?? r) : [])).finally(() => setIsLoading(false));
            }}
            addButtonText="Schedule Maintenance"
            onAdd={() => { }}
        />
    );

    const renderRental = () => (
        <SharedList
            title="Rental History"
            data={rentalList}
            headers={['Equipment', 'Start', 'End', 'Cost', 'Client', 'Status']}
            widths={['flex', 110, 110, 100, 120, 100]}
            getRow={r => [r.equipment_name ?? r.eq ?? '-', r.start_date ?? '-', r.end_date ?? '-', r.cost ?? '-', r.client ?? '-', r.status ?? '-']}
            searchPlaceholder="Search rentals..."
            onRefresh={() => {
                const pid = selectedProject.id ? parseInt(String(selectedProject.id)) : undefined;
                setIsLoading(true);
                equipmentService.getRentalList(pid).then(r => setRentalList(Array.isArray(r?.data ?? r) ? (r?.data ?? r) : [])).finally(() => setIsLoading(false));
            }}
            addButtonText="Add Rental"
            onAdd={() => { }}
        />
    );

    const renderPurchase = () => (
        <SharedList
            title="Purchase History"
            data={purchaseList}
            headers={['Equipment', 'Date', 'Vendor', 'Qty', 'Total', 'Type']}
            widths={['flex', 110, 120, 70, 110, 90]}
            getRow={r => [r.equipment_name ?? r.name ?? '-', r.purchase_date ?? '-', r.vendor ?? '-', String(r.quantity ?? r.qty ?? '-'), r.total_cost ?? r.total ?? '-', r.purchase_type ?? r.type ?? '-']}
            searchPlaceholder="Search purchases..."
            onRefresh={() => {
                const pid = selectedProject.id ? parseInt(String(selectedProject.id)) : undefined;
                setIsLoading(true);
                equipmentService.getPurchaseList(pid).then(r => setPurchaseList(Array.isArray(r?.data ?? r) ? (r?.data ?? r) : [])).finally(() => setIsLoading(false));
            }}
            addButtonText="Create Purchase"
            onAdd={() => { }}
        />
    );

    const renderReports = () => (
        <View style={{ gap: 14 }}>
            <SharedList
                title="Utilization Report"
                data={utilizationReport}
                headers={['Equipment', 'Hours Used', 'Utilization %']}
                widths={['flex', 110, 120]}
                getRow={r => [r.equipment_name ?? r.eq ?? '-', String(r.hours_used ?? r.hrs ?? 0), String(r.utilization_rate ?? r.rate ?? 0) + '%']}
                searchPlaceholder="Search utilization..."
                onRefresh={() => {
                    const pid = selectedProject.id ? parseInt(String(selectedProject.id)) : undefined;
                    setIsLoading(true);
                    equipmentService.getUtilizationReport(pid).then(r => setUtilizationReport(Array.isArray(r?.data ?? r) ? (r?.data ?? r) : [])).finally(() => setIsLoading(false));
                }}
            />
            <SharedList
                title="Cost Report"
                data={costReport}
                headers={['Equipment', 'Total Cost', 'Avg Cost', 'Total Days']}
                widths={['flex', 120, 110, 110]}
                getRow={r => [r.equipment_name ?? r.eq ?? '-', r.total_cost ?? r.cost ?? '-', r.avg_cost ?? '-', String(r.total_days ?? r.days ?? 0)]}
                searchPlaceholder="Search cost records..."
                onRefresh={() => {
                    const pid = selectedProject.id ? parseInt(String(selectedProject.id)) : undefined;
                    setIsLoading(true);
                    equipmentService.getCostReport(pid).then(r => setCostReport(Array.isArray(r?.data ?? r) ? (r?.data ?? r) : [])).finally(() => setIsLoading(false));
                }}
            />
        </View>
    );

    const renderProjectReport = () => (
        <View style={{ gap: 14 }}>
            <SharedList
                title="Purchase Report"
                data={purchaseReport}
                headers={['Equipment', 'Count', 'Qty', 'Cost', 'Type']}
                widths={['flex', 80, 80, 110, 90]}
                getRow={r => [r.equipment_name ?? r.eq ?? '-', String(r.purchase_count ?? r.count ?? 0), String(r.total_quantity ?? r.qty ?? '-'), r.total_cost ?? r.cost ?? '-', r.purchase_type ?? r.type ?? '-']}
                searchPlaceholder="Search purchase reports..."
                onRefresh={() => {
                    const pid = selectedProject.id ? parseInt(String(selectedProject.id)) : undefined;
                    setIsLoading(true);
                    equipmentService.getPurchaseReport(pid).then(r => setPurchaseReport(Array.isArray(r?.data ?? r) ? (r?.data ?? r) : [])).finally(() => setIsLoading(false));
                }}
            />
            <SharedList
                title="Availability Report"
                data={availabilityReport}
                headers={['Equipment', 'Available', 'Project']}
                widths={['flex', 100, 140]}
                getRow={r => [r.equipment_name ?? r.eq ?? '-', r.is_available ? 'TRUE' : 'FALSE', r.project_name ?? r.project ?? '-']}
                searchPlaceholder="Search availability..."
                onRefresh={() => {
                    const pid = selectedProject.id ? parseInt(String(selectedProject.id)) : undefined;
                    setIsLoading(true);
                    equipmentService.getAvailabilityReport(pid).then(r => setAvailabilityReport(Array.isArray(r?.data ?? r) ? (r?.data ?? r) : [])).finally(() => setIsLoading(false));
                }}
            />
        </View>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard': return renderDashboard();
            case 'Machinery & Equipment List': return renderList();
            case 'Usage': return renderUsage();
            case 'Transfer Equipment': return renderTransfer();
            case 'Maintenance': return renderMaintenance();
            case 'Rental': return renderRental();
            case 'Purchase': return renderPurchase();
            case 'Reports': return renderReports();
            case 'Project Report': return renderProjectReport();
            default: return null;
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F1F5F9' }}>
            <TopHeader title="Machinery & Equipment" subtitle={`Engineer > ${activeProjectName} > Machinery`} />

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

                {/* Page header + Active Project */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 18, paddingBottom: 14 }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                        <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 }}>Machinery & Fleet</Text>
                        <Text style={{ fontSize: 12, color: '#64748B', marginTop: 3, fontWeight: '500' }}>Lifecycle tracking — allocation, usage, maintenance, cost</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>Active Project</Text>
                        <TouchableOpacity
                            disabled={true}
                            style={{
                                flexDirection: 'row', alignItems: 'center',
                                backgroundColor: '#fff',
                                borderWidth: 1.5, borderColor: '#2563EB',
                                borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
                                shadowColor: '#2563EB', shadowOpacity: 0.12, shadowOffset: { width: 0, height: 2 }, elevation: 2
                            }}
                        >
                            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563EB', marginRight: 8 }} />
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#2563EB', marginRight: 6 }}>{selectedProject.name}</Text>
                            <ChevronDown size={14} color="#2563EB" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tabs */}
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 5, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOpacity: 0.03, elevation: 1 }}>
                            {TABS.map(tab => {
                                const IconComp = TAB_ICONS[tab] || Activity;
                                const isActive = activeTab === tab;
                                return (
                                    <TouchableOpacity
                                        key={tab}
                                        onPress={() => { setActiveTab(tab); setPage(1); setSearchText(''); }}
                                        style={{
                                            flexDirection: 'row', alignItems: 'center',
                                            paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10,
                                            backgroundColor: isActive ? '#2563EB' : 'transparent',
                                            marginRight: 4,
                                        }}
                                    >
                                        <IconComp size={15} color={isActive ? '#fff' : '#64748B'} style={{ marginRight: 6 }} />
                                        <Text style={{ fontSize: 12, fontWeight: isActive ? '700' : '500', color: isActive ? '#fff' : '#475569' }}>
                                            {tab}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>

                {/* Tab content */}
                <View style={{ paddingHorizontal: 16, paddingBottom: 40 }}>
                    {renderContent()}
                </View>
            </ScrollView>

            {/* Active Project Modal */}
            <Modal visible={projectModalOpen} transparent animationType="fade" onRequestClose={() => setProjectModalOpen(false)}>
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center' }}
                    activeOpacity={1}
                    onPress={() => setProjectModalOpen(false)}
                >
                    <View style={{ marginHorizontal: 24, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1F2937' }}>Select Active Project</Text>
                            <TouchableOpacity onPress={() => setProjectModalOpen(false)}>
                                <X size={18} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        {projectOptions.map(proj => (
                            <TouchableOpacity
                                key={proj.id ?? 'all'}
                                onPress={() => { setSelectedProject({ id: proj.id ? parseInt(proj.id) : null, name: proj.name }); setProjectModalOpen(false); }}
                                style={{
                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                    paddingHorizontal: 16, paddingVertical: 14,
                                    borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
                                    backgroundColor: String(selectedProject.id) === String(proj.id) ? '#EFF6FF' : '#fff',
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: proj.id === null ? '#2563EB' : '#16A34A', marginRight: 12 }} />
                                    <Text style={{ fontSize: 14, color: String(selectedProject.id) === String(proj.id) ? '#1D4ED8' : '#374151', fontWeight: String(selectedProject.id) === String(proj.id) ? '700' : '400' }}>
                                        {proj.name}
                                    </Text>
                                </View>
                                {String(selectedProject.id) === String(proj.id) && (
                                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900' }}>✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
