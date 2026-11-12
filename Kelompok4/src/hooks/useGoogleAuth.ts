import { useState } from 'react';
import { Alert } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { supabase } from '@/lib/supabase';

// Ganti dengan Web Client ID dari Google Cloud Console
// APIs & Services → Credentials → OAuth 2.0 Client IDs → Web application → Client ID
const WEB_CLIENT_ID = '410465239330-5v2igp12r0hrhmf28c69cna59656i5ri.apps.googleusercontent.com';

// Konfigurasi Google Sign-In — dipanggil sekali saat app start
GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  scopes: ['profile', 'email'],
});

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      // Ambil id_token dari hasil sign in
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        Alert.alert('Google Sign-In Gagal', 'Tidak bisa mendapatkan token dari Google.');
        return;
      }

      // Kirim id_token ke Supabase
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        Alert.alert('Google Sign-In Gagal', error.message);
        return;
      }

      // onAuthStateChange di auth-context akan handle navigasi otomatis

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancel — tidak perlu alert
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Info', 'Sign-in sedang dalam proses.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services tidak tersedia di perangkat ini.');
      } else {
        Alert.alert('Error', error.message ?? 'Terjadi kesalahan. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading };
}
