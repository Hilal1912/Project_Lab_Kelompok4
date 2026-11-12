# Proses Pengembangan 3: Login Menggunakan Google

Dokumen ini mencatat pengembangan fitur login pelanggan menggunakan akun Google pada aplikasi Nasbak Cirebon.

## Tujuan

Memudahkan pelanggan masuk tanpa membuat atau mengetik kata sandi aplikasi. Autentikasi Google direncanakan terhubung dengan Supabase Auth, yang sudah digunakan aplikasi untuk autentikasi pelanggan.

## Alur Pengembangan

1. Menyiapkan Google sebagai penyedia login di konfigurasi autentikasi Supabase.
2. Menambahkan tombol **Masuk dengan Google** pada halaman login pelanggan.
3. Menghubungkan proses login ke Google OAuth dan menangani pengalihan kembali ke aplikasi.
4. Memastikan sesi login tersimpan dan profil pelanggan dapat dimuat setelah autentikasi.
5. Memeriksa penanganan pembatalan login dan kegagalan autentikasi agar pengguna memperoleh informasi yang jelas.

## Alur Pengguna

1. Pelanggan membuka halaman login.
2. Pelanggan memilih **Masuk dengan Google**.
3. Pelanggan memilih atau mengonfirmasi akun Google.
4. Setelah autentikasi berhasil, pelanggan kembali ke aplikasi dan diarahkan ke halaman utama.
5. Jika proses dibatalkan atau gagal, pelanggan tetap dapat mencoba kembali atau menggunakan login email dan kata sandi.

## Pengujian

- Login berhasil dengan akun Google yang valid.
- Sesi tetap dikenali saat aplikasi dibuka kembali.
- Pembatalan login tidak membuat sesi masuk.
- Kegagalan autentikasi menampilkan informasi yang sesuai.
- Login email dan kata sandi yang sudah ada tetap dapat digunakan.

## Video Demo

[Tonton video demo login Google](./Kelompok4/assets/Login-Google.mp4)

## Catatan Status

Dokumen ini mencatat alur dan kebutuhan pengembangan. Pada kode aplikasi saat ini, halaman login pelanggan masih menggunakan email dan kata sandi; implementasi login Google perlu diverifikasi setelah dikerjakan.
