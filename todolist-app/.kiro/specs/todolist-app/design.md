# Dokumen Desain Teknis: Todolist App

## Ikhtisar

Aplikasi Todolist adalah aplikasi frontend berbasis web yang berjalan sepenuhnya di browser tanpa backend. Pengguna dapat mengelola daftar tugas harian — menambah, mengedit, menghapus, menandai selesai, dan memfilter tugas. Semua data disimpan di `localStorage` browser sehingga persisten antar sesi.

**Teknologi yang digunakan:**
- HTML5, CSS3, JavaScript (Vanilla ES6+)
- Tidak ada framework eksternal — murni vanilla JS untuk kesederhanaan
- `localStorage` sebagai lapisan persistensi data

---

## Desain Visual: Neobrutalism

Antarmuka menggunakan gaya **Neobrutalism** — estetika desain yang terinspirasi dari brutalisme arsitektur, diterjemahkan ke UI digital dengan ciri khas: kejujuran visual, ketegasan, dan kontras tinggi.

### Prinsip Utama

| Prinsip | Implementasi |
|---|---|
| **Border tebal** | Semua elemen interaktif menggunakan `border: 3px solid #000` atau lebih tebal |
| **Hard shadow** | Box shadow tajam tanpa blur: `box-shadow: 4px 4px 0px #000` |
| **Warna kontras** | Palet terbatas dengan warna-warna berani dan latar putih/krem |
| **Tipografi bold** | Font weight 700–900, huruf kapital untuk label penting |
| **Efek hover** | Shadow bergeser atau menghilang saat hover untuk efek "tertekan" |

### Palet Warna

```
Latar utama    : #FFFBF0  (krem hangat)
Aksen primer   : #FFE500  (kuning terang)
Aksen sekunder : #FF6B9D  (merah muda)
Aksen tersier  : #00D4FF  (biru cyan)
Aksen sukses   : #00FF88  (hijau neon)
Border & shadow: #000000  (hitam pekat)
Teks utama     : #000000  (hitam pekat)
Teks sekunder  : #333333  (abu gelap)
```

### Komponen Visual

#### Header / Judul Aplikasi
```
┌─────────────────────────────────────────┐
│  ██████████████████████████████████████ │  ← background: #FFE500
│  █  MY TODO LIST                      █ │  ← font-weight: 900, uppercase
│  ██████████████████████████████████████ │
└─────────────────────────────────────────┘
border: 3px solid #000
box-shadow: 5px 5px 0px #000
```

#### Input Tambah Tugas
```
┌──────────────────────────────┐  ┌──────────┐
│  Tambah tugas baru...        │  │  TAMBAH  │
└──────────────────────────────┘  └──────────┘
border: 3px solid #000              background: #FF6B9D
box-shadow: 4px 4px 0px #000        border: 3px solid #000
                                    box-shadow: 4px 4px 0px #000
                                    font-weight: 700
```

#### Item Tugas (belum selesai)
```
┌─────────────────────────────────────────────────┐
│  ○  Judul tugas di sini              ✎  🗑       │
└─────────────────────────────────────────────────┘
background: #FFFFFF
border: 3px solid #000
box-shadow: 4px 4px 0px #000
```

#### Item Tugas (selesai)
```
┌─────────────────────────────────────────────────┐
│  ✓  ~~Judul tugas di sini~~          ✎  🗑       │  ← teks dicoret
└─────────────────────────────────────────────────┘
background: #00FF88  ← hijau neon
border: 3px solid #000
box-shadow: 4px 4px 0px #000
opacity: 0.85
```

#### Tombol Filter
```
┌───────┐  ┌──────────┐  ┌───────────┐
│  ALL  │  │  ACTIVE  │  │ COMPLETED │
└───────┘  └──────────┘  └───────────┘
Aktif: background #FFE500, border 3px solid #000, box-shadow 3px 3px 0 #000
Tidak aktif: background #FFF, border 3px solid #000, no shadow
```

#### Tombol Hapus Selesai
```
┌──────────────────────┐
│  HAPUS YANG SELESAI  │
└──────────────────────┘
background: #FF6B9D
border: 3px solid #000
box-shadow: 4px 4px 0px #000
font-weight: 700, uppercase
```

