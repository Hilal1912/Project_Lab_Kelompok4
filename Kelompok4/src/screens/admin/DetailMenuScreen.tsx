/* eslint-disable react-hooks/set-state-in-effect */
import React, { useCallback, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { supabase } from '../../lib/supabase';
import { COLORS, SPACING } from '../../utils/constants';

interface MenuItem {
  id: string;
  nama: string;
  harga: number;
  deskripsi: string;
  gambar: string;
  kategori: string;
  tersedia: boolean;
}

function formatRupiah(angka: number) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

export default function DetailMenuScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    const { data, error } = await supabase.from('menu').select('*').eq('id', id).single();
    if (error) Alert.alert('Error', error.message);
    else setItem(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      void fetchDetail();
    }, [id])
  );

  const handleHapus = () => {
    Alert.alert('Hapus Menu', `Yakin ingin menghapus ${item?.nama}?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus', style: 'destructive', onPress: async () => {
          const { error } = await supabase.from('menu').delete().eq('id', id);
          if (error) Alert.alert('Error', error.message);
          else { Alert.alert('Berhasil', 'Menu berhasil dihapus'); router.back(); }
        }
      },
    ]);
  };

  const handleToggleKetersediaan = async () => {
    if (!item) return;
    const { error } = await supabase.from('menu').update({ tersedia: !item.tersedia }).eq('id', id);
    if (error) Alert.alert('Error', error.message);
    else setItem({ ...item, tersedia: !item.tersedia });
  };

  if (loading) return <ScreenWrapper><View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color={COLORS.primary} /></View></ScreenWrapper>;
  if (!item) return null;

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#19231F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Resep</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Menu */}
        <View style={styles.menuRow}>
          <Image source={{ uri: item.gambar }} style={styles.menuImage} />
          <View style={styles.menuInfo}>
            <Text style={styles.menuNama}>{item.nama}</Text>
            <Text style={styles.menuHarga}>{formatRupiah(item.harga)}</Text>
            <View style={styles.badgeWrap}>
              <View style={styles.badgeGreen}><Text style={styles.badgeGreenText}>{item.kategori}</Text></View>
              <View style={styles.badgeGreen}><Text style={styles.badgeGreenText}>Tersedia</Text></View>
              <View style={styles.badgeRed}><Text style={styles.badgeRedText}>Tidak Tersedia</Text></View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#79828A" />
        </View>

        <View style={{ height: 24 }} />

        {/* Nama Produk */}
        <TouchableOpacity
          style={styles.fieldRow}
          onPress={() => router.push({ pathname: '/admin/tambah-menu', params: { id: item.id } })}
          activeOpacity={0.8}
        >
          <Ionicons name="person-outline" size={23} color="#19231F" style={{ marginRight: 18 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Nama Produk</Text>
            <Text style={styles.fieldValue}>{item.nama}</Text>
          </View>
          <Ionicons name="chevron-forward" size={17} color="#79828A" />
        </TouchableOpacity>

        <View style={{ height: 12 }} />

        {/* Harga Produk */}
        <TouchableOpacity
          style={styles.fieldRow}
          onPress={() => router.push({ pathname: '/admin/tambah-menu', params: { id: item.id } })}
          activeOpacity={0.8}
        >
          <Ionicons name="pricetag-outline" size={23} color="#19231F" style={{ marginRight: 18 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Harga Produk</Text>
            <Text style={styles.fieldValue}>{formatRupiah(item.harga)}</Text>
          </View>
          <Ionicons name="chevron-forward" size={17} color="#79828A" />
        </TouchableOpacity>

        <View style={{ height: 24 }} />

        {/* Tombol aksi */}
        <View style={{ paddingHorizontal: SPACING.lg, gap: 12, paddingBottom: 32 }}>
          <TouchableOpacity style={styles.btnToggle} onPress={handleToggleKetersediaan} activeOpacity={0.85}>
            <Text style={styles.btnToggleText}>
              {item.tersedia ? 'Set Tidak Tersedia' : 'Set Tersedia'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnHapus} onPress={handleHapus} activeOpacity={0.85}>
            <Text style={styles.btnHapusText}>Hapus Menu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, height: 62 },
  headerTitle: { fontSize: 22, fontWeight: '600', color: '#19231F' },
  menuRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: SPACING.lg, paddingTop: 12, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#E1E4E1', gap: 18 },
  menuImage: { width: 94, height: 98, borderRadius: 10, backgroundColor: '#E0DAD0' },
  menuInfo: { flex: 1, gap: 9 },
  menuNama: { fontSize: 16, fontWeight: '400', color: '#19231F', lineHeight: 23.2 },
  menuHarga: { fontSize: 15, fontWeight: '400', color: '#19231F', lineHeight: 21.75 },
  badgeWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badgeGreen: { paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#DFF1DE', borderRadius: 10 },
  badgeGreenText: { color: '#155A3D', fontSize: 11, fontWeight: '500' },
  badgeRed: { paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#D05756', borderRadius: 10 },
  badgeRedText: { color: 'white', fontSize: 11, fontWeight: '500' },
  fieldRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E1E4E1' },
  fieldLabel: { fontSize: 12, color: '#79828A' },
  fieldValue: { fontSize: 16, fontWeight: '400', color: '#19231F', marginTop: 2 },
  btnToggle: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  btnToggleText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  btnHapus: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.error },
  btnHapusText: { color: COLORS.error, fontWeight: '700', fontSize: 15 },
});
