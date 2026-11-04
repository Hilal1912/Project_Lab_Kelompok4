import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { supabase } from '../../lib/supabase';
import { COLORS, SPACING } from '../../utils/constants';

export default function TambahMenuScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [gambar, setGambar] = useState('');
  const [kategori, setKategori] = useState<'Produk' | 'Minuman' | 'Tambahan'>('Produk');
  const [tersedia, setTersedia] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nama.trim()) e.nama = 'Nama menu wajib diisi';
    if (!harga.trim()) e.harga = 'Harga wajib diisi';
    else if (isNaN(Number(harga))) e.harga = 'Harga harus berupa angka';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSimpan = async () => {
    if (!validate()) return;
    setLoading(true);

    const payload = {
      nama: nama.trim(),
      harga: Number(harga),
      deskripsi: deskripsi.trim(),
      gambar: gambar.trim() || 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
      kategori,
      tersedia,
    };

    const { error } = isEdit
      ? await supabase.from('menu').update(payload).eq('id', id)
      : await supabase.from('menu').insert(payload);

    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Berhasil', `Menu berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}!`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#19231F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Menu' : 'Tambah Menu'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Nama */}
        <Text style={styles.label}>Nama Menu</Text>
        <TextInput
          style={[styles.input, errors.nama ? styles.inputErr : null]}
          placeholder="Contoh: Nasi Bakar Ayam"
          placeholderTextColor="#9E9E9E"
          value={nama}
          onChangeText={(t) => { setNama(t); setErrors((e) => ({ ...e, nama: '' })); }}
        />
        {!!errors.nama && <Text style={styles.errText}>{errors.nama}</Text>}

        {/* Harga */}
        <Text style={[styles.label, { marginTop: 12 }]}>Harga (Rp)</Text>
        <TextInput
          style={[styles.input, errors.harga ? styles.inputErr : null]}
          placeholder="Contoh: 15000"
          placeholderTextColor="#9E9E9E"
          value={harga}
          onChangeText={(t) => { setHarga(t); setErrors((e) => ({ ...e, harga: '' })); }}
          keyboardType="numeric"
        />
        {!!errors.harga && <Text style={styles.errText}>{errors.harga}</Text>}

        {/* URL Gambar */}
        <Text style={[styles.label, { marginTop: 12 }]}>URL Gambar (opsional)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor="#9E9E9E"
          value={gambar}
          onChangeText={setGambar}
          autoCapitalize="none"
        />

        {/* Deskripsi */}
        <Text style={[styles.label, { marginTop: 12 }]}>Deskripsi</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          placeholder="Deskripsi singkat menu..."
          placeholderTextColor="#9E9E9E"
          value={deskripsi}
          onChangeText={setDeskripsi}
          multiline
          numberOfLines={3}
        />

        {/* Kategori */}
        <Text style={[styles.label, { marginTop: 12 }]}>Kategori</Text>
        <View style={styles.kategoriRow}>
          {(['Produk', 'Minuman', 'Tambahan'] as const).map((k) => (
            <TouchableOpacity
              key={k}
              style={[styles.kategoriBtn, kategori === k && styles.kategoriBtnActive]}
              onPress={() => setKategori(k)}
            >
              <Text style={[styles.kategoriBtnText, kategori === k && styles.kategoriBtnTextActive]}>{k}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tersedia */}
        <Text style={[styles.label, { marginTop: 12 }]}>Ketersediaan</Text>
        <View style={styles.kategoriRow}>
          {[true, false].map((val) => (
            <TouchableOpacity
              key={String(val)}
              style={[styles.kategoriBtn, tersedia === val && styles.kategoriBtnActive]}
              onPress={() => setTersedia(val)}
            >
              <Text style={[styles.kategoriBtnText, tersedia === val && styles.kategoriBtnTextActive]}>
                {val ? 'Tersedia' : 'Tidak Tersedia'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tombol Simpan */}
        <TouchableOpacity style={styles.btnSimpan} onPress={handleSimpan} activeOpacity={0.85} disabled={loading}>
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={styles.btnSimpanText}>{isEdit ? 'Simpan Perubahan' : 'Tambah Menu'}</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, height: 62 },
  headerTitle: { fontSize: 22, fontWeight: '600', color: '#19231F' },
  content: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
  input: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#0f172a', marginBottom: 4 },
  inputErr: { borderColor: COLORS.error },
  errText: { fontSize: 12, color: COLORS.error, marginBottom: 8, marginLeft: 4 },
  kategoriRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  kategoriBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center', backgroundColor: COLORS.white },
  kategoriBtnActive: { borderColor: COLORS.primary, backgroundColor: '#EBF3E8' },
  kategoriBtnText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  kategoriBtnTextActive: { color: COLORS.primary, fontWeight: '700' },
  btnSimpan: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  btnSimpanText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
});
