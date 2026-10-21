import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import CourierBottomTabs from '../../components/kurir/CourierBottomTabs';
import CourierPersistenceNotice from '../../components/kurir/CourierPersistenceNotice';
import { updateCourierProfile, useCourierData } from '../../state/courier-orders';

export default function InformasiKendaraanScreen() {
  const { profile, isHydrated, persistenceError } = useCourierData();
  const [draft, setDraft] = useState<Partial<typeof profile>>({});
  const [error, setError] = useState('');
  const router = useRouter();
  const vehicleType = draft.vehicleType ?? profile.vehicleType;
  const vehicleName = draft.vehicleName ?? profile.vehicleName;
  const plate = draft.plate ?? profile.plate;
  const region = draft.region ?? profile.region;

  function saveVehicle() {
    if (!vehicleType.trim() || !vehicleName.trim() || !plate.trim() || !region.trim()) {
      setError('Semua informasi kendaraan wajib diisi.');
      return;
    }
    updateCourierProfile({
      vehicleType: vehicleType.trim(),
      vehicleName: vehicleName.trim(),
      plate: plate.trim().toUpperCase(),
      region: region.trim(),
    });
    router.replace('/detail-profil-kurir');
  }

  const fields = [
    { label: 'Jenis kendaraan', value: vehicleType, onChangeText: (value: string) => setDraft((current) => ({ ...current, vehicleType: value })) },
    { label: 'Merek dan tipe', value: vehicleName, onChangeText: (value: string) => setDraft((current) => ({ ...current, vehicleName: value })) },
    { label: 'Nomor polisi', value: plate, onChangeText: (value: string) => setDraft((current) => ({ ...current, plate: value })) },
    { label: 'Wilayah operasional', value: region, onChangeText: (value: string) => setDraft((current) => ({ ...current, region: value })) },
  ];

  return (
    <ScreenWrapper className="flex-1 bg-[#fbf8f0]" style={{ width: '100%', maxWidth: 430, alignSelf: 'center' }}>
      <View className="h-14 flex-row items-center gap-3 px-5">
        <TouchableOpacity accessibilityRole="button" onPress={() => router.back()}>
          <Feather name="arrow-left" size={19} color="#202a27" />
        </TouchableOpacity>
        <Text className="text-[16px] font-semibold text-[#202a27]">Informasi Kendaraan</Text>
      </View>
      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 20 }}>
        <CourierPersistenceNotice isHydrated={isHydrated} error={persistenceError} />
        <View className="mb-3 flex-row items-center rounded-xl border border-stone-200 bg-white/80 p-4">
          <Feather name="truck" size={20} color="#176044" />
          <View className="ml-3 flex-1">
            <Text className="text-[13px] font-medium text-[#202a27]">{profile.vehicleName}</Text>
            <Text className="mt-1 text-[11px] text-slate-500">
              Kendaraan pengantaran {profile.name} · {profile.courierId}
            </Text>
          </View>
          <View className="rounded-full bg-emerald-100 px-2 py-1">
            <Text className="text-[10px] text-emerald-800">Terdaftar</Text>
          </View>
        </View>
        <View className="rounded-xl border border-stone-200 bg-white/80 p-4">
          <Text className="mb-4 text-[14px] font-semibold text-[#202a27]">Data Kendaraan</Text>
          {fields.map((field) => (
            <View key={field.label} className="mb-3">
              <Text className="mb-1.5 text-[11px] text-slate-500">{field.label}</Text>
              <TextInput
                accessibilityLabel={field.label}
                value={field.value}
                onChangeText={field.onChangeText}
                className="rounded-lg border border-stone-200 bg-white px-3 py-3 text-[13px] text-[#202a27]"
              />
            </View>
          ))}
        </View>
        <Text className="my-3 text-[11px] leading-4 text-slate-500">
          Pastikan data sesuai dengan kendaraan yang digunakan untuk mengantar pesanan.
        </Text>
        {error ? <Text accessibilityRole="alert" className="mb-3 text-[12px] text-red-700">{error}</Text> : null}
        <TouchableOpacity
          accessibilityRole="button"
          disabled={!isHydrated}
          onPress={saveVehicle}
          className="mb-2 items-center rounded-lg bg-emerald-800 py-3"
        >
          <Text className="text-[13px] font-semibold text-white">Simpan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.back()}
          className="items-center rounded-lg border border-emerald-800 py-3"
        >
          <Text className="text-[13px] font-medium text-emerald-800">Batal</Text>
        </TouchableOpacity>
      </ScrollView>
      <CourierBottomTabs activeTab="profile" />
    </ScreenWrapper>
  );
}
