import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getCurrentCustomerProfile } from '@/lib/customer-profile';
import { supabase } from '@/lib/supabase';

const addressLabels = ['Rumah', 'Kantor', 'Lainnya'];

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

export default function EditAlamatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const addressId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [label, setLabel] = useState('Rumah');
  const [customLabel, setCustomLabel] = useState('');
  const [namaPenerima, setNamaPenerima] = useState('');
  const [nomorHp, setNomorHp] = useState('');
  const [alamatLengkap, setAlamatLengkap] = useState('');
  const [kecamatanKota, setKecamatanKota] = useState('');
  const [patokan, setPatokan] = useState('');
  const [isUtama, setIsUtama] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAddress = async () => {
      if (!addressId) {
        Alert.alert('Alamat tidak ditemukan', 'Pilih alamat yang ingin diedit dari daftar.');
        router.back();
        return;
      }

      try {
        const profile = await getCurrentCustomerProfile();
        const { data, error } = await supabase
          .from('alamat')
          .select('id, label, label_custom, nama_penerima, no_hp, alamat_lengkap, kecamatan_kota, patokan, is_utama')
          .eq('id', addressId)
          .eq('user_id', profile.id)
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Alamat tidak ditemukan atau Anda tidak memiliki akses.');
        if (!isMounted) return;

        const address = data as CustomerAddress;
        setLabel(addressLabels.includes(address.label) ? address.label : 'Lainnya');
        setCustomLabel(address.label === 'Lainnya' ? address.label_custom ?? '' : '');
        setNamaPenerima(address.nama_penerima);
        setNomorHp(address.no_hp);
        setAlamatLengkap(address.alamat_lengkap);
        setKecamatanKota(address.kecamatan_kota);
        setPatokan(address.patokan ?? '');
        setIsUtama(address.is_utama);
      } catch (error) {
        console.error('Failed to load customer address:', error);
        if (isMounted) {
          Alert.alert(
            'Gagal memuat alamat',
            error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat alamat.'
          );
          router.back();
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadAddress();
    return () => {
      isMounted = false;
    };
  }, [addressId, router]);

  const handleSave = async () => {
    const addressLabel = label === 'Lainnya' ? customLabel.trim() : label;
    if (
      !addressLabel ||
      !namaPenerima.trim() ||
      !nomorHp.trim() ||
      !alamatLengkap.trim() ||
      !kecamatanKota.trim()
    ) {
      Alert.alert('Peringatan', 'Harap isi label dan semua kolom yang wajib diisi.');
      return;
    }
    if (!addressId || isSaving) return;

    setIsSaving(true);
    try {
      const profile = await getCurrentCustomerProfile();
      const { data, error } = await supabase
        .from('alamat')
        .update({
          label,
          label_custom: label === 'Lainnya' ? addressLabel : null,
          nama_penerima: namaPenerima.trim(),
          no_hp: nomorHp.trim(),
          alamat_lengkap: alamatLengkap.trim(),
          kecamatan_kota: kecamatanKota.trim(),
          patokan: patokan.trim() || null,
          is_utama: isUtama,
        })
        .eq('id', addressId)
        .eq('user_id', profile.id)
        .select('id')
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Alamat tidak ditemukan atau tidak dapat diperbarui.');
      Alert.alert('Berhasil', 'Alamat berhasil diperbarui.');
      router.back();
    } catch (error) {
      console.error('Failed to update customer address:', error);
      Alert.alert(
        'Gagal menyimpan alamat',
        error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui alamat.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const fields = [
    { label: 'Nama penerima', value: namaPenerima, onChangeText: setNamaPenerima },
    {
      label: 'Nomor HP',
      value: nomorHp,
      onChangeText: setNomorHp,
      keyboardType: 'phone-pad' as const,
    },
    { label: 'Alamat lengkap', value: alamatLengkap, onChangeText: setAlamatLengkap },
    { label: 'Kecamatan / Kota', value: kecamatanKota, onChangeText: setKecamatanKota },
    { label: 'Patokan (opsional)', value: patokan, onChangeText: setPatokan },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8F1]">
      <View className="flex-row items-center px-6 py-4 gap-4">
        <TouchableOpacity onPress={() => router.back()} className="p-1 -ml-1">
          <Ionicons name="arrow-back" size={24} color="#18181b" />
        </TouchableOpacity>
        <Text className="flex-1 text-[#19231F] text-[22px] font-semibold">Edit Alamat</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#155A3D" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6 pt-2"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-[#79828A] text-[13px] leading-5 mb-5">
            Perbarui informasi alamat yang tersimpan.
          </Text>

          <View className="flex-col gap-4 pb-6">
            <View className="flex-col gap-2">
              <Text className="text-[#19231F] text-[14px] font-medium">Label alamat</Text>
              <View className="flex-row gap-2">
                {addressLabels.map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setLabel(item)}
                    className={`flex-1 h-[36px] rounded-lg border justify-center items-center ${
                      label === item
                        ? 'bg-[#DFF1DE] border-[#155A3D]'
                        : 'bg-white/70 border-[#E1E4E1]'
                    }`}
                  >
                    <Text
                      className={`text-[12px] font-medium ${
                        label === item ? 'text-[#155A3D]' : 'text-[#79828A]'
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {label === 'Lainnya' && (
                <TextInput
                  className="min-h-[48px] px-3 bg-white/70 rounded-lg border border-[#E1E4E1] text-[#19231F] text-[14px]"
                  placeholder="Tulis label alamat"
                  placeholderTextColor="#79828A"
                  value={customLabel}
                  onChangeText={setCustomLabel}
                />
              )}
            </View>

            {fields.map((field) => (
              <View key={field.label} className="flex-col gap-2">
                <Text className="text-[#19231F] text-[14px] font-medium">{field.label}</Text>
                <TextInput
                  className="min-h-[48px] px-3 bg-white/70 rounded-lg border border-[#E1E4E1] text-[#19231F] text-[14px]"
                  value={field.value}
                  onChangeText={field.onChangeText}
                  placeholder={field.label}
                  placeholderTextColor="#79828A"
                  keyboardType={field.keyboardType ?? 'default'}
                />
              </View>
            ))}

            <View className="flex-col gap-2 mt-2">
              <TouchableOpacity
                className="flex-row items-center gap-3"
                onPress={() => setIsUtama((current) => !current)}
              >
                <View
                  className={`w-5 h-5 rounded-[5px] border justify-center items-center ${
                    isUtama
                      ? 'bg-[#155A3D] border-[#155A3D]'
                      : 'bg-white/70 border-[#E1E4E1]'
                  }`}
                >
                  {isUtama && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                <Text className="flex-1 text-[#19231F] text-[14px] leading-5">
                  Jadikan alamat utama
                </Text>
              </TouchableOpacity>
              <Text className="text-[#79828A] text-[12px] leading-5">
                Hanya satu alamat yang dapat menjadi alamat utama.
              </Text>
            </View>
          </View>

          <View className="flex-col gap-2.5 mt-2">
            <TouchableOpacity
              className={`w-full h-[56px] rounded-lg justify-center items-center ${
                isSaving ? 'bg-gray-400' : 'bg-[#155A3D]'
              }`}
              onPress={() => void handleSave()}
              disabled={isSaving}
            >
              <Text className="text-white text-[16px] font-semibold">
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full h-[48px] bg-white/70 rounded-lg border border-[#E1E4E1] justify-center items-center"
              onPress={() => router.back()}
            >
              <Text className="text-[#155A3D] text-[14px] font-semibold">Batal</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
