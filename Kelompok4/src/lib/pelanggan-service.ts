// Service layer untuk semua operasi pelanggan ke Supabase
import { supabase } from './supabase';
import type { DbMenu, DbPesanan, DbPesananItem, DbAlamat } from './supabase-types';

// ─── MENU ────────────────────────────────────────────────────────────────────

export async function getMenuTersedia(): Promise<DbMenu[]> {
  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .eq('tersedia', true)
    .order('kategori')
    .order('nama');
  if (error) throw error;
  return data ?? [];
}

export async function getDetailMenu(id: string): Promise<DbMenu | null> {
  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ─── PESANAN ─────────────────────────────────────────────────────────────────

export interface PesananPelanggan extends DbPesanan {
  pesanan_items: DbPesananItem[];
}

export async function getPesananPelanggan(userId: string): Promise<PesananPelanggan[]> {
  const { data, error } = await supabase
    .from('pesanan')
    .select('*, pesanan_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PesananPelanggan[];
}

export async function getDetailPesananPelanggan(id: string): Promise<PesananPelanggan | null> {
  const { data, error } = await supabase
    .from('pesanan')
    .select('*, pesanan_items(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as PesananPelanggan | null;
}

export interface BuatPesananPayload {
  userId: string;
  alamatId: string | null;
  alamatTeks: string | null;
  jenisOrder: 'Dine-in' | 'Take Away' | 'Delivery';
  metodeBayar: string;
  catatan: string;
  items: Array<{ menuId: string; namMenu: string; harga: number; qty: number; catatan?: string }>;
  subtotal: number;
  ongkir: number;
}

export async function buatPesanan(payload: BuatPesananPayload): Promise<DbPesanan> {
  const total = payload.subtotal + payload.ongkir;
  const nomorOrder = `NB${Date.now()}`;
  const now = new Date();

  // Insert pesanan
  const { data: pesanan, error: pesananError } = await supabase
    .from('pesanan')
    .insert({
      nomor_order: nomorOrder,
      user_id: payload.userId,
      alamat_id: payload.alamatId,
      alamat: payload.alamatTeks,
      jenis_order: payload.jenisOrder,
      status: 'Dalam Antrian',
      metode_bayar: payload.metodeBayar,
      catatan: payload.catatan || null,
      subtotal: payload.subtotal,
      ongkir: payload.ongkir,
      total,
      tanggal: now.toISOString().slice(0, 10),
      waktu: now.toTimeString().slice(0, 8),
      is_dibatalkan: false,
    })
    .select()
    .single();

  if (pesananError) throw pesananError;

  // Insert pesanan_items
  const items = payload.items.map((item) => ({
    pesanan_id: pesanan.id,
    menu_id: item.menuId,
    nama_menu: item.namMenu,
    harga: item.harga,
    qty: item.qty,
    catatan: item.catatan ?? null,
  }));

  const { error: itemsError } = await supabase.from('pesanan_items').insert(items);
  if (itemsError) throw itemsError;

  return pesanan;
}

export async function batalkanPesanan(
  pesananId: string,
  userId: string,
  alasan: string,
): Promise<void> {
  // Update status pesanan
  const { error: pesananError } = await supabase
    .from('pesanan')
    .update({ is_dibatalkan: true, alasan_batal: alasan, status: 'Dibatalkan' })
    .eq('id', pesananId)
    .eq('user_id', userId);
  if (pesananError) throw pesananError;

  // Catat ke tabel pembatalan_pesanan
  const { error: batalError } = await supabase
    .from('pembatalan_pesanan')
    .insert({
      pesanan_id: pesananId,
      dibatalkan_oleh: userId,
      role_pembatal: 'pelanggan',
      alasan,
      catatan_kendala: '',
    });
  if (batalError) throw batalError;
}

// ─── ALAMAT ───────────────────────────────────────────────────────────────────

export async function getAlamatPelanggan(userId: string): Promise<DbAlamat[]> {
  const { data, error } = await supabase
    .from('alamat')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at');
  if (error) throw error;
  return data ?? [];
}

export async function getAlamatDefault(userId: string): Promise<DbAlamat | null> {
  const { data, error } = await supabase
    .from('alamat')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}
