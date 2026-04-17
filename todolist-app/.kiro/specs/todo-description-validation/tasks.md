# Implementation Plan: Validasi Panjang Deskripsi Todo

## Overview

Implementasi memperketat validasi input deskripsi todo dengan menambahkan batas minimal 3 dan maksimal 50 karakter (setelah trim). Perubahan terlokalisasi pada `validators.js`, `app.js`, dan `store.js`, dengan test baru di `tests/validators.test.js` dan `tests/store.test.js`.

## Tasks

- [x] 1. Tambahkan fungsi `validateTitle` di `validators.js`
  - Tambahkan fungsi `validateTitle(title)` yang mengembalikan objek `{ valid: boolean, error: string|null }`
  - Perbarui fungsi `isValidTitle` menjadi wrapper yang memanggil `validateTitle(title).valid` agar backward compatible
  - Tiga kondisi error: kosong/whitespace-only → `'Judul tugas tidak boleh kosong.'`, trimmed < 3 → `'Judul tugas minimal 3 karakter.'`, trimmed > 50 → `'Judul tugas maksimal 50 karakter.'`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1_

  - [ ]* 1.1 Tulis unit test untuk `validateTitle` di `tests/validators.test.js`
    - Test: string kosong → `{ valid: false, error: 'Judul tugas tidak boleh kosong.' }`
    - Test: whitespace-only → `{ valid: false, error: 'Judul tugas tidak boleh kosong.' }`
    - Test: 1 karakter → `{ valid: false, error: 'Judul tugas minimal 3 karakter.' }`
    - Test: 2 karakter → `{ valid: false, error: 'Judul tugas minimal 3 karakter.' }`
    - Test: 3 karakter (batas bawah) → `{ valid: true, error: null }`
    - Test: 50 karakter (batas atas) → `{ valid: true, error: null }`
    - Test: 51 karakter → `{ valid: false, error: 'Judul tugas maksimal 50 karakter.' }`
    - Test: `'  ab  '` (trimmed = 2) → `{ valid: false, error: 'Judul tugas minimal 3 karakter.' }`
    - Test: `'  abc  '` (trimmed = 3) → `{ valid: true, error: null }`
    - Test backward compat: `isValidTitle('abc')` → `true`, `isValidTitle('ab')` → `false`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1_

  - [ ]* 1.2 Tulis property test untuk batas panjang validator di `tests/validators.test.js`
    - **Property 1: Batas panjang validator konsisten**
    - Generate string dengan trimmed length < 3 → harus `valid: false`
    - Generate string dengan trimmed length > 50 → harus `valid: false`
    - Generate string dengan trimmed length 3–50 → harus `valid: true`
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

  - [ ]* 1.3 Tulis property test untuk whitespace-only di `tests/validators.test.js`
    - **Property 2: Whitespace-only selalu ditolak dengan pesan kosong**
    - Generate whitespace-only string → `valid: false` dan `error === 'Judul tugas tidak boleh kosong.'`
    - **Validates: Requirements 1.1, 2.1, 3.1, 5.1**

- [x] 2. Perbarui `app.js` untuk menggunakan `validateTitle`
  - Ganti import `isValidTitle` dengan `validateTitle` dari `validators.js`
  - Perbarui `handleAddTodo`: panggil `validateTitle(title)`, gunakan `result.error` sebagai pesan ke `showValidationMessage`
  - Perbarui fungsi `saveEdit` di dalam `startEditing`: panggil `validateTitle(newTitle)`, gunakan `result.error` sebagai pesan
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2_

- [x] 3. Perbarui `store.js` untuk menggunakan `validateTitle`
  - Ganti import `isValidTitle` dengan `validateTitle` dari `validators.js`
  - Perbarui fungsi `editTodo`: gunakan `!validateTitle(newTitle).valid` sebagai kondisi guard
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.2_

- [x] 4. Checkpoint — Pastikan semua test yang ada tetap lulus
  - Jalankan `npm test` di direktori `specs/todolist-app`
  - Pastikan semua test lama di `validators.test.js` dan `store.test.js` tetap hijau
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Tambahkan integration test di `tests/store.test.js`
  - [ ]* 5.1 Tulis unit test baru untuk `editTodo` dengan aturan validasi baru
    - Test: `editTodo` dengan judul valid (3–50 karakter) → `todo.title` diperbarui
    - Test: `editTodo` dengan judul terlalu pendek (< 3 karakter) → `todo.title` tidak berubah
    - Test: `editTodo` dengan judul terlalu panjang (> 50 karakter) → `todo.title` tidak berubah
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 5.2 Tulis property test untuk input invalid tidak mengubah todo list di `tests/store.test.js`
    - **Property 3: Input invalid tidak mengubah todo list**
    - Generate todo list + invalid input (kosong, terlalu pendek, terlalu panjang) → `addTodo`/`editTodo` tidak mengubah isi list
    - **Validates: Requirements 2.1, 2.2, 2.3, 3.1, 3.2, 3.3**

  - [ ]* 5.3 Tulis property test untuk input valid menghasilkan todo tersimpan di `tests/store.test.js`
    - **Property 4: Input valid menghasilkan todo tersimpan dengan deskripsi yang benar**
    - Generate string dengan trimmed length 3–50 → todo ditambahkan dengan `title` sama dengan nilai setelah trim
    - **Validates: Requirements 2.4, 3.4, 5.2**

- [x] 6. Final checkpoint — Pastikan semua test lulus
  - Jalankan `npm test` di direktori `specs/todolist-app`
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk keterlacakan
- Property 5 (backward compatibility load data lama) tidak memerlukan test otomatis karena validasi hanya berlaku pada operasi tulis, bukan baca — perilaku ini sudah tercakup oleh desain `store.js` dan `app.js` yang tidak memanggil validator saat `load()`
- Urutan task dirancang agar perubahan di `validators.js` selesai lebih dulu sebelum `app.js` dan `store.js` diperbarui
