import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import BadgeStatus from '../../components/ui/BadgeStatus';
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isNama ? 'Edit Nama Produk' : 'Edit Harga Produk'}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Info Menu */}
      <View style={styles.menuRow}>
        <Image source={{ uri: item.gambar }} style={styles.menuImage} />
        <View style={styles.menuInfo}>
          <Text style={styles.menuNama}>{item.nama}</Text>
          <Text style={styles.menuHarga}>{formatRupiah(item.harga)}</Text>
          <BadgeStatus status={item.kategori} />
        </View>
      </View>

      <View style={{ height: 24 }} />

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
          <Ionicons name="pencil-outline" size={18} color={COLORS.textMuted} />
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#EDE8DE' },
  menuImage: { width: 72, height: 72, borderRadius: 10, marginRight: 12, backgroundColor: '#E0DAD0' },
  menuInfo: { flex: 1, gap: 4 },
  menuNama: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  menuHarga: { fontSize: 13, color: COLORS.textSecondary },
  formWrap: { paddingHorizontal: SPACING.md },
  label: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 10 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 8 },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  hint: { fontSize: 12, color: COLORS.textMuted, marginBottom: 24 },
  btnSimpan: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  btnSimpanText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  btnBatal: { backgroundColor: COLORS.white, borderRadius: 12, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border },
  btnBatalText: { color: COLORS.primary, fontWeight: '700', fontSize: 16 },
});
