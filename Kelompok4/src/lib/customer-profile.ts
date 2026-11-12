import { supabase } from './supabase';

export interface CustomerProfile {
  id: string;
  nama: string;
  no_hp: string | null;
  email: string;
  role: string;
  is_aktif: boolean;
}

export async function getCurrentCustomerProfile(): Promise<CustomerProfile> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const user = userData.user;
  if (!user?.email) throw new Error('Silakan masuk terlebih dahulu.');

  const escapedEmail = user.email.replace(/[\\%_]/g, '\\$&');
  const { data, error } = await supabase
    .from('users')
    .select('id, nama, no_hp, email, role, is_aktif')
    .ilike('email', escapedEmail)
    .maybeSingle();

  if (error) {
    if (error.code === 'PGRST205' || error.code === '42P01') {
      throw new Error(
        'Tabel users belum tersedia. Pastikan aplikasi memakai project Supabase backend dan minta pemilik project menjalankan SQL supabase/migrations/20261104210000_secure_users_and_addresses.sql.'
      );
    }
    throw error;
  }

  if (!data) {
    throw new Error(
      'Login Auth berhasil, tetapi profil dengan email yang sama tidak ditemukan di tabel users. Minta backend menjalankan supabase/migrations/20261105001000_backfill_existing_auth_customers.sql di project Supabase yang sama. Pastikan migrasi keamanan 20261104210000_secure_users_and_addresses.sql sudah diterapkan lebih dulu.'
    );
  }

  return data;
}
