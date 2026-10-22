import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart, type OrderType } from '@/context/cart-context';

const orderOptions: { type: OrderType; description: string; icon: 'coffee' | 'shopping-bag' | 'truck' }[] = [
  { type: 'Dine-in', description: 'Makan di tempat', icon: 'coffee' },
  { type: 'Take Away', description: 'Ambil di outlet', icon: 'shopping-bag' },
  { type: 'Delivery', description: 'Diantar ke alamat Anda', icon: 'truck' },
];

export default function JenisOrderScreen() {
  const router = useRouter();
  const { items, orderType, setOrderType } = useCart();

  const chooseOrderType = (type: OrderType) => {
    if (items.length === 0) {
      router.replace('/menu');
      return;
    }
    setOrderType(type);
    router.push('/checkout');
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <View className="h-16 flex-row items-center gap-4 px-6">
        <TouchableOpacity
          accessibilityLabel="Kembali ke keranjang"
          className="h-8 w-8 justify-center"
          onPress={() => router.push('/cart')}>
          <Feather name="arrow-left" size={24} color="#18181b" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-zinc-900">Jenis Order</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 pt-3"
        contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="mb-6 text-base leading-6 text-gray-500">
          Pilih jenis pesanan yang sesuai dengan kebutuhan Anda.
        </Text>
        {orderOptions.map((option) => (
          <TouchableOpacity
            key={option.type}
            className={`mb-4 flex-row items-center gap-5 rounded-xl border p-5 ${
              orderType === option.type ? 'border-green-800 bg-green-50' : 'border-neutral-200 bg-white/60'
            }`}
            onPress={() => chooseOrderType(option.type)}>
            <View className="h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Feather name={option.icon} size={24} color="#166534" />
            </View>
            <View className="flex-1">
              <Text className="text-lg text-zinc-900">{option.type}</Text>
              <Text className="text-base text-gray-500">{option.description}</Text>
            </View>
            <Feather
              name={orderType === option.type ? 'check-circle' : 'chevron-right'}
              size={24}
              color={orderType === option.type ? '#166534' : '#18181b'}
            />
          </TouchableOpacity>
        ))}
        <View className="mt-2 flex-row items-start gap-3 rounded-[10px] bg-amber-100 p-4">
          <Feather name="map-pin" size={20} color="#78716c" />
          <Text className="flex-1 text-base leading-5 text-stone-500">
            Layanan delivery hanya tersedia untuk wilayah Kota Cirebon. Ongkir delivery Rp 20.000.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
