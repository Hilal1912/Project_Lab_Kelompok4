import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CheckoutScreen() {
  const router = useRouter();
  
  // State untuk menyimpan pilihan user
  const [alamat, setAlamat] = useState<string | null>(null);
  const [metodeBayar, setMetodeBayar] = useState<string | null>(null);
  
  // State untuk interaksi
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const subtotal = 20000;
  const ongkir = 0;
  const total = subtotal + ongkir;

  // Logika saat tombol Buat Pesanan ditekan
  const handleBuatPesanan = () => {
    setIsSubmitAttempted(true);
    
    // Jika belum pilih alamat atau metode pembayaran, hentikan proses (munculkan error merah)
    if (!alamat || !metodeBayar) {
      return;
    }
    
    // Jika sudah lengkap, munculkan Pop-up Konfirmasi
    setShowConfirmModal(true);
  };

  // Fungsi simulasi pilih alamat
  const handlePilihAlamat = () => {
    setAlamat("Jl. Melati No. 12, Kec. Harjamukti, Kota Cirebon");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8F1]">
      <View className="flex-row justify-between items-center px-6 py-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Feather name="arrow-left" size={24} color="#19231F" />
        </TouchableOpacity>
        <Text className="text-[#19231F] text-[22px] font-semibold">Checkout</Text>
        <TouchableOpacity className="p-2 -mr-2">
          <Feather name="shopping-cart" size={24} color="#79828A" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        
        {/* Banner Error (Muncul jika tombol ditekan tapi data belum lengkap) */}
        {isSubmitAttempted && (!alamat || !metodeBayar) && (
          <View className="bg-[#FBECEE] rounded-lg p-3 flex-row items-start space-x-2.5 mb-4">
            <View className="mt-0.5">
              <Feather name="alert-circle" size={18} color="#CB4E57" />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-[#CB4E57] text-[14px] font-semibold">Lengkapi data pesanan</Text>
              <Text className="text-[#79828A] text-[12px] mt-1 leading-4">
                Pilih alamat dan metode pembayaran, lalu tekan Buat Pesanan kembali.
              </Text>
            </View>
          </View>
        )}

        <View className="bg-white/50 border border-[#E1E4E1] rounded-xl p-4 mb-6">
          <Text className="text-[#19231F] text-[17px] font-semibold mb-3">Detail Pesanan</Text>
          
          <View className="space-y-3">
            <View className="flex-row items-center">
              <Text className="text-[#79828A] text-[13px] w-6">1×</Text>
              <Text className="flex-1 text-[#19231F] text-[13px]">Nasi Bakar Ayam</Text>
              <Text className="text-[#19231F] text-[13px]">Rp 15.000</Text>
            </View>
            <View className="flex-row items-center mt-2 mb-3">
              <Text className="text-[#79828A] text-[13px] w-6">1×</Text>
              <Text className="flex-1 text-[#19231F] text-[13px]">Es Teh Manis</Text>
              <Text className="text-[#19231F] text-[13px]">Rp 5.000</Text>
            </View>
          </View>

          <View className="h-[1px] bg-[#E1E4E1] w-full mb-3" />
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-[#19231F] text-[14px]">Subtotal</Text>
            <Text className="text-[#19231F] text-[14px]">Rp {subtotal.toLocaleString('id-ID')}</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-[#19231F] text-[14px]">Ongkir</Text>
            <Text className="text-[#19231F] text-[14px]">Rp {ongkir}</Text>
          </View>

          <View className="h-[1px] bg-[#E1E4E1] w-full mb-3" />

          {/* Jenis Order */}
          <Text className="text-[#19231F] text-[15px] font-semibold mb-3">Jenis Order</Text>
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center space-x-3">
              <Feather name="truck" size={20} color="#155A3D" />
              <Text className="text-[#19231F] text-[16px] ml-3">Delivery</Text>
            </View>
            <TouchableOpacity className="bg-[#DFF1DE] px-2 py-1 rounded-md">
              <Text className="text-[#155A3D] text-[11px] font-medium">Ubah</Text>
            </TouchableOpacity>
          </View>

          {/* Alamat Pengiriman */}
          <View className="mb-4">
            <Text className="text-[#19231F] text-[15px] font-semibold mb-2">Alamat Pengiriman</Text>
            <TouchableOpacity 
              onPress={handlePilihAlamat}
              className={`min-h-[48px] rounded-lg p-3 flex-row items-center border ${
                isSubmitAttempted && !alamat ? 'bg-white/70 border-[#CB4E57]' : alamat ? 'bg-[#F3F6EE] border-[#E1E4E1]' : 'bg-white/70 border-[#E1E4E1]'
              }`}
            >
              <Feather name="map-pin" size={18} color="#155A3D" />
              <View className="flex-1 ml-3">
                {alamat ? (
                  <>
                    <Text className="text-[#19231F] text-[14px] font-semibold">Nurkhotimah · Rumah</Text>
                    <Text className="text-[#79828A] text-[13px] leading-5 mt-1">{alamat}</Text>
                  </>
                ) : (
                  <Text className="text-[#79828A] text-[14px]">Pilih alamat pengiriman</Text>
                )}
              </View>
              {!alamat && <Feather name="chevron-right" size={18} color="#79828A" />}
            </TouchableOpacity>
            {isSubmitAttempted && !alamat && (
              <Text className="text-[#CB4E57] text-[12px] mt-1.5">Pilih alamat pengiriman terlebih dahulu</Text>
            )}
          </View>

          {/* Catatan Kurir */}
          <View className="mb-4">
            <Text className="text-[#19231F] text-[15px] mb-2">Catatan untuk Kurir (opsional)</Text>
            <TextInput
              className="w-full min-h-[64px] bg-white/70 border border-[#E1E4E1] rounded-lg p-3 text-[13px]"
              placeholder="Contoh: depan warung, pintu warna biru."
              placeholderTextColor="#79828A"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Metode Pembayaran */}
          <View className="mb-3">
            <Text className="text-[#19231F] text-[15px] font-semibold mb-2">Metode Pembayaran</Text>
            <View className={`border rounded-lg p-2.5 ${isSubmitAttempted && !metodeBayar ? 'border-[#CB4E57]' : 'border-[#E1E4E1] bg-white/50'}`}>
              <View className="flex-row justify-between">
                {['Cash', 'Transfer Bank', 'QRIS'].map((method) => (
                  <TouchableOpacity 
                    key={method} 
                    onPress={() => setMetodeBayar(method)}
                    className="flex-row items-center space-x-2"
                  >
                    <View className={`w-4 h-4 rounded-full border items-center justify-center ${metodeBayar === method ? 'border-[#155A3D]' : 'border-[#79828A]'}`}>
                      {metodeBayar === method && <View className="w-2 h-2 rounded-full bg-[#155A3D]" />}
                    </View>
                    <Text className="text-[#79828A] text-[12px] ml-1">{method}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {isSubmitAttempted && !metodeBayar && (
              <Text className="text-[#CB4E57] text-[12px] mt-1.5">Pilih metode pembayaran</Text>
            )}
            {metodeBayar === 'Cash' && (
              <Text className="text-[#79828A] text-[12px] mt-1.5">Cash · bayar saat diterima</Text>
            )}
          </View>
        </View>

        <View className="h-4" />
      </ScrollView>

      {/* Footer Bawah */}
      <View className="px-6 py-4 bg-[#FAF8F1] border-t border-[#E1E4E1]/50">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-[#19231F] text-[17px] font-semibold">Total</Text>
          <Text className="text-[#155A3D] text-[20px] font-semibold">
            Rp {total.toLocaleString('id-ID')}
          </Text>
        </View>
        
        <TouchableOpacity 
          className="w-full h-[60px] bg-[#155A3D] rounded-lg justify-center items-center active:bg-green-900"
          onPress={handleBuatPesanan}
        >
          <Text className="text-white text-[17px] font-semibold">Buat Pesanan</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL KONFIRMASI BUAT PESANAN */}
      <Modal transparent visible={showConfirmModal} animationType="fade">
        <View className="flex-1 bg-[#08130D]/40 justify-center items-center px-6">
          <View className="w-full bg-[#FAF8F1] rounded-xl p-5 border border-[#E1E4E1]">
            <View className="w-11 h-11 bg-[#DFF1DE] rounded-xl border border-[#155A3D]/20 justify-center items-center mb-4">
              <Feather name="check-square" size={24} color="#155A3D" />
            </View>
            
            <Text className="text-[#19231F] text-[20px] font-semibold mb-1">Buat pesanan sekarang?</Text>
            <Text className="text-[#79828A] text-[13px] leading-5 mb-5">
              Pastikan rincian pesanan dan alamat pengiriman sudah benar.
            </Text>

            <View className="space-y-2 mb-3">
              <View className="flex-row">
                <Text className="text-[#79828A] text-[13px] w-6">1×</Text>
                <Text className="flex-1 text-[#19231F] text-[13px]">Nasi Bakar Ayam</Text>
                <Text className="text-[#19231F] text-[13px]">Rp 15.000</Text>
              </View>
              <View className="flex-row mt-1">
                <Text className="text-[#79828A] text-[13px] w-6">1×</Text>
                <Text className="flex-1 text-[#19231F] text-[13px]">Es Teh Manis</Text>
                <Text className="text-[#19231F] text-[13px]">Rp 5.000</Text>
              </View>
            </View>
            
            <View className="h-[1px] bg-[#E1E4E1] w-full mb-3" />
            
            <View className="mb-3">
              <View className="flex-row justify-between mb-1">
                <Text className="text-[#19231F] text-[14px]">Jenis order</Text>
                <Text className="text-[#19231F] text-[14px]">Delivery</Text>
              </View>
              <Text className="text-[#19231F] text-[14px] font-semibold mt-1">Nurkhotimah</Text>
              <Text className="text-[#79828A] text-[13px] leading-5 mt-0.5">{alamat}</Text>
            </View>

            <View className="flex-row justify-between mb-1 mt-2">
              <Text className="text-[#19231F] text-[14px]">Pembayaran</Text>
              <Text className="text-[#19231F] text-[14px]">{metodeBayar}</Text>
            </View>
            <Text className="text-[#79828A] text-[12px]">Bayar saat pesanan diterima.</Text>

            <View className="h-[1px] bg-[#E1E4E1] w-full my-3" />

            <View className="flex-row justify-between mb-4">
              <Text className="text-[#19231F] text-[17px] font-semibold">Total</Text>
              <Text className="text-[#155A3D] text-[20px] font-semibold">Rp {total.toLocaleString('id-ID')}</Text>
            </View>
            
            <TouchableOpacity 
              className="w-full h-12 bg-[#155A3D] rounded-lg justify-center items-center mb-3"
              // Arahkan ke rute Pesanan Berhasil
              onPress={() => {
                setShowConfirmModal(false);
                router.push('/pesanan-berhasil');
              }}
            >
              <Text className="text-white text-[15px] font-semibold">Ya, Buat Pesanan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="w-full h-12 bg-white/70 border border-[#E1E4E1] rounded-lg justify-center items-center"
              onPress={() => setShowConfirmModal(false)}
            >
              <Text className="text-[#155A3D] text-[15px] font-semibold">Kembali</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}