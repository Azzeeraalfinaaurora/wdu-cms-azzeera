import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  const pages = await prisma.page.findMany();
  console.log('Pages in DB:', JSON.stringify(pages, null, 2));
  process.exit(0);
}
check();
