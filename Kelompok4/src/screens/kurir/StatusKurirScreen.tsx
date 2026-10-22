import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import CourierBottomTabs from '../../components/kurir/CourierBottomTabs';
import CourierPersistenceNotice from '../../components/kurir/CourierPersistenceNotice';
import { updateCourierProfile, useCourierData } from '../../state/courier-orders';

export default function StatusKurirScreen() {
  const { profile, isHydrated, persistenceError } = useCourierData();
  const [selected, setSelected] = useState<boolean | null>(null);
  const router = useRouter();
  const selectedStatus = selected ?? profile.isAvailable;

  function saveStatus() {
    updateCourierProfile({ isAvailable: selectedStatus });
    router.replace('/detail-profil-kurir');
  }

  return (
    <ScreenWrapper className="flex-1 bg-[#fbf8f0]" style={{ width: '100%', maxWidth: 430, alignSelf: 'center' }}>
      <View className="h-14 flex-row items-center gap-3 px-5">
        <TouchableOpacity accessibilityRole="button" onPress={() => router.back()}>
          <Feather name="arrow-left" size={19} color="#202a27" />
        </TouchableOpacity>
        <Text className="text-[16px] font-semibold text-[#202a27]">Status Kurir</Text>
      </View>
      <View className="flex-1 px-4 pt-2">
        <CourierPersistenceNotice isHydrated={isHydrated} error={persistenceError} />
        <View className="mb-4 flex-row items-center rounded-xl border border-stone-200 bg-white/80 p-4">
          <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-[#e1f1e2]">
            <Feather name="user" size={20} color="#176044" />
          </View>
          <View className="flex-1">
            <Text className="text-[13px] font-semibold text-[#202a27]">{profile.name}</Text>
            <Text className="mt-1 text-[10px] text-slate-500">ID Kurir · {profile.courierId}</Text>
          </View>
          <View className="items-end">
            <Text className="text-[10px] text-slate-400">Status saat ini</Text>
            <Text className="mt-1 text-[10px] font-medium text-emerald-800">
              {profile.isAvailable ? 'Aktif' : 'Tidak tersedia'}
            </Text>
          </View>
        </View>
        <Text className="mb-4 text-[12px] leading-5 text-slate-500">
          Atur ketersediaan Anda untuk menerima pesanan pengantaran.
        </Text>

        {[true, false].map((available) => {
          const isSelected = selectedStatus === available;
          return (
            <TouchableOpacity
              key={String(available)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              onPress={() => setSelected(available)}
              className={`mb-3 flex-row items-start rounded-xl border p-4 ${
                isSelected ? 'border-emerald-700 bg-emerald-50' : 'border-stone-200 bg-white/80'
              }`}
            >
              <Ionicons
                name={isSelected ? 'radio-button-on' : 'ellipse-outline'}
                size={18}
                color={isSelected ? '#176044' : '#9aa39e'}
              />
              <View className="ml-3 flex-1">
                <Text className="text-[13px] font-semibold text-[#202a27]">
                  {available ? 'Tersedia' : 'Tidak tersedia'}
                </Text>
                <Text className="mt-1 text-[11px] leading-4 text-slate-500">
                  {available
                    ? 'Aktif dan siap menerima pesanan baru.'
                    : 'Istirahat dan tidak menerima pesanan baru.'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View className="mb-4 flex-row items-center gap-2">
          <Ionicons name="checkmark-circle-outline" size={16} color="#176044" />
          <Text className="text-[11px] text-slate-500">
            Pilihan status akan disimpan setelah Anda menekan Simpan Status.
          </Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={!isHydrated}
          onPress={saveStatus}
          className="mb-2 items-center rounded-lg bg-emerald-800 py-3"
        >
          <Text className="text-[13px] font-semibold text-white">Simpan Status</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.replace('/detail-profil-kurir')}
          className="items-center rounded-lg border border-emerald-800 py-3"
        >
          <Text className="text-[13px] font-medium text-emerald-800">Kembali ke Detail Profil</Text>
        </TouchableOpacity>
      </View>
      <CourierBottomTabs activeTab="profile" />
    </ScreenWrapper>
  );
}
