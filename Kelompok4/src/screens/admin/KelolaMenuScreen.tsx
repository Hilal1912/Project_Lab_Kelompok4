import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { menuData, MenuItem } from '../../data/menuData';
import { formatRupiah } from '../../utils/formatRupiah';
import { COLORS, SPACING } from '../../utils/constants';

export default function KelolaMenuScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const filtered = menuData.filter((m) =>
    m.nama.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => router.push({ pathname: '/admin/detail-menu', params: { id: item.id } })}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.gambar }} style={styles.menuImage} />
      <View style={styles.menuInfo}>
        <Text style={styles.menuNama}>{item.nama}</Text>
        <Text style={styles.menuHarga}>{formatRupiah(item.harga)}</Text>
        <View style={styles.badgeRow}>
          {item.kategori === 'Produk' && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Produk</Text>
            </View>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.tersedia ? 'Tersedia' : 'Habis'}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#79828A" />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu-outline" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kelola Menu</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Search + Tambah */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#79828A" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari menu..."
            placeholderTextColor="#79828A"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.btnTambah}
          onPress={() => router.push('/admin/tambah-menu')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnTambahText}>Tambah Menu</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#19231F',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: 20,
    gap: 14,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.69)',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 52,
    borderWidth: 1,
    borderColor: '#E1E4E1',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#79828A',
  },
  btnTambah: {
    backgroundColor: '#155A3D',
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTambahText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    gap: 18,
  },
  menuImage: {
    width: 94,
    height: 98,
    borderRadius: 10,
    backgroundColor: '#E0DAD0',
  },
  menuInfo: {
    flex: 1,
    gap: 9,
  },
  menuNama: {
    fontSize: 16,
    fontWeight: '400',
    color: '#19231F',
    lineHeight: 23.2,
  },
  menuHarga: {
    fontSize: 15,
    fontWeight: '400',
    color: '#19231F',
    lineHeight: 21.75,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#DFF1DE',
    borderRadius: 10,
  },
  badgeText: {
    color: '#155A3D',
    fontSize: 11,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#E1E4E1',
    marginHorizontal: SPACING.lg,
  },
});