### Interaksi & Animasi

| Elemen | State Normal | State Hover | State Active (klik) |
|---|---|---|---|
| Tombol | shadow `4px 4px 0 #000` | shadow `2px 2px 0 #000`, translate `(2px, 2px)` | shadow `0px 0px 0 #000`, translate `(4px, 4px)` |
| Input | shadow `4px 4px 0 #000` | shadow `4px 4px 0 #000` | outline `3px solid #000` |
| Item todo | shadow `4px 4px 0 #000` | shadow `6px 6px 0 #000`, translate `(-2px, -2px)` | — |

Efek "tertekan" pada tombol dicapai dengan menggeser `translate` searah shadow dan mengurangi shadow secara proporsional — tanpa transisi panjang, cukup `transition: all 0.1s ease`.

### Tipografi

```css
font-family: 'Space Grotesk', 'Inter', sans-serif;  /* atau font system bold */
--font-size-title  : 2rem;    font-weight: 900;
--font-size-heading: 1.25rem; font-weight: 700;
--font-size-body   : 1rem;    font-weight: 500;
--font-size-label  : 0.875rem; font-weight: 700; text-transform: uppercase;
```

### Layout

- Lebar konten maksimal: `600px`, terpusat di layar
- Padding container: `24px`
- Gap antar item todo: `12px`
- Border-radius: **0px** (sudut kotak penuh — ciri khas neobrutalism)
- Semua elemen menggunakan sudut tajam, tidak ada `border-radius` kecuali checkbox yang berbentuk lingkaran

---

## Arsitektur

Aplikasi menggunakan arsitektur **MVC sederhana berbasis modul**:

```
┌─────────────────────────────────────────────────┐
│                   UI Layer (View)                │
│  index.html + style.css + render functions       │
└────────────────────┬────────────────────────────┘
                     │ DOM events / render calls
┌────────────────────▼────────────────────────────┐
│              Controller (app.js)                 │
│  Event handlers, orchestrasi state & storage     │
└──────────┬──────────────────────┬───────────────┘
           │                      │
┌──────────▼──────┐    ┌──────────▼──────────────┐
│  State (store)  │    │  Storage (storage.js)    │
│  Array of Todo  │    │  localStorage read/write │
└─────────────────┘    └─────────────────────────┘
```

**Alur data:**
1. Pengguna berinteraksi dengan UI → event handler di `app.js` dipanggil
2. Controller memutasi state (array tugas di memori)
3. Controller memanggil `storage.save()` untuk persistensi
4. Controller memanggil `render()` untuk memperbarui tampilan

---

## Komponen dan Antarmuka

### Struktur File

```
todolist-app/
├── index.html          # Markup utama
├── style.css           # Styling
└── src/
    ├── app.js          # Entry point, event handlers, controller
    ├── store.js        # State management (array tugas + filter aktif)
    ├── storage.js      # Abstraksi localStorage
    ├── render.js       # Fungsi rendering DOM
    └── validators.js   # Validasi input
```

### Antarmuka Fungsi Utama

**`storage.js`**
```js
// Menyimpan seluruh daftar tugas ke localStorage
save(todos: Todo[]): void

// Memuat daftar tugas dari localStorage; mengembalikan [] jika gagal
load(): Todo[]
```

**`store.js`**
```js
// State global
state = { todos: Todo[], filter: 'all' }

// Operasi pada state
addTodo(title: string): Todo
toggleTodo(id: string): void
editTodo(id: string, newTitle: string): void
deleteTodo(id: string): void
clearCompleted(): void
setFilter(filter: FilterType): void
getFilteredTodos(): Todo[]
```

**`validators.js`**
```js
// Mengembalikan true jika judul valid (tidak kosong/hanya spasi)
isValidTitle(title: string): boolean
```

**`render.js`**
```js
// Me-render ulang seluruh daftar tugas ke DOM
renderTodos(todos: Todo[]): void

// Me-render ulang tombol filter dan status aktif
renderFilters(activeFilter: FilterType): void

// Menampilkan/menyembunyikan tombol "Hapus Selesai"
renderClearButton(todos: Todo[]): void

// Menampilkan pesan validasi pada elemen tertentu
showValidationMessage(element: HTMLElement, message: string): void
```

