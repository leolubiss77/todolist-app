# Rencana Implementasi: Todolist App

## Ikhtisar

Implementasi aplikasi Todolist frontend berbasis Vanilla JavaScript (ES6+) tanpa framework eksternal. Arsitektur mengikuti pola MVC sederhana berbasis modul dengan `localStorage` sebagai lapisan persistensi. Implementasi dilakukan secara bertahap — dimulai dari fondasi data dan logika bisnis, kemudian lapisan rendering, lalu integrasi penuh di `app.js`.

---

## Tugas

- [x] 1. Siapkan struktur proyek dan konfigurasi pengujian
  - Buat direktori `todolist-app/src/`
  - Buat file kosong: `index.html`, `style.css`, `src/app.js`, `src/store.js`, `src/storage.js`, `src/render.js`, `src/validators.js`
  - Inisialisasi `package.json` dan instal dependensi pengujian: `vitest` dan `fast-check`
  - Tambahkan skrip `"test": "vitest --run"` di `package.json`
  - Buat direktori `tests/` untuk semua file pengujian
  - _Requirements: 1.1, 2.1_

- [x] 2. Implementasi modul validasi (`validators.js`)
  - [x] 2.1 Implementasi fungsi `isValidTitle(title)`
    - Kembalikan `true` jika `title.trim().length >= 1`, selain itu `false`
    - _Requirements: 1.4, 4.4_

  - [x] 2.2 Tulis unit test untuk `validators.js`
    - Uji string valid, string kosong, string hanya spasi, string dengan spasi di tepi
    - _Requirements: 1.4, 4.4_

  - [x] 2.3 Tulis property test untuk Properti 2: Judul spasi ditolak
    - **Properti 2: Judul yang hanya berisi whitespace ditolak**
    - **Memvalidasi: Requirements 1.4, 4.4**
    - Gunakan `fc.string({ unit: 'grapheme' })` yang di-filter hanya karakter whitespace
    - Tag: `// Feature: todolist-app, Property 2: whitespace-only titles rejected`

- [x] 3. Implementasi modul storage (`storage.js`)
  - [x] 3.1 Implementasi fungsi `save(todos)` dan `load()`
    - `save`: simpan ke `localStorage` dengan key `'todolist-app-todos'` menggunakan `JSON.stringify`
    - `load`: baca dan parse JSON; kembalikan `[]` jika key tidak ada, localStorage tidak tersedia, atau JSON korup
    - Tangkap semua exception secara graceful
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 3.2 Tulis unit test untuk `storage.js`
    - Uji save & load normal, localStorage tidak tersedia (mock), data JSON korup
    - _Requirements: 8.3, 8.4_

  - [x] 3.3 Tulis property test untuk Properti 5: Persistensi data round-trip
    - **Properti 5: Persistensi data round-trip**
    - **Memvalidasi: Requirements 8.2, 8.4, 1.5**
    - Gunakan `fc.array(todoArb)` — simpan lalu muat kembali harus menghasilkan array yang ekuivalen
    - Tag: `// Feature: todolist-app, Property 5: storage round-trip`

- [x] 4. Checkpoint — Pastikan semua test modul dasar lulus
  - Jalankan `npm test` dan pastikan semua test untuk `validators.js` dan `storage.js` lulus
  - Tanyakan kepada pengguna jika ada pertanyaan sebelum melanjutkan

