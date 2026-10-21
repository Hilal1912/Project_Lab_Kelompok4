import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import CourierBottomTabs from '../../components/kurir/CourierBottomTabs';
import { updateCourierProfile, useCourierData } from '../../state/courier-orders';

export default function EditProfilKurirScreen() {
  const { profile, isHydrated } = useCourierData();
  const [draft, setDraft] = useState<Partial<typeof profile>>({});
  const [error, setError] = useState('');
  const router = useRouter();
  const name = draft.name ?? profile.name;
  const phone = draft.phone ?? profile.phone;
  const email = draft.email ?? profile.email;
  const region = draft.region ?? profile.region;

  function saveProfile() {
    if (!name.trim() || !phone.trim() || !region.trim()) {
      setError('Nama, nomor telepon, dan wilayah wajib diisi.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Masukkan alamat email yang valid.');
      return;
    }

    updateCourierProfile({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      region: region.trim(),
    });
    router.replace('/profil-berhasil');
  }

  const fields = [
    { label: 'Nama lengkap', value: name, onChangeText: (value: string) => setDraft((current) => ({ ...current, name: value })), placeholder: 'Nama lengkap' },
    { label: 'Nomor telepon', value: phone, onChangeText: (value: string) => setDraft((current) => ({ ...current, phone: value })), placeholder: 'Nomor telepon', keyboardType: 'phone-pad' as const },
    { label: 'Email', value: email, onChangeText: (value: string) => setDraft((current) => ({ ...current, email: value })), placeholder: 'Email', keyboardType: 'email-address' as const },
    { label: 'Wilayah pengantaran', value: region, onChangeText: (value: string) => setDraft((current) => ({ ...current, region: value })), placeholder: 'Wilayah' },
  ];

  return (
    <ScreenWrapper className="flex-1 bg-[#fbf8f0]" style={{ width: '100%', maxWidth: 430, alignSelf: 'center' }}>
      <View className="h-14 flex-row items-center gap-3 px-5">
        <TouchableOpacity accessibilityRole="button" onPress={() => router.back()}>
          <Feather name="arrow-left" size={19} color="#202a27" />
        </TouchableOpacity>
        <Text className="text-[16px] font-semibold text-[#202a27]">Informasi Pribadi</Text>
      </View>
      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 20 }}>
        <Text className="mb-4 text-[12px] leading-5 text-slate-500">
          Ubah informasi pribadi Anda. Pastikan nomor telepon dapat dihubungi.
        </Text>
        <View className="rounded-xl border border-stone-200 bg-white/80 p-4">
          <Text className="mb-4 text-[14px] font-semibold text-[#202a27]">Ubah Informasi Pribadi</Text>
          {fields.map((field) => (
            <View key={field.label} className="mb-3">
              <Text className="mb-1.5 text-[11px] text-slate-500">{field.label}</Text>
              <TextInput
                accessibilityLabel={field.label}
                value={field.value}
                onChangeText={field.onChangeText}
                placeholder={field.placeholder}
                keyboardType={field.keyboardType}
                autoCapitalize={field.label === 'Email' ? 'none' : 'words'}
                className="rounded-lg border border-stone-200 bg-white px-3 py-3 text-[13px] text-[#202a27]"
              />
            </View>
          ))}
          <Text className="mb-4 text-[11px] text-slate-400">ID Kurir {profile.courierId} tidak dapat diubah.</Text>
          {error ? <Text accessibilityRole="alert" className="mb-3 text-[12px] text-red-700">{error}</Text> : null}
          <TouchableOpacity
            accessibilityRole="button"
            disabled={!isHydrated}
            onPress={saveProfile}
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
        </View>
      </ScrollView>
      <CourierBottomTabs activeTab="profile" />
    </ScreenWrapper>
  );
}
