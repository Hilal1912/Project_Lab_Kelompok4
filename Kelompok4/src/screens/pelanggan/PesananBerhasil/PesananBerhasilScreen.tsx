import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PesananBerhasilScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8F1]">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Feather name="arrow-left" size={24} color="#19231F" />
        </TouchableOpacity>
        <Text className="text-[#19231F] text-[22px] font-semibold">Pesanan Berhasil</Text>
        <TouchableOpacity className="p-2 -mr-2">
          <Feather name="shopping-cart" size={24} color="#79828A" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        
        {/* Status Icon & Message */}
        <View className="items-center py-6">
          <View className="w-[88px] h-[88px] bg-[#DFF1DE] rounded-full justify-center items-center mb-4">
            <Feather name="check" size={40} color="#155A3D" />
          </View>
          <Text className="text-[#19231F] text-[22px] font-semibold mb-2">Pesanan Berhasil Dibuat</Text>
          <Text className="text-[#79828A] text-[14px] text-center leading-[20px] mb-4">
            Terima kasih! Pesananmu sudah diterima dan menunggu konfirmasi dari Ibu Efri.
          </Text>
          <Text className="text-[#19231F] text-[18px] font-semibold mb-2">#NB20250601</Text>
          <View className="bg-[#DFF1DE] px-2.5 py-1 rounded-lg">
            <Text className="text-[#155A3D] text-[11px] font-medium">Menunggu Konfirmasi</Text>
          </View>
        </View>

        {/* Ringkasan Pesanan Card */}
        <View className="bg-white/60 border border-[#E1E4E1] rounded-xl p-4 mb-6">
          <Text className="text-[#19231F] text-[17px] font-semibold mb-4">Ringkasan Pesanan</Text>
          
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
            <Text className="text-[#19231F] text-[14px]">Jenis order</Text>
            <Text className="text-[#19231F] text-[14px]">Delivery</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-[#19231F] text-[14px]">Pembayaran</Text>
            <Text className="text-[#19231F] text-[14px]">Cash</Text>
          </View>
          <Text className="text-[#79828A] text-[12px] mb-3">Bayar saat pesanan diterima.</Text>

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

        {/* Action Buttons */}
        <View className="space-y-3 mb-8">
          <TouchableOpacity 
            className="w-full h-[60px] bg-[#155A3D] rounded-lg justify-center items-center active:bg-green-900 mb-3"
            onPress={() => router.push('/detail-pesanan')}
          >
            <Text className="text-white text-[17px] font-semibold">Lihat Detail Pesanan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-full h-[60px] bg-white/70 border border-[#E1E4E1] rounded-lg justify-center items-center active:bg-gray-50"
            onPress={() => router.push('/home')}
          >
            <Text className="text-[#155A3D] text-[17px] font-semibold">Kembali ke Menu</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}