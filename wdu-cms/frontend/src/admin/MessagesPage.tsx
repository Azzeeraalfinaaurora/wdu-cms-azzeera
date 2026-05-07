import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact/messages');
      setMessages(res.data);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
      setToast(`Gagal memuat: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/contact/messages/${id}/read`, { isRead: !currentStatus });
      fetchMessages();
    } catch (err) {
      setToast('Gagal update status pesan');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (messages.filter(m => !m.isRead).length === 0) return;
    try {
      await api.patch('/contact/messages/read-all');
      fetchMessages();
    } catch (err) {
      setToast('Gagal menandai semua pesan sebagai dibaca');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pesan ini?')) return;
    try {
      await api.delete(`/contact/messages/${id}`);
      fetchMessages();
      setToast('Pesan berhasil dihapus');
    } catch (err) {
      setToast('Gagal menghapus pesan');
    }
  };

  const handleReplyWA = (phone: string | null, name: string) => {
    if (!phone) {
      setToast('Nomor telepon tidak tersedia.');
      return;
    }
    // Clean phone number: remove non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    // Ensure it starts with country code (e.g., 62 for Indonesia)
    let finalPhone = cleanPhone;
    if (finalPhone.startsWith('0')) {
      finalPhone = '62' + finalPhone.substring(1);
    } else if (!finalPhone.startsWith('62') && finalPhone.length > 0) {
      finalPhone = '62' + finalPhone;
    }
    
    const text = encodeURIComponent(`Halo ${name}, terima kasih telah menghubungi Wahana Data Utama. Menanggapi pesan Anda mengenai...`);
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
    
    // Create hidden link and click it (most robust method for mailto)
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const { user } = useAuthStore();
  
  const canDelete = user?.role === 'SUPER_ADMIN';

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2">Pesan Masuk</h2>
          <p className="text-on-surface-variant font-medium">Kelola semua komunikasi masuk dari sistem manajemen konten Anda.</p>
        </div>
        <div className="flex gap-3">
          {canDelete && (
            <button 
              onClick={handleMarkAllAsRead}
              className="px-6 py-2.5 gradient-btn text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">mark_email_read</span>
              Tandai Semua Dibaca
            </button>
          )}
        </div>
      </div>

      {/* Bento Style Table Wrapper */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-lowest rounded-[2rem] emerald-glow overflow-hidden border border-outline-variant/10 font-body"
      >
        {/* Filter Bar */}
        <div className="p-6 flex flex-wrap items-center justify-between gap-4 bg-surface-container-low/50">
          <div className="flex items-center gap-4">
            <div className="flex bg-surface-container-lowest dark:bg-emerald-950/20 rounded-lg p-1 border border-secondary-container">
              <button 
                onClick={() => setFilter('ALL')}
                className={`px-4 py-1.5 rounded-md text-xs font-extrabold transition-all ${filter === 'ALL' ? 'bg-primary text-white' : 'text-slate-500 hover:text-primary'}`}
              >
                Semua
              </button>
              <button 
                onClick={() => setFilter('UNREAD')}
                className={`px-4 py-1.5 rounded-md text-xs font-extrabold transition-all ${filter === 'UNREAD' ? 'bg-primary text-white' : 'text-slate-500 hover:text-primary'}`}
              >
                Baru
              </button>
            </div>
          </div>
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            Total {messages.length} Pesan Masuk
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-20 text-center text-outline font-extrabold animate-pulse">MEMUAT PESAN...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/30 border-b border-surface-container-high text-on-surface-variant font-extrabold">
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest">Pengirim</th>
                  <th className="px-6 py-5 text-[10px] uppercase tracking-widest">Subjek</th>
                  <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-center">Waktu</th>
                  <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {messages
                  .filter(m => filter === 'ALL' ? true : !m.isRead)
                  .map((msg) => (
                  <tr 
                    key={msg.id} 
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (!msg.isRead) handleToggleRead(msg.id, false);
                    }}
                    className="hover:bg-primary-container/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm ring-2 ring-white shadow-sm ${
                          !msg.isRead ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'
                        }`}>
                          {msg.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className={`text-sm font-extrabold ${!msg.isRead ? 'text-on-surface' : 'text-slate-500'}`}>{msg.name || 'Tanpa Nama'}</p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-tight">{msg.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className={`text-sm font-extrabold truncate max-w-xs ${!msg.isRead ? 'text-on-surface' : 'text-slate-500'}`}>{msg.subject}</p>
                      <p className="text-xs text-slate-400 truncate max-w-xs font-medium">{msg.message}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`text-xs font-extrabold ${!msg.isRead ? 'text-on-surface' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleDateString('en-GB')} {String(new Date(msg.createdAt).getHours()).padStart(2,'0')}:{String(new Date(msg.createdAt).getMinutes()).padStart(2,'0')}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        !msg.isRead ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {!msg.isRead ? 'Baru' : 'Dibaca'}
                      </span>
                    </td>
                    {canDelete && (
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                            className="p-2 hover:bg-error-container/50 rounded-lg text-error transition-all opacity-0 group-hover:opacity-100"
                            title="Hapus"
                          >
                            <span className="material-symbols-outlined text-xl font-bold">delete</span>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Control */}
        <div className="px-8 py-6 flex items-center justify-between bg-surface-container-low/30 border-t border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">Tampilkan</span>
            <select className="bg-surface-container-lowest dark:bg-emerald-900 border border-secondary-container rounded-lg px-2 py-1 text-xs font-extrabold outline-none">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span className="text-xs font-bold text-on-surface-variant">baris</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-secondary-container text-slate-400 hover:text-primary hover:border-primary transition-all disabled:opacity-30" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-extrabold text-sm shadow-md">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-secondary-container text-slate-400 hover:text-primary hover:border-primary transition-all disabled:opacity-30" disabled>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Contextual Note (Bento Sub-element) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-secondary-container/20 p-6 rounded-[1.5rem] flex items-center gap-6 border border-primary/10">
          <div className="w-16 h-16 bg-surface-container-lowest dark:bg-emerald-900 rounded-full flex-shrink-0 flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div>
            <h4 className="text-lg font-extrabold text-emerald-900 dark:text-emerald-50 mb-1">Penyaringan Cerdas Aktif</h4>
            <p className="text-sm text-on-secondary-container dark:text-emerald-400 font-bold">
              Sistem secara otomatis mengkategorikan pesan berdasarkan urgensi dan departemen terkait untuk mempercepat alur kerja Anda.
            </p>
          </div>
        </div>
        <div className="bg-surface-container-high/40 p-6 rounded-[1.5rem] flex flex-col justify-center border border-outline-variant/10">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-2">Kapasitas Kotak Masuk</p>
          <div className="w-full bg-surface-container-lowest dark:bg-emerald-900 rounded-full h-2 mb-3 overflow-hidden shadow-inner">
            <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs font-bold text-on-surface">3.2 GB <span className="text-slate-400">dari 5 GB digunakan</span></p>
        </div>
      </div>

      {/* Message Detail Modal */}
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
              {/* Modal Header */}
              <div className="p-8 pb-4 border-b border-surface-container-high flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-extrabold text-on-surface mb-1">{selectedMessage.subject}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary-container/20 px-2 py-0.5 rounded">
                      {selectedMessage.name || 'Anonim'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {new Date(selectedMessage.createdAt).toLocaleDateString('en-GB')} {String(new Date(selectedMessage.createdAt).getHours()).padStart(2,'0')}:{String(new Date(selectedMessage.createdAt).getMinutes()).padStart(2,'0')}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-emerald-900 rounded-full transition-colors text-slate-400"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto flex-1">
                <div className="bg-surface-container-low/50 p-6 rounded-2xl border border-surface-container-high mb-6">
                  <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap font-medium">
                    {selectedMessage.message}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container-lowest dark:bg-emerald-900 border border-secondary-container rounded-xl">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Email Pengirim</p>
                    <p className="text-sm font-bold text-on-surface">{selectedMessage.email}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-emerald-900 border border-secondary-container rounded-xl">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Nomor Telepon</p>
                    <p className="text-sm font-bold text-on-surface">{selectedMessage.phone || 'Tidak tersedia'}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer (Action Bar) */}
              <div className="p-8 pt-4 bg-surface-container-low/30 border-t border-surface-container-high flex gap-4">
                <button 
                  onClick={() => handleReplyWA(selectedMessage.phone, selectedMessage.name)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl font-extrabold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95"
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
