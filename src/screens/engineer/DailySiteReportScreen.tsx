import { useNavigation } from 'expo-router';
import { Activity, AlertTriangle, BarChart2, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Edit3, Eye, FileSpreadsheet, FileText, Image as ImageIcon, Trash2, MapPin, Plus, RefreshCw, Search, X, Calendar, Briefcase, AlertCircle, Camera } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, ActivityIndicator, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { useProjectContext } from '../../contexts/ProjectContext';
import { dsrService, FALLBACK_DSRS } from '../../services/dsrService';

// ─── Modal Dropdown ───────────────────────────────────────────────────────────
function ModalDropdown({
    options, value, onSelect, label
}: { options: {id: string | null, name: string}[]; value: string | null; onSelect: (v: string | null) => void; label: string }) {
    const [open, setOpen] = useState(false);
    const selectedObj = options.find(o => String(o.id) === String(value)) || options[0];
    
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
                    {selectedObj?.name || 'All Status'}
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

// ─── Stat Card Component ──────────────────────────────────────────────────────
const StatCard = ({ title, value, subtitle, valueColor }: { title: string, value: number, subtitle: string, valueColor: string }) => (
    <View style={{ width: '100%', marginBottom: 16 }}>
        <View style={{
            backgroundColor: '#fff', borderRadius: 12, padding: 20,
            borderWidth: 1, borderColor: '#E5E7EB',
            shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
        }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{title}</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: valueColor === 'text-gray-900' ? '#111827' : valueColor === 'text-blue-500' ? '#3B82F6' : valueColor === 'text-green-500' ? '#10B981' : '#6B7280', marginBottom: 8 }}>
                {value}
            </Text>
            <Text style={{ fontSize: 11, color: '#9CA3AF' }}>{subtitle}</Text>
        </View>
    </View>
);

