import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomerTabBar from '@/components/CustomerTabBar';
import { useCart } from '@/context/cart-context';

export default function KeranjangScreen() {
  const router = useRouter();
  const { items, subtotal, note, setNote, updateQuantity, removeItem } = useCart();

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <View className="h-16 flex-row items-center gap-4 px-6">
        <TouchableOpacity
          accessibilityLabel="Kembali ke menu"
          className="h-8 w-8 justify-center"
          onPress={() => router.push('/menu')}>
          <Feather name="arrow-left" size={24} color="#18181b" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-zinc-900">Keranjang</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 pt-3"
        contentContainerStyle={{ paddingBottom: 24 }}>
        {items.length === 0 ? (
          <View className="items-center rounded-xl border border-neutral-200 bg-white/70 px-6 py-12">
            <Feather name="shopping-cart" size={36} color="#6b7280" />
            <Text className="mt-4 text-base font-semibold text-zinc-900">Keranjang masih kosong</Text>
            <TouchableOpacity
              className="mt-6 rounded-lg bg-green-800 px-6 py-3"
              onPress={() => router.push('/menu')}>
              <Text className="font-semibold text-white">Pilih Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {items.map((item) => (
              <View
                key={item.id}
                className="flex-row items-start gap-4 border-b border-neutral-200 py-3">
                <Image
                  source={item.image}
                  className="h-24 w-24 rounded-[10px]"
                  resizeMode="cover"
                />
                <View className="flex-1 flex-col gap-2">
                  <Text className="text-base leading-6 text-zinc-900">{item.name}</Text>
                  <Text className="text-base text-zinc-900">
                    Rp {item.price.toLocaleString('id-ID')}
                  </Text>
                  <View className="mt-1 flex-row items-center gap-4">
                    <TouchableOpacity
                      accessibilityLabel={`Kurangi ${item.name}`}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Feather name="minus" size={18} color="#18181b" />
                    </TouchableOpacity>
                    <Text className="text-base text-black">{item.quantity}</Text>
                    <TouchableOpacity
                      accessibilityLabel={`Tambah ${item.name}`}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Feather name="plus" size={18} color="#18181b" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  accessibilityLabel={`Hapus ${item.name}`}
                  className="pt-1"
                  onPress={() => removeItem(item.id)}>
                  <Feather name="trash-2" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            ))}

            <Text className="mb-3 mt-5 text-base leading-6 text-zinc-900">Catatan pesanan</Text>
            <TextInput
              className="min-h-16 w-full rounded-xl border border-neutral-200 bg-white/60 p-4 text-sm text-zinc-900"
              placeholder="Contoh: tidak pedas, minta sambal terpisah."
              placeholderTextColor="#6b7280"
              value={note}
              onChangeText={setNote}
              multiline
              textAlignVertical="top"
            />

            <View className="mt-6 flex-col gap-4">
              <View className="flex-row justify-between">
                <Text className="text-base text-zinc-900">Subtotal</Text>
                <Text className="text-base text-zinc-900">Rp {subtotal.toLocaleString('id-ID')}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-base text-zinc-900">Ongkir</Text>
                <Text className="text-base text-zinc-900">Ditentukan dari jenis order</Text>
              </View>
              <View className="mt-1 flex-row justify-between">
                <Text className="text-base font-semibold text-zinc-900">Total sementara</Text>
                <Text className="text-xl font-semibold text-green-800">
                  Rp {subtotal.toLocaleString('id-ID')}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="mt-8 h-14 w-full items-center justify-center rounded-lg bg-green-800 active:bg-green-900"
              onPress={() => router.push('/order-type')}>
              <Text className="text-lg font-semibold text-white">Lanjut ke Jenis Order</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <CustomerTabBar />
    </SafeAreaView>
  );
}
