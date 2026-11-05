import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { supabase } from '../../lib/supabase';
import { COLORS, SPACING } from '../../utils/constants';

interface Pelanggan {
  id: string;
  nama: string;
  no_hp: string;
  email: string;
  jumlah_pesanan?: number;
}

export default function KelolaPelangganScreen() {
  const [search, setSearch] = useState('');
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPelanggan = useCallback(() => supabase
      .from('users')
      .select('id, nama, no_hp, email')
      .eq('role', 'pelanggan')
      .order('nama'), []);

  useEffect(() => {
    let isCurrent = true;
    fetchPelanggan().then(({ data, error }) => {
      if (!isCurrent) return;
      if (error) Alert.alert('Error', error.message);
      else setPelanggan(data ?? []);
      setLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [fetchPelanggan]);

  const refreshPelanggan = async () => {
    setLoading(true);
    const { data, error } = await fetchPelanggan();
    if (error) Alert.alert('Error', error.message);
    else setPelanggan(data ?? []);
    setLoading(false);
  };

  const filtered = pelanggan.filter(
    (p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      (p.no_hp && p.no_hp.includes(search))
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity><Ionicons name="menu-outline" size={22} color="#19231F" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Pelanggan</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#79828A" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari pelanggan..."
            placeholderTextColor="#79828A"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={26} color="#A4B3BC" />
              </View>
              <View style={styles.info}>
                <Text style={styles.nama}>{item.nama}</Text>
                <Text style={styles.noHp}>{item.no_hp || item.email || '-'}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          onRefresh={refreshPelanggan}
          refreshing={loading}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 40 }}>
              <Text style={{ color: '#79828A' }}>Pelanggan tidak ditemukan</Text>
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
  searchWrap: { paddingHorizontal: SPACING.lg, paddingBottom: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.69)', borderRadius: 8, paddingHorizontal: 12, height: 52, borderWidth: 1, borderColor: '#E1E4E1' },
  searchInput: { flex: 1, fontSize: 16, color: '#79828A' },
  card: { backgroundColor: 'rgba(255,255,255,0.56)', borderRadius: 12, padding: 18, flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderColor: '#E1E4E1', gap: 20 },
  avatar: { width: 62, height: 62, borderRadius: 31, borderWidth: 1, borderColor: '#A4B3BC', justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, gap: 12 },
  nama: { fontSize: 18, fontWeight: '400', color: '#3C6C87', lineHeight: 26.1 },
  noHp: { fontSize: 15, fontWeight: '400', color: '#79828A', lineHeight: 21.75 },
});
