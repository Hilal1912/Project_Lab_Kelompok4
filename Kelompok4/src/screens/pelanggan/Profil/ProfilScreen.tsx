import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomerTabBar from '@/components/CustomerTabBar';

export default function ProfilScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-orange-50">

      {/* Header */}
      <View className="h-16 px-6 flex-row items-center gap-4">
        <TouchableOpacity
          className="w-8 h-8 justify-center"
          onPress={() => router.push('/home')}
        >
          <Feather name="arrow-left" size={24} color="#18181b" />
        </TouchableOpacity>
        <Text className="text-zinc-900 text-xl font-semibold">Profil</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Info Pengguna */}
        <View className="items-center px-6 pt-6 pb-6">
          <View className="w-20 h-20 rounded-full border border-zinc-400 justify-center items-center mb-4 bg-orange-50">
            <Feather name="user" size={32} color="#a1a1aa" />
          </View>
          <Text className="text-zinc-900 text-2xl font-semibold leading-8 mb-1">Nurkhotimah</Text>
          <Text className="text-zinc-900 text-base font-normal leading-6">nurkhotimah@email.com</Text>
          <Text className="text-zinc-900 text-base font-normal leading-6">0812 3456 7890</Text>
        </View>

        {/* Menu Navigasi Profil */}
        <View className="mx-6 bg-white/60 rounded-xl border border-neutral-200 flex-col overflow-hidden">

          {/* Riwayat Pesanan */}
          <TouchableOpacity
            className="px-4 py-4 border-b border-neutral-200 flex-row items-center gap-4 active:bg-white"
            onPress={() => router.push('/orders')}
          >
            <Feather name="clipboard" size={20} color="#18181b" />
            <Text className="flex-1 text-zinc-900 text-base font-normal">Riwayat Pesanan</Text>
            <Feather name="chevron-right" size={20} color="#6b7280" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            className="px-4 py-4 flex-row items-center gap-4 active:bg-white"
            onPress={() => router.replace('/')}
          >
            <Feather name="log-out" size={20} color="#ef4444" />
            <Text className="flex-1 text-red-500 text-base font-normal">Logout</Text>
            <Feather name="chevron-right" size={20} color="#6b7280" />
          </TouchableOpacity>

        </View>

      </ScrollView>
      <CustomerTabBar />
    </SafeAreaView>
  );
}