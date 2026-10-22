import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import BadgeStatus from '../../components/ui/BadgeStatus';
import { pesananData } from '../../data/pesananData';
import { formatRupiah } from '../../utils/formatRupiah';
import { COLORS, SPACING } from '../../utils/constants';

export default function DetailPesananScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pesanan = pesananData.find((p) => p.id === id) ?? pesananData[0];

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Pesanan</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.nomorOrder}>{pesanan.nomorOrder}</Text>
            <BadgeStatus status={pesanan.status} />
          </View>
          <Text style={styles.detail}>{pesanan.waktu} · {pesanan.jenisOrder}</Text>
          {pesanan.alamat && (
            <View style={styles.alamatRow}>
              <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.alamat}>{pesanan.alamat}</Text>
            </View>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item Pesanan</Text>
          {pesanan.items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemQty}>{item.qty}x</Text>
              <Text style={styles.itemNama}>{item.nama}</Text>
              <Text style={styles.itemHarga}>{formatRupiah(item.harga)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatRupiah(pesanan.total)}</Text>
          </View>
        </View>
        {pesanan.status !== 'Selesai' && (
          <TouchableOpacity style={styles.btn} activeOpacity={0.85}>
            <Text style={styles.btnText}>Update Status Pesanan</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl, gap: SPACING.sm },
  section: { backgroundColor: COLORS.white, borderRadius: 12, padding: SPACING.md, elevation: 1, gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nomorOrder: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  detail: { fontSize: 13, color: COLORS.textSecondary },
  alamatRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  alamat: { fontSize: 13, color: COLORS.textSecondary, flex: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  itemQty: { fontSize: 13, color: COLORS.textMuted, width: 28 },
  itemNama: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  itemHarga: { fontSize: 13, color: COLORS.textSecondary },
  divider: { height: 1, backgroundColor: '#F0EBE0', marginVertical: 8 },
  totalLabel: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  totalValue: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  btn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  btnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
});
