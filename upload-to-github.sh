#!/bin/bash

# 🚀 Script Otomatis Upload ke GitHub
# Cara pakai: bash upload-to-github.sh

echo "🚀 Todolist App - GitHub Upload Script"
echo "======================================="
echo ""

# Warna untuk output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Cek apakah Git sudah terinstall
echo "📋 Step 1: Checking Git installation..."
if ! command -v git &> /dev/null
then
    echo -e "${RED}❌ Git belum terinstall!${NC}"
    echo "Download Git di: https://git-scm.com/downloads"
    exit 1
fi
echo -e "${GREEN}✅ Git terinstall: $(git --version)${NC}"
echo ""

# Step 2: Cek apakah sudah ada .git folder
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git repository sudah ada!${NC}"
    echo "Apakah Anda ingin melanjutkan? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Upload dibatalkan."
        exit 0
    fi
else
    # Step 3: Inisialisasi Git
    echo "📋 Step 2: Initializing Git repository..."
    git init
    echo -e "${GREEN}✅ Git repository initialized${NC}"
    echo ""
fi

# Step 4: Tambahkan semua file
echo "📋 Step 3: Adding files to Git..."
git add .
echo -e "${GREEN}✅ Files added${NC}"
echo ""

# Step 5: Buat commit pertama
echo "📋 Step 4: Creating first commit..."
git commit -m "Initial commit: Todolist app with UI enhancements spec"
echo -e "${GREEN}✅ Commit created${NC}"
echo ""

# Step 6: Tanya URL repository GitHub
echo "📋 Step 5: Connecting to GitHub..."
echo ""
echo -e "${YELLOW}Sekarang Anda perlu:${NC}"
echo "1. Buka https://github.com"
echo "2. Login ke akun Anda"
echo "3. Klik tombol 'New' untuk buat repository baru"
echo "4. Beri nama repository (contoh: todolist-app)"
echo "5. JANGAN centang 'Add a README' atau '.gitignore'"
echo "6. Klik 'Create repository'"
echo ""
echo -e "${YELLOW}Setelah repository dibuat, copy URL-nya.${NC}"
echo "Contoh: https://github.com/username/todolist-app.git"
echo ""
echo "Masukkan URL repository GitHub Anda:"
read -r repo_url

# Validasi URL
if [ -z "$repo_url" ]; then
    echo -e "${RED}❌ URL tidak boleh kosong!${NC}"
    exit 1
fi

# Step 7: Tambahkan remote
echo ""
echo "📋 Step 6: Adding remote repository..."
git remote remove origin 2>/dev/null  # Hapus jika sudah ada
git remote add origin "$repo_url"
echo -e "${GREEN}✅ Remote added${NC}"
echo ""

# Step 8: Rename branch ke main
echo "📋 Step 7: Renaming branch to 'main'..."
git branch -M main
echo -e "${GREEN}✅ Branch renamed${NC}"
echo ""

# Step 9: Push ke GitHub
echo "📋 Step 8: Pushing to GitHub..."
echo ""
echo -e "${YELLOW}Anda akan diminta username dan password:${NC}"
echo "- Username: username GitHub Anda"
echo "- Password: Personal Access Token (BUKAN password akun)"
echo ""
echo "Jika belum punya token, buat di:"
echo "https://github.com/settings/tokens"
echo ""
echo "Press Enter to continue..."
read -r

git push -u origin main

# Step 10: Selesai
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 SUCCESS! Project berhasil di-upload ke GitHub!${NC}"
    echo ""
    echo "Buka repository Anda di:"
    echo "$repo_url"
    echo ""
    echo "Next steps:"
    echo "1. Refresh halaman GitHub untuk lihat project Anda"
    echo "2. Baca README.md yang tampil di halaman utama"
    echo "3. Setiap kali edit code, jalankan:"
    echo "   git add ."
    echo "   git commit -m 'Deskripsi perubahan'"
    echo "   git push"
else
    echo ""
    echo -e "${RED}❌ Upload gagal!${NC}"
    echo ""
    echo "Kemungkinan masalah:"
    echo "1. URL repository salah"
    echo "2. Personal Access Token salah"
    echo "3. Tidak ada koneksi internet"
    echo ""
    echo "Coba lagi atau baca panduan di GITHUB_UPLOAD_GUIDE.md"
fi
