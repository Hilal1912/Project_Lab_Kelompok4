import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function OrderTypeScreen() {
  const router = useRouter();

  const handleSelectType = (type: string) => {
    // Pindah ke Checkout Screen
    router.push('/checkout');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jenis Order</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subTitle}>
          Pilih jenis pesanan yang sesuai dengan kebutuhan Anda.
        </Text>

        {/* Option: Dine-in */}
        <TouchableOpacity
          style={styles.cardOption}
          onPress={() => handleSelectType('Dine-in')}>
          <View style={styles.iconBox}>
            <Ionicons name="restaurant-outline" size={28} color="#115e59" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Dine-in</Text>
            <Text style={styles.cardDesc}>Makan di tempat</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>

        {/* Option: Take Away */}
        <TouchableOpacity
          style={styles.cardOption}
          onPress={() => handleSelectType('Take Away')}>
          <View style={styles.iconBox}>
            <Ionicons name="bag-handle-outline" size={28} color="#115e59" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Take Away</Text>
            <Text style={styles.cardDesc}>Ambil di outlet</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>

        {/* Option: Delivery */}
        <TouchableOpacity
          style={styles.cardOption}
          onPress={() => handleSelectType('Delivery')}>
          <View style={styles.iconBox}>
            <Ionicons name="bicycle-outline" size={28} color="#115e59" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Delivery</Text>
            <Text style={styles.cardDesc}>Diantar ke alamat Anda</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Ionicons name="location-outline" size={20} color="#854d0e" />
          <Text style={styles.infoText}>
            Layanan delivery hanya tersedia untuk wilayah Kota Cirebon.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  content: { padding: 20 },
  subTitle: { fontSize: 14, color: '#64748b', marginBottom: 20, lineHeight: 20 },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fef9c3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, marginLeft: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cardDesc: { fontSize: 13, color: '#64748b', marginTop: 2 },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fef9c3',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  infoText: { fontSize: 12, color: '#854d0e', marginLeft: 10, flex: 1 },
});