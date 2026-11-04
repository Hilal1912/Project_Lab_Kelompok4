/* eslint-disable react-hooks/set-state-in-effect */
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomerTabBar from '@/components/CustomerTabBar';
import { useCart } from '@/context/cart-context';
import { getMenuTersedia } from '@/lib/pelanggan-service';
import type { DbMenu } from '@/lib/supabase-types';

type Category = 'Semua' | 'Nasi Bakar' | 'Minuman' | 'Tambahan';
const categories: Category[] = ['Semua', 'Nasi Bakar', 'Minuman', 'Tambahan'];

export default function DaftarMenuScreen() {
  const router = useRouter();
  const { addItem, itemCount } = useCart();
  const [menu, setMenu] = useState<DbMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category>('Semua');
  const [query, setQuery] = useState('');

  useEffect(() => {
    getMenuTersedia()
      .then(setMenu)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    menu.filter((item) =>
      (category === 'Semua' || item.kategori === category) &&
      item.nama.toLowerCase().includes(query.trim().toLowerCase()),
    ),
  [menu, category, query]);

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
        {/* Search */}
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

        {/* Kategori */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 px-6">
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

        {loading ? (
          <ActivityIndicator color="#166534" size="large" style={{ marginTop: 40 }} />
        ) : (
          <View className="flex-col px-6">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <View key={item.id} className="flex-row items-center gap-4 border-b border-neutral-200 py-3">
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Lihat detail ${item.nama}`}
                    className="flex-1 flex-row items-center gap-4"
                    onPress={() => router.push({ pathname: '/detail-menu', params: { id: item.id } })}>
                    {item.gambar ? (
                      <Image source={{ uri: item.gambar }} className="h-24 w-24 rounded-[10px]" resizeMode="cover" />
                    ) : (
                      <View className="h-24 w-24 rounded-[10px] bg-amber-100" />
                    )}
                    <View className="flex-1 flex-col gap-1.5">
                      <Text className="text-base leading-6 text-zinc-900">{item.nama}</Text>
                      <Text className="text-base font-medium leading-5 text-zinc-900">
                        Rp {item.harga.toLocaleString('id-ID')}
                      </Text>
                      <View className="flex-row">
                        <View className="rounded-[10px] bg-green-100 px-2 py-1">
                          <Text className="text-[10px] font-medium text-green-800">Tersedia</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    accessibilityLabel={`Tambah ${item.nama} ke keranjang`}
                    className="rounded-lg bg-green-800 p-2"
                    onPress={() => addItem({
                      id: item.id,
                      name: item.nama,
                      price: item.harga,
                      category: item.kategori === 'Minuman' ? 'Minuman' : 'Nasi Bakar',
                      image: { uri: item.gambar ?? '' },
                    })}>
                    <Feather name="plus" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text className="py-10 text-center text-base text-gray-500">Menu tidak ditemukan.</Text>
            )}
          </View>
        )}
      </ScrollView>
      <CustomerTabBar />
    </SafeAreaView>
  );
}
