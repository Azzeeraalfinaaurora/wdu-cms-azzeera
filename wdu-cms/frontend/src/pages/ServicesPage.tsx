import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '../utils/api';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  isActive: boolean;
}

const ServicesPage = () => {
  const [cms, setCms] = useState<Record<string, string>>({});
  const [services, setServices] = useState<Service[]>([]);

  const FALLBACK_SERVICES = [
    { icon: 'assignment', title: 'Survei', desc: 'Layanan pengumpulan data primer yang akurat dengan metodologi ilmiah untuk kebutuhan riset institusi maupun korporasi.' },
    { icon: 'groups', title: 'Event Organizer', desc: 'Manajemen acara profesional mulai dari seminar, workshop, hingga peluncuran produk dengan standar eksekusi tinggi.' },
    { icon: 'database', title: 'Riset Data', desc: 'Eksplorasi data mendalam untuk menemukan pola tersembunyi yang mendukung pengambilan keputusan berbasis bukti.' },
    { icon: 'query_stats', title: 'Riset Pasar', desc: 'Analisis dinamika pasar dan perilaku konsumen untuk memenangkan persaingan di industri Anda.' },
    { icon: 'analytics', title: 'Analisis Data', desc: 'Pengolahan data statistik kompleks menjadi informasi yang mudah dipahami dan siap ditindaklanjuti.' },
    { icon: 'terminal', title: 'Konsultasi IT', desc: 'Solusi teknologi informasi yang disesuaikan untuk mengoptimalkan efisiensi operasional bisnis Anda.' }
  ];

  useEffect(() => {
    api.get('/pages/layanan').then(res => setCms(res.data?.sections || {})).catch(() => {});
    api.get('/services').then(res => setServices(res.data.filter((s: Service) => s.isActive))).catch(() => {});
  }, []);

  const get = (key: string, fallback: string) => cms[key] || fallback;

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-down");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("active"); });
    }, { threshold: 0.1 });
    reveals.forEach(reveal => observer.observe(reveal));
    return () => observer.disconnect();
  }, [services]);

  const displayServices = services.length > 0 ? services : FALLBACK_SERVICES;

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-emerald-100 selection:text-emerald-900 antialiased overflow-x-hidden">
      <header className="relative py-24 md:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10 reveal-left">
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.05] tracking-tighter mb-8 [&>p]:m-0">
              <span dangerouslySetInnerHTML={{ __html: get('hero_title', 'Solusi Data Terpadu') }} />
            </h1>
            <div 
              className="text-xl text-slate-600 mb-10 leading-relaxed font-medium space-y-4"
              dangerouslySetInnerHTML={{ __html: get('hero_subtitle', 'Membantu transformasi digital melalui riset mendalam, analisis akurat, dan konsultasi IT yang strategis.') }}
            />
            <div className="flex gap-4">
              <Link className="bg-[linear-gradient(135deg,#06402b_0%,#10b981_100%)] text-white px-10 py-5 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl active:scale-95 inline-block" to="/kontak">
                {get('cta_text', 'Mulai Sekarang')}
              </Link>
            </div>
          </div>
          <div className="relative reveal-right">
            <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <img className="relative w-full h-[600px] object-cover rounded-[3rem] shadow-2xl z-10" alt="Professional Analytics" src={get('hero_image', 'https://sis.wahanadata.co.id/img/wdu-building.jpg')} />
          </div>
        </div>
      </header>

      {/* Section 2: Intro */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="md:w-1/3 reveal-left">
              <span className="font-bold text-emerald-600 tracking-[0.3em] uppercase text-xs block mb-6">Layanan Kami</span>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight [&>p]:m-0">
                <span dangerouslySetInnerHTML={{ __html: get('intro_title', 'Jelajahi beragam solusi terbaik!') }} />
              </h2>
            </div>
            <div className="md:w-2/3 reveal-right space-y-10">
              <div 
                className="text-2xl text-slate-600 leading-relaxed font-medium space-y-4"
                dangerouslySetInnerHTML={{ __html: get('intro_body', 'Kami menyediakan ekosistem layanan komprehensif yang dirancang untuk menjawab tantangan data modern.') }}
              />
              <div className="pt-4">
                <img className="w-full h-[480px] object-cover object-center rounded-[2rem] shadow-xl transition-transform duration-700 hover:scale-[1.01]" alt="Collaboration" src={get('intro_image', 'https://wahanadata.co.id/wp-content/uploads/2025/01/433319d2-e1de-4c4f-9a80-b83df6470507-scaled.jpg')} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayServices.map((service, i) => (
              <div
                key={i}
                className="group p-12 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 reveal-up relative overflow-hidden"
                style={{ transitionDelay: `${(i % 3) * 100}ms` }}
              >
                <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                   {(service.icon?.startsWith('http') || service.icon?.startsWith('/')) ? (
                      <img src={service.icon} alt="" className="w-48 h-48 object-contain grayscale" />
                   ) : (
                      <span className="material-symbols-outlined text-[180px] text-emerald-500">
                        {service.icon || 'analytics'}
                      </span>
                   )}
                </div>

                <div className="w-20 h-20 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mb-10 text-emerald-600 transition-all group-hover:bg-emerald-600 group-hover:text-white shadow-inner">
                  {(service.icon?.startsWith('http') || service.icon?.startsWith('/')) ? (
                     <img src={service.icon} alt={service.title} className="w-10 h-10 object-contain group-hover:brightness-0 group-hover:invert" />
                  ) : (
                     <span className="material-symbols-outlined text-[42px] font-light">
                       {service.icon || 'analytics'}
                     </span>
                  )}
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium text-lg">
                  {('description' in service) ? service.description : (service as any).desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
