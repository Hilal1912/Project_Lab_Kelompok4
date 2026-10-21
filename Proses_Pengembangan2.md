- Menentukan Tema Project
  Sistem Layanan Pemesanan Nasi Bakar Berbasis Mobile untuk Wilayah Kota Cirebon
- Pembagian tugas
    Admin : Rizki
    Delivery : Nurkhotimah
    User : Hilal Dan Pasya
- ss minimal Sketch up > sudah ada halamannya

1. Rizki Aidil Fazri = Halaman Admin
<img width="1857" height="636" alt="image" src="https://github.com/user-attachments/assets/97e66ec8-81ea-4d5c-b77a-ea3ffacd44e6" />


2. Nurkhotimah = 
<img width="430" height="349" alt="image" src="https://github.com/user-attachments/assets/8fbbcf5b-e655-404d-8c6f-26ef792e1dcb" />


3. Pasya & Hilal = Halaman Pelanggan (User)
<img width="1839" height="439" alt="image" src="https://github.com/user-attachments/assets/15d53810-6d8e-496b-b5e1-c4268320e75b" />



### Rancangan Antarmuka

<img width="1565" height="752" alt="image" src="https://github.com/user-attachments/assets/8a9a1e7e-93e5-4170-adae-e0740fcbe7bf" />

---

## Proses Pengembangan 2 — Implementasi dan Pengujian

Pembaruan: **22 Oktober 2026**

Pada tahap ini, rancangan antarmuka dikembangkan menjadi aplikasi mobile menggunakan React Native, Expo, dan Expo Router. Aplikasi menyediakan alur untuk pelanggan, admin, dan kurir.

### Hasil Implementasi

- **Pelanggan:** halaman pembuka dan login, beranda, daftar menu, keranjang, pemilihan jenis pesanan, checkout, pesanan, dan profil.
- **Admin:** dashboard, pengelolaan menu, pesanan, dan laporan. Form tambah menu menampilkan menu baru pada daftar selama aplikasi berjalan; perubahan data demo belum disimpan ke backend.
- **Kurir:** login demo, daftar pesanan berdasarkan status, detail pesanan, riwayat pengantaran, serta halaman profil dan informasi kurir.
- **Navigasi:** alur admin dipisahkan pada rute `/admin`, sedangkan rute detail pesanan kurir dibuat terpisah dari detail pesanan admin. Tombol kembali pada halaman admin memiliki tujuan cadangan agar tidak mengirim pengguna ke beranda yang keliru.

### Pengujian

Build web Expo dan pemeriksaan TypeScript berhasil dijalankan. Alur demo admin, tambah menu, membuka detail pesanan admin, dan kembali ke daftar pesanan juga sudah dicoba pada web.

### Batasan Versi Demo

Login pelanggan, admin, dan kurir pada versi ini belum menggunakan autentikasi backend. Data menu dan pesanan admin masih berupa data contoh; menu yang ditambahkan dikelola sementara di memori aplikasi dan dapat hilang saat aplikasi dimulai ulang. Versi ini ditujukan untuk demonstrasi antarmuka dan alur navigasi, bukan transaksi produksi.

### Video Demonstrasi

[Tonton atau unduh video demonstrasi aplikasi](assets/Recording-2026-10-01-095159.mp4).
