import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // Fungsi validasi per field
  const rules: Record<string, (v: string) => string> = {
    nama: (v) => !v.trim() ? 'Nama lengkap wajib diisi' : '',
    noHp: (v) => !v.trim() ? 'No. HP wajib diisi' : !/^\+?\d{8,15}$/.test(v.replace(/[\s()-]/g, '')) ? 'No. HP tidak valid (8-15 angka)' : '',
    email: (v) => !v.trim() ? 'Email wajib diisi' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Format email tidak valid' : '',
    password: (v) => !v.trim() ? 'Password wajib diisi' : v.length < 8 ? 'Password minimal 8 karakter' : '',
    konfirmasi: (v) => !v.trim() ? 'Konfirmasi password wajib diisi' : '',
  };

  const handleChange = (field: string, val: string, setter: (v: string) => void) => {
    setter(val);
    let msg = rules[field]?.(val) ?? '';
    // Cek konfirmasi cocok secara realtime
    if (field === 'konfirmasi') msg = !val.trim() ? 'Konfirmasi password wajib diisi' : val !== password ? 'Password tidak cocok' : '';
    if (field === 'password') {
      // Update error konfirmasi juga kalau password berubah
      setErrors((e) => ({ ...e, [field]: msg, konfirmasi: konfirmasi && val !== konfirmasi ? 'Password tidak cocok' : '' }));
      return;
    }
    setErrors((e) => ({ ...e, [field]: msg }));
  };

  const handleRegister = () => {
    const newErrors: Record<string, string> = {};
    newErrors.nama = rules.nama(nama);
    newErrors.noHp = rules.noHp(noHp);
    newErrors.email = rules.email(email);
    newErrors.password = rules.password(password);
    newErrors.konfirmasi = !konfirmasi.trim() ? 'Konfirmasi password wajib diisi' : konfirmasi !== password ? 'Password tidak cocok' : '';
    setErrors(newErrors);
    if (Object.values(newErrors).some((v) => v)) return;
    Alert.alert('Berhasil', 'Akun berhasil dibuat!', [
      { text: 'Login Sekarang', onPress: () => router.replace('/login') },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <View className="px-6 pt-3 pb-6 flex-1">
        <TouchableOpacity className="w-10 h-10 justify-center" onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/login'); }}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }} className="mt-5">
          <Text className="text-zinc-900 text-3xl font-semibold leading-10">Daftar Akun</Text>
          <Text className="text-zinc-900 text-base font-normal mt-2 leading-6">
            Bergabung dan nikmati pengalaman memesan yang lebih mudah.
          </Text>

          <View className="w-full mt-8 flex flex-col gap-1">
            {/* Nama */}
            <View style={[s.inputBox, errors.nama ? s.inputErr : null]}>
              <Feather name="user" size={20} color={errors.nama ? '#ef4444' : '#6b7280'} />
              <TextInput className="flex-1 ml-3.5 text-zinc-900 text-base" placeholder="Nama Lengkap" placeholderTextColor="#9ca3af" value={nama} onChangeText={(v) => handleChange('nama', v, setNama)} />
            </View>
            {!!errors.nama && <Text style={s.errText}>{errors.nama}</Text>}

            {/* No HP */}
            <View style={[s.inputBox, errors.noHp ? s.inputErr : null]}>
              <Feather name="smartphone" size={20} color={errors.noHp ? '#ef4444' : '#6b7280'} />
              <TextInput className="flex-1 ml-3.5 text-zinc-900 text-base" placeholder="No. HP" placeholderTextColor="#9ca3af" value={noHp} onChangeText={(v) => handleChange('noHp', v, setNoHp)} keyboardType="phone-pad" />
            </View>
            {!!errors.noHp && <Text style={s.errText}>{errors.noHp}</Text>}

            {/* Email */}
            <View style={[s.inputBox, errors.email ? s.inputErr : null]}>
              <Feather name="mail" size={20} color={errors.email ? '#ef4444' : '#6b7280'} />
              <TextInput className="flex-1 ml-3.5 text-zinc-900 text-base" placeholder="Email" placeholderTextColor="#9ca3af" value={email} onChangeText={(v) => handleChange('email', v, setEmail)} keyboardType="email-address" autoCapitalize="none" />
            </View>
            {!!errors.email && <Text style={s.errText}>{errors.email}</Text>}

            {/* Password */}
            <View style={[s.inputBox, errors.password ? s.inputErr : null]}>
              <Feather name="lock" size={20} color={errors.password ? '#ef4444' : '#6b7280'} />
              <TextInput className="flex-1 ml-3.5 text-zinc-900 text-base" placeholder="Password" placeholderTextColor="#9ca3af" value={password} onChangeText={(v) => handleChange('password', v, setPassword)} secureTextEntry={!showPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            {!!errors.password && <Text style={s.errText}>{errors.password}</Text>}

            {/* Konfirmasi Password */}
            <View style={[s.inputBox, errors.konfirmasi ? s.inputErr : null]}>
              <Feather name="lock" size={20} color={errors.konfirmasi ? '#ef4444' : '#6b7280'} />
              <TextInput className="flex-1 ml-3.5 text-zinc-900 text-base" placeholder="Konfirmasi Password" placeholderTextColor="#9ca3af" value={konfirmasi} onChangeText={(v) => handleChange('konfirmasi', v, setKonfirmasi)} secureTextEntry={!showKonfirmasi} />
              <TouchableOpacity onPress={() => setShowKonfirmasi(!showKonfirmasi)}>
                <Feather name={showKonfirmasi ? 'eye' : 'eye-off'} size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            {!!errors.konfirmasi && <Text style={s.errText}>{errors.konfirmasi}</Text>}
          </View>

          <TouchableOpacity className="w-full h-14 bg-green-800 rounded-lg justify-center items-center mt-8 active:bg-green-900" onPress={handleRegister}>
            <Text className="text-white text-lg font-semibold">Register</Text>
          </TouchableOpacity>

          <View className="w-full mt-4 flex-row justify-center items-center gap-1">
            <Text className="text-gray-500 text-base">Sudah punya akun?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-green-800 text-base font-semibold"> Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  inputBox: {
    width: '100%',
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputErr: { borderColor: '#ef4444' },
  errText: { color: '#ef4444', fontSize: 13, marginTop: 2, marginLeft: 4, marginBottom: 4 },
});
