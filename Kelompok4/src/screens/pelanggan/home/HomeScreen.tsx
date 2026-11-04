/* eslint-disable react-hooks/set-state-in-effect */
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomerTabBar from '@/components/CustomerTabBar';
import { useCart } from '@/context/cart-context';
import { getMenuTersedia } from '@/lib/pelanggan-service';
import type { DbMenu } from '@/lib/supabase-types';
import { useAuth } from '@/context/auth-context';

export default function HomeScreen() {
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [menu, setMenu] = useState<DbMenu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenuTersedia()
      .then((data) => setMenu(data))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const recommended = menu.slice(0, 2);

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-6 pt-3"
        contentContainerStyle={{ paddingBottom: 20 }}>

        {/* Header */}
        <View className="mb-5 flex-row items-center justify-between">
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={() => router.push('/menu')}>
            <Feather name="map-pin" size={20} color="#166534" />
            <Text className="text-lg font-semibold text-black">Kota Cirebon</Text>
            <Feather name="chevron-down" size={20} color="#166534" />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Buka pesanan" onPress={() => router.push('/orders')}>
            <Feather name="bell" size={20} color="#18181b" />
          </TouchableOpacity>
        </View>

        {/* Sapaan */}
        {user?.nama ? (
          <Text className="mb-3 text-sm text-gray-600">Halo, {user.nama} 👋</Text>
        ) : null}

        {/* Search */}
        <TouchableOpacity
          className="mb-6 h-12 flex-row items-center rounded-lg border border-neutral-200 bg-white/70 px-4"
          onPress={() => router.push('/menu')}>
          <Feather name="search" size={20} color="#6b7280" />
          <TextInput
            editable={false}
            className="ml-2.5 flex-1 text-base text-zinc-900"
            placeholder="Cari menu, kategori, atau makanan..."
            placeholderTextColor="#6b7280"
          />
        </TouchableOpacity>

        {/* Banner */}
        <TouchableOpacity
          className="relative mb-6 h-44 justify-center overflow-hidden rounded-2xl bg-green-950 p-5"
          onPress={() => router.push('/menu')}>
          <Image
            source={require('../../../../assets/images/logo/home.png')}
            className="absolute right-0 top-0 h-full w-40 opacity-50"
            resizeMode="cover"
          />
          <Text className="mb-1 text-2xl font-bold text-white">Nasi Bakar Ibu Efri</Text>
          <Text className="mb-3 text-lg font-semibold leading-6 text-white">
            Rasa Tradisional{'\n'}Harga Bersahabat
          </Text>
          <View className="mt-2 flex-row gap-1.5">
            <View className="h-1.5 w-1.5 rounded-full bg-lime-50" />
            <View className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
            <View className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
          </View>
        </TouchableOpacity>

        {/* Kategori */}
        <View className="mb-8 flex-row justify-between">
          {[
            { label: 'Semua',     icon: 'grid' as const },
            { label: 'Nasi Bakar', icon: 'box' as const },
            { label: 'Minuman',   icon: 'coffee' as const },
            { label: 'Tambahan',  icon: 'plus-circle' as const },
          ].map((category) => (
            <TouchableOpacity
              key={category.label}
              className="items-center gap-2"
              onPress={() => router.push('/menu')}>
              <View className="h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <Feather name={category.icon} size={24} color="#166534" />
              </View>
              <Text className="text-xs font-medium text-black">{category.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rekomendasi */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-base font-semibold text-black">Rekomendasi untuk Kamu</Text>
          <TouchableOpacity onPress={() => router.push('/menu')}>
            <Text className="text-sm font-medium text-green-800">Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#166534" />
        ) : (
          <View className="flex-row gap-4 pb-4">
            {recommended.map((item) => (
              <View key={item.id} className="flex-1 gap-3">
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Lihat detail ${item.nama}`}
                  className="flex-col gap-3"
                  onPress={() => router.push({ pathname: '/detail-menu', params: { id: item.id } })}>
                  {item.gambar ? (
                    <Image
                      source={{ uri: item.gambar }}
                      className="h-36 w-full rounded-xl"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-36 w-full rounded-xl bg-amber-100" />
                  )}
                  <View>
                    <Text className="mb-1 text-base text-zinc-900">{item.nama}</Text>
                    <Text className="text-base font-semibold text-zinc-900">
                      Rp {item.harga.toLocaleString('id-ID')}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Tambah ${item.nama} ke keranjang`}
                  className="items-center rounded-lg bg-green-800 py-2"
                  onPress={() => addItem({
                    id: item.id,
                    name: item.nama,
                    price: item.harga,
                    category: item.kategori === 'Minuman' ? 'Minuman' : 'Nasi Bakar',
                    image: { uri: item.gambar ?? '' },
                  })}>
                  <Text className="font-semibold text-white">Tambah</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <CustomerTabBar />
    </SafeAreaView>
  );
}
