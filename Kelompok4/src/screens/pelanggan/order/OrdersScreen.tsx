/* eslint-disable react-hooks/set-state-in-effect */
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomerTabBar from '@/components/CustomerTabBar';
import { supabase } from '@/lib/supabase';
import { getPesananPelanggan, type PesananPelanggan } from '@/lib/pelanggan-service';

const statusColor: Record<string, { bg: string; text: string }> = {
  'Dalam Antrian':   { bg: '#FFF0CA', text: '#B5751D' },
  'Sedang Diproses': { bg: '#FFF0CA', text: '#B5751D' },
  'Dalam Pengiriman':{ bg: '#DFF1DE', text: '#155A3D' },
  'Siap Diambil':    { bg: '#DFF1DE', text: '#155A3D' },
  'Selesai':         { bg: '#F1F5F9', text: '#475569' },
  'Dibatalkan':      { bg: '#FEE2E2', text: '#991B1B' },
};

export default function OrdersScreen() {
  const router = useRouter();
  const [pesanan, setPesanan] = useState<PesananPelanggan[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !active) return;
        const data = await getPesananPelanggan(user.id);
        if (active) {
          setPesanan(data);
          setLoading(false);
        }
      };
      load().catch(() => setLoading(false));
      return () => { active = false; };
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <View className="flex-row items-center px-6 py-4">
        <Text className="flex-1 text-xl font-semibold text-zinc-900">Pesanan Saya</Text>
        <TouchableOpacity accessibilityLabel="Buka keranjang" onPress={() => router.push('/cart')}>
          <Feather name="shopping-cart" size={22} color="#166534" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#166534" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 24 }}>
          {pesanan.length === 0 ? (
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
            pesanan.map((order) => {
              const badge = statusColor[order.status] ?? { bg: '#F1F5F9', text: '#475569' };
              const tanggal = order.tanggal
                ? new Date(order.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                : '-';
              return (
                <TouchableOpacity
                  key={order.id}
                  className="mb-4 rounded-xl border border-neutral-200 bg-white/70 p-4"
                  onPress={() => router.push({ pathname: '/detail-pesanan', params: { id: order.id } })}>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="font-semibold text-zinc-900">{order.nomor_order}</Text>
                    <Text className="text-xs text-gray-500">{tanggal}</Text>
                  </View>
                  {order.pesanan_items.slice(0, 2).map((item) => (
                    <Text key={item.id} className="mb-1 text-sm text-gray-600">
                      {item.qty}× {item.nama_menu}
                    </Text>
                  ))}
                  {order.pesanan_items.length > 2 && (
                    <Text className="mb-1 text-sm text-gray-400">
                      +{order.pesanan_items.length - 2} item lainnya
                    </Text>
                  )}
                  <View className="mt-3 flex-row items-center justify-between border-t border-neutral-200 pt-3">
                    <View style={{ backgroundColor: badge.bg }} className="rounded-full px-2.5 py-1">
                      <Text style={{ color: badge.text }} className="text-xs font-medium">{order.status}</Text>
                    </View>
                    <Text className="font-semibold text-green-800">
                      Rp {order.total.toLocaleString('id-ID')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
      <CustomerTabBar />
    </SafeAreaView>
  );
}
