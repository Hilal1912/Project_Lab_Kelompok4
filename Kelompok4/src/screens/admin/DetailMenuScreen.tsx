import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import BadgeStatus from '../../components/ui/BadgeStatus';
import { useMenu } from '../../context/menu-context';
import { formatRupiah } from '../../utils/formatRupiah';
import { COLORS, SPACING } from '../../utils/constants';

export default function DetailMenuScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { menu } = useMenu();
  const item = menu.find((m) => m.id === id) ?? menu[0];

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Detail Resep</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Menu */}
        <TouchableOpacity style={styles.menuRow} activeOpacity={0.8}>
          <Image source={{ uri: item.gambar }} style={styles.menuImage} />
          <View style={styles.menuInfo}>
            <Text style={styles.menuNama}>{item.nama}</Text>
            <Text style={styles.menuHarga}>{formatRupiah(item.harga)}</Text>
            <View style={styles.badgeRow}>
              <BadgeStatus status={item.kategori} />
              <BadgeStatus status="Tersedia" />
              <BadgeStatus status="Tidak Tersedia" />
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 24 }} />

        {/* Nama Produk */}
        <TouchableOpacity
          style={styles.fieldRow}
          onPress={() => router.push({ pathname: '/admin/edit-menu', params: { id: item.id, field: 'nama' } })}
          activeOpacity={0.8}
        >
          <Ionicons name="person-outline" size={20} color={COLORS.textMuted} style={{ marginRight: 14 }} />
          <Text style={styles.fieldLabel}>Nama Produk</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 12 }} />

        {/* Harga Produk */}
        <TouchableOpacity
          style={styles.fieldRow}
          onPress={() => router.push({ pathname: '/admin/edit-menu', params: { id: item.id, field: 'harga' } })}
          activeOpacity={0.8}
        >
          <Ionicons name="location-outline" size={20} color={COLORS.textMuted} style={{ marginRight: 14 }} />
          <Text style={styles.fieldLabel}>Harga Produk</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      </ScrollView>
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
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  fieldRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EDE8DE', backgroundColor: COLORS.background },
  fieldLabel: { flex: 1, fontSize: 15, color: COLORS.textSecondary },
});
