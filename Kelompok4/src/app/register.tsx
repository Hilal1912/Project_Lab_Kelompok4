import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Tambahkan router

export default function RegisterScreen() {
  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter(); // Aktifkan router

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <View className="px-6 pt-3 pb-6 flex-1">

        {/* Tombol Back */}
        <TouchableOpacity
          className="w-10 h-10 justify-center"
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace('/login');
          }}
        >
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }} className="mt-5">
          <Text className="text-zinc-900 text-3xl font-semibold leading-10">Daftar Akun</Text>
          <Text className="text-zinc-900 text-base font-normal mt-2 leading-6">Bergabung dan nikmati pengalaman memesan yang lebih mudah.</Text>

          <View className="w-full mt-8 flex flex-col gap-5">
            {/* Input Nama Lengkap */}
            <View className="w-full h-16 px-4 bg-white/70 rounded-lg border border-neutral-200 flex-row items-center">
              <Feather name="user" size={20} color="#6b7280" />
              <TextInput className="flex-1 ml-3.5 text-zinc-900 text-base font-normal" placeholder="Nama Lengkap" placeholderTextColor="#9ca3af" value={nama} onChangeText={setNama} />
            </View>

            {/* Input No. HP */}
            <View className="w-full h-16 px-4 bg-white/70 rounded-lg border border-neutral-200 flex-row items-center">
              <Feather name="smartphone" size={20} color="#6b7280" />
              <TextInput className="flex-1 ml-3.5 text-zinc-900 text-base font-normal" placeholder="No. HP" placeholderTextColor="#9ca3af" value={noHp} onChangeText={setNoHp} keyboardType="phone-pad" />
            </View>

            {/* Input Email */}
            <View className="w-full h-16 px-4 bg-white/70 rounded-lg border border-neutral-200 flex-row items-center">
              <Feather name="mail" size={20} color="#6b7280" />
              <TextInput className="flex-1 ml-3.5 text-zinc-900 text-base font-normal" placeholder="Email" placeholderTextColor="#9ca3af" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>

            {/* Input Password */}
            <View className="w-full h-16 px-4 bg-white/70 rounded-lg border border-neutral-200 flex-row items-center">
              <Feather name="lock" size={20} color="#6b7280" />
              <TextInput className="flex-1 ml-3.5 text-zinc-900 text-base font-normal" placeholder="Password" placeholderTextColor="#9ca3af" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Input Konfirmasi Password */}
            <View className="w-full h-16 px-4 bg-white/70 rounded-lg border border-neutral-200 flex-row items-center">
              <Feather name="lock" size={20} color="#6b7280" />
              <TextInput className="flex-1 ml-3.5 text-zinc-900 text-base font-normal" placeholder="Konfirmasi Password" placeholderTextColor="#9ca3af" value={konfirmasiPassword} onChangeText={setKonfirmasiPassword} secureTextEntry={!showConfirmPassword} />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className="w-full h-14 bg-green-800 rounded-lg justify-center items-center mt-10 active:bg-green-900"
            onPress={() => router.replace('/login')}
          >
            <Text className="text-white text-lg font-semibold">Register</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}