# Dokumen Requirements

## Pendahuluan

Aplikasi **Todolist** adalah aplikasi frontend sederhana yang memungkinkan pengguna untuk mengelola daftar tugas (todo) sehari-hari. Pengguna dapat menambahkan tugas baru, menandai tugas sebagai selesai, mengedit tugas yang sudah ada, dan menghapus tugas yang tidak diperlukan. Data tugas disimpan secara lokal di browser menggunakan localStorage sehingga tetap tersedia setelah halaman di-refresh.

## Glosarium

- **Aplikasi**: Aplikasi frontend todolist berbasis web yang berjalan di browser
- **Pengguna**: Orang yang menggunakan aplikasi melalui antarmuka web
- **Tugas**: Item pekerjaan yang dibuat oleh pengguna, memiliki judul, status, dan waktu pembuatan
- **Daftar_Tugas**: Kumpulan semua tugas yang dimiliki pengguna
- **Filter**: Mekanisme untuk menampilkan subset tugas berdasarkan status tertentu
- **LocalStorage**: Mekanisme penyimpanan data di browser yang persisten antar sesi

---

## Requirements

### Requirement 1: Menambahkan Tugas Baru

**User Story:** Sebagai pengguna, saya ingin menambahkan tugas baru ke daftar, agar saya dapat mencatat pekerjaan yang perlu dilakukan.

#### Acceptance Criteria

1. THE Aplikasi SHALL menampilkan kolom input teks dan tombol tambah untuk membuat tugas baru
2. WHEN pengguna memasukkan judul tugas dan menekan tombol tambah atau menekan tombol Enter, THE Aplikasi SHALL menambahkan tugas baru ke Daftar_Tugas dengan status "belum selesai"
3. WHEN tugas baru berhasil ditambahkan, THE Aplikasi SHALL mengosongkan kolom input teks
4. IF pengguna menekan tombol tambah dengan kolom input kosong atau hanya berisi spasi, THEN THE Aplikasi SHALL menampilkan pesan validasi dan tidak menambahkan tugas
5. WHEN tugas baru ditambahkan, THE Aplikasi SHALL menyimpan tugas ke LocalStorage

---

### Requirement 2: Menampilkan Daftar Tugas

**User Story:** Sebagai pengguna, saya ingin melihat semua tugas saya dalam satu tampilan, agar saya dapat memantau pekerjaan yang ada.

#### Acceptance Criteria

1. THE Aplikasi SHALL menampilkan semua tugas dalam Daftar_Tugas secara berurutan dari yang terbaru ke yang terlama
2. WHEN Daftar_Tugas kosong, THE Aplikasi SHALL menampilkan pesan kosong yang informatif kepada pengguna
3. THE Aplikasi SHALL menampilkan judul, status (selesai/belum selesai), dan waktu pembuatan untuk setiap tugas
4. WHEN aplikasi pertama kali dimuat, THE Aplikasi SHALL memuat Daftar_Tugas dari LocalStorage

---

### Requirement 3: Menandai Tugas Selesai

**User Story:** Sebagai pengguna, saya ingin menandai tugas sebagai selesai atau belum selesai, agar saya dapat melacak progres pekerjaan saya.

#### Acceptance Criteria

1. THE Aplikasi SHALL menampilkan checkbox atau tombol toggle pada setiap tugas
2. WHEN pengguna mengklik checkbox tugas yang belum selesai, THE Aplikasi SHALL mengubah status tugas menjadi "selesai" dan menampilkan indikator visual (misalnya teks dicoret)
3. WHEN pengguna mengklik checkbox tugas yang sudah selesai, THE Aplikasi SHALL mengubah status tugas kembali menjadi "belum selesai"
4. WHEN status tugas berubah, THE Aplikasi SHALL menyimpan perubahan ke LocalStorage

---

### Requirement 4: Mengedit Tugas

**User Story:** Sebagai pengguna, saya ingin mengedit judul tugas yang sudah ada, agar saya dapat memperbaiki atau memperbarui informasi tugas.

#### Acceptance Criteria

