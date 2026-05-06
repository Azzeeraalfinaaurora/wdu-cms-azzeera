import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Footer: React.FC = () => {
  const [config, setConfig] = useState<Record<string, string>>({
    company_email: 'wahanadata@yahoo.com',
    company_phone: '(0251) 755 2099',
    site_footer_copyright: '© 2026 PT. Wahana Data Utama. All rights reserved.',
    youtube_url: 'https://www.youtube.com/@wahanadatautama9110',
    instagram_url: '#',
    company_profile_pdf: '',
    company_address: 'Blok AE No. 01, Jl. Terapi Raya, RT 03/19, Menteng\nKec. Bogor Barat, Kota Bogor, Jawa Barat 16111'
  });

  useEffect(() => {
    axios.get('/api/v1/config').then(res => {
      const map = res.data.reduce((acc: any, item: any) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      setConfig(prev => ({ ...prev, ...map }));
    }).catch(() => {});
  }, []);

  return (
    <footer className="bg-[#244b2b] py-16 text-white font-['Inter']">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-start">
        <div className="space-y-6 max-w-lg">
          <div className="flex items-center gap-3">
            <img src="https://wahanadata.co.id/img/wdu-putih.png" alt="Wahana Data Utama" className="h-16" />
          </div>
          <div className="text-emerald-50/90 text-base leading-relaxed whitespace-pre-line">
            {config.company_address}
          </div>
          <div className="pt-4 text-emerald-50/70 text-sm">
            {config.site_footer_copyright}
          </div>
        </div>
        <div className="mt-12 md:mt-0 space-y-10 text-right md:text-left">
          <div className="space-y-4">
            <h4 className="text-lg font-bold">Kontak Kami</h4>
            <div className="space-y-1 text-base text-emerald-50/90">
              <p>{config.company_email}</p>
              <p>{config.company_phone}</p>
            </div>
            {config.company_profile_pdf && (
              <a 
                href={config.company_profile_pdf} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Company Profile
              </a>
            )}
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold">Temukan Kami</h4>
            <div className="flex gap-6 justify-end md:justify-start">
              <a 
                className="hover:opacity-80 transition-opacity" 
                href={config.instagram_url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a 
                className="hover:opacity-80 transition-opacity" 
                href={config.youtube_url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186c-.272-1.015-1.07-1.812-2.085-2.085-1.84-.495-9.413-.495-9.413-.495s-7.572 0-9.412.495c-1.017.273-1.814 1.07-2.086 2.085-.496 1.842-.496 5.684-.496 5.684s0 3.842.496 5.684c.272 1.015 1.069 1.812 2.086 2.085 1.84.495 9.412.495 9.412.495s7.573 0 9.413-.495c1.015-.273 1.813-1.07 2.085-2.085.495-1.842.495-5.684.495-5.684s0-3.842-.495-5.684zm-14.498 8.684v-5.74l6.002 2.87-6.002 2.87z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
