import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    headerShown: false,
                    drawerActiveTintColor: '#2563EB',
                    drawerInactiveTintColor: '#1F2937',
                }}
            >
                <Drawer.Screen
                    name="dashboard"
                    options={{
                        drawerLabel: 'Dashboard',
                        title: 'Dashboard',
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
