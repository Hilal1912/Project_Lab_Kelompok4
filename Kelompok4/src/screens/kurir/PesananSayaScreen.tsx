import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import CourierBottomTabs from '../../components/kurir/CourierBottomTabs';
import CourierPersistenceNotice from '../../components/kurir/CourierPersistenceNotice';
import {
  CourierOrder,
  CourierOrderStatus,
  useCourierData,
} from '../../state/courier-orders';

type ActiveOrderStatus = Exclude<CourierOrderStatus, 'selesai'>;
type ActiveCourierOrder = CourierOrder & { status: ActiveOrderStatus };

const statusLabels: Record<ActiveOrderStatus, string> = {
  antrian: 'Dalam Antrian',
  proses: 'Dalam Proses',
  perjalanan: 'Dalam Perjalanan',
};

const PesananSayaScreen = () => {
  const [activeTab, setActiveTab] = useState<ActiveOrderStatus>('antrian');
  const router = useRouter();
  const { orders, isHydrated, persistenceError } = useCourierData();
  const visibleOrders = orders.filter(
    (order): order is ActiveCourierOrder => order.status === activeTab,
  );

  return (
    <ScreenWrapper
      className="flex-1 bg-[#fbf8f0]"
      style={{ width: '100%', maxWidth: 430, alignSelf: 'center' }}
    >
      <View className="h-14 flex-row items-center gap-3 px-5">
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          onPress={() => {
            if (router.canGoBack()) router.back();
          }}
        >
          <Feather name="arrow-left" size={18} color="#202a27" />
        </TouchableOpacity>
        <Text className="text-[15px] font-semibold text-[#202a27]">Pesanan Saya</Text>
      </View>

      <ScrollView className="flex-1 px-4 pb-3 pt-1" showsVerticalScrollIndicator={false}>
        <CourierPersistenceNotice isHydrated={isHydrated} error={persistenceError} />
        <View className="mb-3 flex-row gap-1.5">
          {(['antrian', 'proses', 'perjalanan'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              accessibilityRole="button"
              accessibilityState={{ selected: activeTab === status }}
              className={`flex-1 items-center justify-center rounded-md px-1 py-2 ${
                activeTab === status ? 'bg-emerald-800' : 'bg-white/70'
              }`}
              onPress={() => setActiveTab(status)}
            >
              <Text
                className={`text-[9px] font-medium ${
                  activeTab === status ? 'text-white' : 'text-slate-500'
                }`}
              >
                {status === 'perjalanan' ? 'Dlm Perjalanan' : statusLabels[status]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {visibleOrders.map((order) => (
          <View key={order.id} className="mb-2.5 gap-1.5 rounded-xl border border-stone-200 bg-white/75 p-3">
            <Text className="text-[12px] font-semibold leading-4 text-[#202a27]">#{order.id}</Text>

            <View className="flex-row items-center justify-between">
              <Text className="text-[9px] font-normal text-slate-500">{order.time} · Delivery</Text>
              <View className="rounded-full bg-emerald-100 px-1.5 py-0.5">
                <Text className="text-[7px] font-medium text-emerald-800">
                  {statusLabels[order.status]}
                </Text>
              </View>
            </View>

            <Text className="text-[9px] font-medium text-[#202a27]">{order.customer}</Text>
            <Text className="text-[9px] font-normal text-slate-500">{order.address}</Text>

            <View className="mt-0.5 flex-row items-center justify-between">
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() =>
                  router.push({ pathname: '/detail-pesanan-kurir', params: { id: order.id } })
                }
                className="items-center justify-center rounded-md bg-emerald-800 px-3 py-2"
              >
                <Text className="text-[10px] font-semibold text-white">
                  Lihat Detail & Tindakan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {visibleOrders.length === 0 && (
          <View className="items-center rounded-xl border border-stone-200 bg-white/60 px-4 py-8">
            <Text className="text-center text-[10px] text-slate-500">
              Belum ada pesanan {statusLabels[activeTab].toLowerCase()}.
            </Text>
          </View>
        )}

        {activeTab === 'proses' && (
          <Text className="px-1 text-[8px] text-slate-400">
            Pastikan pesanan lengkap sebelum mulai antar.
          </Text>
        )}

        {activeTab === 'proses' && (
          <View className="mt-2 gap-2 rounded-xl border border-stone-200 bg-white/75 p-3">
            <Text className="text-[10px] font-semibold text-[#202a27]">Menu Terlaris</Text>
            {['Nasi Bakar Ayam', 'Nasi Bakar Cumi', 'Es Teh Manis'].map((menu) => (
              <TouchableOpacity
                key={menu}
                accessibilityRole="link"
                onPress={() => router.push({ pathname: '/detail-menu-terlaris', params: { name: menu } })}
                className="flex-row items-center gap-2 py-1"
              >
                <Ionicons name="flame-outline" size={11} color="#176044" />
                <Text className="flex-1 text-[9px] text-slate-500">{menu}</Text>
                <Feather name="chevron-right" size={11} color="#a4ada8" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      <CourierBottomTabs activeTab="orders" />
    </ScreenWrapper>
  );
};

export default PesananSayaScreen;
