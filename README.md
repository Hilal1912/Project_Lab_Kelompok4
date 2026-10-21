## Aplikasi Nasbak Cirebon (Nasi Bakar Ibu Efri)

Aplikasi pemesanan makanan berbasis mobile (React Native / Expo) yang dirancang untuk mempermudah transaksi kuliner nasi bakar secara digital. Aplikasi ini mengintegrasikan tiga peran pengguna (Pelanggan, Admin, dan Kurir) dalam satu ekosistem yang saling terhubung.

---

## 📌 Deskripsi Aplikasi

Aplikasi **Nasbak Cirebon** menghadirkan pengalaman pemesanan makanan yang modern dan efisien. Melalui aplikasi ini, pelanggan dapat menjelajahi menu, memesan makanan dengan berbagai pilihan metode pengiriman, hingga memantau status pesanan. Di saat yang sama, admin toko dapat mengelola stok menu dan memantau pendapatan, sementara kurir dapat mengelola antrean pengantaran pesanan secara efisien.

---

## 📱 Daftar Screen & Fitur UI

### 👤 1. Pelanggan
Splash & Auth Screen: Tampilan awal aplikasi, form login umum, dan pendaftaran akun baru (SplashScreen.tsx, LoginScreen.tsx, RegisterScreen.tsx).

<img width="586" height="464" alt="image" src="https://github.com/user-attachments/assets/7d049192-4866-4691-9e72-246e7911c720" />

Beranda & Katalog Menu: Rekomendasi menu terpopuler dan halaman seluruh daftar menu (HomeScreen.tsx, DaftarMenuScreen.tsx).

<img width="381" height="467" alt="image" src="https://github.com/user-attachments/assets/f942d372-5d6e-47c7-a310-63ce6d460c3a" />

Alur Transaksi & Keranjang: Pengaturan jumlah item, catatan pesanan, pemilihan tipe pesanan (Dine-in, Take Away, Delivery), dan ringkasan 
checkout (KeranjangScreen.tsx, JenisOrderScreen.tsx, CheckoutScreen.tsx).

<img width="925" height="559" alt="image" src="https://github.com/user-attachments/assets/4326bfe6-2f2b-4988-b756-2dd64244a100" />

Profil: Informasi akun pengguna dan riwayat transaksi (ProfilScreen.tsx).

<img width="278" height="680" alt="image" src="https://github.com/user-attachments/assets/c083fd71-c0e1-4a25-8e16-2e985d1112c5" />


### 👑 2. Admin Panel
Login Admin: Akses autentikasi khusus pengelola toko (LoginAdmin.tsx).

<img width="312" height="748" alt="image" src="https://github.com/user-attachments/assets/7e6529eb-6922-4cfe-9bb0-aaac0a9be5ea" />

Dashboard: Dashboard admin (DashboardScreen.tsx).

<img width="323" height="776" alt="image" src="https://github.com/user-attachments/assets/63b65ba1-6d92-47f2-b9eb-ef84f377209a" />

Kelola Menu & Produk: Tambah menu baru, edit nama/harga produk, dan kelola ketersediaan stok (KelolaMenuScreen.tsx, EditNamaProduk.tsx).

<img width="666" height="789" alt="image" src="https://github.com/user-attachments/assets/003136a1-7aaf-4d19-aa66-7c8d16d76c03" />

<img width="324" height="787" alt="image" src="https://github.com/user-attachments/assets/3f66edfd-ba60-440d-8e23-27cfa73108ef" />

Kelola Pesanan & Pelanggan: Pemantauan status pesanan masuk dan manajemen daftar pelanggan (KelolaPesananScreen.tsx, KelolaPelangganScreen.tsx).

<img width="662" height="778" alt="image" src="https://github.com/user-attachments/assets/295aa137-2283-4611-a8a5-99d63740acfd" />

Laporan Penjualan: Laporan performa penjualan dan statistik kategori menu (LaporanPenjualanScreen.tsx).

<img width="333" height="770" alt="image" src="https://github.com/user-attachments/assets/9f37485d-11f5-46a3-80f8-46f7636dbbaa" />

### 🏍️ 3. Kurir Tracker
Login Kurir: Akses autentikasi khusus petugas pengantar (LoginKurir.tsx).

<img width="317" height="748" alt="image" src="https://github.com/user-attachments/assets/2a404f95-c828-4ec0-a414-360669aa3bce" />

Pesanan Saya: Tab navigasi status pengiriman (Dalam Antrean, Dalam Proses, *Dalam Perjalanan*) dan ringkasan order (PesananSayaScreen.tsx).

<img width="321" height="770" alt="image" src="https://github.com/user-attachments/assets/7d842278-20f3-43eb-b7c1-de112993ac20" />

Detail Pesanan: Informasi alamat tujuan dan timeline alur pengantaran (Penerima, Sedang Diproses, Dalam Perjalanan, Selesai) (DetailPesananScreen.tsx).

<img width="333" height="771" alt="image" src="https://github.com/user-attachments/assets/128f5ddf-e118-4326-9a6a-2b4eb86614f1" />

Riwayat Pengantaran: Rekapitulasi seluruh pesanan yang telah sukses diantar (RiwayatPengantaranScreen.tsx).

<img width="326" height="781" alt="image" src="https://github.com/user-attachments/assets/57fda554-e59c-4a6b-b376-2d6e97470067" />

---

## 🛠️ Cara Menjalankan Proyek

### Prasyarat
[Node.js](https://nodejs.org/) (versi LTS)
Aplikasi **Expo Go** di smartphone (Android/iOS) atau emulator (Android Studio/Xcode).

### Langkah-langkah

1. **Clone Repositori**
- git clone [[https://github.com/username/nasbak-cirebon-app.git](https://github.com/username/nasbak-cirebon-app.git)](https://github.com/Hilal1912/Project_Lab_Kelompok4)
- cd kelompok4
- install dependensi : npm install
- jalankan sistem pengembang (expo) : npx expo start
- Buka Aplikasi : HP Fisik: Scan QR code yang muncul di terminal menggunakan aplikasi Expo Go.
                  Web Browser: Tekan tombol w di terminal untuk membuka tampilan web.
                  Emulator: Tekan a untuk Android atau i untuk iOS.
    
