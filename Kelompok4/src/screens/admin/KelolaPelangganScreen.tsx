import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { pelangganData, Pelanggan } from '../../data/pelangganData';
import { COLORS, SPACING } from '../../utils/constants';

export default function KelolaPelangganScreen() {
  const [search, setSearch] = useState('');
  const filtered = pelangganData.filter((p) => p.nama.toLowerCase().includes(search.toLowerCase()) || p.noHp.includes(search));

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity><Ionicons name="menu" size={24} color={COLORS.textPrimary} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Pelanggan</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={COLORS.textMuted} style={{ marginRight: 6 }} />
          <TextInput style={styles.searchInput} placeholder="Cari pelanggan..." placeholderTextColor={COLORS.textMuted} value={search} onChangeText={setSearch} />
        </View>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Pelanggan }) => (
          <View style={styles.card}>
            <View style={styles.avatar}><Ionicons name="person-outline" size={28} color={COLORS.textMuted} /></View>
            <View style={styles.info}>
              <Text style={styles.nama}>{item.nama}</Text>
              <Text style={styles.noHp}>{item.noHp}</Text>
              <Text style={styles.pesanan}>{item.jumlahPesanan} pesanan</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, gap: 10, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  searchWrap: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 10, paddingHorizontal: SPACING.sm, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#EDE8DE', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  info: { flex: 1, gap: 2 },
  nama: { fontSize: 15, fontWeight: '600', color: COLORS.blue },
  noHp: { fontSize: 13, color: COLORS.textSecondary },
  pesanan: { fontSize: 13, color: COLORS.textMuted },
});