- [x] 5. Implementasi modul state (`store.js`)
  - [x] 5.1 Definisikan state global dan implementasi `addTodo(title)`
    - State: `{ todos: [], filter: 'all' }`
    - `addTodo`: buat objek Todo baru dengan `id` dari `crypto.randomUUID()` (fallback ke `Date.now() + Math.random()`), `completed: false`, `createdAt: Date.now()`; tambahkan ke `state.todos`
    - _Requirements: 1.2, 1.3_

  - [x] 5.2 Tulis property test untuk Properti 1: Penambahan tugas memperbesar daftar
    - **Properti 1: Penambahan tugas memperbesar daftar**
    - **Memvalidasi: Requirements 1.2**
    - Gunakan `fc.array(todoArb)` dan `fc.string()` yang valid
    - Tag: `// Feature: todolist-app, Property 1: add increases list length`

  - [x] 5.3 Implementasi `toggleTodo(id)` dan `deleteTodo(id)`
    - `toggleTodo`: balik nilai `completed` pada tugas dengan `id` yang cocok
    - `deleteTodo`: hapus tugas dengan `id` yang cocok dari `state.todos`
    - _Requirements: 3.2, 3.3, 5.2_

  - [x] 5.4 Tulis property test untuk Properti 3: Toggle adalah operasi round-trip
    - **Properti 3: Toggle status adalah operasi round-trip**
    - **Memvalidasi: Requirements 3.2, 3.3**
    - Toggle dua kali berturut-turut harus mengembalikan status semula
    - Tag: `// Feature: todolist-app, Property 3: toggle round-trip`

  - [x] 5.5 Tulis property test untuk Properti 10: Penghapusan menghilangkan tugas dari daftar
    - **Properti 10: Penghapusan tugas menghilangkan tugas dari daftar**
    - **Memvalidasi: Requirements 5.2**
    - Setelah hapus, tugas tidak boleh ada di daftar; tugas lain tetap ada
    - Tag: `// Feature: todolist-app, Property 10: delete removes only target`

  - [x] 5.6 Implementasi `editTodo(id, newTitle)` dan `clearCompleted()`
    - `editTodo`: perbarui `title` tugas dengan `id` yang cocok (hanya jika `isValidTitle` lolos)
    - `clearCompleted`: hapus semua tugas dengan `completed === true`
    - _Requirements: 4.3, 7.2_

  - [x] 5.7 Tulis property test untuk Properti 6: clearCompleted menghilangkan semua tugas selesai
    - **Properti 6: clearCompleted menghilangkan semua tugas selesai**
    - **Memvalidasi: Requirements 7.2**
    - Setelah `clearCompleted`, tidak boleh ada tugas dengan `completed = true`; tugas aktif tetap ada
    - Tag: `// Feature: todolist-app, Property 6: clearCompleted removes all completed`

  - [x] 5.8 Implementasi `setFilter(filter)` dan `getFilteredTodos()`
    - `setFilter`: perbarui `state.filter`
    - `getFilteredTodos`: kembalikan subset `state.todos` sesuai filter aktif
    - _Requirements: 6.2, 6.3, 6.4_

  - [x] 5.9 Tulis property test untuk Properti 4: Filter mengembalikan subset yang konsisten
    - **Properti 4: Filter mengembalikan subset yang konsisten**
    - **Memvalidasi: Requirements 6.2, 6.3, 6.4**
    - Gunakan `fc.array(todoArb)` dan `fc.constantFrom('all', 'active', 'completed')`
    - Tag: `// Feature: todolist-app, Property 4: filter returns consistent subset`

  - [x] 5.10 Tulis unit test untuk `store.js`
    - Uji semua operasi: add, toggle, edit, delete, clearCompleted, setFilter, getFilteredTodos
    - _Requirements: 1.2, 3.2, 4.3, 5.2, 6.2, 7.2_

- [x] 6. Checkpoint — Pastikan semua test store lulus
  - Jalankan `npm test` dan pastikan semua test untuk `store.js` lulus
  - Tanyakan kepada pengguna jika ada pertanyaan sebelum melanjutkan

- [x] 7. Buat markup HTML (`index.html`)
  - Buat struktur HTML lengkap: form input tambah tugas, daftar tugas (`<ul>`), tombol filter (Semua / Belum Selesai / Selesai), tombol "Hapus Selesai", dan area pesan validasi
  - Hubungkan `style.css` dan `src/app.js` (sebagai modul ES6)
  - _Requirements: 1.1, 2.2, 3.1, 4.1, 5.1, 6.1, 7.1_

