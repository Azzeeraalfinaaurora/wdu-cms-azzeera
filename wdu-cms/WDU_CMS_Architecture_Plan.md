# CMS Architecture Plan — Wahana Data Utama
**Versi:** 1.0  
**Tanggal:** April 2026  
**Dibuat oleh:** Technical Product Manager  
**Status:** Draft — For Internal Review

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Latar Belakang & Motivasi](#2-latar-belakang--motivasi)
3. [Scope & Deliverables](#3-scope--deliverables)
4. [Technical Stack](#4-technical-stack)
5. [System Architecture Overview](#5-system-architecture-overview)
6. [Project Structure](#6-project-structure)
7. [Content Model & Data Schema](#7-content-model--data-schema)
8. [API Routes (Backend)](#8-api-routes-backend)
9. [Frontend Routes (Public & Admin)](#9-frontend-routes-public--admin)
10. [Authentication & Authorization](#10-authentication--authorization)
11. [Admin CMS Panel — Fitur & Modul](#11-admin-cms-panel--fitur--modul)
12. [Development Phases & Timeline](#12-development-phases--timeline)
13. [Deployment & Infrastructure](#13-deployment--infrastructure)
14. [Security Considerations](#14-security-considerations)
15. [Risks & Mitigations](#15-risks--mitigations)
16. [Appendix: Glossary](#16-appendix-glossary)

---

## 1. Executive Summary

Wahana Data Utama (WDU) bermaksud menggantikan platform website berbasis WordPress yang sudah ada dengan sebuah **Custom CMS** yang dibangun secara in-house menggunakan stack **React + Node.js**. Sistem baru ini akan terdiri dari dua bagian utama:

- **Public-facing website** — menampilkan konten perusahaan kepada pengunjung umum (Beranda, Tentang Kami, Layanan, Pengalaman, SIS-WDU, Kontak, dan Download Company Profile).
- **Admin Panel (CMS)** — antarmuka berbasis web yang dilindungi login, digunakan oleh tim internal untuk mengelola seluruh konten tanpa perlu menyentuh kode.

Perpindahan dari WordPress ke custom CMS bertujuan untuk memberikan **fleksibilitas penuh** atas struktur konten, **keamanan yang lebih terkontrol**, **performa yang lebih baik**, serta **kemudahan pengembangan fitur baru** di masa depan — termasuk integrasi dengan sistem SIS-WDU yang dimiliki perusahaan.

**Target selesai MVP:** ±10–12 minggu dari kickoff development.

---

## 2. Latar Belakang & Motivasi

### Kondisi Saat Ini
Website WDU saat ini berjalan di atas WordPress. Meskipun WordPress adalah solusi yang mudah digunakan, sejumlah keterbatasan mulai dirasakan seiring pertumbuhan kebutuhan bisnis:

| Aspek | WordPress (Sekarang) | Custom CMS (Target) |
|---|---|---|
| Fleksibilitas struktur konten | Terbatas pada plugin | Sepenuhnya custom |
| Performa | Bergantung pada plugin & theme | Optimized, SSR/CSR terkontrol |
| Keamanan | Rentan jika plugin outdated | Kontrol penuh atas security |
| Integrasi SIS-WDU | Rumit / tidak native | Native API integration |
| Biaya jangka panjang | Lisensi plugin & hosting khusus | Infrastruktur sendiri, lebih hemat |
| Scalability | Terbatas | Horizontal scalable |

### Keputusan Bisnis
Custom CMS memberikan WDU **kepemilikan penuh** atas platform digital-nya — dari data, desain, hingga alur kerja konten — sejalan dengan posisi WDU sebagai perusahaan berbasis data dan teknologi.

---

## 3. Scope & Deliverables

### In Scope
- Website publik dengan halaman: Beranda, Tentang Kami, Layanan, Pengalaman, SIS-WDU, Kontak, Download Company Profile
- Admin Panel dengan login terproteksi
- Manajemen konten (CRUD) untuk semua halaman
- Upload & manajemen media/file (termasuk Company Profile PDF)
- Form kontak dengan notifikasi email
- REST API backend yang bisa digunakan ulang
- Deployment ke environment production

### Out of Scope (v1.0)
- Integrasi mendalam sistem SIS-WDU (dijadwalkan di v1.1)
- Multi-language support
- E-commerce / payment gateway
- Mobile app

---

## 4. Technical Stack

### Frontend (Public Website + Admin Panel)

| Komponen | Teknologi | Alasan |
|---|---|---|
| UI Framework | **React 18** | Ekosistem luas, tim familiar |
| Routing | **React Router v6** | Standard routing untuk SPA |
| State Management | **Zustand** | Ringan, cocok untuk skala project ini |
| Styling | **Tailwind CSS** | Utility-first, cepat, konsisten |
| Rich Text Editor | **TipTap** | Headless, fleksibel, bebas vendor lock-in |
| HTTP Client | **Axios** | Interceptors untuk auth token |
| Build Tool | **Vite** | Lebih cepat dari CRA, DX yang baik |
| Form Handling | **React Hook Form + Zod** | Validasi ringan dan type-safe |

### Backend

| Komponen | Teknologi | Alasan |
|---|---|---|
| Runtime | **Node.js 20 LTS** | Stabil, long-term support |
| Framework | **Express.js** | Minimalis, fleksibel |
| ORM | **Prisma** | Type-safe, mudah migrasi schema |
| Database | **PostgreSQL** | Relasional, handal untuk production |
| Authentication | **JWT (Access + Refresh Token)** | Stateless, scalable |
| Password Hashing | **bcrypt** | Industri standar |
| File Upload | **Multer + Cloudinary** | Storage file di cloud, URL stabil |
| Email | **Nodemailer** | Untuk notifikasi form kontak |
| Validation | **Zod** | Shared schema antara FE dan BE |
| API Docs | **Swagger (openapi-3)** | Dokumentasi API untuk tim |

### Infrastructure & DevOps

| Komponen | Teknologi |
|---|---|
| Version Control | GitHub (mono-repo atau 2 repo terpisah) |
| CI/CD | GitHub Actions |
| Containerization | Docker + Docker Compose |
| Hosting Backend | Railway / Render / VPS |
| Hosting Frontend | Vercel / Netlify |
| Database Hosting | Supabase (managed PostgreSQL) atau Railway |
| File Storage | Cloudinary (media) |
| Environment Config | `.env` + Doppler (opsional) |

---

## 5. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                             │
└───────────────────┬─────────────────────────────────────────┘
                    │
        ┌───────────▼───────────┐
        │    CDN / Reverse Proxy │  (Cloudflare / Nginx)
        └───────────┬───────────┘
                    │
      ┌─────────────┴──────────────┐
      │                            │
┌─────▼──────┐            ┌────────▼───────┐
│  Frontend   │            │   Admin Panel  │
│  (React)    │            │   (React)      │
│  Vercel /   │            │   Same build / │
│  Netlify    │            │   /admin route │
└─────┬───────┘            └────────┬───────┘
      │                             │
      └──────────────┬──────────────┘
                     │ HTTPS REST API
          ┌──────────▼──────────┐
          │   Backend (Node.js)  │
          │     Express.js       │
          │   Railway / VPS      │
          └──────────┬───────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
  ┌─────▼────┐ ┌────▼───┐ ┌─────▼──────┐
  │PostgreSQL│ │Cloudinary│ │  Email SMTP│
  │(Database)│ │ (Media) │ │(Nodemailer)│
  └──────────┘ └─────────┘ └────────────┘
```

### Arsitektur Pattern
- **Frontend:** Single Page Application (SPA) — React berkomunikasi ke backend via REST API.
- **Backend:** RESTful API — stateless, scalable, mudah di-maintain.
- **Pemisahan concerns:** Public website dan Admin Panel adalah satu React app yang sama, dibedakan oleh routing dan auth guard.

---

## 6. Project Structure

### Repository Structure
Direkomendasikan menggunakan **monorepo** agar lebih mudah berbagi tipe/schema antara FE dan BE.

```
wdu-cms/
├── apps/
│   ├── web/                    # React Frontend (public + admin)
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── pages/          # Halaman publik
│   │   │   ├── admin/          # Semua halaman admin panel
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── store/          # Zustand state management
│   │   │   ├── services/       # Axios API calls
│   │   │   ├── utils/          # Helper functions
│   │   │   └── router/         # React Router config
│   │   ├── public/
│   │   └── vite.config.ts
│   │
│   └── api/                    # Node.js Backend
│       ├── src/
│       │   ├── controllers/    # Request handlers
│       │   ├── routes/         # Express route definitions
│       │   ├── middleware/      # Auth, error handling, upload
│       │   ├── services/       # Business logic
│       │   ├── prisma/         # Schema & migrations
│       │   └── utils/          # Helpers, email templates
│       ├── prisma/
│       │   └── schema.prisma
│       └── server.ts
│
├── packages/
│   └── shared/                 # Shared Zod schemas & types
│       └── src/
│           └── schemas/
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 7. Content Model & Data Schema

Berikut adalah model data utama berdasarkan konten website WDU saat ini.

### 7.1 `User` (Admin)
```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         Role     @default(EDITOR)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum Role {
  SUPER_ADMIN
  EDITOR
}
```

### 7.2 `Page` (Halaman Statis)
```prisma
model Page {
  id          String   @id @default(cuid())
  slug        String   @unique   // e.g. "beranda", "tentang-kami"
  title       String
  metaTitle   String?
  metaDesc    String?
  isPublished Boolean  @default(false)
  sections    Json     // Flexible content blocks
  updatedAt   DateTime @updatedAt
  updatedBy   String?
}
```

### 7.3 `Service` (Layanan)
```prisma
model Service {
  id          String   @id @default(cuid())
  title       String
  description String
  icon        String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 7.4 `Project` (Pengalaman / Portfolio)
```prisma
model Project {
  id          String   @id @default(cuid())
  title       String
  client      String
  category    String
  year        Int
  description String?
  imageUrl    String?
  isHighlight Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}
```

### 7.5 `Media` (File & Gambar)
```prisma
model Media {
  id          String   @id @default(cuid())
  filename    String
  url         String
  mimeType    String
  size        Int
  altText     String?
  uploadedBy  String
  uploadedAt  DateTime @default(now())
}
```

### 7.6 `ContactMessage` (Pesan Kontak)
```prisma
model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String?
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

### 7.7 `SiteConfig` (Konfigurasi Global)
```prisma
model SiteConfig {
  key       String @id   // e.g. "company_profile_url", "phone", "email"
  value     String
  updatedAt DateTime @updatedAt
}
```

---

## 8. API Routes (Backend)

Base URL: `https://api.wdu.co.id/api/v1`

### 8.1 Authentication

| Method | Endpoint | Deskripsi | Auth Required |
|---|---|---|---|
| POST | `/auth/login` | Login admin, return JWT | ❌ |
| POST | `/auth/refresh` | Refresh access token | ✅ (Refresh Token) |
| POST | `/auth/logout` | Invalidate refresh token | ✅ |
| GET | `/auth/me` | Get data user yang login | ✅ |

### 8.2 Pages (Halaman Statis)

| Method | Endpoint | Deskripsi | Auth Required |
|---|---|---|---|
| GET | `/pages` | List semua halaman | ❌ |
| GET | `/pages/:slug` | Get halaman by slug | ❌ |
| PUT | `/pages/:slug` | Update konten halaman | ✅ Admin |
| PATCH | `/pages/:slug/publish` | Toggle publish/unpublish | ✅ Admin |

### 8.3 Services (Layanan)

| Method | Endpoint | Deskripsi | Auth Required |
|---|---|---|---|
| GET | `/services` | List semua layanan aktif | ❌ |
| GET | `/services/:id` | Detail layanan | ❌ |
| POST | `/services` | Tambah layanan baru | ✅ Admin |
| PUT | `/services/:id` | Update layanan | ✅ Admin |
| DELETE | `/services/:id` | Hapus layanan | ✅ Admin |
| PATCH | `/services/reorder` | Update urutan tampil | ✅ Admin |

### 8.4 Projects (Pengalaman)

| Method | Endpoint | Deskripsi | Auth Required |
|---|---|---|---|
| GET | `/projects` | List semua project | ❌ |
| GET | `/projects?highlight=true` | Hanya project highlight | ❌ |
| GET | `/projects/:id` | Detail project | ❌ |
| POST | `/projects` | Tambah project | ✅ Admin |
| PUT | `/projects/:id` | Update project | ✅ Admin |
| DELETE | `/projects/:id` | Hapus project | ✅ Admin |

### 8.5 Media

| Method | Endpoint | Deskripsi | Auth Required |
|---|---|---|---|
| GET | `/media` | List semua media | ✅ Admin |
| POST | `/media/upload` | Upload file (multipart/form-data) | ✅ Admin |
| DELETE | `/media/:id` | Hapus file | ✅ Admin |

### 8.6 Contact

| Method | Endpoint | Deskripsi | Auth Required |
|---|---|---|---|
| POST | `/contact` | Kirim pesan kontak | ❌ |
| GET | `/contact/messages` | List pesan masuk | ✅ Admin |
| PATCH | `/contact/messages/:id/read` | Tandai sudah dibaca | ✅ Admin |
| DELETE | `/contact/messages/:id` | Hapus pesan | ✅ Admin |

### 8.7 Site Config

| Method | Endpoint | Deskripsi | Auth Required |
|---|---|---|---|
| GET | `/config` | Get semua konfigurasi publik | ❌ |
| PUT | `/config/:key` | Update konfigurasi | ✅ Admin |

### 8.8 Users (Admin Management)

| Method | Endpoint | Deskripsi | Auth Required |
|---|---|---|---|
| GET | `/users` | List admin users | ✅ Super Admin |
| POST | `/users` | Tambah admin baru | ✅ Super Admin |
| PUT | `/users/:id` | Update user | ✅ Super Admin |
| DELETE | `/users/:id` | Hapus user | ✅ Super Admin |
| PATCH | `/users/:id/password` | Reset password | ✅ Super Admin |

---

## 9. Frontend Routes (Public & Admin)

### 9.1 Public Routes

| Route | Halaman | Komponen Utama |
|---|---|---|
| `/` | Beranda | Hero, About Snippet, Services Preview, Stats, CTA |
| `/tentang-kami` | Tentang Kami | Company Story, Visi-Misi, Tim, Klien |
| `/layanan` | Layanan | Daftar layanan + deskripsi |
| `/pengalaman` | Pengalaman | Portfolio/project grid |
| `/sis-wdu` | SIS-WDU | Penjelasan & link sistem SIS |
| `/kontak` | Kontak | Form kontak + info alamat + map |
| `/download` | Download | Download Company Profile (PDF) |
| `*` | 404 | Halaman not found |

### 9.2 Admin Routes (Dilindungi Auth Guard)

| Route | Halaman Admin | Fungsi |
|---|---|---|
| `/admin` | Redirect ke `/admin/dashboard` | — |
| `/admin/login` | Login | Form login admin |
| `/admin/dashboard` | Dashboard | Overview: pesan baru, konten terbaru |
| `/admin/pages` | Manajemen Halaman | List semua halaman |
| `/admin/pages/:slug` | Edit Halaman | Rich text editor per halaman |
| `/admin/services` | Manajemen Layanan | CRUD + drag-drop reorder |
| `/admin/services/new` | Tambah Layanan | Form tambah layanan |
| `/admin/services/:id` | Edit Layanan | Form edit layanan |
| `/admin/projects` | Manajemen Pengalaman | CRUD portfolio/project |
| `/admin/projects/new` | Tambah Project | Form tambah project |
| `/admin/projects/:id` | Edit Project | Form edit project |
| `/admin/media` | Media Library | Upload, browse, delete file |
| `/admin/contact` | Pesan Kontak | Inbox pesan dari form kontak |
| `/admin/config` | Pengaturan Situs | Edit info kontak, upload Company Profile |
| `/admin/users` | Manajemen User | CRUD admin user (Super Admin only) |
| `/admin/profile` | Profil Saya | Ganti password, update nama |

---

## 10. Authentication & Authorization

### Flow Authentication

```
[Admin] → POST /auth/login (email + password)
              ↓
    [Backend] verifikasi credential
              ↓
    Return: { accessToken (15 menit), refreshToken (7 hari) }
              ↓
    [Frontend] simpan di memory (access) + httpOnly cookie (refresh)
              ↓
    Setiap request: Authorization: Bearer <accessToken>
              ↓
    Jika expired → otomatis POST /auth/refresh
              ↓
    Jika refresh expired → redirect ke /admin/login
```

### Role-Based Access Control (RBAC)

| Fitur | EDITOR | SUPER_ADMIN |
|---|---|---|
| Edit halaman & konten | ✅ | ✅ |
| Upload media | ✅ | ✅ |
| Kelola layanan & project | ✅ | ✅ |
| Baca pesan kontak | ✅ | ✅ |
| Edit konfigurasi situs | ❌ | ✅ |
| Kelola admin user | ❌ | ✅ |
| Hapus pesan kontak | ❌ | ✅ |

### Security Headers & Best Practices
- Helmet.js untuk HTTP security headers
- CORS dikonfigurasi strict ke domain yang diizinkan
- Rate limiting pada endpoint login (max 5 attempt / 15 menit)
- Refresh token disimpan di httpOnly cookie (tidak bisa diakses JavaScript)
- Input sanitization sebelum masuk ke database (via Zod validation)

---

## 11. Admin CMS Panel — Fitur & Modul

### 11.1 Dashboard
- Ringkasan statistik: jumlah layanan aktif, project, pesan belum dibaca
- Pesan kontak terbaru (3-5 terakhir)
- Quick actions: "Edit Beranda", "Upload Company Profile", "Lihat Pesan"

### 11.2 Page Editor
- Setiap halaman publik dapat diedit melalui editor yang sesuai
- Rich Text Editor (TipTap) untuk konten panjang
- Preview mode sebelum publish
- Toggle publish/draft
- Meta SEO field (title, description)

### 11.3 Media Library
- Grid view semua file terupload
- Upload drag-and-drop
- Filter by type (image, PDF, dll)
- Copy URL langsung
- Khusus Company Profile: ada slot dedicated di halaman Config

### 11.4 Form Kontak Inbox
- Tabel pesan masuk dengan status "Baru" / "Sudah Dibaca"
- Detail pesan: nama, email, nomor, isi pesan, waktu masuk
- Tandai dibaca / hapus

### 11.5 Konfigurasi Situs
- Edit informasi kontak (email, telepon, alamat)
- Upload/ganti file Company Profile (PDF)
- Edit footer copyright text
- Social media links (opsional)

### 11.6 Manajemen User
- Hanya bisa diakses Super Admin
- Tambah, edit, hapus akun admin
- Reset password user

---

## 12. Development Phases & Timeline

### Phase 1 — Foundation (Minggu 1–2)
- Setup repository, environment, CI/CD pipeline
- Setup database PostgreSQL & Prisma schema
- Backend: Auth module (login, JWT, refresh token)
- Frontend: Routing setup, layout dasar public & admin
- Docker Compose untuk local development

### Phase 2 — Backend API (Minggu 3–4)
- Implementasi semua API routes (Pages, Services, Projects, Media, Contact, Config)
- Middleware: auth guard, error handler, rate limiter
- Integration dengan Cloudinary untuk upload media
- Integration Nodemailer untuk form kontak
- Swagger API documentation

### Phase 3 — Admin Panel (Minggu 5–7)
- Login page + auth flow (token storage, interceptor)
- Dashboard
- Page Editor dengan TipTap rich text editor
- CRUD Layanan (dengan drag-drop reorder)
- CRUD Pengalaman / Project
- Media Library
- Inbox Kontak
- Pengaturan Situs & User Management

### Phase 4 — Public Website (Minggu 8–9)
- Halaman Beranda (Hero, About snippet, Services, Stats, CTA)
- Halaman Tentang Kami
- Halaman Layanan
- Halaman Pengalaman / Portfolio
- Halaman SIS-WDU
- Halaman Kontak + Form
- Halaman Download Company Profile
- 404 Page
- SEO: meta tags, Open Graph

### Phase 5 — QA, Polish & Deployment (Minggu 10–12)
- Cross-browser testing
- Responsive testing (mobile/tablet)
- Performance audit (Lighthouse)
- Security review
- Staging deployment & UAT bersama stakeholder
- Production deployment
- Dokumentasi teknis & handover

### Summary Timeline

```
Minggu:    1   2   3   4   5   6   7   8   9   10  11  12
           ├───┤
Phase 1:   ████
Phase 2:           ████████
Phase 3:                   ██████████████
Phase 4:                               ████████
Phase 5:                                       ████████████
```

---

## 13. Deployment & Infrastructure

### Environment
Terdapat 3 environment yang berjalan paralel:

| Environment | Purpose | Domain |
|---|---|---|
| `development` | Local development | `localhost` |
| `staging` | Testing & UAT | `staging.wdu.co.id` |
| `production` | Live website | `wdu.co.id` |

### CI/CD Pipeline (GitHub Actions)

```
Push ke branch `develop` → Build & Test → Deploy ke Staging
Push ke branch `main`    → Build & Test → Deploy ke Production
```

### Environment Variables Utama

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/wdu_cms

# JWT
JWT_SECRET=<random-strong-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=<another-strong-secret>
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
CONTACT_EMAIL_TO=wahanadata@yahoo.com

# App
CLIENT_URL=https://wdu.co.id
NODE_ENV=production
PORT=3001
```

---

## 14. Security Considerations

| Area | Implementasi |
|---|---|
| Auth | JWT + httpOnly cookie untuk refresh token |
| Password | bcrypt hashing (saltRounds: 12) |
| API | CORS strict, Helmet.js headers |
| Input | Zod validation di semua endpoint |
| Upload | Validasi MIME type & ukuran file (max 10MB) |
| Rate Limiting | express-rate-limit di semua endpoint |
| SQL Injection | Prisma ORM — parameterized queries by default |
| XSS | TipTap output di-sanitize sebelum render |
| HTTPS | Wajib di production (via Cloudflare / Let's Encrypt) |
| Secrets | Tidak pernah commit ke Git, gunakan `.env` |

---

## 15. Risks & Mitigations

| Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|
| Scope creep selama development | Sedang | Tinggi | Lock scope di Phase 1, fitur baru masuk backlog v1.1 |
| Tim tidak familiar dengan stack baru | Sedang | Sedang | Workshop internal + pair programming di awal |
| Konten migrasi dari WordPress memakan waktu | Tinggi | Sedang | Lakukan content audit + migrasi manual secara paralel |
| Keterlambatan UAT dari stakeholder | Tinggi | Tinggi | Set deadline UAT di awal, sediakan test script |
| Keamanan endpoint bocor | Rendah | Tinggi | Security review sebelum production deploy |
| Downtime saat go-live | Rendah | Tinggi | Blue-green deployment atau maintenance window yang dikomunikasikan |

---

## 16. Appendix: Glossary

| Istilah | Penjelasan |
|---|---|
| **CMS** | Content Management System — sistem pengelolaan konten |
| **REST API** | Antarmuka komunikasi antara frontend dan backend berbasis HTTP |
| **JWT** | JSON Web Token — format token untuk autentikasi stateless |
| **SPA** | Single Page Application — aplikasi web yang berjalan di satu halaman HTML |
| **ORM** | Object-Relational Mapper — layer abstraksi database (Prisma) |
| **CRUD** | Create, Read, Update, Delete — operasi dasar data |
| **UAT** | User Acceptance Testing — pengujian oleh pengguna akhir |
| **CI/CD** | Continuous Integration / Continuous Deployment — otomasi build dan deploy |
| **RBAC** | Role-Based Access Control — kontrol akses berdasarkan peran pengguna |
| **httpOnly Cookie** | Cookie yang tidak bisa diakses oleh JavaScript, lebih aman untuk token |
| **Monorepo** | Satu repository yang menampung beberapa project/package sekaligus |
| **SIS-WDU** | Sistem Informasi internal Wahana Data Utama |

---

## 17. Contoh Struktur API (JSON)

Berikut adalah contoh payload untuk beberapa endpoint utama.

### 17.1 Services (Layanan)
**POST** `/api/v1/services`
```json
{
  "title": "Analisis Data",
  "description": "Transformasi raw data menjadi aset strategis...",
  "icon": "analytics",
  "isActive": true
}
```

**Response (200 OK)**
```json
{
  "id": "clv123abc...",
  "title": "Analisis Data",
  "description": "Transformasi raw data menjadi aset strategis...",
  "icon": "analytics",
  "isActive": true,
  "order": 1,
  "createdAt": "2026-04-28T10:00:00Z"
}
```

### 17.2 Projects (Pengalaman)
**PUT** `/api/v1/projects/:id`
```json
{
  "title": "Sistem Informasi Geografis",
  "client": "Kementerian PUPR",
  "category": "IT Solution",
  "year": 2024,
  "description": "Pengembangan peta digital interaktif...",
  "imageUrl": "https://cloudinary.com/v123/map.jpg",
  "isHighlight": true
}
```

### 17.3 Contact Message
**POST** `/api/v1/contact`
```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "message": "Halo, saya tertarik dengan layanan riset pasar Anda."
}
```

---

## 18. Flow Operasional Admin

Sistem dirancang dengan alur kerja yang intuitif untuk meminimalkan kurva pembelajaran.

### 18.1 Auth Flow
1. **Login:** User memasukkan email/password → Backend validasi → Set HTTP-Only Cookie (Refresh Token) & Memory Token (Access Token).
2. **Persistence:** Saat page refresh, Frontend hit `/auth/me` menggunakan interceptor untuk memulihkan session.
3. **Guard:** Setiap route `/admin/*` (kecuali `/admin/login`) dibungkus oleh `ProtectedRoute` component.

### 18.2 Content Management Flow (CRUD)
1. **List View:** Menampilkan tabel atau grid data dengan ringkasan informasi.
2. **Create/Edit:** Membuka modal atau side-panel (untuk experience yang lebih seamless) berisi form validasi.
3. **Reordering:** Drag-and-drop pada list (Layanan) untuk mengatur urutan tampilan di website publik.
4. **Deletion:** Memerlukan konfirmasi manual (`window.confirm` atau custom modal) untuk mencegah penghapusan tidak sengaja.

---

## 19. Validasi & Error Handling

### 19.1 Validasi Sisi Server (Zod)
Semua data masuk divalidasi menggunakan skema Zod sebelum diproses oleh Prisma.
- **ServiceSchema:** Title min 3 char, description wajib.
- **ProjectSchema:** Year harus integer, imageUrl harus valid URL/path.
- **UserSchema:** Email valid, password minimal 8 karakter.

### 19.2 Global Error Handler
Backend memiliki middleware sentral untuk menangkap error:
- **400 Bad Request:** Validasi gagal.
- **401 Unauthorized:** Token tidak ada atau expired.
- **403 Forbidden:** Role tidak mencukupi (misal EDITOR akses User Management).
- **404 Not Found:** Resource tidak ditemukan.
- **500 Internal Server Error:** Kegagalan sistem atau database.

---

## 20. Best Practice Security

1. **Password Security:** Menggunakan `bcrypt` dengan 12 salt rounds. Password asli tidak pernah disimpan.
2. **JWT Security:**
   - Access Token: Umur pendek (15 menit).
   - Refresh Token: Disimpan di `httpOnly` cookie (Secure & SameSite: Strict).
3. **Media Upload:**
   - File dibatasi maksimal 10MB.
   - Hanya mengizinkan MIME types tertentu (image/png, image/jpeg, application/pdf).
   - File disimpan di Cloudinary, hanya URL yang disimpan di database.
4. **API Protection:**
   - CORS diatur agar hanya menerima request dari domain website WDU.
   - Helmet.js diaktifkan untuk menyembunyikan header identitas server.

---

## 21. Detail UI Admin (Layout & Interaksi)

UI Admin dibangun dengan prinsip **Modern Minimalist & High Visibility**.

### 21.1 Layout Dashboard
- **Sidebar (Left):** Navigasi utama dengan ikon yang jelas (Dashboard, Halaman, Layanan, Pengalaman, Media, Pesan, Pengaturan).
- **Header (Top):** Menampilkan breadcrumb navigasi dan menu profil user (Logout).
- **Content Area:** Area utama dengan background netral (Light Gray / Dark Zinc) agar konten menonjol.

### 21.2 Halaman Services (Layanan)
- **Visual:** Menggunakan **Card Layout** (3 kolom di desktop).
- **Card Content:** Ikon besar di kiri/atas, judul tebal, deskripsi singkat (line-clamp).
- **Interaksi:**
  - **Hover:** Card sedikit terangkat (translate-y) dan memunculkan tombol aksi (Edit, Hapus).
  - **Click Edit:** Membuka Modal Form dengan input real-time validation.
  - **Status Badge:** Indikator hijau untuk "Aktif" dan abu-abu untuk "Non-aktif".

### 21.3 Halaman Collaboration / Projects
- **Visual:** Tabel list untuk pengelolaan masal, atau Grid untuk preview gambar.
- **Feature:** Filter berdasarkan tahun untuk memudahkan pencarian project lama.
- **Image Preview:** Hover pada baris tabel akan menampilkan thumbnail gambar project.

### 21.4 Interaksi User
- **Klik:** Respons instan dengan feedback visual (loading state pada tombol).
- **Hover:** Perubahan warna/opacity pada elemen interaktif untuk menandakan "clickable".
- **Delete:** Warning modal dengan warna merah mencolok untuk konfirmasi destruktif.
- **Toasts:** Notifikasi mengambang di pojok kanan bawah setelah berhasil Simpan/Hapus.

---

**© 2026 Wahana Data Utama — Confidential Internal Document**
