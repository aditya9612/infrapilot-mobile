import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState } from 'react';
import { TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import {
    LayoutGrid, BookOpen, TrendingUp, ShoppingCart, DollarSign,
    CreditCard, Percent, Users, Landmark, Edit3, Layers, BarChart3,
    CheckCircle, MessageSquare, Settings, LogOut
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

                <MenuItem name="Dashboard" route="/accountant/dashboard" icon={LayoutGrid} />
                <MenuItem name="Chart of Accounts" route="/accountant/chart-of-accounts" icon={BookOpen} />
                <MenuItem name="Receivables" route="/accountant/receivables/invoices" icon={TrendingUp} />
                <MenuItem name="Payables" route="/accountant/payables" icon={ShoppingCart} />
                <MenuItem name="Expenses" route="/accountant/expenses" icon={DollarSign} />
                <MenuItem name="Payments & Receipts" route="/accountant/payments-receipts" icon={CreditCard} />
                <MenuItem name="GST & Taxation" route="/accountant/taxation" icon={Percent} />
                <MenuItem name="Payroll" route="/accountant/payroll" icon={Users} />
                <MenuItem name="Bank & Cash" route="/accountant/banking" icon={Landmark} />
                <MenuItem name="Journal Entries" route="/accountant/journal-entries" icon={Edit3} />
                <MenuItem name="Fixed Assets" route="/accountant/fixed-assets" icon={Layers} />
                <MenuItem name="Reports" route="/accountant/reports" icon={BarChart3} />
                <MenuItem name="Approvals" route="/accountant/approvals" icon={CheckCircle} />

                {/* Chat & Settings */}
                <View className="mt-2 pt-2 pb-6">
                    <TouchableOpacity
                        onPress={() => router.push('/accountant/chat' as any)}
                        className={`flex-row items-center justify-between px-4 py-2.5 mx-2 my-0.5 rounded-lg ${pathname === '/accountant/chat' ? 'bg-blue-50/70' : 'bg-transparent'}`}
                    >
                        <View className="flex-row items-center flex-1">
                            <MessageSquare size={18} color={pathname === '/accountant/chat' ? '#2563EB' : '#6B7280'} />
                            <Text className={`ml-3 text-sm ${pathname === '/accountant/chat' ? 'font-semibold text-blue-600' : 'font-medium text-gray-600'}`}>
                                Chat
                            </Text>
                        </View>
                        <View className="bg-[#FF0055] rounded-full px-1.5 py-0.5 min-w-[20px] items-center justify-center">
                            <Text className="text-white text-[10px] font-bold">2</Text>
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
