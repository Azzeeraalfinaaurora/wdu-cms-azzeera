import { useState, useEffect } from 'react';
import { Link, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

// Sidebar Menu Icons (Material Symbols)
const MaterialIcon = ({ name, active = false, className = "" }: { name: string, active?: boolean, className?: string }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{ fontVariationSettings: `'FILL' ${active ? 1 : 0}` }}
  >
    {name}
  </span>
);

export default function AdminLayout() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [showFaq, setShowFaq] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(localStorage.getItem('admin-theme') as 'light' | 'dark' || 'light');
  const [unreadCount, setUnreadCount] = useState(0);

  const [notifications, setNotifications] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // Fetch notifications from contact messages
  const fetchNotifications = async () => {
    try {
      const res = await api.get('/contact/messages');
      const messages = res.data;
      const unreadMsgs = messages.filter((m: any) => !m.isRead);
      setUnreadCount(unreadMsgs.length);
      
      // Map to notifications (show last 5 unread messages)
      const notifs = unreadMsgs.slice(0, 5).map((msg: any) => ({
        id: msg.id,
        text: `Pesan baru dari ${msg.name}`,
        time: new Date(msg.createdAt).toLocaleDateString('en-GB') + ' ' + 
              String(new Date(msg.createdAt).getHours()).padStart(2,'0') + ':' + 
              String(new Date(msg.createdAt).getMinutes()).padStart(2,'0'),
        isRead: false,
        email: msg.email
      }));
      setNotifications(notifs);
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s polling
    return () => clearInterval(interval);
  }, []);

  // Auto-hide notification
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Halaman', path: '/admin/pages', icon: 'description' },
    { name: 'Layanan', path: '/admin/services', icon: 'design_services' },
    { name: 'Projects', path: '/admin/projects', icon: 'work_history' },
    { name: 'Klien', path: '/admin/clients', icon: 'business_center' },
    { name: 'Galeri', path: '/admin/gallery', icon: 'photo_library' },
    { name: 'Media', path: '/admin/media', icon: 'perm_media' },
    { name: 'Pesan', path: '/admin/contact', icon: 'mail', badge: unreadCount },
    { name: 'Pengguna', path: '/admin/users', icon: 'group', role: 'SUPER_ADMIN' },
    { name: 'Pengaturan', path: '/admin/config', icon: 'settings_suggest', role: 'SUPER_ADMIN' },
  ];

  const filteredNavItems = navItems.filter(item => !item.role || item.role === user?.role);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex font-body transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-20'
          } hidden lg:flex flex-col bg-surface-container-lowest border-r border-outline-variant/30 transition-all duration-300 sticky top-0 h-screen z-50`}
      >
        <div className="px-5 py-6 mb-2 border-b border-outline-variant/10 flex items-center justify-between">
          <Link to="/admin" className={`${isSidebarOpen ? 'block' : 'hidden'} flex items-center justify-center flex-1`}>
            <img
              src="https://wahanadata.co.id/img/wdu-ijo.png"
              alt="Wahana Data Utama Logo"
              className="h-8 md:h-10 lg:h-12 w-auto max-w-[240px] object-contain"
            />
          </Link>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-outline transition-colors"
          >
            <span className="material-symbols-outlined">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
          </button>
        </div>


        <nav className="flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide">
          <ul className="space-y-0.5 py-2">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 py-2.5 px-6 transition-all group relative ${location.pathname === item.path
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-600'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 hover:text-emerald-700'
                    }`}
                >
                  <MaterialIcon
                    name={item.icon}
                    active={location.pathname === item.path}
                    className="text-xl"
                  />
                  {isSidebarOpen && (
                    <span className={`font-semibold text-sm ${location.pathname === item.path ? 'translate-x-1' : ''} transition-transform`}>
                      {item.name}
                    </span>
                  )}
                  {isSidebarOpen && item.badge && (
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 bg-tertiary text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 mt-auto border-t border-outline-variant/10 flex flex-col gap-1">
          <button
            onClick={() => setShowFaq(true)}
            className="w-full flex items-center gap-3 text-slate-500 dark:text-slate-400 py-2.5 px-4 hover:text-primary hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all text-sm font-bold group"
          >
            <MaterialIcon name="headset_mic" className="group-hover:scale-110 transition-transform" />
            {isSidebarOpen && <span>Pusat Bantuan</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-error py-2.5 px-4 hover:bg-error/5 rounded-xl transition-all text-sm font-bold group"
          >
            <MaterialIcon name="logout" className="group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-surface-container-lowest z-[70] lg:hidden flex flex-col border-r border-outline-variant/30"
            >
              <div className="px-5 py-6 border-b border-outline-variant/10 flex justify-between items-center">
                <img
                  src="https://wahanadata.co.id/img/wdu-ijo.png"
                  alt="Wahana Data Utama Logo"
                  className="h-10 w-auto object-contain"
                />
                <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                  <span className="material-symbols-outlined text-outline">close</span>
                </button>
              </div>
              <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="space-y-1">
                  {filteredNavItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-4 py-3 px-6 transition-all ${location.pathname === item.path
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-600'
                          : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        <MaterialIcon name={item.icon} active={location.pathname === item.path} />
                        <span className="font-bold text-sm uppercase tracking-wide">{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-40 px-8 py-4 flex justify-between items-center w-full shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-surface-container-low rounded-xl text-outline"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex flex-col">
              <nav className="flex text-[10px] uppercase tracking-widest text-outline mb-1 font-bold">
                <span>Admin</span>
                <span className="mx-2 opacity-50">/</span>
                <span className="text-primary-container capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</span>
              </nav>
              <h2 className="text-xl font-extrabold tracking-tighter text-emerald-900 dark:text-white uppercase">
                {location.pathname.split('/').pop() || 'Dashboard Ringkasan'}
              </h2>
            </div>
          </div>


          <div className="flex items-center gap-6">
            <div className="relative hidden md:block group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm group-focus-within:text-primary transition-colors">search</span>
              <input
                className="bg-surface-container-low dark:bg-emerald-900/20 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                placeholder="Cari data..."
                type="text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setShowNotification('Pencarian sedang disiapkan...');
                }}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="text-slate-500 hover:text-primary transition-colors relative flex items-center justify-center p-2 rounded-full hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-pulse"></span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotifOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)}></div>
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden z-20"
                      >
                        <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/50">
                          <h3 className="text-sm font-extrabold text-emerald-950 dark:text-white">Notifikasi</h3>
                          {notifications.length > 0 && (
                            <button 
                              onClick={async () => {
                                try {
                                  await api.patch('/contact/messages/read-all');
                                  fetchNotifications();
                                  setUnreadCount(0);
                                } catch (e) {
                                  console.error('Failed to mark all as read', e);
                                }
                              }}
                              className="text-[10px] text-primary font-bold hover:underline"
                            >
                              Tandai Semua Dibaca
                            </button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              Tidak ada notifikasi
                            </div>
                          ) : (
                            notifications.map((notif: any) => (
                              <div 
                                key={notif.id} 
                                onClick={async () => {
                                  try {
                                    await api.patch(`/contact/messages/${notif.id}/read`, { isRead: true });
                                    fetchNotifications();
                                  } catch (e) {
                                    console.error('Failed to mark as read', e);
                                  }
                                }}
                                className="p-4 border-b border-outline-variant/5 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                              >
                                <p className="text-sm font-bold text-on-surface">{notif.text}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="p-2 border-t border-outline-variant/10 bg-surface-container-low/50 flex gap-2">
                          <Link
                            to="/admin/contact"
                            onClick={() => setIsNotifOpen(false)}
                            className="flex-1 py-2 text-xs font-bold text-primary hover:underline text-center"
                          >
                            Lihat Semua
                          </Link>
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation();
                              setIsNotifOpen(false); 
                            }} 
                            className="flex-1 py-2 text-xs font-bold text-outline hover:underline"
                          >
                            Tutup
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              {user?.role === 'SUPER_ADMIN' && (
                <button
                  onClick={() => navigate('/admin/config')}
                  className="text-slate-500 hover:text-primary transition-colors"
                  title="Pengaturan Situs"
                >
                  <span className="material-symbols-outlined">settings</span>
                </button>
              )}
              <button
                onClick={toggleTheme}
                className="text-slate-500 hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low dark:hover:bg-emerald-900/30"
                title={theme === 'light' ? 'Mode Malam' : 'Mode Terang'}
              >
                <span className="material-symbols-outlined">
                  {theme === 'light' ? 'dark_mode' : 'light_mode'}
                </span>
              </button>

              <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 p-1.5 rounded-xl transition-all active:scale-95"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-extrabold text-on-surface dark:text-white">{user?.name || 'Admin User'}</p>
                    <p className="text-[10px] text-outline font-bold uppercase tracking-wider">{user?.role || 'Super Admin'}</p>
                  </div>
                  <div className="relative">
                    <img
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-primary-fixed object-cover"
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-white dark:border-emerald-950 rounded-full"></div>
                  </div>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden z-20"
                      >
                        <div className="p-4 border-b border-outline-variant/10">
                          <p className="text-sm font-black text-emerald-950 dark:text-white">{user?.name || 'Admin User'}</p>
                          <p className="text-[10px] text-outline font-bold truncate">{user?.email || 'admin@wahanadata.co.id'}</p>
                        </div>
                        <div className="p-2 space-y-1">
                          <button
                            onClick={() => { setIsProfileOpen(false); navigate('/admin/profile'); }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 rounded-xl transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">person</span>
                            Pengaturan Profil
                          </button>
                          <button
                            onClick={() => { setIsProfileOpen(false); setShowSecurity(true); }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 rounded-xl transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">shield</span>
                            Keamanan
                          </button>
                        </div>
                        <div className="p-2 border-t border-outline-variant/10">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-white gradient-btn rounded-xl shadow-md transition-all"
                          >
                            <span className="material-symbols-outlined text-lg">logout</span>
                            Keluar Sistem
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Quick Notification Bubble */}
          <AnimatePresence>
            {showNotification && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 right-8 z-[100] bg-emerald-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/20"
              >
                <span className="material-symbols-outlined text-emerald-400">info</span>
                <span className="font-bold text-sm">{showNotification}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Content */}
        <div className="p-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>

        {/* FAQ Modal */}
        <AnimatePresence>
          {showFaq && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowFaq(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-surface-container-lowest rounded-3xl w-full max-w-xl relative z-10 border border-outline-variant/20 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-8 pb-6 border-b border-outline-variant/10 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-emerald-600 text-2xl">help_center</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-on-surface">Pusat Bantuan</h2>
                      <p className="text-xs text-outline font-bold mt-0.5">Panduan penggunaan WDU CMS Admin</p>
                    </div>
                  </div>
                  <button onClick={() => setShowFaq(false)} className="text-outline hover:text-on-surface transition-colors p-1">
                    <span className="material-symbols-outlined text-2xl">close</span>
                  </button>
                </div>

                {/* FAQ List */}
                <div className="overflow-y-auto flex-1 p-6 space-y-3">
                  {[
                    { icon: 'edit_note', q: 'Cara edit konten halaman website?', a: 'Buka menu Halaman di sidebar → klik tombol EDIT KONTEN pada halaman yang ingin diubah → isi field yang tersedia → klik SIMPAN PERUBAHAN. Perubahan akan langsung tampil di website publik.' },
                    { icon: 'design_services', q: 'Cara tambah atau edit layanan?', a: 'Buka menu Layanan → klik TAMBAH LAYANAN untuk membuat baru, atau klik tombol EDIT pada kartu layanan yang sudah ada. Layanan yang statusnya "Hidden" tidak akan tampil di website.' },
                    { icon: 'work_history', q: 'Cara tambah project/pengalaman?', a: 'Buka menu Pengalaman → klik TAMBAH PROJECT → isi judul, nama klien, tahun, dan URL foto → klik SIMPAN. Klik EDIT PROJECT untuk mengubah data yang sudah ada.' },
                    { icon: 'mail', q: 'Cara lihat dan kelola pesan masuk?', a: 'Buka menu Pesan → semua pesan dari form kontak website akan muncul di sini. Klik ikon titik tiga (...) di tiap baris untuk melihat detail atau menghapus pesan.' },
                    { icon: 'perm_media', q: 'Cara kelola foto dan media?', a: 'Buka menu Media untuk melihat dan mengunggah aset gambar. URL gambar yang diunggah bisa langsung dipakai di form edit halaman atau layanan.' },
                    { icon: 'settings_suggest', q: 'Cara ubah informasi kontak perusahaan?', a: 'Buka menu Pengaturan → ubah nama website, tagline, email, nomor telepon, atau link YouTube → klik SIMPAN PERUBAHAN.' },
                    { icon: 'person', q: 'Cara ganti password akun admin?', a: 'Klik foto profil di pojok kanan atas header → pilih Pengaturan Profil. Fitur ganti password akan segera tersedia.' },
                  ].map((faq, i) => (
                    <div key={i} className="border border-outline-variant/10 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-emerald-600 text-lg flex-shrink-0">{faq.icon}</span>
                        <span className="flex-1 text-sm font-bold text-on-surface">{faq.q}</span>
                        <span className={`material-symbols-outlined text-outline transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>expand_more</span>
                      </button>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="px-5 pb-4 pt-2 text-sm text-outline leading-relaxed border-t border-outline-variant/10 bg-emerald-50/50 dark:bg-emerald-900/10">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-outline-variant/10 flex-shrink-0 bg-surface-container-low/50">
                  <p className="text-center text-xs text-outline font-bold">
                    Butuh bantuan lebih lanjut? Hubungi tim IT di{' '}
                    <a href="mailto:wahanadata@yahoo.com" className="text-emerald-600 hover:underline">wahanadata@yahoo.com</a>
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Security Modal */}
        <AnimatePresence>
          {showSecurity && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowSecurity(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-surface-container-lowest rounded-3xl w-full max-w-md relative z-10 border border-outline-variant/20 shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-emerald-600">shield</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-on-surface">Keamanan Akun</h2>
                    </div>
                  </div>
                  <button onClick={() => setShowSecurity(false)} className="text-outline hover:text-on-surface p-1">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-outline mb-1 uppercase tracking-wider">Password Lama</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-outline mb-1 uppercase tracking-wider">Password Baru</label>
                    <input type="password" placeholder="Minimal 8 karakter" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-outline mb-1 uppercase tracking-wider">Konfirmasi Password Baru</label>
                    <input type="password" placeholder="Ulangi password baru" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>
                <div className="p-6 border-t border-outline-variant/10 flex gap-3 bg-surface-container-low/50">
                  <button onClick={() => setShowSecurity(false)} className="flex-1 py-3 text-sm font-bold text-outline bg-white dark:bg-emerald-900 border border-outline-variant/20 rounded-xl hover:bg-surface-container-high transition-colors">Batal</button>
                  <button onClick={() => { setShowNotification('Password berhasil diperbarui (Simulasi)'); setShowSecurity(false); }} className="flex-[2] py-3 text-sm font-bold text-white gradient-btn rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">Ganti Password</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}