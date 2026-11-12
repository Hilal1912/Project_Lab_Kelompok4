import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';

// Route ini menangani callback dari Google OAuth
// Deep link: kelompok4://google-auth?...
export default function GoogleAuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    // Jika ada error dari OAuth, kembali ke login
    if (params.error) {
      console.error('OAuth error:', params.error, params.error_description);
      router.replace('/login');
      return;
    }

    // Session akan dihandle otomatis oleh onAuthStateChange di auth-context
    // Cukup tunggu sebentar lalu cek session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // auth-context akan handle navigasi berdasarkan role
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    };

    checkSession();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff9f0' }}>
      <ActivityIndicator size="large" color="#166534" />
    </View>
  );
}
