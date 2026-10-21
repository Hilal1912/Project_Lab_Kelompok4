import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const router = useRouter();
  const [note, setNote] = useState('');
  const [qtyNasiBakar, setQtyNasiBakar] = useState(1);
  const [qtyEsTeh, setQtyEsTeh] = useState(1);

  const [showNasiBakar, setShowNasiBakar] = useState(true);
  const [showEsTeh, setShowEsTeh] = useState(true);
  const [hasAddedToCart, setHasAddedToCart] = useState(false);

  const subtotal =
    (showNasiBakar ? 15000 * qtyNasiBakar : 0) +
    (showEsTeh ? 5000 * qtyEsTeh : 0);
  const hasItems = showNasiBakar || showEsTeh;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons
            name={hasAddedToCart ? 'arrow-back' : 'menu-outline'}
            size={24}
            color="#19231F"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Keranjang</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Item List */}
        <View style={styles.itemList}>
          {/* Item 1: Nasi Bakar Ayam */}
          {showNasiBakar && (
            <View style={styles.itemRow}>
              <Image
                source={{ uri: 'https://placehold.co/96x96/png' }}
                style={styles.itemImg}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>Nasi Bakar Ayam</Text>
                <Text style={styles.itemPrice}>Rp 15.000</Text>
                <View style={styles.qtyContainer}>
                  <TouchableOpacity
                    onPress={() => setQtyNasiBakar(Math.max(1, qtyNasiBakar - 1))}
                    style={styles.qtyBtn}
                    accessibilityLabel="Kurangi jumlah Nasi Bakar Ayam"
                  >
                    <Ionicons name="remove" size={12} color="#19231F" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{qtyNasiBakar}</Text>
                  <TouchableOpacity
                    onPress={() => setQtyNasiBakar(qtyNasiBakar + 1)}
                    style={styles.qtyBtn}
                    accessibilityLabel="Tambah jumlah Nasi Bakar Ayam"
                  >
                    <Ionicons name="add" size={12} color="#19231F" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => setShowNasiBakar(false)}
                accessibilityLabel="Hapus Nasi Bakar Ayam"
              >
                <Ionicons name="trash-outline" size={20} color="#79828A" />
              </TouchableOpacity>
            </View>
          )}

          {/* Item 2: Es Teh Manis */}
          {showEsTeh && (
            <View style={styles.itemRow}>
              <Image
                source={{ uri: 'https://placehold.co/96x96/png' }}
                style={styles.itemImg}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>Es Teh Manis</Text>
                <Text style={styles.itemPrice}>Rp 5.000</Text>
                <View style={styles.qtyContainer}>
                  <TouchableOpacity
                    onPress={() => setQtyEsTeh(Math.max(1, qtyEsTeh - 1))}
                    style={styles.qtyBtn}
                    accessibilityLabel="Kurangi jumlah Es Teh Manis"
                  >
                    <Ionicons name="remove" size={12} color="#19231F" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{qtyEsTeh}</Text>
                  <TouchableOpacity
                    onPress={() => setQtyEsTeh(qtyEsTeh + 1)}
                    style={styles.qtyBtn}
                    accessibilityLabel="Tambah jumlah Es Teh Manis"
                  >
                    <Ionicons name="add" size={12} color="#19231F" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => setShowEsTeh(false)}
                accessibilityLabel="Hapus Es Teh Manis"
              >
                <Ionicons name="trash-outline" size={20} color="#79828A" />
              </TouchableOpacity>
            </View>
          )}

          {!hasItems && (
            <Text style={styles.emptyCart}>Keranjang kamu masih kosong.</Text>
          )}
        </View>

        {/* Catatan Pesanan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catatan pesanan</Text>
          <View style={styles.noteBox}>
            <TextInput
              multiline
              placeholder="Contoh: tidak pedas, minta sambal terpisah."
              placeholderTextColor="#79828A"
              value={note}
              onChangeText={setNote}
              style={styles.noteInput}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Ringkasan Biaya */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rp {subtotal.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ongkir</Text>
            <Text style={styles.summaryValue}>Rp 0</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rp {subtotal.toLocaleString('id-ID')}</Text>
          </View>
        </View>

        {/* Tombol Utama */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.submitBtn, !hasItems && styles.disabledSubmitBtn]}
          disabled={!hasItems}
          onPress={() => {
            if (!hasAddedToCart) {
              setHasAddedToCart(true);
              return;
            }

            router.push({
              pathname: '/order-type',
              params: {
                total: String(subtotal),
                note,
                nasiQuantity: String(showNasiBakar ? qtyNasiBakar : 0),
                esTehQuantity: String(showEsTeh ? qtyEsTeh : 0),
              },
            });
          }}
        >
          <Text style={styles.submitBtnText}>
            {hasAddedToCart ? 'Lanjut ke Checkout' : 'Tambah ke Keranjang'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F1',
  },
  header: {
    height: 64,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FAF8F1',
  },
  headerTitle: {
    color: '#19231F',
    fontSize: 20,
    fontWeight: '600',
  },
  iconBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 20,
  },
  itemList: {
    flexDirection: 'column',
  },
  emptyCart: {
    paddingVertical: 24,
    color: '#79828A',
    textAlign: 'center',
  },
  itemRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E4E1',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  itemImg: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#E1E4E1',
  },
  itemDetails: {
    flex: 1,
    gap: 6,
  },
  itemName: {
    color: '#19231F',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  itemPrice: {
    color: '#19231F',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  qtyBtn: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#19231F',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '400',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: '#19231F',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  noteBox: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E4E1',
    minHeight: 80,
  },
  noteInput: {
    color: '#19231F',
    fontSize: 14,
    padding: 0,
  },
  summaryContainer: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#19231F',
    fontSize: 16,
    fontWeight: '400',
  },
  summaryValue: {
    color: '#19231F',
    fontSize: 16,
    fontWeight: '400',
  },
  totalLabel: {
    color: '#19231F',
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    color: '#155A3D',
    fontSize: 20,
    fontWeight: '600',
  },
  submitBtn: {
    height: 56,
    backgroundColor: '#155A3D',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  disabledSubmitBtn: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});