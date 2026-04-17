# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan dalam file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added
- Fitur tambah tugas baru dengan validasi input
- Fitur edit tugas secara inline
- Fitur toggle status tugas (selesai/belum selesai)
- Fitur hapus tugas individual
- Fitur hapus semua tugas yang sudah selesai
- Filter tugas berdasarkan status (Semua, Belum Selesai, Selesai)
- Penyimpanan otomatis ke localStorage
- Validasi input dengan aturan:
  - Tidak boleh kosong
  - Minimal 3 karakter
  - Maksimal 50 karakter
- Tampilan waktu pembuatan tugas
- Urutan tugas dari terbaru ke terlama
- Mode testing manual terintegrasi
- Unit testing dengan Vitest
- Property-based testing dengan fast-check
- Dokumentasi lengkap (README, CONTRIBUTING)
- Responsive design untuk mobile dan desktop

### Technical
- Arsitektur modular dengan separation of concerns
- ES6+ modules
- localStorage API untuk persistensi data
- crypto.randomUUID() untuk ID generation
- Accessibility features (ARIA labels, keyboard navigation)
- Comprehensive test coverage

## [Unreleased]

### Planned
- Dark mode toggle
- Drag and drop untuk reorder tugas
- Kategori atau tag untuk tugas
- Due date untuk tugas
- Priority levels
- Search/filter tugas
- Export/import data
- Multi-language support
- Keyboard shortcuts
- Undo/redo functionality
