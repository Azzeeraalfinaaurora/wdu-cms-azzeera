
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding all 6 services...');
  
  // Clear existing first to avoid duplicates if needed, 
  // but better to just use upsert or deleteMany
  await prisma.service.deleteMany({});

  await prisma.service.createMany({
    data: [
      { title: 'Survei', description: 'Layanan pengumpulan data primer yang akurat dengan metodologi ilmiah untuk kebutuhan riset institusi maupun korporasi.', icon: 'assignment', order: 1, isActive: true },
      { title: 'Event Organizer', description: 'Manajemen acara profesional mulai dari seminar, workshop, hingga peluncuran produk dengan standar eksekusi tinggi.', icon: 'groups', order: 2, isActive: true },
      { title: 'Riset Data', description: 'Eksplorasi data mendalam untuk menemukan pola tersembunyi yang mendukung pengambilan keputusan berbasis bukti.', icon: 'database', order: 3, isActive: true },
      { title: 'Riset Pasar', description: 'Analisis dinamika pasar dan perilaku konsumen untuk memenangkan persaingan di industri Anda.', icon: 'query_stats', order: 4, isActive: true },
      { title: 'Analisis Data', description: 'Pengolahan data statistik kompleks menjadi informasi yang mudah dipahami dan siap ditindaklanjuti.', icon: 'analytics', order: 5, isActive: true },
      { title: 'Konsultasi IT', description: 'Solusi teknologi informasi yang disesuaikan untuk mengoptimalkan efisiensi operasional bisnis Anda.', icon: 'terminal', order: 6, isActive: true }
    ]
  });

  console.log('Seed completed with 6 services!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
