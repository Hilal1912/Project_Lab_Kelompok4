import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { menuData } from '../../data/menuData';
import { formatRupiah } from '../../utils/formatRupiah';
import { COLORS, SPACING } from '../../utils/constants';

export default function EditMenuScreen() {
  const router = useRouter();
  const { id, field } = useLocalSearchParams<{ id: string; field: string }>();
  const item = menuData.find((m) => m.id === id) ?? menuData[0];
  const isNama = field === 'nama';
  const [value, setValue] = useState(isNama ? item.nama : String(item.harga));

  const handleSimpan = () => {
    if (!value.trim()) { Alert.alert('Error', 'Field tidak boleh kosong'); return; }
    Alert.alert('Berhasil', `${isNama ? 'Nama' : 'Harga'} berhasil diperbarui!`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#19231F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isNama ? 'Edit Nama Produk' : 'Edit Harga Produk'}</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Info Menu */}
      <View style={styles.menuRow}>
        <Image source={{ uri: item.gambar }} style={styles.menuImage} />
        <View style={styles.menuInfo}>
          <Text style={styles.menuNama}>{item.nama}</Text>
          <Text style={styles.menuHarga}>{formatRupiah(item.harga)}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.kategori}</Text>
          </View>
        </View>
      </View>

      {/* Form */}
      <View style={styles.formWrap}>
        <Text style={styles.label}>{isNama ? 'Nama Produk' : 'Harga Produk'}</Text>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            keyboardType={isNama ? 'default' : 'numeric'}
            autoFocus
          />
          <Ionicons name="pencil-outline" size={18} color="#79828A" />
        </View>
        <Text style={styles.hint}>
          {isNama ? 'Nama ini akan ditampilkan pada daftar menu.' : 'Harga ini akan ditampilkan pada daftar menu.'}
        </Text>

        <TouchableOpacity style={styles.btnSimpan} onPress={handleSimpan} activeOpacity={0.85}>
          <Text style={styles.btnSimpanText}>Simpan Perubahan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnBatal} onPress={() => router.back()} activeOpacity={0.85}>
          <Text style={styles.btnBatalText}>Batal</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    height: 62,
  },
  headerTitle: { fontSize: 22, fontWeight: '600', color: '#19231F' },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E4E1',
    gap: 18,
  },
  menuImage: { width: 94, height: 98, borderRadius: 10, backgroundColor: '#E0DAD0' },
  menuInfo: { flex: 1, gap: 9 },
  menuNama: { fontSize: 16, fontWeight: '400', color: '#19231F', lineHeight: 23.2 },
  menuHarga: { fontSize: 15, fontWeight: '400', color: '#19231F', lineHeight: 21.75 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#DFF1DE', borderRadius: 10, alignSelf: 'flex-start' },
  badgeText: { color: '#155A3D', fontSize: 11, fontWeight: '500' },
  formWrap: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 32,
    gap: 8,
  },
  label: { fontSize: 16, fontWeight: '500', color: '#19231F' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.69)',
    borderWidth: 1,
    borderColor: '#155A3D',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 52,
    gap: 12,
  },
  input: { flex: 1, fontSize: 16, fontWeight: '400', color: '#19231F' },
  hint: { fontSize: 14, fontWeight: '400', color: '#79828A', lineHeight: 20.3, marginBottom: 16 },
  btnSimpan: {
    backgroundColor: '#155A3D',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSimpanText: { color: 'white', fontWeight: '600', fontSize: 14 },
  btnBatal: {
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E4E1',
  },
  btnBatalText: { color: '#155A3D', fontWeight: '600', fontSize: 14 },
});
