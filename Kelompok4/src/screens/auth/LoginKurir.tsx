import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import ScreenWrapper from '@/components/layout/ScreenWrapper';

const LoginKurir = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});
  const router = useRouter();

  const validatePhone = (value: string) => {
    if (!value.trim()) return 'No. HP wajib diisi';
    const digits = value.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15 ? '' : 'Masukkan nomor HP yang valid';
  };

  const validatePassword = (value: string) => (
    value.trim() ? '' : 'Password wajib diisi'
  );

  const handleLogin = () => {
    const nextErrors = {
      phone: validatePhone(phone),
      password: validatePassword(password),
    };
    setErrors(nextErrors);
    if (nextErrors.phone || nextErrors.password) return;

    router.replace('/pesanan-kurir');
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setErrors((current) => ({ ...current, phone: validatePhone(value) }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setErrors((current) => ({ ...current, password: validatePassword(value) }));
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
              className={`bg-white border rounded-xl px-4 py-3 text-gray-800 ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="Masukkan nomor HP"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
            />
            {!!errors.phone && <Text className="text-red-600 text-xs mt-1">{errors.phone}</Text>}
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
            <TextInput
              className={`bg-white border rounded-xl px-4 py-3 text-gray-800 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="Masukkan password"
              secureTextEntry
              value={password}
              onChangeText={handlePasswordChange}
            />
            {!!errors.password && <Text className="text-red-600 text-xs mt-1">{errors.password}</Text>}
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