import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState } from 'react';
import { TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import {
    LayoutDashboard, Wallet, BookOpen, Building2, CreditCard, 
    FileText, Users, Receipt, BarChart3, Settings, ChevronDown,
    ChevronRight, MessageSquare, LogOut, Landmark, ArrowDownRight, 
    ArrowUpRight, Calculator
} from 'lucide-react-native';

function CustomDrawerContent(props: any) {
    const pathname = usePathname();
    const router = useRouter();
    const [isPayablesExpanded, setIsPayablesExpanded] = useState(pathname.includes('/payables'));
    const [isReceivablesExpanded, setIsReceivablesExpanded] = useState(pathname.includes('/receivables'));

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

    const ExpandableItem = ({ name, icon: Icon, expanded, onToggle, pathKey }: any) => {
        const isActive = pathname.includes(pathKey);
        return (
            <TouchableOpacity
                onPress={onToggle}
                className={`flex-row items-center justify-between px-4 py-2.5 mx-2 my-0.5 rounded-lg ${isActive ? 'bg-blue-50/70' : 'bg-transparent'}`}
            >
                <View className="flex-row items-center">
                    <Icon size={18} color={isActive ? '#2563EB' : '#6B7280'} />
                    <Text className={`ml-3 text-sm ${isActive ? 'font-semibold text-blue-600' : 'font-medium text-gray-600'}`}>
                        {name}
                    </Text>
                </View>
                {expanded ? <ChevronDown size={16} color="#6B7280" /> : <ChevronRight size={16} color="#6B7280" />}
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-white">
            {/* Logo Header */}
            <View className="p-5 border-b border-gray-100 flex-row items-center mb-2 mt-4">
                <View className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                    <Text className="text-white font-bold text-lg">IP</Text>
                </View>
                <View>
                    <Text className="font-bold text-gray-900 text-lg">InfraPilot</Text>
                    <Text className="text-xs text-gray-500 font-medium">Accountant</Text>
                </View>
            </View>

            <ScrollView className="px-1 pt-2 flex-1" showsVerticalScrollIndicator={false}>

                {/* Dashboard */}
                <MenuItem name="Dashboard" route="/accountant/dashboard" icon={LayoutDashboard} />

                {/* Chart of Accounts */}
                <MenuItem name="Chart of Accounts" route="/accountant/chart-of-accounts" icon={BookOpen} />

                {/* Journal Entries */}
                <MenuItem name="Journal Entries" route="/accountant/journal-entries" icon={FileText} />

                {/* Receivables Expandable */}
                <ExpandableItem
                    name="Receivables"
                    icon={ArrowDownRight}
                    expanded={isReceivablesExpanded}
                    onToggle={() => setIsReceivablesExpanded(!isReceivablesExpanded)}
                    pathKey="/receivables"
                />
                {isReceivablesExpanded && (
                    <View className="mb-1 ml-4 border-l border-gray-200 py-1">
                        <MenuItem name="Customer Invoices" route="/accountant/receivables/invoices" icon={Receipt} isSubItem={true} />
                        <MenuItem name="Collections" route="/accountant/receivables/collections" icon={CreditCard} isSubItem={true} />
                    </View>
                )}

                {/* Payables Expandable */}
                <ExpandableItem
                    name="Payables"
                    icon={ArrowUpRight}
                    expanded={isPayablesExpanded}
                    onToggle={() => setIsPayablesExpanded(!isPayablesExpanded)}
                    pathKey="/payables"
                />
                {isPayablesExpanded && (
                    <View className="mb-1 ml-4 border-l border-gray-200 py-1">
                        <MenuItem name="Vendor Bills" route="/accountant/payables/bills" icon={Receipt} isSubItem={true} />
                        <MenuItem name="Payments" route="/accountant/payables/payments" icon={CreditCard} isSubItem={true} />
                    </View>
                )}

                {/* Payments & Receipts */}
                <MenuItem name="Payments & Receipts" route="/accountant/payments-receipts" icon={CreditCard} />

                {/* Expenses */}
                <MenuItem name="Expenses" route="/accountant/expenses" icon={Wallet} />

                {/* Banking */}
                <MenuItem name="Banking" route="/accountant/banking" icon={Landmark} />

                {/* Payroll */}
                <MenuItem name="Payroll" route="/accountant/payroll" icon={Users} />

                {/* Fixed Assets */}
                <MenuItem name="Fixed Assets" route="/accountant/fixed-assets" icon={Building2} />

                {/* Taxation */}
                <MenuItem name="Taxation" route="/accountant/taxation" icon={Calculator} />

                {/* Reports */}
                <MenuItem name="Reports" route="/accountant/reports" icon={BarChart3} />

                {/* Chat & Settings */}
                <View className="border-t border-gray-100 mt-2 pt-2 pb-6">
                    <TouchableOpacity
                        onPress={() => router.push('/accountant/chat' as any)}
                        className={`flex-row items-center px-4 py-3 mx-2 my-1 rounded-lg ${pathname === '/accountant/chat' ? 'bg-blue-50/70' : 'bg-transparent'}`}
                    >
                        <MessageSquare size={18} color={pathname === '/accountant/chat' ? '#2563EB' : '#6B7280'} />
                        <Text className={`ml-3 text-sm flex-1 ${pathname === '/accountant/chat' ? 'font-semibold text-blue-600' : 'font-medium text-gray-600'}`}>
                            Chat
                        </Text>
                        <View className="bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                            <Text className="text-white text-xs font-bold">1</Text>
                        </View>
                    </TouchableOpacity>
                    <MenuItem name="Settings" route="/accountant/settings" icon={Settings} />
                </View>
            </ScrollView>

            {/* Bottom User Profile & Logout */}
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
