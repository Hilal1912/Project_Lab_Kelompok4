import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';

export default function TambahMenuScreen() {
  const router = useRouter();
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState<'Produk' | 'Minuman'>('Produk');
  const [errors, setErrors] = useState<{ nama?: string; harga?: string }>({});

  const validate = () => {
    const e: { nama?: string; harga?: string } = {};
    if (!nama.trim()) e.nama = 'Nama menu wajib diisi';
    if (!harga.trim()) e.harga = 'Harga wajib diisi';
    else if (isNaN(Number(harga))) e.harga = 'Harga harus berupa angka';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSimpan = () => {
    if (!validate()) return;
    Alert.alert('Berhasil', 'Menu berhasil ditambahkan!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-text-main">Tambah Menu</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        {/* Upload Foto */}
        <TouchableOpacity className="bg-white border-2 border-dashed border-border rounded-xl items-center justify-center py-8 mb-4 gap-2">
          <Ionicons name="camera-outline" size={32} color="#9E9E9E" />
          <Text className="text-sm font-semibold text-text-sub">Upload Foto Menu</Text>
          <Text className="text-xs text-text-muted">Ketuk untuk memilih gambar</Text>
        </TouchableOpacity>

        {/* Nama */}
        <Text className="text-sm font-semibold text-[#334155] mb-2">Nama Menu</Text>
        <TextInput
          className={`bg-white border rounded-xl px-4 py-3 text-sm text-text-main mb-1 ${errors.nama ? 'border-red-400' : 'border-border'}`}
          placeholder="Contoh: Nasi Bakar Ayam"
          placeholderTextColor="#9E9E9E"
          value={nama}
          onChangeText={(t) => { setNama(t); setErrors((e) => ({ ...e, nama: undefined })); }}
        />
        {errors.nama && <Text className="text-xs text-red-500 mb-3">{errors.nama}</Text>}

        {/* Harga */}
        <Text className="text-sm font-semibold text-[#334155] mb-2 mt-2">Harga (Rp)</Text>
        <TextInput
          className={`bg-white border rounded-xl px-4 py-3 text-sm text-text-main mb-1 ${errors.harga ? 'border-red-400' : 'border-border'}`}
          placeholder="Contoh: 15000"
          placeholderTextColor="#9E9E9E"
          value={harga}
          onChangeText={(t) => { setHarga(t); setErrors((e) => ({ ...e, harga: undefined })); }}
          keyboardType="numeric"
        />
        {errors.harga && <Text className="text-xs text-red-500 mb-3">{errors.harga}</Text>}

        {/* Deskripsi */}
        <Text className="text-sm font-semibold text-[#334155] mb-2 mt-2">Deskripsi</Text>
        <TextInput
          className="bg-white border border-border rounded-xl px-4 py-3 text-sm text-text-main mb-4"
          placeholder="Deskripsi singkat menu..."
          placeholderTextColor="#9E9E9E"
          value={deskripsi}
          onChangeText={setDeskripsi}
          multiline
          numberOfLines={3}
          style={{ height: 80, textAlignVertical: 'top' }}
        />

        {/* Kategori */}
        <Text className="text-sm font-semibold text-[#334155] mb-2">Kategori</Text>
        <View className="flex-row gap-3 mb-6">
          {(['Produk', 'Minuman'] as const).map((k) => (
            <TouchableOpacity
              key={k}
              className={`flex-1 py-3 rounded-xl border-2 items-center ${
                kategori === k
                  ? 'border-primary bg-green-50'
                  : 'border-border bg-white'
              }`}
              onPress={() => setKategori(k)}
            >
              <Text className={`text-sm font-semibold ${kategori === k ? 'text-primary' : 'text-text-sub'}`}>
                {k}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tombol Simpan */}
        <TouchableOpacity
          className="bg-primary rounded-xl py-4 items-center mb-8"
          onPress={handleSimpan}
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-base">Simpan Menu</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}
