import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { Search, RefreshCw, ChevronDown, ChevronLeft, ChevronRight, Plus, Key, PenTool, ExternalLink, Edit2, Trash2, FileText, FileSpreadsheet } from 'lucide-react-native';

const TABS = [
    'Dashboard',
    'Machinery & Equipment List',
    'Usage',
    'Transfer Equipment',
    'Maintenance',
    'Rental',
    'Purchase',
    'Reports',
    'Project Report'
];

const MAINTENANCE_ALERTS = [
    { id: '1', eq: 'Equipment', due: 'Due in -27 days (2026-07-29)', status: 'OVERDUE' },
    { id: '2', eq: 'Equipment', due: 'Due in -13 days (2026-08-12)', status: 'OVERDUE' },
    { id: '3', eq: 'Equipment', due: 'Due in -11 days (2026-08-14)', status: 'OVERDUE' },
    { id: '4', eq: 'Equipment', due: 'Due in 5 days (2026-08-30)', status: 'UPCOMING' },
    { id: '5', eq: 'Equipment', due: 'Due in 6 days (2026-08-31)', status: 'UPCOMING' },
    { id: '6', eq: 'Equipment', due: 'Due in 8 days (2026-09-02)', status: 'UPCOMING' },
];

const EQUIPMENT_LIST = [
    { id: '1', eq: 'Mixer', code: 'EQ0030', project: 'Sara City', ownership: 'IN_PROJECT', operator: 'Tejas', usage: 'N/A', condition: 'GOOD', maintenance: '2026-08-10' },
    { id: '2', eq: 'Hammer Gun', code: 'EQ0025', project: 'Sara City', ownership: 'IN_PROJECT', operator: 'Komal', usage: 'N/A', condition: 'GOOD', maintenance: '2026-08-10' },
    { id: '3', eq: 'Drill', code: 'EQ0012', project: 'Sara City', ownership: 'IN_PROJECT', operator: 'Sumit', usage: 'N/A', condition: 'REPAIR', maintenance: '2026-07-31' },
    { id: '4', eq: 'Hammer', code: 'EQ-001', project: 'Sara City', ownership: 'IN_PROJECT', operator: 'Tejas', usage: 'N/A', condition: 'GOOD', maintenance: '2026-07-15' },
];

const USAGE_SUMMARY = [
    { id: '1', eq: 'EQ-002', hrs: 8, fuel: 5, avg: '8.0', entries: 1 },
    { id: '2', eq: 'EQ0011', hrs: 5, fuel: 20, avg: '5.0', entries: 1 },
    { id: '3', eq: 'E-001', hrs: 6, fuel: 6, avg: '6.0', entries: 1 },
    { id: '4', eq: 'AU-001', hrs: 5, fuel: 10, avg: '5.0', entries: 1 },
];

const TRANSFER_EQUIPMENT = [
    { id: '1', name: 'Mixer', code: 'EQ0030' },
    { id: '2', name: 'Hammer Gun', code: 'EQ0025' },
    { id: '3', name: 'Drill', code: 'EQ0012' },
    { id: '4', name: 'Hammer', code: 'EQ-001' },
];

const TRANSFER_HISTORY = [
    { id: '1', eq: 'Mixer', from: 'Gini Viviana', to: 'Sara City', by: '-', details: '8/11/2026, 11:18:05 AM\nIP: 106.193.123.168' },
    { id: '2', eq: 'Mixer', from: 'Sara City', to: 'Gini Viviana', by: '-', details: '8/7/2026, 11:11:16 AM\nIP: 136.23.131.125' },
];

const MAINTENANCE_CARDS = [
    { id: 'EQ013', due: '2026-07-29', days: '-27 days', status: 'OVERDUE' },
    { id: 'EQ0033', due: '2026-08-12', days: '-13 days', status: 'OVERDUE' },
    { id: 'EQ0018', due: '2026-08-14', days: '-11 days', status: 'OVERDUE' },
    { id: 'EQ0026', due: '2026-08-30', days: '5 days', status: 'UPCOMING' },
    { id: 'EQ0048', due: '2026-08-31', days: '6 days', status: 'UPCOMING' },
    { id: 'EQ0049', due: '2026-09-02', days: '8 days', status: 'UPCOMING' },
];

const MAINTENANCE_EQUIPMENT = [
    { id: 'EQ0049', name: 'Equipment' },
    { id: 'EQ0045', name: 'Hydraulic Crane' },
    { id: 'EQ0033', name: 'Grinder' },
    { id: 'EQ0026', name: 'Hammer Gun' },
    { id: 'EQ0018', name: 'Mixer' },
    { id: 'EQ013', name: 'Mixer' },
];

