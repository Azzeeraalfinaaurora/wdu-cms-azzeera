import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';

const icons = {
  design_services: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  verified: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  mail: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  admin_panel_settings: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  home: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  description: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>,
};

export default function Dashboard() {
  const { user } = useAuthStore();

  const [stats, setStats] = useState([
    { name: 'Total Layanan', value: '0', icon: 'design_services' },
    { name: 'Project Selesai', value: '0', icon: 'verified' },
    { name: 'Pesan Baru', value: '0', icon: 'mail' },
    { name: 'Admin Aktif', value: '0', icon: 'admin_panel_settings' },
  ]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [services, projects, messages, users] = await Promise.allSettled([
        api.get('/services'),
        api.get('/projects'),
        api.get('/contact/messages'),
        api.get('/users'),
      ]);

      if (services.status === 'fulfilled') {
        setStats(prev => prev.map(s => s.name === 'Total Layanan' ? { ...s, value: services.value.data.length.toString() } : s));
      }
      if (projects.status === 'fulfilled') {
        setStats(prev => prev.map(s => s.name === 'Project Selesai' ? { ...s, value: projects.value.data.length.toString() } : s));
      }
      if (messages.status === 'fulfilled') {
        const data = messages.value.data;
        const unreadCount = data.filter((m: any) => !m.isRead).length;
        setStats(prev => prev.map(s => s.name === 'Pesan Baru' ? { ...s, value: unreadCount.toString() } : s));
        setRecentMessages(data.slice(0, 5));
      }
      if (users.status === 'fulfilled') {
        setStats(prev => prev.map(s => s.name === 'Admin Aktif' ? { ...s, value: users.value.data.length.toString() } : s));
      } else {
        setStats(prev => prev.map(s => s.name === 'Admin Aktif' ? { ...s, value: '1' } : s));
      }
    } catch (e) {
      console.error('Dashboard fetch error', e);
    }
  };

  const statGradients: Record<string, string> = {
    design_services: 'from-emerald-500 to-emerald-600',
    verified: 'from-blue-500 to-cyan-500',
    mail: 'from-amber-500 to-orange-500',
    admin_panel_settings: 'from-violet-500 to-purple-500',
  };

  const quickActions = [
    { label: 'Edit Beranda', icon: 'home', path: '/admin/pages', desc: 'Kelola halaman utama website', gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Upload Company Profile', icon: 'description', path: '/admin/config', desc: 'Perbarui profil perusahaan', gradient: 'from-blue-500 to-indigo-500' },
    { label: 'Lihat Pesan', icon: 'mail', path: '/admin/contact', desc: 'Cek pesan masuk dari klien', gradient: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-7 pb-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            Selamat Datang, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Kelola semua aset digital PT. Wahana Data Utama
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.04] dark:opacity-[0.06]">
              <div className={`w-full h-full rounded-full bg-gradient-to-br ${statGradients[stat.icon]} blur-3xl`} />
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 mb-3">
                {icons[stat.icon as keyof typeof icons]}
              </div>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5 tabular-nums">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
          <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              onClick={() => navigate(action.path)}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-sm`}>
                  {icons[action.icon as keyof typeof icons]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{action.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{action.desc}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {recentMessages.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
              <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Pesan Kontak Terbaru</h2>
            </div>
            <button
              onClick={() => navigate('/admin/contact')}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              Lihat Semua
            </button>
          </div>
          <div className="space-y-3">
            {recentMessages.slice(0, 5).map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.04 }}
                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate('/admin/contact')}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    !msg.isRead
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700'
                  }`}>
                    {msg.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className={`text-sm truncate ${!msg.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-600 dark:text-gray-400'}`}>
                          {msg.name || 'Tanpa Nama'}
                        </p>
                        {!msg.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{msg.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
