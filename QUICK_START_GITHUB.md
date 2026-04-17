# 🚀 Quick Start: Upload ke GitHub (5 Menit)

## 📌 Cara Paling Simple (Pilih Salah Satu)

### 🎯 Cara 1: Pakai Script Otomatis (RECOMMENDED)

```bash
# Jalankan script ini di Terminal
bash upload-to-github.sh
```

Script akan memandu Anda step-by-step! Tinggal ikuti instruksi.

---

### 🎯 Cara 2: Manual (Copy-Paste Command)

#### Step 1: Buat Repository di GitHub

1. Buka https://github.com/new
2. Isi:
   - **Repository name**: `todolist-app`
   - **Public** atau **Private**: Pilih sesuai keinginan
3. ❌ **JANGAN centang** apapun
4. Klik **"Create repository"**

#### Step 2: Jalankan Command Ini

```bash
# 1. Masuk ke folder project
cd /Users/mac/Documents/kiro

# 2. Inisialisasi Git
git init

# 3. Tambahkan semua file
git add .

# 4. Commit
git commit -m "Initial commit: Todolist app"

# 5. Hubungkan ke GitHub (GANTI URL dengan URL repository Anda!)
git remote add origin https://github.com/USERNAME/todolist-app.git

# 6. Rename branch
git branch -M main

# 7. Push ke GitHub
git push -u origin main
```

**Ganti `USERNAME` dengan username GitHub Anda!**

---

## 🔑 Personal Access Token (Jika Diminta Password)

GitHub tidak menerima password biasa. Anda perlu token:

### Cara Buat Token (2 Menit):

1. Buka: https://github.com/settings/tokens
2. Klik **"Generate new token"** → **"Generate new token (classic)"**
3. Isi:
   - **Note**: `Todolist App`
   - **Expiration**: `90 days`
   - **Centang**: `repo` (full control)
4. Klik **"Generate token"**
5. **COPY TOKEN** (hanya muncul sekali!)
6. Gunakan token ini sebagai password saat `git push`

**Simpan token di tempat aman!**

---

## ✅ Verifikasi Upload Berhasil

1. Buka: `https://github.com/USERNAME/todolist-app`
2. Anda akan lihat semua file project!
3. README.md akan tampil di halaman utama

---

## 📝 Upload Perubahan Baru (Setelah Edit Code)

Setiap kali edit code:

```bash
git add .
git commit -m "Deskripsi perubahan"
git push
```

**Contoh:**
```bash
git add .
git commit -m "Add dark mode feature"
git push
```

---

## 🆘 Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/todolist-app.git
```

### Error: "Permission denied"
- Pastikan Personal Access Token benar
- Copy-paste token dengan hati-hati (tidak ada spasi)

### Error: "failed to push"
```bash
git pull origin main --rebase
git push
```

---

## 🎉 Selesai!

Project Anda sekarang di GitHub! 🚀

**Next Steps:**
- Share link repository ke teman
- Deploy ke GitHub Pages (gratis!)
- Tambahkan screenshot di README.md

---

**Butuh bantuan?** Baca panduan lengkap di `GITHUB_UPLOAD_GUIDE.md`