- [x] 8. Implementasi modul rendering (`render.js`)
  - [x] 8.1 Implementasi `renderTodos(todos)`
    - Render ulang `<ul>` dengan item tugas diurutkan descending berdasarkan `createdAt`
    - Setiap item menampilkan: checkbox status, judul (dicoret jika selesai), waktu pembuatan yang dapat dibaca, tombol edit, tombol hapus
    - Tampilkan pesan kosong informatif jika `todos` kosong
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 4.1, 5.1_

  - [x] 8.2 Tulis property test untuk Properti 8: Daftar dirender dalam urutan terbaru ke terlama
    - **Properti 8: Daftar tugas dirender dalam urutan terbaru ke terlama**
    - **Memvalidasi: Requirements 2.1**
    - Gunakan `fc.array(todoArb)` dengan nilai `createdAt` berbeda
    - Tag: `// Feature: todolist-app, Property 8: render order newest-first`

  - [x] 8.3 Tulis property test untuk Properti 9: Setiap tugas dirender dengan semua field yang diperlukan
    - **Properti 9: Setiap tugas dirender dengan semua field yang diperlukan**
    - **Memvalidasi: Requirements 2.3**
    - Setiap item DOM harus mengandung judul, indikator status, dan waktu pembuatan
    - Tag: `// Feature: todolist-app, Property 9: render includes all required fields`

  - [x] 8.4 Implementasi `renderFilters(activeFilter)` dan `renderClearButton(todos)`
    - `renderFilters`: perbarui kelas aktif pada tombol filter sesuai `activeFilter`
    - `renderClearButton`: tampilkan tombol "Hapus Selesai" jika ada tugas selesai, sembunyikan jika tidak ada
    - _Requirements: 6.5, 7.1, 7.4_

  - [x] 8.5 Tulis property test untuk Properti 7: Visibilitas tombol "Hapus Selesai" konsisten
    - **Properti 7: Visibilitas tombol "Hapus Selesai" konsisten dengan state**
    - **Memvalidasi: Requirements 7.1, 7.4**
    - Tombol tampil jika dan hanya jika ada minimal satu tugas `completed = true`
    - Tag: `// Feature: todolist-app, Property 7: clear-button visibility consistent`

  - [x] 8.6 Tulis unit test untuk `render.js`
    - Uji render daftar kosong, render tugas selesai (teks dicoret), render filter aktif, visibilitas tombol "Hapus Selesai"
    - _Requirements: 2.2, 3.2, 6.5, 7.1_

  - [x] 8.7 Implementasi `showValidationMessage(element, message)`
    - Tampilkan pesan validasi pada elemen yang ditentukan; sembunyikan setelah beberapa detik atau saat input berubah
    - _Requirements: 1.4, 4.4_

- [x] 9. Implementasi controller dan event handler (`app.js`)
  - [x] 9.1 Inisialisasi aplikasi saat halaman dimuat
    - Muat data dari `storage.load()`, isi `state.todos`, panggil `renderTodos`, `renderFilters`, dan `renderClearButton`
    - _Requirements: 2.4, 8.2_

  - [x] 9.2 Implementasi event handler tambah tugas
    - Tangkap submit form / klik tombol tambah / tekan Enter pada input
    - Validasi dengan `isValidTitle`; jika gagal tampilkan pesan validasi
    - Jika valid: panggil `addTodo`, `storage.save`, `renderTodos`, `renderClearButton`, kosongkan input
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

  - [x] 9.3 Implementasi event handler toggle, hapus, dan filter
    - Toggle: panggil `toggleTodo`, `storage.save`, `renderTodos`, `renderClearButton`
    - Hapus: panggil `deleteTodo`, `storage.save`, `renderTodos`, `renderClearButton`
    - Filter: panggil `setFilter`, `renderTodos`, `renderFilters`
    - _Requirements: 3.2, 3.3, 3.4, 5.2, 5.3, 6.2, 6.3, 6.4, 6.5_

  - [x] 9.4 Implementasi event handler edit tugas (inline editing)
    - Klik tombol edit: ubah tampilan judul menjadi input yang dapat diedit
    - Simpan (tombol simpan / Enter): validasi, panggil `editTodo`, `storage.save`, `renderTodos`
    - Batal (tombol batal / Escape): kembalikan tampilan judul semula tanpa menyimpan
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 9.5 Implementasi event handler "Hapus Selesai"
    - Panggil `clearCompleted`, `storage.save`, `renderTodos`, `renderClearButton`
    - _Requirements: 7.2, 7.3_

- [x] 10. Implementasi styling (`style.css`)
-[x] 9.6 create base style and layout
  - Buat tampilan yang bersih dan responsif untuk semua komponen UI
  - Terapkan gaya visual untuk tugas selesai (teks dicoret, warna berbeda)
  - Terapkan indikator visual untuk filter aktif
  - Pastikan tombol "Hapus Selesai" tersembunyi secara visual saat tidak relevan
  - _Requirements: 2.3, 3.2, 6.5, 7.1, 7.4_

- [x] 11. Checkpoint akhir — Integrasi dan verifikasi menyeluruh
  - Jalankan `npm test` dan pastikan semua test (unit + property-based) lulus
  - Verifikasi semua alur data: tambah → simpan → muat ulang → tampil
  - Tanyakan kepada pengguna jika ada pertanyaan sebelum dinyatakan selesai

---

## Catatan

- Tugas bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap tugas mereferensikan requirements spesifik untuk keterlacakan
- Checkpoint memastikan validasi bertahap di setiap fase
- Property-based test memvalidasi properti universal menggunakan `fast-check` (minimum 100 iterasi per properti)
- Unit test memvalidasi skenario spesifik dan edge case
- Semua error ditangani secara graceful — aplikasi tidak boleh crash
