import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { supabase } from '@/lib/supabase';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useAuth } from '@/context/auth-context';

// Icon Google asli (multicolor)
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </Svg>
  );
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { signInWithGoogle, loading: googleLoading } = useGoogleAuth();

  // Navigasi otomatis setelah login Google berhasil (user diisi oleh auth-context)
  React.useEffect(() => {
    if (!user) return;
    if (user.role === 'admin') router.replace('/admin/dashboard');
    else if (user.role === 'pelanggan') router.replace('/home');
  }, [user]);

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
                disabled={loading || googleLoading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text className="text-white text-lg font-semibold">Masuk</Text>
                }
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mt-4 mb-1">
                <View className="flex-1 h-px bg-neutral-200" />
                <Text className="mx-3 text-gray-400 text-sm">atau</Text>
                <View className="flex-1 h-px bg-neutral-200" />
              </View>

              {/* Tombol Google Sign-In */}
              <TouchableOpacity
                style={s.googleBtn}
                onPress={signInWithGoogle}
                disabled={loading || googleLoading}
                accessibilityRole="button"
                accessibilityLabel="Masuk dengan Google"
              >
                {googleLoading ? (
                  <ActivityIndicator color="#374151" />
                ) : (
                  <>
                    <GoogleIcon size={22} />
                    <Text style={s.googleBtnText}>Masuk dengan Google</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="w-full h-12 rounded-lg border border-neutral-300 bg-white/70 justify-center items-center mt-3"
                onPress={() => router.push('/login-kurir')}
                disabled={loading || googleLoading}
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
  googleBtn: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    marginTop: 4,
    gap: 10,
  },
  googleBtnText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
});
