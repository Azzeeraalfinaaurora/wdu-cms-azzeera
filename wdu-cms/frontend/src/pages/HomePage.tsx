import { useRef, useEffect, useState, useMemo } from 'react';
import Footer from '../components/Footer';
import api from '../utils/api';
import { Client } from '../services/client';
import { galleryService, Gallery } from '../services/gallery';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  isActive: boolean;
}

const HomePage = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const gallerySliderRef = useRef<HTMLDivElement>(null);
  const servicesSliderRef = useRef<HTMLDivElement>(null);
  const galleryInitialized = useRef(false);
  const servicesInitialized = useRef(false);
  const [pageContent, setPageContent] = useState<Record<string, string>>({});
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  // Fetch CMS content for home page
  useEffect(() => {
    api.get('/pages/home')
      .then((res: any) => {
        const sections = res.data?.sections || {};
        setPageContent(sections);
      })
      .catch(() => {
        // silently fall back to hardcoded defaults
      });

    api.get('/services')
      .then((res: any) => {
        setServices(res.data.filter((s: Service) => s.isActive));
      })
      .catch(() => {});

    // Fetch active clients
    api.get('/clients')
      .then((res: any) => {
        setClients(res.data);
      })
      .catch(() => {});

    // Fetch active gallery items
    galleryService.getAll(true)
      .then((res: any) => {
        setGalleries(prev => {
          if (JSON.stringify(prev) === JSON.stringify(res.data)) return prev;
          return res.data;
        });
      })
      .catch(() => {});
  }, []);

  // Helper: get CMS value or fallback
  const cms = (key: string, fallback: string) => pageContent[key] || fallback;

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      // Start in the middle set for seamless initial loop
      slider.scrollLeft = slider.scrollWidth / 3;

      const interval = setInterval(() => {
        handleNext();
      }, 4000); // Auto-scroll every 4 seconds

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (gallerySliderRef.current && galleries.length > 0 && !galleryInitialized.current) {
      gallerySliderRef.current.scrollLeft = gallerySliderRef.current.scrollWidth / 3;
      galleryInitialized.current = true;
      setCurrentGalleryIndex(0);
    }
  }, [galleries]);

  useEffect(() => {
    if (servicesSliderRef.current && services.length > 0 && !servicesInitialized.current) {
      servicesSliderRef.current.scrollLeft = servicesSliderRef.current.scrollWidth / 3;
      servicesInitialized.current = true;
    }
  }, [services]);

  const scrollGallery = (direction: 'left' | 'right') => {
    if (gallerySliderRef.current) {
      const slider = gallerySliderRef.current;
      const containerWidth = slider.clientWidth;
      const originalWidth = slider.scrollWidth / 3;
      const scrollAmount = window.innerWidth < 768 ? containerWidth : containerWidth / 3 + 8; // items per view
      
      const itemsPerView = window.innerWidth < 768 ? 1 : 3;
      const totalOriginalItems = galleries.length;
      const maxIndex = Math.ceil(totalOriginalItems / itemsPerView) - 1;

      if (direction === 'right') {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        setCurrentGalleryIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
        
        setTimeout(() => {
          if (slider.scrollLeft >= originalWidth * 2 - scrollAmount) {
            slider.scrollTo({ left: slider.scrollLeft - originalWidth, behavior: 'auto' });
          }
        }, 350);
      } else {
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        setCurrentGalleryIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
        
        setTimeout(() => {
          if (slider.scrollLeft <= originalWidth / 3) {
            slider.scrollTo({ left: slider.scrollLeft + originalWidth, behavior: 'auto' });
          }
        }, 350);
      }
    }
  };

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-down");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(reveal => observer.observe(reveal));
    return () => observer.disconnect();
  }, []);

  const handleNext = () => {
    const slider = sliderRef.current;
    if (slider) {
      const itemWidth = slider.querySelector('div')?.clientWidth || 300;
      const gap = 24; // gap-6 is 24px
      const totalScroll = itemWidth + gap;

      slider.scrollBy({ left: totalScroll, behavior: 'smooth' });

      // Check if we nearing the end of the second set, jump back to first
      setTimeout(() => {
        if (!slider) return;
        if (slider.scrollLeft >= (slider.scrollWidth * 2) / 3) {
          slider.scrollTo({ left: slider.scrollWidth / 3, behavior: 'auto' });
        }
      }, 500);
    }
  };

  const handlePrev = () => {
    const slider = sliderRef.current;
    if (slider) {
      const itemWidth = slider.querySelector('div')?.clientWidth || 300;
      const gap = 24;
      const totalScroll = itemWidth + gap;

      slider.scrollBy({ left: -totalScroll, behavior: 'smooth' });

      setTimeout(() => {
        if (!slider) return;
        if (slider.scrollLeft <= slider.scrollWidth / 3 - totalScroll) {
          slider.scrollTo({ left: (slider.scrollWidth * 2) / 3 - totalScroll, behavior: 'auto' });
        }
      }, 500);
    }
  };

  const FALLBACK_SERVICES = [
      { icon: 'lightbulb', title: 'IT Consultation', description: 'Strategi teknologi yang selaras dengan visi bisnis Anda untuk efisiensi maksimal.' },
      { icon: 'analytics', title: 'Data Analysis', description: 'Mengolah data mentah menjadi wawasan berharga untuk pengambilan keputusan yang presisi.' },
      { icon: 'developer_mode', title: 'Application Development', description: 'Pengembangan solusi perangkat lunak kustom yang dirancang khusus untuk bisnis Anda.' },
      { icon: 'calendar_today', title: 'Event Organizer', description: 'Kami dengan senang hati siap membantu mewujudkan acara impian Anda. Percayakan setiap detail kepada kami.' },
      { icon: 'fact_check', title: 'Survei', description: 'Dapatkan wawasan berharga melalui survei yang dirancang khusus untuk memberi bisnis Anda keunggulan.' },
      { icon: 'insights', title: 'Riset Pasar', description: 'Jelajahi peluang baru dan pahami tren pasar dengan riset pasar yang membantu bisnis Anda tetap di depan.' }
    ];

  const displayServices = services.length > 0 ? services : FALLBACK_SERVICES;

  const scrollServices = (direction: 'left' | 'right') => {
    if (servicesSliderRef.current) {
      const slider = servicesSliderRef.current;
      const card = slider.querySelector('div');
      const cardWidth = card?.clientWidth || 420;
      const gap = 32;
      const scrollAmount = cardWidth + gap;
      const originalWidth = slider.scrollWidth / 3;

      if (direction === 'left') {
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        setTimeout(() => {
          if (slider.scrollLeft <= 0) {
            slider.scrollLeft += originalWidth;
          }
        }, 350);
      } else {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        setTimeout(() => {
          if (slider.scrollLeft >= originalWidth * 2 - scrollAmount) {
            slider.scrollLeft -= originalWidth;
          }
        }, 350);
      }
    }
  };


  return (
    <div className="bg-white text-on-surface selection:bg-emerald-100 selection:text-emerald-900 antialiased">
      {/* 1. Hero Section */}
      <header className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Professional corporate meeting"
            className="w-full h-full object-cover"
            src={cms('hero_image', 'https://wahanadata.co.id/wp-content/uploads/2025/01/a3f30e87-3b43-418b-b4ba-4529ed4e895a.jpg')}
          />
          <div className="absolute inset-0 bg-emerald-950/70"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="w-full">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight reveal-left [&>p]:m-0">
              {pageContent['hero_title'] ? (
                <span dangerouslySetInnerHTML={{ __html: pageContent['hero_title'] }} />
              ) : (
                <>Data Terpadu, Solusi Cerdas, <span className="text-emerald-400">Hasil Maksimal</span></>
              )}
            </h1>
            <div 
              className="text-lg md:text-xl text-emerald-50/80 mb-10 leading-relaxed font-body reveal-left delay-200 space-y-4"
              dangerouslySetInnerHTML={{ __html: cms('hero_subtitle', 'Kami menghadirkan ekosistem data yang transformatif untuk mendorong pertumbuhan bisnis Anda melalui integrasi teknologi mutakhir dan analisis mendalam.') }}
            />
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-white/50">
          <span className="text-xs uppercase tracking-widest mb-2 font-semibold">Scroll</span>
          <span className="material-symbols-outlined">expand_more</span>
        </div>
      </header>
      {/* 2. Services Section */}
      <section className="py-32 bg-slate-50" id="services">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div className="max-w-2xl reveal-left">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                {cms('services_title', 'Solusi terbaik untuk Anda!')}
              </h2>
              <p className="text-lg text-slate-600 font-medium">{cms('services_subtitle', 'Kami merancang layanan yang adaptif untuk tantangan industri digital saat ini.')}</p>
            </div>
          </div>
          <div className="relative group px-4">
            <button
              className="absolute top-1/2 -left-6 md:-left-10 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-emerald-500/20 text-emerald-600 flex items-center justify-center transition-all shadow-md hover:bg-emerald-600 hover:text-white z-20 hover:scale-110 active:scale-95"
              onClick={() => scrollServices('left')}
              title="Previous"
            >
              <span className="material-symbols-outlined pointer-events-none">chevron_left</span>
            </button>
            
            <div
              ref={servicesSliderRef}
              className="flex gap-8 overflow-x-auto hide-scrollbar pb-12 px-2"
              id="services-slider"
            >
              {[...displayServices, ...displayServices, ...displayServices].map((service, i) => (
                <div
                  key={i}
                  className="min-w-[32%] md:min-w-[31%] snap-start bg-white border border-slate-100 p-12 rounded-[3rem] transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/10 flex flex-col items-center text-center relative overflow-hidden group/card reveal-up"
                  style={{ transitionDelay: `${(i % 3) * 100}ms` }}
                >
                  <div className="absolute -bottom-10 -right-10 opacity-5 group-hover/card:opacity-10 transition-opacity pointer-events-none">
                     {(service.icon?.startsWith('http') || service.icon?.startsWith('/')) ? (
                        <img src={service.icon} alt="" className="w-48 h-48 object-contain grayscale" />
                     ) : (
                        <span className="material-symbols-outlined text-[180px] text-emerald-500">
                          {service.icon || 'analytics'}
                        </span>
                     )}
                  </div>

                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 rounded-[1.5rem] flex items-center justify-center mb-8 text-emerald-600 transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 shadow-inner">
                    {(service.icon?.startsWith('http') || service.icon?.startsWith('/')) ? (
                       <img src={service.icon} alt={service.title} className="w-10 h-10 object-contain" />
                    ) : (
                       <span className="material-symbols-outlined text-[42px] font-light">
                         {service.icon || 'analytics'}
                       </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                    {service.title}
                  </h3>
                  <div className="w-12 h-[3px] bg-emerald-500 rounded-full mb-8 opacity-40"></div>
                  <p className="text-slate-600 leading-[1.8] text-[17px] font-medium px-4">
                    {('description' in service) ? service.description : (service as any).desc}
                  </p>
                </div>
              ))}
            </div>

            <button
              className="absolute top-1/2 -right-6 md:-right-10 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-emerald-500/20 text-emerald-600 flex items-center justify-center transition-all shadow-md hover:bg-emerald-600 hover:text-white z-20 hover:scale-110 active:scale-95"
              onClick={() => scrollServices('right')}
              title="Next"
            >
              <span className="material-symbols-outlined pointer-events-none">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
      {/* 3. About Us/Leadership Section */}
      <section className="max-w-7xl mx-auto px-8 py-32 relative overflow-hidden" id="about">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="rounded-xl shadow-lg">
            <img alt="Direktur Utama" className="w-full rounded-xl" src="https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_pak-yudi-only-768x631.png" />
          </div>
          <div className="flex flex-col space-y-6">
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface leading-tight tracking-tight [&>p]:m-0">
              {pageContent['about_title'] ? (
                <span dangerouslySetInnerHTML={{ __html: pageContent['about_title'] }} />
              ) : (
                'Memiliki pengalaman yang luas serta didukung oleh tim profesional yang kompeten.'
              )}
            </h2>
            <div 
              className="text-on-surface-variant leading-relaxed text-lg space-y-4"
              dangerouslySetInnerHTML={{ __html: cms('about_body', 'Wahana Data Utama didirikan pada 2006 merupakan perusahaan riset dan survei yang berfokus pada bidang sosial-politik, ekonomi, pemasaran, pertanian, dan lainnya. Dengan visi menjadi penyedia data riset global, WDU didukung oleh tim profesional berpengalaman lebih dari 10 tahun. Berkantor di Bogor, kami telah memperoleh kepercayaan dari berbagai instansi pemerintah dan swasta untuk menangani berbagai proyek konsultasi, mulai dari riset hingga event organizing.') }}
            />
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xl text-emerald-600">{cms('director_name', 'Ir. Yudi A. Idrus, M.M')}</span>
              <span className="text-sm font-label uppercase tracking-widest text-on-surface-variant/70">{cms('director_title', 'Direktur Utama')}</span>
            </div>
          </div>
        </div>
      </section>
      {/* 4. Clients Section */}
      <section className="relative py-32 overflow-hidden" id="experience">
        <div className="absolute inset-0 z-0">
          <img alt="Professional corporate meeting background" className="w-full h-full object-cover" src="https://wahanadata.co.id/wp-content/uploads/2025/01/1384bbe7-3362-446d-b989-77114335e7ea-scaled.jpg" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-md"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 reveal-up">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              {cms('clients_title', 'Kepercayaan klien terhadap kami')}
            </h2>
            <p className="text-lg text-emerald-50/80">{cms('clients_subtitle', 'Kami bangga menjadi bagian dari kesuksesan berbagai institusi pemerintah dan swasta.')}</p>
          </div>
              <div className="relative group reveal-up delay-200">
                <div
                  ref={sliderRef}
                  className="flex overflow-x-auto hide-scrollbar gap-6 pb-4 px-20"
                  id="client-slider"
                >
                {[...clients, ...clients, ...clients].map((client, index) => (
                  <div key={index} className="flex-none w-1/2 md:w-1/4 lg:w-1/4 flex items-center justify-center h-32 p-4">
                    <img
                      alt={client.name}
                      className="max-h-20 w-full object-contain"
                      src={client.logoUrl}
                    />
                  </div>
                ))}
              </div>
            <button className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white transition-all shadow-xl custom-arrow z-20 hover:bg-white/40" onClick={handlePrev}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white transition-all shadow-xl custom-arrow z-20 hover:bg-white/40" onClick={handleNext}>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
      {/* 5. Gallery Section */}
      <section className="py-32 bg-white" id="gallery">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20 reveal-up">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
              {cms('gallery_title', 'Potret Kegiatan dan Kolaborasi Kami')}
            </h2>
          </div>
          
          <div className="relative group">
            <button
              onClick={() => scrollGallery('left')}
              className="absolute top-1/2 -left-6 md:-left-12 -translate-y-1/2 w-14 h-14 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-800 transition-all shadow-xl z-20 hover:scale-110 active:scale-95"
            >
              <span className="material-symbols-outlined text-2xl">chevron_left</span>
            </button>

            <div
              ref={gallerySliderRef}
              id="gallery-slider"
              className="flex overflow-x-auto hide-scrollbar gap-6 pb-12 snap-x snap-mandatory"
            >
              {galleries.length > 0 ? (
                [...galleries, ...galleries, ...galleries].map((item, index) => (
                  <div 
                    key={index} 
                    className="flex-none w-full md:w-[calc(33.333%-16px)] snap-start"
                  >
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-slate-100 group/item">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-20 w-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <span className="material-symbols-outlined text-5xl mb-4 block">image_not_supported</span>
                  Belum ada gambar di galeri. Silakan atur di CMS.
                </div>
              )}
            </div>

            <button
              onClick={() => scrollGallery('right')}
              className="absolute top-1/2 -right-6 md:-right-12 -translate-y-1/2 w-14 h-14 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-800 transition-all shadow-xl z-20 hover:scale-110 active:scale-95"
            >
              <span className="material-symbols-outlined text-2xl">chevron_right</span>
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-3 mt-4">
            {galleries.length > 0 && Array.from({ length: Math.ceil(galleries.length / (window.innerWidth < 768 ? 1 : 3)) }).map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentGalleryIndex ? 'bg-emerald-600 w-8' : 'bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  if (gallerySliderRef.current) {
                    const slider = gallerySliderRef.current;
                    const containerWidth = slider.clientWidth;
                    const itemsPerView = window.innerWidth < 768 ? 1 : 3;
                    const originalWidth = slider.scrollWidth / 3;
                    const targetScroll = (slider.scrollWidth / 3) + (i * containerWidth);
                    
                    slider.scrollTo({ left: targetScroll, behavior: 'smooth' });
                    setCurrentGalleryIndex(i);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