---

## Model Data

### Tipe `Todo`

```js
{
  id: string,          // UUID unik, dibuat saat tugas ditambahkan
  title: string,       // Judul tugas (non-empty, sudah di-trim)
  completed: boolean,  // Status: false = belum selesai, true = selesai
  createdAt: number    // Unix timestamp (Date.now()) saat pembuatan
}
```

### Tipe `FilterType`

```js
type FilterType = 'all' | 'active' | 'completed'
```

### Format Penyimpanan localStorage

```js
// Key: 'todolist-app-todos'
// Value: JSON.stringify(Todo[])
localStorage.setItem('todolist-app-todos', JSON.stringify(todos))
```

### Aturan Validasi

| Field   | Aturan                                              |
|---------|-----------------------------------------------------|
| `title` | Wajib diisi, setelah `.trim()` panjang minimal 1 karakter |
| `id`    | Dibuat otomatis menggunakan `crypto.randomUUID()`   |
| `createdAt` | Dibuat otomatis menggunakan `Date.now()`        |

---

## Properti Kebenaran (Correctness Properties)

*Sebuah properti adalah karakteristik atau perilaku yang harus berlaku di semua eksekusi sistem yang valid — pada dasarnya, pernyataan formal tentang apa yang seharusnya dilakukan sistem. Properti berfungsi sebagai jembatan antara spesifikasi yang dapat dibaca manusia dan jaminan kebenaran yang dapat diverifikasi secara otomatis.*

### Properti 1: Penambahan tugas memperbesar daftar

*Untuk setiap* daftar tugas dan judul tugas yang valid (tidak kosong/tidak hanya spasi), menambahkan tugas tersebut harus menghasilkan panjang daftar bertambah tepat satu, dan tugas baru harus ada di daftar dengan status `completed = false`.

**Memvalidasi: Requirements 1.2**

---

### Properti 2: Judul yang hanya berisi whitespace ditolak

*Untuk setiap* string yang seluruhnya terdiri dari karakter whitespace (spasi, tab, newline, atau kombinasinya) — baik saat menambah tugas baru maupun saat mengedit judul tugas yang ada — operasi harus ditolak dan daftar tugas tidak boleh berubah.

**Memvalidasi: Requirements 1.4, 4.4**

---

### Properti 3: Toggle status adalah operasi round-trip

*Untuk setiap* tugas dengan status apapun (`completed = true` atau `false`), melakukan toggle dua kali berturut-turut harus mengembalikan tugas ke status semula yang persis sama.

**Memvalidasi: Requirements 3.2, 3.3**

---

### Properti 4: Filter mengembalikan subset yang konsisten

*Untuk setiap* daftar tugas dan nilai filter yang dipilih, semua tugas yang dikembalikan oleh `getFilteredTodos()` harus memenuhi kriteria filter tersebut secara ketat — filter `'active'` hanya mengembalikan tugas dengan `completed = false`, filter `'completed'` hanya mengembalikan tugas dengan `completed = true`, dan filter `'all'` mengembalikan tepat semua tugas tanpa pengecualian.

**Memvalidasi: Requirements 6.2, 6.3, 6.4**

---

### Properti 5: Persistensi data round-trip

*Untuk setiap* array tugas yang valid, menyimpan ke storage lalu memuatnya kembali harus menghasilkan array yang ekuivalen secara struktural — semua field `id`, `title`, `completed`, dan `createdAt` pada setiap tugas terjaga nilainya persis sama.

**Memvalidasi: Requirements 8.2, 8.4, 1.5**

---

### Properti 6: clearCompleted menghilangkan semua tugas selesai

*Untuk setiap* daftar tugas dengan komposisi apapun, setelah operasi `clearCompleted()` dijalankan, tidak boleh ada satu pun tugas dengan `completed = true` yang tersisa di daftar, dan semua tugas dengan `completed = false` harus tetap ada.

**Memvalidasi: Requirements 7.2**

---

### Properti 7: Visibilitas tombol "Hapus Selesai" konsisten dengan state

*Untuk setiap* daftar tugas, tombol "Hapus Selesai" harus ditampilkan jika dan hanya jika terdapat minimal satu tugas dengan `completed = true` di daftar.

