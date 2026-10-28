import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { menuData } from '../../data/menuData';
import { formatRupiah } from '../../utils/formatRupiah';
import { COLORS, SPACING } from '../../utils/constants';

export default function DetailMenuScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = menuData.find((m) => m.id === id) ?? menuData[0];

  return (
    <ScreenWrapper>
      {/* Header — tanpa back button sesuai figma */}
      <View style={styles.header}>
        <View style={{ width: 22 }} />
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
              <View style={styles.badgeGreen}>
                <Text style={styles.badgeGreenText}>{item.kategori}</Text>
              </View>
              <View style={styles.badgeGreen}>
                <Text style={styles.badgeGreenText}>Tersedia</Text>
              </View>
              <View style={styles.badgeRed}>
                <Text style={styles.badgeRedText}>Tidak Tersedia</Text>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#79828A" />
        </View>

        <View style={{ height: 58 }} />

        {/* Nama Produk */}
        <TouchableOpacity
          style={styles.fieldRow}
          onPress={() => router.push({ pathname: '/admin/edit-menu', params: { id: item.id, field: 'nama' } })}
          activeOpacity={0.8}
        >
          <Ionicons name="person-outline" size={23} color="#19231F" style={{ marginRight: 18 }} />
          <Text style={styles.fieldLabel}>Nama Produk</Text>
          <Ionicons name="chevron-forward" size={17} color="#79828A" />
        </TouchableOpacity>

        <View style={{ height: 50 }} />

        {/* Harga Produk */}
        <TouchableOpacity
          style={styles.fieldRow}
          onPress={() => router.push({ pathname: '/admin/edit-menu', params: { id: item.id, field: 'harga' } })}
          activeOpacity={0.8}
        >
          <Ionicons name="location-outline" size={23} color="#19231F" style={{ marginRight: 18 }} />
          <Text style={styles.fieldLabel}>Harga Produk</Text>
          <Ionicons name="chevron-forward" size={17} color="#79828A" />
        </TouchableOpacity>
      </ScrollView>
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
  badgeWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badgeGreen: { paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#DFF1DE', borderRadius: 10 },
  badgeGreenText: { color: '#155A3D', fontSize: 11, fontWeight: '500' },
  badgeRed: { paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#D05756', borderRadius: 10 },
  badgeRedText: { color: 'white', fontSize: 11, fontWeight: '500' },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg + 18,
    paddingVertical: 46,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E1E4E1',
  },
  fieldLabel: { flex: 1, fontSize: 17, fontWeight: '400', color: '#19231F' },
});
