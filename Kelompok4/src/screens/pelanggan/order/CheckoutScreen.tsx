import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

type OrderType = 'dine_in' | 'takeaway' | 'delivery';
type PaymentMethod = 'cash' | 'transfer' | 'qris';

const paymentOptions: {
  value: PaymentMethod;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: 'cash', title: 'Tunai', icon: 'cash-outline' },
  { value: 'transfer', title: 'Transfer Bank', icon: 'card-outline' },
  { value: 'qris', title: 'QRIS', icon: 'qr-code-outline' },
];

function getParam(value: string | string[] | undefined, fallback = '') {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

function getNumberParam(value: string | string[] | undefined, fallback: number) {
  const parsed = Number(getParam(value));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [courierNote, setCourierNote] = useState(getParam(params.note));

  const nasiQuantity = getNumberParam(params.nasiQuantity, 1);
  const esTehQuantity = getNumberParam(params.esTehQuantity, 1);
  const calculatedTotal = nasiQuantity * 15000 + esTehQuantity * 5000;
  const total = getNumberParam(params.total, calculatedTotal);
  const rawOrderType = getParam(params.orderType, 'dine_in');
  const orderType: OrderType =
    rawOrderType === 'takeaway' || rawOrderType === 'delivery'
      ? rawOrderType
      : 'dine_in';
  const orderTypeLabel =
    orderType === 'dine_in'
      ? 'Dine-in'
      : orderType === 'takeaway'
        ? 'Take Away'
        : 'Delivery';

  const handleProcessOrder = () => {
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      Alert.alert('Alamat belum diisi', 'Masukkan alamat pengiriman terlebih dahulu.');
      return;
    }

    Alert.alert(
      'Pesanan Berhasil!',
      'Pesanan kamu sedang diproses oleh dapur.',
      [
        {
          text: 'Kembali ke Beranda',
          onPress: () => router.replace('/'),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Kembali"
        >
          <Ionicons name="arrow-back" size={22} color="#19231F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Detail Pesanan</Text>
          {nasiQuantity > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nasi Bakar Ayam  ×{nasiQuantity}</Text>
              <Text style={styles.detailValue}>
                Rp {(15000 * nasiQuantity).toLocaleString('id-ID')}
              </Text>
            </View>
          )}
          {esTehQuantity > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Es Teh Manis  ×{esTehQuantity}</Text>
              <Text style={styles.detailValue}>
                Rp {(5000 * esTehQuantity).toLocaleString('id-ID')}
              </Text>
            </View>
          )}
          <View style={styles.separator} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Subtotal</Text>
            <Text style={styles.detailValue}>Rp {total.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ongkir</Text>
            <Text style={styles.detailValue}>Rp 0</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Jenis Order</Text>
          <View style={styles.detailRow}>
            <View style={styles.orderType}>
              <Ionicons
                name={orderType === 'delivery' ? 'bicycle-outline' : 'restaurant-outline'}
                size={18}
                color="#155A3D"
              />
              <Text style={styles.detailValue}>{orderTypeLabel}</Text>
            </View>
            {orderType === 'delivery' && (
              <View style={styles.deliveryBadge}>
                <Text style={styles.deliveryBadgeText}>Ubah</Text>
              </View>
            )}
          </View>

          {orderType === 'delivery' && (
            <>
              <Text style={styles.fieldLabel}>Alamat Pengiriman</Text>
              <TextInput
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                placeholder="Masukkan alamat lengkap"
                placeholderTextColor="#929A96"
                style={styles.input}
                multiline
                textAlignVertical="top"
              />
              <Text style={styles.fieldLabel}>Catatan untuk Kurir</Text>
              <TextInput
                value={courierNote}
                onChangeText={setCourierNote}
                placeholder="Contoh: depan pagar warna putih."
                placeholderTextColor="#929A96"
                style={[styles.input, styles.noteInput]}
                multiline
                textAlignVertical="top"
              />
            </>
          )}
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
          <View style={styles.paymentOptions}>
            {paymentOptions.map((option) => {
              const selected = paymentMethod === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setPaymentMethod(option.value)}
                  activeOpacity={0.8}
                  style={styles.paymentOption}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Ionicons name={option.icon} size={17} color="#155A3D" />
                  <Text style={styles.paymentLabel}>{option.title}</Text>
                  <Ionicons
                    name={selected ? 'radio-button-on' : 'radio-button-off'}
                    size={16}
                    color={selected ? '#155A3D' : '#929A96'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Rp {total.toLocaleString('id-ID')}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.submitButton}
          onPress={handleProcessOrder}
        >
          <Text style={styles.submitButtonText}>Buat Pesanan</Text>
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
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#19231F',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 12,
  },
  card: {
    padding: 14,
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E1',
    borderRadius: 10,
  },
  sectionTitle: {
    color: '#19231F',
    fontSize: 13,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  detailLabel: {
    flex: 1,
    color: '#68736E',
    fontSize: 11,
  },
  detailValue: {
    color: '#19231F',
    fontSize: 11,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#EEF0EC',
    marginVertical: 1,
  },
  orderType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  deliveryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#E8F3EA',
    borderRadius: 8,
  },
  deliveryBadgeText: {
    color: '#155A3D',
    fontSize: 9,
  },
  fieldLabel: {
    color: '#19231F',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  input: {
    minHeight: 42,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#19231F',
    fontSize: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E1',
    borderRadius: 7,
  },
  noteInput: {
    minHeight: 38,
  },
  paymentSection: {
    gap: 8,
  },
  paymentOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E1',
    borderRadius: 8,
    gap: 6,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paymentLabel: {
    color: '#68736E',
    fontSize: 9,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  totalLabel: {
    color: '#19231F',
    fontSize: 12,
    fontWeight: '500',
  },
  totalValue: {
    color: '#155A3D',
    fontSize: 14,
    fontWeight: '700',
  },
  submitButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#155A3D',
    borderRadius: 7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
