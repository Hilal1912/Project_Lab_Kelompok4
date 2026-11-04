import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getCurrentCustomerProfile, type CustomerProfile } from '@/lib/customer-profile';
import { supabase } from '@/lib/supabase';

export default function EditNamaPelangganScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [namaLengkap, setNamaLengkap] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const currentProfile = await getCurrentCustomerProfile();
        if (isMounted) {
          setProfile(currentProfile);
          setNamaLengkap(currentProfile.nama);
        }
      } catch (error) {
        console.error('Failed to load customer profile:', error);
        if (isMounted) {
          const needsLogin =
            error instanceof Error && error.message === 'Silakan masuk terlebih dahulu.';
          Alert.alert(
            'Gagal memuat profil',
            error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat profil.',
            needsLogin ? [{ text: 'Login', onPress: () => router.replace('/login') }] : undefined
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadProfile();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSave = async () => {
    const nama = namaLengkap.trim();
    if (!nama) {
      Alert.alert('Nama belum diisi', 'Nama lengkap tidak boleh kosong.');
      return;
    }
    if (!profile || isSaving) return;

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ nama })
        .eq('id', profile.id)
        .select('id')
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Profil tidak ditemukan atau tidak dapat diperbarui.');

      Alert.alert('Berhasil', 'Nama profil berhasil diperbarui.');
      router.back();
    } catch (error) {
      console.error('Failed to update customer name:', error);
      Alert.alert(
        'Gagal menyimpan nama',
        error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan perubahan.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8F1]">
      <View className="flex-row items-center px-6 py-4 gap-4">
        <TouchableOpacity onPress={() => router.back()} className="p-1 -ml-1">
          <Ionicons name="arrow-back" size={24} color="#18181b" />
        </TouchableOpacity>
        <Text className="flex-1 text-[#19231F] text-[22px] font-semibold font-['Inter'] leading-7">
          Edit Nama Pelanggan
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#155A3D" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 pt-2" contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="pt-6 pb-4 flex-col items-center gap-4">
            <View className="w-20 h-20 rounded-full border-[1.5px] border-[#79828A] justify-center items-center bg-white/50">
              <Ionicons name="person-outline" size={40} color="#79828A" />
            </View>
            <View className="flex-col items-center gap-1">
              <Text className="text-center text-[#19231F] text-[24px] font-semibold font-['Inter']">
                {namaLengkap || 'Nama Kosong'}
              </Text>
              <Text className="text-[#79828A] text-[16px]">{profile?.email ?? '-'}</Text>
              <Text className="text-[#79828A] text-[16px]">{profile?.no_hp ?? '-'}</Text>
            </View>
          </View>

          <View className="p-4 bg-white/60 rounded-xl border border-[#E1E4E1] flex-col gap-3.5 mb-6">
            <Text className="text-[#19231F] text-[16px] font-semibold">Data Diri</Text>
            <View className="flex-col gap-2">
              <Text className="text-[#19231F] text-[14px] font-medium">Nama Lengkap</Text>
              <View className="min-h-[48px] p-3 bg-white/70 rounded-lg border border-[#E1E4E1] justify-center">
                <TextInput
                  className="text-[#19231F] text-[14px] p-0 m-0"
                  value={namaLengkap}
                  onChangeText={setNamaLengkap}
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor="#79828A"
                  autoCapitalize="words"
                />
              </View>
            </View>
          </View>

          <View className="flex-col gap-2.5 mt-2">
            <TouchableOpacity
              className={`w-full h-[56px] rounded-lg justify-center items-center ${isSaving || !profile ? 'bg-gray-400' : 'bg-[#155A3D]'}`}
              onPress={handleSave}
              disabled={isSaving || !profile}
            >
              <Text className="text-white text-[16px] font-semibold">
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full h-[48px] bg-white/70 rounded-lg border border-[#E1E4E1] justify-center items-center"
              onPress={() => router.back()}
            >
              <Text className="text-[#155A3D] text-[14px] font-semibold">Batal</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
