# Todolist App

Aplikasi manajemen tugas (todo list) berbasis web yang sederhana, responsif, dan mudah digunakan. Dibangun dengan JavaScript vanilla tanpa framework eksternal, aplikasi ini menyediakan fitur lengkap untuk mengelola daftar tugas harian dengan antarmuka yang intuitif.

## Deskripsi

Todolist App adalah aplikasi web modern yang memungkinkan pengguna untuk menambah, mengedit, menghapus, dan menandai tugas sebagai selesai. Data disimpan secara otomatis di browser menggunakan localStorage, sehingga tugas tetap tersimpan meskipun halaman ditutup atau browser di-refresh.

## Fitur Utama

### Manajemen Tugas
- Menambahkan tugas baru dengan validasi input
- Mengedit tugas yang sudah ada secara inline
- Menandai tugas sebagai selesai atau belum selesai
- Menghapus tugas individual
- Menghapus semua tugas yang sudah selesai sekaligus

### Validasi Input
- Validasi judul tugas tidak boleh kosong
- Panjang minimal 3 karakter
- Panjang maksimal 50 karakter
- Otomatis menghapus spasi di awal dan akhir
- Pesan error yang informatif

### Filter dan Tampilan
- Filter tugas berdasarkan status: Semua, Belum Selesai, Selesai
- Tampilan waktu pembuatan tugas dalam format lokal Indonesia
- Urutan tugas dari yang terbaru ke terlama
- Pesan kosong ketika tidak ada tugas

### Persistensi Data
- Penyimpanan otomatis ke localStorage
- Data tetap tersimpan setelah browser ditutup
- Pemulihan data otomatis saat aplikasi dibuka kembali

### Mode Testing
- Mode pengujian manual terintegrasi
- Akses melalui URL dengan parameter `?test=true`
- Pengujian otomatis untuk semua fitur utama

## Cara Instalasi

### Prasyarat
- Node.js versi 14 atau lebih baru
- npm (Node Package Manager)

### Langkah Instalasi

1. Clone atau download repository ini

2. Masuk ke direktori proyek:
```bash
cd todolist-app
```

3. Install dependencies:
```bash
npm install
```

## Cara Menjalankan Proyek

### Menjalankan Aplikasi

Buka file `index.html` di browser web Anda. Anda dapat menggunakan salah satu cara berikut:

**Opsi 1: Buka langsung**
- Double-click file `index.html`
- Atau drag-and-drop file ke browser

**Opsi 2: Menggunakan Live Server (Recommended)**
- Gunakan ekstensi Live Server di VS Code
- Atau gunakan server lokal seperti:
```bash
npx serve .
```

### Menjalankan Mode Testing

Untuk mengaktifkan mode testing manual, tambahkan parameter `?test=true` di URL:
```
http://localhost:3000/index.html?test=true
```

Atau klik link "Mode Test" yang tersedia di halaman aplikasi.

### Menjalankan Unit Tests

Jalankan test suite menggunakan Vitest:
```bash
npm test
```

Test suite mencakup:
- Pengujian validasi input
- Pengujian operasi CRUD (Create, Read, Update, Delete)
- Pengujian filter dan state management
- Pengujian persistensi data
- Property-based testing dengan fast-check

## Struktur Folder

```
todolist-app/
├── src/                    # Source code
│   ├── app.js             # Entry point dan event handlers
│   ├── store.js           # State management dan business logic
│   ├── storage.js         # Persistensi data ke localStorage
│   ├── validators.js      # Validasi input pengguna
│   └── render.js          # Rendering UI dan manipulasi DOM
├── tests/                  # Unit tests
│   ├── store.test.js      # Test untuk store module
│   ├── storage.test.js    # Test untuk storage module
│   ├── validators.test.js # Test untuk validators module
│   └── render.test.js     # Test untuk render module
├── docs/                   # Dokumentasi tambahan
│   ├── test-manual.html   # Interface testing manual
│   └── test-manual.js     # Script testing manual
├── node_modules/           # Dependencies (auto-generated)
├── index.html              # Halaman utama aplikasi
├── style.css               # Styling aplikasi
├── package.json            # Konfigurasi npm dan dependencies
├── package-lock.json       # Lock file dependencies
├── vitest.config.js        # Konfigurasi testing
├── .gitignore              # File yang diabaikan git
├── README.md               # Dokumentasi utama (file ini)
├── CONTRIBUTING.md         # Panduan kontribusi
├── CHANGELOG.md            # Catatan perubahan versi
└── LICENSE                 # Lisensi MIT
```

## Teknologi yang Digunakan

### Frontend
- **HTML5** - Struktur markup semantik
- **CSS3** - Styling dan layout responsif
- **JavaScript ES6+** - Logika aplikasi dengan module system

### Development Tools
- **Vitest** - Framework testing modern untuk JavaScript
- **jsdom** - Simulasi DOM untuk testing
- **fast-check** - Property-based testing library
- **npm** - Package manager

### Browser APIs
- **localStorage** - Penyimpanan data lokal
- **crypto.randomUUID()** - Generasi ID unik
- **Date API** - Manajemen timestamp

## Arsitektur Aplikasi

Aplikasi ini menggunakan arsitektur modular dengan pemisahan tanggung jawab yang jelas:

- **app.js** - Orchestration layer yang menghubungkan semua modul
- **store.js** - Single source of truth untuk state aplikasi
- **storage.js** - Abstraksi layer untuk persistensi data
- **validators.js** - Business rules untuk validasi input
- **render.js** - Presentation layer untuk UI updates

## Penggunaan

### Menambah Tugas
1. Ketik judul tugas di input field
2. Tekan tombol "Tambah" atau Enter
3. Tugas akan muncul di daftar

### Mengedit Tugas
1. Klik tombol "Edit" pada tugas yang ingin diubah
2. Ubah teks di input field yang muncul
3. Klik "Simpan" atau tekan Enter untuk menyimpan
4. Klik "Batal" atau tekan Escape untuk membatalkan

### Menandai Tugas Selesai
- Klik checkbox di sebelah kiri tugas
- Tugas yang selesai akan ditampilkan dengan garis coret

### Filter Tugas
- Klik "Semua" untuk melihat semua tugas
- Klik "Belum Selesai" untuk melihat tugas aktif
- Klik "Selesai" untuk melihat tugas yang sudah selesai

### Menghapus Tugas
- Klik tombol "Hapus" pada tugas individual
- Atau klik "Hapus Selesai" untuk menghapus semua tugas yang sudah selesai

## Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail lengkap.

## Kontribusi

Kontribusi selalu diterima! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan lengkap tentang cara berkontribusi pada proyek ini.

Jika menemukan bug atau memiliki saran perbaikan:
1. Buat issue di repository
2. Fork dan buat pull request
3. Pastikan semua test lulus sebelum submit

## Changelog

Lihat [CHANGELOG.md](CHANGELOG.md) untuk catatan lengkap perubahan di setiap versi.
