// src/screens/auth/RegisterScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
// Pastikan kamu mengimpor icon yang sesuai (misal dari @expo/vector-icons)

export default function RegisterScreen() {
  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Logika validasi panjang password
  const isPasswordValid = password.length >= 8;
  const passwordLength = password.length;

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8F1]">
      <View className="flex-1 px-6 pt-3 pb-6">
        
        {/* Header */}
        <View className="mt-5 mb-6">
          <Text className="text-[#19231F] text-[29px] font-semibold leading-[42px]">
            Daftar Akun
          </Text>
          <Text className="text-[#19231F] text-[17px] font-normal leading-[24px] mt-2">
            Bergabung dan nikmati pengalaman memesan yang lebih mudah.
          </Text>
        </View>

        {/* Form Inputs */}
        <View className="flex-col gap-5 pb-6">
          {/* Input Nama */}
          <View className="h-16 px-[18px] bg-white/70 rounded-lg border border-[#E1E4E1] flex-row items-center space-x-3">
             {/* Tempat Icon User */}
             <TextInput 
               className="flex-1 text-[16px] text-[#19231F] font-normal"
               placeholder="Nama Lengkap"
               placeholderTextColor="#79828A"
               value={nama}
               onChangeText={setNama}
             />
          </View>

          {/* Input No HP */}
          <View className="h-16 px-[18px] bg-white/70 rounded-lg border border-[#E1E4E1] flex-row items-center space-x-3">
             {/* Tempat Icon Phone */}
             <TextInput 
               className="flex-1 text-[16px] text-[#19231F] font-normal"
               placeholder="No. HP"
               placeholderTextColor="#79828A"
               keyboardType="phone-pad"
               value={noHp}
               onChangeText={setNoHp}
             />
          </View>

          {/* Input Email */}
          <View className="h-16 px-[18px] bg-white/70 rounded-lg border border-[#E1E4E1] flex-row items-center space-x-3">
             {/* Tempat Icon Email */}
             <TextInput 
               className="flex-1 text-[16px] text-[#19231F] font-normal"
               placeholder="Email"
               placeholderTextColor="#79828A"
               keyboardType="email-address"
               value={email}
               onChangeText={setEmail}
             />
          </View>

          {/* Input Password & Validasi */}
          <View className="flex-col space-y-2">
            <View className={`h-16 px-[18px] bg-white/70 rounded-lg border flex-row items-center space-x-3 ${
              passwordLength > 0 && !isPasswordValid ? 'border-[#BE3232] border-2' : 'border-[#E1E4E1]'
            }`}>
              {/* Tempat Icon Lock */}
              <View className="flex-1 flex-col justify-center">
                {passwordLength > 0 && (
                  <Text className="text-[#79828A] text-[11px]">Password</Text>
                )}
                <TextInput 
                  className="text-[16px] text-[#19231F] p-0 m-0"
                  placeholder={passwordLength === 0 ? "Password" : ""}
                  placeholderTextColor="#79828A"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              {/* Toggle Eye Icon */}
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {/* Tempat Icon Eye */}
              </TouchableOpacity>
            </View>

            {/* Indikator Validasi Password */}
            <View className="flex-col gap-1">
              <View className="flex-row justify-between items-center">
                <Text className={`text-[13px] font-semibold ${isPasswordValid ? 'text-green-600' : 'text-[#BE3232]'}`}>
                  {passwordLength === 0 ? '' : isPasswordValid ? 'Cukup' : 'Belum cukup'}
                </Text>
                <Text className={`text-[13px] font-medium ${isPasswordValid ? 'text-green-600' : 'text-[#BE3232]'}`}>
                  {passwordLength}/8
                </Text>
              </View>
              <Text className="text-[#79828A] text-[12px]">Minimal 8 karakter</Text>
            </View>
          </View>

          {/* Konfirmasi Password */}
          <View className="h-16 px-[18px] bg-white/70 rounded-lg border border-[#E1E4E1] flex-row items-center space-x-3">
             {/* Tempat Icon Lock */}
             <TextInput 
               className="flex-1 text-[16px] text-[#19231F] font-normal"
               placeholder="Konfirmasi Password"
               placeholderTextColor="#79828A"
               secureTextEntry={!showPassword}
               value={konfirmasiPassword}
               onChangeText={setKonfirmasiPassword}
             />
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity 
          className="h-[60px] bg-[#D6DFD8] rounded-lg justify-center items-center"
          disabled={!isPasswordValid}
        >
          <Text className="text-[#78877D] text-[18px] font-semibold">
            Register
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}