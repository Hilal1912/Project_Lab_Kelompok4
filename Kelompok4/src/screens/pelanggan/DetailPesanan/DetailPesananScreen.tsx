/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getDetailPesananPelanggan, batalkanPesanan, type PesananPelanggan } from '@/lib/pelanggan-service';
import { supabase } from '@/lib/supabase';

const timelineSteps = [
  { key: 'Dalam Antrian',    label: 'Menunggu Konfirmasi' },
  { key: 'Sedang Diproses',  label: 'Sedang Disiapkan' },
  { key: 'Dalam Pengiriman', label: 'Dalam Pengiriman' },
  { key: 'Selesai',          label: 'Selesai' },
];

function getActiveStep(status: string): number {
  const idx = timelineSteps.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

export default function DetailPesananScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pesanan, setPesanan] = useState<PesananPelanggan | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDetailPesananPelanggan(id)
      .then(setPesanan)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [id]);

  const handleBatalkan = () => {
    if (!pesanan) return;
    Alert.alert('Batalkan Pesanan', 'Yakin ingin membatalkan pesanan ini?', [
      { text: 'Tidak', style: 'cancel' },
      {
        text: 'Ya, Batalkan', style: 'destructive',
        onPress: async () => {
          setCancelling(true);
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            await batalkanPesanan(pesanan.id, user.id, 'Dibatalkan oleh pelanggan');
            setPesanan({ ...pesanan, status: 'Dibatalkan', is_dibatalkan: true });
            Alert.alert('Berhasil', 'Pesanan berhasil dibatalkan.');
          } catch (e: any) {
            Alert.alert('Error', e.message ?? 'Gagal membatalkan pesanan.');
          } finally {
            setCancelling(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#FAF8F1]">
        <ActivityIndicator size="large" color="#155A3D" />
      </SafeAreaView>
    );
  }

  if (!pesanan) {
    return (
      <SafeAreaView className="flex-1 bg-[#FAF8F1]">
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Feather name="arrow-left" size={24} color="#19231F" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-gray-500">Pesanan tidak ditemukan.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const activeStep = getActiveStep(pesanan.status);
  const tanggal = pesanan.tanggal
    ? new Date(pesanan.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-';
  const bisa_dibatalkan = !pesanan.is_dibatalkan && pesanan.status === 'Dalam Antrian';

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8F1]">
      <View className="flex-row justify-between items-center px-6 py-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Feather name="arrow-left" size={24} color="#19231F" />
        </TouchableOpacity>
        <Text className="text-[#19231F] text-[22px] font-semibold">Detail Pesanan</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View className="mb-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[#19231F] text-[20px] font-semibold">{pesanan.nomor_order}</Text>
            <Text className="text-[#79828A] text-[13px]">{tanggal}</Text>
          </View>
          <View className="flex-row mb-3">
            <View className="bg-[#DFF1DE] px-2.5 py-1 rounded-lg">
              <Text className="text-[#155A3D] text-[11px] font-medium">{pesanan.status}</Text>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View className="bg-white/60 border border-[#E1E4E1] rounded-xl p-4 mb-5">
          <Text className="text-[#19231F] text-[17px] font-semibold mb-5">Alur Pesanan</Text>
          <View className="flex-col">
            {timelineSteps.map((step, index) => {
              const isActive = index === activeStep;
              const isDone = index < activeStep;
              return (
                <View key={step.key}>
                  <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center">
                      <View className={`w-6 h-6 rounded-full border justify-center items-center ${
                        isDone || isActive
                          ? 'bg-[#DFF1DE] border-[#155A3D]'
                          : 'bg-white/60 border-[#E1E4E1]'
                      }`}>
                        {isDone ? (
                          <Feather name="check" size={12} color="#155A3D" />
                        ) : isActive ? (
                          <Feather name="clock" size={12} color="#155A3D" />
                        ) : (
                          <View className="w-1.5 h-1.5 bg-[#B7BCBA] rounded-full" />
                        )}
                      </View>
                      <Text className={`text-[14px] ml-3 ${isActive ? 'text-[#155A3D] font-semibold' : isDone ? 'text-[#155A3D]' : 'text-[#79828A]'}`}>
                        {step.label}
                      </Text>
                    </View>
                    {isActive && <Text className="text-[#155A3D] text-[11px]">Saat ini</Text>}
                  </View>
                  {index < timelineSteps.length - 1 && (
                    <View className="w-[1px] h-5 bg-[#E1E4E1] ml-3 mb-1" />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Pengiriman & Pembayaran */}
        <View className="bg-white/60 border border-[#E1E4E1] rounded-xl p-4 mb-5">
          <Text className="text-[#19231F] text-[17px] font-semibold mb-4">Pengiriman & Pembayaran</Text>
          <View className="flex-row justify-between mb-3">
            <Text className="text-[#19231F] text-[14px]">Jenis order</Text>
            <Text className="text-[#19231F] text-[14px]">{pesanan.jenis_order}</Text>
          </View>
          {pesanan.alamat && (
            <View className="bg-[#F3F6EE] border border-[#E1E4E1] rounded-lg p-3 flex-row items-start mb-4">
              <Feather name="map-pin" size={16} color="#155A3D" />
              <Text className="flex-1 ml-2.5 text-[#79828A] text-[13px] leading-5">{pesanan.alamat}</Text>
            </View>
          )}
          <View className="h-[1px] bg-[#E1E4E1] w-full mb-3" />
          <View className="flex-row justify-between mb-1">
            <Text className="text-[#19231F] text-[14px]">Pembayaran</Text>
            <Text className="text-[#19231F] text-[14px]">{pesanan.metode_bayar ?? '-'}</Text>
          </View>
        </View>

        {/* Rincian Pesanan */}
        <View className="bg-white/60 border border-[#E1E4E1] rounded-xl p-4 mb-6">
          <Text className="text-[#19231F] text-[17px] font-semibold mb-4">Rincian Pesanan</Text>
          {pesanan.pesanan_items.map((item) => (
            <View key={item.id} className="flex-row items-center mb-2">
              <Text className="text-[#79828A] text-[13px] w-6">{item.qty}×</Text>
              <Text className="flex-1 text-[#19231F] text-[13px]">{item.nama_menu}</Text>
              <Text className="text-[#19231F] text-[13px]">
                Rp {(item.harga * item.qty).toLocaleString('id-ID')}
              </Text>
            </View>
          ))}
          <View className="h-[1px] bg-[#E1E4E1] w-full my-3" />
          <View className="flex-row justify-between mb-2">
            <Text className="text-[#19231F] text-[14px]">Subtotal</Text>
            <Text className="text-[#19231F] text-[14px]">
              Rp {(pesanan.subtotal ?? 0).toLocaleString('id-ID')}
            </Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-[#19231F] text-[14px]">Ongkir</Text>
            <Text className="text-[#19231F] text-[14px]">
              Rp {(pesanan.ongkir ?? 0).toLocaleString('id-ID')}
            </Text>
          </View>
          <View className="h-[1px] bg-[#E1E4E1] w-full mb-3" />
          <View className="flex-row justify-between items-center">
            <Text className="text-[#19231F] text-[17px] font-semibold">Total</Text>
            <Text className="text-[#155A3D] text-[20px] font-semibold">
              Rp {pesanan.total.toLocaleString('id-ID')}
            </Text>
          </View>
        </View>

        {/* Tombol aksi */}
        {bisa_dibatalkan && (
          <TouchableOpacity
            className="w-full h-[52px] bg-red-50 border border-red-200 rounded-lg justify-center items-center mb-4"
            onPress={handleBatalkan}
            disabled={cancelling}>
            {cancelling
              ? <ActivityIndicator color="#991B1B" />
              : <Text className="text-red-700 text-[15px] font-semibold">Batalkan Pesanan</Text>
            }
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="w-full h-[60px] bg-white/70 border border-[#E1E4E1] rounded-lg justify-center items-center mb-8"
          onPress={() => router.push('/orders')}>
          <Text className="text-[#155A3D] text-[17px] font-semibold">Kembali ke Daftar Pesanan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
