import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type BadgeType =
  | 'Dalam Pengiriman' | 'Siap Diambil' | 'Sedang Diproses'
  | 'Dalam Antrian' | 'Selesai' | 'Tersedia' | 'Tidak Tersedia'
  | 'Produk' | 'Minuman';

function getStyle(status: string) {
  switch (status) {
    case 'Dalam Pengiriman': return { bg: '#DBEAFE', text: '#1D4ED8' };
    case 'Siap Diambil':     return { bg: '#D1FAE5', text: '#065F46' };
    case 'Sedang Diproses':  return { bg: '#FEF3C7', text: '#92400E' };
    case 'Dalam Antrian':    return { bg: '#FCE7F3', text: '#9D174D' };
    case 'Selesai':          return { bg: '#F1F5F9', text: '#475569' };
    case 'Tersedia':         return { bg: '#D1FAE5', text: '#065F46' };
    case 'Tidak Tersedia':   return { bg: '#FEE2E2', text: '#991B1B' };
    case 'Produk':           return { bg: '#DBEAFE', text: '#1D4ED8' };
    case 'Minuman':          return { bg: '#EDE9FE', text: '#5B21B6' };
    default:                 return { bg: '#F1F5F9', text: '#475569' };
  }
}

export default function BadgeStatus({ status }: { status: BadgeType }) {
  const { bg, text } = getStyle(status);
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
