import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Tambahkan router

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // Aktifkan router

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
      <View className="px-6 pt-3 pb-6">

        {/* Tombol Back */}
        <TouchableOpacity
          className="w-10 h-10 justify-center"
          onPress={() => router.back()} // Kembali ke layar sebelumnya
        >
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <View className="mt-6 flex flex-col items-start">
          <View className="w-full items-center mb-5">
            <View className="w-28 h-24">
              <Image
                source={require('../../assets/images/logo/logo_nasbak.png')}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </View>

          <Text className="text-zinc-900 text-3xl font-semibold leading-10">Masuk ke Akun Anda</Text>
          <Text className="text-gray-500 text-base font-normal mt-2 leading-6">Nikmati kemudahan memesan nasi bakar Ibu Efri.</Text>

          <View className="w-full mt-8 flex flex-col">
            <View className="w-full h-16 px-4 bg-white/70 rounded-lg border border-neutral-200 flex-row items-center">
              <Feather name="mail" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3.5 text-zinc-900 text-base font-normal"
                placeholder="Email / No. HP"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="w-full h-16 px-4 mt-5 bg-white/70 rounded-lg border border-neutral-200 flex-row items-center">
              <Feather name="lock" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3.5 text-zinc-900 text-base font-normal"
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="w-full mt-4">
              <Text className="text-right text-green-800 text-base font-medium">Lupa Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full h-14 bg-green-800 rounded-lg justify-center items-center mt-6 active:bg-green-900"
              onPress={() => router.replace('/home')}
            >
              <Text className="text-white text-lg font-semibold">Login</Text>
            </TouchableOpacity>

            {__DEV__ && (
              <TouchableOpacity
                className="w-full h-12 rounded-lg border border-green-800 justify-center items-center mt-4"
                onPress={() => router.replace('/(admin)')}
              >
                <Text className="text-green-800 text-base font-semibold">
                  Demo Admin (tanpa login)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="w-full mt-6 flex-row justify-center items-center gap-1">
            <Text className="text-gray-500 text-base font-normal">Belum punya akun?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="text-green-800 text-base font-semibold">Register</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}