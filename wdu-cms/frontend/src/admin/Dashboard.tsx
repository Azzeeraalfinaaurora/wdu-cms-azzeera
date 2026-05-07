import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const monthlyData = [
  { name: 'JAN', messages: 45 },
  { name: 'FEB', messages: 52 },
  { name: 'MAR', messages: 38 },
  { name: 'APR', messages: 65 },
  { name: 'MEI', messages: 48 },
  { name: 'JUN', messages: 70 },
  { name: 'JUL', messages: 85 },
  { name: 'AGU', messages: 62 },
  { name: 'SEP', messages: 90 },
  { name: 'OKT', messages: 75 },
  { name: 'NOV', messages: 88 },
  { name: 'DES', messages: 110 },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const canDelete = user?.role === 'SUPER_ADMIN';
  
  const [stats, setStats] = useState([
    { name: 'Total Layanan', value: '0', icon: 'design_services', color: 'border-primary' },
    { name: 'Project Selesai', value: '0', icon: 'verified', color: 'border-primary-container' },
    { name: 'Pesan Baru', value: '0', icon: 'mail', color: 'border-tertiary' },
    { name: 'Admin Aktif', value: '0', icon: 'admin_panel_settings', color: 'border-outline' },
  ]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchDashboardData = async () => {
    // 1. Fetch Services
    try {
      const res = await api.get('/services');
      setStats(prev => prev.map(s => s.name === 'Total Layanan' ? { ...s, value: res.data.length.toString() } : s));
    } catch (e) { console.error('Dashboard: Failed to fetch services'); }

    // 2. Fetch Projects
    try {
      const res = await api.get('/projects');
      setStats(prev => prev.map(s => s.name === 'Project Selesai' ? { ...s, value: res.data.length.toString() } : s));
    } catch (e) { console.error('Dashboard: Failed to fetch projects'); }

    // 3. Fetch Messages
    try {
      const res = await api.get('/contact/messages');
      const unreadCount = res.data.filter((m: any) => !m.isRead).length;
      setStats(prev => prev.map(s => s.name === 'Pesan Baru' ? { ...s, value: unreadCount.toString() } : s));
      setRecentMessages(res.data.slice(0, 3));
    } catch (e: any) { 
      console.error('Dashboard: Failed to fetch messages', e);
      const errorMsg = e.response?.data?.error || e.message || 'Error';
      setToast(`Pesan: ${errorMsg}`);
    }

    // 4. Fetch Users (Only if role is SUPER_ADMIN)
    try {
      const res = await api.get('/users');
      setStats(prev => prev.map(s => s.name === 'Admin Aktif' ? { ...s, value: res.data.length.toString() } : s));
    } catch (e) {
      // Default to 1 if failed (fallback for Editor)
      setStats(prev => prev.map(s => s.name === 'Admin Aktif' ? { ...s, value: '1' } : s));
    }
  };

  const handleReplyWA = (phone: string | null, name: string) => {
    if (!phone) {
      setToast('Nomor telepon tidak tersedia.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    let finalPhone = cleanPhone;
    if (finalPhone.startsWith('0')) {
      finalPhone = '62' + finalPhone.substring(1);
    } else if (!finalPhone.startsWith('62') && finalPhone.length > 0) {
      finalPhone = '62' + finalPhone;
    }
    const text = encodeURIComponent(`Halo ${name}, terima kasih telah menghubungi Wahana Data Utama...`);
    window.open(`https://wa.me/${finalPhone}?text=${text}`, '_blank');
  };

  const handleReplyEmail = (email: string, subject: string, name: string) => {
    if (!email) {
      setToast('Email pengirim tidak tersedia');
      return;
    }
    const mailSubject = encodeURIComponent(`Re: ${subject} - Wahana Data Utama`);
    const body = encodeURIComponent(`Halo ${name},\n\nTerima kasih telah menghubungi kami.\n\n`);
    const mailtoUrl = `mailto:${email}?subject=${mailSubject}&body=${body}`;
    
    // Open default email client
    window.location.href = mailtoUrl;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus pesan ini secara permanen?')) {
      try {
        await api.delete(`/contact/messages/${id}`);
        setToast('Pesan berhasil dihapus');
        fetchDashboardData();
        setOpenActionId(null);
      } catch (err) {
        setToast('Gagal menghapus pesan');
      }
    }
  };
  return (
    <div className="p-8 space-y-8 pb-12">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-surface-container-lowest p-6 rounded-xl emerald-glow border-l-4 ${stat.color} hover:scale-105 transition-transform duration-300`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${stat.icon === 'mail' ? 'bg-tertiary-container/20' : 'bg-secondary-container'}`}>
                <span className={`material-symbols-outlined ${stat.icon === 'mail' ? 'text-tertiary' : 'text-primary'}`}>
                  {stat.icon}
                </span>
              </div>
            </div>
            <p className="text-outline text-[10px] uppercase tracking-widest font-extrabold">{stat.name}</p>
            <h3 className="text-3xl font-extrabold text-on-surface mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Content Row: Quick Actions & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Quick Actions & Server Status */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-lowest p-8 rounded-xl emerald-glow border border-outline-variant/10"
          >
            <h4 className="text-lg font-extrabold text-on-surface mb-6">Aksi Cepat</h4>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/admin/pages')}
                className="w-full flex items-center justify-between gradient-btn text-white p-4 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-primary/20"
              >
                <span className="font-extrabold text-sm uppercase tracking-tight">Kelola Halaman</span>
                <span className="material-symbols-outlined">description</span>
              </button>
              <button 
                onClick={() => navigate('/admin/config')}
                className="w-full flex items-center justify-between bg-surface-container-low border border-outline-variant/30 text-on-surface p-4 rounded-xl hover:bg-surface-container-high transition-colors active:scale-95"
              >
                <span className="font-extrabold text-sm uppercase tracking-tight">Upload Company Profile</span>
                <span className="material-symbols-outlined">upload_file</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary p-6 rounded-xl text-white relative overflow-hidden group shadow-xl shadow-primary/10"
          >
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-widest text-primary-fixed opacity-80 mb-1 font-extrabold">Status Server</p>
              <h5 className="text-xl font-extrabold mb-4">Semua Sistem Optimal</h5>
              <div className="flex items-center gap-2 text-sm font-bold">
                <span className="flex h-2.5 w-2.5 rounded-full bg-primary-fixed animate-pulse"></span>
                99.9% Uptime Terjaga
              </div>
            </div>
            <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-[120px] opacity-10 group-hover:scale-110 transition-transform duration-700">cloud_done</span>
          </motion.div>
        </div>

        {/* Right Column: Recent Messages Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 bg-surface-container-lowest rounded-xl emerald-glow overflow-hidden border border-outline-variant/10"
        >
          <div className="p-8 flex justify-between items-center bg-surface-container-low dark:bg-emerald-900/10">
            <div>
              <h4 className="text-xl font-extrabold text-on-surface">Pesan Masuk Terbaru</h4>
              <p className="text-sm text-outline font-medium">Daftar permintaan klien terbaru</p>
            </div>
            <button 
              onClick={() => navigate('/admin/contact')}
              className="text-primary text-sm font-extrabold flex items-center gap-1 hover:underline group"
            >
              Lihat Semua
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
          
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low dark:bg-emerald-900/20 text-outline text-[10px] uppercase tracking-widest font-extrabold">
                        <th className="px-8 py-4">Pengirim</th>
                        <th className="px-8 py-4">Waktu</th>
                        <th className="px-8 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high dark:divide-emerald-900/30">
                {recentMessages.length > 0 ? recentMessages.map((msg) => (
                  <tr 
                    key={msg.id} 
                    onClick={() => setSelectedMessage(msg)}
                    className="hover:bg-surface-container-low/50 dark:hover:bg-emerald-900/10 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[10px] ${
                          !msg.isRead ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'
                        }`}>
                          {msg.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-on-surface">{msg.name || 'Tanpa Nama'}</p>
                          <p className="text-[10px] text-outline font-bold truncate max-w-[120px]">{msg.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-sm text-on-surface-variant font-bold">{new Date(msg.createdAt).toLocaleDateString('en-GB')} {String(new Date(msg.createdAt).getHours()).padStart(2,'0')}:{String(new Date(msg.createdAt).getMinutes()).padStart(2,'0')}</p>
                    </td>
                    <td className="px-8 py-5 text-right relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOpenActionId(openActionId === msg.id ? null : msg.id); }}
                        className={`text-outline hover:text-primary transition-colors p-2 rounded-lg shadow-sm group-hover:shadow-md transition-all ${openActionId === msg.id ? 'bg-primary-fixed/20 text-primary' : 'hover:bg-white dark:hover:bg-emerald-800'}`}
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>

                      <AnimatePresence>
                        {openActionId === msg.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenActionId(null)}></div>
                              <motion.div 
                                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -10, scale: 0.95 }}
                                className="absolute right-16 top-0 w-36 bg-white dark:bg-emerald-900 rounded-xl shadow-xl border border-emerald-500/10 z-20 py-1 overflow-hidden"
                              >
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setSelectedMessage(msg); setOpenActionId(null); }}
                                  className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-sm">visibility</span>
                                  Lihat Detail
                                </button>
                                {canDelete && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                                    className="w-full text-left px-4 py-2 text-xs font-bold text-error hover:bg-error/5 transition-colors"
                                  >
                                    Hapus
                                  </button>
                                )}
                              </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-8 py-10 text-center text-outline text-sm italic font-medium">Belum ada pesan masuk terbaru</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Message Detail Modal (Consistent with MessagesPage) */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMessage(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-surface-container-lowest dark:bg-emerald-950 w-full max-w-2xl relative z-10 rounded-[2rem] shadow-2xl overflow-hidden border border-emerald-500/10 flex flex-col max-h-[90vh]"
            >
              <div className="p-8 pb-4 border-b border-surface-container-high flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-extrabold text-on-surface mb-1">{selectedMessage.subject}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary-container/20 px-2 py-0.5 rounded">
                      {selectedMessage.name || 'Anonim'}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedMessage(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1">
                <div className="bg-surface-container-low/50 p-6 rounded-2xl border border-surface-container-high mb-6 text-on-surface leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedMessage.message}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container-lowest dark:bg-emerald-900 border border-secondary-container rounded-xl">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-sm font-bold text-on-surface">{selectedMessage.email}</p>
                  </div>
                  <div className="p-4 bg-surface-container-lowest dark:bg-emerald-900 border border-secondary-container rounded-xl">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Telepon</p>
                    <p className="text-sm font-bold text-on-surface">{selectedMessage.phone || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="p-8 pt-4 bg-surface-container-low/30 border-t border-surface-container-high flex gap-4">
                <button 
                  onClick={() => handleReplyWA(selectedMessage.phone, selectedMessage.name)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl font-extrabold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                  <span className="material-symbols-outlined">chat</span>
                  Balas via WhatsApp
                </button>
                <button 
                    onClick={() => handleReplyEmail(selectedMessage.email, selectedMessage.subject, selectedMessage.name)}
                    className="flex-1 flex items-center justify-center gap-2 gradient-btn text-white py-4 rounded-2xl font-extrabold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                  <span className="material-symbols-outlined">mail</span>
                  Balas via Email
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
