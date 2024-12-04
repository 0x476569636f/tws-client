# Vigenesia Mobile

Vigenesia adalah aplikasi mobile yang dibangun menggunakan React Native dan Expo. Aplikasi ini merupakan client untuk proyek API [Vigenesia](https://github.com/0xirvan/vigenesia-api)

## Anggota Kelompok 3

| No  | Nama Anggota   | NIM      |
| --- | -------------- | -------- |
| 1   | Rizki Fernando | 10220045 |
| 2   | Irvan Pramana  | 10220008 |
| 3   | Azfa Haqqani   | 10220082 |
| 4   | Haikal Putra   | 10220068 |
| 5   | Tirta Raga     | 10220021 |

## Fitur

- **Registrasi dan Login**
- **Create Read Delete untuk berita**
- **Pencarian berita**
- **CRUD untuk motivasi**

Catatan: Hanya admin yang bisa menambah dan menghapus berita

## Prerequisites

Sebelum memulai, pastikan Anda memiliki hal-hal berikut:

- Node.js (versi 20 atau lebih baru)
- NPM

## Penggunaan Supabase untuk Penyimpanan Gambar

Aplikasi ini menggunakan supabase untuk penyimpanan gambar

1. Daftar di Supabase: Jika belum memiliki akun Supabase, Anda bisa mendaftar di [Supabase](https://supabase.com/).

2. Buat Project Baru di Supabase: Setelah mendaftar, buat proyek baru di dashboard Supabase.

3. Dapatkan URL dan Kunci API: Setelah proyek berhasil dibuat, Anda akan diberikan URL Supabase dan Kunci API (Anon Key) yang digunakan untuk mengakses layanan Supabase. Anda akan memerlukan dua informasi ini untuk mengonfigurasi aplikasi.

4. Buat Storage Bucket: Buatlah bucket di Supabase Storage yang akan digunakan untuk menyimpan gambar. Pastikan bucket tersebut dinamai **images**.

Lalu buat file .env dan tambahkan variabel:

```bash
    EXPO_PUBLIC_SUPABASE_URL= // URL PUBLIC SUPABASE
    EXPO_PUBLIC_SUPABASE_ANON_KEY= // ANON KEY SUPABASE
```

## Instalasi

Ikuti langkah-langkah berikut untuk menginstal dan menjalankan aplikasi:

1.  Clone repositori ini:

    ```bash
    git clone https://github.com/username/vigenesia-client.git

    ```

2.  Masuk ke direktori proyek:

    ```bash
    cd vigenesia-client

    ```

3.  Instal dependensi:

    ```bash
    npm install

    ```

## Menggunakan Expo Go Untuk Menjalankan Aplikasi

Expo Go memungkinkan Anda untuk menjalankan aplikasi Expo langsung di perangkat mobile tanpa perlu menginstal alat pengembangan tambahan. Berikut adalah langkah-langkah untuk menggunakan Expo Go:

1.  Instal aplikasi Expo Go di perangkat mobile Anda dari [Expo SDK 51](https://expo.dev/go?sdkVersion=51&platform=android&device=true)

2.  Jalankan aplikasi Expo di lingkungan pengembangan Anda:

    ```bash
    npm run start
    ```

3.  Pindai kode QR yang muncul di terminal atau di browser menggunakan aplikasi Expo Go di perangkat mobile Anda.

4.  Aplikasi Anda akan terbuka di Expo Go dan Anda dapat melihat perubahan secara langsung saat Anda mengembangkan aplikasi.

Catatan: PC harus sudah terinstall adb dan di tambahkan ke path variable windows

## Cara build ke Android App

Dokumentasi Expo:
https://docs.expo.dev/build/setup/

## Rilis build

Berikut adalah link untuk mengunduh APK yang sudah di bangun / compile menjadi .apk

APK Build: [VIGENESIA APK](https://expo.dev/accounts/darknet1255/projects/vigenesia/builds/9f9a1c04-4246-44e4-8b93-0330b4a5b5fa)

Catatan: Link akan di update jika ada build baru
