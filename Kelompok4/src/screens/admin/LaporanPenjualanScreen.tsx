import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { formatRupiah } from '../../utils/formatRupiah';
import { COLORS, SPACING } from '../../utils/constants';

const periodeOptions = [
  '1 Jun 2025 - 7 Jun 2025',
  '8 Jun 2025 - 14 Jun 2025',
  '15 Jun 2025 - 21 Jun 2025',
];

const orderTypeData = [
  { label: 'Dine-in',   persen: 20, warna: '#74AD86' },
  { label: 'Take Away', persen: 35, warna: '#65AB79' },
  { label: 'Delivery',  persen: 45, warna: '#56A3C0' },
];

const menuTerlarisLaporan = [
  { nama: 'Nasi Bakar Ayam', jumlah: 32 },
  { nama: 'Nasi Bakar Cumi', jumlah: 21 },
  { nama: 'Es Teh Manis',    jumlah: 18 },
];

export default function LaporanPenjualanScreen() {
  const [periodeIndex, setPeriodeIndex] = useState(0);

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu-outline" size={22} color="#19231F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Laporan Penjualan</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Periode */}
        <TouchableOpacity
          style={styles.periodeBox}
          onPress={() => setPeriodeIndex((i) => (i + 1) % periodeOptions.length)}
          activeOpacity={0.85}
        >
          <Text style={styles.periodeText}>{periodeOptions[periodeIndex]}</Text>
          <Ionicons name="chevron-down" size={20} color="#19231F" />
        </TouchableOpacity>

        {/* Stat Cards */}
        <View style={styles.row}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Transaksi</Text>
            <Text style={[styles.statValue, { fontSize: 25, lineHeight: 36.25 }]}>52</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Pendapatan</Text>
            <Text style={[styles.statValue, { fontSize: 19, lineHeight: 27.55 }]}>{formatRupiah(1250000)}</Text>
          </View>
        </View>

        {/* Chart Jenis Order */}
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

        {/* Menu Terlaris */}
        <View style={[styles.section, { gap: 20 }]}>
          <Text style={[styles.sectionTitle, { fontSize: 17, lineHeight: 24.65 }]}>Menu Terlaris</Text>
          {menuTerlarisLaporan.map((item) => (
            <View key={item.nama} style={styles.menuRow}>
              <Ionicons name="flame-outline" size={19} color="#CAA741" style={{ marginRight: 12 }} />
              <Text style={styles.menuNama}>{item.nama}</Text>
              <Text style={styles.menuJumlah}>{item.jumlah}</Text>
            </View>
          ))}
        </View>
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
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 12,
    paddingBottom: SPACING.xl,
    gap: 20,
  },
  periodeBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E4E1',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodeText: { fontSize: 16, fontWeight: '400', color: 'black' },
  row: { flexDirection: 'row', gap: 16 },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.56)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E1E4E1',
    gap: 15,
    minHeight: 116,
  },
  statLabel: { fontSize: 12, fontWeight: '400', color: '#79828A', lineHeight: 17.4 },
  statValue: { fontWeight: '400', color: '#19231F' },
  section: {
    backgroundColor: 'rgba(255,255,255,0.56)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E1E4E1',
    gap: 24,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#19231F', lineHeight: 23.2 },
  chartRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  chartLabel: { width: 92, fontSize: 15, fontWeight: '400', color: 'black' },
  barTrack: { flex: 1, height: 17, backgroundColor: '#EFF4F5', overflow: 'hidden' },
  barFill: { height: 17 },
  chartPersen: { width: 38, fontSize: 15, fontWeight: '400', color: '#4284A4', textAlign: 'right' },
  menuRow: { flexDirection: 'row', alignItems: 'center' },
  menuNama: { flex: 1, fontSize: 15, fontWeight: '400', color: 'black' },
  menuJumlah: { fontSize: 15, fontWeight: '400', color: 'black' },
});
