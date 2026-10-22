import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomerTabBar from '@/components/CustomerTabBar';
import { useCart } from '@/context/cart-context';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useCart();

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <View className="flex-row items-center px-6 py-4">
        <Text className="flex-1 text-xl font-semibold text-zinc-900">Pesanan Saya</Text>
        <TouchableOpacity accessibilityLabel="Buka keranjang" onPress={() => router.push('/cart')}>
          <Feather name="shopping-cart" size={22} color="#166534" />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 24 }}>
        {orders.length === 0 ? (
          <View className="items-center rounded-xl border border-neutral-200 bg-white/70 px-6 py-12">
            <Feather name="clipboard" size={36} color="#6b7280" />
            <Text className="mt-4 text-base font-semibold text-zinc-900">Belum ada pesanan</Text>
            <Text className="mt-2 text-center text-sm text-gray-500">
              Pesanan yang sudah dibuat akan muncul di sini.
            </Text>
            <TouchableOpacity
              className="mt-6 rounded-lg bg-green-800 px-6 py-3"
              onPress={() => router.push('/menu')}>
              <Text className="font-semibold text-white">Lihat Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order.id} className="mb-4 rounded-xl border border-neutral-200 bg-white/70 p-4">
              <View className="mb-3 flex-row justify-between">
                <Text className="font-semibold text-zinc-900">{order.id}</Text>
                <Text className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('id-ID')}
                </Text>
              </View>
              {order.items.map((item) => (
                <Text key={item.id} className="mb-1 text-sm text-gray-600">
                  {item.name} x{item.quantity}
                </Text>
              ))}
              <View className="mt-3 flex-row justify-between border-t border-neutral-200 pt-3">
                <Text className="text-sm text-gray-600">{order.orderType} · {order.paymentMethod}</Text>
                <Text className="font-semibold text-green-800">
                  Rp {order.total.toLocaleString('id-ID')}
                </Text>
              </View>
              {order.note ? (
                <Text className="mt-2 text-sm text-gray-500">Catatan: {order.note}</Text>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
      <CustomerTabBar />
    </SafeAreaView>
  );
}