const RENTAL_HISTORY = [
    { id: '1', eq: 'EQ-51', start: '2026-08-24', end: '2026-08-25', cost: '₹500', client: 'Tejas', notes: 'dsfgvdfndfnsf', status: 'ACTIVE' },
    { id: '2', eq: 'EQ-10', start: '2026-08-24', end: '2026-08-24', cost: '₹55', client: 'Sdfa', notes: '-', status: 'COMPLETED' },
    { id: '3', eq: 'EQ-8', start: '2026-08-24', end: '2026-08-24', cost: '₹3,434', client: 'Saf', notes: '-', status: 'COMPLETED' },
    { id: '4', eq: 'EQ-2', start: '2026-08-24', end: '2026-08-24', cost: '₹444', client: 'Sdfa', notes: '-', status: 'COMPLETED' },
    { id: '5', eq: 'EQ-17', start: '2026-08-24', end: '2026-08-24', cost: '₹34', client: 'Sad', notes: '-', status: 'COMPLETED' },
    { id: '6', eq: 'EQ-13', start: '2026-08-24', end: '2026-08-24', cost: '₹343', client: 'Adf', notes: '-', status: 'COMPLETED' },
    { id: '7', eq: 'EQ-28', start: '2026-08-24', end: '2026-08-24', cost: '₹234', client: 'Aa', notes: '-', status: 'COMPLETED' },
    { id: '8', eq: 'EQ-28', start: '2026-08-21', end: '2026-08-21', cost: '₹200', client: '100', notes: '-', status: 'COMPLETED' },
    { id: '9', eq: 'EQ-45', start: '2026-08-20', end: '2026-08-21', cost: '₹2,000', client: 'Sumit', notes: 'pok[]p', status: 'COMPLETED' },
    { id: '10', eq: 'EQ-19', start: '2026-08-10', end: '2026-08-21', cost: '₹500', client: 'Suma', notes: 'uoip[okl[pl;o', status: 'COMPLETED' },
];

const PURCHASE_HISTORY = [
    { id: '1', project: 'Sara City', item: '-', type: 'NEW', name: 'Hammer Gun', date: '2026-08-25', vendor: 'tejas', inv: '20', qty: 100, price: '₹200', total: '₹20,000', warranty: '2026-08-30', notes: 'ujsyuitehjj', created: '8/25/2026, 9:31:33 AM' },
    { id: '2', project: 'Sara City', item: '-', type: 'USED', name: 'Mixer', date: '2026-08-24', vendor: 'sumit', inv: '12', qty: 5, price: '₹500', total: '₹2,500', warranty: '2026-08-28', notes: 'ydfngndhfdfn', created: '8/24/2026, 3:04:24 PM' },
    { id: '3', project: 'Sara City', item: '-', type: 'USED', name: 'Suction Pump', date: '2026-08-21', vendor: 'tejas', inv: 'INV0012', qty: 100, price: '₹20', total: '₹2,000', warranty: '2026-08-27', notes: 'pl[k;][', created: '8/21/2026, 9:22:03 AM' },
    { id: '4', project: 'Sara City', item: '-', type: 'NEW', name: 'Backhoe Loader', date: '2026-08-20', vendor: 'sumit', inv: 'INV0016', qty: 1, price: '₹10', total: '₹10', warranty: '-', notes: '-', created: '8/20/2026, 7:01:25 AM' },
    { id: '5', project: 'Sara City', item: '-', type: 'NEW', name: 'Bulldozer', date: '2026-08-19', vendor: 'sumit', inv: 'INV0015', qty: 2, price: '₹1,000', total: '₹2,000', warranty: '2026-08-20', notes: 'fghfghghgh', created: '8/19/2026, 11:04:08 AM' },
    { id: '6', project: 'Sara City', item: '-', type: 'NEW', name: 'Mixer', date: '2026-08-11', vendor: 'sumit', inv: 'INV-2026-001', qty: 100, price: '₹100', total: '₹10,000', warranty: '2026-08-13', notes: 'uiyhghhhbhhhi', created: '8/11/2026, 3:17:05 PM' },
    { id: '7', project: 'Sara City', item: '-', type: 'USED', name: 'Drill', date: '2026-08-11', vendor: 'sumit', inv: 'INV-009', qty: 10, price: '₹500', total: '₹5,000', warranty: '2026-08-12', notes: 'tyuiyrt', created: '8/11/2026, 3:28:04 PM' },
    { id: '8', project: 'Sara City', item: '-', type: 'USED', name: 'Mixer', date: '2026-08-11', vendor: 'tejas', inv: 'INV-2026-03', qty: 100, price: '₹300', total: '₹30,000', warranty: '2026-08-15', notes: 'rttttttttttttt', created: '8/11/2026, 3:14:25 PM' },
    { id: '9', project: 'Sara City', item: '-', type: 'USED', name: 'Grinder', date: '2026-08-10', vendor: 'tejas', inv: 'INV-2026-001', qty: 1, price: '₹100', total: '₹100', warranty: '2026-08-14', notes: 'dfgfdnyhdgfdfy', created: '8/10/2026, 12:24:13 PM' },
    { id: '10', project: 'Rohan Harita', item: '-', type: 'NEW', name: 'Hammer', date: '2026-07-16', vendor: 'tejas', inv: 'null', qty: 10, price: '₹10', total: '₹100', warranty: '2026-07-21', notes: 'string', created: '7/16/2026, 6:18:47 AM' },
];

