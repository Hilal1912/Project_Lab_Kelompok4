import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import CourierBottomTabs from '../../components/kurir/CourierBottomTabs';
import CourierPersistenceNotice from '../../components/kurir/CourierPersistenceNotice';
import { useCourierData } from '../../state/courier-orders';

export default function ProfilKurirScreen() {
  const { profile, isHydrated, persistenceError } = useCourierData();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const router = useRouter();

  return (
    <ScreenWrapper
      className="flex-1 bg-[#fbf8f0]"
      style={{ width: '100%', maxWidth: 430, alignSelf: 'center' }}
    >
      <View className="h-14 flex-row items-center px-5">
        <Text className="text-[17px] font-semibold text-[#202a27]">Profil Kurir</Text>
      </View>

      <ScrollView className="flex-1 px-4 pb-4 pt-1" showsVerticalScrollIndicator={false}>
        <CourierPersistenceNotice isHydrated={isHydrated} error={persistenceError} />
        <TouchableOpacity
          accessibilityRole="link"
          onPress={() => router.push('/detail-profil-kurir')}
          className="mb-3 flex-row items-center rounded-xl border border-stone-200 bg-white/80 p-4"
        >
          <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-[#e1f1e2]">
            <Feather name="user" size={22} color="#176044" />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-semibold text-[#202a27]">{profile.name}</Text>
            <Text className="mt-1 text-[11px] text-slate-500">ID Kurir · {profile.courierId}</Text>
          </View>
          <Feather name="chevron-right" size={17} color="#89939a" />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="link"
          onPress={() => router.push('/status-kurir')}
          className="mb-3 flex-row items-center rounded-xl border border-stone-200 bg-white/80 p-4"
        >
          <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
            <Ionicons name="radio-button-on" size={17} color="#176044" />
          </View>
          <Text className="flex-1 text-[13px] text-[#202a27]">Status kurir</Text>
          <View className="mr-2 rounded-full bg-emerald-100 px-2.5 py-1">
            <Text className="text-[10px] font-medium text-emerald-800">
              {profile.isAvailable ? 'Aktif' : 'Tidak tersedia'}
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color="#89939a" />
        </TouchableOpacity>

        <View className="mb-3 rounded-xl border border-stone-200 bg-white/80 p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-[14px] font-semibold text-[#202a27]">Informasi Pribadi</Text>
            <TouchableOpacity
              accessibilityRole="link"
              onPress={() => router.push('/ubah-profil-kurir')}
            >
              <Text className="text-[12px] font-medium text-emerald-800 underline">Ubah</Text>
            </TouchableOpacity>
          </View>
          <Text className="mb-1 text-[11px] text-slate-400">Nomor telepon</Text>
          <Text className="mb-3 text-[13px] text-[#202a27]">{profile.phone}</Text>
          <Text className="mb-1 text-[11px] text-slate-400">Email</Text>
          <Text className="mb-3 text-[13px] text-[#202a27]">{profile.email}</Text>
          <Text className="mb-1 text-[11px] text-slate-400">Wilayah pengantaran</Text>
          <Text className="text-[13px] text-[#202a27]">{profile.region}</Text>
        </View>

        <TouchableOpacity
          accessibilityRole="link"
          onPress={() => router.push('/informasi-kendaraan')}
          className="mb-3 flex-row items-center rounded-xl border border-stone-200 bg-white/80 p-4"
        >
          <Feather name="truck" size={17} color="#176044" />
          <View className="ml-3 flex-1">
            <Text className="text-[13px] font-medium text-[#202a27]">Informasi Kendaraan</Text>
            <Text className="mt-1 text-[11px] text-slate-500">
              {profile.vehicleName} · {profile.plate}
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color="#89939a" />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="link"
          onPress={() => router.push('/riwayat-pengantaran')}
          className="mb-4 flex-row items-center rounded-xl border border-stone-200 bg-white/80 p-4"
        >
          <Feather name="clipboard" size={17} color="#75817b" />
          <Text className="ml-3 flex-1 text-[13px] text-[#202a27]">Riwayat Pengantaran</Text>
          <Feather name="chevron-right" size={16} color="#89939a" />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => setShowLogoutConfirmation(true)}
          className="items-center rounded-lg border border-emerald-800 py-3"
        >
          <Text className="text-[13px] font-medium text-emerald-800">Keluar</Text>
        </TouchableOpacity>
      </ScrollView>

      <CourierBottomTabs activeTab="profile" />

      <Modal
        visible={showLogoutConfirmation}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutConfirmation(false)}
      >
        <View className="flex-1 justify-center bg-black/35 px-6">
          <View className="rounded-2xl bg-[#fbf8f0] p-5">
            <Text className="mb-2 text-[17px] font-semibold text-[#202a27]">Keluar dari akun?</Text>
            <Text className="mb-5 text-[13px] leading-5 text-slate-500">
              Anda akan kembali ke halaman Login Kurir. Masuk kembali untuk melihat dan mengambil pesanan.
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => setShowLogoutConfirmation(false)}
                className="flex-1 items-center rounded-lg border border-emerald-800 py-3"
              >
                <Text className="text-[13px] font-medium text-emerald-900">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => {
                  setShowLogoutConfirmation(false);
                  router.replace('/login-kurir');
                }}
                className="flex-1 items-center rounded-lg bg-emerald-800 py-3"
              >
                <Text className="text-[13px] font-semibold text-white">Keluar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