**Memvalidasi: Requirements 7.1, 7.4**

---

### Properti 8: Daftar tugas dirender dalam urutan terbaru ke terlama

*Untuk setiap* array tugas dengan nilai `createdAt` yang berbeda-beda, hasil render harus menampilkan tugas dalam urutan descending berdasarkan `createdAt` (tugas dengan `createdAt` terbesar muncul pertama).

**Memvalidasi: Requirements 2.1**

---

### Properti 9: Setiap tugas dirender dengan semua field yang diperlukan

*Untuk setiap* tugas yang valid, hasil render item tugas tersebut harus mengandung judul tugas, indikator status (selesai/belum selesai), dan waktu pembuatan yang dapat dibaca.

**Memvalidasi: Requirements 2.3**

---

### Properti 10: Penghapusan tugas menghilangkan tugas dari daftar

*Untuk setiap* daftar tugas yang berisi minimal satu tugas, menghapus tugas tertentu harus menghasilkan tugas tersebut tidak ada lagi di daftar, dan semua tugas lainnya tetap ada tanpa perubahan.

**Memvalidasi: Requirements 5.2**

---

## Penanganan Error

| Skenario | Penanganan |
|---|---|
| Input kosong / hanya spasi saat tambah | Tampilkan pesan validasi, jangan tambahkan tugas |
| Input kosong / hanya spasi saat edit | Tampilkan pesan validasi, jangan simpan perubahan |
| `localStorage` tidak tersedia (private mode, kuota penuh) | Tangkap exception, mulai dengan daftar kosong, lanjutkan operasi normal |
| Data JSON di `localStorage` korup | Tangkap `JSON.parse` exception, kembalikan array kosong |
| `crypto.randomUUID()` tidak tersedia | Fallback ke `Date.now() + Math.random()` sebagai ID |

Semua error ditangani secara *graceful* — aplikasi tidak boleh crash, selalu menampilkan state yang valid kepada pengguna.

---

## Strategi Pengujian

### Pendekatan Dual Testing

Pengujian menggunakan dua pendekatan yang saling melengkapi:

1. **Unit test berbasis contoh** — untuk skenario spesifik, edge case, dan kondisi error
2. **Property-based test** — untuk memverifikasi properti universal di atas berbagai input yang di-generate secara acak

**Library yang digunakan:**
- **[fast-check](https://github.com/dubzzz/fast-check)** — library property-based testing untuk JavaScript/TypeScript
- **[Vitest](https://vitest.dev/)** — test runner (kompatibel dengan fast-check, mendukung ESM)

### Konfigurasi Property-Based Test

- Minimum **100 iterasi** per property test
- Setiap test diberi tag komentar yang mereferensikan properti di dokumen desain ini
- Format tag: `// Feature: todolist-app, Property {N}: {deskripsi singkat}`

### Cakupan Unit Test

| Modul | Skenario yang Diuji |
|---|---|
| `validators.js` | String valid, string kosong, string spasi, string dengan spasi di tepi |
| `store.js` | Add, toggle, edit, delete, clearCompleted, setFilter, getFilteredTodos |
| `storage.js` | Save & load normal, localStorage tidak tersedia, data JSON korup |
| `render.js` | Render daftar kosong (pesan kosong), render tugas selesai (teks dicoret), render filter aktif, visibilitas tombol "Hapus Selesai" |

### Cakupan Property-Based Test

Setiap properti di bagian "Properti Kebenaran" diimplementasikan sebagai satu property-based test menggunakan `fast-check`:

| Property | Arbitrari fast-check |
|---|---|
| P1: Penambahan memperbesar daftar | `fc.array(todoArb)`, `fc.string()` yang valid |
| P2: Judul spasi ditolak | `fc.string({ unit: 'grapheme' })` yang di-filter hanya spasi |
| P3: Toggle round-trip | `fc.array(todoArb)`, `fc.integer()` sebagai index |
| P4: Filter konsisten | `fc.array(todoArb)`, `fc.constantFrom('all','active','completed')` |
| P5: JSON round-trip | `fc.array(todoArb)` |
| P6: clearCompleted menghapus semua selesai | `fc.array(todoArb)` |
