
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users:', users);
  const services = await prisma.service.findMany();
  console.log('Services count:', services.length);
  const projects = await prisma.project.findMany();
  console.log('Projects count:', projects.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
