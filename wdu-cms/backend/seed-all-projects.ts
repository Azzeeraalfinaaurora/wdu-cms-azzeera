
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding all sample projects...');
  
  await prisma.project.deleteMany({});

  await prisma.project.createMany({
    data: [
      { title: 'BPK RI - Data Management', client: 'BPK', category: 'Audit & Data', year: 2024, description: 'Kolaborasi manajemen data untuk kebutuhan audit nasional.', imageUrl: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png', isActive: true, order: 1 },
      { title: 'BPOM - Digitalization System', client: 'BPOM', category: 'System Integration', year: 2024, description: 'Pengembangan sistem digitalisasi untuk pengawasan obat dan makanan.', imageUrl: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-square-150x150.png', isActive: true, order: 2 },
      { title: 'BKPM - Investment Portal', client: 'BKPM', category: 'Web Development', year: 2024, description: 'Pembangunan portal investasi terpadu.', imageUrl: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-square-150x150.png', isActive: true, order: 3 },
      { title: 'Kominfo - Connectivity Research', client: 'Kominfo', category: 'Research', year: 2024, description: 'Riset konektivitas digital di wilayah Indonesia.', imageUrl: 'https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-150x150.png', isActive: true, order: 4 },
      { title: 'Paljaya - Operational Data', client: 'Paljaya', category: 'Data Analysis', year: 2023, description: 'Analisis data operasional pengolahan limbah.', imageUrl: 'https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-300x300.png', isActive: true, order: 5 },
      { title: 'Kominfo - Infrastructure Audit', client: 'Kominfo', category: 'Infrastructure', year: 2023, description: 'Audit infrastruktur digital nasional.', imageUrl: 'https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-150x150.png', isActive: true, order: 6 },
      { title: 'BPK - Financial Analytics', client: 'BPK', category: 'Analytics', year: 2023, description: 'Pengembangan tools analitik keuangan.', imageUrl: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png', isActive: true, order: 7 }
    ]
  });

  console.log('Project seed completed!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
