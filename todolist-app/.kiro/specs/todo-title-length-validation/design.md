# Dokumen Desain Teknis: Validasi Panjang Judul Todo

## Ikhtisar

Fitur ini memperketat validasi judul todo di aplikasi Todolist. Saat ini `isValidTitle()` di `validators.js` hanya menolak judul kosong/hanya spasi. Fitur ini menambahkan batas panjang: judul harus memiliki **minimal 3 karakter** dan **maksimal 50 karakter** setelah di-trim.

Perubahan utama:
- `validators.js` — fungsi baru `validateTitle()` mengembalikan objek `{ valid, reason }` alih-alih boolean
- `store.js` — `editTodo()` menggunakan `validateTitle()` baru
- `app.js` — `handleAddTodo()` dan `saveEdit()` membaca `reason` untuk menampilkan pesan error yang tepat

Fungsi `isValidTitle()` lama **dipertahankan** untuk kompatibilitas mundur.

---

## Arsitektur

Tidak ada perubahan arsitektur besar. Fitur ini adalah perluasan lapisan validasi yang sudah ada.

```
┌─────────────────────────────────────────────────┐
│                   UI Layer (app.js)              │
│  handleAddTodo(), saveEdit()                     │
│  Membaca result.reason → pilih pesan error       │
└────────────────────┬────────────────────────────┘
                     │ memanggil validateTitle()
┌────────────────────▼────────────────────────────┐
│              validators.js                       │
│  validateTitle(title) → { valid, reason }        │
│  isValidTitle(title) → boolean  (tetap ada)      │
└─────────────────────────────────────────────────┘
```

**Alur validasi baru:**
1. User submit form → `app.js` memanggil `validateTitle(input.value)`
2. Jika `valid === false` → tampilkan pesan sesuai `reason`
3. Jika `valid === true` → lanjutkan ke `addTodo()` / `editTodo()`

---

## Komponen dan Antarmuka

### `validators.js` — Fungsi Baru

```js
/**
 * Memvalidasi judul todo dengan aturan panjang.
 * @param {string} title
 * @returns {{ valid: boolean, reason: 'empty' | 'too_short' | 'too_long' | null }}
 */
export function validateTitle(title) {
  const trimmed = title.trim();
  if (trimmed.length === 0) return { valid: false, reason: 'empty' };
  if (trimmed.length < 3)   return { valid: false, reason: 'too_short' };
  if (trimmed.length > 50)  return { valid: false, reason: 'too_long' };
  return { valid: true, reason: null };
}

// isValidTitle() dipertahankan — tidak diubah
export function isValidTitle(title) {
  return title.trim().length >= 1;
}
```

### `app.js` — Pemetaan Reason ke Pesan

```js
const ERROR_MESSAGES = {
  empty:    'Judul tugas tidak boleh kosong.',
  too_short: 'Judul tugas minimal 3 karakter.',
  too_long:  'Judul tugas maksimal 50 karakter.',
};

function handleAddTodo() {
  const result = validateTitle(input.value);
  if (!result.valid) {
    showValidationMessage(validationMsg, ERROR_MESSAGES[result.reason]);
    return;
  }
  // ... lanjutkan addTodo
}
```

### `store.js` — `editTodo()` Diperbarui

```js
import { validateTitle } from './validators.js';

export function editTodo(id, newTitle) {
  const result = validateTitle(newTitle);
  if (!result.valid) return;
  const todo = state.todos.find(t => t.id === id);
  if (todo) todo.title = newTitle.trim();
}
```

---

## Model Data

Tidak ada perubahan pada model data `Todo`. Struktur tetap sama:

```js
{
  id: string,
  title: string,       // 3–50 karakter setelah trim (untuk todo baru)
  completed: boolean,
  createdAt: number
}
```

### Aturan Validasi yang Diperbarui

| Kondisi | `reason` | Pesan Error |
|---|---|---|
| `trimmed.length === 0` | `'empty'` | "Judul tugas tidak boleh kosong." |
| `trimmed.length < 3` | `'too_short'` | "Judul tugas minimal 3 karakter." |
| `trimmed.length > 50` | `'too_long'` | "Judul tugas maksimal 50 karakter." |
| `3 ≤ trimmed.length ≤ 50` | `null` | *(tidak ada pesan)* |

### Kompatibilitas Mundur

Todo yang sudah tersimpan di `localStorage` dengan judul 1–2 karakter **tidak dimigrasi** — aplikasi tetap dapat memuat dan menampilkannya. Validasi baru hanya berlaku saat menambah atau mengedit todo.

---

## Properti Kebenaran (Correctness Properties)

*Sebuah properti adalah karakteristik atau perilaku yang harus berlaku di semua eksekusi sistem yang valid — pada dasarnya, pernyataan formal tentang apa yang seharusnya dilakukan sistem. Properti berfungsi sebagai jembatan antara spesifikasi yang dapat dibaca manusia dan jaminan kebenaran yang dapat diverifikasi secara otomatis.*

