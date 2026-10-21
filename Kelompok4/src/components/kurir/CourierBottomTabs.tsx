import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

type CourierTab = 'orders' | 'history' | 'profile';

interface CourierBottomTabsProps {
  activeTab: CourierTab;
}

const tabs = [
  { key: 'orders', label: 'Pesanan', icon: 'receipt-outline', route: '/pesanan-kurir' },
  { key: 'history', label: 'Riwayat', icon: 'time-outline', route: '/riwayat-pengantaran' },
  { key: 'profile', label: 'Profil', icon: 'user', route: '/profil-kurir' },
] as const;

export default function CourierBottomTabs({ activeTab }: CourierBottomTabsProps) {
  const router = useRouter();

  return (
    <View className="flex-row border-t border-stone-200 bg-[#fbf8f0] px-3 pb-2 pt-2">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        const color = isActive ? '#176044' : '#89939a';

        return (
          <TouchableOpacity
            key={tab.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className="flex-1 items-center justify-center gap-1 py-1"
            onPress={() => router.navigate(tab.route)}
          >
            {tab.icon === 'user' ? (
              <Feather name="user" size={17} color={color} />
            ) : (
              <Ionicons name={tab.icon} size={18} color={color} />
            )}
            <Text className={`text-[10px] ${isActive ? 'font-semibold' : 'font-normal'}`} style={{ color }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
