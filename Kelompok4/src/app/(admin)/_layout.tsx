import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2D5016',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8E0D0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, size }) => <Ionicons name="restaurant-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pesanan"
        options={{
          title: 'Pesanan',
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="laporan"
        options={{
          title: 'Laporan',
          tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" size={size} color={color} />,
        }}
      />
      {/* Sembunyikan dari tab bar */}
      <Tabs.Screen name="detail-menu"    options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="edit-menu"      options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="detail-pesanan" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="tambah-menu"    options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="pelanggan"      options={{ href: null, tabBarStyle: { display: 'none' } }} />
    </Tabs>
  );
}
