import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AppNavigator() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nasbak Cirebon App - Ready!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15803d',
  },
});