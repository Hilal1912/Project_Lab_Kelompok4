import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getCurrentCustomerProfile } from '@/lib/customer-profile';
import { supabase } from '@/lib/supabase';

const addressLabels = ['Rumah', 'Kantor', 'Lainnya'];

export default function TambahAlamatScreen() {
  const router = useRouter();
  const [label, setLabel] = useState('Kantor');
  const [customLabel, setCustomLabel] = useState('');
  const [isUtama, setIsUtama] = useState(false);
  const [namaPenerima, setNamaPenerima] = useState('');
  const [nomorHp, setNomorHp] = useState('');
  const [alamatLengkap, setAlamatLengkap] = useState('');
  const [kecamatanKota, setKecamatanKota] = useState('');
  const [patokan, setPatokan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSimpanAlamat = async () => {
    const alamatLabel = label === 'Lainnya' ? customLabel.trim() : label;
    if (
      !alamatLabel ||
      !namaPenerima.trim() ||
      !nomorHp.trim() ||
      !alamatLengkap.trim() ||
      !kecamatanKota.trim()
    ) {
      Alert.alert('Peringatan', 'Harap isi label dan semua kolom yang wajib diisi.');
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    try {
      const profile = await getCurrentCustomerProfile();
      const { error } = await supabase.from('alamat').insert({
        user_id: profile.id,
        label,
        label_custom: label === 'Lainnya' ? alamatLabel : null,
        nama_penerima: namaPenerima.trim(),
        no_hp: nomorHp.trim(),
        alamat_lengkap: alamatLengkap.trim(),
        kecamatan_kota: kecamatanKota.trim(),
        patokan: patokan.trim() || null,
        is_utama: isUtama,
      });

      if (error) throw error;
      Alert.alert('Sukses', 'Alamat berhasil disimpan.');
      router.back();
    } catch (error) {
      console.error('Failed to save customer address:', error);
      Alert.alert(
        'Gagal menyimpan alamat',
        error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan alamat.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8F1]">
      <View className="flex-row items-center px-6 py-4 gap-4">
        <TouchableOpacity onPress={() => router.back()} className="p-1 -ml-1">
          <Ionicons name="arrow-back" size={24} color="#18181b" />
        </TouchableOpacity>
        <Text className="flex-1 text-[#19231F] text-[22px] font-semibold">
          Tambah Alamat
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-2"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-[#79828A] text-[13px] leading-5 mb-5">
          Lengkapi alamat baru sebelum menyimpannya.
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

          <View className="flex-col gap-2">
            <Text className="text-[#19231F] text-[14px] font-medium">Nama penerima</Text>
            <TextInput
              className="min-h-[48px] px-3 bg-white/70 rounded-lg border border-[#E1E4E1] text-[#19231F] text-[14px]"
              placeholder="Nama penerima"
              placeholderTextColor="#79828A"
              value={namaPenerima}
              onChangeText={setNamaPenerima}
              autoCapitalize="words"
            />
          </View>

          <View className="flex-col gap-2">
            <Text className="text-[#19231F] text-[14px] font-medium">Nomor HP</Text>
            <TextInput
              className="min-h-[48px] px-3 bg-white/70 rounded-lg border border-[#E1E4E1] text-[#19231F] text-[14px]"
              placeholder="0812 3456 7890"
              placeholderTextColor="#79828A"
              keyboardType="phone-pad"
              value={nomorHp}
              onChangeText={setNomorHp}
            />
          </View>

          <View className="flex-col gap-2">
            <Text className="text-[#19231F] text-[14px] font-medium">Alamat lengkap</Text>
            <TextInput
              className="min-h-[48px] px-3 bg-white/70 rounded-lg border border-[#E1E4E1] text-[#19231F] text-[14px]"
              placeholder="Jl. Kartini No. 8"
              placeholderTextColor="#79828A"
              value={alamatLengkap}
              onChangeText={setAlamatLengkap}
            />
          </View>

          <View className="flex-col gap-2">
            <Text className="text-[#19231F] text-[14px] font-medium">Kecamatan / Kota</Text>
            <TextInput
              className="min-h-[48px] px-3 bg-white/70 rounded-lg border border-[#E1E4E1] text-[#19231F] text-[14px]"
              placeholder="Kec. Kejaksan, Kota Cirebon"
              placeholderTextColor="#79828A"
              value={kecamatanKota}
              onChangeText={setKecamatanKota}
            />
          </View>

          <View className="flex-col gap-2">
            <Text className="text-[#19231F] text-[14px] font-medium">Patokan (opsional)</Text>
            <TextInput
              className="min-h-[48px] px-3 bg-white/70 rounded-lg border border-[#E1E4E1] text-[#19231F] text-[14px]"
              placeholder="Dekat gedung atau lokasi tertentu"
              placeholderTextColor="#79828A"
              value={patokan}
              onChangeText={setPatokan}
            />
          </View>

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
              isLoading ? 'bg-gray-400' : 'bg-[#155A3D]'
            }`}
            onPress={() => void handleSimpanAlamat()}
            disabled={isLoading}
          >
            <Text className="text-white text-[16px] font-semibold">
              {isLoading ? 'Menyimpan...' : 'Simpan Alamat'}
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
    </SafeAreaView>
  );
}
