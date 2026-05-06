# Database Migration Guide

## Cara Melakukan Migration

### 1. Setup Awal (First Time)

```bash
npm run db:setup
```

Script ini akan:
- Membuat database `wdu_cms_db` jika belum ada
- Menjalankan semua migration yang diperlukan
- Generate Prisma Client

### 2. Melihat Status Schema

```bash
cd backend
npx prisma studio
```

Buka http://localhost:5555 untuk melihat data.

### 3. Membuat Perubahan Schema

Jika ada perubahan pada `backend/prisma/schema.prisma`:

```bash
# Sync perubahan ke database (tanpa create migration)
cd backend
npx prisma db push

# Generate ulang Prisma Client
npx prisma generate
```

### 4. Reset Database (Development Only)

⚠️ **Peringatan**: Ini akan menghapus semua data!

```bash
cd backend
npx prisma db push --force-reset
```

### 5. Seed Data

Untuk membuat admin user pertama:

```bash
cd backend
npm run db:seed
```

## Struktur File

```
backend/
├── prisma/
│   ├── schema.prisma    # Schema definition
│   ├── seed.ts          # Seed script
│   └── migrations/      # (auto-generated jika perlu)
├── .env                 # Database config
└── init-db.ts           # Auto-create database script
```

## Troubleshooting

### "database does not exist"
Jalankan `npm run db:setup` untuk membuat database.

### Error koneksi PostgreSQL
Pastikan PostgreSQL sudah running dan credential di `backend/.env` benar.

### Schema tidak sync
```bash
cd backend
npx prisma db push
npx prisma generate
```