### Properti 1: Validator mengembalikan reason yang konsisten dengan panjang input

*Untuk setiap* string input, `validateTitle()` harus mengembalikan `reason` yang konsisten dengan panjang trimmed-nya: `'empty'` jika panjang 0, `'too_short'` jika panjang 1–2, `'too_long'` jika panjang > 50, dan `null` (valid) jika panjang 3–50.

**Memvalidasi: Requirements 1.1, 1.2, 1.3, 4.3**

---

### Properti 2: Trim-invariance — whitespace di tepi tidak mempengaruhi keputusan validasi

*Untuk setiap* string yang trimmed-nya memiliki panjang 3–50 karakter, menambahkan whitespace (spasi, tab, newline) di awal dan/atau akhir string tidak boleh mengubah hasil validasi — `validateTitle()` harus tetap mengembalikan `valid: true`.

**Memvalidasi: Requirements 1.4**

---

### Properti 3: Input invalid tidak mengubah daftar todo

*Untuk setiap* daftar todo dan string input yang tidak valid (kosong, terlalu pendek, atau terlalu panjang), memanggil `editTodo()` dengan input tersebut tidak boleh mengubah judul todo manapun di daftar.

**Memvalidasi: Requirements 3.1, 3.2, 3.4, 5.2**

---

### Properti 4: Input valid mengubah judul todo dengan benar

*Untuk setiap* todo yang ada dan string input yang valid (3–50 karakter setelah trim), memanggil `editTodo()` harus memperbarui judul todo tersebut menjadi nilai trimmed dari input, dan semua todo lain tidak berubah.

**Memvalidasi: Requirements 3.3**

---

### Properti 5: Backward compatibility — todo lama tetap dapat dimuat

*Untuk setiap* array todo yang tersimpan di localStorage (termasuk yang judulnya memiliki panjang di luar batas 3–50 karakter), operasi `load()` harus berhasil mengembalikan array tersebut tanpa error atau modifikasi.

**Memvalidasi: Requirements 5.3**

---

## Penanganan Error

| Skenario | Penanganan |
|---|---|
| Judul kosong / hanya spasi | `reason: 'empty'` → pesan "Judul tugas tidak boleh kosong." |
| Judul 1–2 karakter setelah trim | `reason: 'too_short'` → pesan "Judul tugas minimal 3 karakter." |
| Judul > 50 karakter setelah trim | `reason: 'too_long'` → pesan "Judul tugas maksimal 50 karakter." |
| Validasi berhasil | Hapus pesan validasi yang sebelumnya ditampilkan |
| Todo lama dengan judul < 3 char di localStorage | Dimuat dan ditampilkan tanpa error; validasi baru hanya berlaku saat add/edit |

---

## Strategi Pengujian

### Pendekatan Dual Testing

1. **Unit test berbasis contoh** — skenario spesifik, boundary values, dan pesan error
2. **Property-based test** — memverifikasi properti universal di atas input yang di-generate secara acak

**Library:**
- **[fast-check](https://github.com/dubzzz/fast-check)** — sudah terpasang di proyek
- **[Vitest](https://vitest.dev/)** — test runner yang sudah digunakan

### Cakupan Unit Test

| File | Skenario |
|---|---|
| `validators.test.js` | `validateTitle('')` → empty, `validateTitle('ab')` → too_short, `validateTitle('abc')` → valid, `validateTitle('a'.repeat(50))` → valid, `validateTitle('a'.repeat(51))` → too_long, `validateTitle('  ab  ')` → too_short (trim), `validateTitle('  abc  ')` → valid (trim) |
| `store.test.js` | `editTodo` dengan judul terlalu pendek tidak mengubah todo, `editTodo` dengan judul terlalu panjang tidak mengubah todo, `editTodo` dengan judul valid memperbarui todo |
| `app.js` (manual/integration) | Pesan error yang benar ditampilkan untuk setiap kondisi; pesan hilang setelah validasi berhasil |

### Cakupan Property-Based Test

Setiap properti di atas diimplementasikan sebagai satu property-based test dengan minimum **100 iterasi**:

| Property | Arbitrari fast-check |
|---|---|
| P1: Reason konsisten dengan panjang | `fc.string()` dikategorikan berdasarkan trimmed length |
| P2: Trim-invariance | `fc.string({ minLength: 3, maxLength: 50 })` + padding whitespace |
| P3: Input invalid tidak mengubah daftar | `fc.array(todoArb)` + string invalid |
| P4: Input valid mengubah judul | `fc.array(todoArb, { minLength: 1 })` + string valid |
| P5: Backward compatibility load | `fc.array(todoArb)` dengan judul berbagai panjang |

**Format tag komentar:**
```js
// Feature: todo-title-length-validation, Property {N}: {deskripsi singkat}
```
