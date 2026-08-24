import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState } from 'react';
import { TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import {
  LayoutDashboard, ClipboardList, BarChart3, Users, CheckSquare, Package, 
  Wrench, CheckCircle, AlertTriangle, Camera, Folder, ClipboardCheck, 
  BarChart, Settings, ChevronDown, ChevronRight, MessageSquare, BookOpen, Layers
} from 'lucide-react-native';

const MENU_ITEMS = [
    { name: 'Dashboard', icon: LayoutDashboard, route: '/engineer/dashboard' },
    { name: 'Daily Site Report (DSR)', icon: ClipboardList, route: '/engineer/daily-site-report' },
    { name: 'Work Progress', icon: BarChart3, route: '/engineer/work-progress' },
    { name: 'Labour Management', icon: Users, route: '/engineer/labour-management' },
    { name: 'Task Management', icon: CheckSquare, route: '/engineer/task-management' },
    { name: 'Material Management', icon: Package, route: '/engineer/material-management' },
    { name: 'Machinery & Equipment', icon: Wrench, route: '/engineer/machinery-equipment' },
    { name: 'Quality Control (QC)', icon: CheckCircle, route: '/engineer/quality-control' },
    { name: 'Safety Management', icon: AlertTriangle, route: '/engineer/safety-management' },
    { name: 'Issue / Delay Tracker', icon: AlertTriangle, route: '/engineer/issue-delay-tracker' },
    { name: 'Site Photos', icon: Camera, route: '/engineer/site-photos' },
    { name: 'Drawings & Documents', icon: Folder, route: '/engineer/drawings-documents' },
    { name: 'Checklists', icon: ClipboardCheck, route: '/engineer/checklists' },
];

function CustomDrawerContent(props: any) {
    const pathname = usePathname();
    const router = useRouter();
    const [isApprovalsExpanded, setIsApprovalsExpanded] = useState(pathname.includes('/approvals'));

    const MenuItem = ({ item, isSubItem = false }: any) => {
        const isActive = pathname === item.route;
        const Icon = item.icon;
        
        return (
            <TouchableOpacity
                onPress={() => router.push(item.route)}
                className={`flex-row items-center px-4 py-2.5 mx-2 my-0.5 rounded-lg ${isActive ? 'bg-blue-50/70' : 'bg-transparent'} ${isSubItem ? 'ml-6 border-l-2 border-blue-100 pl-4 py-2' : ''}`}
            >
                {Icon && <Icon size={18} color={isActive ? '#2563EB' : '#6B7280'} />}
                <Text className={`ml-3 text-sm ${isActive ? 'font-semibold text-blue-600' : 'font-medium text-gray-600'}`}>
                    {item.name}
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
            
            <ScrollView className="px-1 pt-4">
                {MENU_ITEMS.map((item, index) => (
                    <MenuItem key={index} item={item} />
                ))}

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
                        <MenuItem item={{ name: 'Resources Request', route: '/engineer/approvals/resources-request', icon: Layers }} isSubItem={true} />
                        <MenuItem item={{ name: 'Approvals', route: '/engineer/approvals/work-approvals', icon: BookOpen }} isSubItem={true} />
                    </View>
                )}

                <MenuItem item={{ name: 'Reports', icon: BarChart, route: '/engineer/reports' }} />
                
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
                    <MenuItem item={{ name: 'Settings', icon: Settings, route: '/engineer/settings' }} />
                </View>
            </ScrollView>
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
