import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@wdu.co.id',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToast('Profil berhasil diperbarui!');
    }, 1000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-emerald-900/10 p-8 rounded-2xl emerald-glow border border-outline-variant/10">
        <div>
          <h1 className="text-2xl font-extrabold text-emerald-900 dark:text-white uppercase tracking-tight">Profil Saya</h1>
          <p className="text-sm text-outline font-medium mt-1">Kelola informasi profil dan keamanan akun Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar - Profile Picture */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1"
        >
          <div className="bg-white dark:bg-emerald-950/20 rounded-2xl p-6 border border-outline-variant/10 flex flex-col items-center text-center emerald-glow">
            <div className="relative mb-4">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-emerald-50 dark:border-emerald-900/30 shadow-lg"
              />
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors border-2 border-white dark:border-emerald-950">
                <span className="material-symbols-outlined text-lg">photo_camera</span>
              </button>
            </div>
            <h2 className="text-lg font-extrabold text-on-surface">{formData.name}</h2>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">{user?.role || 'SUPER_ADMIN'}</p>
          </div>
        </motion.div>

        {/* Right Content - Forms */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 md:col-span-2 space-y-6"
        >
          {/* Personal Info Form */}
          <div className="bg-white dark:bg-emerald-950/20 rounded-2xl p-8 border border-outline-variant/10 emerald-glow">
            <h3 className="text-lg font-extrabold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">person</span>
              Informasi Pribadi
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-outline mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-surface-container-low dark:bg-emerald-900/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-outline mb-2">Alamat Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-surface-container-low dark:bg-emerald-900/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Password Form */}
          <div className="bg-white dark:bg-emerald-950/20 rounded-2xl p-8 border border-outline-variant/10 emerald-glow">
            <h3 className="text-lg font-extrabold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">lock</span>
              Ubah Password
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-outline mb-2">Password Saat Ini</label>
                <input 
                  type="password" 
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low dark:bg-emerald-900/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-outline mb-2">Password Baru</label>
                  <input 
                    type="password" 
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    placeholder="Minimal 8 karakter"
                    className="w-full bg-surface-container-low dark:bg-emerald-900/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-outline mb-2">Konfirmasi Password Baru</label>
                  <input 
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Ulangi password baru"
                    className="w-full bg-surface-container-low dark:bg-emerald-900/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="gradient-btn text-white px-8 py-3 rounded-xl font-extrabold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSaving ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Menyimpan...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[200] bg-emerald-900 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-700"
          >
            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            <span className="font-bold text-sm">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
