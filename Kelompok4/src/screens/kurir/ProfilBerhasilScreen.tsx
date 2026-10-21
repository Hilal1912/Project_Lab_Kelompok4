import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import CourierBottomTabs from '../../components/kurir/CourierBottomTabs';
import CourierPersistenceNotice from '../../components/kurir/CourierPersistenceNotice';
import { useCourierData } from '../../state/courier-orders';

export default function ProfilBerhasilScreen() {
  const { profile, isHydrated, persistenceError } = useCourierData();
  const router = useRouter();

  return (
    <ScreenWrapper className="flex-1 bg-[#fbf8f0]" style={{ width: '100%', maxWidth: 430, alignSelf: 'center' }}>
      <View className="h-14 flex-row items-center gap-3 px-5">
        <TouchableOpacity accessibilityRole="button" onPress={() => router.replace('/detail-profil-kurir')}>
          <Feather name="arrow-left" size={19} color="#202a27" />
        </TouchableOpacity>
        <Text className="text-[16px] font-semibold text-[#202a27]">Informasi Pribadi</Text>
      </View>
      <View className="flex-1 px-4 pt-8">
        <CourierPersistenceNotice isHydrated={isHydrated} error={persistenceError} />
        <View className="mb-4 items-center">
          <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <Ionicons name="checkmark-circle-outline" size={32} color="#176044" />
          </View>
          <Text className="text-[17px] font-semibold text-[#202a27]">Profil Berhasil Diperbarui</Text>
          <Text className="mt-2 text-center text-[12px] leading-5 text-slate-500">
            Informasi pribadi Anda telah disimpan.
          </Text>
        </View>
        <View className="mb-3 flex-row items-center rounded-xl border border-stone-200 bg-white/80 p-4">
          <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-[#e1f1e2]">
            <Feather name="user" size={20} color="#176044" />
          </View>
          <View>
            <Text className="text-[13px] font-semibold text-[#202a27]">{profile.name}</Text>
            <Text className="mt-1 text-[10px] text-slate-500">ID Kurir · {profile.courierId}</Text>
          </View>
        </View>
        <View className="mb-4 rounded-xl border border-stone-200 bg-white/80 p-4">
          <Text className="mb-3 text-[14px] font-semibold text-[#202a27]">Informasi Pribadi</Text>
          <Text className="mb-1 text-[11px] text-slate-400">Nomor telepon</Text>
          <Text className="mb-3 text-[12px] text-[#202a27]">{profile.phone}</Text>
          <Text className="mb-1 text-[11px] text-slate-400">Email</Text>
          <Text className="mb-3 text-[12px] text-[#202a27]">{profile.email}</Text>
          <Text className="mb-1 text-[11px] text-slate-400">Wilayah pengantaran</Text>
          <Text className="text-[12px] text-[#202a27]">{profile.region}</Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.replace('/detail-profil-kurir')}
          className="items-center rounded-lg bg-emerald-800 py-3"
        >
          <Text className="text-[13px] font-semibold text-white">Kembali ke Detail Profil</Text>
        </TouchableOpacity>
      </View>
      <CourierBottomTabs activeTab="profile" />
    </ScreenWrapper>
  );
}
