// src/screens/pelanggan/Profil/ProfilScreen.tsx

import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import CustomerTabBar from '@/components/CustomerTabBar';
import { getCurrentCustomerProfile, type CustomerProfile } from '@/lib/customer-profile';
import { supabase } from '@/lib/supabase';

export default function ProfilScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadProfile = async () => {
        setIsLoading(true);
        try {
          const currentProfile = await getCurrentCustomerProfile();
          if (currentProfile.role !== 'pelanggan' || !currentProfile.is_aktif) {
            throw new Error(
              currentProfile.is_aktif
                ? 'Silakan masuk dengan akun pelanggan.'
                : 'Akun ini sedang dinonaktifkan. Hubungi pengelola.'
            );
          }
          if (isActive) setProfile(currentProfile);
        } catch (error) {
          console.error('Failed to load customer profile:', error);
          if (isActive) {
            const needsLogin =
              error instanceof Error && error.message === 'Silakan masuk terlebih dahulu.';
            Alert.alert(
              'Gagal memuat profil',
              error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat profil.',
              needsLogin
                ? [{ text: 'Login', onPress: () => router.replace('/login') }]
                : [{ text: 'OK' }]
            );
          }
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      void loadProfile();
      return () => {
        isActive = false;
      };
    }, [router])
  );

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/login');
    } catch (error) {
      console.error('Failed to sign out customer:', error);
      Alert.alert(
        'Gagal keluar',
        error instanceof Error ? error.message : 'Terjadi kesalahan saat keluar dari akun.'
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8F1]">
      {/* Header */}
      <View className="h-[52px] px-5 flex-row items-center gap-3">
        <Text className="flex-1 text-[#19231F] text-[17px] font-semibold">
          Profil
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Info Pengguna */}
        <View className="items-center pt-4 pb-[22px]">
          <View className="w-[58px] h-[58px] rounded-full border border-[#DDE1DD] justify-center items-center mb-2.5 bg-white/50">
            <Ionicons name="person-outline" size={36} color="#C8CECA" />
          </View>
          {isLoading ? (
            <ActivityIndicator size="small" color="#155A3D" />
          ) : (
            <>
              <Text className="text-[#19231F] text-[14px] font-semibold">
                {profile?.nama || 'Nama belum diatur'}
              </Text>
              <Text className="text-[#68736E] text-[10px] mt-1.5">
                {profile?.email || '-'}
              </Text>
              <Text className="text-[#68736E] text-[10px] mt-1">{profile?.no_hp || '-'}</Text>
            </>
          )}
        </View>

        {/* Menu Navigasi Profil */}
        <View className="bg-[#FFFFFF] rounded-[9px] border border-[#E1E4E1] px-[11px] flex-col overflow-hidden">
          {/* Data Diri (Edit Nama Pelanggan) */}
          <TouchableOpacity
            className="min-h-[39px] border-b border-[#EEF0EC] flex-row items-center gap-[9px] active:opacity-70"
            onPress={() => router.push('/edit-profil')}
          >
            <Ionicons name="person-outline" size={17} color="#68736E" />
            <Text className="flex-1 text-[#19231F] text-[11px]">Data Diri</Text>
            <Ionicons name="chevron-forward" size={16} color="#A9B0AC" />
          </TouchableOpacity>

          {/* Alamat Saya */}
          <TouchableOpacity
            className="min-h-[39px] border-b border-[#EEF0EC] flex-row items-center gap-[9px] active:opacity-70"
            onPress={() => router.push('/alamat-tersimpan')}
          >
            <Ionicons name="location-outline" size={17} color="#68736E" />
            <Text className="flex-1 text-[#19231F] text-[11px]">Alamat Saya</Text>
            <Ionicons name="chevron-forward" size={16} color="#A9B0AC" />
          </TouchableOpacity>

          {/* Riwayat Pesanan */}
          <TouchableOpacity
            className="min-h-[39px] border-b border-[#EEF0EC] flex-row items-center gap-[9px] active:opacity-70"
            onPress={() => router.push('/orders' as any)}
          >
            <Ionicons name="receipt-outline" size={17} color="#68736E" />
            <Text className="flex-1 text-[#19231F] text-[11px]">Riwayat Pesanan</Text>
            <Ionicons name="chevron-forward" size={16} color="#A9B0AC" />
          </TouchableOpacity>
          {/* Pengaturan */}
          <TouchableOpacity
            className="min-h-[39px] border-b border-[#EEF0EC] flex-row items-center gap-[9px] active:opacity-70"
            onPress={() => {}}
          >
            <Ionicons name="settings-outline" size={17} color="#68736E" />
            <Text className="flex-1 text-[#19231F] text-[11px]">Pengaturan</Text>
            <Ionicons name="chevron-forward" size={16} color="#A9B0AC" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            className="min-h-[39px] flex-row items-center gap-[9px] active:opacity-70"
            onPress={() => void handleLogout()}
            disabled={isLoggingOut}
          >
            <Ionicons name="log-out-outline" size={17} color="#D65A55" />
            <Text className="flex-1 text-[#D65A55] text-[11px]">
              {isLoggingOut ? 'Keluar...' : 'Logout'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#A9B0AC" />
          </TouchableOpacity>

        </View>

      </ScrollView>
      {/* Jangan lupa tampilkan tab bar di bawah jika ini layar utama profil */}
      <CustomerTabBar />
    </SafeAreaView>
  );
}