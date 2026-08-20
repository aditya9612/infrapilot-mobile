import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function AdminLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    headerShown: false, // We use custom headers in our screens
                    drawerActiveTintColor: '#2563EB',
                    drawerInactiveTintColor: '#1F2937',
                }}
            >
                <Drawer.Screen
                    name="dashboard/index"
                    options={{
                        drawerLabel: 'Dashboard',
                        title: 'Admin Dashboard',
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
