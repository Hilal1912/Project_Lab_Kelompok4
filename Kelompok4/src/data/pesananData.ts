export type JenisOrder = 'Dine-in' | 'Take Away' | 'Delivery';
export type StatusPesanan =
  | 'Dalam Pengiriman'
  | 'Siap Diambil'
  | 'Sedang Diproses'
  | 'Dalam Antrian'
  | 'Selesai';

export interface Pesanan {
  id: string;
  nomorOrder: string;
  waktu: string;
  jenisOrder: JenisOrder;
  status: StatusPesanan;
  total: number;
  items: { nama: string; qty: number; harga: number }[];
  alamat?: string;
}

export const pesananData: Pesanan[] = [
  {
    id: '1',
    nomorOrder: '#NB20250601',
    waktu: '10:25',
    jenisOrder: 'Delivery',
    status: 'Dalam Pengiriman',
    total: 20000,
    items: [
      { nama: 'Nasi Bakar Ayam', qty: 1, harga: 15000 },
      { nama: 'Es Teh Manis', qty: 1, harga: 5000 },
    ],
    alamat: 'Jl. Siliwangi No. 12, Cirebon',
  },
  {
    id: '2',
    nomorOrder: '#NB20250631',
    waktu: '12:10',
    jenisOrder: 'Take Away',
    status: 'Siap Diambil',
    total: 20000,
    items: [
      { nama: 'Nasi Bakar Cumi', qty: 1, harga: 17000 },
      { nama: 'Es Teh Manis', qty: 1, harga: 5000 },
    ],
  },
  {
    id: '3',
    nomorOrder: '#NB20250630',
    waktu: '18:45',
    jenisOrder: 'Dine-in',
    status: 'Sedang Diproses',
    total: 35000,
    items: [
      { nama: 'Nasi Bakar Ayam', qty: 1, harga: 15000 },
      { nama: 'Nasi Bakar Cumi', qty: 1, harga: 17000 },
      { nama: 'Es Teh Manis', qty: 1, harga: 5000 },
    ],
  },
  {
    id: '4',
    nomorOrder: '#NB20250629',
    waktu: '14:20',
    jenisOrder: 'Delivery',
    status: 'Dalam Antrian',
    total: 22000,
    items: [
      { nama: 'Nasi Bakar Teri', qty: 1, harga: 13000 },
      { nama: 'Es Jeruk', qty: 1, harga: 6000 },
    ],
    alamat: 'Jl. Tentara Pelajar No. 5, Cirebon',
  },
  {
    id: '5',
    nomorOrder: '#NB20250628',
    waktu: '09:00',
    jenisOrder: 'Dine-in',
    status: 'Selesai',
    total: 15000,
    items: [{ nama: 'Nasi Bakar Ayam', qty: 1, harga: 15000 }],
  },
];
