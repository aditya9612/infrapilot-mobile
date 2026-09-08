import { usePathname, useRouter } from 'expo-router';
import { DrawerContentScrollView } from 'expo-router/drawer';
import { AlertTriangle, BarChart, Bell, Briefcase, CheckCircle, ChevronDown, ChevronRight, Circle, Clipboard, Database, DollarSign, FileText, Folder, Grid, Layers, MessageCircle, Package, PenTool, Settings, UserCheck, Users } from 'lucide-react-native';
import { useState } from 'react';
import { LayoutAnimation, Text, TouchableOpacity, View } from 'react-native';



interface MenuItemProps {
    title: string;
    route?: string;
    icon?: any;
    children?: MenuItemProps[];
}

const MENU_ITEMS: MenuItemProps[] = [
    { title: 'Dashboard', route: '/admin/admindashboard', icon: Grid },
    { title: 'Projects', route: '/admin/projects', icon: Folder },
    {
        title: 'Invoices & Estimates',
        icon: FileText,
        children: [
            { title: 'All Invoices', route: '/admin/invoices/all' },
            {
                title: 'Owner',
                children: [
                    { title: 'Quotation', route: '/admin/quotations' },
                    { title: 'Final Measurement', route: '/admin/measurements' },
                ]
            },
            { title: 'Labour', route: '/admin/invoices/all?type=labour' },
            { title: 'Material', route: '/admin/invoices/all?type=material' }
        ]
    },
    {
        title: 'User & Role Management',
        icon: Users,
        children: [
            { title: 'Users', route: '/admin/users' },
            { title: 'Roles', route: '/admin/users/roles' },
            { title: 'Permissions', route: '/admin/users/permissions' },
        ]
    },
    { title: 'Clients', route: '/admin/clients', icon: UserCheck },
    {
        title: 'Owner Management',
        icon: Briefcase,
        children: [
            { title: 'Owners List', route: '/admin/owners/list' },
            { title: 'Agreements', route: '/admin/owners/agreements' },
            { title: 'Track Payments', route: '/admin/owners/payments' },
            { title: 'Owner Ledger', route: '/admin/owners/ledger' }
        ]
    },
    { title: 'AutoCAD Viewer', route: '/admin/autocad', icon: Layers },
    { title: 'Site Engineers', route: '/admin/engineers', icon: PenTool },
    { title: 'Project Managers', route: '/admin/managers', icon: Briefcase },
    {
        title: 'Work & BOQ',
        icon: Clipboard,
        children: [
            { title: 'BOQ Setup', route: '/admin/boq/setup' }
        ]
    },
    {
        title: 'Material & Inventory',
        icon: Package,
        children: [
            { title: 'Material Master', route: '/admin/inventory/master' },
            { title: 'Inventory Management', route: '/admin/inventory/stock' },
            { title: 'Equipment Management', route: '/admin/equipment' },
        ]
    },
    {
        title: 'Finance & Accounts',
        icon: DollarSign,
        children: [
            { title: 'Expenses', route: '/admin/finance/expenses' },
            { title: 'Profit Tracking', route: '/admin/finance/profit' },
        ]
    },
    {
        title: 'Approvals & Workflow',
        icon: CheckCircle,
        children: [
            { title: 'Approval Requests', route: '/admin/approvals' }
        ]
    },
    {
        title: 'Reports & Analytics',
        icon: BarChart,
        children: [
            { title: 'Progress Report', route: '/admin/reports/progress' },
            { title: 'Financial Report', route: '/admin/reports/financial' },
            { title: 'Labour Report', route: '/admin/reports/labour' },
            { title: 'Material Consumption', route: '/admin/reports/consumption' },
        ]
    },
    { title: 'Notifications', route: '/admin/notifications', icon: Bell },
    { title: 'Issues', route: '/admin/issues', icon: AlertTriangle },
    { title: 'Documents', route: '/admin/documents', icon: FileText },
    {
        title: 'Master Data',
        icon: Database,
        children: [
            { title: 'Material Master', route: '/admin/master-data/materials' },
            { title: 'Labour Types', route: '/admin/master-data/labour' },
            { title: 'Activity Types', route: '/admin/master-data/activities' },
            { title: 'Units', route: '/admin/master-data/units' },
        ]
    },
    { title: 'Chat', route: '/chat', icon: MessageCircle },
    { title: 'Settings', route: '/admin/settings', icon: Settings }
];

export default function AdminDrawer(props: any) {
    const router = useRouter();
    const currentPath = usePathname();

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpand = (title: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const handlePress = (item: MenuItemProps) => {
        if (item.children) {
            toggleExpand(item.title);
        } else if (item.route) {
            router.push(item.route as any);
        }
    };

    const renderItem = (item: MenuItemProps, depth: number = 0) => {
        const isExpanded = !!expanded[item.title];
        const isSelected = item.route === currentPath;
        const Icon = item.icon || Circle;

        return (
            <View key={item.title}>
                <TouchableOpacity
                    className={`flex-row items-center justify-between py-3 px-4 ${isSelected ? 'bg-blue-50 border-r-4 border-blue-600' : ''}`}
                    style={{ paddingLeft: 16 + depth * 24 }}
                    onPress={() => handlePress(item)}
                >
                    <View className="flex-row items-center flex-1 pr-4">
                        {depth === 0 ? (
                            <Icon size={18} color={isSelected ? '#2563EB' : '#4B5563'} strokeWidth={isSelected ? 2.5 : 2} />
                        ) : null}
                        <Text
                            className={`text-[13px] ${depth === 0 ? 'ml-3' : ''} ${isSelected ? 'text-blue-700 font-bold' : 'text-gray-700 font-medium'}`}
                            numberOfLines={1}
                        >
                            {item.title}
                        </Text>
                    </View>
                    {item.children && (
                        <View>
                            {isExpanded ? <ChevronDown size={14} color="#6B7280" /> : <ChevronRight size={14} color="#6B7280" />}
                        </View>
                    )}
                </TouchableOpacity>

                {item.children && isExpanded && (
                    <View style={{ marginLeft: 28, borderLeftWidth: 1, borderColor: '#E5E7EB' }} className="my-1 overflow-hidden">
                        {item.children.map(child => renderItem(child, depth + 1))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-white">
            {/* Brand Header */}
            <View className="pt-12 pb-6 px-6 border-b border-gray-100 bg-gray-50 flex-col items-start justify-end h-36">
                <Text className="text-xl font-black text-gray-900 tracking-tight">Infra<Text className="text-blue-600">Pilot</Text></Text>
                <Text className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mt-1">Super Admin Console</Text>
            </View>

            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}>
                <View className="pb-8">
                    {MENU_ITEMS.map(item => renderItem(item, 0))}
                </View>
            </DrawerContentScrollView>
        </View>
    );
}
