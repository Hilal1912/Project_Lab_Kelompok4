/* eslint-disable react-hooks/set-state-in-effect */
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { supabase } from '../../lib/supabase';
import { COLORS, SPACING } from '../../utils/constants';

const STATUS_LIST = ['Dalam Antrian', 'Sedang Diproses', 'Siap Diambil', 'Dalam Pengiriman', 'Selesai'];

function formatRupiah(angka: number) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

function getBadgeStyle(status: string) {
  switch (status) {
    case 'Dalam Pengiriman': return { bg: '#DFF1DE', text: '#155A3D' };
    case 'Siap Diambil':     return { bg: '#DFF1DE', text: '#155A3D' };
    case 'Sedang Diproses':  return { bg: '#FFF0CA', text: '#B5751D' };
    case 'Dalam Antrian':    return { bg: '#F5E4E0', text: '#905A54' };
    case 'Selesai':          return { bg: '#F1F5F9', text: '#475569' };
    default:                 return { bg: '#F1F5F9', text: '#475569' };
  }
}

export default function DetailPesananScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pesanan, setPesanan] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const [{ data: p, error: pe }, { data: i, error: ie }] = await Promise.all([
        supabase.from('pesanan').select('*').eq('id', id).single(),
        supabase.from('pesanan_items').select('*').eq('pesanan_id', id),
      ]);
      if (pe) { Alert.alert('Error', pe.message); return; }
      if (ie) { Alert.alert('Error', ie.message); return; }
      setPesanan(p);
      setItems(i ?? []);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Gagal memuat detail pesanan.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      void fetchDetail();
    }, [id])
  );

  const handleUpdateStatus = () => {
    const currentIdx = STATUS_LIST.indexOf(pesanan.status);
    const nextStatus = STATUS_LIST[currentIdx + 1];
    if (!nextStatus) return;

    Alert.alert('Update Status', `Ubah status ke "${nextStatus}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Update', onPress: async () => {
          setUpdating(true);
          const { error } = await supabase.from('pesanan').update({ status: nextStatus }).eq('id', id);
          if (error) Alert.alert('Error', error.message);
          else setPesanan({ ...pesanan, status: nextStatus });
          setUpdating(false);
        }
      },
    ]);
  };

  if (loading) return <ScreenWrapper><View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color={COLORS.primary} /></View></ScreenWrapper>;
  if (!pesanan) return null;

  const badge = getBadgeStyle(pesanan.status);
  const currentIdx = STATUS_LIST.indexOf(pesanan.status);
  const nextStatus = STATUS_LIST[currentIdx + 1];

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#19231F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Pesanan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.nomorOrder}>{pesanan.nomor_order}</Text>
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, { color: badge.text }]}>{pesanan.status}</Text>
            </View>
          </View>
          <Text style={styles.detail}>{pesanan.waktu} · {pesanan.jenis_order}</Text>
          {pesanan.alamat && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="location-outline" size={14} color="#9E9E9E" />
              <Text style={styles.detail}>{pesanan.alamat}</Text>
            </View>
          )}
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item Pesanan</Text>
          {items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemQty}>{item.qty}x</Text>
              <Text style={styles.itemNama}>{item.nama_menu}</Text>
              <Text style={styles.itemHarga}>{formatRupiah(item.harga)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatRupiah(pesanan.total)}</Text>
          </View>
        </View>

        {/* Tombol Update Status */}
        {nextStatus && (
          <TouchableOpacity
            style={styles.btnUpdate}
            onPress={handleUpdateStatus}
            activeOpacity={0.85}
            disabled={updating}
          >
            {updating
              ? <ActivityIndicator color="white" />
              : <Text style={styles.btnUpdateText}>Update → {nextStatus}</Text>
            }
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, height: 62 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#19231F' },
  content: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl, gap: SPACING.sm },
  section: { backgroundColor: COLORS.white, borderRadius: 12, padding: SPACING.md, elevation: 1, gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nomorOrder: { fontSize: 16, fontWeight: '700', color: '#19231F' },
  detail: { fontSize: 13, color: '#79828A' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: '500' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#19231F', marginBottom: 4 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  itemQty: { fontSize: 13, color: '#9E9E9E', width: 28 },
  itemNama: { flex: 1, fontSize: 14, color: '#19231F' },
  itemHarga: { fontSize: 13, color: '#79828A' },
  divider: { height: 1, backgroundColor: '#F0EBE0', marginVertical: 8 },
  totalLabel: { fontSize: 15, fontWeight: '700', color: '#19231F' },
  totalValue: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  btnUpdate: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  btnUpdateText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
});
