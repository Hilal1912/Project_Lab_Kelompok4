// Type definitions berdasarkan skema database Supabase
// Tabel: users, menu, pesanan, pesanan_items, kendaraan, progres_pengantaran, pembatalan_pesanan, alamat

export type UserRole = 'pelanggan' | 'admin' | 'kurir';

export interface DbUser {
  id: string;
  nama: string;
  email: string | null;
  no_hp: string | null;
  password_hash: string;
  role: UserRole;
  created_at: string | null;
  kurir_id: string | null;
  is_aktif: boolean | null;
}

export interface DbMenu {
  id: string;
  nama: string;
  harga: number;
  deskripsi: string | null;
  gambar: string | null;
  kategori: string;
  tersedia: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DbPesanan {
  id: string;
  nomor_order: string;
  user_id: string | null;
  kurir_id: string | null;
  jenis_order: string;
  status: string;
  total: number;
  alamat: string | null;
  catatan: string | null;
  waktu: string | null;
  created_at: string | null;
  updated_at: string | null;
  tanggal: string | null;
  metode_bayar: string | null;
  ongkir: number | null;
  subtotal: number | null;
  alamat_id: string | null;
  is_dibatalkan: boolean | null;
  progres_kurir: string | null;
  alasan_batal: string | null;
  catatan_batal: string | null;
}

export interface DbPesananItem {
  id: string;
  pesanan_id: string | null;
  menu_id: string | null;
  nama_menu: string;
  harga: number;
  qty: number;
  catatan: string | null;
  created_at: string | null;
}

export interface DbKendaraan {
  id: string;
  kurir_id: string | null;
  jenis: string;
  merek_model: string;
  warna: string;
  plat_nomor: string;
  is_aktif: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DbProgresPengantaran {
  id: string;
  pesanan_id: string | null;
  kurir_id: string | null;
  progres: string;
  catatan: string | null;
  waktu: string | null;
}

export interface DbPembatalanPesanan {
  id: string;
  pesanan_id: string | null;
  dibatalkan_oleh: string | null;
  role_pembatal: string | null;
  alasan: string;
  catatan_kendala: string;
  created_at: string | null;
}

export interface DbAlamat {
  id: string;
  user_id: string | null;
  label: string;
  label_custom: string | null;
  nama_penerima: string;
  nomor_telepon: string;
  alamat_lengkap: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kelurahan: string;
  kode_pos: string;
  is_default: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}
