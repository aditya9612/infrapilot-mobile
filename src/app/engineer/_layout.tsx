import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState } from 'react';
import { TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import {
  LayoutDashboard, ClipboardList, BarChart3, Users, CheckSquare, Package, 
  Wrench, CheckCircle, AlertTriangle, Camera, Folder, ClipboardCheck, 
  BarChart, Settings, ChevronDown, ChevronRight, MessageSquare, BookOpen, Layers,
  Calendar, Wallet, FileText, LogOut
} from 'lucide-react-native';

function CustomDrawerContent(props: any) {
    const pathname = usePathname();
    const router = useRouter();
    const [isWorkProgressExpanded, setIsWorkProgressExpanded] = useState(pathname.includes('/work-progress'));
    const [isApprovalsExpanded, setIsApprovalsExpanded] = useState(pathname.includes('/approvals'));
    const [isLabourExpanded, setIsLabourExpanded] = useState(pathname.includes('/labour-management'));
    const [isMaterialExpanded, setIsMaterialExpanded] = useState(pathname.includes('/material-management'));

    const MenuItem = ({ name, route, icon: Icon, isSubItem = false }: any) => {
        const isActive = pathname === route;
        
        return (
            <TouchableOpacity
                onPress={() => router.push(route)}
                className={`flex-row items-center px-4 py-2.5 mx-2 my-0.5 rounded-lg ${isActive ? 'bg-blue-50/70' : 'bg-transparent'} ${isSubItem ? 'ml-6 border-l-2 border-blue-100 pl-4 py-2' : ''}`}
            >
                {Icon && <Icon size={18} color={isActive ? '#2563EB' : '#6B7280'} />}
                <Text className={`ml-3 text-sm ${isActive ? 'font-semibold text-blue-600' : 'font-medium text-gray-600'}`}>
                    {name}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-white">
            <View className="p-5 border-b border-gray-100 flex-row items-center mb-2 mt-4">
                <View className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                    <Text className="text-white font-bold text-lg">IP</Text>
                </View>
                <View>
                    <Text className="font-bold text-gray-900 text-lg">InfraPilot</Text>
                    <Text className="text-xs text-gray-500 font-medium">Site Engineer</Text>
                </View>
            </View>
            
            <ScrollView className="px-1 pt-2 flex-1" showsVerticalScrollIndicator={false}>
                
                <MenuItem name="Dashboard" route="/engineer/dashboard" icon={LayoutDashboard} />
                <MenuItem name="Daily Site Report (DSR)" route="/engineer/daily-site-report" icon={ClipboardList} />

                {/* Work Progress Expandable */}
                <TouchableOpacity
                    onPress={() => setIsWorkProgressExpanded(!isWorkProgressExpanded)}
                    className={`flex-row items-center justify-between px-4 py-2.5 mx-2 my-0.5 rounded-lg ${pathname.includes('/work-progress') ? 'bg-blue-50/70' : 'bg-transparent'}`}
                >
                    <View className="flex-row items-center">
                        <BarChart3 size={18} color={pathname.includes('/work-progress') ? '#2563EB' : '#6B7280'} />
                        <Text className={`ml-3 text-sm ${pathname.includes('/work-progress') ? 'font-semibold text-blue-600' : 'font-medium text-gray-600'}`}>
                            Work Progress
                        </Text>
                    </View>
                    {isWorkProgressExpanded ? <ChevronDown size={16} color="#6B7280" /> : <ChevronRight size={16} color="#6B7280" />}
                </TouchableOpacity>

                {isWorkProgressExpanded && (
                    <View className="mb-1 ml-4 border-l border-gray-200 py-1">
                        <MenuItem name="Activity List" route="/engineer/work-progress/activity-list" icon={ClipboardList} isSubItem={true} />
                        <MenuItem name="Daily Progress Entry" route="/engineer/work-progress/daily-progress" icon={ClipboardCheck} isSubItem={true} />
                        <MenuItem name="Work Orders" route="/engineer/work-progress/work-orders" icon={FileText} isSubItem={true} />
                    </View>
                )}

                {/* Labour Management Expandable */}
                <TouchableOpacity
                    onPress={() => setIsLabourExpanded(!isLabourExpanded)}
                    className={`flex-row items-center justify-between px-4 py-2.5 mx-2 my-0.5 rounded-lg ${pathname.includes('/labour-management') ? 'bg-blue-50/70' : 'bg-transparent'}`}
                >
                    <View className="flex-row items-center">
                        <Users size={18} color={pathname.includes('/labour-management') ? '#2563EB' : '#6B7280'} />
                        <Text className={`ml-3 text-sm ${pathname.includes('/labour-management') ? 'font-semibold text-blue-600' : 'font-medium text-gray-600'}`}>
                            Labour Management
                        </Text>
                    </View>
                    {isLabourExpanded ? <ChevronDown size={16} color="#6B7280" /> : <ChevronRight size={16} color="#6B7280" />}
                </TouchableOpacity>

                {isLabourExpanded && (
                    <View className="mb-1 ml-4 border-l border-gray-200 py-1">
                        <MenuItem name="Labour Registry" route="/engineer/labour-management/labour-registry" icon={Users} isSubItem={true} />
                        <MenuItem name="Daily Attendance" route="/engineer/labour-management/daily-attendance" icon={Calendar} isSubItem={true} />
                        <MenuItem name="Salary & Advances" route="/engineer/labour-management/salary-advances" icon={Wallet} isSubItem={true} />
                        <MenuItem name="Payroll Reports" route="/engineer/labour-management/payroll-reports" icon={FileText} isSubItem={true} />
                    </View>
                )}

                <MenuItem name="Task Management" route="/engineer/task-management" icon={CheckSquare} />

                {/* Material Management Expandable */}
                <TouchableOpacity
                    onPress={() => setIsMaterialExpanded(!isMaterialExpanded)}
                    className={`flex-row items-center justify-between px-4 py-2.5 mx-2 my-0.5 rounded-lg ${pathname.includes('/material-management') ? 'bg-blue-50/70' : 'bg-transparent'}`}
                >
                    <View className="flex-row items-center">
                        <Package size={18} color={pathname.includes('/material-management') ? '#2563EB' : '#6B7280'} />
                        <Text className={`ml-3 text-sm ${pathname.includes('/material-management') ? 'font-semibold text-blue-600' : 'font-medium text-gray-600'}`}>
                            Material Management
                        </Text>
                    </View>
                    {isMaterialExpanded ? <ChevronDown size={16} color="#6B7280" /> : <ChevronRight size={16} color="#6B7280" />}
                </TouchableOpacity>

                {isMaterialExpanded && (
                    <View className="mb-1 ml-4 border-l border-gray-200 py-1">
                        <MenuItem name="Material Receipt" route="/engineer/material-management/material-receipt" icon={Package} isSubItem={true} />
                        <MenuItem name="Material Consumption" route="/engineer/material-management/material-consumption" icon={Package} isSubItem={true} />
                        <MenuItem name="Stock Summary" route="/engineer/material-management/stock-summary" icon={ClipboardList} isSubItem={true} />
                    </View>
                )}

                <MenuItem name="Machinery & Equipment" route="/engineer/machinery-equipment" icon={Wrench} />
                <MenuItem name="Quality Control (QC)" route="/engineer/quality-control" icon={CheckCircle} />
                <MenuItem name="Safety Management" route="/engineer/safety-management" icon={AlertTriangle} />
                <MenuItem name="Issue / Delay Tracker" route="/engineer/issue-delay-tracker" icon={AlertTriangle} />
                <MenuItem name="Site Photos" route="/engineer/site-photos" icon={Camera} />
                <MenuItem name="Drawings & Documents" route="/engineer/drawings-documents" icon={Folder} />
                <MenuItem name="Checklists" route="/engineer/checklists" icon={ClipboardCheck} />

                {/* Approvals Expandable */}
                <TouchableOpacity
                    onPress={() => setIsApprovalsExpanded(!isApprovalsExpanded)}
                    className={`flex-row items-center justify-between px-4 py-2.5 mx-2 my-0.5 rounded-lg ${pathname.includes('/approvals') ? 'bg-blue-50/70' : 'bg-transparent'}`}
                >
                    <View className="flex-row items-center">
                        <CheckCircle size={18} color={pathname.includes('/approvals') ? '#2563EB' : '#6B7280'} />
                        <Text className={`ml-3 text-sm ${pathname.includes('/approvals') ? 'font-semibold text-blue-600' : 'font-medium text-gray-600'}`}>
                            Approvals
                        </Text>
                    </View>
                    {isApprovalsExpanded ? <ChevronDown size={16} color="#6B7280" /> : <ChevronRight size={16} color="#6B7280" />}
                </TouchableOpacity>

                {isApprovalsExpanded && (
                    <View className="mb-1 ml-4 border-l border-gray-200 py-1">
                        <MenuItem name="Resources Request" route="/engineer/approvals/resources-request" icon={Layers} isSubItem={true} />
                        <MenuItem name="Approvals" route="/engineer/approvals/work-approvals" icon={BookOpen} isSubItem={true} />
                    </View>
                )}

                <MenuItem name="Reports" route="/engineer/reports" icon={BarChart} />
                
                <View className="border-t border-gray-100 mt-2 pt-2 pb-6">
                    <TouchableOpacity
                        onPress={() => router.push('/engineer/chat' as any)}
                        className={`flex-row items-center px-4 py-3 mx-2 my-1 rounded-lg ${pathname === '/engineer/chat' ? 'bg-blue-50/70' : 'bg-transparent'}`}
                    >
                        <MessageSquare size={18} color={pathname === '/engineer/chat' ? '#2563EB' : '#6B7280'} />
                        <Text className={`ml-3 text-sm flex-1 ${pathname === '/engineer/chat' ? 'font-semibold text-blue-600' : 'font-medium text-gray-600'}`}>
                            Chat
                        </Text>
                        <View className="bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                            <Text className="text-white text-xs font-bold">1</Text>
                        </View>
                    </TouchableOpacity>
                    <MenuItem name="Settings" route="/engineer/settings" icon={Settings} />
                </View>
            </ScrollView>

            {/* Bottom User Profile Section */}
            <View className="p-4 border-t border-gray-100 bg-gray-50/30">
                <View className="flex-row items-center mb-4">
                    <View className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                        <Text className="text-white font-bold text-lg">A</Text>
                    </View>
                    <View className="ml-3">
                        <Text className="font-bold text-gray-800 text-sm">Amit patil</Text>
                        <Text className="text-xs text-gray-500 font-medium mt-0.5">7474747474</Text>
                    </View>
                </View>
                
                <TouchableOpacity 
                    onPress={() => router.replace('/')}
                    className="flex-row items-center px-2 py-2"
                >
                    <LogOut size={16} color="#6B7280" />
                    <Text className="ml-3 font-semibold text-sm text-gray-600">Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerShown: false,
                    drawerStyle: {
                        width: 280,
                    },
                }}
            />
        </GestureHandlerRootView>
    );
}
