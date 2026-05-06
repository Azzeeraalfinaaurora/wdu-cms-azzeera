import React, { useState } from 'react';
import Footer from '../components/Footer';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  React.useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased">
      {/* Hero Section - Full Photo */}
      <header className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Hubungi Kami"
            className="w-full h-full object-cover brightness-75 transition-transform duration-1000 hover:scale-105"
            src="https://wahanadata.co.id/wp-content/uploads/2025/01/91ff19eb-9bae-41be-bd79-86c09efa26ae.jpg"
          />
          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1px]"></div>
        </div>
        <div className="relative z-10 text-center px-8">
          <span className="text-emerald-100 font-bold tracking-[0.3em] uppercase mb-4 block reveal-down">Connect With Us</span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter drop-shadow-2xl mb-6 reveal-up">
            Silahkan Hubungi Kami
          </h1>
          <div className="w-24 h-2 bg-emerald-500 mx-auto rounded-full shadow-lg reveal-up delay-200"></div>
        </div>
      </header>

      {/* Content Row: Office Info */}
      <section className="py-24 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Alamat Kantor */}
            <div className="flex gap-4 reveal-left">
              <div className="shrink-0 pt-1">
                <span className="material-symbols-outlined text-emerald-600 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold mb-2 text-on-surface font-['Inter']">Alamat Kantor</h3>
                <p className="text-zinc-700 text-sm leading-relaxed font-['Inter']">
                  Blok AE No. 01, Jl. Terapi Raya, RT 03/19, Menteng. Kec. Bogor Barat, Kota Bogor, Jawa Barat 16111
                </p>
              </div>
            </div>
            {/* Email */}
            <div className="flex gap-4 reveal-up delay-100">
              <div className="shrink-0 pt-1">
                <span className="material-symbols-outlined text-emerald-600 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold mb-2 text-on-surface font-['Inter']">Email</h3>
                <p className="text-zinc-700 text-sm leading-relaxed font-['Inter']">
                  wahanadata@yahoo.com<br />
                  it.support@wahanadata.co.id
                </p>
              </div>
            </div>
            {/* Telepon */}
            <div className="flex gap-4 reveal-right">
              <div className="shrink-0 pt-1">
                <span className="material-symbols-outlined text-emerald-600 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold mb-2 text-on-surface font-['Inter']">Telepon</h3>
                <p className="text-zinc-700 text-sm leading-relaxed font-['Inter']">
                  (0251) 755 2099<br />
                  +62 852-1848-8892
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hubungi Kami Section (Form) */}
      <section className="py-24 bg-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="reveal-left">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 tracking-tight">Kirimkan <span className="text-emerald-500">Pesan Anda</span></h2>
            <p className="text-lg text-on-surface-variant mb-12 leading-relaxed">
              Punya pertanyaan tentang layanan kami atau ingin berkonsultasi mengenai kebutuhan IT bisnis Anda? Tim kami siap membantu mencarikan solusi terbaik.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                </div>
                <p className="text-on-surface-variant">Respon cepat dalam kurun waktu 24 jam kerja.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                </div>
                <p className="text-on-surface-variant">Konsultasi teknis gratis untuk proyek pertama.</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-2xl border border-outline-variant/10 reveal-right">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-on-surface">Nama Lengkap</label>
                  <input 
                    className="w-full px-4 py-3 bg-slate-50 border-0 border-b-2 border-outline-variant/30 focus:border-emerald-500 focus:ring-0 transition-all duration-300" 
                    placeholder="John Doe" 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-on-surface">Alamat Email</label>
                  <input 
                    className="w-full px-4 py-3 bg-slate-50 border-0 border-b-2 border-outline-variant/30 focus:border-emerald-500 focus:ring-0 transition-all duration-300" 
                    placeholder="john@example.com" 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-on-surface">Nomor Telepon</label>
                <input 
                    className="w-full px-4 py-3 bg-slate-50 border-0 border-b-2 border-outline-variant/30 focus:border-emerald-500 focus:ring-0 transition-all duration-300" 
                    placeholder="+62 812 3456 7890" 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-on-surface">Pesan</label>
                <textarea 
                    className="w-full px-4 py-3 bg-slate-50 border-0 border-b-2 border-outline-variant/30 focus:border-emerald-500 focus:ring-0 transition-all duration-300" 
                    placeholder="Ceritakan kebutuhan Anda..." 
                    rows={4} 
                    required 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
              </div>
              <button 
                className={`w-full py-4 bg-emerald-600 text-white rounded-md font-bold text-lg hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`} 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Mengirim...
                  </>
                ) : 'Kirim Pesan'}
              </button>
              
              {submitStatus === 'success' && (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-center font-semibold animate-in fade-in duration-500">
                  Pesan berhasil dikirim! Kami akan segera menghubungi Anda.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center font-semibold animate-in fade-in duration-500">
                  Gagal mengirim pesan. Silakan coba lagi nanti.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[500px] w-full bg-surface-container relative overflow-hidden">
        <iframe
          allowFullScreen={true}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15842.50277547531!2d106.743414!3d-6.560428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c45a76630bef%3A0xcc4ae8ae1ccf277f!2sPT.%20Wahana%20Data%20Utama!5sfalse!2sen-US!5m2!1sen!2sid!3m2!2sen!2sid!4v1736400000000"
          title="Bogor, Indonesia"
        ></iframe>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;

