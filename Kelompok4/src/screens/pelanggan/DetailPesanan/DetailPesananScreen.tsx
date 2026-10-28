import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DetailPesananScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8F1]">
      <View className="flex-row justify-between items-center px-6 py-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Feather name="arrow-left" size={24} color="#19231F" />
        </TouchableOpacity>
        <Text className="text-[#19231F] text-[22px] font-semibold">Detail Pesanan</Text>
        <TouchableOpacity className="p-2 -mr-2">
          <Feather name="shopping-cart" size={24} color="#79828A" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        
        {/* Header Info */}
        <View className="mb-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[#19231F] text-[20px] font-semibold">#NB20250601</Text>
            <Text className="text-[#79828A] text-[13px]">1 Jun 2025</Text>
          </View>
          <View className="flex-row mb-3">
            <View className="bg-[#DFF1DE] px-2.5 py-1 rounded-lg">
              <Text className="text-[#155A3D] text-[11px] font-medium">Menunggu Konfirmasi</Text>
            </View>
          </View>
          <Text className="text-[#79828A] text-[13px] leading-5">
            Pesananmu sedang menunggu konfirmasi dari Nasi Bakar Ibu Efri.
          </Text>
        </View>

        {/* Timeline / Alur Pesanan */}
        <View className="bg-white/60 border border-[#E1E4E1] rounded-xl p-4 mb-5">
          <Text className="text-[#19231F] text-[17px] font-semibold mb-5">Alur Pesanan</Text>
          
          <View className="flex-col">
            {/* Step 1: Active */}
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-[#DFF1DE] rounded-full border border-[#155A3D] justify-center items-center">
                  <Feather name="clock" size={12} color="#155A3D" />
                </View>
                <Text className="text-[#155A3D] text-[14px] font-semibold ml-3">Menunggu Konfirmasi</Text>
              </View>
              <Text className="text-[#155A3D] text-[11px]">Saat ini</Text>
            </View>
            <View className="w-[1px] h-5 bg-[#E1E4E1] ml-3 mb-1" />

            {/* Step 2: Inactive */}
            <View className="flex-row items-center mb-1">
              <View className="w-6 h-6 bg-white/60 rounded-full border border-[#E1E4E1] justify-center items-center">
                <View className="w-1.5 h-1.5 bg-[#B7BCBA] rounded-full" />
              </View>
              <Text className="text-[#79828A] text-[14px] ml-3">Sedang Disiapkan</Text>
            </View>
            <View className="w-[1px] h-5 bg-[#E1E4E1] ml-3 mb-1" />

            {/* Step 3: Inactive */}
            <View className="flex-row items-center mb-1">
              <View className="w-6 h-6 bg-white/60 rounded-full border border-[#E1E4E1] justify-center items-center">
                <View className="w-1.5 h-1.5 bg-[#B7BCBA] rounded-full" />
              </View>
              <Text className="text-[#79828A] text-[14px] ml-3">Dalam Pengiriman</Text>
            </View>
            <View className="w-[1px] h-5 bg-[#E1E4E1] ml-3 mb-1" />

            {/* Step 4: Inactive */}
            <View className="flex-row items-center">
              <View className="w-6 h-6 bg-white/60 rounded-full border border-[#E1E4E1] justify-center items-center">
                <View className="w-1.5 h-1.5 bg-[#B7BCBA] rounded-full" />
              </View>
              <Text className="text-[#79828A] text-[14px] ml-3">Selesai</Text>
            </View>
          </View>
        </View>

        {/* Pengiriman & Pembayaran */}
        <View className="bg-white/60 border border-[#E1E4E1] rounded-xl p-4 mb-5">
          <Text className="text-[#19231F] text-[17px] font-semibold mb-4">Pengiriman & Pembayaran</Text>
          <View className="flex-row justify-between mb-3">
            <Text className="text-[#19231F] text-[14px]">Jenis order</Text>
            <Text className="text-[#19231F] text-[14px]">Delivery</Text>
          </View>
          
          <View className="bg-[#F3F6EE] border border-[#E1E4E1] rounded-lg p-3 flex-row items-start mb-4">
            <Feather name="map-pin" size={16} color="#155A3D" className="mt-0.5" />
            <View className="flex-1 ml-2.5">
              <Text className="text-[#19231F] text-[14px] font-semibold">Nurkhotimah · Rumah</Text>
              <Text className="text-[#79828A] text-[13px] leading-5 mt-1">Jl. Melati No. 12, Kec. Harjamukti, Kota Cirebon</Text>
            </View>
          </View>
          
          <View className="h-[1px] bg-[#E1E4E1] w-full mb-3" />
          
          <View className="flex-row justify-between mb-1">
            <Text className="text-[#19231F] text-[14px]">Pembayaran</Text>
            <Text className="text-[#19231F] text-[14px]">Cash</Text>
          </View>
          <Text className="text-[#79828A] text-[13px]">Cash (bayar saat diterima)</Text>
        </View>

        {/* Rincian Pesanan */}
        <View className="bg-white/60 border border-[#E1E4E1] rounded-xl p-4 mb-6">
          <Text className="text-[#19231F] text-[17px] font-semibold mb-4">Rincian Pesanan</Text>
          
          <View className="space-y-3 mb-4">
            <View className="flex-row items-center">
              <Text className="text-[#79828A] text-[13px] w-6">1×</Text>
              <Text className="flex-1 text-[#19231F] text-[13px]">Nasi Bakar Ayam</Text>
              <Text className="text-[#19231F] text-[13px]">Rp 15.000</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <Text className="text-[#79828A] text-[13px] w-6">1×</Text>
              <Text className="flex-1 text-[#19231F] text-[13px]">Es Teh Manis</Text>
              <Text className="text-[#19231F] text-[13px]">Rp 5.000</Text>
            </View>
          </View>
          
          <View className="h-[1px] bg-[#E1E4E1] w-full mb-3" />
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-[#19231F] text-[14px]">Subtotal</Text>
            <Text className="text-[#19231F] text-[14px]">Rp 20.000</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-[#19231F] text-[14px]">Ongkir</Text>
            <Text className="text-[#19231F] text-[14px]">Rp 0</Text>
          </View>
          
          <View className="h-[1px] bg-[#E1E4E1] w-full mb-3" />
          
          <View className="flex-row justify-between items-center">
            <Text className="text-[#19231F] text-[17px] font-semibold">Total</Text>
            <Text className="text-[#155A3D] text-[20px] font-semibold">Rp 20.000</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          className="w-full h-[60px] bg-white/70 border border-[#E1E4E1] rounded-lg justify-center items-center mb-8 active:bg-gray-50"
          onPress={() => router.push('/home')}
        >
          <Text className="text-[#155A3D] text-[17px] font-semibold">Kembali ke Daftar Pesanan</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}