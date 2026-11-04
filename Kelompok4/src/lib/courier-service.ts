// Service layer untuk semua operasi kurir ke Supabase
import { supabase } from './supabase';
import type { DbPesanan, DbPesananItem, DbKendaraan, DbUser } from './supabase-types';

export interface PesananKurir extends DbPesanan {
  pesanan_items: DbPesananItem[];
  pelanggan?: { nama: string; no_hp: string | null } | null;
}

// Ambil profil kurir dari tabel users
export async function getProfilKurir(userId: string): Promise<DbUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .eq('role', 'kurir')
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Ambil pesanan aktif kurir (bukan selesai/dibatalkan) berdasarkan kurir_id
export async function getPesananAktifKurir(kurirId: string): Promise<PesananKurir[]> {
  const { data, error } = await supabase
    .from('pesanan')
    .select('*, pesanan_items(*)')
    .eq('kurir_id', kurirId)
    .eq('jenis_order', 'Delivery')
    .eq('is_dibatalkan', false)
    .not('status', 'eq', 'Selesai')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PesananKurir[];
}

// Ambil semua pesanan delivery yang belum punya kurir (antrian)
export async function getPesananAntrian(): Promise<PesananKurir[]> {
  const { data, error } = await supabase
    .from('pesanan')
    .select('*, pesanan_items(*)')
    .eq('jenis_order', 'Delivery')
    .eq('status', 'Dalam Antrian')
    .is('kurir_id', null)
    .eq('is_dibatalkan', false)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PesananKurir[];
}

// Ambil riwayat pengantaran selesai oleh kurir
export async function getRiwayatPengantaran(kurirId: string): Promise<PesananKurir[]> {
  const { data, error } = await supabase
    .from('pesanan')
    .select('*, pesanan_items(*)')
    .eq('kurir_id', kurirId)
    .eq('status', 'Selesai')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PesananKurir[];
}

// Ambil detail satu pesanan
export async function getDetailPesanan(pesananId: string): Promise<PesananKurir | null> {
  const { data, error } = await supabase
    .from('pesanan')
    .select('*, pesanan_items(*)')
    .eq('id', pesananId)
    .maybeSingle();
  if (error) throw error;
  return data as PesananKurir | null;
}

// Update status pesanan + catat progres pengantaran
export async function updateStatusPesanan(
  pesananId: string,
  kurirId: string,
  statusBaru: string,
  catatan?: string,
): Promise<void> {
  const { error: pesananError } = await supabase
    .from('pesanan')
    .update({ status: statusBaru, progres_kurir: statusBaru })
    .eq('id', pesananId);
  if (pesananError) throw pesananError;

  const { error: progresError } = await supabase
    .from('progres_pengantaran')
    .insert({
      pesanan_id: pesananId,
      kurir_id: kurirId,
      progres: statusBaru,
      catatan: catatan ?? null,
      waktu: new Date().toISOString(),
    });
  if (progresError) throw progresError;
}

// Ambil kendaraan kurir
export async function getKendaraanKurir(kurirId: string): Promise<DbKendaraan | null> {
  const { data, error } = await supabase
    .from('kendaraan')
    .select('*')
    .eq('kurir_id', kurirId)
    .eq('is_aktif', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Update data kendaraan kurir
export async function updateKendaraanKurir(
  kendaraanId: string,
  payload: Partial<Pick<DbKendaraan, 'jenis' | 'merek_model' | 'warna' | 'plat_nomor'>>,
): Promise<void> {
  const { error } = await supabase
    .from('kendaraan')
    .update(payload)
    .eq('id', kendaraanId);
  if (error) throw error;
}

// Update profil kurir (nama, no_hp)
export async function updateProfilKurir(
  userId: string,
  payload: Partial<Pick<DbUser, 'nama' | 'no_hp'>>,
): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update(payload)
    .eq('id', userId);
  if (error) throw error;
}
