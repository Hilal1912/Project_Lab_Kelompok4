/* eslint-disable react-hooks/set-state-in-effect */
// State layer kurir — semua data dari Supabase, bukan AsyncStorage
// File ini menggantikan implementasi lama yang pakai dummy data + AsyncStorage

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  getPesananAktifKurir,
  getPesananAntrian,
  getRiwayatPengantaran,
  updateStatusPesanan,
  type PesananKurir,
} from '../lib/courier-service';

export type CourierOrderStatus = 'antrian' | 'proses' | 'perjalanan' | 'selesai';

// Mapping status DB → status internal kurir
const dbToLocalStatus: Record<string, CourierOrderStatus> = {
  'Dalam Antrian': 'antrian',
  'Sedang Diproses': 'proses',
  'Dalam Pengiriman': 'perjalanan',
  'Selesai': 'selesai',
};

// Mapping status internal kurir → status DB berikutnya
const nextStatusDB: Record<CourierOrderStatus, string> = {
  antrian: 'Sedang Diproses',
  proses: 'Dalam Pengiriman',
  perjalanan: 'Selesai',
  selesai: 'Selesai',
};

export interface CourierOrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface CourierOrder {
  id: string;          // pesanan.id (uuid)
  nomor: string;       // pesanan.nomor_order
  time: string;        // jam dari pesanan.waktu
  dateTime: string;    // tanggal + jam
  customer: string;    // dari pesanan.alamat atau catatan (nama pelanggan belum di-join)
  address: string;     // pesanan.alamat
  note?: string;       // pesanan.catatan
  status: CourierOrderStatus;
  items: CourierOrderItem[];
  deliveryFee: number;
  subtotal: number;
  total: number;
  paymentStatus: string;
  metode_bayar: string | null;
}

export interface CourierProfile {
  isAvailable: boolean;
  name: string;
  courierId: string;
  phone: string;
  email: string;
  userId: string;
  region?: string;
  vehicleName?: string;
  plate?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapPesananToOrder(p: PesananKurir): CourierOrder {
  const waktu = p.waktu ? String(p.waktu).slice(0, 5) : '-';
  const tanggal = p.tanggal
    ? new Date(p.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';
  const items: CourierOrderItem[] = (p.pesanan_items ?? []).map((item) => ({
    name: item.nama_menu,
    quantity: item.qty,
    unitPrice: item.harga,
  }));
  return {
    id: p.id,
    nomor: p.nomor_order,
    time: waktu,
    dateTime: `${tanggal} · ${waktu}`,
    customer: p.alamat ?? 'Pelanggan',
    address: p.alamat ?? '-',
    note: p.catatan ?? undefined,
    status: dbToLocalStatus[p.status] ?? 'antrian',
    items,
    deliveryFee: p.ongkir ?? 0,
    subtotal: p.subtotal ?? 0,
    total: p.total,
    paymentStatus: 'Lunas',
    metode_bayar: p.metode_bayar,
  };
}

// ─── Hook utama kurir ─────────────────────────────────────────────────────────

interface CourierDataState {
  orders: CourierOrder[];
  history: CourierOrder[];
  profile: CourierProfile;
  isHydrated: boolean;
  persistenceError: string | null;
  refresh: () => Promise<void>;
}

const defaultProfile: CourierProfile = {
  isAvailable: true,
  name: '',
  courierId: '',
  phone: '',
  email: '',
  userId: '',
};

export function useCourierData(): CourierDataState {
  const [orders, setOrders] = useState<CourierOrder[]>([]);
  const [history, setHistory] = useState<CourierOrder[]>([]);
  const [profile, setProfile] = useState<CourierProfile>(defaultProfile);
  const [isHydrated, setIsHydrated] = useState(false);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsHydrated(false);
    setPersistenceError(null);
    try {
      // Ambil session user yang sedang login
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPersistenceError('Sesi tidak ditemukan. Silakan login ulang.');
        return;
      }

      // Ambil profil kurir dari tabel users
      const { data: userProfile } = await supabase
        .from('users')
        .select('id, nama, no_hp, email, kurir_id, is_aktif')
        .eq('id', user.id)
        .maybeSingle();

      if (userProfile) {
        setProfile({
          isAvailable: userProfile.is_aktif ?? true,
          name: userProfile.nama,
          courierId: userProfile.kurir_id ?? userProfile.id.slice(0, 8).toUpperCase(),
          phone: userProfile.no_hp ?? '',
          email: userProfile.email ?? '',
          userId: userProfile.id,
        });
      }

      // Ambil pesanan aktif kurir (yang sudah di-assign ke kurir ini)
      const aktif = await getPesananAktifKurir(user.id);
      // Tambah pesanan antrian (belum ada kurir)
      const antrian = await getPesananAntrian();

      const allAktif = [
        ...aktif.map(mapPesananToOrder),
        ...antrian
          .filter((p) => !aktif.some((a) => a.id === p.id))
          .map((p) => ({ ...mapPesananToOrder(p), status: 'antrian' as CourierOrderStatus })),
      ];

      // Ambil riwayat selesai
      const riwayat = await getRiwayatPengantaran(user.id);

      setOrders(allAktif);
      setHistory(riwayat.map(mapPesananToOrder));
    } catch (e: any) {
      setPersistenceError(e.message ?? 'Gagal memuat data kurir.');
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    fetchAll().catch(() => null);
    // fetchAll sudah handle error internal
  }, [fetchAll]);

  return { orders, history, profile, isHydrated, persistenceError, refresh: fetchAll };
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function updateCourierOrderStatus(orderId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Tidak ada sesi aktif');

  // Ambil status pesanan sekarang
  const { data: pesanan } = await supabase
    .from('pesanan')
    .select('status, kurir_id')
    .eq('id', orderId)
    .maybeSingle();

  if (!pesanan) throw new Error('Pesanan tidak ditemukan');

  const currentLocal = dbToLocalStatus[pesanan.status] ?? 'antrian';
  const nextDB = nextStatusDB[currentLocal];

  // Kalau pesanan belum ada kurir (antrian), assign kurir sekarang
  const updatePayload: Record<string, any> = { status: nextDB };
  if (!pesanan.kurir_id) {
    updatePayload.kurir_id = user.id;
  }

  await updateStatusPesanan(orderId, user.id, nextDB);

  // Kalau antrian → assign kurir_id
  if (!pesanan.kurir_id) {
    await supabase.from('pesanan').update({ kurir_id: user.id }).eq('id', orderId);
  }
}

export async function updateCourierProfile(
  payload: Partial<Pick<CourierProfile, 'name' | 'phone' | 'isAvailable'>>,
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Tidak ada sesi aktif');

  const dbPayload: Record<string, any> = {};
  if (payload.name !== undefined) dbPayload.nama = payload.name;
  if (payload.phone !== undefined) dbPayload.no_hp = payload.phone;
  if (payload.isAvailable !== undefined) dbPayload.is_aktif = payload.isAvailable;

  const { error } = await supabase.from('users').update(dbPayload).eq('id', user.id);
  if (error) throw error;
}
