import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash('123456', 10);
  const editorHash = await bcrypt.hash('123456', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@wdu.co.id' },
    update: { 
      passwordHash: adminHash,
      name: 'Super Admin',
      role: 'SUPER_ADMIN'
    },
    create: {
      email: 'admin@wdu.co.id',
      name: 'Super Admin',
      passwordHash: adminHash,
      role: 'SUPER_ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'editor@wdu.co.id' },
    update: { 
      passwordHash: editorHash,
      name: 'Editor Content',
      role: 'EDITOR'
    },
    create: {
      email: 'editor@wdu.co.id',
      name: 'Editor Content',
      passwordHash: editorHash,
      role: 'EDITOR',
    },
  });

  console.log('Admin user created: admin@wdu.co.id / 123456');
  console.log('Editor user created: editor@wdu.co.id / 123456');

  const defaultConfigs = [
    { key: 'site_name', value: 'PT. Wahana Data Utama' },
    { key: 'site_tagline', value: 'Data Terpadu, Solusi Cerdas, Hasil Maksimal' },
    { key: 'company_email', value: 'wahanadata@yahoo.com' },
    { key: 'company_phone', value: '(0251) 755 2099' },
    { key: 'youtube_url', value: 'https://www.youtube.com/@wahanadatautama9110' },
    { key: 'instagram_url', value: 'https://www.instagram.com/wahanadatautama' },
    { key: 'site_footer_copyright', value: '© 2026 PT. Wahana Data Utama. All rights reserved.' },
    { key: 'company_profile_pdf', value: '' },
  ];

  for (const config of defaultConfigs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }
  console.log('Default site configurations seeded.');
  const initialPages = [
    {
      slug: 'home',
      title: 'Beranda',
      sections: {
        hero_title: 'Data Terpadu, Solusi Cerdas, Hasil Maksimal',
        hero_subtitle: 'Kami menghadirkan ekosistem data yang transformatif untuk mendorong pertumbuhan bisnis Anda melalui integrasi teknologi mutakhir dan analisis mendalam.',
        hero_image: 'https://wahanadata.co.id/wp-content/uploads/2025/01/a3f30e87-3b43-418b-b4ba-4529ed4e895a.jpg',
        services_title: 'Solusi terbaik untuk Anda!',
        services_subtitle: 'Kami merancang layanan yang adaptif untuk tantangan industri digital saat ini.',
        about_title: 'Memiliki pengalaman yang luas serta didukung oleh tim profesional yang kompeten.',
        about_body: 'Wahana Data Utama didirikan pada 2006 merupakan perusahaan riset dan survei yang berfokus pada bidang sosial-politik, ekonomi, pemasaran, pertanian, dan lainnya. Dengan visi menjadi penyedia data riset global, WDU didukung oleh tim profesional berpengalaman lebih dari 10 tahun. Berkantor di Bogor, kami telah memperoleh kepercayaan dari berbagai instansi pemerintah dan swasta untuk menangani berbagai proyek konsultasi, mulai dari riset hingga event organizing.',
        director_name: 'Ir. Yudi A. Idrus, M.M',
        director_title: 'Direktur Utama',
        clients_title: 'Kepercayaan klien terhadap kami',
        clients_subtitle: 'Kami bangga menjadi bagian dari kesuksesan berbagai institusi pemerintah dan swasta.',
        gallery_title: 'Galeri Kami',
      },
      isPublished: true,
    },
    {
      slug: 'tentang-kami',
      title: 'Tentang Kami',
      sections: {
        hero_title: 'Your Data Is Our Business',
        hero_subtitle: 'Transforming complex information into strategic intelligence. Experience the future of research and analytical excellence.',
        hero_image: 'https://wahanadata.co.id/wp-content/uploads/2025/01/feac7c05-7818-4564-951d-893e14f37bfe-scaled.jpg',
        about_title: 'Tentang Kami',
        about_body: 'Wahana Data Utama didirikan pada tahun 2006, telah tumbuh menjadi perusahaan terkemuka dalam penyediaan layanan riset dan data di Indonesia dengan visi "Data Is Our Business" kami berkomitmen untuk menjadi pelopor dalam solusi data berbasis penelitian dengan memanfaatkan teknologi terkini, seperti analitik big data, pelaksanaan survei, dan Internet of Things (IoT), guna memberikan layanan yang relevan dan berdaya saing global di era revolusi Industri 5.0.',
        about_image: 'https://sis.wahanadata.co.id/img/wdu-building.jpg',
        tagline: 'Data Is Our Business',
        tagline_body: 'Komitmen kami adalah memberikan nilai tambah melalui setiap bit informasi yang kami kelola, memastikan akurasi dan kerahasiaan tetap menjadi prioritas utama.',
        innovation_title: 'Garda Terdepan Inovasi',
        innovation_body: 'Didirikan oleh para profesional berpengalaman dengan spesialisasi lebih dari satu dekade, kami membangun fondasi perusahaan yang kokoh dalam setiap aspek operasional. Di tahun 2025, kami terus berkomitmen untuk menjadi mitra terpercaya yang menghadirkan inovasi dan perubahan signifikan dalam ekosistem data-driven yang berorientasi pada masa depan.',
        visi: 'Menjadi perusahaan penyedia data riset dan survei global yang terpercaya',
        misi: '• Melakukan riset dan survei berbasis kaidah ilmiah\n• Menghasilkan data yang akurat, presisi, dan reliable\n• Mengelola kegiatan secara profesional dan sistematis\n• Mengembangkan inovasi dan solusi berbasis data',
        team_title: 'Jajaran Direksi',
        team_subtitle: 'Dipimpin oleh para ahli yang berkomitmen pada integritas dan keunggulan dalam pengelolaan data strategis.',
        dir1_name: 'Dr. Ir. Erfiani, M.Si',
        dir1_image: 'https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_bu-erfi_scaled-768x631.png',
        dir2_name: 'Ir. Yudi A. Idrus',
        dir2_image: 'https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_pak-yudi-only-768x631.png',
        dir3_name: 'M. Adlan Fadillah, S.E',
        dir3_image: 'https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_pak-adlan_fixed-1024x735.png',
        dir4_name: 'M. Hafiz Abdillah, S.T',
        dir4_image: 'https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_bu-hafiz_fixed-1024x735.png',
        dir5_name: 'Nurul Athia R, S.Bns',
        dir5_image: 'https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_mba-nia_fixed-1024x735.png',
      },
      isPublished: true,
    },
    {
      slug: 'layanan',
      title: 'Layanan',
      sections: {
        hero_title: 'Solusi Data Terpadu Untuk Bisnis Anda',
        hero_subtitle: 'Membantu transformasi digital melalui riset mendalam, analisis akurat, dan konsultasi IT yang strategis.',
        hero_image: 'https://sis.wahanadata.co.id/img/wdu-building.jpg',
        cta_text: 'Mulai Sekarang',
        intro_title: 'Jelajahi beragam solusi terbaik dengan menggunakan layanan kami!',
        intro_body: 'Kami menyediakan ekosistem layanan komprehensif yang dirancang untuk menjawab tantangan data modern. Dari pengumpulan data primer hingga implementasi sistem informasi yang kompleks, Wahana Data Utama hadir sebagai mitra strategis pertumbuhan Anda.',
        intro_image: 'https://wahanadata.co.id/wp-content/uploads/2025/01/433319d2-e1de-4c4f-9a80-b83df6470507-scaled.jpg',
      },
      isPublished: true,
    },
    {
      slug: 'pengalaman',
      title: 'Pengalaman',
      sections: {
        hero_title: 'The Authority in Data Consulting.',
        hero_subtitle: 'Intelligence • Strategy • Growth',
        hero_body: 'Wahana Data Utama memberikan solusi strategis berbasis data untuk masa depan bisnis Anda yang berkelanjutan dan terukur.',
        hero_image: 'https://wahanadata.co.id/wp-content/uploads/2025/01/1384bbe7-3362-446d-b989-77114335e7ea-scaled.jpg',
        experience_title: 'Collaboration Experience',
        experience_subtitle: 'Perjalanan kolaborasi kami bersama berbagai institusi terpercaya.',
        commitment_body: 'Dengan komitmen yang kuat terhadap inovasi dan keakuratan data, Wahana Data Utama siap menjadi mitra terpercaya bagi bisnis dan organisasi dalam mengambil keputusan berbasis informasi. Di era digital yang semakin kompleks, kami terus berinovasi dengan teknologi terkini untuk menghadirkan solusi yang relevan, akurat, dan berdampak nyata.',
      },
      isPublished: true,
    },
  ];

  for (const page of initialPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {
        sections: page.sections,
        title: page.title,
        isPublished: page.isPublished,
      },
      create: page,
    });
  }
  console.log('Initial pages updated and seeded.');

  // Seed initial clients
  const initialClients = [
    { id: "client_001", name: "Kemenristek", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenristek-qzsnlzlsyfc92mg5p6yvgcx2qwi0cty76bhd99vev0.png" },
    { id: "client_002", name: "KemenkopUKM", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenkopukm-qzsnlxq4kr9ofeiw065mbde5k4r9xfqqi26eapy77g.png" },
    { id: "client_003", name: "Kemendesa", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemendesa-qzsnlxq4kr9ofeiw065mbde5k4r9xfqqi26eapy77g.png" },
    { id: "client_004", name: "DKI Jakarta", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/jakarta-qzsnlwsadx8e3sk95nqzqvmoyqvwpqn05xiwtfzldo.png" },
    { id: "client_005", name: "PUPR", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/pupr-qzsnm58u3fjz0a7ys9emvbhub7q7n0kl73ea4xn1to.png" },
    { id: "client_006", name: "ESDM", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/esdm-qzsnluwm095tgkmzgmxqlw3rrz56acfjho7xuw2dq4.png" },
    { id: "client_007", name: "Kemenperin", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenperin-qzsnlynyrlayr0hiuok8vv5m5imn54ugu6tvrzwt18.png" },
    { id: "client_008", name: "BUMN", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bumn-qzsn7zsb786k7mrzf56ubw20cdh9r2e2l1t40ymfi4.png" },
    { id: "client_009", name: "BPS", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bps-qzsmwqnvdmrz7p4g4s2mz8acbay2liprdcmu6pb3zw.png" },
    { id: "client_010", name: "BPOM", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bpom-qzsmvfnxvwzn370pr7raik5am1dpwnj6iw0k6v8sn0.png" },
    { id: "client_011", name: "BKPM", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bkpm-qzsmr5ier34m758mrd4h5n1p6uhiuaj79p0xhhlczg.png" },
    { id: "client_012", name: "Bank Indonesia", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bank-indonesia-qzsmr4kkk93bvj9zwupul5a8lgm5mlfgxkdg07mr5o.png" },
    { id: "client_013", name: "BPK", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bpk-qzsmdae3y25cy7dmpvdkvmzxr8tmb0hqd2m3nk5erg.png" },
    { id: "client_014", name: "Bangka Selatan", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bangka-selatan-1-qzsmd5owzvyxc5kghbcg166msbgs8iz2ofco96cdmk.png" },
    { id: "client_015", name: "Komdigi", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/komdigi-qzsnm1hhc3etpudfe7s4lcfzxo8qs85nuksc7tsmik.png" },
    { id: "client_016", name: "OJK", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/ojk-qzsnm4azwliooo9bxr00atqdptuufbguuyqsnnofzw.png" },
    { id: "client_017", name: "KPK", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kpk-qzsnm3d5prhed2ap38ldqbyx4fzh7md4iu3b6dpu64.png" },
    { id: "client_018", name: "Kota Bogor", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kota-bogor-qzsnm2fbixg41gc28q6r5u7gj243zx9e6pftp3r8cc.png" },
    { id: "client_019", name: "KLH", logoUrl: "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/klh-qzsnm0jn59dje8esjpdi0uojcaddkj1xig4uqju0os.png" },
  ];

  for (const client of initialClients) {
    await prisma.client.upsert({
      where: { id: client.id },
      update: { name: client.name, logoUrl: client.logoUrl, order: parseInt(client.id.split('_')[1]) },
      create: { ...client, order: parseInt(client.id.split('_')[1]) },
    });
  }
  console.log('Initial clients seeded.');

  // Seed initial gallery
  const initialGalleries = [
    { id: "gal_001", title: "Kantor WDU", description: "Kantor pusat Wahana Data Utama di Bogor", imageUrl: "https://sis.wahanadata.co.id/img/wdu-building.jpg", category: "Kantor", order: 1, isActive: true },
    { id: "gal_002", title: "Tim Survei Lapangan", description: "Tim profesional WDU saat melakukan survei", imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/a3f30e87-3b43-418b-b4ba-4529ed4e895a.jpg", category: "Event", order: 2, isActive: true },
    { id: "gal_003", title: "Seminar Data 2025", description: "Kegiatan seminar dan workshop data", imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/1384bbe7-3362-446d-b989-77114335e7ea-scaled.jpg", category: "Event", order: 3, isActive: true },
    { id: "gal_004", title: "Rapat Direksi", description: "Rapat koordinasi jajaran direksi", imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/feac7c05-7818-4564-951d-893e14f37bfe-scaled.jpg", category: "Kantor", order: 4, isActive: true },
    { id: "gal_005", title: "Direktur Utama", description: "Ir. Yudi A. Idrus, M.M", imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_pak-yudi-only-768x631.png", category: "Kantor", order: 5, isActive: true },
    { id: "gal_006", title: "Direktur", description: "Dr. Ir. Erfiani, M.Si", imageUrl: "https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_bu-erfi_scaled-768x631.png", category: "Kantor", order: 6, isActive: true },
  ];

  for (const gallery of initialGalleries) {
    await prisma.gallery.upsert({
      where: { id: gallery.id },
      update: gallery,
      create: gallery,
    });
  }
  console.log('Initial gallery items seeded.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());