1. THE Aplikasi SHALL menampilkan tombol edit pada setiap tugas
2. WHEN pengguna mengklik tombol edit, THE Aplikasi SHALL mengubah tampilan judul tugas menjadi kolom input yang dapat diedit dengan nilai judul saat ini
3. WHEN pengguna menyimpan perubahan dengan menekan tombol simpan atau menekan Enter, THE Aplikasi SHALL memperbarui judul tugas dengan nilai baru
4. IF pengguna menyimpan perubahan dengan kolom input kosong atau hanya berisi spasi, THEN THE Aplikasi SHALL menampilkan pesan validasi dan tidak menyimpan perubahan
5. WHEN pengguna menekan tombol batal atau menekan Escape, THE Aplikasi SHALL membatalkan pengeditan dan mengembalikan tampilan judul semula
6. WHEN judul tugas berhasil diperbarui, THE Aplikasi SHALL menyimpan perubahan ke LocalStorage

---

### Requirement 5: Menghapus Tugas

**User Story:** Sebagai pengguna, saya ingin menghapus tugas yang tidak diperlukan, agar daftar tugas saya tetap relevan.

#### Acceptance Criteria

1. THE Aplikasi SHALL menampilkan tombol hapus pada setiap tugas
2. WHEN pengguna mengklik tombol hapus, THE Aplikasi SHALL menghapus tugas dari Daftar_Tugas dan memperbarui tampilan
3. WHEN tugas berhasil dihapus, THE Aplikasi SHALL menyimpan perubahan ke LocalStorage

---

### Requirement 6: Memfilter Tugas

**User Story:** Sebagai pengguna, saya ingin memfilter daftar tugas berdasarkan statusnya, agar saya dapat fokus pada tugas yang relevan.

#### Acceptance Criteria

1. THE Aplikasi SHALL menampilkan tiga opsi Filter: "Semua", "Belum Selesai", dan "Selesai"
2. WHEN pengguna memilih Filter "Semua", THE Aplikasi SHALL menampilkan seluruh tugas dalam Daftar_Tugas
3. WHEN pengguna memilih Filter "Belum Selesai", THE Aplikasi SHALL menampilkan hanya tugas dengan status belum selesai
4. WHEN pengguna memilih Filter "Selesai", THE Aplikasi SHALL menampilkan hanya tugas dengan status selesai
5. THE Aplikasi SHALL menampilkan indikator visual pada opsi Filter yang sedang aktif

---

### Requirement 7: Menghapus Semua Tugas Selesai

**User Story:** Sebagai pengguna, saya ingin menghapus semua tugas yang sudah selesai sekaligus, agar saya dapat membersihkan daftar dengan cepat.

#### Acceptance Criteria

1. THE Aplikasi SHALL menampilkan tombol "Hapus Selesai" ketika terdapat minimal satu tugas dengan status selesai
2. WHEN pengguna mengklik tombol "Hapus Selesai", THE Aplikasi SHALL menghapus semua tugas dengan status selesai dari Daftar_Tugas
3. WHEN semua tugas selesai berhasil dihapus, THE Aplikasi SHALL menyimpan perubahan ke LocalStorage
4. WHILE tidak ada tugas dengan status selesai, THE Aplikasi SHALL menyembunyikan tombol "Hapus Selesai"

---

### Requirement 8: Persistensi Data

**User Story:** Sebagai pengguna, saya ingin data tugas saya tersimpan secara otomatis, agar saya tidak kehilangan data ketika menutup atau me-refresh browser.

#### Acceptance Criteria

1. WHEN pengguna melakukan perubahan apapun pada Daftar_Tugas (tambah, edit, hapus, ubah status), THE Aplikasi SHALL menyimpan seluruh Daftar_Tugas ke LocalStorage secara otomatis
2. WHEN aplikasi dimuat ulang, THE Aplikasi SHALL memuat dan menampilkan Daftar_Tugas dari LocalStorage
3. IF LocalStorage tidak tersedia atau terjadi kesalahan saat membaca data, THEN THE Aplikasi SHALL menampilkan Daftar_Tugas kosong dan melanjutkan operasi normal
4. FOR ALL operasi penyimpanan dan pembacaan data, THE Aplikasi SHALL menggunakan format JSON yang valid (properti round-trip: parse(stringify(data)) menghasilkan data yang ekuivalen)
