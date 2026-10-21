export interface Pelanggan {
  id: string;
  nama: string;
  noHp: string;
  jumlahPesanan: number;
}

export const pelangganData: Pelanggan[] = [
  { id: '1', nama: 'Nurkhotimah',   noHp: '0812 3456 7890', jumlahPesanan: 5 },
  { id: '2', nama: 'Ahmad Fauzi',   noHp: '0813 2222 3333', jumlahPesanan: 3 },
  { id: '3', nama: 'Siti Aisyah',   noHp: '0821 1111 2222', jumlahPesanan: 2 },
  { id: '4', nama: 'Ricky Pratama', noHp: '0895 6666 7777', jumlahPesanan: 1 },
];
