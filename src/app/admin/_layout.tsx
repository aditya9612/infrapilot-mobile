import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AdminDrawer from '../../components/navigation/AdminDrawer';

export default function AdminLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <AdminDrawer {...props} />}
                screenOptions={{ headerShown: false }}
            >
                <Drawer.Screen name="admindashboard" />
                <Drawer.Screen name="projects" />
            </Drawer>
        </GestureHandlerRootView>
    );
}
