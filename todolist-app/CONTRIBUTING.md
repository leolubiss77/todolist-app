# Panduan Kontribusi

Terima kasih atas minat Anda untuk berkontribusi pada Todolist App! Dokumen ini berisi panduan untuk membantu Anda memulai.

## Cara Berkontribusi

### Melaporkan Bug

Jika Anda menemukan bug, silakan buat issue dengan informasi berikut:
- Deskripsi bug yang jelas
- Langkah-langkah untuk mereproduksi
- Hasil yang diharapkan vs hasil aktual
- Screenshot (jika relevan)
- Browser dan versi yang digunakan

### Mengusulkan Fitur Baru

Untuk mengusulkan fitur baru:
1. Buat issue dengan label "enhancement"
2. Jelaskan fitur yang diusulkan
3. Jelaskan mengapa fitur ini berguna
4. Berikan contoh use case jika memungkinkan

### Pull Request

1. Fork repository ini
2. Buat branch baru dari `main`:
   ```bash
   git checkout -b feature/nama-fitur
   ```
3. Lakukan perubahan Anda
4. Pastikan semua test lulus:
   ```bash
   npm test
   ```
5. Commit perubahan dengan pesan yang jelas:
   ```bash
   git commit -m "feat: menambahkan fitur X"
   ```
6. Push ke branch Anda:
   ```bash
   git push origin feature/nama-fitur
   ```
7. Buat Pull Request ke branch `main`

## Standar Kode

### Gaya Penulisan

- Gunakan 2 spasi untuk indentasi
- Gunakan single quotes untuk string
- Tambahkan semicolon di akhir statement
- Gunakan camelCase untuk nama variabel dan fungsi
- Tambahkan komentar untuk logika yang kompleks

### Struktur Commit Message

Gunakan format berikut untuk commit message:

```
<type>: <subject>

<body>
```

**Type:**
- `feat`: Fitur baru
- `fix`: Perbaikan bug
- `docs`: Perubahan dokumentasi
- `style`: Perubahan format kode (tidak mengubah logika)
- `refactor`: Refactoring kode
- `test`: Menambah atau memperbaiki test
- `chore`: Perubahan pada build process atau tools

**Contoh:**
```
feat: menambahkan fitur drag and drop untuk todo

- Implementasi drag and drop API
- Update styling untuk visual feedback
- Tambah test untuk fitur baru
```

## Testing

### Menjalankan Test

```bash
npm test
```

### Menulis Test

- Setiap fitur baru harus disertai test
- Test harus mencakup happy path dan edge cases
- Gunakan deskripsi test yang jelas dan deskriptif
- Letakkan test di folder `tests/` dengan nama file `[module].test.js`

### Contoh Test

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { addTodo, state } from '../src/store.js';

describe('addTodo', () => {
  beforeEach(() => {
    state.todos = [];
  });

  it('should add a new todo to state', () => {
    addTodo('Test Todo');
    expect(state.todos).toHaveLength(1);
    expect(state.todos[0].title).toBe('Test Todo');
  });
});
```

## Struktur Proyek

```
todolist-app/
├── src/              # Source code
├── tests/            # Unit tests
├── docs/             # Dokumentasi tambahan
├── index.html        # Entry point
├── style.css         # Styling
└── README.md         # Dokumentasi utama
```

## Proses Review

1. Maintainer akan mereview Pull Request Anda
2. Mungkin ada permintaan perubahan atau diskusi
3. Setelah disetujui, PR akan di-merge
4. Kontribusi Anda akan muncul di CHANGELOG.md

## Kode Etik

- Bersikap hormat dan profesional
- Terima kritik konstruktif dengan lapang dada
- Fokus pada apa yang terbaik untuk proyek
- Hormati waktu dan usaha kontributor lain

## Pertanyaan?

Jika Anda memiliki pertanyaan, silakan:
- Buat issue dengan label "question"
- Atau hubungi maintainer melalui email

Terima kasih telah berkontribusi! 🎉
