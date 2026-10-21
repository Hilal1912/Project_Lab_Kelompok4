import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomerTabBar from '@/components/CustomerTabBar';
import { useCart, type Product } from '@/context/cart-context';

type Category = 'Semua' | Product['category'];

const categories: Category[] = ['Semua', 'Nasi Bakar', 'Minuman', 'Tambahan'];

export default function DaftarMenuScreen() {
  const router = useRouter();
  const { products, addItem, itemCount } = useCart();
  const [category, setCategory] = useState<Category>('Semua');
  const [query, setQuery] = useState('');
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === 'Semua' || product.category === category) &&
          product.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [category, products, query],
  );

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <View className="h-16 flex-row items-center gap-4 px-6">
        <TouchableOpacity
          accessibilityLabel="Kembali ke beranda"
          className="h-8 w-8 justify-center"
          onPress={() => router.push('/home')}>
          <Feather name="arrow-left" size={24} color="#18181b" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-semibold text-zinc-900">Semua Menu</Text>
        <TouchableOpacity
          accessibilityLabel={`Buka keranjang, ${itemCount} item`}
          onPress={() => router.push('/cart')}>
          <Feather name="shopping-cart" size={22} color="#166534" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 pt-3"
        contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mx-6 mb-5 h-12 flex-row items-center rounded-lg border border-neutral-200 bg-white/70 px-4">
          <Feather name="search" size={20} color="#6b7280" />
          <TextInput
            className="ml-2.5 flex-1 text-base text-zinc-900"
            placeholder="Cari menu..."
            placeholderTextColor="#6b7280"
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6 px-6">
          <View className="flex-row gap-2">
            {categories.map((item) => {
              const selected = category === item;
              return (
                <TouchableOpacity
                  key={item}
                  className={`rounded-md px-4 py-3 ${selected ? 'bg-green-800' : 'border border-neutral-200 bg-white/60'}`}
                  onPress={() => setCategory(item)}>
                  <Text className={`text-xs font-medium ${selected ? 'text-white' : 'text-gray-600'}`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View className="flex-col px-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <View
                key={product.id}
                className="flex-row items-center gap-4 border-b border-neutral-200 py-3">
                <Image
                  source={product.image}
                  className="h-24 w-24 rounded-[10px]"
                  resizeMode="cover"
                />
                <View className="flex-1 flex-col gap-1.5">
                  <Text className="text-base leading-6 text-zinc-900">{product.name}</Text>
                  <Text className="text-base font-medium leading-5 text-zinc-900">
                    Rp {product.price.toLocaleString('id-ID')}
                  </Text>
                  <View className="flex-row">
                    <View className="rounded-[10px] bg-green-100 px-2 py-1">
                      <Text className="text-[10px] font-medium text-green-800">Tersedia</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  accessibilityLabel={`Tambah ${product.name} ke keranjang`}
                  className="rounded-lg bg-green-800 p-2"
                  onPress={() => addItem(product)}>
                  <Feather name="plus" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text className="py-10 text-center text-base text-gray-500">Menu tidak ditemukan.</Text>
          )}
        </View>
      </ScrollView>
      <CustomerTabBar />
    </SafeAreaView>
  );
}
