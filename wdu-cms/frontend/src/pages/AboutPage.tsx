import { useState, useEffect } from 'react';

import Footer from '../components/Footer';
import api from '../utils/api';

const AboutPage = () => {
  const [cms, setCms] = useState<Record<string, string>>({});
  const [siteConfig, setSiteConfig] = useState<Record<string, string>>({});

  useEffect(() => {
    const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true';
    
    if (isPreview) {
      const previewData = sessionStorage.getItem('preview_tentang-kami');
      if (previewData) {
        try {
          const parsed = JSON.parse(previewData);
          setCms(parsed);
          // Still fetch config as it's separate
        } catch (e) {
          console.error('Error parsing preview data', e);
        }
      } else {
        api.get('/pages/tentang-kami')
          .then(res => setCms(res.data?.sections || {}))
          .catch(() => {});
      }
    } else {
      api.get('/pages/tentang-kami')
        .then(res => setCms(res.data?.sections || {}))
        .catch(() => {});
    }

    api.get('/config')
      .then(res => {
        const map = res.data.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
        setSiteConfig(map);
      })
      .catch(() => {});
  }, []);

  const get = (key: string, fallback: string) => cms[key] || fallback;

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-down");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("active"); });
    }, { threshold: 0.1 });
    reveals.forEach(reveal => observer.observe(reveal));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-background text-on-surface font-body antialiased">
      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover" alt="Background" src={get('hero_image', 'https://wahanadata.co.id/wp-content/uploads/2025/01/feac7c05-7818-4564-951d-893e14f37bfe-scaled.jpg')} />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/60 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 reveal-up [&>p]:m-0">
            <span dangerouslySetInnerHTML={{ __html: get('hero_title', 'Your Data Is Our Business') }} />
          </h1>
          <div 
            className="text-lg md:text-xl text-emerald-50/80 font-body mb-10 max-w-2xl mx-auto opacity-90 reveal-up delay-200 space-y-4"
            dangerouslySetInnerHTML={{ __html: get('hero_subtitle', 'Transforming complex information into strategic intelligence. Experience the future of research and analytical excellence.') }} 
          />
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-white/50">
          <span className="text-xs uppercase tracking-widest mb-2 font-semibold">Scroll</span>
          <span className="material-symbols-outlined">expand_more</span>
        </div>
      </header>

      {/* Tentang Kami Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-screen-2xl mx-auto px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative reveal-left">
            <div className="absolute -top-6 -right-6 w-full h-full bg-emerald-500/10 rounded-xl z-0"></div>
            <img className="relative z-10 w-full object-cover rounded-xl shadow-2xl" alt="Kantor Wahana Data Utama" src={get('about_image', 'https://sis.wahanadata.co.id/img/wdu-building.jpg')} />
          </div>
          <div className="space-y-6 reveal-right">
            <h2 className="text-4xl font-bold text-on-surface tracking-tight">{get('about_title', 'Tentang Kami')}</h2>
            <div 
              className="text-on-surface-variant text-base leading-relaxed font-body text-justify space-y-4"
              dangerouslySetInnerHTML={{ __html: get('about_body', 'Wahana Data Utama didirikan pada tahun 2006, telah tumbuh menjadi perusahaan terkemuka dalam penyediaan layanan riset dan data di Indonesia dengan visi "Data Is Our Business" kami berkomitmen untuk menjadi pelopor dalam solusi data berbasis penelitian dengan memanfaatkan teknologi terkini, seperti analitik big data, pelaksanaan survei, dan Internet of Things (IoT), guna memberikan layanan yang relevan dan berdaya saing global di era revolusi Industri 5.0.') }}
            />
            {siteConfig.company_profile_pdf && (
               <div className="pt-6">
                 <a 
                   href={siteConfig.company_profile_pdf}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all"
                 >
                   <span className="material-symbols-outlined">download</span>
                   Download Company Profile
                 </a>
               </div>
            )}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-emerald-900">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #bceddf 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="relative z-10 max-w-screen-xl mx-auto px-12 text-center reveal-up">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 tracking-tight">
            "{get('tagline', 'Data Is Our Business')}"
          </h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto mb-8"></div>
          <div 
            className="text-emerald-50 text-lg md:text-xl font-body max-w-3xl mx-auto italic opacity-90 space-y-4"
            dangerouslySetInnerHTML={{ __html: get('tagline_body', 'Komitmen kami adalah memberikan nilai tambah melalui setiap bit informasi yang kami kelola, memastikan akurasi dan kerahasiaan tetap menjadi prioritas utama.') }}
          />
        </div>
      </section>

      {/* Garda Terdepan Section */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-12">
          <h3 className="text-3xl font-bold text-on-surface leading-tight mb-6 reveal-left">{get('innovation_title', 'Garda Terdepan Inovasi')}</h3>
          <div className="reveal-right">
            <div 
              className="text-on-surface-variant text-base leading-relaxed font-body text-justify space-y-4"
              dangerouslySetInnerHTML={{ __html: get('innovation_body', 'Didirikan oleh para profesional berpengalaman dengan spesialisasi lebih dari satu dekade, kami membangun fondasi perusahaan yang kokoh dalam setiap aspek operasional. Di tahun 2025, kami terus berkomitmen untuk menjadi mitra terpercaya yang menghadirkan inovasi dan perubahan signifikan dalam ekosistem data-driven yang berorientasi pada masa depan.') }}
            />
          </div>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section className="py-24 bg-white" id="visi-misi">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20 reveal-up">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Visi &amp; Misi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="relative bg-slate-50 p-12 pt-16 rounded-[2.5rem] border border-slate-100 transition-all duration-500 reveal-left">
              <span className="absolute -top-5 left-10 bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-sm font-black tracking-[0.2em] shadow-xl shadow-emerald-600/30">VISI</span>
              <div 
                className="text-lg md:text-xl font-semibold text-slate-700 leading-relaxed [&>p]:m-0"
                dangerouslySetInnerHTML={{ __html: get('visi', 'Menjadi perusahaan penyedia data riset dan survei global yang terpercaya') }}
              />
            </div>
            <div className="relative bg-slate-50 p-12 pt-16 rounded-[2.5rem] border border-slate-100 transition-all duration-500 reveal-right delay-200">
              <span className="absolute -top-5 left-10 bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-sm font-black tracking-[0.2em] shadow-xl shadow-emerald-600/30">MISI</span>
              <div 
                className="text-lg md:text-xl font-semibold text-slate-700 leading-relaxed whitespace-pre-line space-y-4"
                dangerouslySetInnerHTML={{ __html: get('misi', '• Melakukan riset dan survei berbasis kaidah ilmiah\n• Menghasilkan data yang akurat, presisi, dan reliable\n• Mengelola kegiatan secara profesional dan sistematis\n• Mengembangkan inovasi dan solusi berbasis data') }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 bg-surface-container-low overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-4 reveal-up">{get('team_title', 'Jajaran Direksi')}</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto font-body">{get('team_subtitle', 'Dipimpin oleh para ahli yang berkomitmen pada integritas dan keunggulan dalam pengelolaan data strategis.')}</p>
          </div>
          <div className="flex flex-col md:flex-row items-end justify-center gap-0 mb-20">
            <div className="relative group flex-1 flex justify-center md:mb-0 mb-8">
              <img alt={get('dir1_name', 'Dr. Ir. Erfiani, M.Si')} className="w-full max-w-sm md:max-w-md lg:max-w-lg object-contain transition-transform duration-500 group-hover:-translate-y-2" src={get('dir1_image', 'https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_bu-erfi_scaled-768x631.png')} />
            </div>
            <div className="relative group flex-1 flex justify-center md:translate-y-12">
              <img alt={get('dir2_name', 'Ir. Yudi A. Idrus')} className="w-full max-w-sm md:max-w-md lg:max-w-lg object-contain transition-transform duration-500 group-hover:-translate-y-2" src={get('dir2_image', 'https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_pak-yudi-only-768x631.png')} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="group relative">
              <img alt={get('dir3_name', 'M. Adlan Fadillah, S.E')} className="w-full object-contain transition-transform duration-500 group-hover:-translate-y-2" src={get('dir3_image', 'https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_pak-adlan_fixed-1024x735.png')} />
            </div>
            <div className="group relative">
              <img alt={get('dir4_name', 'M. Hafiz Abdillah, S.T')} className="w-full object-contain transition-transform duration-500 group-hover:-translate-y-2" src={get('dir4_image', 'https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_bu-hafiz_fixed-1024x735.png')} />
            </div>
            <div className="group relative">
              <img alt={get('dir5_name', 'Nurul Athia R, S.Bns')} className="w-full object-contain transition-transform duration-500 group-hover:-translate-y-2" src={get('dir5_image', 'https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_mba-nia_fixed-1024x735.png')} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
