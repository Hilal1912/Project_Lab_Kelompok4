import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '@/context/cart-context';

const paymentMethods = ['Cash', 'Transfer Bank', 'QRIS'];

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, orderType, subtotal, note, placeOrder } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const deliveryFee = orderType === 'Delivery' ? 20000 : 0;
  const total = subtotal + deliveryFee;

  const submitOrder = () => {
    const order = placeOrder(paymentMethod);
    if (!order) {
      router.replace('/menu');
      return;
    }
    router.replace('/orders');
  };

  if (items.length === 0 || orderType === null) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-orange-50 px-6">
        <Feather name="shopping-cart" size={36} color="#6b7280" />
        <Text className="mt-4 text-center text-base text-zinc-900">
          Keranjang kosong atau jenis order belum dipilih.
        </Text>
        <TouchableOpacity
          className="mt-6 rounded-lg bg-green-800 px-6 py-3"
          onPress={() => router.replace('/menu')}>
          <Text className="font-semibold text-white">Pilih Menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <View className="h-16 flex-row items-center gap-4 px-6">
        <TouchableOpacity
          accessibilityLabel="Kembali ke jenis order"
          className="h-8 w-8 justify-center"
          onPress={() => router.push('/order-type')}>
          <Feather name="arrow-left" size={24} color="#18181b" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-zinc-900">Checkout</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 pt-3"
        contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="flex-col gap-4 rounded-xl border border-neutral-200 bg-white/60 p-4">
          <Text className="text-base font-semibold text-zinc-900">Detail Pesanan</Text>
          {items.map((item) => (
            <View key={item.id} className="flex-row justify-between gap-4">
              <Text className="flex-1 text-sm text-gray-600">
                {item.name} x{item.quantity}
              </Text>
              <Text className="text-sm text-gray-600">
                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
              </Text>
            </View>
          ))}
          {note ? (
            <Text className="text-sm text-gray-600">Catatan: {note}</Text>
          ) : null}

          <View className="flex-col gap-2.5 border-b border-t border-neutral-200 py-4">
            <View className="flex-row justify-between">
              <Text className="text-sm text-black">Subtotal</Text>
              <Text className="text-sm text-green-800">Rp {subtotal.toLocaleString('id-ID')}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-black">Ongkir</Text>
              <Text className="text-sm text-green-800">Rp {deliveryFee.toLocaleString('id-ID')}</Text>
            </View>
          </View>

          <Text className="text-base font-semibold text-zinc-900">Jenis Order</Text>
          <TouchableOpacity
            className="flex-row items-center gap-3"
            onPress={() => router.push('/order-type')}>
            <Feather
              name={orderType === 'Delivery' ? 'truck' : orderType === 'Dine-in' ? 'coffee' : 'shopping-bag'}
              size={20}
              color="#166534"
            />
            <Text className="flex-1 text-base text-black">{orderType}</Text>
            <Text className="rounded-[10px] bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              Ubah
            </Text>
          </TouchableOpacity>

          {orderType === 'Delivery' ? (
            <>
              <Text className="mt-2 text-base font-semibold text-zinc-900">Alamat Pengiriman</Text>
              <View className="flex-row items-start gap-3 rounded-lg bg-stone-100 p-3.5">
                <Feather name="map-pin" size={18} color="#166534" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-zinc-900">Rumah</Text>
                  <Text className="text-xs leading-4 text-gray-500">
                    Jl. Melati No. 12, Kec. Harjamukti, Kota Cirebon
                  </Text>
                </View>
              </View>
              <TextInput
                className="min-h-14 rounded-md border border-neutral-200 bg-white p-3 text-sm text-zinc-900"
                placeholder="Catatan untuk kurir (opsional)"
                placeholderTextColor="#6b7280"
                multiline
                textAlignVertical="top"
              />
            </>
          ) : null}

          <Text className="mt-2 text-base font-semibold text-zinc-900">Metode Pembayaran</Text>
          <View className="flex-row justify-between">
            {paymentMethods.map((method) => {
              const selected = paymentMethod === method;
              return (
                <TouchableOpacity
                  key={method}
                  className="flex-row items-center gap-1.5"
                  onPress={() => setPaymentMethod(method)}>
                  <Feather
                    name={selected ? 'check-circle' : 'circle'}
                    size={16}
                    color={selected ? '#166534' : '#6b7280'}
                  />
                  <Text className={`text-xs ${selected ? 'font-medium text-green-800' : 'text-gray-500'}`}>
                    {method}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-base text-black">Total</Text>
            <Text className="text-lg font-semibold text-green-800">
              Rp {total.toLocaleString('id-ID')}
            </Text>
          </View>
          <TouchableOpacity
            className="mt-2 h-14 w-full items-center justify-center rounded-lg bg-green-800 active:bg-green-900"
            onPress={submitOrder}>
            <Text className="text-lg font-semibold text-white">Buat Pesanan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
