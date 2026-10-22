import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { formatRupiah } from '../../utils/formatRupiah';
import { COLORS, SPACING } from '../../utils/constants';

const periodeOptions = ['1 Jun 2025 - 7 Jun 2025', '8 Jun 2025 - 14 Jun 2025', '15 Jun 2025 - 21 Jun 2025'];
const orderTypeData = [
  { label: 'Dine-in', persen: 20, warna: '#2D5016' },
  { label: 'Take Away', persen: 35, warna: '#2D5016' },
  { label: 'Delivery', persen: 45, warna: '#3B82F6' },
];
const menuTerlarisLaporan = [
  { nama: 'Nasi Bakar Ayam', jumlah: 32 },
  { nama: 'Nasi Bakar Cumi', jumlah: 21 },
  { nama: 'Es Teh Manis', jumlah: 18 },
];

export default function LaporanPenjualanScreen() {
  const [periodeIndex, setPeriodeIndex] = useState(0);
  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity><Ionicons name="menu" size={24} color={COLORS.textPrimary} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Laporan Penjualan</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.periodeBox} onPress={() => setPeriodeIndex((i) => (i + 1) % periodeOptions.length)} activeOpacity={0.85}>
          <Text style={styles.periodeText}>{periodeOptions[periodeIndex]}</Text>
          <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <View style={styles.row}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Transaksi</Text>
            <Text style={styles.statBig}>52</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Pendapatan</Text>
            <Text style={styles.statMed}>{formatRupiah(1250000)}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Penjualan Berdasarkan Jenis Order</Text>
          {orderTypeData.map((item) => (
            <View key={item.label} style={styles.chartRow}>
              <Text style={styles.chartLabel}>{item.label}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${item.persen}%` as any, backgroundColor: item.warna }]} />
              </View>
              <Text style={styles.chartPersen}>{item.persen}%</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu Terlaris</Text>
          {menuTerlarisLaporan.map((item, index) => (
            <View key={item.nama}>
              <View style={styles.menuRow}>
                <Ionicons name="flame-outline" size={18} color={COLORS.accentGold} style={{ marginRight: 8 }} />
                <Text style={styles.menuNama}>{item.nama}</Text>
                <Text style={styles.menuJumlah}>{item.jumlah}</Text>
              </View>
              {index < menuTerlarisLaporan.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl, gap: SPACING.sm },
  periodeBox: { backgroundColor: COLORS.white, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  periodeText: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  row: { flexDirection: 'row', gap: SPACING.sm },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 12, padding: SPACING.md, elevation: 1 },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 6 },
  statBig: { fontSize: 36, fontWeight: '700', color: COLORS.textPrimary },
  statMed: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  section: { backgroundColor: COLORS.white, borderRadius: 12, padding: SPACING.md, elevation: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  chartRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: SPACING.sm },
  chartLabel: { width: 76, fontSize: 13, color: COLORS.textSecondary },
  barTrack: { flex: 1, height: 10, backgroundColor: '#EDE8DE', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 6 },
  chartPersen: { width: 36, fontSize: 13, color: '#3B82F6', fontWeight: '600', textAlign: 'right' },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm },
  menuNama: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  menuJumlah: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F0EBE0' },
});