const UTILIZATION_REPORT = [
    { id: '1', eq: 'Hammer', hrs: 0, rate: 0 },
    { id: '2', eq: 'EQ-002', hrs: 8, rate: 3.85 },
    { id: '3', eq: 'EQ-005', hrs: 0, rate: 0 },
    { id: '4', eq: 'EQ-007', hrs: 0, rate: 0 },
    { id: '5', eq: 'EQ-008', hrs: 0, rate: 0 },
    { id: '6', eq: 'EQ-009', hrs: 0, rate: 0 },
];

const COST_REPORT = [
    { id: '1', eq: 'EQ0045', cost: '₹3,500', rentals: 2, avg: '₹1,750', days: 3, perDay: '₹1,166.67' },
    { id: '2', eq: 'EQ-010', cost: '₹3,434', rentals: 1, avg: '₹3,434', days: 1, perDay: '₹3,434' },
    { id: '3', eq: 'EQ0037', cost: '₹1,200', rentals: 1, avg: '₹1,200', days: 16, perDay: '₹75' },
    { id: '4', eq: 'EQ0028', cost: '₹1,100', rentals: 2, avg: '₹550', days: 2, perDay: '₹550' },
];

const PURCHASE_REPORT = [
    { id: '1', eq: 'Mixer', count: 2, qty: '105', cost: '₹32,500', type: 'USED' },
    { id: '2', eq: 'Hammer Gun', count: 1, qty: '100', cost: '₹20,000', type: 'NEW' },
    { id: '3', eq: 'Mixer', count: 1, qty: '100', cost: '₹10,000', type: 'NEW' },
    { id: '4', eq: 'Drill', count: 1, qty: '10', cost: '₹5,000', type: 'USED' },
    { id: '5', eq: 'Bulldozer', count: 1, qty: '2', cost: '₹2,000', type: 'NEW' },
    { id: '6', eq: 'Suction Pump', count: 1, qty: '100', cost: '₹2,000', type: 'USED' },
];

const AVAILABILITY_REPORT = [
    { id: '1', eq: 'Hammer', status: 'FALSE', project: 'Sara City' },
    { id: '2', eq: 'Drill', status: 'FALSE', project: 'Sara City' },
    { id: '3', eq: 'Hammer Gun', status: 'FALSE', project: 'Sara City' },
    { id: '4', eq: 'Mixer', status: 'FALSE', project: 'Sara City' },
];


