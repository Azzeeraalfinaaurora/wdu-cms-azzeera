import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profilePdf, setProfilePdf] = useState('#');

  useEffect(() => {
    axios.get('/api/v1/config').then(res => {
      const pdf = res.data.find((item: any) => item.key === 'company_profile_pdf');
      if (pdf && pdf.value) {
        setProfilePdf(pdf.value);
      }
    }).catch(() => {});
  }, []);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang Kami', path: '/tentang-kami' },
    { name: 'Layanan', path: '/layanan' },
    { name: 'Pengalaman', path: '/pengalaman' },
    { name: 'SIS-WDU', path: 'https://sis.wahanadata.co.id/login', isExternal: true },
    { name: 'Kontak', path: '/kontak' },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">

      {/* Container */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12 h-20 md:h-24 flex items-center justify-between">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-14">

          {/* LOGO (GEDE DI DESKTOP 🔥) */}
          <Link to="/" className="flex items-center">
            <img
              src="https://wahanadata.co.id/img/wdu-ijo.png"
              alt="Wahana Data Utama Logo"
              className="h-8 md:h-10 lg:h-12 w-auto max-w-[240px] object-contain"
            />
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              link.isExternal ? (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[15px] font-semibold transition-all relative py-1 ${isActive
                      ? 'text-emerald-700 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-600'
                      : 'text-slate-600 hover:text-emerald-700'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              )
            ))}
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center">

          {/* CTA BUTTON */}
          <div className="hidden lg:block ml-6">
            <a
              href={profilePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-col items-center justify-center bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-900 text-white px-7 py-3 rounded-xl leading-snug transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <span className="text-[11px] uppercase tracking-wider font-bold opacity-90">
                Download
              </span>
              <span className="text-[14px] font-extrabold whitespace-nowrap">
                Company Profile
              </span>
            </a>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-slate-700 ml-4"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="material-symbols-outlined text-3xl">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 space-y-3">

            {navLinks.map((link) => (
              link.isExternal ? (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-slate-700 px-4 py-2 rounded-lg hover:bg-emerald-50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ) : (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-lg font-semibold px-4 py-2 rounded-lg ${isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-700 hover:bg-emerald-50'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </NavLink>
              )
            ))}

            {/* CTA MOBILE */}
            <div className="pt-4">
              <a 
                href={profilePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-800 text-white py-4 rounded-xl font-bold flex flex-col items-center"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xs">Download</span>
                <span>Company Profile</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;