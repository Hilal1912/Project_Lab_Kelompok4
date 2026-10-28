import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DetailMenuScreen() {
  const router = useRouter();
  
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  
  // State untuk memunculkan notifikasi sukses
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const hargaSatuan = 15000;
  const totalHarga = hargaSatuan * quantity;

  const handleTambah = () => setQuantity(prev => prev + 1);
  const handleKurang = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  // Fungsi saat tombol tambah ke keranjang diklik
  const handleAddToCart = () => {
    setIsAddedToCart(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8F1]">
      <View className="flex-row justify-between items-center px-6 py-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Feather name="arrow-left" size={24} color="#19231F" />
        </TouchableOpacity>
        <Text className="text-[#19231F] text-[22px] font-semibold">Detail Menu</Text>
        <TouchableOpacity className="p-2 -mr-2">
          <Feather name="shopping-cart" size={24} color="#79828A" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        <View className="w-full h-[218px] rounded-xl overflow-hidden mb-5">
          <Image 
            source={require('../../../../assets/images/logo/ayam.png')} 
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[#19231F] text-[21px] font-semibold">Nasi Bakar Ayam</Text>
            <View className="bg-[#DFF1DE] px-2.5 py-1 rounded-lg">
              <Text className="text-[#155A3D] text-[11px] font-medium">Tersedia</Text>
            </View>
          </View>
          <Text className="text-[#155A3D] text-xl font-semibold mb-3">Rp 15.000</Text>
          <Text className="text-[#79828A] text-[14px] leading-[20px]">
            Nasi gurih dengan ayam suwir berbumbu, dibungkus daun pisang dan dibakar hingga harum. Disajikan dengan sambal.
          </Text>
        </View>

        {/* Form Input (Akan disable jika sudah sukses) */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-[#19231F] text-[17px]">Jumlah</Text>
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity 
              onPress={handleKurang}
              disabled={quantity <= 1 || isAddedToCart}
              className={`w-8 h-8 rounded-lg items-center justify-center border ${
                (quantity > 1 && !isAddedToCart) ? 'border-[#155A3D] bg-white' : 'border-transparent bg-[#F3F6EE]'
              }`}
            >
              <Text className={`text-xl ${(quantity > 1 && !isAddedToCart) ? 'text-[#155A3D]' : 'text-[#B7BCBA]'}`}>−</Text>
            </TouchableOpacity>
            
            <Text className="text-[#19231F] text-[16px] w-4 text-center">{quantity}</Text>
            
            <TouchableOpacity 
              onPress={handleTambah}
              disabled={isAddedToCart}
              className={`w-8 h-8 rounded-lg items-center justify-center border ${
                isAddedToCart ? 'border-transparent bg-[#F3F6EE]' : 'border-[#E1E4E1] bg-white'
              }`}
            >
              <Text className={`text-xl ${isAddedToCart ? 'text-[#B7BCBA]' : 'text-[#155A3D]'}`}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-[#19231F] text-[15px] mb-2.5">Catatan (opsional)</Text>
          <TextInput
            editable={!isAddedToCart}
            className={`w-full min-h-[64px] border rounded-lg p-3 text-[13px] text-[#19231F] ${
              isAddedToCart ? 'bg-[#F3F6EE] border-transparent' : 'bg-white/70 border-[#E1E4E1]'
            }`}
            placeholder="Contoh: tidak pedas, sambal terpisah."
            placeholderTextColor="#79828A"
            multiline
            textAlignVertical="top"
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* Kotak Notifikasi Sukses (Muncul otomatis setelah diklik) */}
        {isAddedToCart && (
          <View className="p-4 bg-[#DFF1DE] rounded-xl border border-[#E1E4E1] mb-8">
            <View className="flex-row items-start space-x-3 mb-3">
              <View className="mt-0.5">
                <Feather name="check-circle" size={20} color="#155A3D" />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-[#155A3D] text-[15px] font-semibold mb-1">Berhasil ditambahkan ke keranjang</Text>
                <Text className="text-[#19231F] text-[13px]">{quantity} Nasi Bakar Ayam · Rp {totalHarga.toLocaleString('id-ID')}</Text>
              </View>
            </View>
            
            <Text className="text-[#79828A] text-[13px] leading-[19px] mb-4">
              Keranjang kini berisi 2 item, termasuk 1 Es Teh Manis. Total Rp 20.000.
            </Text>
            
            <TouchableOpacity 
              className="w-full h-12 bg-[#155A3D] rounded-lg justify-center items-center mb-3 active:bg-green-900"
              onPress={() => router.push('/keranjang')} 
            >
              <Text className="text-white text-[15px] font-semibold">Lihat Keranjang</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="w-full h-12 bg-white/70 border border-[#E1E4E1] rounded-lg justify-center items-center active:bg-gray-50"
              onPress={() => router.back()}
            >
              <Text className="text-[#155A3D] text-[15px] font-semibold">Lanjut Pilih Menu</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Footer Bawah (Sembunyi jika sudah sukses) */}
      {!isAddedToCart && (
        <View className="px-6 py-4 bg-[#FAF8F1] border-t border-[#E1E4E1]/50">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-[#19231F] text-[17px]">Total</Text>
            <Text className="text-[#155A3D] text-[21px] font-semibold">
              Rp {totalHarga.toLocaleString('id-ID')}
            </Text>
          </View>
          
          <TouchableOpacity 
            className="w-full h-[60px] bg-[#155A3D] rounded-lg justify-center items-center active:bg-green-900"
            onPress={handleAddToCart}
          >
            <Text className="text-white text-[17px] font-semibold">Tambah ke Keranjang</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}