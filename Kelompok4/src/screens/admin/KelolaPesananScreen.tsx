import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import CardPesanan from '../../components/cards/CardPesanan';
import { pesananData, JenisOrder } from '../../data/pesananData';
import { COLORS, SPACING } from '../../utils/constants';

type FilterTab = 'Semua' | JenisOrder;
const TABS: FilterTab[] = ['Semua', 'Dine-in', 'Take Away', 'Delivery'];

export default function KelolaPesananScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>('Semua');
  const filtered = activeTab === 'Semua' ? pesananData : pesananData.filter((p) => p.jenisOrder === activeTab);

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity><Ionicons name="menu" size={24} color={COLORS.textPrimary} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Kelola Pesanan</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)} activeOpacity={0.8}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardPesanan item={item} onPress={() => router.push({ pathname: '/(admin)/detail-pesanan', params: { id: item.id } })} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={<View style={{ alignItems: 'center', paddingTop: 40 }}><Text style={{ color: COLORS.textMuted }}>Tidak ada pesanan</Text></View>}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  tabRow: { flexDirection: 'row', paddingHorizontal: SPACING.md, gap: SPACING.xs, marginBottom: SPACING.sm },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  tabTextActive: { color: COLORS.white, fontWeight: '700' },
});
