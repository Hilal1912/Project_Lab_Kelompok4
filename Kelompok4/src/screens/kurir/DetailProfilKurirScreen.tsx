import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import CourierBottomTabs from '../../components/kurir/CourierBottomTabs';
import CourierPersistenceNotice from '../../components/kurir/CourierPersistenceNotice';
import { useCourierData } from '../../state/courier-orders';

export default function DetailProfilKurirScreen() {
  const { profile, isHydrated, persistenceError } = useCourierData();
  const router = useRouter();

  return (
    <ScreenWrapper className="flex-1 bg-[#fbf8f0]" style={{ width: '100%', maxWidth: 430, alignSelf: 'center' }}>
      <View className="h-14 flex-row items-center gap-3 px-5">
        <TouchableOpacity accessibilityRole="button" onPress={() => router.back()}>
          <Feather name="arrow-left" size={19} color="#202a27" />
        </TouchableOpacity>
        <Text className="text-[16px] font-semibold text-[#202a27]">Detail Profil</Text>
      </View>
      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 20 }}>
        <CourierPersistenceNotice isHydrated={isHydrated} error={persistenceError} />
        <View className="mb-3 flex-row items-center rounded-xl border border-stone-200 bg-white/80 p-4">
          <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-[#e1f1e2]">
            <Feather name="user" size={22} color="#176044" />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-semibold text-[#202a27]">{profile.name}</Text>
            <Text className="mt-1 text-[11px] text-slate-500">ID Kurir · {profile.courierId}</Text>
          </View>
          <View className="items-end">
            <Text className="text-[10px] text-slate-400">Status kurir</Text>
            <Text className="mt-1 text-[11px] font-medium text-emerald-800">
              {profile.isAvailable ? 'Aktif' : 'Tidak tersedia'}
            </Text>
          </View>
        </View>

        <View className="mb-3 rounded-xl border border-stone-200 bg-white/80 p-4">
          <Text className="mb-3 text-[14px] font-semibold text-[#202a27]">Informasi Pribadi</Text>
          <Text className="mb-1 text-[11px] text-slate-400">Nomor telepon</Text>
          <Text className="mb-3 text-[13px] text-[#202a27]">{profile.phone}</Text>
          <Text className="mb-1 text-[11px] text-slate-400">Email</Text>
          <Text className="mb-3 text-[13px] text-[#202a27]">{profile.email}</Text>
          <Text className="mb-1 text-[11px] text-slate-400">Wilayah pengantaran</Text>
          <Text className="mb-4 text-[13px] text-[#202a27]">{profile.region}</Text>
          <TouchableOpacity
            accessibilityRole="link"
            onPress={() => router.push('/ubah-profil-kurir')}
            className="items-center rounded-lg border border-emerald-800 py-3"
          >
            <Text className="text-[12px] font-medium text-emerald-800">Ubah Informasi Pribadi</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-3 rounded-xl border border-stone-200 bg-white/80 p-4">
          <Text className="mb-3 text-[14px] font-semibold text-[#202a27]">Informasi Kurir</Text>
          <TouchableOpacity
            accessibilityRole="link"
            onPress={() => router.push('/informasi-kendaraan')}
            className="flex-row items-center border-b border-stone-100 py-3"
          >
            <Feather name="truck" size={17} color="#176044" />
            <View className="ml-3 flex-1">
              <Text className="text-[12px] font-medium text-[#202a27]">Informasi Kendaraan</Text>
              <Text className="mt-1 text-[11px] text-slate-500">
                {profile.vehicleName} · {profile.plate}
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color="#89939a" />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="link"
            onPress={() => router.push('/status-kurir')}
            className="flex-row items-center py-3"
          >
            <Feather name="user-check" size={17} color="#176044" />
            <View className="ml-3 flex-1">
              <Text className="text-[12px] font-medium text-[#202a27]">Status Kurir</Text>
              <Text className="mt-1 text-[11px] text-slate-500">
                {profile.isAvailable ? 'Aktif · Bersedia menerima pesanan' : 'Tidak tersedia'}
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color="#89939a" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.replace('/profil-kurir')}
          className="items-center rounded-lg border border-emerald-800 py-3"
        >
          <Text className="text-[12px] font-medium text-emerald-800">Kembali ke Profil Kurir</Text>
        </TouchableOpacity>
      </ScrollView>
      <CourierBottomTabs activeTab="profile" />
    </ScreenWrapper>
  );
}
