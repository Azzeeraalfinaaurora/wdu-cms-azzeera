[START MASTER INSTRUCTION - FULL AUTOMATED INIT]
Role: Senior Fullstack Architect & DevOps Engineer.
Task: Initialize a Monorepo Project for "Wahana Data Utama (WDU) Custom CMS" with Zero-Config Database Setup.
Environment: Local Development (XAMPP/Postgres Local - NO DOCKER).

1. Project Structure & Monorepo Setup
Root folder: wdu-cms.

package.json root: Konfigurasi workspaces untuk ["apps/*", "packages/*"].

Install concurrently di root untuk menjalankan FE & BE bersamaan.

Buat file .env di root:
DATABASE_URL="postgresql://postgres:Nasigoreng123@@localhost:5432/wdu_cms_db"

2. Automated Database Creation Script
Buat file scripts/init-db.ts di root.

Gunakan library pg (node-postgres).

Logic: Koneksi ke database default postgres, cek apakah wdu_cms_db ada. Jika tidak ada, jalankan CREATE DATABASE wdu_cms_db.

Pastikan skrip ini berjalan otomatis sebelum Prisma melakukan migrasi.

3. Backend Setup (apps/api)
Tech Stack: Node.js 20 LTS, Express.js, TypeScript, Prisma ORM.

Prisma Schema: Implementasikan model data dari WDU Architecture Plan:

User (Admin dengan Role: SUPER_ADMIN, EDITOR).

Page (Statik dengan JSON sections).

Service (Layanan WDU).

Project (Pengalaman/Portfolio).

Media (Cloudinary integration).

ContactMessage (Inbox form kontak).

SiteConfig (Global settings/Company Profile).

Boilerplate: * src/server.ts: Setup Express, Middleware (CORS, Helmet, Morgan), dan koneksi PrismaClient.

Route Health-check: /api/v1/health.

Scripts: * "db:setup": "ts-node ../../scripts/init-db.ts && npx prisma migrate dev --name init".

"dev": "npm run db:setup && nodemon src/server.ts".

4. Frontend Setup (apps/web)
Tech Stack: Vite, React 18, TypeScript, Tailwind CSS.

Dependencies: axios, react-router-dom, zustand, @tiptap/react, lucide-react, react-hook-form, zod.

Boilerplate:

Setup Axios Instance dengan baseURL: http://localhost:3001/api/v1.

Struktur folder src: components, pages, admin, hooks, store, services, router.

Setup React Router:

/ (Home Page template kosong).

/admin/login (Admin Login page template).

Layout Wrapper untuk Public & Admin Panel.

5. Documentation & Shared Package
Shared: Buat packages/shared untuk menyimpan Zod schemas yang akan digunakan oleh Backend (validasi input) dan Frontend (form validation).

README.md: Buat panduan singkat cara menjalankan project ini (cukup npm install dan npm run dev).

6. Execution Step for AI:
Buat semua folder dan file sesuai struktur di atas.

Install semua dependencies di tiap workspace.

Tulis kode schema.prisma selengkap mungkin sesuai dokumen arsitektur WDU.

Tulis skrip init-db.ts dengan benar untuk handling auto-create database.

Constraint: Ikuti konvensi penamaan dan struktur folder monorepo yang rapi. Jangan biarkan user melakukan konfigurasi manual di pgAdmin