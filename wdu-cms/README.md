# WDU CMS - Panduan Instalasi

Panduan ini dibuat untuk developer/intern yang akan mengembangkan project WDU CMS.

---

## Prerequisites (Software yang Wajib Diinstall)

Sebelum mulai, install software berikut di komputer kamu:

1. **Node.js** (v20 LTS)
   - Download: https://nodejs.org/
   - Cek install: `node -v` (harus 20.x.x)

2. **Git**
   - Download: https://git-scm.com/
   - Cek install: `git --version`

3. **PostgreSQL** (sudah ada di XAMPP atau install terpisah)
   - Kalau pakai XAMPP, pastikan PostgreSQL sudah running
   - Default port: 5432
   - Username: `postgres`
   - Password: `Nasigoreng123@` (sesuaikan kalau berbeda)

---

## Langkah-Langkah Instalasi

### 1. Clone Repository

Buka terminal/command prompt, lalu jalankan:

```bash
git clone <url-repository> wdu-cms
cd wdu-cms
```

### 2. Install Dependencies

Ada 3 tempat yang perlu diinstall:

```bash
# Install dependencies root
npm install

# Install dependencies frontend
cd frontend
npm install
cd ..

# Install dependencies backend
cd backend
npm install
cd ..
```

**Atau cukup:**
```bash
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 3. Setup Database

Pastikan PostgreSQL sudah running, lalu jalankan:

```bash
npm run db:setup
```

Ini akan:
- Membuat database `wdu_cms_db` (jika belum ada)
- Sinkronisasi schema Prisma
- Generate Prisma Client

**Kalau ada error "password authentication failed":**
- Cek file `backend/.env` - pastikan password PostgreSQL sesuai
- Jika password berbeda, edit bagian ini:
  ```
  DATABASE_URL="postgresql://postgres:PASSWORD_KAMU@localhost:5432/wdu_cms_db"
  ```

### 4. Buat Akun Admin

```bash
cd backend
npm run db:seed
```

Akan membuat user:
- Email: `admin@wdu.co.id`
- Password: `admin123`

---

## Menjalankan Project

### Cara 1: Jalanin FE dan BE bareng-bareng

```bash
npm run dev
```

Akan muncul dua server:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001/api/v1

### Cara 2: Jalanin分开 (Terpisah)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## Struktur Folder

```
wdu-cms/
├── frontend/              # Aplikasi React (Frontend)
│   ├── src/
│   │   ├── components/   # Komponen UI (Header, Footer, dll)
│   │   ├── pages/        # Halaman website (Home, About, dll)
│   │   ├── admin/        # Halaman admin panel
│   │   ├── store/        # State management (Zustand)
│   │   ├── services/     # API calls (Axios)
│   │   └── router/       # Konfigurasi routing
│   └── package.json
│
├── backend/               # Server Node.js (Backend)
│   ├── src/
│   │   ├── routes/       # API routes (auth, pages, services, dll)
│   │   └── server.ts     # Entry point server
│   ├── prisma/
│   │   ├── schema.prisma # Database schema (tabel-tabel)
│   │   └── seed.ts      # Script buat user admin
│   ├── .env              # Environment variables
│   └── package.json
│
├── .env                  # Root env (kosong, tidak perlu diubah)
├── README.md             # Dokumen ini
└── package.json          # Scripts utama
```

---

## Troubleshooting

### Error: "Cannot find module 'pg'"
```bash
cd backend
npm install pg @types/pg
```

### Error: "database does not exist"
Pastikan PostgreSQL sudah running, lalu:
```bash
npm run db:setup
```

### Error: "Port 5173 already in use"
Ada aplikasi lain pakai port 5173. Tutup aplikasi tersebut atau:
```bash
# Ganti port di frontend/vite.config.ts
```

### Error: "Password authentication failed"
Edit file `backend/.env`, sesuaikan password PostgreSQL:
```
DATABASE_URL="postgresql://postgres:PASSWORD_BENAR@localhost:5432/wdu_cms_db"
```

---

## Useful Commands

```bash
# Install ulang semua dependencies
npm install && cd frontend && npm install && cd ../backend && npm install

# Reset database (hapus semua data!)
cd backend
npx prisma db push --force-reset

# Buka Prisma Studio (visual database)
cd backend
npx prisma studio
```

---

## Catatan Penting

1. **Jangan ubah file `.env`** di root project
2. **Kalau ada error**, coba `npm run db:setup` dulu
3. **Sebelum push ke git**, pastikan tidak commit file `.env`
4. ** Untuk development**, cukup jalanin `npm run dev`

---

## Akun Demo

Setelah instalasi, bisa login di http://localhost:5173/admin/login:

| Field | Value |
|-------|-------|
| Email | admin@wdu.co.id |
| Password | admin123 |

---

## Referensi Tambahan

- **Prisma Docs:** https://www.prisma.io/docs
- **React Docs:** https://react.dev
- **Express Docs:** https://expressjs.com
- **Tailwind CSS:** https://tailwindcss.com

---

Kalau ada yang kurang jelas atau ada error yang tidak tercantum di atas, tanya ke team lead atau senior developer.