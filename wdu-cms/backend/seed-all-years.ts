
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding projects with correct URLs for Admin...');
  
  await prisma.project.deleteMany({});

  const projects = [
    // 2024
    { title: "BPK", client: "BPK", category: "Audit & Data", year: 2024, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png" },
    { title: "BPOM", client: "BPOM", category: "System Integration", year: 2024, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-square-150x150.png" },
    { title: "BKPM", client: "BKPM", category: "Web Development", year: 2024, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-square-150x150.png" },
    { title: "Kominfo", client: "Kominfo", category: "Research", year: 2024, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-150x150.png" },

    // 2023
    { title: "Paljaya", client: "Paljaya", category: "Data Analysis", year: 2023, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-300x300.png" },
    { title: "Kominfo", client: "Kominfo", category: "Infrastructure", year: 2023, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-150x150.png" },
    { title: "BPK", client: "BPK", category: "Analytics", year: 2023, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png" },
    { title: "STM Yogya", client: "STM Yogya", category: "Education", year: 2023, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/stm-yogya-square-150x150.png" },
    { title: "Transpakuan", client: "Transpakuan", category: "Logistics", year: 2023, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/transpakuan-square-resized-150x150.png" },

    // 2022
    { title: "BUMN", client: "BUMN", category: "Government", year: 2022, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bumn-square-150x150.png" },
    { title: "Kominfo", client: "Kominfo", category: "Digital", year: 2022, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-150x150.png" },
    { title: "DKI Jakarta", client: "Jakarta", category: "Regional", year: 2022, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/jakarta-square-150x150.png" },
    { title: "KPK", client: "KPK", category: "Legal", year: 2022, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/kpk-square-150x150.png" },
    { title: "BPK", client: "BPK", category: "Audit", year: 2022, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png" },
    { title: "BKPM", client: "BKPM", category: "Investment", year: 2022, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-square-150x150.png" },
    { title: "Perpusnas", client: "Perpusnas", category: "Culture", year: 2022, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/perpusnas-square-150x150.png" },
    { title: "Blora", client: "Blora", category: "Regional", year: 2022, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/blora-square-150x150.png" },
    { title: "Injiniring", client: "Injiniring", category: "Service", year: 2022, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/injiniring-square-150x150.png" },
    { title: "Pakuan Jaya", client: "Pakuan Jaya", category: "Regional", year: 2022, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/pakuan-jaya-square-150x150.png" },

    // 2021
    { title: "BPOM", client: "BPOM", category: "Health", year: 2021, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-square-150x150.png" },
    { title: "BPK", client: "BPK", category: "Audit", year: 2021, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png" },
    { title: "KPK", client: "KPK", category: "Legal", year: 2021, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/kpk-square-150x150.png" },
    { title: "Kemendes", client: "Kemendes", category: "Government", year: 2021, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/kemendes-square-150x150.png" },
    { title: "Pakuan Jaya", client: "Pakuan Jaya", category: "Regional", year: 2021, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/pakuan-jaya-square-150x150.png" },
    { title: "BKPM", client: "BKPM", category: "Investment", year: 2021, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-square-150x150.png" },
    { title: "Kominfo", client: "Kominfo", category: "Infrastructure", year: 2021, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-150x150.png" },

    // 2020
    { title: "BPK", client: "BPK", category: "Audit", year: 2020, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png" },
    { title: "Kemendes", client: "Kemendes", category: "Government", year: 2020, imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/kemendes-square-150x150.png" }
  ];

  await prisma.project.createMany({
    data: projects.map((p, i) => ({ ...p, isActive: true, order: i + 1 }))
  });

  console.log('Admin projects seeded successfully with correct images!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
