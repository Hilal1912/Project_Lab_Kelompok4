import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

type OrderType = 'dine_in' | 'takeaway' | 'delivery';

const orderOptions: {
  value: OrderType;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    value: 'dine_in',
    title: 'Dine-in',
    description: 'Makan di tempat',
    icon: 'restaurant-outline',
  },
  {
    value: 'takeaway',
    title: 'Take Away',
    description: 'Ambil di outlet',
    icon: 'bag-handle-outline',
  },
  {
    value: 'delivery',
    title: 'Delivery',
    description: 'Diantar ke alamat Anda',
    icon: 'bicycle-outline',
  },
];

function getParam(value: string | string[] | undefined, fallback = '') {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

export default function OrderTypeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [orderType, setOrderType] = useState<OrderType>('dine_in');

  const continueToCheckout = () => {
    router.push({
      pathname: '/checkout',
      params: {
        total: getParam(params.total, '20000'),
        note: getParam(params.note),
        nasiQuantity: getParam(params.nasiQuantity, '1'),
        esTehQuantity: getParam(params.esTehQuantity, '1'),
        orderType,
      },
    });
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
        <Text style={styles.headerTitle}>Jenis Order</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          Pilih jenis pesanan yang sesuai dengan kebutuhan Anda.
        </Text>

        <View style={styles.options}>
          {orderOptions.map((option) => {
            const selected = orderType === option.value;

            return (
              <TouchableOpacity
                key={option.value}
                activeOpacity={0.8}
                onPress={() => setOrderType(option.value)}
                style={[styles.option, selected && styles.selectedOption]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                <View style={styles.optionIcon}>
                  <Ionicons name={option.icon} size={23} color="#155A3D" />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <Ionicons
                  name={selected ? 'radio-button-on' : 'chevron-forward'}
                  size={20}
                  color={selected ? '#155A3D' : '#79828A'}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.deliveryNotice}>
          <Ionicons name="information-circle-outline" size={18} color="#A88621" />
          <Text style={styles.deliveryNoticeText}>
            Layanan delivery hanya tersedia untuk wilayah Kota Cirebon.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.continueButton}
          onPress={continueToCheckout}
        >
          <Text style={styles.continueButtonText}>Lanjut ke Checkout</Text>
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
    paddingTop: 12,
    paddingBottom: 28,
    gap: 16,
  },
  intro: {
    color: '#79828A',
    fontSize: 13,
    marginBottom: 2,
  },
  options: {
    gap: 12,
  },
  option: {
    minHeight: 82,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E1',
    borderRadius: 12,
  },
  selectedOption: {
    borderColor: '#155A3D',
    backgroundColor: '#F5FAF6',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F0CB',
  },
  optionText: {
    flex: 1,
    gap: 3,
  },
  optionTitle: {
    color: '#19231F',
    fontSize: 15,
    fontWeight: '600',
  },
  optionDescription: {
    color: '#79828A',
    fontSize: 12,
  },
  deliveryNotice: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8F0CB',
    borderRadius: 8,
  },
  deliveryNoticeText: {
    flex: 1,
    color: '#8A7228',
    fontSize: 11,
  },
  continueButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#155A3D',
    borderRadius: 8,
    marginTop: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
