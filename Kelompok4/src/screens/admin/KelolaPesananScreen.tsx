import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { supabase } from '../../lib/supabase';
import { COLORS, SPACING } from '../../utils/constants';

type JenisOrder = 'Dine-in' | 'Take Away' | 'Delivery';
type FilterTab = 'Semua' | JenisOrder;
const TABS: FilterTab[] = ['Semua', 'Dine-in', 'Take Away', 'Delivery'];

interface Pesanan {
  id: string;
  nomor_order: string;
  waktu: string;
  jenis_order: JenisOrder;
  status: string;
  total: number;
}

function getBadgeStyle(status: string) {
  switch (status) {
    case 'Dalam Pengiriman': return { bg: '#DFF1DE', text: '#155A3D' };
    case 'Siap Diambil':     return { bg: '#DFF1DE', text: '#155A3D' };
    case 'Sedang Diproses':  return { bg: '#FFF0CA', text: '#B5751D' };
    case 'Dalam Antrian':    return { bg: '#F5E4E0', text: '#905A54' };
    default:                 return { bg: '#F1F5F9', text: '#475569' };
  }
}

function formatRupiah(angka: number) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

export default function KelolaPesananScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>('Semua');
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPesanan = async () => {
    setLoading(true);
    let query = supabase.from('pesanan').select('*').order('created_at', { ascending: false });
    if (activeTab !== 'Semua') query = query.eq('jenis_order', activeTab);
    const { data, error } = await query;
    if (error) Alert.alert('Error', error.message);
    else setPesanan(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPesanan(); }, [activeTab]);

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity><Ionicons name="menu-outline" size={22} color="#19231F" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Kelola Pesanan</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={pesanan}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const badge = getBadgeStyle(item.status);
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push({ pathname: '/admin/detail-pesanan', params: { id: item.id } })}
                activeOpacity={0.8}
              >
                <Text style={styles.nomorOrder}>{item.nomor_order}</Text>
                <View style={styles.row}>
                  <Text style={styles.detail}>{item.waktu} · {item.jenis_order}</Text>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.badgeText, { color: badge.text }]}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.total}>{formatRupiah(item.total)}</Text>
              </TouchableOpacity>
            );
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 32 }}
          onRefresh={fetchPesanan}
          refreshing={loading}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 40 }}>
              <Text style={{ color: '#79828A' }}>Tidak ada pesanan</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, height: 62 },
  headerTitle: { fontSize: 22, fontWeight: '600', color: '#19231F' },
  tabRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, paddingBottom: 20, gap: 7 },
  tab: { flex: 1, paddingVertical: 12, paddingHorizontal: 5, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.63)', alignItems: 'center' },
  tabActive: { backgroundColor: '#155A3D' },
  tabText: { fontSize: 12, fontWeight: '500', color: '#79828A' },
  tabTextActive: { color: 'white' },
  card: { paddingVertical: 25, borderBottomWidth: 1, borderBottomColor: '#E1E4E1', gap: 13 },
  nomorOrder: { fontSize: 16, fontWeight: '600', color: '#19231F', lineHeight: 23.2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detail: { fontSize: 14, fontWeight: '400', color: '#79828A' },
  total: { fontSize: 15, fontWeight: '400', color: '#79828A', textAlign: 'right' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: '500' },
});
