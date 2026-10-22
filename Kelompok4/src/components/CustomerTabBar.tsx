import { Feather } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '@/context/cart-context';

const tabs = [
  { route: '/home', label: 'Home', icon: 'home' as const },
  { route: '/menu', label: 'Menu', icon: 'grid' as const },
  { route: '/cart', label: 'Keranjang', icon: 'shopping-cart' as const },
  { route: '/orders', label: 'Pesanan', icon: 'file-text' as const },
  { route: '/profile', label: 'Profil', icon: 'user' as const },
];

export default function CustomerTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <View className="flex-row border-t border-neutral-200 bg-orange-50 px-2 pb-2 pt-3">
      {tabs.map((tab) => {
        const active = pathname === tab.route;
        return (
          <TouchableOpacity
            key={tab.route}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            className="flex-1 items-center gap-1"
            onPress={() => router.replace(tab.route as never)}>
            <View>
              <Feather name={tab.icon} size={21} color={active ? '#166534' : '#6b7280'} />
              {tab.route === '/cart' && itemCount > 0 ? (
                <View className="absolute -right-2 -top-2 min-w-4 rounded-full bg-red-600 px-1">
                  <Text className="text-center text-[10px] font-bold text-white">{itemCount}</Text>
                </View>
              ) : null}
            </View>
            <Text className={`text-[10px] ${active ? 'font-semibold text-green-800' : 'text-gray-500'}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
