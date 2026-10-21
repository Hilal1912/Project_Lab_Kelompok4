import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import BadgeStatus from '../../components/ui/BadgeStatus';
import { menuData, MenuItem } from '../../data/menuData';
import { formatRupiah } from '../../utils/formatRupiah';
import { COLORS, SPACING } from '../../utils/constants';

export default function KelolaMenuScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const filtered = menuData.filter((m) => m.nama.toLowerCase().includes(search.toLowerCase()));

  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => router.push({ pathname: '/(admin)/detail-menu', params: { id: item.id } })} activeOpacity={0.8}>
      <Image source={{ uri: item.gambar }} style={styles.menuImage} />
      <View style={styles.menuInfo}>
        <Text style={styles.menuNama}>{item.nama}</Text>
        <Text style={styles.menuHarga}>{formatRupiah(item.harga)}</Text>
        <View style={styles.badgeRow}>
          <BadgeStatus status={item.kategori} />
          <BadgeStatus status={item.tersedia ? 'Tersedia' : 'Tidak Tersedia'} />
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity><Ionicons name="menu" size={24} color={COLORS.textPrimary} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Kelola Menu</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={COLORS.textMuted} style={{ marginRight: 6 }} />
          <TextInput style={styles.searchInput} placeholder="Cari menu..." placeholderTextColor={COLORS.textMuted} value={search} onChangeText={setSearch} />
        </View>
        <TouchableOpacity style={styles.btnTambah} onPress={() => router.push('/(admin)/tambah-menu')} activeOpacity={0.85}>
          <Text style={styles.btnTambahText}>Tambah Menu</Text>
        </TouchableOpacity>
      </View>
      <FlatList data={filtered} keyExtractor={(item) => item.id} renderItem={renderItem} ItemSeparatorComponent={() => <View style={styles.separator} />} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, gap: SPACING.sm },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 10, paddingHorizontal: SPACING.sm, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  btnTambah: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: 11, borderRadius: 10 },
  btnTambahText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  menuImage: { width: 72, height: 72, borderRadius: 10, marginRight: SPACING.sm, backgroundColor: '#E0DAD0' },
  menuInfo: { flex: 1, gap: 4 },
  menuNama: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  menuHarga: { fontSize: 13, color: COLORS.textSecondary },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  separator: { height: 1, backgroundColor: '#EDE8DE', marginHorizontal: SPACING.md },
});
