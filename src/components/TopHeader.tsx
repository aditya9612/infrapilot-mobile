import { useNavigation, usePathname, useRouter } from 'expo-router';
import { AlertTriangle, Bell, CheckCircle, Info, LogOut, Menu, Settings, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { NotificationItem, notificationService } from '../services/notificationService';

interface TopHeaderProps {
    title: string;
    subtitle: string;
}

export default function TopHeader({ title, subtitle }: TopHeaderProps) {
    const navigation = useNavigation();
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const data = await notificationService.getNotifications();
            setNotifications(data || []);
        };
        fetchNotifications();
    }, []);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleLogout = () => {
        setIsProfileOpen(false);
        router.replace('/');
    };

    const pathname = usePathname();
    const roleBase = pathname.split('/')[1] || 'engineer';


    return (
        <View className="px-4 pt-12 pb-4 bg-[#2563EB] flex-row items-center justify-between z-50">
            <View className="flex-row items-center">
                <TouchableOpacity onPress={() => (navigation as any).openDrawer()} className="p-2 -ml-2 mr-3 bg-white/20 rounded-full">
                    <Menu size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <View>
                    <Text className="text-xl font-bold text-white">{title}</Text>
                    <Text className="text-[10px] text-white/80">{subtitle}</Text>
                </View>
            </View>
            <View className="flex-row items-center">
                <TouchableOpacity className="relative mr-4" onPress={() => setIsNotificationsOpen(true)}>
                    <Bell size={20} color="#FFFFFF" />
                    {unreadCount > 0 && (
                        <View className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full items-center justify-center">
                            <Text className="text-white font-bold" style={{ fontSize: 9 }}>{unreadCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    className="w-8 h-8 rounded-full border border-white items-center justify-center"
                    onPress={() => setIsProfileOpen(true)}
                >
                    <Text className="text-white font-bold text-sm">A</Text>
                </TouchableOpacity>
            </View>

            {/* Dropdown Modal */}
            <Modal
                visible={isProfileOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsProfileOpen(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsProfileOpen(false)}>
                    <View className="flex-1 bg-black/5" />
                </TouchableWithoutFeedback>

                <View
                    className="absolute top-[80px] right-4 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[200px] overflow-hidden"
                    style={{ elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}
                >
                    {/* User Info */}
                    <View className="px-4 py-3 border-b border-gray-100">
                        <Text className="text-sm font-bold text-gray-800">Amit patil</Text>
                        <Text className="text-xs text-gray-500">SiteEngineer</Text>
                    </View>

                    {/* Actions */}
                    <TouchableOpacity
                        className="flex-row items-center px-4 py-3"
                        onPress={() => {
                            setIsProfileOpen(false);
                            router.push(`/${roleBase}/settings` as any);
                        }}
                    >
                        <User size={16} color="#6B7280" />
                        <Text className="ml-3 text-sm font-medium text-gray-700">My Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                        onPress={() => {
                            setIsProfileOpen(false);
                            router.push(`/${roleBase}/settings` as any);
                        }}
                    >
                        <Settings size={16} color="#6B7280" />
                        <Text className="ml-3 text-sm font-medium text-gray-700">Account Settings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center px-4 py-3"
                        onPress={handleLogout}
                    >
                        <LogOut size={16} color="#EF4444" />
                        <Text className="ml-3 text-sm font-bold text-red-500">Log Out</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Notifications Modal */}
            <Modal
                visible={isNotificationsOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsNotificationsOpen(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsNotificationsOpen(false)}>
                    <View className="flex-1 bg-black/5" />
                </TouchableWithoutFeedback>

                <View
                    className="absolute top-[80px] right-4 bg-white rounded-xl shadow-lg border border-gray-100 w-[300px] max-h-[400px] overflow-hidden"
                    style={{ elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}
                >
                    <View className="px-4 py-3 border-b border-gray-100 flex-row justify-between items-center">
                        <Text className="text-sm font-bold text-gray-800">Notifications</Text>
                        {!!unreadCount && <View className="bg-blue-100 px-2 py-0.5 rounded"><Text className="text-[10px] font-bold text-blue-600">{unreadCount} New</Text></View>}
                    </View>

                    <ScrollView className="flex-1">
                        {notifications.length === 0 ? (
                            <View className="p-4 items-center">
                                <Text className="text-xs text-gray-500">No notifications</Text>
                            </View>
                        ) : (
                            notifications.map((notif: NotificationItem, idx) => {
                                let IconComponent = Info;
                                let iconColor = "#3B82F6"; // blue
                                let bgIcon = "bg-blue-50";

                                const typeUpper = notif.type.toUpperCase();
                                if (typeUpper === 'alert' || typeUpper === 'ALERT') { IconComponent = AlertTriangle; iconColor = "#DC2626"; bgIcon = "bg-red-50"; }
                                else if (typeUpper === 'success' || typeUpper === 'SUCCESS') { IconComponent = CheckCircle; iconColor = "#10B981"; bgIcon = "bg-green-50"; }
                                else if (typeUpper === 'info' || typeUpper === 'INFO') { IconComponent = Info; iconColor = "#3B82F6"; bgIcon = "bg-blue-50"; }

                                return (
                                    <TouchableOpacity
                                        key={notif.id ?? idx}
                                        className={`px-4 py-3 border-b border-gray-50 flex-row items-start ${!notif.is_read ? 'bg-blue-50/30' : 'bg-white'}`}
                                        onPress={() => {
                                            // Handle click behavior e.g mark as read
                                            setIsNotificationsOpen(false);
                                        }}
                                    >
                                        <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 mt-1 ${bgIcon}`}>
                                            <IconComponent size={14} color={iconColor} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-xs ${!notif.is_read ? 'font-bold text-gray-800' : 'font-semibold text-gray-700'}`}>{notif.title}</Text>
                                            <Text className="text-[10px] text-gray-500 mt-0.5 leading-snug">{notif.message}</Text>
                                            {notif.created_at && (
                                                <Text className="text-[9px] text-gray-400 mt-1 font-medium">{notif.created_at.replace('T', ' ')}</Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}
