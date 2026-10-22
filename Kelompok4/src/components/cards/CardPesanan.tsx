import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Pesanan } from '../../data/pesananData';
import BadgeStatus from '../ui/BadgeStatus';
import { formatRupiah } from '../../utils/formatRupiah';
import { COLORS } from '../../utils/constants';

interface Props {
  item: Pesanan;
  onPress: () => void;
}

export default function CardPesanan({ item, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.row}>
        <Text style={styles.nomorOrder}>{item.nomorOrder}</Text>
        <BadgeStatus status={item.status} />
      </View>
      <View style={styles.row}>
        <Text style={styles.detail}>{item.waktu} · {item.jenisOrder}</Text>
        <Text style={styles.total}>{formatRupiah(item.total)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE0',
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nomorOrder: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  detail: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  total: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
