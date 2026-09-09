import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from 'expo-router';
import { Menu, Search, Upload, Download, Plus, Eye, Edit2, Trash2, DownloadCloud, ChevronDown, FileText, Calendar } from 'lucide-react-native';

const TABS = ['Quotations', 'Invoices', 'RA Bills', 'Collections', 'Client Ledger'];

const QUOTATIONS_DATA = [
    { no: 'QT/2026/0008', client: 'Rahul Patil', company: 'Patil Construction...', mobile: '9370543210', site: 'Kupwad MIDC, Sang...', project: 'Residential Bung...', type: 'Residential', subtotal: '₹4,94,248', gst: '₹88,964', tds: '₹5,832', discount: '₹5,000', grandTotal: '₹5,72,378', advance: '₹1,00,000', balance: '₹4,72,378', payment: 'UPI', status: 'DRAFT', date: '2026-09-06', due: '2026-09-15' },
    { no: 'QT/2026/0007', client: 'J P Morgan', company: 'Patil Construction...', mobile: '9999999999', site: 'asdfas', project: 'Residential', type: 'Residential', subtotal: '₹30,000', gst: '₹5,400', tds: '₹354', discount: '₹0', grandTotal: '₹35,046', advance: '₹0', balance: '₹35,046', payment: 'UPI', status: 'APPROVED', date: '2026-09-06', due: '2026-09-08' }
];

const INVOICES_DATA = [
    { project: 'Metro City', type: 'labour', amount: '714', gstPercent: '0', gstAmount: '0', taxPercent: '0', taxAmount: '0', totalAmount: '714', paidAmount: '0', pendingAmount: '714', status: 'PENDING', desc: 'Labour Invoice (2026-01-01 to 2026-10-02)', created: '2026-09-07T12:27:10' }
];

const RA_BILLS_DATA = [
    { billNo: 'BILL-0003', contractor: '1', project: 'Metro City', date: '2026-09-01', gross: '₹100', net: '₹100', status: 'APPROVED' },
    { billNo: 'BILL-0002', contractor: '1', project: 'Metro City', date: '2026-09-01', gross: '₹100', net: '₹100', status: 'APPROVED' },
    { billNo: 'BILL-0001', contractor: '1', project: 'Metro City', date: '2026-09-01', gross: '₹100', net: '₹100', status: 'APPROVED' }
];

const COLLECTIONS_DATA = [
    { invoice: 'N/A', client: 'Client', amount: '₹100', receivedOn: '2026-09-01T10:32:54', mode: 'Cash', ref: '-', status: 'RECEIVED' },
    { invoice: 'N/A', client: 'Client', amount: '₹200', receivedOn: '2026-09-02T05:14:00', mode: 'Cash', ref: '-', status: 'RECEIVED' }
];

