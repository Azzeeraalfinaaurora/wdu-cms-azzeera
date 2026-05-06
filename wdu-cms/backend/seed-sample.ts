
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding sample data...');
  
  await prisma.service.createMany({
    data: [
      { title: 'Riset Pasar', description: 'Analisis pasar mendalam.', icon: 'query_stats', order: 1, isActive: true },
      { title: 'IT Consulting', description: 'Solusi IT strategis.', icon: 'terminal', order: 2, isActive: true },
      { title: 'Event Organizer', description: 'Manajemen acara profesional.', icon: 'groups', order: 3, isActive: true }
    ]
  });

  await prisma.project.createMany({
    data: [
      { title: 'Web CMS WDU', client: 'Internal', category: 'Software Development', year: 2024, description: 'Sistem manajemen konten.', imageUrl: 'https://wahanadata.co.id/img/wdu-ijo.png', isActive: true },
      { title: 'Survei Kepuasan', client: 'PT Maju Jaya', category: 'Research', year: 2023, description: 'Riset kepuasan pelanggan.', imageUrl: null, isActive: true }
    ]
  });

  console.log('Seed completed!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
