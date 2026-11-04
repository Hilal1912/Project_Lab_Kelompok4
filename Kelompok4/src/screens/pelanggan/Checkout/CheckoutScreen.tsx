/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/cart-context';
import { supabase } from '@/lib/supabase';
import { buatPesanan, getAlamatDefault } from '@/lib/pelanggan-service';
import type { DbAlamat } from '@/lib/supabase-types';

const ONGKIR_DELIVERY = 5000;

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, subtotal, note, orderType, placeOrder } = useCart();

  const [alamat, setAlamat] = useState<DbAlamat | null>(null);
  const [metodeBayar, setMetodeBayar] = useState<string | null>(null);
  const [catatan, setCatatan] = useState(note);
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDelivery = orderType === 'Delivery';
  const ongkir = isDelivery ? ONGKIR_DELIVERY : 0;
  const total = subtotal + ongkir;

  // Ambil alamat default pelanggan
  useEffect(() => {
    if (!isDelivery) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      getAlamatDefault(user.id).then(setAlamat).catch(() => null);
    });
  }, [isDelivery]);

  const handleBuatPesanan = () => {
    setIsSubmitAttempted(true);
    if (isDelivery && !alamat) return;
    if (!metodeBayar) return;
    setShowConfirmModal(true);
  };

  const handleKonfirmasi = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sesi tidak ditemukan.');

      const alamatTeks = alamat
        ? `${alamat.nama_penerima} · ${alamat.alamat_lengkap}, ${alamat.kecamatan}, ${alamat.kota}`
        : null;

      await buatPesanan({
        userId: user.id,
        alamatId: alamat?.id ?? null,
        alamatTeks,
        jenisOrder: (orderType as 'Dine-in' | 'Take Away' | 'Delivery') ?? 'Dine-in',
        metodeBayar: metodeBayar!,
        catatan,
        items: items.map((item) => ({
          menuId: item.id,
          namMenu: item.name,
          harga: item.price,
          qty: item.quantity,
        })),
        subtotal,
        ongkir,
      });

      // Kosongkan cart
      placeOrder(metodeBayar!);
      router.replace('/pesanan-berhasil');
    } catch (e: any) {
      Alert.alert('Gagal', e.message ?? 'Terjadi kesalahan saat membuat pesanan.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#FAF8F1] px-6">
        <Feather name="shopping-cart" size={40} color="#79828A" />
        <Text className="mt-4 text-base font-semibold text-[#19231F]">Keranjang kosong</Text>
        <TouchableOpacity className="mt-4 rounded-lg bg-[#155A3D] px-6 py-3" onPress={() => router.push('/menu')}>
          <Text className="font-semibold text-white">Lihat Menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8F1]">
      <View className="flex-row justify-between items-center px-6 py-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Feather name="arrow-left" size={24} color="#19231F" />
        </TouchableOpacity>
        <Text className="text-[#19231F] text-[22px] font-semibold">Checkout</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        {/* Validasi error banner */}
        {isSubmitAttempted && ((!alamat && isDelivery) || !metodeBayar) && (
          <View className="bg-[#FBECEE] rounded-lg p-3 flex-row items-start mb-4">
            <Feather name="alert-circle" size={18} color="#CB4E57" />
            <View className="flex-1 ml-2">
              <Text className="text-[#CB4E57] text-[14px] font-semibold">Lengkapi data pesanan</Text>
              <Text className="text-[#79828A] text-[12px] mt-1 leading-4">
                {!alamat && isDelivery ? 'Pilih alamat dan ' : ''}
                {!metodeBayar ? 'pilih metode pembayaran.' : ''}
              </Text>
            </View>
          </View>
        )}

        <View className="bg-white/50 border border-[#E1E4E1] rounded-xl p-4 mb-6">
          {/* Detail pesanan */}
          <Text className="text-[#19231F] text-[17px] font-semibold mb-3">Detail Pesanan</Text>
          {items.map((item) => (
            <View key={item.id} className="flex-row items-center mb-2">
              <Text className="text-[#79828A] text-[13px] w-6">{item.quantity}×</Text>
              <Text className="flex-1 text-[#19231F] text-[13px]">{item.name}</Text>
              <Text className="text-[#19231F] text-[13px]">
                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
              </Text>
            </View>
          ))}
          <View className="h-[1px] bg-[#E1E4E1] w-full my-3" />
          <View className="flex-row justify-between mb-2">
            <Text className="text-[#19231F] text-[14px]">Subtotal</Text>
            <Text className="text-[#19231F] text-[14px]">Rp {subtotal.toLocaleString('id-ID')}</Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-[#19231F] text-[14px]">Ongkir</Text>
            <Text className="text-[#19231F] text-[14px]">Rp {ongkir.toLocaleString('id-ID')}</Text>
          </View>

          {/* Jenis Order */}
          <Text className="text-[#19231F] text-[15px] font-semibold mb-3">Jenis Order</Text>
          <View className="flex-row items-center mb-4">
            <Feather name={isDelivery ? 'truck' : 'shopping-bag'} size={20} color="#155A3D" />
            <Text className="text-[#19231F] text-[16px] ml-3">{orderType ?? 'Dine-in'}</Text>
          </View>

          {/* Alamat (hanya delivery) */}
          {isDelivery && (
            <View className="mb-4">
              <Text className="text-[#19231F] text-[15px] font-semibold mb-2">Alamat Pengiriman</Text>
              <TouchableOpacity
                onPress={() => router.push('/alamat-tersimpan' as any)}
                className={`min-h-[48px] rounded-lg p-3 flex-row items-center border ${
                  isSubmitAttempted && !alamat ? 'border-[#CB4E57]' : alamat ? 'bg-[#F3F6EE] border-[#E1E4E1]' : 'bg-white/70 border-[#E1E4E1]'
                }`}>
                <Feather name="map-pin" size={18} color="#155A3D" />
                <View className="flex-1 ml-3">
                  {alamat ? (
                    <>
                      <Text className="text-[#19231F] text-[14px] font-semibold">{alamat.nama_penerima}</Text>
                      <Text className="text-[#79828A] text-[13px] leading-5 mt-1">
                        {alamat.alamat_lengkap}, {alamat.kecamatan}, {alamat.kota}
                      </Text>
                    </>
                  ) : (
                    <Text className="text-[#79828A] text-[14px]">Pilih alamat pengiriman</Text>
                  )}
                </View>
                <Feather name="chevron-right" size={18} color="#79828A" />
              </TouchableOpacity>
              {isSubmitAttempted && !alamat && (
                <Text className="text-[#CB4E57] text-[12px] mt-1.5">Pilih alamat pengiriman</Text>
              )}
            </View>
          )}

          {/* Catatan */}
          <View className="mb-4">
            <Text className="text-[#19231F] text-[15px] mb-2">Catatan untuk Kurir (opsional)</Text>
            <TextInput
              className="w-full min-h-[64px] bg-white/70 border border-[#E1E4E1] rounded-lg p-3 text-[13px]"
              placeholder="Contoh: depan warung, pintu warna biru."
              placeholderTextColor="#79828A"
              multiline
              textAlignVertical="top"
              value={catatan}
              onChangeText={setCatatan}
            />
          </View>

          {/* Metode Pembayaran */}
          <View className="mb-3">
            <Text className="text-[#19231F] text-[15px] font-semibold mb-2">Metode Pembayaran</Text>
            <View className={`border rounded-lg p-2.5 ${isSubmitAttempted && !metodeBayar ? 'border-[#CB4E57]' : 'border-[#E1E4E1] bg-white/50'}`}>
              <View className="flex-row justify-between">
                {['Cash', 'Transfer Bank', 'QRIS'].map((method) => (
                  <TouchableOpacity
                    key={method}
                    onPress={() => setMetodeBayar(method)}
                    className="flex-row items-center gap-1">
                    <View className={`w-4 h-4 rounded-full border items-center justify-center ${metodeBayar === method ? 'border-[#155A3D]' : 'border-[#79828A]'}`}>
                      {metodeBayar === method && <View className="w-2 h-2 rounded-full bg-[#155A3D]" />}
                    </View>
                    <Text className="text-[#79828A] text-[12px] ml-1">{method}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {isSubmitAttempted && !metodeBayar && (
              <Text className="text-[#CB4E57] text-[12px] mt-1.5">Pilih metode pembayaran</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="px-6 py-4 bg-[#FAF8F1] border-t border-[#E1E4E1]/50">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-[#19231F] text-[17px] font-semibold">Total</Text>
          <Text className="text-[#155A3D] text-[20px] font-semibold">
            Rp {total.toLocaleString('id-ID')}
          </Text>
        </View>
        <TouchableOpacity
          className="w-full h-[60px] bg-[#155A3D] rounded-lg justify-center items-center"
          onPress={handleBuatPesanan}
          disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text className="text-white text-[17px] font-semibold">Buat Pesanan</Text>
          }
        </TouchableOpacity>
      </View>

      {/* Modal Konfirmasi */}
      <Modal transparent visible={showConfirmModal} animationType="fade">
        <View className="flex-1 bg-[#08130D]/40 justify-center items-center px-6">
          <View className="w-full bg-[#FAF8F1] rounded-xl p-5 border border-[#E1E4E1]">
            <View className="w-11 h-11 bg-[#DFF1DE] rounded-xl border border-[#155A3D]/20 justify-center items-center mb-4">
              <Feather name="check-square" size={24} color="#155A3D" />
            </View>
            <Text className="text-[#19231F] text-[20px] font-semibold mb-1">Buat pesanan sekarang?</Text>
            <Text className="text-[#79828A] text-[13px] leading-5 mb-5">
              Pastikan rincian pesanan sudah benar.
            </Text>
            {items.map((item) => (
              <View key={item.id} className="flex-row mb-1">
                <Text className="text-[#79828A] text-[13px] w-6">{item.quantity}×</Text>
                <Text className="flex-1 text-[#19231F] text-[13px]">{item.name}</Text>
                <Text className="text-[#19231F] text-[13px]">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</Text>
              </View>
            ))}
            <View className="h-[1px] bg-[#E1E4E1] w-full my-3" />
            <View className="flex-row justify-between mb-1">
              <Text className="text-[#19231F] text-[14px]">Jenis order</Text>
              <Text className="text-[#19231F] text-[14px]">{orderType}</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-[#19231F] text-[14px]">Pembayaran</Text>
              <Text className="text-[#19231F] text-[14px]">{metodeBayar}</Text>
            </View>
            <View className="h-[1px] bg-[#E1E4E1] w-full my-3" />
            <View className="flex-row justify-between mb-4">
              <Text className="text-[#19231F] text-[17px] font-semibold">Total</Text>
              <Text className="text-[#155A3D] text-[20px] font-semibold">Rp {total.toLocaleString('id-ID')}</Text>
            </View>
            <TouchableOpacity
              className="w-full h-12 bg-[#155A3D] rounded-lg justify-center items-center mb-3"
              onPress={handleKonfirmasi}>
              <Text className="text-white text-[15px] font-semibold">Ya, Buat Pesanan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full h-12 bg-white/70 border border-[#E1E4E1] rounded-lg justify-center items-center"
              onPress={() => setShowConfirmModal(false)}>
              <Text className="text-[#155A3D] text-[15px] font-semibold">Kembali</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
