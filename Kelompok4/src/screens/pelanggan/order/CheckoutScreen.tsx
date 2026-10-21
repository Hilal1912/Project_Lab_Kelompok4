import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CheckoutScreen({ navigation }: any) {
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Detail Pesanan */}
        <Text style={styles.sectionTitle}>Detail Pesanan</Text>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.itemText}>Nasi Bakar Ayam x1</Text>
            <Text style={styles.itemPrice}>Rp 15.000</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.itemText}>Es Teh Manis x1</Text>
            <Text style={styles.itemPrice}>Rp 5.000</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>Rp 20.000</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Ongkir</Text>
            <Text style={styles.value}>Rp 20.000</Text>
          </View>
        </View>

        {/* Alamat Pengiriman */}
        <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location" size={20} color="#115e59" />
            <Text style={styles.addressTitle}>Rumah</Text>
          </View>
          <Text style={styles.addressText}>
            Jl. Melati No. 12, Kec. Harjamukti, Kota Cirebon
          </Text>
        </View>

        {/* Catatan Kurir */}
        <Text style={styles.sectionTitle}>Catatan untuk Kurir</Text>
        <TextInput
          style={styles.inputNote}
          placeholder="Contoh: depan warung, pintu warna biru."
          placeholderTextColor="#a1a1aa"
        />

        {/* Metode Pembayaran */}
        <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
        <View style={styles.paymentRow}>
          {['Cash', 'Transfer Bank', 'QRIS'].map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.radioBtn,
                paymentMethod === method && styles.radioBtnActive,
              ]}
              onPress={() => setPaymentMethod(method)}>
              <Text
                style={[
                  styles.radioText,
                  paymentMethod === method && styles.radioTextActive,
                ]}>
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Total & Button */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Rp 20.000</Text>
        </View>
        <TouchableOpacity style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>Buat Pesanan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemText: { fontSize: 13, color: '#334155' },
  itemPrice: { fontSize: 13, color: '#64748b' },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
  },
  label: { fontSize: 13, color: '#64748b' },
  value: { fontSize: 13, fontWeight: '600', color: '#115e59' },
  addressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginLeft: 6,
  },
  addressText: { fontSize: 12, color: '#64748b', marginTop: 4 },
  inputNote: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    marginBottom: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  radioBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  radioBtnActive: { borderColor: '#115e59', backgroundColor: '#f0fdf4' },
  radioText: { fontSize: 12, color: '#64748b' },
  radioTextActive: { color: '#115e59', fontWeight: '700' },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#115e59' },
  btnPrimary: {
    backgroundColor: '#115e59',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});