export default function MachineryEquipmentScreen() {
    const [activeTab, setActiveTab] = useState('Dashboard');

    const renderPagination = (totalRecords: number, showLabel = true) => (
        <View className="p-4 border-t border-gray-100 flex-row justify-between items-center bg-white">
            <View className="flex-row items-center">
                <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
                <TouchableOpacity className="flex-row items-center px-2 py-1 border border-gray-200 rounded bg-white">
                    <Text className="text-xs text-gray-700 mr-1">10</Text>
                    <ChevronDown size={14} color="#6B7280" />
                </TouchableOpacity>
            </View>
            <Text className="text-xs text-gray-500">Showing 1 - {Math.min(10, totalRecords)} of {totalRecords} records</Text>
            <View className="flex-row items-center space-x-1">
                <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white opacity-50">
                    <ChevronLeft size={14} color="#9CA3AF" />
                </TouchableOpacity>
                <TouchableOpacity className="w-6 h-6 items-center justify-center rounded bg-blue-600">
                    <Text className="text-xs text-white font-medium">1</Text>
                </TouchableOpacity>
                {totalRecords > 10 && (
                    <>
                        <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white">
                            <Text className="text-xs text-gray-600 font-medium">2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white">
                            <Text className="text-xs text-gray-600 font-medium">3</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white">
                            <Text className="text-xs text-gray-600 font-medium">4</Text>
                        </TouchableOpacity>
                    </>
                )}
                <TouchableOpacity className="w-6 h-6 items-center justify-center rounded border border-gray-200 bg-white">
                    <ChevronRight size={14} color="#6B7280" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderDashboard = () => (
        <View>
            <View className="mb-4">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Quick Stats</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-48 mr-3">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Equipment</Text>
                        <Text className="text-xl font-bold text-gray-800 mb-1">4</Text>
                        <Text className="text-xs text-gray-400">Registered Units</Text>
                    </View>
                    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-48 mr-3">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Available</Text>
                        <Text className="text-xl font-bold text-green-500 mb-1">0</Text>
                        <Text className="text-xs text-gray-400">Ready for deploy</Text>
                    </View>
                    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-48 mr-3">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Allocated</Text>
                        <Text className="text-xl font-bold text-blue-500 mb-1">4</Text>
                        <Text className="text-xs text-gray-400">Currently in use</Text>
                    </View>
                    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-48 mr-3">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Maintenance Due</Text>
                        <Text className="text-xl font-bold text-orange-500 mb-1">6</Text>
                        <Text className="text-xs text-gray-400">Upcoming/Overdue</Text>
                    </View>
                    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-48 mr-3">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Equipment Alerts</Text>
                        <Text className="text-xl font-bold text-red-500 mb-1">0</Text>
                        <Text className="text-xs text-gray-400">Issues detected</Text>
                    </View>
                    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-48">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Rental/Mo</Text>
                        <Text className="text-xl font-bold text-purple-500 mb-1">₹11,644</Text>
                        <Text className="text-xs text-gray-400">Estimated cost</Text>
                    </View>
                </ScrollView>
            </View>

            <View className="mb-4">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Alerts & Maintenance</Text>
                <View className="flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    {/* Maintenance Alerts */}
                    <View className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10">
                        <View className="p-4 border-b border-gray-100 flex-row items-center">
                            <PenTool size={16} color="#F59E0B" className="mr-2" />
                            <Text className="text-xs font-bold text-gray-800 tracking-wider uppercase">Maintenance Alerts</Text>
                        </View>
                        <View className="p-4 space-y-3">
                            {MAINTENANCE_ALERTS.map(alert => (
                                <View key={alert.id} className="flex-row items-center justify-between p-3 border border-gray-50 bg-gray-50/50 rounded-lg">
                                    <View>
                                        <Text className="text-sm font-bold text-gray-800">{alert.eq}</Text>
                                        <Text className="text-xs text-gray-500 mt-1">{alert.due}</Text>
                                    </View>
                                    <View className={`px-2 py-0.5 rounded ${alert.status === 'OVERDUE' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                                        <Text className={`text-[10px] font-bold ${alert.status === 'OVERDUE' ? 'text-red-500' : 'text-yellow-600'}`}>{alert.status}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Equipment Alerts */}
                    <View className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10">
                        <View className="p-4 border-b border-gray-100 flex-row items-center">
                            <Text className="text-xs font-bold text-red-500 tracking-wider uppercase">⚠ Equipment Alerts</Text>
                        </View>
                        <View className="p-4 flex-1 items-center justify-center min-h-[300px]">
                            <Text className="text-sm text-gray-400">No equipment alerts</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderList = () => (
        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase">Equipment Register</Text>
            </View>
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <View className="flex-row items-center space-x-3 flex-1">
                    <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-64">
                        <Search size={16} color="#9CA3AF" />
                        <TextInput placeholder="Search by name, code or operator..." className="ml-2 flex-1 text-sm text-gray-700" />
                    </View>
                    <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-36">
                        <Text className="text-sm text-gray-700">All Conditions</Text>
                        <ChevronDown size={14} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 w-36">
                        <Text className="text-sm text-gray-700">All Projects</Text>
                        <ChevronDown size={14} color="#6B7280" />
                    </TouchableOpacity>
                    <View className="flex-row items-center ml-2">
                        <View className="w-4 h-4 border border-gray-300 rounded mr-2 bg-white" />
                        <Text className="text-sm text-gray-600">Archived</Text>
                    </View>
                </View>
                <View className="flex-row items-center space-x-2">
                    <TouchableOpacity className="flex-row items-center px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                        <RefreshCw size={14} color="#6B7280" className="mr-2" />
                        <Text className="text-sm text-gray-700">Refresh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center px-4 py-2 bg-blue-600 rounded-lg shadow-sm">
                        <Plus size={16} color="#ffffff" className="mr-2" />
                        <Text className="font-bold text-xs text-white">Add Equipment</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                    <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                        <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Equipment</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Project</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ownership</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Operator</Text>
                        <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Usage</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Condition</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Maintenance</Text>
                        <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</Text>
                    </View>
                    {EQUIPMENT_LIST.map((row, index) => (
                        <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                            <View className="w-48">
                                <Text className="text-sm font-semibold text-gray-800">{row.eq}</Text>
                                <Text className="text-xs text-gray-500">{row.code}</Text>
                            </View>
                            <View className="w-32">
                                <View className="px-2 py-0.5 rounded border border-blue-200 bg-blue-50 self-start">
                                    <Text className="text-[10px] font-bold text-blue-600">{row.project}</Text>
                                </View>
                            </View>
                            <View className="w-32">
                                <Text className="text-xs font-bold text-blue-500">{row.ownership}</Text>
                            </View>
                            <Text className="w-32 text-sm text-gray-700">{row.operator}</Text>
                            <Text className="w-24 text-sm text-gray-500 text-center">{row.usage}</Text>
                            <View className="w-32 items-center">
                                <View className={`px-2 py-0.5 rounded ${row.condition === 'GOOD' ? 'bg-green-500' : 'bg-orange-500'}`}>
                                    <Text className="text-[10px] font-bold text-white">{row.condition}</Text>
                                </View>
                            </View>
                            <Text className="w-32 text-sm text-gray-700">{row.maintenance}</Text>
                            <View className="w-40 flex-row justify-end space-x-3">
                                <ExternalLink size={14} color="#9CA3AF" />
                                <Edit2 size={14} color="#9CA3AF" />
                                <Trash2 size={14} color="#9CA3AF" />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {renderPagination(4)}
        </View>
    );

    const renderUsage = () => (
        <View className="flex-1">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xs font-bold text-gray-800 tracking-widest uppercase">Usage Analytics</Text>
                <TouchableOpacity className="flex-row items-center px-4 py-2 bg-green-600 rounded-lg shadow-sm">
                    <Plus size={16} color="#ffffff" className="mr-2" />
                    <Text className="font-bold text-xs text-white">Log Usage</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row justify-between mb-4 space-x-4">
                <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Hours Logged</Text>
                    <Text className="text-2xl font-bold text-blue-500 mb-1">24</Text>
                    <Text className="text-xs text-gray-400">All equipment</Text>
                </View>
                <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Fuel Consumed</Text>
                    <Text className="text-2xl font-bold text-orange-500 mb-1">41 L</Text>
                    <Text className="text-xs text-gray-400">All equipment</Text>
                </View>
                <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Usage Entries</Text>
                    <Text className="text-2xl font-bold text-green-500 mb-1">4</Text>
                    <Text className="text-xs text-gray-400">Total logs recorded</Text>
                </View>
            </View>

            <View className="flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <View className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10">
                    <View className="p-4 border-b border-gray-100 flex-row items-center">
                        <Text className="text-xs font-bold text-gray-800 tracking-wider uppercase">Usage Report Summary</Text>
                    </View>
                    <View>
                        <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Equipment</Text>
                            <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Hrs</Text>
                            <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Fuel</Text>
                            <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Avg Hrs</Text>
                            <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Entries</Text>
                        </View>
                        {USAGE_SUMMARY.map((row, index) => (
                            <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <Text className="w-32 text-sm font-bold text-blue-500">{row.eq}</Text>
                                <Text className="w-24 text-sm text-gray-700">{row.hrs}</Text>
                                <Text className="w-24 text-sm text-gray-700">{row.fuel}</Text>
                                <Text className="w-24 text-sm text-gray-700">{row.avg}</Text>
                                <Text className="w-24 text-sm text-gray-700">{row.entries}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10">
                    <View className="p-4 border-b border-gray-100 flex-row items-center">
                        <Text className="text-xs font-bold text-gray-800 tracking-wider uppercase">Logs — Mixer</Text>
                    </View>
                    <View className="p-4 flex-1 items-center justify-center min-h-[250px]">
                        <Text className="text-sm text-gray-400">No logs to display</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderTransfer = () => (
        <View className="flex-1">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xs font-bold text-gray-800 tracking-widest uppercase">Transfer Equipment</Text>
                <TouchableOpacity className="flex-row items-center px-4 py-2 bg-indigo-600 rounded-lg shadow-sm">
                    <ExternalLink size={16} color="#ffffff" className="mr-2" />
                    <Text className="font-bold text-xs text-white">Create Transfer</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <View className="w-64 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10">
                    <View className="p-4 border-b border-gray-100">
                        <Text className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Select Equipment</Text>
                    </View>
                    <TouchableOpacity className="px-4 py-3 border-b border-gray-50">
                        <Text className="text-sm font-semibold text-gray-800">All Equipment</Text>
                    </TouchableOpacity>
                    {TRANSFER_EQUIPMENT.map((eq, index) => (
                        <TouchableOpacity key={eq.id} className={`px-4 py-3 border-b border-gray-50 ${index === 0 ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}>
                            <Text className={`text-sm font-semibold ${index === 0 ? 'text-indigo-700' : 'text-gray-800'}`}>{eq.name}</Text>
                            <Text className="text-xs text-gray-400 mt-0.5">{eq.code}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10">
                    <View className="p-4 border-b border-gray-100 flex-row items-center">
                        <Text className="text-xs font-bold text-gray-800 tracking-wider uppercase">Transfer History — Mixer</Text>
                    </View>
                    <View>
                        <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Equipment</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">From Project</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">To Project</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Transferred By</Text>
                            <Text className="flex-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Transferred Details</Text>
                        </View>
                        {TRANSFER_HISTORY.map((row, index) => (
                            <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <Text className="w-32 text-sm font-bold text-gray-800">{row.eq}</Text>
                                <Text className="w-32 text-sm text-gray-600">{row.from}</Text>
                                <Text className="w-32 text-sm font-bold text-blue-600">{row.to}</Text>
                                <Text className="w-32 text-sm text-gray-500">{row.by}</Text>
                                <Text className="flex-1 text-xs text-gray-500 leading-tight">{row.details}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );

    const renderMaintenance = () => (
        <View className="flex-1">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xs font-bold text-gray-800 tracking-widest uppercase">Maintenance & Servicing</Text>
                <TouchableOpacity className="flex-row items-center px-4 py-2 bg-orange-500 rounded-lg shadow-sm">
                    <Plus size={16} color="#ffffff" className="mr-2" />
                    <Text className="font-bold text-xs text-white">Schedule Maintenance</Text>
                </TouchableOpacity>
            </View>

            <View className="mb-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row pb-2">
                    {MAINTENANCE_CARDS.map(card => (
                        <View key={card.id} className={`p-3 rounded-lg border w-40 mr-3 ${card.status === 'OVERDUE' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                            <View className="flex-row justify-between items-start mb-2">
                                <Text className="text-sm font-bold text-gray-800">{card.id}</Text>
                                <Key size={14} color={card.status === 'OVERDUE' ? '#EF4444' : '#F59E0B'} />
                            </View>
                            <Text className="text-xs text-gray-600">Due: {card.due} [{card.days}]</Text>
                            <View className={`mt-2 px-2 py-0.5 rounded self-start ${card.status === 'OVERDUE' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                                <Text className={`text-[10px] font-bold ${card.status === 'OVERDUE' ? 'text-red-600' : 'text-yellow-600'}`}>{card.status}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View className="flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <View className="w-64 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10">
                    <View className="p-4 border-b border-gray-100">
                        <Text className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Select Equipment</Text>
                    </View>
                    {MAINTENANCE_EQUIPMENT.map((eq, index) => (
                        <TouchableOpacity key={eq.id} className="px-4 py-3 border-b border-gray-50">
                            <Text className="text-sm font-semibold text-gray-800">{eq.id}</Text>
                            <Text className="text-xs text-gray-400 mt-0.5">{eq.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10">
                    <View className="p-4 border-b border-gray-100 flex-row items-center">
                        <Text className="text-xs font-bold text-gray-800 tracking-wider uppercase">Maintenance Logs — Mixer</Text>
                    </View>
                    <View>
                        <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                            <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Project</Text>
                            <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Eq Item</Text>
                            <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Equipment</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Maintenance Date</Text>
                            <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Cost</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Next Maintenance Date</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Created / Completed</Text>
                            <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</Text>
                            <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</Text>
                        </View>
                        <View className="p-8 flex-1 items-center justify-center min-h-[200px]">
                            <Text className="text-sm text-gray-400">No maintenance records found</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderRental = () => (
        <View className="flex-1">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xs font-bold text-gray-800 tracking-widest uppercase">Rental & Cost Tracking</Text>
                <TouchableOpacity className="flex-row items-center px-4 py-2 bg-purple-500 rounded-lg shadow-sm">
                    <Plus size={16} color="#ffffff" className="mr-2" />
                    <Text className="font-bold text-xs text-white">Add Rental</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row justify-between mb-4 space-x-4">
                <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Rental Cost</Text>
                    <Text className="text-2xl font-bold text-purple-600 mb-1">₹11,644</Text>
                    <Text className="text-xs text-gray-400">All time</Text>
                </View>
                <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rental Count</Text>
                    <Text className="text-2xl font-bold text-blue-500 mb-1">15</Text>
                    <Text className="text-xs text-gray-400">Contracts executed</Text>
                </View>
                <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Days</Text>
                    <Text className="text-2xl font-bold text-green-500 mb-1">36</Text>
                    <Text className="text-xs text-gray-400">Days rented out</Text>
                </View>
                <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Avg /Day</Text>
                    <Text className="text-2xl font-bold text-orange-500 mb-1">₹323</Text>
                    <Text className="text-xs text-gray-400">Across fleet</Text>
                </View>
            </View>

            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
                <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                    <Text className="text-xs font-bold text-gray-800 tracking-wider uppercase">All Rental History</Text>
                    <View className="flex-row items-center space-x-2">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase">Select Equipment</Text>
                        <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-1.5 rounded border border-gray-200 w-40">
                            <Text className="text-xs text-gray-700">All Equipment</Text>
                            <ChevronDown size={14} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View>
                        <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                            <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Equipment</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Start Date</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">End Date</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Rental Cost</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Client Name</Text>
                            <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Notes</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</Text>
                        </View>
                        {RENTAL_HISTORY.map((row, index) => (
                            <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <Text className="w-24 text-sm font-semibold text-gray-800">{row.eq}</Text>
                                <Text className="w-32 text-sm text-gray-600">{row.start}</Text>
                                <Text className="w-32 text-sm text-gray-600">{row.end}</Text>
                                <Text className="w-32 text-sm font-bold text-purple-600">{row.cost}</Text>
                                <Text className="w-32 text-sm text-gray-800">{row.client}</Text>
                                <Text className="w-48 text-sm text-gray-500">{row.notes}</Text>
                                <View className="w-32">
                                    <View className={`px-2 py-0.5 rounded border self-start ${row.status === 'ACTIVE' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <Text className={`text-[10px] font-bold ${row.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}`}>{row.status}</Text>
                                    </View>
                                </View>
                                <View className="w-32 flex-row justify-end space-x-3">
                                    <ExternalLink size={14} color="#9CA3AF" />
                                    <Edit2 size={14} color="#9CA3AF" />
                                    <Trash2 size={14} color="#9CA3AF" />
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
                {renderPagination(15)}
            </View>
        </View>
    );

    const renderPurchase = () => (
        <View className="flex-1">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xs font-bold text-gray-800 tracking-widest uppercase">Equipment Purchase Tracker</Text>
                <TouchableOpacity className="flex-row items-center px-4 py-2 bg-green-500 rounded-lg shadow-sm">
                    <Plus size={16} color="#ffffff" className="mr-2" />
                    <Text className="font-bold text-xs text-white">Create Purchase</Text>
                </TouchableOpacity>
            </View>

            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 flex-1">
                <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                    <Text className="text-xs font-bold text-gray-800 tracking-wider uppercase">Purchase History</Text>
                    <View className="flex-row items-center space-x-2">
                        <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-1.5 rounded border border-gray-200 w-32">
                            <Text className="text-xs text-gray-700">All Types</Text>
                            <ChevronDown size={14} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-1.5 rounded border border-gray-200 w-32">
                            <Text className="text-xs text-gray-500">dd-mm-yyyy</Text>
                            <ChevronDown size={14} color="#6B7280" />
                        </TouchableOpacity>
                        <Text className="text-xs text-gray-400">to</Text>
                        <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-1.5 rounded border border-gray-200 w-32">
                            <Text className="text-xs text-gray-500">dd-mm-yyyy</Text>
                            <ChevronDown size={14} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity className="px-4 py-1.5 bg-blue-600 rounded">
                            <Text className="text-xs font-bold text-white">Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View>
                        <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Project</Text>
                            <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Eq Item</Text>
                            <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Type</Text>
                            <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Asset Name</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Purchase Date</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Vendor</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Invoice Number</Text>
                            <Text className="w-24 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Quantity</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Unit Price</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Total Amount</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Warranty End Date</Text>
                            <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Notes</Text>
                            <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Created At</Text>
                            <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Action</Text>
                        </View>
                        {PURCHASE_HISTORY.map((row, index) => (
                            <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <Text className="w-32 text-sm text-gray-600">{row.project}</Text>
                                <Text className="w-24 text-sm text-gray-500">{row.item}</Text>
                                <Text className="w-24 text-[10px] font-bold text-gray-800">{row.type}</Text>
                                <Text className="w-40 text-sm font-semibold text-gray-800">{row.name}</Text>
                                <Text className="w-32 text-sm text-gray-600">{row.date}</Text>
                                <Text className="w-32 text-sm text-gray-600">{row.vendor}</Text>
                                <Text className="w-32 text-sm text-gray-600">{row.inv}</Text>
                                <Text className="w-24 text-sm font-medium text-orange-500 text-center">{row.qty}</Text>
                                <Text className="w-32 text-sm font-medium text-gray-800 text-right">{row.price}</Text>
                                <Text className="w-32 text-sm font-bold text-gray-800 text-right">{row.total}</Text>
                                <Text className="w-32 text-sm text-gray-500 text-center">{row.warranty}</Text>
                                <Text className="w-40 text-xs text-gray-500">{row.notes}</Text>
                                <Text className="w-40 text-xs text-gray-500">{row.created}</Text>
                                <View className="w-32 flex-row justify-end space-x-3">
                                    <ExternalLink size={14} color="#9CA3AF" />
                                    <Edit2 size={14} color="#9CA3AF" />
                                    <Trash2 size={14} color="#9CA3AF" />
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
                {renderPagination(10)}
            </View>
        </View>
    );

    const renderReports = () => (
        <View className="flex-1">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xs font-bold text-gray-800 tracking-widest uppercase">Intelligence & Export</Text>
                <View className="flex-row space-x-3">
                    <TouchableOpacity className="flex-row items-center px-4 py-2 border border-red-200 bg-white rounded-lg shadow-sm">
                        <FileText size={16} color="#EF4444" className="mr-2" />
                        <Text className="font-bold text-xs text-gray-700">Export PDF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center px-4 py-2 border border-green-200 bg-white rounded-lg shadow-sm">
                        <FileSpreadsheet size={16} color="#10B981" className="mr-2" />
                        <Text className="font-bold text-xs text-gray-700">Export Excel</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 mb-6">
                <View className="p-4 border-b border-gray-100">
                    <Text className="text-xs font-bold text-gray-800 tracking-wider uppercase">Utilization Report</Text>
                </View>
                <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                    <Text className="w-64 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Equipment</Text>
                    <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Total Hrs</Text>
                    <Text className="flex-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Utilization Rate</Text>
                </View>
                {UTILIZATION_REPORT.map((row, index) => (
                    <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <Text className="w-64 text-sm font-semibold text-gray-800">{row.eq}</Text>
                        <Text className="w-48 text-sm text-gray-600 text-center">{row.hrs} hrs</Text>
                        <View className="flex-1 flex-row items-center space-x-3">
                            <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[200px]">
                                <View className="h-full bg-orange-400 rounded-full" style={{ width: `${row.rate}%` }} />
                            </View>
                            <Text className="text-xs text-gray-500">{row.rate}%</Text>
                        </View>
                    </View>
                ))}
                {renderPagination(36, false)}
            </View>

            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10">
                <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                    <Text className="text-xs font-bold text-gray-800 tracking-wider uppercase">Cost Report</Text>
                    <View className="flex-row items-center space-x-2">
                        <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-1.5 rounded border border-gray-200 w-32">
                            <Text className="text-xs text-gray-500">dd-mm-yyyy</Text>
                            <ChevronDown size={14} color="#6B7280" />
                        </TouchableOpacity>
                        <Text className="text-xs text-gray-400">to</Text>
                        <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-1.5 rounded border border-gray-200 w-32">
                            <Text className="text-xs text-gray-500">dd-mm-yyyy</Text>
                            <ChevronDown size={14} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity className="px-4 py-1.5 bg-blue-600 rounded">
                            <Text className="text-xs font-bold text-white">Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                    <Text className="flex-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Equipment</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Total Cost</Text>
                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Rentals</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Avg Cost</Text>
                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Total Days</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Rent/Day</Text>
                </View>
                {COST_REPORT.map((row, index) => (
                    <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <Text className="flex-1 text-sm font-semibold text-gray-800">{row.eq}</Text>
                        <Text className="w-40 text-sm font-bold text-green-600 text-right">{row.cost}</Text>
                        <Text className="w-32 text-sm text-gray-600 text-center">{row.rentals}</Text>
                        <Text className="w-40 text-sm font-medium text-gray-600 text-right">{row.avg}</Text>
                        <Text className="w-32 text-sm text-gray-600 text-center">{row.days}</Text>
                        <Text className="w-40 text-sm font-medium text-gray-600 text-right">{row.perDay}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderProjectReport = () => (
        <View className="flex-1">
            <View className="mb-4">
                <Text className="text-xs font-bold text-gray-800 tracking-widest uppercase">Project Specific Reports</Text>
            </View>

            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10 mb-6">
                <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                    <Text className="text-xs font-bold text-gray-800 tracking-wider uppercase">Purchase Report</Text>
                    <View className="flex-row items-center space-x-2">
                        <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-1.5 rounded border border-gray-200 w-32">
                            <Text className="text-xs text-gray-700">All Types</Text>
                            <ChevronDown size={14} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity className="px-4 py-1.5 bg-blue-600 rounded">
                            <Text className="text-xs font-bold text-white">Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                    <Text className="flex-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Equipment</Text>
                    <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Purchase Count</Text>
                    <Text className="w-40 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Quantity</Text>
                    <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Cost</Text>
                    <Text className="w-32 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Type</Text>
                </View>
                {PURCHASE_REPORT.map((row, index) => (
                    <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <Text className="flex-1 text-sm font-semibold text-gray-800">{row.eq}</Text>
                        <Text className="w-48 text-sm text-gray-600 text-center">{row.count}</Text>
                        <Text className="w-40 text-sm font-bold text-red-500 text-center">{row.qty}</Text>
                        <Text className="w-48 text-sm font-medium text-gray-800 text-right">{row.cost}</Text>
                        <Text className="w-32 text-[10px] font-bold text-gray-800 text-center">{row.type}</Text>
                    </View>
                ))}
                {renderPagination(8)}
            </View>

            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden z-10">
                <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                    <Text className="text-xs font-bold text-gray-800 tracking-wider uppercase">Availability Report</Text>
                    <View className="flex-row items-center space-x-2">
                        <TouchableOpacity className="flex-row items-center justify-between bg-white px-3 py-1.5 rounded border border-gray-200 w-32">
                            <Text className="text-xs text-gray-700">All</Text>
                            <ChevronDown size={14} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity className="px-4 py-1.5 bg-blue-600 rounded">
                            <Text className="text-xs font-bold text-white">Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="flex-row items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                    <Text className="flex-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Equipment</Text>
                    <Text className="w-48 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Status</Text>
                    <Text className="flex-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Project ID</Text>
                </View>
                {AVAILABILITY_REPORT.map((row, index) => (
                    <View key={row.id} className={`flex-row items-center px-6 py-4 border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <Text className="flex-1 text-sm font-semibold text-gray-800">{row.eq}</Text>
                        <View className="w-48 items-center">
                            <View className="px-2 py-0.5 rounded border border-red-200 bg-red-50">
                                <Text className="text-[10px] font-bold text-red-500">{row.status}</Text>
                            </View>
                        </View>
                        <Text className="flex-1 text-sm text-gray-600 text-right">{row.project}</Text>
                    </View>
                ))}
            </View>
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
        <View className="flex-1 bg-gray-50">
            <TopHeader 
                title="Machinery & Equipment" 
                subtitle="Engineer > Machinery > Dashboard" 
            />
            
            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                
                {/* Header Section */}
                <View className="mb-6 flex-col md:flex-row md:items-center justify-between">
                    <View className="mb-4 md:mb-0">
                        <Text className="text-xl font-bold text-gray-900">Machinery & Equipment</Text>
                        <Text className="text-sm text-gray-500 mt-1">Complete lifecycle tracking — allocation, usage, maintenance, cost</Text>
                    </View>
                    
                    <View className="flex-row items-center space-x-3">
                        <TouchableOpacity className="flex-row items-center justify-between px-3 py-1.5 border border-gray-200 rounded-lg bg-white w-48">
                            <View className="flex-row items-center">
                                <Text className="text-xs text-gray-500 mr-2">Active Project:</Text>
                                <Text className="text-xs font-bold text-gray-700">Sara City</Text>
                            </View>
                            <ChevronDown size={14} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tabs */}
                <View className="mb-6">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row items-center bg-white rounded-[24px] p-1 border border-gray-200">
                            {TABS.map((tab) => (
                                <TouchableOpacity 
                                    key={tab}
                                    onPress={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-[24px] ${activeTab === tab ? 'bg-gray-100 shadow-sm' : 'bg-transparent'}`}
                                >
                                    <Text className={`text-xs font-bold tracking-wider ${activeTab === tab ? 'text-gray-900' : 'text-gray-500'}`}>{tab}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Tab Content */}
                {renderContent()}

                {/* Padding at bottom for safe area */}
                <View className="h-12" />
            </ScrollView>
        </View>
    );
}