const SummaryCard = ({ title, value, subtitle, valueColor = 'text-blue-600', subtitleColor = 'text-gray-400', fullWidth = false }: any) => (
    <View className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-3 ${fullWidth ? 'flex-1 min-w-[200px]' : 'w-56'}`}>
        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</Text>
        <Text className={`text-xl font-bold ${valueColor}`}>{value}</Text>
        <Text className={`text-[10px] mt-1 ${subtitleColor}`}>{subtitle}</Text>
    </View>
);

const ActionButton = ({ title, icon: Icon, active, primary, onPress }: any) => (
    <TouchableOpacity onPress={onPress} className={`flex-row items-center px-4 py-2.5 rounded-lg border mr-2 mb-2 ${primary ? 'bg-blue-600 border-blue-600' : active ? 'bg-blue-50 border-blue-600' : 'bg-white border-gray-200'}`}>
        {Icon && <Icon size={14} color={primary ? '#fff' : active ? '#2563EB' : '#4B5563'} style={{ marginRight: 6 }} />}
        <Text className={`text-xs font-semibold ${primary ? 'text-white' : active ? 'text-blue-600' : 'text-gray-700'}`}>{title}</Text>
    </TouchableOpacity>
);

const FilterDropdown = ({ title }: any) => (
    <TouchableOpacity className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-lg mr-2 mb-2">
        <Text className="text-xs font-medium text-gray-700 mr-2">{title}</Text>
        <ChevronDown size={14} color="#6B7280" />
    </TouchableOpacity>
);

const PaginationFooter = ({ total, start, end }: any) => (
    <View className="flex-row flex-wrap items-center justify-between px-4 py-4 bg-white border-t border-gray-100 gap-y-3">
        <View className="flex-row items-center">
            <Text className="text-xs text-gray-500 mr-2">Records per page:</Text>
            <TouchableOpacity className="flex-row items-center bg-gray-50 border border-gray-200 px-2 py-1 rounded">
                <Text className="text-xs font-medium text-gray-700 mr-2">10</Text>
                <ChevronDown size={12} color="#6B7280" />
            </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-500">Showing {start} - {end} of {total} records</Text>
        <View className="flex-row items-center space-x-1">
            <TouchableOpacity className="p-1 rounded hover:bg-gray-50"><ChevronDown size={14} color="#9CA3AF" style={{ transform: [{ rotate: '90deg' }] }} /></TouchableOpacity>
            <TouchableOpacity className="w-6 h-6 items-center justify-center bg-blue-600 rounded"><Text className="text-xs font-bold text-white">1</Text></TouchableOpacity>
            <TouchableOpacity className="p-1 rounded hover:bg-gray-50"><ChevronDown size={14} color="#9CA3AF" style={{ transform: [{ rotate: '-90deg' }] }} /></TouchableOpacity>
        </View>
    </View>
);

export function ReceivablesScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Quotations');
    const [quotationSubTab, setQuotationSubTab] = useState('Quotation List');
    const [raBillSubTab, setRaBillSubTab] = useState('Approval Queue');
    const [invoiceSubTab, setInvoiceSubTab] = useState('Labour Invoice List');

const CreateQuotationForm = () => (
    <View className="mt-4">
        <View className="flex-row flex-wrap justify-between items-center mb-6 gap-y-3">
            <View>
                <Text className="text-xl font-bold text-gray-900">Quotation Details</Text>
                <Text className="text-xs text-gray-500">Create and customize professional invoices / estimates.</Text>
            </View>
            <View className="flex-row items-center space-x-2">
                <TouchableOpacity className="flex-row items-center px-4 py-2 bg-white border border-gray-200 rounded-lg mr-2">
                    <FileText size={14} color="#4B5563" />
                    <Text className="ml-2 text-xs font-semibold text-gray-700">Import from Estimate</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-6 py-2 bg-blue-600 rounded-lg">
                    <Text className="text-xs font-bold text-white">SAVE QUOTATION</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View className="flex-col lg:flex-row gap-4 mb-4">
            <View className="flex-1 flex-col gap-4">
                <View className="flex-row flex-wrap gap-4">
                    <View className="flex-1 min-w-[300px] bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <View className="flex-row items-center mb-4">
                            <Text className="text-xs font-bold text-gray-900 uppercase tracking-wide ml-2">Client Details</Text>
                        </View>
                        <View className="gap-y-3">
                            <View>
                                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Client Name *</Text>
                                <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="Type or select a Client..." />
                            </View>
                            <View className="flex-row gap-x-3">
                                <View className="flex-1">
                                    <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Mobile Number</Text>
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Email Address</Text>
                                    <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="client@example.com" />
                                </View>
                            </View>
                            <View>
                                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Company Name</Text>
                                <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="e.g. Patil Construction Pvt Ltd" />
                            </View>
                            <View>
                                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Billing Address</Text>
                                <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="" />
                            </View>
                            <View>
                                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">GST Number (Optional)</Text>
                                <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="" />
                            </View>
                        </View>
                    </View>

                    <View className="flex-1 min-w-[300px] bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <View className="flex-row items-center mb-4">
                            <Text className="text-xs font-bold text-gray-900 uppercase tracking-wide ml-2">Project Details</Text>
                        </View>
                        <View className="gap-y-3">
                            <View>
                                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Project Name</Text>
                                <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="Select Project..." />
                            </View>
                            <View>
                                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Project Type</Text>
                                <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="e.g. Residential, Infrastructure" />
                            </View>
                            <View>
                                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Engineer In-Charge</Text>
                                <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="e.g. Er. Tejas Dhande" />
                            </View>
                            <View>
                                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Site Address</Text>
                                <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="" />
                            </View>
                            <View>
                                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Work Order No.</Text>
                                <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="" />
                            </View>
                        </View>
                    </View>

                    <View className="flex-1 min-w-[250px] bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <View className="flex-row items-center mb-4">
                            <Text className="text-xs font-bold text-gray-900 uppercase tracking-wide ml-2">Quotation Details</Text>
                        </View>
                        <View className="gap-y-3">
                            <View>
                                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Quotation Date</Text>
                                <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="09-09-2026" />
                            </View>
                            <View>
                                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Due Date</Text>
                                <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="dd-mm-yyyy" />
                            </View>
                        </View>
                    </View>
                </View>

                <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full">
                    <View className="px-4 py-3 flex-row items-center justify-between border-b border-gray-100">
                        <View className="flex-row items-center">
                            <Text className="text-xs font-bold text-gray-900 uppercase tracking-wide ml-2">Items / Measurements</Text>
                        </View>
                        <TouchableOpacity className="flex-row items-center">
                            <Plus size={12} color="#2563EB" />
                            <Text className="ml-1 text-xs font-semibold text-blue-600">Add New Item</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <View className="min-w-full">
                            <View className="flex-row items-center px-4 py-2 bg-blue-600">
                                {['#', 'ITEM / WORK DESCRIPTION', 'UNIT', 'QUANTITY', 'RATE (₹)', 'AMOUNT (₹)', 'ACTION'].map((col, i) => (
                                    <Text key={i} className={`text-[9px] font-bold text-white uppercase tracking-wider mr-2 ${col === 'ITEM / WORK DESCRIPTION' ? 'w-48' : 'w-24'}`}>{col}</Text>
                                ))}
                            </View>
                            <View className="flex-row items-center px-4 py-3 border-b border-gray-50 bg-white">
                                <Text className="w-24 mr-2 text-xs text-gray-700">1</Text>
                                <Text className="w-48 mr-2 text-xs text-gray-700">Soling</Text>
                                <Text className="w-24 mr-2 text-xs text-gray-700">Brass</Text>
                                <Text className="w-24 mr-2 text-xs text-gray-700">0</Text>
                                <Text className="w-24 mr-2 text-xs text-gray-700">0</Text>
                                <Text className="w-24 mr-2 text-xs font-semibold text-blue-600">₹0.00</Text>
                                <View className="w-24 mr-2 flex-row items-center space-x-2">
                                    <TouchableOpacity className="p-1"><Edit2 size={13} color="#9CA3AF" /></TouchableOpacity>
                                    <TouchableOpacity className="p-1"><Trash2 size={13} color="#9CA3AF" /></TouchableOpacity>
                                </View>
                            </View>
                            <View className="flex-row items-center px-4 py-3 bg-white">
                                <Text className="w-24 mr-2 text-xs text-gray-700">2</Text>
                                <Text className="w-48 mr-2 text-xs text-gray-700">Plum Concrete</Text>
                                <Text className="w-24 mr-2 text-xs text-gray-700"></Text>
                                <Text className="w-24 mr-2 text-xs text-gray-700"></Text>
                                <Text className="w-24 mr-2 text-xs text-gray-700"></Text>
                                <Text className="w-24 mr-2 text-xs font-semibold text-blue-600"></Text>
                                <View className="w-24 mr-2 flex-row items-center space-x-2"></View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>

            <View className="w-full lg:w-80 gap-y-4">
                <View className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <View className="flex-row items-center mb-4">
                        <Text className="text-xs font-bold text-gray-900 uppercase tracking-wide ml-2">Invoice Summary</Text>
                    </View>
                    <View className="gap-y-3">
                        <View className="flex-row justify-between items-center"><Text className="text-xs text-gray-600">Sub Total</Text><Text className="text-xs font-semibold text-gray-900">₹ 0.00</Text></View>
                        <View className="flex-row justify-between items-center"><Text className="text-xs text-gray-600">CGST 9%</Text><Text className="text-xs font-semibold text-gray-900">₹ 0.00</Text></View>
                        <View className="flex-row justify-between items-center"><Text className="text-xs text-gray-600">SGST 9%</Text><Text className="text-xs font-semibold text-gray-900">₹ 0.00</Text></View>
                        <View className="flex-row justify-between items-center"><Text className="text-xs text-gray-600">Discount</Text><Text className="text-xs font-semibold text-red-500">- ₹ 0.00</Text></View>
                        <View className="flex-row justify-between items-center"><Text className="text-xs text-gray-600">TDS 1%</Text><Text className="text-xs font-semibold text-red-500">- ₹ 0.00</Text></View>
                        <View className="h-px bg-gray-100 my-1" />
                        <View className="flex-row justify-between items-center"><Text className="text-xs font-bold text-gray-900">GRAND TOTAL</Text><Text className="text-sm font-bold text-blue-600">₹ 0.00</Text></View>
                        <View className="flex-row justify-between items-center"><Text className="text-xs text-gray-600">Advance PAID</Text><Text className="text-xs font-semibold text-gray-900">0</Text></View>
                        <View className="flex-row justify-between items-center bg-emerald-50 p-2 rounded"><Text className="text-xs font-bold text-emerald-700">BALANCE DUE</Text><Text className="text-sm font-bold text-emerald-700">₹ 0.00</Text></View>
                    </View>
                </View>
                
                <TouchableOpacity className="w-full py-3 bg-blue-600 rounded-lg items-center">
                    <View className="flex-row items-center"><Eye size={14} color="#fff" /><Text className="ml-2 text-xs font-bold text-white">PREVIEW QUOTATION</Text></View>
                </TouchableOpacity>
                <TouchableOpacity className="w-full py-3 bg-emerald-500 rounded-lg items-center">
                    <View className="flex-row items-center"><Download size={14} color="#fff" /><Text className="ml-2 text-xs font-bold text-white">SAVE QUOTATION</Text></View>
                </TouchableOpacity>
                <TouchableOpacity className="w-full py-3 bg-white border border-gray-200 rounded-lg items-center">
                    <View className="flex-row items-center"><Download size={14} color="#6B7280" /><Text className="ml-2 text-xs font-semibold text-gray-700">DOWNLOAD PDF</Text></View>
                </TouchableOpacity>
                <TouchableOpacity className="w-full py-3 bg-white border border-gray-200 rounded-lg items-center">
                    <Text className="text-xs font-semibold text-gray-700">SEND ON WHATSAPP</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

    const renderQuotations = () => (
        <View className="mt-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <View className="flex-row pr-4 pb-2">
                    <SummaryCard title="TOTAL PIPELINE VALUE" value="₹6,07,422" subtitle="2 Active Quotations" />
                    <SummaryCard title="WIN / APPROVAL RATE" value="50%" valueColor="text-emerald-500" subtitle="Based on all time" />
                    <SummaryCard title="PENDING DRAFTS" value="1" valueColor="text-orange-500" subtitle="Requires admin review" />
                    <SummaryCard title="SENT QUOTATIONS" value="0" valueColor="text-blue-600" subtitle="Awaiting client response" />
                </View>
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <View className="flex-row items-center pr-4">
                    <ActionButton title="Create Quotation" active={quotationSubTab === 'Create Quotation'} onPress={() => setQuotationSubTab('Create Quotation')} primary={quotationSubTab === 'Create Quotation'} />
                    <ActionButton title="Quotation List" active={quotationSubTab === 'Quotation List'} onPress={() => setQuotationSubTab('Quotation List')} primary={quotationSubTab === 'Quotation List'} />
                    <ActionButton title="Invoice List" active={quotationSubTab === 'Invoice List'} onPress={() => setQuotationSubTab('Invoice List')} primary={quotationSubTab === 'Invoice List'} />
                    
                    {quotationSubTab === 'Quotation List' && (
                        <>
                            <View className="w-px h-6 bg-gray-200 mx-2 mb-2" />
                            <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2 w-32 mr-2 mb-2">
                                <Search size={13} color="#9CA3AF" />
                                <TextInput placeholder="Search..." className="ml-1.5 text-xs text-gray-700 flex-1" placeholderTextColor="#9CA3AF" />
                            </View>
                            <FilterDropdown title="ALL STATUS" />
                            <FilterDropdown title="All Projects" />
                            <ActionButton title="Import" icon={Upload} />
                            <ActionButton title="Export" icon={Download} />
                        </>
                    )}
                </View>
            </ScrollView>

            {quotationSubTab === 'Create Quotation' ? (
                <CreateQuotationForm />
            ) : (
                <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <View>
                            <View className="flex-row items-center px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                                {['QUOTATION NO', 'CLIENT NAME', 'COMPANY NAME', 'MOBILE NUMBER', 'SITE ADDRESS', 'PROJECT NAME', 'PROJECT TYPE', 'SUBTOTAL', 'GST AMT', 'TDS AMT', 'DISCOUNT', 'GRAND TOTAL', 'ADVANCE PAID', 'BALANCE DUE', 'PAYMENT MODE', 'STATUS', 'CREATED AT', 'DUE DATE', 'ACTIONS'].map((col, i) => (
                                    <Text key={i} className="text-[9px] font-bold text-gray-400 uppercase tracking-wider w-28 mr-2">{col}</Text>
                                ))}
                            </View>
                            {QUOTATIONS_DATA.map((row, i) => (
                                <View key={i} className="flex-row items-center px-4 py-3.5 border-b border-gray-50 bg-white">
                                    <Text className="w-28 mr-2 text-xs text-blue-600 font-medium">{row.no}</Text>
                                    <Text className="w-28 mr-2 text-xs text-gray-700">{row.client}</Text>
                                    <Text className="w-28 mr-2 text-xs text-gray-700" numberOfLines={1}>{row.company}</Text>
                                    <Text className="w-28 mr-2 text-xs text-gray-700">{row.mobile}</Text>
                                    <Text className="w-28 mr-2 text-xs text-gray-700" numberOfLines={1}>{row.site}</Text>
                                    <Text className="w-28 mr-2 text-xs text-gray-700" numberOfLines={1}>{row.project}</Text>
                                    <Text className="w-28 mr-2 text-xs text-gray-700">{row.type}</Text>
                                    <Text className="w-28 mr-2 text-xs text-gray-700">{row.subtotal}</Text>
                                    <Text className="w-28 mr-2 text-xs text-gray-700">{row.gst}</Text>
                                    <Text className="w-28 mr-2 text-xs text-gray-700">{row.tds}</Text>
                                    <Text className="w-28 mr-2 text-xs text-gray-700">{row.discount}</Text>
                                    <Text className="w-28 mr-2 text-xs font-semibold text-gray-900">{row.grandTotal}</Text>
                                    <Text className="w-28 mr-2 text-xs font-medium text-emerald-600">{row.advance}</Text>
                                    <Text className="w-28 mr-2 text-xs font-semibold text-red-500">{row.balance}</Text>
                                    <Text className="w-28 mr-2 text-xs text-gray-500">{row.payment}</Text>
                                    <View className="w-28 mr-2">
                                        <View className={`px-2 py-1 rounded self-start ${row.status === 'APPROVED' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                                            <Text className={`text-[9px] font-bold ${row.status === 'APPROVED' ? 'text-emerald-700' : 'text-gray-600'}`}>{row.status}</Text>
                                        </View>
                                    </View>
                                    <Text className="w-28 mr-2 text-xs text-gray-500">{row.date}</Text>
                                    <Text className="w-28 mr-2 text-xs text-gray-500">{row.due}</Text>
                                    <View className="w-28 flex-row items-center space-x-2">
                                        <TouchableOpacity className="p-1"><Eye size={13} color="#9CA3AF" /></TouchableOpacity>
                                        <TouchableOpacity className="p-1"><Edit2 size={13} color="#F59E0B" /></TouchableOpacity>
                                        <TouchableOpacity className="p-1"><DownloadCloud size={13} color="#6B7280" /></TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                    <PaginationFooter total={QUOTATIONS_DATA.length} start={1} end={QUOTATIONS_DATA.length} />
                </View>
            )}
        </View>
    );

    const CreateLabourInvoiceForm = () => (
        <View className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm w-full lg:w-1/2 mt-4 self-center lg:self-start">
            <Text className="text-sm font-bold text-gray-900 mb-6">Create Labour Invoice</Text>
            <View className="mb-4">
                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-2">SELECT PROJECT</Text>
                <View className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex-row justify-between items-center">
                    <Text className="text-xs text-gray-500">-- Choose Project --</Text>
                    <ChevronDown size={14} color="#6B7280" />
                </View>
            </View>
            <View className="flex-row gap-4 mb-8">
                <View className="flex-1">
                    <Text className="text-[10px] font-bold text-gray-500 uppercase mb-2">START DATE</Text>
                    <View className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex-row justify-between items-center">
                        <Text className="text-xs text-gray-500">dd-mm-yyyy</Text>
                        <Calendar size={13} color="#6B7280" />
                    </View>
                </View>
                <View className="flex-1">
                    <Text className="text-[10px] font-bold text-gray-500 uppercase mb-2">END DATE</Text>
                    <View className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex-row justify-between items-center">
                        <Text className="text-xs text-gray-500">dd-mm-yyyy</Text>
                        <Calendar size={13} color="#6B7280" />
                    </View>
                </View>
            </View>
            <View className="flex-row justify-end gap-3 mt-4">
                <TouchableOpacity className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg" onPress={() => setInvoiceSubTab('Labour Invoice List')}>
                    <Text className="text-xs font-semibold text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-6 py-2.5 bg-blue-600 rounded-lg">
                    <Text className="text-xs font-bold text-white">Create Invoice</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const CreateMaterialInvoiceForm = () => (
        <View className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm w-full lg:w-1/2 mt-4 self-center lg:self-start">
            <Text className="text-sm font-bold text-gray-900 mb-6">Create Material Invoice</Text>
            <View className="mb-8">
                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-2">SELECT PROJECT</Text>
                <View className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex-row justify-between items-center">
                    <Text className="text-xs text-gray-500">-- Choose Project --</Text>
                    <ChevronDown size={14} color="#6B7280" />
                </View>
            </View>
            <View className="flex-row justify-end gap-3 mt-4">
                <TouchableOpacity className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg" onPress={() => setInvoiceSubTab('Material Invoice List')}>
                    <Text className="text-xs font-semibold text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-6 py-2.5 bg-blue-600 rounded-lg">
                    <Text className="text-xs font-bold text-white">Create Invoice</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const CreateMeasurementInvoiceForm = () => (
        <View className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm w-full lg:w-1/2 mt-4 self-center lg:self-start">
            <Text className="text-sm font-bold text-gray-900 mb-6">Create Measurement Invoice</Text>
            <View className="mb-4">
                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-2">SELECT PROJECT</Text>
                <View className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex-row justify-between items-center">
                    <Text className="text-xs text-gray-500">-- Choose Project --</Text>
                    <ChevronDown size={14} color="#6B7280" />
                </View>
            </View>
            <View className="mb-8 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <Text className="text-[10px] font-bold text-gray-500 uppercase mb-2">SELECT MEASUREMENT</Text>
                <View className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex-row justify-between items-center mb-3">
                    <Text className="text-xs text-gray-400">-- Choose Measurement --</Text>
                    <ChevronDown size={14} color="#9CA3AF" />
                </View>
                <Text className="text-[10px] font-bold text-orange-500 mb-1">Please select a project first to view its measurements.</Text>
                <Text className="text-[10px] text-blue-600">Invoice will be generated using the approved quantities and rates from this measurement record.</Text>
            </View>
            <View className="flex-row justify-end gap-3 mt-4">
                <TouchableOpacity className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg" onPress={() => setInvoiceSubTab('Labour Invoice List')}>
                    <Text className="text-xs font-semibold text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-6 py-2.5 bg-blue-600 rounded-lg">
                    <Text className="text-xs font-bold text-white">Create Invoice</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderInvoices = () => (
        <View className="mt-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <View className="flex-row pr-4 pb-2 w-full">
                    <SummaryCard title="PORTFOLIO VALUE" value="₹714" subtitle="1 records" fullWidth />
                    <SummaryCard title="PENDING" value="₹714" valueColor="text-orange-500" subtitle="Requires action" fullWidth />
                    <SummaryCard title="PAID" value="₹0" valueColor="text-emerald-500" subtitle="Completed" fullWidth />
                </View>
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <View className="flex-row items-center pr-4">
                    <ActionButton title="Create Labour Invoice" active={invoiceSubTab === 'Create Labour Invoice'} onPress={() => setInvoiceSubTab('Create Labour Invoice')} primary={invoiceSubTab === 'Create Labour Invoice'} />
                    <ActionButton title="Labour Invoice List" active={invoiceSubTab === 'Labour Invoice List'} onPress={() => setInvoiceSubTab('Labour Invoice List')} primary={invoiceSubTab === 'Labour Invoice List'} />
                    <ActionButton title="Create Material Invoice" active={invoiceSubTab === 'Create Material Invoice'} onPress={() => setInvoiceSubTab('Create Material Invoice')} primary={invoiceSubTab === 'Create Material Invoice'} />
                    <ActionButton title="Material Invoice List" active={invoiceSubTab === 'Material Invoice List'} onPress={() => setInvoiceSubTab('Material Invoice List')} primary={invoiceSubTab === 'Material Invoice List'} />
                    <ActionButton title="Create from Measurement" active={invoiceSubTab === 'Create from Measurement'} onPress={() => setInvoiceSubTab('Create from Measurement')} primary={invoiceSubTab === 'Create from Measurement'} />
                    
                    {invoiceSubTab.includes('List') && (
                        <>
                            <View className="w-px h-6 bg-gray-200 mx-2 mb-2" />
                            <FilterDropdown title={invoiceSubTab.includes('Labour') ? "LABOUR" : "MATERIAL"} />
                            <FilterDropdown title="All Projects" />
                            <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2 w-32 mr-2 mb-2">
                                <Search size={13} color="#9CA3AF" />
                                <TextInput placeholder="Search..." className="ml-1.5 text-xs text-gray-700 flex-1" placeholderTextColor="#9CA3AF" />
                            </View>
                            <FilterDropdown title="ALL STATUS" />
                        </>
                    )}
                </View>
            </ScrollView>

            {invoiceSubTab === 'Create Labour Invoice' ? <CreateLabourInvoiceForm /> :
             invoiceSubTab === 'Create Material Invoice' ? <CreateMaterialInvoiceForm /> :
             invoiceSubTab === 'Create from Measurement' ? <CreateMeasurementInvoiceForm /> : (
            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View>
                        <View className="flex-row items-center px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                            {['PROJECT_NAME', 'TYPE', 'AMOUNT', 'GST_PERCENT', 'GST_AMOUNT', 'TAX_PERCENT', 'TAX_AMOUNT', 'TOTAL_AMOUNT', 'PAID_AMOUNT', 'PENDING_AMOUNT', 'STATUS', 'DESCRIPTION', 'CREATED_AT', 'ACTIONS'].map((col, i) => (
                                <Text key={i} className="text-[9px] font-bold text-gray-400 uppercase tracking-wider w-24 mr-2">{col}</Text>
                            ))}
                        </View>
                        {INVOICES_DATA.map((row, i) => (
                            <View key={i} className="flex-row items-center px-4 py-3.5 border-b border-gray-50 bg-white">
                                <Text className="w-24 mr-2 text-xs text-gray-800">{row.project}</Text>
                                <Text className="w-24 mr-2 text-xs text-gray-600">{row.type}</Text>
                                <Text className="w-24 mr-2 text-xs text-gray-600">{row.amount}</Text>
                                <Text className="w-24 mr-2 text-xs text-gray-600">{row.gstPercent}</Text>
                                <Text className="w-24 mr-2 text-xs text-gray-600">{row.gstAmount}</Text>
                                <Text className="w-24 mr-2 text-xs text-gray-600">{row.taxPercent}</Text>
                                <Text className="w-24 mr-2 text-xs text-gray-600">{row.taxAmount}</Text>
                                <Text className="w-24 mr-2 text-xs font-semibold text-gray-800">{row.totalAmount}</Text>
                                <Text className="w-24 mr-2 text-xs text-emerald-600">{row.paidAmount}</Text>
                                <Text className="w-24 mr-2 text-xs font-semibold text-red-500">{row.pendingAmount}</Text>
                                <View className="w-24 mr-2">
                                    <View className="px-2 py-1 rounded self-start bg-gray-100">
                                        <Text className="text-[9px] font-bold text-gray-600">{row.status}</Text>
                                    </View>
                                </View>
                                <Text className="w-24 mr-2 text-xs text-gray-500" numberOfLines={1}>{row.desc}</Text>
                                <Text className="w-24 mr-2 text-xs text-gray-500">{row.created}</Text>
                                <View className="w-24 flex-row items-center space-x-2">
                                    <TouchableOpacity className="p-1"><Eye size={13} color="#9CA3AF" /></TouchableOpacity>
                                    <TouchableOpacity className="p-1"><DownloadCloud size={13} color="#6B7280" /></TouchableOpacity>
                                    <TouchableOpacity className="p-1"><Edit2 size={13} color="#9CA3AF" /></TouchableOpacity>
                                    <TouchableOpacity className="p-1"><Trash2 size={13} color="#9CA3AF" /></TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
                <PaginationFooter total={INVOICES_DATA.length} start={1} end={INVOICES_DATA.length} />
            </View>
            )}
        </View>
    );

const Stepper = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
        <View className="flex-row items-center justify-center space-x-4 min-w-full px-2">
            <View className="flex-row items-center"><View className="w-6 h-6 rounded-full bg-blue-600 items-center justify-center"><Text className="text-white text-xs font-bold">1</Text></View><Text className="ml-2 text-xs font-bold text-blue-600">Draft</Text></View>
            <View className="w-8 h-px bg-gray-300" />
            <View className="flex-row items-center"><View className="w-6 h-6 rounded-full bg-gray-200 border border-gray-300 items-center justify-center"><Text className="text-gray-500 text-xs font-bold">2</Text></View><Text className="ml-2 text-xs font-bold text-gray-500">Submitted</Text></View>
            <View className="w-8 h-px bg-gray-300" />
            <View className="flex-row items-center"><View className="w-6 h-6 rounded-full bg-gray-200 border border-gray-300 items-center justify-center"><Text className="text-gray-500 text-xs font-bold">3</Text></View><Text className="ml-2 text-xs font-bold text-gray-500">Approved</Text></View>
            <View className="w-8 h-px bg-gray-300" />
            <View className="flex-row items-center"><View className="w-6 h-6 rounded-full bg-gray-200 border border-gray-300 items-center justify-center"><Text className="text-gray-500 text-xs font-bold">4</Text></View><Text className="ml-2 text-xs font-bold text-gray-500">Paid</Text></View>
        </View>
    </ScrollView>
);

const CreateRABillForm = () => (
    <View className="mt-4">
        <Stepper />
        <View className="flex-col lg:flex-row gap-4 mb-4">
            <View className="flex-1 flex-col gap-4">
                <View className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <View className="flex-row items-center mb-4 border-b border-gray-100 pb-2">
                        <Text className="text-xs font-bold text-gray-900 uppercase tracking-wide ml-2">Project Details</Text>
                    </View>
                    <View className="flex-row flex-wrap gap-4">
                        <View className="flex-1 min-w-[200px]">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">RA Bill Number</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="BILL-0004" />
                        </View>
                        <View className="flex-1 min-w-[200px]">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Project</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="Select Project..." />
                        </View>
                        <View className="flex-1 min-w-[200px]">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Contractor</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="Select Contractor..." />
                        </View>
                        <View className="flex-1 min-w-[200px]">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Measurement</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="Select Measurement..." />
                        </View>
                        <View className="flex-1 min-w-[200px]">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Work Order</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="Select Work Order..." />
                        </View>
                        <View className="flex-1 min-w-[200px]">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Bill Date</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="09-09-2026" />
                        </View>
                    </View>
                </View>

                <View className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <View className="flex-row items-center justify-between mb-4 border-b border-gray-100 pb-2">
                        <Text className="text-xs font-bold text-gray-900 uppercase tracking-wide ml-2">Work Details</Text>
                        <TouchableOpacity className="flex-row items-center"><Plus size={12} color="#2563EB" /><Text className="ml-1 text-xs font-semibold text-blue-600">Add Item</Text></TouchableOpacity>
                    </View>
                    <View className="flex-row flex-wrap gap-4">
                        <View className="w-full lg:flex-1 min-w-[200px]">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Work Description</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="Type..." />
                        </View>
                        <View className="w-24">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Quantity</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="0" />
                        </View>
                        <View className="w-24">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Rate (₹)</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="0" />
                        </View>
                        <View className="w-24">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">GST (%)</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="0" />
                        </View>
                        <View className="w-24">
                            <Text className="text-[10px] font-bold text-gray-500 uppercase mb-1">Deductions (₹)</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="0" />
                        </View>
                    </View>
                </View>
            </View>

            <View className="w-full lg:w-80 gap-y-4">
                <View className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <View className="flex-row items-center mb-4 border-b border-gray-100 pb-2">
                        <Text className="text-xs font-bold text-gray-900 uppercase tracking-wide ml-2">Bill Summary</Text>
                    </View>
                    <View className="gap-y-3">
                        <View className="flex-row justify-between items-center"><Text className="text-xs text-gray-600">Qty × Rate</Text><Text className="text-xs font-semibold text-gray-900">₹ 0.00</Text></View>
                        <View className="flex-row justify-between items-center"><Text className="text-xs text-gray-600">Gross Amount</Text><Text className="text-xs font-semibold text-gray-900">₹ 0.00</Text></View>
                        <View className="flex-row justify-between items-center"><Text className="text-xs text-gray-600">GST (0%)</Text><Text className="text-xs font-semibold text-gray-900">₹ 0.00</Text></View>
                        <View className="flex-row justify-between items-center"><Text className="text-xs text-gray-600">Total (Gross + GST)</Text><Text className="text-xs font-semibold text-blue-600">₹ 0.00</Text></View>
                        <View className="flex-row justify-between items-center"><Text className="text-xs text-gray-600">Deductions</Text><Text className="text-xs font-semibold text-red-500">- ₹ 0.00</Text></View>
                        <View className="h-px bg-gray-100 my-1" />
                        <View className="flex-row justify-between items-center bg-emerald-50 p-2 rounded"><Text className="text-xs font-bold text-emerald-700">NET PAYABLE</Text><Text className="text-sm font-bold text-emerald-700">₹ 0.00</Text></View>
                    </View>
                </View>
                
                <TouchableOpacity className="w-full py-3 bg-blue-600 rounded-lg items-center shadow-sm">
                    <Text className="text-xs font-bold text-white">CREATE RA BILL</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-full py-3 bg-white border border-gray-200 rounded-lg items-center">
                    <Text className="text-xs font-semibold text-gray-700">CANCEL</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

    const renderRABills = () => (
        <View className="mt-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <View className="flex-row items-center pr-4">
                    <ActionButton title="Create RA Bill" active={raBillSubTab === 'Create RA Bill'} onPress={() => setRaBillSubTab('Create RA Bill')} primary={raBillSubTab === 'Create RA Bill'} />
                    <ActionButton title="RA Bills" active={raBillSubTab === 'RA Bills'} onPress={() => setRaBillSubTab('RA Bills')} primary={raBillSubTab === 'RA Bills'} />
                    <ActionButton title="Approval Queue" active={raBillSubTab === 'Approval Queue'} onPress={() => setRaBillSubTab('Approval Queue')} primary={raBillSubTab === 'Approval Queue'} />
                    <ActionButton title="Payment Queue" active={raBillSubTab === 'Payment Queue'} onPress={() => setRaBillSubTab('Payment Queue')} primary={raBillSubTab === 'Payment Queue'} />
                    
                    {raBillSubTab !== 'Create RA Bill' && (
                        <>
                            <View className="w-px h-6 bg-gray-200 mx-2 mb-2" />
                            <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2 w-32 mr-2 mb-2">
                                <Search size={13} color="#9CA3AF" />
                                <TextInput placeholder="Search..." className="ml-1.5 text-xs text-gray-700 flex-1" placeholderTextColor="#9CA3AF" />
                            </View>
                            <FilterDropdown title="All Projects" />
                            <FilterDropdown title="All Contractor" />
                            <FilterDropdown title="All Status" />
                            <FilterDropdown title="dd-mm-yyyy" />
                            <FilterDropdown title="dd-mm-yyyy" />
                        </>
                    )}
                </View>
            </ScrollView>

            {raBillSubTab === 'Create RA Bill' ? (
                <CreateRABillForm />
            ) : (
                <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                    <View className="px-4 py-4 border-b border-gray-100">
                        <Text className="text-sm font-bold text-gray-900">{raBillSubTab}</Text>
                        <Text className="text-xs text-gray-500">
                            {raBillSubTab === 'RA Bills' ? 'Progress billing based on site measurements' : 
                             raBillSubTab === 'Approval Queue' ? 'Bills waiting for your approval' : 'Approved bills pending for payment'}
                        </Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <View>
                            <View className="flex-row items-center px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                                {['BILL NO', 'CONTRACTOR', 'PROJECT', 'BILL DATE', 'GROSS AMOUNT', 'NET AMOUNT', 'STATUS', 'ACTIONS'].map((col, i) => (
                                    <Text key={i} className="text-[9px] font-bold text-gray-400 uppercase tracking-wider w-32 mr-2">{col}</Text>
                                ))}
                            </View>
                            {raBillSubTab === 'Approval Queue' ? (
                                <View className="py-10 items-center justify-center">
                                    <Text className="text-sm text-gray-500">No RA bills found.</Text>
                                </View>
                            ) : (
                                RA_BILLS_DATA.map((row, i) => (
                                    <View key={i} className="flex-row items-center px-4 py-3.5 border-b border-gray-50 bg-white">
                                        <Text className="w-32 mr-2 text-xs text-blue-600 font-medium">{row.billNo}</Text>
                                        <Text className="w-32 mr-2 text-xs text-gray-700">{row.contractor}</Text>
                                        <Text className="w-32 mr-2 text-xs text-gray-700">{row.project}</Text>
                                        <Text className="w-32 mr-2 text-xs text-gray-700">{row.date}</Text>
                                        <Text className="w-32 mr-2 text-xs font-semibold text-gray-800">{row.gross}</Text>
                                        <Text className="w-32 mr-2 text-xs font-semibold text-gray-800">{row.net}</Text>
                                        <View className="w-32 mr-2">
                                            <View className="px-2 py-1 rounded self-start bg-emerald-100">
                                                <Text className="text-[9px] font-bold text-emerald-700">{row.status}</Text>
                                            </View>
                                        </View>
                                        <View className="w-32 flex-row items-center space-x-2">
                                            <TouchableOpacity className="p-1"><Eye size={13} color="#9CA3AF" /></TouchableOpacity>
                                            <TouchableOpacity className="p-1"><Edit2 size={13} color="#9CA3AF" /></TouchableOpacity>
                                            <TouchableOpacity className="p-1"><Trash2 size={13} color="#9CA3AF" /></TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    </ScrollView>
                    <PaginationFooter total={raBillSubTab === 'Approval Queue' ? 0 : RA_BILLS_DATA.length} start={raBillSubTab === 'Approval Queue' ? 0 : 1} end={raBillSubTab === 'Approval Queue' ? 0 : RA_BILLS_DATA.length} />
                </View>
            )}
        </View>
    );

    const renderCollections = () => (
        <View className="mt-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <View className="flex-row pr-4 pb-2">
                    <SummaryCard title="PORTFOLIO VALUE" value="₹1,29,59,800.73" />
                    <SummaryCard title="TOTAL BILLED" value="₹1,29,59,800.73" valueColor="text-gray-900" />
                    <SummaryCard title="TOTAL RECEIVED" value="₹0.00" valueColor="text-emerald-500" />
                    <SummaryCard title="PENDING AMOUNT" value="₹1,29,59,800.73" valueColor="text-orange-500" />
                    <SummaryCard title="OVERDUE AMOUNT" value="₹0.00" valueColor="text-red-500" />
                </View>
            </ScrollView>

            <View className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
                <Text className="text-sm font-bold text-gray-900 mb-1">Receivable Aging Summary</Text>
                <Text className="text-xs text-gray-500 mb-4">Aging analysis of overdue receivables</Text>
                <View className="flex-row flex-wrap gap-3">
                    <View className="flex-1 min-w-[100px] bg-gray-50 p-3 rounded-lg items-center border border-gray-100">
                        <Text className="text-[10px] font-bold text-gray-500 mb-1">0-30</Text>
                        <Text className="text-lg font-bold text-red-500">₹1,29,59,501</Text>
                    </View>
                    <View className="flex-1 min-w-[100px] bg-gray-50 p-3 rounded-lg items-center border border-gray-100">
                        <Text className="text-[10px] font-bold text-gray-500 mb-1">30-60</Text>
                        <Text className="text-lg font-bold text-red-500">₹0</Text>
                    </View>
                    <View className="flex-1 min-w-[100px] bg-gray-50 p-3 rounded-lg items-center border border-gray-100">
                        <Text className="text-[10px] font-bold text-gray-500 mb-1">60+</Text>
                        <Text className="text-lg font-bold text-red-500">₹0</Text>
                    </View>
                </View>
            </View>

            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                <View className="px-4 py-3 border-b border-gray-100">
                    <View className="mb-3">
                        <Text className="text-sm font-bold text-gray-900">Collection Records</Text>
                        <Text className="text-xs text-gray-500">Payment received & pending follow-ups</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row items-center gap-2 pr-4">
                            <TouchableOpacity className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-lg">
                                <Download size={13} color="#6B7280" />
                                <Text className="ml-1.5 text-xs font-semibold text-gray-700">Export Collections</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center px-3 py-2 bg-blue-600 rounded-lg">
                                <Plus size={13} color="#FFFFFF" />
                                <Text className="ml-1.5 text-xs font-bold text-white">Add Manual Entry</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center px-3 py-2 bg-gray-800 rounded-lg">
                                <Plus size={13} color="#FFFFFF" />
                                <Text className="ml-1.5 text-xs font-bold text-white">Record Payment</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View>
                        <View className="flex-row items-center px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                            {['INVOICE', 'CLIENT', 'AMOUNT RECEIVED', 'RECEIVED ON', 'MODE', 'REFERENCE', 'STATUS', 'ACTION'].map((col, i) => (
                                <Text key={i} className={`text-[9px] font-bold text-gray-400 uppercase tracking-wider mr-2 ${col === 'ACTION' ? 'w-20 text-center' : 'w-32'}`}>{col}</Text>
                            ))}
                        </View>
                        {COLLECTIONS_DATA.map((row, i) => (
                            <View key={i} className="flex-row items-center px-4 py-3.5 border-b border-gray-50 bg-white">
                                <Text className="w-32 mr-2 text-xs text-blue-600 font-medium">{row.invoice}</Text>
                                <Text className="w-32 mr-2 text-xs text-gray-700">{row.client}</Text>
                                <Text className="w-32 mr-2 text-xs font-semibold text-emerald-600">{row.amount}</Text>
                                <Text className="w-32 mr-2 text-xs text-gray-500">{row.receivedOn}</Text>
                                <Text className="w-32 mr-2 text-xs text-gray-700">{row.mode}</Text>
                                <Text className="w-32 mr-2 text-xs text-gray-500">{row.ref}</Text>
                                <View className="w-32 mr-2">
                                    <View className="px-2 py-1 rounded self-start bg-emerald-100">
                                        <Text className="text-[9px] font-bold text-emerald-700">{row.status}</Text>
                                    </View>
                                </View>
                                <View className="w-20 mr-2 items-center">
                                    <TouchableOpacity className="px-3 py-1 bg-white border border-gray-200 rounded">
                                        <Text className="text-[10px] font-medium text-gray-600">Download</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
                <PaginationFooter total={COLLECTIONS_DATA.length} start={1} end={COLLECTIONS_DATA.length} />
            </View>
        </View>
    );

    const renderClientLedger = () => (
        <View className="mt-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <View className="flex-row items-center pr-4">
                    <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5 w-64 mr-3">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase mr-2">SELECT CLIENT</Text>
                        <Text className="flex-1 text-xs font-medium text-gray-800">Khilesh Bonde</Text>
                        <ChevronDown size={14} color="#6B7280" />
                    </View>
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-lg">
                            <Download size={13} color="#6B7280" />
                            <Text className="ml-1.5 text-xs font-semibold text-gray-700">Export Ledger</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-lg">
                            <FileText size={13} color="#6B7280" />
                            <Text className="ml-1.5 text-xs font-semibold text-gray-700">Client Statement</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-lg">
                            <FileText size={13} color="#6B7280" />
                            <Text className="ml-1.5 text-xs font-semibold text-gray-700">Outstanding Summary</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <View className="flex-row pr-4 pb-2 w-full gap-3">
                    <SummaryCard title="TOTAL BILLED" value="₹0.00" valueColor="text-gray-900" fullWidth />
                    <SummaryCard title="TOTAL RECEIVED" value="₹0.00" valueColor="text-emerald-500" fullWidth />
                    <SummaryCard title="OUTSTANDING" value="₹0.00" valueColor="text-red-500" fullWidth />
                </View>
            </ScrollView>

            <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                <View className="px-4 py-4 border-b border-gray-100">
                    <Text className="text-sm font-bold text-gray-900">Transaction History — Khilesh Bonde</Text>
                    <Text className="text-xs text-gray-500">All debits and credits in chronological order</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View className="min-w-full">
                        <View className="flex-row items-center px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                            {['DATE', 'PARTICULARS', 'DEBIT (₹)', 'CREDIT (₹)', 'BALANCE (₹)'].map((col, i) => (
                                <Text key={i} className={`text-[9px] font-bold text-gray-400 uppercase tracking-wider mr-2 ${i === 1 ? 'w-48' : 'w-32'}`}>{col}</Text>
                            ))}
                        </View>
                        <View className="px-4 py-8 items-center justify-center bg-white">
                            <Text className="text-xs text-gray-400">No transactions found.</Text>
                        </View>
                    </View>
                </ScrollView>
                <PaginationFooter total={0} start={0} end={0} />
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            {/* Blue Top Header */}
            <View className="px-4 pt-14 pb-3 bg-blue-600">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => (navigation as any).openDrawer()} className="p-2 -ml-2 mr-3 bg-white/10 rounded-full">
                            <Menu size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text className="text-base font-bold text-white">Receivables (Client Billing)</Text>
                    </View>
                    <View className="flex-row items-center space-x-3">
                        <View className="w-7 h-7 bg-white/20 rounded-full items-center justify-center">
                            <Text className="text-white text-xs font-bold">A</Text>
                        </View>
                    </View>
                </View>
                <Text className="text-[10px] text-blue-100 mt-0.5">Accountant &gt; Receivables</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4">
                    {/* Title + Subtitle */}
                    <View className="mb-4">
                        <Text className="text-lg font-bold text-gray-900">Receivables</Text>
                        <Text className="text-xs text-gray-500 mt-0.5">Manage invoices, running bills, collections, client ledger & reports.</Text>
                    </View>

                    {/* Tabs Row */}
                    <View className="mb-2">
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="bg-white border border-gray-200 rounded-xl self-start">
                            <View className="flex-row">
                                {TABS.map((tab) => (
                                    <TouchableOpacity
                                        key={tab}
                                        onPress={() => setActiveTab(tab)}
                                        className={`px-5 py-2.5 ${activeTab === tab ? 'bg-blue-50' : 'bg-transparent'}`}
                                    >
                                        <Text className={`text-xs font-semibold ${activeTab === tab ? 'text-blue-600' : 'text-gray-600'}`}>{tab}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Active Tab Content */}
                    <View className="mt-2">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            RECEIVABLES / <Text className="text-blue-600">{activeTab}</Text>
                        </Text>
                        {activeTab === 'Quotations' && renderQuotations()}
                        {activeTab === 'Invoices' && renderInvoices()}
                        {activeTab === 'RA Bills' && renderRABills()}
                        {activeTab === 'Collections' && renderCollections()}
                        {activeTab === 'Client Ledger' && renderClientLedger()}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
