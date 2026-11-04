import React, { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { supabase } from '@/lib/supabase';
import type { DbUser } from '@/lib/supabase-types';

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

  useEffect(() => {
    // Cek session yang sudah ada saat app dibuka
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      }
      setLoading(false);
    });

    // Listen perubahan auth state (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
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
