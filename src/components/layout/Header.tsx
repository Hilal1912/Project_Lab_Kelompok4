import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
}

export default function Header({ title, showBack = false, onBackPress }: HeaderProps) {
  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#15803d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 32,
    alignItems: 'center',
  },
  backText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
});