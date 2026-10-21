export interface MenuItem {
  id: string;
  nama: string;
  harga: number;
  kategori: 'Produk' | 'Minuman';
  tersedia: boolean;
  gambar: string;
  deskripsi: string;
}

export const menuData: MenuItem[] = [
  {
    id: '1',
    nama: 'Nasi Bakar Ayam',
    harga: 15000,
    kategori: 'Produk',
    tersedia: true,
    gambar: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
    deskripsi: 'Nasi bakar dengan isian ayam berbumbu khas Cirebon',
  },
  {
    id: '2',
    nama: 'Nasi Bakar Cumi',
    harga: 17000,
    kategori: 'Produk',
    tersedia: true,
    gambar: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
    deskripsi: 'Nasi bakar dengan isian cumi segar berbumbu hitam',
  },
  {
    id: '3',
    nama: 'Nasi Bakar Teri',
    harga: 13000,
    kategori: 'Produk',
    tersedia: true,
    gambar: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
    deskripsi: 'Nasi bakar dengan isian teri medan yang gurih',
  },
  {
    id: '4',
    nama: 'Es Teh Manis',
    harga: 5000,
    kategori: 'Minuman',
    tersedia: true,
    gambar: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    deskripsi: 'Es teh manis segar khas warung Nasbak Cirebon',
  },
  {
    id: '5',
    nama: 'Es Jeruk',
    harga: 6000,
    kategori: 'Minuman',
    tersedia: false,
    gambar: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    deskripsi: 'Es jeruk peras segar',
  },
];

export const menuTerlaris = [
  { nama: 'Nasi Bakar Ayam', jumlah: 42, warna: '#E8531D' },
  { nama: 'Nasi Bakar Cumi', jumlah: 28, warna: '#2D5016' },
  { nama: 'Es Teh Manis',    jumlah: 20, warna: '#D4A017' },
];
