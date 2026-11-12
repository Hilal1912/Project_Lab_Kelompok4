import React, { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { supabase } from '@/lib/supabase';
import type { DbUser } from '@/lib/supabase-types';
import type { User } from '@supabase/supabase-js';

interface AuthContextValue {
  user: DbUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Ambil profil user dari tabel users berdasarkan auth session
  const fetchUserProfile = async (authUserId: string): Promise<DbUser | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUserId)
      .maybeSingle();

    if (error) {
      console.error('Gagal ambil profil user:', error.message);
      return null;
    }
    return data;
  };

  // Untuk user Google baru: buat profil di tabel users jika belum ada
  const ensureUserProfile = async (authUser: User): Promise<DbUser | null> => {
    let profile = await fetchUserProfile(authUser.id);
    if (profile) return profile;

    // Profil belum ada — user baru via Google OAuth, buat profil default
    const nama =
      authUser.user_metadata?.full_name ??
      authUser.user_metadata?.name ??
      (authUser.email ? authUser.email.split('@')[0] : 'Pengguna');

    const { data: newProfile, error: insertError } = await supabase
      .from('users')
      .insert({
        id: authUser.id,
        nama,
        email: authUser.email ?? null,
        no_hp: null,
        password_hash: '', // Google OAuth tidak pakai password
        role: 'pelanggan',
        is_aktif: true,
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Gagal buat profil user baru:', insertError.message);
      return null;
    }

    return newProfile;
  };

  useEffect(() => {
    // Cek session yang sudah ada saat app dibuka
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await ensureUserProfile(session.user);
        setUser(profile);
      }
      setLoading(false);
    });

    // Listen perubahan auth state (login / logout / Google OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await ensureUserProfile(session.user);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }
  return context;
}
