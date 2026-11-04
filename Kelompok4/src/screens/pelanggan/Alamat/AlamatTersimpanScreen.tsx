import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { getCurrentCustomerProfile } from '@/lib/customer-profile';
import { supabase } from '@/lib/supabase';

interface CustomerAddress {
  id: string;
  label: string;
  label_custom: string | null;
  nama_penerima: string;
  no_hp: string;
  alamat_lengkap: string;
  kecamatan_kota: string;
  patokan: string | null;
  is_utama: boolean;
}

export default function AlamatTersimpanScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadAddresses = async () => {
        setIsLoading(true);
        try {
          const profile = await getCurrentCustomerProfile();
          const { data, error } = await supabase
            .from('alamat')
            .select('id, label, label_custom, nama_penerima, no_hp, alamat_lengkap, kecamatan_kota, patokan, is_utama')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          if (isActive) setAddresses(data ?? []);
        } catch (error) {
          console.error('Failed to load customer addresses:', error);
          if (isActive) {
            Alert.alert(
              'Gagal memuat alamat',
              error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat alamat.'
            );
          }
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      void loadAddresses();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleSetPrimary = async (address: CustomerAddress) => {
    try {
      const profile = await getCurrentCustomerProfile();
      const { data, error } = await supabase
        .from('alamat')
        .update({ is_utama: true })
        .eq('id', address.id)
        .eq('user_id', profile.id)
        .select('id')
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Alamat tidak ditemukan atau tidak dapat diperbarui.');
      setAddresses((current) =>
        current.map((item) => ({ ...item, is_utama: item.id === address.id }))
      );
    } catch (error) {
      console.error('Failed to set primary customer address:', error);
      Alert.alert(
        'Gagal mengganti alamat utama',
        error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui alamat.'
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedAddress || isDeleting) return;

    setIsDeleting(true);
    try {
      const profile = await getCurrentCustomerProfile();
      const { data, error } = await supabase
        .from('alamat')
        .delete()
        .eq('id', selectedAddress.id)
        .eq('user_id', profile.id)
        .select('id')
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Alamat tidak ditemukan atau tidak dapat dihapus.');

      setAddresses((current) => current.filter((item) => item.id !== selectedAddress.id));
      setSelectedAddress(null);
    } catch (error) {
      console.error('Failed to delete customer address:', error);
      Alert.alert(
        'Gagal menghapus alamat',
        error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus alamat.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8F1]">
      <View className="flex-row items-center px-6 py-4 gap-4">
        <TouchableOpacity onPress={() => router.back()} className="p-1 -ml-1">
          <Ionicons name="arrow-back" size={24} color="#18181b" />
        </TouchableOpacity>
        <Text className="flex-1 text-[#19231F] text-[22px] font-semibold">
          Alamat Tersimpan
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-2"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[#79828A] text-[13px] leading-5 mb-5">
          Pilih alamat tersimpan saat memesan agar tidak perlu mengetik ulang alamat pengiriman.
        </Text>

        {isLoading ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#155A3D" />
          </View>
        ) : addresses.length === 0 ? (
          <View className="py-10 items-center">
            <Ionicons name="location-outline" size={36} color="#79828A" />
            <Text className="text-[#79828A] text-[14px] text-center mt-3">
              Belum ada alamat tersimpan. Tambahkan alamat untuk mulai memesan.
            </Text>
          </View>
        ) : (
          <View className="flex-col gap-4">
            {addresses.map((address) => (
              <View
                key={address.id}
                className="p-4 bg-white/60 rounded-xl border border-[#E1E4E1] flex-col gap-3.5"
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-[#19231F] text-[16px] font-semibold">
                    {address.label === 'Lainnya' ? address.label_custom || 'Lainnya' : address.label}
                  </Text>
                  {address.is_utama && (
                    <View className="px-2.5 py-1 bg-[#DFF1DE] rounded-lg flex-row justify-center items-center">
                      <Text className="text-[#155A3D] text-[11px] font-medium">
                        Alamat Utama
                      </Text>
                    </View>
                  )}
                </View>

                <View className="flex-col gap-1">
                  <Text className="text-[#19231F] text-[14px] font-medium">
                    {address.nama_penerima} · {address.no_hp}
                  </Text>
                  <Text className="text-[#19231F] text-[13px] leading-5 mt-0.5">
                    {address.alamat_lengkap}, {address.kecamatan_kota}
                  </Text>
                  {!!address.patokan && (
                    <Text className="text-[#79828A] text-[12px] leading-5">
                      Patokan: {address.patokan}
                    </Text>
                  )}
                </View>

                <View className="h-[1px] bg-[#E1E4E1]" />
                <View className="flex-row items-center gap-5">
                  <TouchableOpacity
                    onPress={() =>
                      router.push({ pathname: '/edit-alamat', params: { id: address.id } })
                    }
                  >
                    <Text className="text-[#155A3D] text-[13px] font-semibold">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSelectedAddress(address)}>
                    <Text className="text-[#EF4444] text-[13px] font-semibold">Hapus</Text>
                  </TouchableOpacity>
                  {!address.is_utama && (
                    <View className="flex-1 items-end">
                      <TouchableOpacity onPress={() => void handleSetPrimary(address)}>
                        <Text className="text-[#155A3D] text-[13px] font-semibold">
                          Jadikan Utama
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          className="h-[56px] bg-[#155A3D] rounded-lg justify-center items-center mt-5"
          onPress={() => router.push('/tambah-alamat')}
        >
          <Text className="text-white text-[16px] font-semibold">+ Tambah Alamat</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={selectedAddress !== null}
        onRequestClose={() => setSelectedAddress(null)}
      >
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="p-6 bg-[#FAF8F1] rounded-xl border border-[#E1E4E1] flex-col gap-4">
            <View className="h-11 w-11 bg-[#FEE2E2] rounded-full justify-center items-center">
              <Ionicons name="warning-outline" size={24} color="#EF4444" />
            </View>

            <View className="flex-col gap-1">
              <Text className="text-[#19231F] text-[20px] font-semibold leading-6">
                Hapus alamat {selectedAddress?.label}?
              </Text>
              <Text className="text-[#19231F] text-[14px] mt-1">
                {selectedAddress?.alamat_lengkap}, {selectedAddress?.kecamatan_kota}
              </Text>
              <Text className="text-[#79828A] text-[12px] leading-5 mt-1">
                Alamat ini akan dihapus dari daftar tersimpan.
              </Text>
            </View>

            <View className="flex-row items-center gap-3 mt-2">
              <TouchableOpacity
                className="flex-1 h-[48px] bg-white/70 rounded-lg border border-[#E1E4E1] justify-center items-center"
                onPress={() => setSelectedAddress(null)}
                disabled={isDeleting}
              >
                <Text className="text-[#155A3D] text-[14px] font-semibold">Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 h-[48px] rounded-lg justify-center items-center ${isDeleting ? 'bg-gray-400' : 'bg-[#EF4444]'}`}
                onPress={() => void handleDelete()}
                disabled={isDeleting}
              >
                <Text className="text-white text-[14px] font-semibold">
                  {isDeleting ? 'Menghapus...' : 'Hapus'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
