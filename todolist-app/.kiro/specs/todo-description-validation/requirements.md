# Dokumen Requirements: Validasi Panjang Deskripsi Todo

## Pendahuluan

Fitur ini menambahkan validasi panjang karakter pada deskripsi (judul) todo di aplikasi Todolist. Saat ini, fungsi `isValidTitle` di `validators.js` hanya memastikan judul tidak kosong atau hanya berisi spasi (minimal 1 karakter setelah trim). Fitur ini memperketat aturan tersebut: deskripsi todo harus memiliki panjang **minimal 3 karakter** dan **maksimal 50 karakter** setelah di-trim. Validasi berlaku saat menambah todo baru maupun saat mengedit todo yang sudah ada, dengan pesan error yang informatif ditampilkan kepada pengguna.

## Glosarium

- **Aplikasi**: Aplikasi frontend todolist berbasis web yang berjalan di browser
- **Pengguna**: Orang yang menggunakan aplikasi melalui antarmuka web
- **Deskripsi**: Teks deskriptif sebuah todo (disebut juga judul/title), disimpan setelah proses trim whitespace
- **Validator**: Modul `validators.js` yang berisi fungsi-fungsi validasi input
- **Pesan_Validasi**: Teks error yang ditampilkan di UI ketika input tidak memenuhi aturan validasi
- **Form_Tambah**: Formulir input di bagian atas halaman untuk menambahkan todo baru
- **Form_Edit**: Kontrol inline editing yang muncul saat pengguna mengklik tombol edit pada sebuah todo

---

## Requirements

### Requirement 1: Aturan Panjang Deskripsi

**User Story:** Sebagai pengguna, saya ingin mendapat batasan panjang yang jelas untuk deskripsi todo, agar deskripsi yang saya buat cukup informatif dan tidak terlalu panjang.

#### Acceptance Criteria

1. THE Validator SHALL menolak deskripsi yang panjangnya (setelah trim) kurang dari 3 karakter
2. THE Validator SHALL menolak deskripsi yang panjangnya (setelah trim) lebih dari 50 karakter
3. THE Validator SHALL menerima deskripsi yang panjangnya (setelah trim) antara 3 hingga 50 karakter (inklusif)
4. WHEN menghitung panjang deskripsi, THE Validator SHALL menggunakan nilai setelah whitespace di awal dan akhir string dihilangkan (trim)
5. THE Validator SHALL mengembalikan informasi yang cukup bagi Aplikasi untuk membedakan antara kondisi "terlalu pendek", "terlalu panjang", dan "valid"

---

### Requirement 2: Validasi Saat Menambah Todo Baru

**User Story:** Sebagai pengguna, saya ingin mendapat umpan balik langsung ketika deskripsi yang saya masukkan terlalu pendek atau terlalu panjang, agar saya dapat memperbaikinya sebelum todo disimpan.

#### Acceptance Criteria

1. IF pengguna mengirimkan Form_Tambah dengan deskripsi yang kosong atau hanya berisi spasi, THEN THE Aplikasi SHALL menampilkan Pesan_Validasi "Judul tugas tidak boleh kosong." dan tidak menambahkan todo
2. IF pengguna mengirimkan Form_Tambah dengan deskripsi yang panjangnya (setelah trim) kurang dari 3 karakter, THEN THE Aplikasi SHALL menampilkan Pesan_Validasi "Judul tugas minimal 3 karakter." dan tidak menambahkan todo
3. IF pengguna mengirimkan Form_Tambah dengan deskripsi yang panjangnya (setelah trim) lebih dari 50 karakter, THEN THE Aplikasi SHALL menampilkan Pesan_Validasi "Judul tugas maksimal 50 karakter." dan tidak menambahkan todo
4. WHEN pengguna mengirimkan Form_Tambah dengan deskripsi yang valid (3–50 karakter setelah trim), THE Aplikasi SHALL menambahkan todo dan tidak menampilkan Pesan_Validasi

---

### Requirement 3: Validasi Saat Mengedit Todo

**User Story:** Sebagai pengguna, saya ingin mendapat umpan balik yang sama saat mengedit deskripsi todo, agar aturan panjang diterapkan secara konsisten di seluruh aplikasi.

#### Acceptance Criteria

1. IF pengguna menyimpan Form_Edit dengan deskripsi yang kosong atau hanya berisi spasi, THEN THE Aplikasi SHALL menampilkan Pesan_Validasi "Judul tugas tidak boleh kosong." dan tidak menyimpan perubahan
2. IF pengguna menyimpan Form_Edit dengan deskripsi yang panjangnya (setelah trim) kurang dari 3 karakter, THEN THE Aplikasi SHALL menampilkan Pesan_Validasi "Judul tugas minimal 3 karakter." dan tidak menyimpan perubahan
3. IF pengguna menyimpan Form_Edit dengan deskripsi yang panjangnya (setelah trim) lebih dari 50 karakter, THEN THE Aplikasi SHALL menampilkan Pesan_Validasi "Judul tugas maksimal 50 karakter." dan tidak menyimpan perubahan
4. WHEN pengguna menyimpan Form_Edit dengan deskripsi yang valid (3–50 karakter setelah trim), THE Aplikasi SHALL memperbarui deskripsi todo dan tidak menampilkan Pesan_Validasi

---

### Requirement 4: Konsistensi Pesan Error

**User Story:** Sebagai pengguna, saya ingin pesan error yang jelas dan konsisten, agar saya tahu persis apa yang perlu diperbaiki.

#### Acceptance Criteria

1. THE Aplikasi SHALL menampilkan pesan error yang berbeda untuk setiap kondisi pelanggaran: kosong ("Judul tugas tidak boleh kosong."), terlalu pendek ("Judul tugas minimal 3 karakter."), dan terlalu panjang ("Judul tugas maksimal 50 karakter.")
2. WHEN validasi berhasil (todo berhasil ditambah atau diedit), THE Aplikasi SHALL menghilangkan Pesan_Validasi yang sebelumnya ditampilkan
3. WHILE pengguna mengetik di Form_Tambah atau Form_Edit, THE Aplikasi SHALL menyembunyikan Pesan_Validasi yang sedang ditampilkan

---

### Requirement 5: Kompatibilitas Mundur

**User Story:** Sebagai pengembang, saya ingin perubahan validasi tidak merusak fungsionalitas yang sudah ada, agar fitur lain tetap berjalan dengan benar.

#### Acceptance Criteria

1. THE Validator SHALL tetap menolak deskripsi yang kosong atau hanya berisi spasi (kompatibel dengan perilaku `isValidTitle` sebelumnya)
2. WHEN aturan validasi panjang diperbarui, THE Aplikasi SHALL tetap menyimpan deskripsi ke LocalStorage hanya setelah validasi berhasil
3. FOR ALL deskripsi todo yang sudah tersimpan di LocalStorage sebelum fitur ini diterapkan, THE Aplikasi SHALL tetap dapat memuat dan menampilkannya tanpa error (tidak ada migrasi data yang diperlukan)
