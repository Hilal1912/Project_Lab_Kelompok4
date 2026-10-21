import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { menuTerlaris } from '../../data/menuData';
import { formatRupiah } from '../../utils/formatRupiah';
import { COLORS, SPACING } from '../../utils/constants';

const iconColors = ['#E8531D', '#2D5016', '#D4A017'];

export default function DashboardScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity><Ionicons name="menu" size={24} color={COLORS.textPrimary} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Selamat datang, Admin 👋</Text>

        {/* Row 1 */}
        <View style={styles.row}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Pesanan</Text>
            <Text style={[styles.statValue, { fontSize: 36 }]}>35</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pendapatan Hari Ini</Text>
            <Text style={[styles.statValue, { fontSize: 18 }]}>{formatRupiah(682000)}</Text>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          {[{ label: 'Dine-in', value: '8' }, { label: 'Take Away', value: '12' }, { label: 'Delivery', value: '15' }].map((item) => (
            <View key={item.label} style={[styles.statCard, { flex: 1 }]}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={[styles.statValue, { fontSize: 30 }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Menu Terlaris */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu Terlaris</Text>
          {menuTerlaris.map((item, index) => (
            <View key={item.nama}>
              <View style={styles.menuRow}>
                <View style={[styles.menuIcon, { backgroundColor: iconColors[index] }]}>
                  <Ionicons name="flame" size={18} color="#fff" />
                </View>
                <Text style={styles.menuNama}>{item.nama}</Text>
                <Text style={styles.menuJumlah}>{item.jumlah}</Text>
              </View>
              {index < menuTerlaris.length - 1 && <View style={styles.divider} />}
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
  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },
  greeting: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary, marginBottom: SPACING.md },
  row: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 12, padding: SPACING.md, elevation: 1 },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 6 },
  statValue: { fontWeight: '700', color: COLORS.primary },
  section: { backgroundColor: COLORS.white, borderRadius: 12, padding: SPACING.md, marginTop: SPACING.sm, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm },
  menuIcon: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  menuNama: { flex: 1, fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  menuJumlah: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F0EBE0' },
});
