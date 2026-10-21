import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../../types';

interface CardMenuProps {
  item: Product;
  onPress: () => void;
}

export default function CardMenu({ item, onPress }: CardMenuProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: item.gambar }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.nama}</Text>
        <Text style={styles.desc} numberOfLines={2}>{item.deskripsi}</Text>
        <Text style={styles.price}>Rp {item.harga.toLocaleString('id-ID')}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  desc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#15803d',
    marginTop: 6,
  },
});