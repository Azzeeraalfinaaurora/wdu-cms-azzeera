#!/bin/bash
# Script untuk setup boilerplate WDU CMS

mkdir wdu-cms && cd wdu-cms
mkdir backend frontend

# --- BACKEND SETUP ---
cd backend
npm init -y
npm install express cors dotenv prisma @prisma/client multer cloudinary
npm install -D typescript @types/node @types/express @types/cors @types/multer ts-node-dev
npx tsc --init

mkdir -p src/controllers src/routes src/middleware src/config src/types prisma
touch src/app.ts .env prisma/schema.prisma

# --- FRONTEND SETUP ---
cd ../
npx create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir

# --- FINALIZE ---
echo "Struktur folder WDU CMS telah dibuat."