import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    // SafeAreaView memastikan konten tidak tertutup notch/kamera depan
    <SafeAreaView className="flex-1 bg-orange-50 justify-between">

      {/* Container Utama: Logo, Teks, dan Tombol */}
      <View className="px-12 pt-14 flex flex-col items-center">

        {/* Logo Area */}
        <View className="w-40 h-32 mb-6">
        <Image
          source={require('../../../../assets/images/logo/logo_nasbak.png')}
          className="w-full h-full"
          resizeMode="contain"
        />
        </View>

        {/* Tipografi Judul */}
        <View className="items-center">
          <Text className="text-green-900 text-5xl font-extrabold">NASBAK</Text>
          <Text className="text-green-900 text-3xl font-extrabold">CIREBON</Text>
          <Text className="text-green-900 text-xl font-semibold mt-1">Nasi Bakar Ibu Efri</Text>
        </View>

        {/* Subtitle */}
        <Text className="text-zinc-900 text-2xl font-normal text-center leading-8 mt-6">
          Lezatnya Nasi Bakar,{"\n"}Kini Lebih Dekat!
        </Text>

        {/* Tombol Mulai */}
        <View className="w-full pt-8">
          <TouchableOpacity
            className="w-full h-14 bg-green-800 rounded-lg justify-center items-center active:bg-green-900"
            onPress={() => router.push('/login')}
          >
            <Text className="text-white text-lg font-semibold">Mulai</Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* Gambar Ilustrasi Bawah */}
      <View className="w-full h-80 justify-end">
        <Image
          source={require('../../../../assets/images/logo/logo depan pas awal.png')}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

    </SafeAreaView>
  );
};

export default WelcomeScreen;