export default function DailySiteReportScreen() {
    const navigation = useNavigation();
    const { activeProjectId, projects, setActiveProject } = useProjectContext();
    const [activeTab, setActiveTab] = useState('ledger');
    
    // State
    const [dsrList, setDsrList] = useState<any[]>([]);
    const [labourTrend, setLabourTrend] = useState<any>(null);
    const [contractorAnalytics, setContractorAnalytics] = useState<any[]>([]);
    const [issueAnalytics, setIssueAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    
    // Pagination
    const [page, setPage] = useState(1);
    const limit = 10;
    
    // Filtering
        const [dsrPhotos, setDsrPhotos] = useState<Record<string, any[]>>({});
    const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedViewDsr, setSelectedViewDsr] = useState<any>(null);

    const handleViewDsr = async (id: string) => {
        try {
            const [fullDsr, photos] = await Promise.all([
                dsrService.getDsrById(id),
                dsrService.getDsrPhotos(id)
            ]);
            
            // Update photos map in case they changed
            setDsrPhotos(prev => ({ ...prev, [id]: photos }));
            
            setSelectedViewDsr({ ...fullDsr, id }); // Ensure ID is preserved
            setViewModalVisible(true);
        } catch (error) {
            Alert.alert("Error", "Could not fetch detailed DSR information.");
        }
    };


    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const projectOptions = [
        { id: null, name: 'All Projects' },
        ...projects.map(p => ({ id: String(p.id), name: p.name || (p as any).project_name || 'Unnamed Project' }))
    ];

    const statusOptions = [
        { id: null, name: 'ALL STATUS' },
        { id: 'DRAFT', name: 'DRAFT' },
        { id: 'SUBMITTED', name: 'SUBMITTED' },
        { id: 'APPROVED', name: 'APPROVED' },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const pId = activeProjectId ? String(activeProjectId) : 'all';
            const [dsrRes, labourRes, contractorRes, issueRes] = await Promise.allSettled([
                dsrService.getProjectDsrs(pId),
                dsrService.getLabourTrend(pId),
                dsrService.getContractorAnalytics(pId),
                dsrService.getIssueAnalytics(pId)
            ]);
            
            if (dsrRes.status === 'fulfilled') setDsrList(dsrRes.value && dsrRes.value.length > 0 ? dsrRes.value : FALLBACK_DSRS);
            if (labourRes.status === 'fulfilled') setLabourTrend(labourRes.value);
            if (contractorRes.status === 'fulfilled') setContractorAnalytics(contractorRes.value || []);
            if (issueRes.status === 'fulfilled') setIssueAnalytics(issueRes.value);
            // Fetch photos for each DSR
            if (dsrRes.status === 'fulfilled' && dsrRes.value && dsrRes.value.length > 0) {
                const dsrPhotos: Record<string, any[]> = {};
                await Promise.all(dsrRes.value.map(async (dsr: any) => {
                    try {
                        const photos = await dsrService.getDsrPhotos(dsr.id);
                        dsrPhotos[dsr.id] = photos;
                    } catch (e) {
                        dsrPhotos[dsr.id] = [];
                    }
                }));
                setDsrPhotos(dsrPhotos);
            }

            
        } catch (error: any) {
            Alert.alert('Fetch Error', error.response?.data?.message || error.message || 'Failed to fetch DSR data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        setPage(1);
    }, [activeProjectId]);

    // Derived stats
    
    
    const handleDeletePhoto = async () => {
        if (!selectedPhoto) return;
        setLoading(true);
        try {
            await dsrService.deleteDsrPhoto(selectedPhoto.id);
            Alert.alert('Success', 'Photo deleted successfully!');
            setPhotoModalVisible(false);
            setSelectedPhoto(null);
            await fetchData(); // refresh list
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || error.message || 'Failed to delete photo');
            setLoading(false);
        }
    };

    const handleSubmitDsr = async (id: string) => {
        setLoading(true);
        try {
            await dsrService.submitDsr(id);
            Alert.alert('Success', 'DSR submitted successfully!');
            await fetchData(); // refresh list
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || error.message || 'Failed to submit DSR');
            setLoading(false);
        }
    };

    const totalLogs = dsrList.length;
    const draftReports = dsrList.filter(d => d.status === 'DRAFT').length;
    const submittedReports = dsrList.filter(d => d.status === 'SUBMITTED').length;
    const approvedReports = dsrList.filter(d => d.status === 'APPROVED').length;

    const filteredList = dsrList.filter(item => {
        const matchesSearch = (item.work_summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (item.id || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter ? item.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    const paginatedList = filteredList.slice((page - 1) * limit, page * limit);
    const totalPages = Math.ceil(filteredList.length / limit) || 1;

    const renderPagination = () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, paddingBottom: 24 }}>
            <Text style={{ fontSize: 13, color: '#6B7280', marginRight: 16 }}>Records per page:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginRight: 24 }}>
                <Text style={{ fontSize: 13, color: '#374151', marginRight: 8 }}>10</Text>
                <ChevronDown size={14} color="#6B7280" />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity 
                    onPress={() => setPage(Math.max(1, page - 1))}
                    style={{ width: 32, height: 32, borderRadius: 6, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', marginRight: 8 }}
                >
                    <ChevronLeft size={16} color="#9CA3AF" />
                </TouchableOpacity>
                {[...Array(Math.min(3, totalPages))].map((_, i) => (
                    <TouchableOpacity 
                        key={i} 
                        onPress={() => setPage(i + 1)}
                        style={{ width: 32, height: 32, borderRadius: 6, borderWidth: 1, borderColor: page === i + 1 ? '#2563EB' : '#E5E7EB', alignItems: 'center', justifyContent: 'center', backgroundColor: page === i + 1 ? '#2563EB' : '#fff', marginRight: 8 }}
                    >
                        <Text style={{ fontSize: 13, fontWeight: '600', color: page === i + 1 ? '#fff' : '#4B5563' }}>{i + 1}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity 
                    onPress={() => setPage(Math.min(totalPages, page + 1))}
                    style={{ width: 32, height: 32, borderRadius: 6, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}
                >
                    <ChevronRight size={16} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderDsrRow = (item: any, index: number) => (
        <View key={item.id || index} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingVertical: 16 }}>
            {/* REPORT DETAILS */}
            <View style={{ width: 140, paddingRight: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 4 }}>{item.date?.split('T')[0] || '2026-09-21'}</Text>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>DAILY</Text>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>LEDGER</Text>
            </View>
            
            {/* WORK SUMMARY */}
            <View style={{ width: 280, paddingRight: 16, justifyContent: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 4 }}>{item.work_summary || 'site cleaning task'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <MapPin size={10} color="#9CA3AF" style={{ marginTop: 2, marginRight: 4 }} />
                    <Text style={{ fontSize: 11, color: '#9CA3AF', flex: 1 }} numberOfLines={2}>
                        {item.location || "PVG's College of Engineering and Technology"}
                    </Text>
                </View>
            </View>

            {/* STATUS */}
            <View style={{ width: 100, justifyContent: 'center' }}>
                <View style={{ alignSelf: 'flex-start', backgroundColor: (item.status === 'DRAFT' || !item.status) ? '#F3F4F6' : (item.status === 'SUBMITTED' ? '#DBEAFE' : '#D1FAE5'), paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: (item.status === 'DRAFT' || !item.status) ? '#6B7280' : (item.status === 'SUBMITTED' ? '#2563EB' : '#059669'), letterSpacing: 0.5 }}>{item.status || 'DRAFT'}</Text>
                </View>
            </View>

            {/* SITE MEDIA */}
            <View style={{ width: 100, justifyContent: 'center', alignItems: 'center' }}>
                {dsrPhotos[item.id] && dsrPhotos[item.id].length > 0 ? (
                    <TouchableOpacity onPress={() => { setSelectedPhoto(dsrPhotos[item.id][0]); setPhotoModalVisible(true); }}>
                        <View style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
                            <Image source={{ uri: dsrPhotos[item.id][0].url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon size={16} color="#D1D5DB" />
                    </View>
                )}
            </View>

            {/* ACTIONS */}
            <View style={{ width: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {(item.status === 'DRAFT' || !item.status) && (
                    <TouchableOpacity onPress={() => handleSubmitDsr(item.id)} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                        <CheckCircle size={14} color="#3B82F6" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={{ marginRight: 12 }} onPress={() => handleViewDsr(item.id)}>
                    <Eye size={16} color="#9CA3AF" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Edit3 size={16} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
        </View>
    );

return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <TopHeader title="Daily Site Reports" subtitle="Engineer > Site Records > DSR Vault" />

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
                {/* Header Text */}
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 4 }}>Project Daily Ledger</Text>
                <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>Historical record of activities, labour, and material movements.</Text>

                {/* Actions Group 1 */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <TouchableOpacity onPress={fetchData} style={{ width: 40, height: 40, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                        {loading ? <ActivityIndicator size="small" color="#4B5563" /> : <RefreshCw size={16} color="#9CA3AF" />}
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={{ backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 40, borderRadius: 8, marginRight: 12 }} onPress={() => dsrService.exportDsrExcel(activeProjectId ? String(activeProjectId) : 'all')}>
                        <FileText size={14} color="#DC2626" style={{ marginRight: 6 }} />
                        <Text style={{ color: '#DC2626', fontWeight: '700', fontSize: 13 }}>Export PDF</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={{ backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 40, borderRadius: 8 }} onPress={() => dsrService.exportDsrExcel(activeProjectId ? String(activeProjectId) : 'all')}>
                        <FileSpreadsheet size={14} color="#059669" style={{ marginRight: 6 }} />
                        <Text style={{ color: '#059669', fontWeight: '700', fontSize: 13 }}>Export Excel</Text>
                    </TouchableOpacity>
                </View>

                {/* Actions Group 2 */}
                <View style={{ marginBottom: 24 }}>
                    <TouchableOpacity style={{ backgroundColor: '#2563EB', alignSelf: 'flex-start', paddingHorizontal: 16, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>New DSR Entry</Text>
                    </TouchableOpacity>
                </View>

                {/* Stat Cards */}
                <StatCard title="TOTAL LOGS" value={totalLogs} subtitle="All Time Records" valueColor="text-gray-900" />
                <StatCard title="DRAFT REPORTS" value={draftReports} subtitle="Pending Submission" valueColor="text-gray-600" />
                <StatCard title="SUBMITTED REPORTS" value={submittedReports} subtitle="Pending Audit" valueColor="text-blue-500" />
                <StatCard title="APPROVED REPORTS" value={approvedReports} subtitle="Verified & Approved" valueColor="text-green-500" />

                {/* Tabs Container */}
                <View style={{ backgroundColor: '#F3F4F6', borderRadius: 8, flexDirection: 'row', padding: 4, marginBottom: 24, alignSelf: 'flex-start' }}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('ledger')}
                        style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6, backgroundColor: activeTab === 'ledger' ? '#fff' : 'transparent', shadowColor: activeTab === 'ledger' ? '#000' : 'transparent', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: activeTab === 'ledger' ? 1 : 0 }}
                    >
                        <Text style={{ fontSize: 13, fontWeight: '700', color: activeTab === 'ledger' ? '#2563EB' : '#6B7280' }}>DSR Ledger</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('analytics')}
                        style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6, backgroundColor: activeTab === 'analytics' ? '#fff' : 'transparent', shadowColor: activeTab === 'analytics' ? '#000' : 'transparent', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: activeTab === 'analytics' ? 1 : 0 }}
                    >
                        <Text style={{ fontSize: 13, fontWeight: '700', color: activeTab === 'analytics' ? '#2563EB' : '#6B7280' }}>Analytics Overview</Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'ledger' ? (
                    <View>
                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#9CA3AF', letterSpacing: 1, marginBottom: 16 }}>DSR LEDGER</Text>
                        
                        <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' }}>
                            {/* Filter Section */}
                            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 12, height: 40, marginBottom: 16 }}>
                                    <Search size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
                                    <TextInput
                                        style={{ flex: 1, fontSize: 13, color: '#374151' }}
                                        placeholder="Search by activity, location or ID..."
                                        placeholderTextColor="#9CA3AF"
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5, marginRight: 12 }}>STATUS:</Text>
                                    <ModalDropdown 
                                        options={statusOptions} 
                                        value={statusFilter} 
                                        onSelect={(v) => { setStatusFilter(v); setPage(1); }} 
                                        label="Filter by Status" 
                                    />
                                </View>
                            </View>

                            {/* Table */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={{ minWidth: 760 }}>
                                    {/* Table Header */}
                                    <View style={{ flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#F9FAFB' }}>
                                        <View style={{ width: 140, paddingLeft: 16 }}><Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9CA3AF', letterSpacing: 0.5 }}>REPORT DETAILS</Text></View>
                                        <View style={{ width: 280 }}><Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9CA3AF', letterSpacing: 0.5 }}>WORK SUMMARY</Text></View>
                                        <View style={{ width: 100 }}><Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9CA3AF', letterSpacing: 0.5 }}>STATUS</Text></View>
                                        <View style={{ width: 100, alignItems: 'center' }}><Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9CA3AF', letterSpacing: 0.5 }}>SITE MEDIA</Text></View>
                                        <View style={{ width: 120, alignItems: 'center' }}><Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9CA3AF', letterSpacing: 0.5 }}>ACTIONS</Text></View>
                                    </View>
                                    
                                    {/* Table Body */}
                                    <View style={{ paddingLeft: 16 }}>
                                        {loading ? (
                                            <View style={{ padding: 40, alignItems: 'center' }}><ActivityIndicator size="large" color="#3B82F6" /></View>
                                        ) : paginatedList.length === 0 ? (
                                            <View style={{ padding: 40, alignItems: 'center' }}>
                                                <Text style={{ color: '#6B7280', fontSize: 14 }}>No records found</Text>
                                            </View>
                                        ) : (
                                            paginatedList.map((item, i) => renderDsrRow(item, i))
                                        )}
                                    </View>
                                </View>
                            </ScrollView>

                            {renderPagination()}
                        </View>
                    </View>
                ) : (
                    <View>
                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#9CA3AF', letterSpacing: 1, marginBottom: 16 }}>ANALYTICS OVERVIEW</Text>
                        
                        {/* Labour Trend Chart */}
                        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#F3F4F6', marginBottom: 16 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                                <Activity size={16} color="#3B82F6" style={{ marginRight: 8 }} />
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#111827' }}>Labour Trend</Text>
                            </View>
                            
                            <View style={{ height: 200, flexDirection: 'row', alignItems: 'flex-end', paddingTop: 20 }}>
                                {/* Y-Axis */}
                                <View style={{ justifyContent: 'space-between', height: '100%', paddingRight: 12, paddingBottom: 24 }}>
                                    <Text style={{ fontSize: 10, color: '#9CA3AF' }}>2</Text>
                                    <Text style={{ fontSize: 10, color: '#9CA3AF' }}>1.5</Text>
                                    <Text style={{ fontSize: 10, color: '#9CA3AF' }}>1</Text>
                                    <Text style={{ fontSize: 10, color: '#9CA3AF' }}>0.5</Text>
                                    <Text style={{ fontSize: 10, color: '#9CA3AF' }}>0</Text>
                                </View>
                                
                                {/* Chart Area */}
                                <View style={{ flex: 1, height: '100%', position: 'relative' }}>
                                    {/* Grid Lines */}
                                    {[0, 25, 50, 75, 100].map(p => (
                                        <View key={p} style={{ position: 'absolute', left: 0, right: 0, bottom: `${p}%`, height: 1, backgroundColor: '#F3F4F6', borderStyle: 'dashed' }} />
                                    ))}
                                    
                                    {/* Data Points / Approximation of Line Chart */}
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 24, zIndex: 10 }}>
                                        {((labourTrend?.data && labourTrend.data.length > 0) ? labourTrend.data : [1, 1, 1.2, 2, 0.2, 0.2, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2]).map((val: number, i: number, arr: number[]) => {
                                            const max = Math.max(...arr) || 2;
                                            const height = (val / max) * 100;
                                        return (
                                                <View key={i} style={{ flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                                                    <View style={{ width: 2, height: `${height}%`, backgroundColor: '#3B82F6', alignItems: 'center' }}>
                                                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6', position: 'absolute', top: -5 }} />
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                    
                                    {/* X-Axis Labels */}
                                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 10, color: '#9CA3AF' }}>Aug 25</Text>
                                        <Text style={{ fontSize: 10, color: '#9CA3AF' }}>Aug 30</Text>
                                        <Text style={{ fontSize: 10, color: '#9CA3AF' }}>Sep 3</Text>
                                        <Text style={{ fontSize: 10, color: '#9CA3AF' }}>Sep 6</Text>
                                        <Text style={{ fontSize: 10, color: '#9CA3AF' }}>Sep 9</Text>
                                        <Text style={{ fontSize: 10, color: '#9CA3AF' }}>Sep 15</Text>
                                        <Text style={{ fontSize: 10, color: '#9CA3AF' }}>Sep 21</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Contractor Performance */}
                        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#F3F4F6', marginBottom: 16 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                                <BarChart2 size={16} color="#10B981" style={{ marginRight: 8 }} />
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#111827' }}>Contractor Performance</Text>
                            </View>
                            
                            <View style={{ height: 180, flexDirection: 'row', alignItems: 'flex-end', paddingTop: 10, marginBottom: 24 }}>
                                {/* Y-Axis */}
                                <View style={{ justifyContent: 'space-between', height: '100%', paddingRight: 12, paddingBottom: 24 }}>
                                    <Text style={{ fontSize: 10, color: '#9CA3AF' }}>20</Text>
                                    <Text style={{ fontSize: 10, color: '#9CA3AF' }}>15</Text>
                                    <Text style={{ fontSize: 10, color: '#9CA3AF' }}>10</Text>
                                    <Text style={{ fontSize: 10, color: '#9CA3AF' }}>5</Text>
                                    <Text style={{ fontSize: 10, color: '#9CA3AF' }}>0</Text>
                                </View>
                                {/* Chart Area */}
                                <View style={{ flex: 1, height: '100%', position: 'relative' }}>
                                     {[0, 25, 50, 75, 100].map(p => (
                                        <View key={p} style={{ position: 'absolute', left: 0, right: 0, bottom: `${p}%`, height: 1, backgroundColor: '#F3F4F6', borderStyle: 'dashed' }} />
                                    ))}
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: 24, zIndex: 10 }}>
                                        {contractorAnalytics.length > 0 ? contractorAnalytics.map((c, i) => {
                                            const max = Math.max(...contractorAnalytics.map((x: any) => x.entries_count)) || 20;
                                            const h = (c.entries_count / max) * 100;
                                        return (
                                                <View key={i} style={{ alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                                                    <View style={{ width: 16, height: `${h}%`, backgroundColor: '#10B981', borderTopLeftRadius: 2, borderTopRightRadius: 2 }} />
                                                </View>
                                            );
                                        }) : [18, 6].map((v, i) => (
                                            <View key={i} style={{ alignItems: 'center', height: '100%', justifyContent: 'flex-end', width: 60 }}>
                                                <View style={{ width: 16, height: `${(v/20)*100}%`, backgroundColor: '#10B981', borderTopLeftRadius: 2, borderTopRightRadius: 2 }} />
                                                <Text style={{ position: 'absolute', bottom: -20, fontSize: 10, color: '#9CA3AF' }}>
                                                    {i === 0 ? 'Unknown' : 'komal bh...'}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            {/* Data Table */}
                            <View style={{ backgroundColor: '#F9FAFB', borderRadius: 8, overflow: 'hidden' }}>
                                <View style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                                    <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', color: '#6B7280', letterSpacing: 0.5 }}>CONTRACTOR</Text>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#6B7280', letterSpacing: 0.5 }}>ENTRIES</Text>
                                </View>
                                {(contractorAnalytics.length > 0 ? contractorAnalytics : [{contractor: 'Unknown', entries_count: 18}, {contractor: 'komal bhangale', entries_count: 6}]).map((c, i) => (
                                    <View key={i} style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#fff' }}>
                                        <Text style={{ flex: 1, fontSize: 12, color: '#374151', fontWeight: '500' }}>{c.contractor}</Text>
                                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#10B981' }}>{c.entries_count}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        
                        {/* Issue Analytics */}
                        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#F3F4F6' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                <AlertTriangle size={16} color={issueAnalytics?.reports_with_issues > 0 ? "#EF4444" : "#10B981"} style={{ marginRight: 8 }} />
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#111827' }}>Issue Analytics</Text>
                            </View>
                            <View style={{ flexDirection: 'row', backgroundColor: issueAnalytics?.reports_with_issues > 0 ? '#FEF2F2' : '#ECFDF5', padding: 12, borderRadius: 8, alignItems: 'center' }}>
                                <AlertTriangle size={20} color={issueAnalytics?.reports_with_issues > 0 ? "#EF4444" : "#10B981"} style={{ marginRight: 12 }} />
                                <View>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: issueAnalytics?.reports_with_issues > 0 ? "#991B1B" : "#065F46" }}>
                                        {issueAnalytics?.reports_with_issues || 0} Issues Found
                                    </Text>
                                    <Text style={{ fontSize: 12, color: issueAnalytics?.reports_with_issues > 0 ? "#B91C1C" : "#047857" }}>
                                        {issueAnalytics?.reports_with_issues > 0 ? `Issues across ${issueAnalytics.total_reports} total reports` : 'No critical issues reported'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                    </View>
                )}
            </ScrollView>

            {/* Photo Popup Modal */}
            <Modal visible={photoModalVisible} transparent animationType="fade" onRequestClose={() => setPhotoModalVisible(false)}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }} activeOpacity={1} onPress={() => setPhotoModalVisible(false)}>
                    <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', width: 300, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10 }}>
                        {selectedPhoto && (
                            <View style={{ padding: 16 }}>
                                <View style={{ width: '100%', height: 160, borderRadius: 12, overflow: 'hidden', marginBottom: 16, backgroundColor: '#F3F4F6' }}>
                                    <Image source={{ uri: selectedPhoto.url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 10, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => Linking.openURL(selectedPhoto.url)}>
                                        <Eye size={14} color="#4B5563" style={{ marginRight: 6 }} />
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#4B5563' }}>View</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#FEF2F2', paddingVertical: 10, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={handleDeletePhoto}>
                                        <Trash2 size={14} color="#EF4444" style={{ marginRight: 6 }} />
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#EF4444' }}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* View DSR Modal */}
            <Modal visible={viewModalVisible} transparent animationType="slide" onRequestClose={() => setViewModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '90%', padding: 24 }}>
                        {/* Header */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>DSR Intelligence Insight</Text>
                            <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                                <X size={24} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                        
                        {selectedViewDsr && (
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                                
                                {/* Top Blue Summary Card */}
                                <View style={{ backgroundColor: '#1E3A8A', borderRadius: 16, padding: 16, marginBottom: 24, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 60, height: 60, backgroundColor: '#fff', borderRadius: 12, marginRight: 16, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
                                        {dsrPhotos[selectedViewDsr.id]?.[0] ? (
                                            <Image source={{ uri: dsrPhotos[selectedViewDsr.id][0].url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                                        ) : (
                                            <ImageIcon size={24} color="#9CA3AF" />
                                        )}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>Report #{selectedViewDsr.id}</Text>
                                        <Text style={{ color: '#93C5FD', fontSize: 12 }}>{new Date(selectedViewDsr.report_date).toDateString()}</Text>
                                    </View>
                                    <View style={{ backgroundColor: '#FEF08A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                                        <Text style={{ color: '#854D0E', fontSize: 12, fontWeight: '700' }}>{selectedViewDsr.weather_condition || 'Sunny'}</Text>
                                    </View>
                                </View>

                                {/* Site Documentation */}
                                <View style={{ marginBottom: 24 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                        <Camera size={16} color="#4B5563" style={{ marginRight: 8 }} />
                                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#4B5563', letterSpacing: 0.5 }}>SITE DOCUMENTATION</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 12 }}>
                                        {dsrPhotos[selectedViewDsr.id]?.slice(0, 3).map((photo: any, index: number) => (
                                            <View key={index} style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
                                                <Image source={{ uri: photo.url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                                            </View>
                                        )) || (
                                            <View style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
                                                <ImageIcon size={24} color="#9CA3AF" />
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* Resource Logistics */}
                                <View style={{ marginBottom: 24 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                        <View style={{ backgroundColor: '#EFF6FF', padding: 6, borderRadius: 8, marginRight: 8 }}>
                                            <FileText size={16} color="#3B82F6" />
                                        </View>
                                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 0.5 }}>RESOURCE LOGISTICS</Text>
                                    </View>

                                    <View style={{ marginBottom: 16 }}>
                                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 }}>MATERIAL RECEIVED</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B' }}>{selectedViewDsr.material_received || 'Nil'}</Text>
                                    </View>
                                    <View style={{ marginBottom: 16 }}>
                                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 }}>MATERIAL USED</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B' }}>{selectedViewDsr.material_used || 'Nil'}</Text>
                                    </View>
                                    <View style={{ marginBottom: 16 }}>
                                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 }}>MACHINERY USED</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B' }}>{selectedViewDsr.machinery_used || 'Nil'}</Text>
                                    </View>
                                </View>

                                {/* Constraints & Observations */}
                                <View style={{ marginBottom: 24 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                        <View style={{ backgroundColor: '#FEF2F2', padding: 6, borderRadius: 8, marginRight: 8 }}>
                                            <AlertCircle size={16} color="#EF4444" />
                                        </View>
                                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#F43F5E', letterSpacing: 0.5 }}>CONSTRAINTS & OBSERVATIONS</Text>
                                    </View>

                                    <View style={{ marginBottom: 16 }}>
                                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 8 }}>ISSUES</Text>
                                        <View style={{ backgroundColor: '#FFF1F2', padding: 16, borderRadius: 12 }}>
                                            <Text style={{ fontSize: 13, color: '#E11D48', fontWeight: '500' }}>{selectedViewDsr.issues || 'No operational constraints reported today.'}</Text>
                                        </View>
                                    </View>

                                    <View style={{ marginBottom: 16 }}>
                                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 8 }}>SAFETY OBSERVATIONS</Text>
                                        <View style={{ backgroundColor: '#FFFBEB', padding: 16, borderRadius: 12 }}>
                                            <Text style={{ fontSize: 13, color: '#D97706', fontWeight: '500' }}>{selectedViewDsr.safety_observations || 'No safety observations.'}</Text>
                                        </View>
                                    </View>

                                    <View style={{ marginBottom: 16 }}>
                                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 8 }}>REMARKS</Text>
                                        <View style={{ backgroundColor: '#EFF6FF', padding: 16, borderRadius: 12 }}>
                                            <Text style={{ fontSize: 13, color: '#2563EB', fontWeight: '500' }}>{selectedViewDsr.remarks || 'No additional remarks.'}</Text>
                                        </View>
                                    </View>
                                </View>

                            </ScrollView>
                        )}

                        {/* Bottom Actions */}
                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 24, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
                            <TouchableOpacity onPress={() => setViewModalVisible(false)} style={{ backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}>
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Dismiss Report</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}
