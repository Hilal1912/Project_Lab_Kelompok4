export type UserRole = 'pelanggan' | 'admin' | 'kurir';

export interface User {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  noHp?: string;
}

export interface Product {
  id: string;
  nama: string;
  harga: number;
  deskripsi: string;
  gambar: string;
  kategori: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  catatan?: string;
}

export type OrderStatus = 'Menunggu' | 'Diproses' | 'Diantar' | 'Selesai';

export interface Order {
  id: string;
  items: CartItem[];
  totalHarga: number;
  status: OrderStatus;
  alamatPengiriman: string;
  tanggal: string;
}