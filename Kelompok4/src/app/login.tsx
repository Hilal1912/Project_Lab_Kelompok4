import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validasi realtime — dipanggil setiap kali field berubah
  const validateEmail = (val: string) => {
    if (!val.trim()) return 'Email / No. HP wajib diisi';
    const value = val.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const phoneDigits = value.replace(/\D/g, '');
    const isPhone = /^[+\d\s()-]+$/.test(value) && phoneDigits.length >= 8 && phoneDigits.length <= 15;
    if (!isEmail && !isPhone) return 'Masukkan email atau nomor HP yang valid';
    return '';
  };

  const validatePassword = (val: string) => {
    if (!val.trim()) return 'Password wajib diisi';
    return '';
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setErrors((e) => ({ ...e, email: validateEmail(val) }));
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setErrors((e) => ({ ...e, password: validatePassword(val) }));
  };

  const isValid = () => !validateEmail(email) && !validatePassword(password);

  const handleLogin = async () => {
    setErrors({ email: validateEmail(email), password: validatePassword(password) });
    if (!isValid()) return;

    setLoading(true);
    try {
      // Login via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        Alert.alert('Login Gagal', 'Email atau password salah.');
        return;
      }

      // Ambil profil user dari tabel users untuk cek role
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('role, is_aktif')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError || !userProfile) {
        Alert.alert('Login Gagal', 'Profil akun tidak ditemukan.');
        await supabase.auth.signOut();
        return;
      }

      if (!userProfile.is_aktif) {
        Alert.alert('Akun Dinonaktifkan', 'Akun kamu tidak aktif. Hubungi admin.');
        await supabase.auth.signOut();
        return;
      }

      // Arahkan berdasarkan role
      if (userProfile.role === 'admin') {
        router.replace('/admin/dashboard');
      } else if (userProfile.role === 'pelanggan') {
        router.replace('/home');
      } else {
        Alert.alert('Login Gagal', 'Role tidak dikenali. Gunakan login kurir untuk akun kurir.');
        await supabase.auth.signOut();
      }
    } catch (e) {
      Alert.alert('Error', 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="px-6 pt-3 pb-6">

          {/* Back */}
          <TouchableOpacity className="w-10 h-10 justify-center" onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/'); }}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>

          <View className="mt-6 flex flex-col items-start">
            {/* Logo */}
            <View className="w-full items-center mb-5">
              <View className="w-28 h-24">
                <Image source={require('../../assets/images/logo/logo_nasbak.png')} className="w-full h-full" resizeMode="contain" />
              </View>
            </View>

            <Text className="text-zinc-900 text-3xl font-semibold leading-10">Masuk ke Akun Anda</Text>
            <Text className="text-gray-500 text-base font-normal mt-2 leading-6">Nikmati kemudahan memesan nasi bakar Ibu Efri.</Text>

            <View className="w-full mt-8 flex flex-col">
              {/* Email */}
              <View style={[s.inputBox, errors.email ? s.inputErr : null]}>
                <Feather name="mail" size={20} color={errors.email ? '#ef4444' : '#6b7280'} />
                <TextInput
                  className="flex-1 ml-3.5 text-zinc-900 text-base font-normal"
                  placeholder="Email / No. HP"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {!!errors.email && <Text style={s.errText}>{errors.email}</Text>}

              {/* Password */}
              <View style={[s.inputBox, { marginTop: 16 }, errors.password ? s.inputErr : null]}>
                <Feather name="lock" size={20} color={errors.password ? '#ef4444' : '#6b7280'} />
                <TextInput
                  className="flex-1 ml-3.5 text-zinc-900 text-base font-normal"
                  placeholder="Password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
              {!!errors.password && <Text style={s.errText}>{errors.password}</Text>}

              <TouchableOpacity className="w-full mt-4">
                <Text className="text-right text-green-800 text-base font-medium">Lupa Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-full h-14 bg-green-800 rounded-lg justify-center items-center mt-6 active:bg-green-900"
                onPress={handleLogin}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text className="text-white text-lg font-semibold">Masuk</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity
                className="w-full h-12 rounded-lg border border-neutral-300 bg-white/70 justify-center items-center mt-3"
                onPress={() => router.push('/login-kurir')}
              >
                <Text className="text-zinc-800 text-base font-semibold">Login sebagai Kurir</Text>
              </TouchableOpacity>
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
  errText: { color: '#ef4444', fontSize: 13, marginTop: 4, marginLeft: 4 },
});
