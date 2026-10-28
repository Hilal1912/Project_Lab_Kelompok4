import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { menuTerlaris } from '../../data/menuData';
import { formatRupiah } from '../../utils/formatRupiah';
import { COLORS, SPACING } from '../../utils/constants';

// Warna icon kotak sesuai figma
const iconColors = ['#CF742E', '#64AE79', '#DCA322'];

export default function DashboardScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => router.replace('/login') },
    ]);
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu-outline" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Greeting */}
        <Text style={styles.greeting}>Selamat datang, Admin 👋</Text>

        {/* Row 1 — Total Pesanan & Pendapatan */}
        <View style={styles.row}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Pesanan</Text>
            <Text style={[styles.statValue, { color: '#155A3D', fontSize: 27, lineHeight: 39.15 }]}>35</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pendapatan Hari Ini</Text>
            <Text style={[styles.statValue, { color: COLORS.textPrimary, fontSize: 20, lineHeight: 29 }]}>
              {formatRupiah(682000)}
            </Text>
          </View>
        </View>

        {/* Row 2 — Dine-in, Take Away, Delivery */}
        <View style={[styles.row, { gap: 12 }]}>
          {[
            { label: 'Dine-in',   value: '8',  color: '#CF742E' },
            { label: 'Take Away', value: '12', color: '#155A3D' },
            { label: 'Delivery',  value: '15', color: '#155A3D' },
          ].map((item) => (
            <View key={item.label} style={[styles.statCard, { flex: 1 }]}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={[styles.statValue, { color: item.color, fontSize: 27, lineHeight: 39.15 }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Menu Terlaris */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu Terlaris</Text>
          {menuTerlaris.map((item, index) => (
            <View key={item.nama}>
              <View style={styles.menuRow}>
                {/* Kotak berwarna sesuai figma */}
                <View style={[styles.menuIconBox, { backgroundColor: iconColors[index] }]} />
                <Text style={styles.menuNama}>{item.nama}</Text>
                <Text style={styles.menuJumlah}>{item.jumlah}</Text>
              </View>
              <View style={styles.divider} />
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 12,
    paddingBottom: SPACING.xl,
    gap: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '400',
    color: COLORS.textPrimary,
    lineHeight: 31.9,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.56)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E1E4E1',
    gap: 14,
    minHeight: 116,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#79828A',
    lineHeight: 17.4,
  },
  statValue: {
    fontWeight: '400',
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.56)',
    borderRadius: 12,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E1E4E1',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 26.1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  menuIconBox: {
    width: 32,
    height: 38,
    borderRadius: 7,
  },
  menuNama: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  menuJumlah: {
    fontSize: 17,
    fontWeight: '400',
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E1E4E1',
  },
});
