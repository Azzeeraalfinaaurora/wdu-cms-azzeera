import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import MediaPicker from '../components/MediaPicker';

interface ConfigItem {
  key: string;
  value: string;
}

export default function ConfigPage() {
  const [configs, setConfigs] = useState<Record<string, string>>({
    site_name: 'PT. Wahana Data Utama',
    site_tagline: 'Data Terpadu, Solusi Cerdas, Hasil Maksimal',
    company_email: 'wahanadata@yahoo.com',
    company_phone: '(0251) 755 2099',
    youtube_url: 'https://www.youtube.com/@wahanadatautama9110',
    instagram_url: 'https://www.instagram.com/wahanadatautama',
    site_footer_copyright: '© 2026 PT. Wahana Data Utama. All rights reserved.',
    company_profile_pdf: '',
    company_address: 'Blok AE No. 01, Jl. Terapi Raya, RT 03/19, Menteng\nKec. Bogor Barat, Kota Bogor, Jawa Barat 16111'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchConfigs = async () => {
    try {
      const res = await api.get('/config');
      const configMap = res.data.reduce((acc: any, item: ConfigItem) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      setConfigs(prev => ({ ...prev, ...configMap }));
    } catch (err) {
      console.error('Error fetching config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (key: string, value: string) => {
    setConfigs(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post('/config/bulk', configs);
      setToast('Pengaturan berhasil disimpan!');
      fetchConfigs();
    } catch (err) {
      setToast('Gagal menyimpan pengaturan');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="bg-white dark:bg-emerald-900/10 p-8 rounded-2xl emerald-glow border border-outline-variant/10">
        <h1 className="text-2xl font-extrabold text-emerald-900 dark:text-white uppercase tracking-tight">Pengaturan Sistem</h1>
        <p className="text-sm text-outline font-medium mt-1">Konfigurasi utama identitas website PT. Wahana Data Utama.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-emerald-950/20 p-8 rounded-2xl emerald-glow border border-outline-variant/10 space-y-6"
        >
          <h2 className="text-lg font-extrabold text-on-surface flex items-center gap-2 border-b border-outline-variant/10 pb-4">
            <span className="material-symbols-outlined text-primary">language</span>
            General Branding
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-outline uppercase tracking-widest mb-1.5 ml-1">Nama Website</label>
              <input 
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" 
                value={configs.site_name} 
                onChange={e => handleUpdate('site_name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-outline uppercase tracking-widest mb-1.5 ml-1">Slogan / Tagline</label>
              <input 
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" 
                value={configs.site_tagline} 
                onChange={e => handleUpdate('site_tagline', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-outline uppercase tracking-widest mb-1.5 ml-1">Teks Copyright Footer</label>
              <input 
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" 
                value={configs.site_footer_copyright} 
                onChange={e => handleUpdate('site_footer_copyright', e.target.value)}
              />
            </div>
            <div className="pt-4">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="gradient-btn text-white px-8 py-3 rounded-xl font-extrabold shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isSaving ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-emerald-950/20 p-8 rounded-2xl emerald-glow border border-outline-variant/10 space-y-6"
        >
          <h2 className="text-lg font-extrabold text-on-surface flex items-center gap-2 border-b border-outline-variant/10 pb-4">
            <span className="material-symbols-outlined text-tertiary">contact_mail</span>
            Kontak & Sosial Media
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-outline uppercase tracking-widest mb-1.5 ml-1">Email Perusahaan</label>
              <input 
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" 
                value={configs.company_email} 
                onChange={e => handleUpdate('company_email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-outline uppercase tracking-widest mb-1.5 ml-1">Nomor Telepon</label>
              <input 
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" 
                value={configs.company_phone} 
                onChange={e => handleUpdate('company_phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-outline uppercase tracking-widest mb-1.5 ml-1">YouTube URL</label>
              <input 
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" 
                value={configs.youtube_url} 
                onChange={e => handleUpdate('youtube_url', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-outline uppercase tracking-widest mb-1.5 ml-1">Instagram URL</label>
              <input 
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" 
                value={configs.instagram_url} 
                onChange={e => handleUpdate('instagram_url', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-outline uppercase tracking-widest mb-1.5 ml-1">Alamat Perusahaan</label>
              <textarea 
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none resize-none" 
                rows={3}
                value={configs.company_address} 
                onChange={e => handleUpdate('company_address', e.target.value)}
                placeholder="Masukkan alamat lengkap kantor..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-outline uppercase tracking-widest mb-1.5 ml-1">Company Profile (PDF)</label>
              <div className="flex gap-2">
                <input 
                  className="flex-1 bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" 
                  value={configs.company_profile_pdf} 
                  placeholder="Pilih file PDF dari Media Library"
                  readOnly
                />
                <button 
                  onClick={() => setIsPickerOpen(true)}
                  className="bg-emerald-100 dark:bg-primary/20 text-emerald-700 dark:text-primary px-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-primary hover:text-white transition-all"
                >
                  PILIH
                </button>
              </div>
              <p className="text-[9px] text-outline mt-1.5 font-medium italic">*Klik tombol di atas untuk mengambil file PDF yang sudah di-upload di Media.</p>
              {configs.company_profile_pdf && (
                 <button 
                   onClick={() => window.open(configs.company_profile_pdf, '_blank')}
                   className="mt-2 text-[10px] font-black text-emerald-600 dark:text-primary flex items-center gap-1 hover:underline uppercase tracking-widest"
                 >
                   <span className="material-symbols-outlined text-sm">visibility</span>
                   Lihat PDF Saat Ini
                 </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <MediaPicker 
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(url) => {
          handleUpdate('company_profile_pdf', url);
          setIsPickerOpen(false);
        }}
      />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-8 right-8 z-[110] bg-emerald-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/20">
            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            <span className="font-bold text-sm">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

