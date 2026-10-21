import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import CourierBottomTabs from '../../components/kurir/CourierBottomTabs';
import CourierPersistenceNotice from '../../components/kurir/CourierPersistenceNotice';
import { useCourierData } from '../../state/courier-orders';

const RiwayatPengantaranScreen = () => {
  const [activeFilter, setActiveFilter] = useState<'semua' | 'selesai'>('selesai');
  const router = useRouter();
  const { history, isHydrated, persistenceError } = useCourierData();
  const filteredHistory =
    activeFilter === 'selesai'
      ? history.filter((item) => item.status === 'selesai')
      : history;

  return (
    <ScreenWrapper
      className="flex-1 bg-[#fbf8f0]"
      style={{ width: '100%', maxWidth: 430, alignSelf: 'center' }}
    >
      {/* Header */}
      <View className="h-14 flex-row items-center gap-3 px-5">
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Kembali ke pesanan"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          }}
        >
          <Feather name="arrow-left" size={20} color="#18181b" />
        </TouchableOpacity>
        <Text className="text-[16px] font-semibold text-[#202a27]">Riwayat Pengantaran</Text>
      </View>

      <ScrollView className="flex-1 px-5 pb-4 pt-2" showsVerticalScrollIndicator={false}>
        <CourierPersistenceNotice isHydrated={isHydrated} error={persistenceError} />
        {/* Filter Tabs */}
        <View className="mb-3 flex-row gap-1.5">
          <TouchableOpacity
            className={`flex-1 items-center justify-center rounded-md px-1 py-2 ${
              activeFilter === 'semua' ? 'bg-emerald-800' : 'bg-white/60'
            }`}
            onPress={() => setActiveFilter('semua')}
          >
            <Text
              className={`text-[10px] font-medium ${
                activeFilter === 'semua' ? 'text-white' : 'text-gray-500'
              }`}
            >
              Semua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 items-center justify-center rounded-md px-1 py-2 ${
              activeFilter === 'selesai' ? 'bg-emerald-800' : 'bg-white/60'
            }`}
            onPress={() => setActiveFilter('selesai')}
          >
            <Text
              className={`text-[10px] font-medium ${
                activeFilter === 'selesai' ? 'text-white' : 'text-gray-500'
              }`}
            >
              Selesai
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card Container List */}
        <View className="rounded-xl border border-stone-200 bg-white/70 px-3 py-1">
          {filteredHistory.map((item) => (
            <View key={item.id} className="border-b border-stone-200 py-2.5 last:border-b-0">
              <View className="flex-row items-center justify-between">
                <Text className="text-[11px] font-semibold leading-4 text-[#202a27]">#{item.id}</Text>
                <View className="rounded-full bg-emerald-100 px-1.5 py-0.5">
                  <Text className="text-[7px] font-medium text-emerald-800">Selesai</Text>
                </View>
              </View>
              <Text className="mt-1 text-[8px] text-slate-500">{item.dateTime}</Text>
              <Text className="mt-1 text-[10px] font-medium text-[#202a27]">{item.customer}</Text>
              <Text className="mt-1 text-[8px] text-slate-500">{item.address}</Text>
              <TouchableOpacity
                accessibilityRole="link"
                onPress={() =>
                  router.push({ pathname: '/detail-pesanan', params: { id: item.id } })
                }
                className="mt-1"
              >
                <Text className="text-[8px] text-emerald-800 underline">Lihat Detail</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Info Footer / Status Bantuan */}
        <View className="flex-row items-center gap-2.5 py-5">
          <Feather name="truck" size={13} color="#89939a" />
          <Text className="text-[8px] font-normal text-slate-500">Go tersedia</Text>
          <Feather name="chevron-right" size={12} color="#89939a" />
        </View>
      </ScrollView>
      <CourierBottomTabs activeTab="history" />
    </ScreenWrapper>
  );
};

export default RiwayatPengantaranScreen;