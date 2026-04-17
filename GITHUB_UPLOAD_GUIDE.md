# 📤 Panduan Upload Project ke GitHub (Simple)

## 🎯 Apa yang Akan Di-Upload?

Project Todolist App Anda akan di-upload ke GitHub, termasuk:
- ✅ Source code (`todolist-app/src/`)
- ✅ Tests (`todolist-app/tests/`)
- ✅ Dokumentasi (`README.md`, `CONTRIBUTING.md`, dll)
- ✅ Spec files (`.kiro/specs/`)
- ❌ `node_modules/` (TIDAK di-upload, terlalu besar)
- ❌ `.DS_Store` (file sistem, tidak perlu)

---

## 📋 Prasyarat

1. **Punya akun GitHub** - Jika belum, daftar di https://github.com
2. **Git terinstall** - Cek dengan command: `git --version`
   - Jika belum install, download di: https://git-scm.com/downloads

---

## 🚀 Langkah-Langkah Upload (Simple)

### Step 1: Buat Repository di GitHub

1. Buka https://github.com
2. Login ke akun Anda
3. Klik tombol **"New"** (hijau) atau **"+"** di pojok kanan atas → **"New repository"**
4. Isi form:
   - **Repository name**: `todolist-app` (atau nama lain yang Anda suka)
   - **Description**: `A simple todo list app with dark mode, drag & drop, and bulk actions`
   - **Public** atau **Private**: Pilih sesuai keinginan
     - Public = Semua orang bisa lihat
     - Private = Hanya Anda yang bisa lihat
   - ❌ **JANGAN centang** "Add a README file" (kita sudah punya)
   - ❌ **JANGAN centang** "Add .gitignore" (kita sudah punya)
   - ❌ **JANGAN centang** "Choose a license"
5. Klik **"Create repository"**

GitHub akan menampilkan halaman dengan instruksi. **JANGAN TUTUP** halaman ini dulu!

---

### Step 2: Inisialisasi Git di Project Anda

Buka Terminal/Command Prompt, lalu jalankan command berikut:

```bash
# 1. Masuk ke folder project
cd /Users/mac/Documents/kiro

# 2. Inisialisasi Git (membuat folder .git)
git init

# 3. Tambahkan semua file ke staging area
git add .

# 4. Buat commit pertama
git commit -m "Initial commit: Todolist app with UI enhancements spec"
```

**Penjelasan:**
- `git init` = Membuat project ini menjadi Git repository
- `git add .` = Menambahkan semua file (kecuali yang di `.gitignore`)
- `git commit -m "..."` = Menyimpan snapshot dengan pesan

---

### Step 3: Hubungkan ke GitHub Repository

Kembali ke halaman GitHub yang tadi (jangan ditutup). Copy command yang ada di bagian **"…or push an existing repository from the command line"**.

Atau jalankan command ini (ganti `YOUR_USERNAME` dan `YOUR_REPO_NAME`):

```bash
# 1. Tambahkan remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 2. Rename branch ke 'main' (standar GitHub)
git branch -M main

# 3. Push ke GitHub
git push -u origin main
```

**Contoh:**
```bash
git remote add origin https://github.com/johndoe/todolist-app.git
git branch -M main
git push -u origin main
```

**Jika diminta username dan password:**
- Username: username GitHub Anda
- Password: **BUKAN password akun**, tapi **Personal Access Token** (lihat Step 4)

---

### Step 4: Buat Personal Access Token (Jika Diminta)

GitHub tidak lagi menerima password biasa. Anda perlu Personal Access Token:

1. Buka https://github.com/settings/tokens
2. Klik **"Generate new token"** → **"Generate new token (classic)"**
3. Isi form:
   - **Note**: `Todolist App Upload`
   - **Expiration**: `90 days` (atau sesuai kebutuhan)
   - **Select scopes**: Centang **`repo`** (full control of private repositories)
4. Klik **"Generate token"**
5. **COPY TOKEN** yang muncul (hanya muncul sekali!)
6. Gunakan token ini sebagai password saat `git push`

**Simpan token ini di tempat aman!** Anda akan butuh lagi nanti.

---

### Step 5: Verifikasi Upload Berhasil

1. Buka repository Anda di GitHub: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
2. Anda akan melihat semua file project Anda!
3. Cek apakah `README.md` tampil dengan baik di halaman utama

---

## 🎉 Selesai!

Project Anda sekarang sudah di GitHub! 🚀

---

## 📝 Command Cheat Sheet

### Upload Perubahan Baru (Setelah Edit Code)

Setiap kali Anda edit code dan ingin upload perubahan:

```bash
# 1. Cek file yang berubah
git status

# 2. Tambahkan file yang berubah
git add .

# 3. Commit dengan pesan
git commit -m "Add dark mode feature"

# 4. Push ke GitHub
git push
```

### Lihat History Commit

```bash
git log --oneline
```

### Lihat File yang Berubah

```bash
git status
```

### Batalkan Perubahan (Belum di-commit)

```bash
git checkout -- nama-file.js
```

---

## 🔧 Troubleshooting

### Error: "remote origin already exists"

```bash
# Hapus remote lama
git remote remove origin

# Tambahkan remote baru
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Error: "failed to push some refs"

```bash
# Pull dulu, baru push
git pull origin main --rebase
git push
```

### Error: "Permission denied"

- Pastikan Personal Access Token Anda benar
- Atau gunakan SSH key (lebih advanced)

---

## 🌟 Tips Pro

### 1. Buat Branch untuk Fitur Baru

```bash
# Buat branch baru
git checkout -b feature/dark-mode

# Edit code...

# Commit
git add .
git commit -m "Implement dark mode"

# Push branch
git push -u origin feature/dark-mode

# Buat Pull Request di GitHub
```

### 2. Gunakan Commit Message yang Jelas

❌ Bad:
```bash
git commit -m "update"
git commit -m "fix bug"
```

✅ Good:
```bash
git commit -m "feat: add dark mode toggle button"
git commit -m "fix: resolve drag & drop on mobile"
git commit -m "docs: update README with new features"
```

### 3. Commit Sering, Push Berkala

- Commit setiap kali selesai 1 fitur kecil
- Push ke GitHub minimal 1x sehari (backup otomatis!)

---

## 📚 Resources

- **Git Basics**: https://git-scm.com/book/en/v2/Getting-Started-Git-Basics
- **GitHub Guides**: https://guides.github.com/
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf

---

## ❓ FAQ

**Q: Apakah `node_modules/` akan di-upload?**  
A: Tidak, karena sudah ada di `.gitignore`. Orang lain bisa install dengan `npm install`.

**Q: Apakah file `.env` akan di-upload?**  
A: Tidak, karena sudah ada di `.gitignore`. **JANGAN PERNAH** upload file `.env` (berisi password/API keys).

**Q: Bagaimana cara orang lain download project saya?**  
A: Mereka bisa clone dengan: `git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`

**Q: Apakah saya bisa edit langsung di GitHub?**  
A: Bisa, tapi tidak disarankan. Lebih baik edit di local, lalu push.

**Q: Bagaimana cara menghapus repository?**  
A: Buka repository di GitHub → Settings → Scroll ke bawah → Delete this repository

---

## 🎯 Next Steps

Setelah upload ke GitHub, Anda bisa:

1. **Tambahkan GitHub Pages** - Deploy app Anda secara gratis
2. **Buat README yang menarik** - Tambahkan screenshot, demo link
3. **Tambahkan GitHub Actions** - Auto-run tests saat push
4. **Invite collaborators** - Ajak teman untuk contribute

---

**Happy Coding! 🚀**
