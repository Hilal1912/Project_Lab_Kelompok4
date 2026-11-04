// Service layer untuk semua operasi admin ke Supabase
import { supabase } from './supabase';
import type { DbMenu, DbPesanan, DbUser } from './supabase-types';

// ─── MENU ────────────────────────────────────────────────────────────────────

export async function getAllMenu(): Promise<DbMenu[]> {
  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .order('created_at', { ascending: true });
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

export async function tambahMenu(
  payload: Omit<DbMenu, 'id' | 'created_at' | 'updated_at'>,
): Promise<void> {
  const { error } = await supabase.from('menu').insert(payload);
  if (error) throw error;
}

export async function updateMenu(
  id: string,
  payload: Partial<Omit<DbMenu, 'id' | 'created_at' | 'updated_at'>>,
): Promise<void> {
  const { error } = await supabase.from('menu').update(payload).eq('id', id);
  if (error) throw error;
}

export async function hapusMenu(id: string): Promise<void> {
  const { error } = await supabase.from('menu').delete().eq('id', id);
  if (error) throw error;
}

// ─── PESANAN ─────────────────────────────────────────────────────────────────

export interface PesananAdmin extends DbPesanan {
  pesanan_items: Array<{
    id: string;
    nama_menu: string;
    qty: number;
    harga: number;
    catatan: string | null;
  }>;
}

export async function getAllPesanan(jenisOrder?: string): Promise<PesananAdmin[]> {
  let query = supabase
    .from('pesanan')
    .select('*, pesanan_items(id, nama_menu, qty, harga, catatan)')
    .order('created_at', { ascending: false });
  if (jenisOrder && jenisOrder !== 'Semua') {
    query = query.eq('jenis_order', jenisOrder);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as PesananAdmin[];
}

export async function getDetailPesananAdmin(id: string): Promise<PesananAdmin | null> {
  const { data, error } = await supabase
    .from('pesanan')
    .select('*, pesanan_items(id, nama_menu, qty, harga, catatan)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as PesananAdmin | null;
}

export async function updateStatusPesananAdmin(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('pesanan')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

// ─── PELANGGAN ────────────────────────────────────────────────────────────────

export async function getAllPelanggan(): Promise<DbUser[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'pelanggan')
    .order('nama');
  if (error) throw error;
  return data ?? [];
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalPesananHariIni: number;
  pendapatanHariIni: number;
  dineIn: number;
  takeAway: number;
  delivery: number;
  menuTerlaris: Array<{ nama: string; jumlah: number }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const { data: pesananHariIni, error } = await supabase
    .from('pesanan')
    .select('jenis_order, total, pesanan_items(nama_menu, qty)')
    .eq('tanggal', today)
    .eq('is_dibatalkan', false);

  if (error) throw error;

  const list = pesananHariIni ?? [];
  const totalPesananHariIni = list.length;
  const pendapatanHariIni = list.reduce((sum, p) => sum + (p.total ?? 0), 0);
  const dineIn = list.filter((p) => p.jenis_order === 'Dine-in').length;
  const takeAway = list.filter((p) => p.jenis_order === 'Take Away').length;
  const delivery = list.filter((p) => p.jenis_order === 'Delivery').length;

  // Hitung menu terlaris dari pesanan_items hari ini
  const counter: Record<string, number> = {};
  for (const pesanan of list) {
    const items = (pesanan as any).pesanan_items ?? [];
    for (const item of items) {
      counter[item.nama_menu] = (counter[item.nama_menu] ?? 0) + item.qty;
    }
  }
  const menuTerlaris = Object.entries(counter)
    .map(([nama, jumlah]) => ({ nama, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, 3);

  return { totalPesananHariIni, pendapatanHariIni, dineIn, takeAway, delivery, menuTerlaris };
}

// ─── LAPORAN ─────────────────────────────────────────────────────────────────

export interface LaporanData {
  totalTransaksi: number;
  totalPendapatan: number;
  dineInPersen: number;
  takeAwayPersen: number;
  deliveryPersen: number;
  menuTerlaris: Array<{ nama: string; jumlah: number }>;
}

export async function getLaporanPenjualan(
  tanggalMulai: string,
  tanggalSelesai: string,
): Promise<LaporanData> {
  const { data, error } = await supabase
    .from('pesanan')
    .select('jenis_order, total, pesanan_items(nama_menu, qty)')
    .gte('tanggal', tanggalMulai)
    .lte('tanggal', tanggalSelesai)
    .eq('is_dibatalkan', false);

  if (error) throw error;

  const list = data ?? [];
  const totalTransaksi = list.length;
  const totalPendapatan = list.reduce((sum, p) => sum + (p.total ?? 0), 0);

  const dineIn = list.filter((p) => p.jenis_order === 'Dine-in').length;
  const takeAway = list.filter((p) => p.jenis_order === 'Take Away').length;
  const delivery = list.filter((p) => p.jenis_order === 'Delivery').length;

  const dineInPersen = totalTransaksi ? Math.round((dineIn / totalTransaksi) * 100) : 0;
  const takeAwayPersen = totalTransaksi ? Math.round((takeAway / totalTransaksi) * 100) : 0;
  const deliveryPersen = totalTransaksi ? Math.round((delivery / totalTransaksi) * 100) : 0;

  const counter: Record<string, number> = {};
  for (const pesanan of list) {
    const items = (pesanan as any).pesanan_items ?? [];
    for (const item of items) {
      counter[item.nama_menu] = (counter[item.nama_menu] ?? 0) + item.qty;
    }
  }
  const menuTerlaris = Object.entries(counter)
    .map(([nama, jumlah]) => ({ nama, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, 3);

  return { totalTransaksi, totalPendapatan, dineInPersen, takeAwayPersen, deliveryPersen, menuTerlaris };
}
