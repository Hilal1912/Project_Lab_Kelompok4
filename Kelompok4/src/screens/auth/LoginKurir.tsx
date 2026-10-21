import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import ScreenWrapper from '@/components/layout/ScreenWrapper';

const LoginKurir = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Logika autentikasi Kurir
    router.replace('/pesanan-kurir');
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-8">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <Feather name="truck" size={36} color="#176044" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">Masuk Kurir</Text>
          <Text className="text-sm text-gray-500 mt-1 text-center">
            Silakan login untuk mengakses pesanan pengantaran.
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">No. HP</Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
              placeholder="Masukkan nomor HP"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
              placeholder="Masukkan password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            className="bg-emerald-800 py-3.5 rounded-xl items-center mt-4"
            onPress={handleLogin}
          >
            <Text className="text-white font-bold text-base">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default LoginKurir;