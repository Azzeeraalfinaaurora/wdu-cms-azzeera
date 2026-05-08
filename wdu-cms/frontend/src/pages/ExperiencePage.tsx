import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import api from '../utils/api';

interface Project {
    id: string;
    title: string;
    client: string;
    year: string;
    imageUrl: string;
}

const ExperiencePage: React.FC = () => {
    const [cms, setCms] = useState<Record<string, string>>({});
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeYear, setActiveYear] = useState("2024");
    const get = (key: string, fallback: string) => cms[key] || fallback;

    const FALLBACK_DATA: Record<string, {src: string, alt: string}[]> = {
        "2024": [
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png", alt: "BPK" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-square-150x150.png", alt: "BPOM" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-square-150x150.png", alt: "BKPM" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-150x150.png", alt: "Kominfo" }
        ],
        "2023": [
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-300x300.png", alt: "Paljaya" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-150x150.png", alt: "Kominfo" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png", alt: "BPK" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/stm-yogya-square-150x150.png", alt: "STM Yogya" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/transpakuan-square-resized-150x150.png", alt: "Transpakuan" }
        ],
        "2022": [
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/bumn-square-150x150.png", alt: "BUMN" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-150x150.png", alt: "Kominfo" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/jakarta-square-150x150.png", alt: "DKI Jakarta" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/kpk-square-150x150.png", alt: "KPK" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png", alt: "BPK" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-square-150x150.png", alt: "BKPM" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/perpusnas-square-150x150.png", alt: "Perpusnas" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/blora-square-150x150.png", alt: "Blora" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/injiniring-square-150x150.png", alt: "Injiniring" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/pakuan-jaya-square-150x150.png", alt: "Pakuan Jaya" }
        ],
        "2021": [
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-square-150x150.png", alt: "BPOM" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png", alt: "BPK" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/kpk-square-150x150.png", alt: "KPK" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/kemendes-square-150x150.png", alt: "Kemendes" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/pakuan-jaya-square-150x150.png", alt: "Pakuan Jaya" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-square-150x150.png", alt: "BKPM" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-150x150.png", alt: "Kominfo" }
        ],
        "2020": [
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png", alt: "BPK" },
            { src: "https://wahanadata.co.id/wp-content/uploads/2025/01/kemendes-square-150x150.png", alt: "Kemendes" }
        ]
    };

    useEffect(() => {
        api.get('/pages/pengalaman').then(res => setCms(res.data?.sections || {})).catch(() => {});
        api.get('/projects').then(res => setProjects(res.data)).catch(() => {});
    }, []);

    const groupedData = projects.length > 0 
        ? projects.reduce((acc, p) => {
            if (!acc[p.year]) acc[p.year] = [];
            acc[p.year].push({ src: p.imageUrl, alt: p.client || p.title });
            return acc;
          }, {} as Record<string, {src: string, alt: string}[]>)
        : FALLBACK_DATA;

    const years = Object.keys(groupedData).sort((a, b) => parseInt(b) - parseInt(a));

    useEffect(() => {
        if (years.length > 0 && !years.includes(activeYear)) {
            setActiveYear(years[0]);
        }
    }, [years, activeYear]);

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

    return (

        <div className="bg-surface text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
            <main>
                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center overflow-hidden text-white">
                    <div className="absolute inset-0 z-0">
                        <img alt="Meeting" className="w-full h-full object-cover" src={get('hero_image', 'https://wahanadata.co.id/wp-content/uploads/2025/01/1384bbe7-3362-446d-b989-77114335e7ea-scaled.jpg')}></img>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/50 to-transparent"></div>
                    </div>
                    <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
                        <span className="label-md inline-block mb-4 text-emerald-100 font-bold tracking-[0.2em] uppercase reveal-down">{get('hero_subtitle', 'Intelligence • Strategy • Growth')}</span>
                        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1] reveal-left">{get('hero_title', 'The Authority in Data Consulting.')}</h1>
                        <div 
                            className="text-lg md:text-xl text-white/90 leading-relaxed font-light mb-10 max-w-xl reveal-left delay-200 space-y-4"
                            dangerouslySetInnerHTML={{ __html: get('hero_body', 'Wahana Data Utama memberikan solusi strategis berbasis data untuk masa depan bisnis Anda yang berkelanjutan dan terukur.') }}
                        />
                    </div>
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-white/50">
                        <span className="text-xs uppercase tracking-widest mb-2 font-semibold">Scroll</span>
                        <span className="material-symbols-outlined">expand_more</span>
                    </div>
                </section>

                <section className="py-16 bg-gray-50" id="experience">
                    <div className="max-w-7xl mx-auto px-8">

                        {/* Title */}
                        <div className="text-center max-w-3xl mx-auto mb-8">
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                                {get('experience_title', 'Collaboration Experience')}
                            </h2>
                            <p className="text-lg text-gray-600">
                                {get('experience_subtitle', 'Perjalanan kolaborasi kami bersama berbagai institusi terpercaya.')}
                            </p>
                        </div>

                        {/* YEAR TABS */}
                        <div className="flex justify-center gap-2 mb-12 flex-wrap">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => setActiveYear(year)}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeYear === year
                                        ? "bg-emerald-600 text-white shadow-md"
                                        : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
                                        }`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>

                        {/* LOGO GRID */}
                        <div className="flex justify-center min-h-[150px]">
                            <div className="flex flex-wrap justify-center items-center gap-12 reveal-up">
                                {(groupedData[activeYear] || []).map((logo, i) => (
                                    <div key={i} className="group relative">
                                        <img
                                            src={logo.src}
                                            alt={logo.alt}
                                            className="h-20 md:h-24 object-contain transition-all duration-500"
                                        />
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap font-bold uppercase tracking-widest">
                                            {logo.alt}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>
                {/* Commitment Section (Refined) */}
                <section className="w-full bg-white overflow-hidden">

                    <div className="relative w-full grid md:grid-cols-2 items-center">

                        {/* TEXT */}
                        <div className="max-w-7xl mx-auto px-4 md:px-8 z-10 pr-0 md:pr-16">
                            <div 
                                className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium space-y-4"
                                dangerouslySetInnerHTML={{ __html: get('commitment_body', 'Dengan komitmen yang kuat terhadap inovasi dan keakuratan data, Wahana Data Utama siap menjadi mitra terpercaya bagi bisnis dan organisasi dalam mengambil keputusan berbasis informasi. Di era digital yang semakin kompleks, kami terus berinovasi dengan teknologi terkini untuk menghadirkan solusi yang relevan, akurat, dan berdampak nyata.') }}
                            />
                        </div>

                        {/* IMAGE FIX */}
                        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex justify-end">

                            <div className="relative w-[120%] md:w-[140%] h-full">

                                <img
                                    src="https://wahanadata.co.id/wp-content/uploads/2025/01/34695135-c70d-4d76-92d5-10c39eb5390f.jpg"
                                    alt="Team"
                                    className="h-full w-auto object-contain grayscale"
                                />

                                {/* gradient blur kiri */}
                                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/60 to-white"></div>

                            </div>

                        </div>

                    </div>
                </section>
            </main>


            <Footer />
        </div>
    );
};

export default ExperiencePage;
