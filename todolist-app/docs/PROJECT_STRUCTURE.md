# Struktur Proyek Todolist App

Dokumen ini menjelaskan organisasi file dan folder dalam proyek Todolist App.

## Struktur Direktori

```
todolist-app/
├── src/                    # Kode sumber aplikasi
├── tests/                  # Unit tests
├── docs/                   # Dokumentasi tambahan
├── node_modules/           # Dependencies (auto-generated)
└── [file konfigurasi]      # File-file di root
```

## Detail Folder

### `/src` - Source Code

Berisi semua kode sumber aplikasi dengan arsitektur modular:

- **app.js** - Entry point aplikasi
  - Inisialisasi aplikasi
  - Event handlers untuk user interactions
  - Orchestration layer yang menghubungkan semua modul
  - Mode testing manual terintegrasi

- **store.js** - State Management
  - Single source of truth untuk state aplikasi
  - Business logic untuk operasi CRUD
  - Filter management
  - Fungsi: `addTodo`, `toggleTodo`, `deleteTodo`, `editTodo`, `clearCompleted`

- **storage.js** - Persistensi Data
  - Abstraksi layer untuk localStorage
  - Error handling untuk quota exceeded
  - Fungsi: `save`, `load`

- **validators.js** - Validasi Input
  - Business rules untuk validasi
  - Aturan: min 3 karakter, max 50 karakter, tidak boleh kosong
  - Fungsi: `validateTitle`, `isValidTitle`

- **render.js** - UI Rendering
  - Manipulasi DOM
  - Rendering todo list, filters, buttons
  - Validation message display
  - Fungsi: `renderTodos`, `renderFilters`, `renderClearButton`, `showValidationMessage`

### `/tests` - Unit Tests

Berisi test suite untuk semua modul menggunakan Vitest:

- **store.test.js** - Test untuk state management (30 tests)
- **storage.test.js** - Test untuk persistensi data (9 tests)
- **validators.test.js** - Test untuk validasi input (21 tests)
- **render.test.js** - Test untuk UI rendering (13 tests)

**Total: 73 test cases**

### `/docs` - Dokumentasi

Berisi dokumentasi tambahan dan tools:

- **test-manual.html** - Interface untuk manual testing
- **test-manual.js** - Script untuk manual testing (26 test cases)
- **PROJECT_STRUCTURE.md** - Dokumen ini

### Root Files

#### Dokumentasi
- **README.md** - Dokumentasi utama proyek
- **CONTRIBUTING.md** - Panduan kontribusi
- **CHANGELOG.md** - Catatan perubahan versi
- **LICENSE** - Lisensi MIT

#### Konfigurasi
- **package.json** - Konfigurasi npm dan dependencies
- **package-lock.json** - Lock file untuk dependencies
- **vitest.config.js** - Konfigurasi testing
- **.gitignore** - File yang diabaikan git

#### Aplikasi
- **index.html** - Halaman utama aplikasi
- **style.css** - Styling aplikasi

## Arsitektur Aplikasi

### Separation of Concerns

```
┌─────────────┐
│   app.js    │  ← Entry Point & Event Handlers
└──────┬──────┘
       │
       ├──────────────┬──────────────┬──────────────┐
       │              │              │              │
┌──────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐ ┌────▼─────┐
│  store.js   │ │render.js │ │validators.js│ │storage.js│
│  (State)    │ │  (View)  │ │  (Rules)    │ │  (Data)  │
└─────────────┘ └──────────┘ └─────────────┘ └──────────┘
```

### Data Flow

```
User Action
    ↓
Event Handler (app.js)
    ↓
Validation (validators.js)
    ↓
State Update (store.js)
    ↓
Persist Data (storage.js)
    ↓
Re-render UI (render.js)
```

## Konvensi Penamaan

### File
- Gunakan kebab-case untuk nama file: `test-manual.js`
- Gunakan `.test.js` suffix untuk test files
- Gunakan `.md` untuk dokumentasi

### Kode
- **camelCase** untuk variabel dan fungsi: `addTodo`, `renderTodos`
- **PascalCase** untuk class/constructor (jika ada)
- **UPPER_CASE** untuk konstanta: `STORAGE_KEY`

### Folder
- Gunakan lowercase untuk nama folder: `src`, `tests`, `docs`
- Gunakan nama yang deskriptif dan singular/plural sesuai konteks

## Best Practices

### Modularitas
- Setiap modul memiliki tanggung jawab yang jelas
- Tidak ada circular dependencies
- Export hanya fungsi yang diperlukan

### Testing
- Setiap modul memiliki test file terpisah
- Test coverage mencakup happy path dan edge cases
- Gunakan descriptive test names

### Dokumentasi
- Setiap fungsi memiliki JSDoc comment
- README.md selalu up-to-date
- CHANGELOG.md mencatat semua perubahan

### Git
- `.gitignore` mencegah commit file yang tidak perlu
- Commit message mengikuti conventional commits
- Branch strategy: feature branches dari main

## Menambah Fitur Baru

Ketika menambah fitur baru, ikuti struktur ini:

1. **Tambah business logic** di `src/store.js`
2. **Tambah validasi** (jika perlu) di `src/validators.js`
3. **Tambah rendering** di `src/render.js`
4. **Tambah event handler** di `src/app.js`
5. **Tambah test** di `tests/[module].test.js`
6. **Update dokumentasi** di `README.md` dan `CHANGELOG.md`

## Maintenance

### Dependency Updates
```bash
npm outdated          # Cek dependencies yang outdated
npm update            # Update dependencies
npm audit             # Cek security vulnerabilities
```

### Code Quality
```bash
npm test              # Run test suite
npm run test:watch    # Run tests in watch mode (jika dikonfigurasi)
```

### Cleanup
```bash
rm -rf node_modules   # Hapus dependencies
npm install           # Install ulang
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
