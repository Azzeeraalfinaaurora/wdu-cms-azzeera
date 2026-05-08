import { useState, useEffect } from 'react';
import { Link, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

const MaterialIcon = ({ name, filled = false, className = '' }: { name: string; filled?: boolean; className?: string }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0` }}
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

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/contact/messages');
      const messages = res.data;
      const unreadMsgs = messages.filter((m: any) => !m.isRead);
      setUnreadCount(unreadMsgs.length);

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
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex font-body transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-[72px]'} hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out sticky top-0 h-screen z-50`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center border-b border-gray-100 dark:border-gray-800">
          {isSidebarOpen ? (
            <div className="flex items-center justify-between w-full px-5">
              <Link to="/admin" className="flex items-center">
                <img
                  src="https://wahanadata.co.id/img/wdu-ijo.png"
                  alt="Logo"
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 flex items-center justify-center transition-colors"
              >
                <MaterialIcon name="chevron_left" className="text-lg" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 flex items-center justify-center transition-colors"
              >
                <MaterialIcon name="chevron_right" className="text-lg" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-hidden hover:overflow-y-auto py-4 px-3 scrollbar-thin">
          <div className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3.5 h-11 px-4 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <MaterialIcon
                    name={item.icon}
                    filled={isActive}
                    className={`text-xl ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'}`}
                  />
                  {isSidebarOpen && (
                    <>
                      <span className="text-sm font-medium tracking-wide">{item.name}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto bg-emerald-500 text-white text-[10px] font-bold px-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <button
            onClick={() => setShowFaq(true)}
            className="flex items-center gap-3.5 h-11 px-4 rounded-xl transition-all text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-700 dark:hover:text-gray-200 w-full"
          >
            <MaterialIcon name="headset_mic" className="text-xl text-gray-400 dark:text-gray-500" />
            {isSidebarOpen && <span className="text-sm font-medium tracking-wide">Pusat Bantuan</span>}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 h-11 px-4 rounded-xl transition-all text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
          >
            <MaterialIcon name="logout" className="text-xl" />
            {isSidebarOpen && <span className="text-sm font-medium tracking-wide">Logout</span>}
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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-gray-900 z-[70] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="h-16 px-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <img
                  src="https://wahanadata.co.id/img/wdu-ijo.png"
                  alt="Logo"
                  className="h-8 w-auto object-contain"
                />
                <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-400 transition-colors">
                  <MaterialIcon name="close" className="text-lg" />
                </button>
              </div>
              <nav className="flex-1 py-4 px-3 overflow-y-auto">
                <div className="space-y-1">
                  {filteredNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3.5 h-11 px-4 rounded-xl transition-all ${
                          isActive
                            ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                        }`}
                      >
                        <MaterialIcon name={item.icon} filled={isActive} className={`text-xl ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                        <span className="text-sm font-medium tracking-wide">{item.name}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="ml-auto bg-emerald-500 text-white text-[10px] font-bold px-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </nav>
              <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
                <button
                  onClick={() => { setShowFaq(true); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3.5 h-11 px-4 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 w-full transition-all"
                >
                  <MaterialIcon name="headset_mic" className="text-xl" />
                  <span className="text-sm font-medium tracking-wide">Pusat Bantuan</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3.5 h-11 px-4 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-all"
                >
                  <MaterialIcon name="logout" className="text-xl" />
                  <span className="text-sm font-medium tracking-wide">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 h-16 flex items-center justify-between w-full border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500"
            >
              <MaterialIcon name="menu" className="text-xl" />
            </button>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                <span>Admin</span>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <span className="text-emerald-600 dark:text-emerald-400 capitalize font-medium">{location.pathname.split('/').pop() || 'Dashboard'}</span>
              </div>
              <h1 className="text-base font-semibold text-gray-900 dark:text-white mt-0.5">
                {location.pathname.split('/').pop() === 'dashboard' ? 'Dashboard Ringkasan' : location.pathname.split('/').pop() || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors relative"
              >
                <MaterialIcon name="notifications" className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-20"
                    >
                      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifikasi</h3>
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
                            className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
                          >
                            Tandai Dibaca
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-5 py-10 text-center text-xs text-gray-400 dark:text-gray-500">
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
                              className="px-5 py-3 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                            >
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.text}</p>
                              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{notif.time}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                        <Link
                          to="/admin/contact"
                          onClick={() => setIsNotifOpen(false)}
                          className="flex-1 text-center text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
                        >
                          Lihat Semua
                        </Link>
                        <button
                          onClick={() => setIsNotifOpen(false)}
                          className="flex-1 text-center text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 transition-colors"
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
                className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
                title="Pengaturan Situs"
              >
                <MaterialIcon name="settings" className="text-xl" />
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
              title={theme === 'light' ? 'Mode Malam' : 'Mode Terang'}
            >
              <MaterialIcon name={theme === 'light' ? 'dark_mode' : 'light_mode'} className="text-xl" />
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 pr-1 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">{user?.role || 'Super Admin'}</p>
                </div>
                <div className="relative">
                  <img
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-20"
                    >
                      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{user?.email || 'admin@wahanadata.co.id'}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => { setIsProfileOpen(false); navigate('/admin/profile'); }}
                          className="w-full flex items-center gap-3 px-3 h-9 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                        >
                          <MaterialIcon name="person" className="text-lg" />
                          Pengaturan Profil
                        </button>
                        <button
                          onClick={() => { setIsProfileOpen(false); setShowSecurity(true); }}
                          className="w-full flex items-center gap-3 px-3 h-9 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                        >
                          <MaterialIcon name="shield" className="text-lg" />
                          Keamanan
                        </button>
                      </div>
                      <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 h-9 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        >
                          <MaterialIcon name="logout" className="text-lg" />
                          Keluar Sistem
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {showNotification && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 right-8 z-[100] bg-gray-900 dark:bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3"
              >
                <MaterialIcon name="info" className="text-lg" />
                <span className="text-sm font-medium">{showNotification}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>

        {/* FAQ Modal */}
        <AnimatePresence>
          {showFaq && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowFaq(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-xl relative z-10 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
              >
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <MaterialIcon name="help_center" className="text-xl" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">Pusat Bantuan</h2>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Panduan penggunaan WDU CMS Admin</p>
                    </div>
                  </div>
                  <button onClick={() => setShowFaq(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-400 transition-colors">
                    <MaterialIcon name="close" className="text-lg" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 p-5 space-y-2">
                  {[
                    { icon: 'edit_note', q: 'Cara edit konten halaman website?', a: 'Buka menu Halaman di sidebar → klik tombol EDIT KONTEN pada halaman yang ingin diubah → isi field yang tersedia → klik SIMPAN PERUBAHAN. Perubahan akan langsung tampil di website publik.' },
                    { icon: 'design_services', q: 'Cara tambah atau edit layanan?', a: 'Buka menu Layanan → klik TAMBAH LAYANAN untuk membuat baru, atau klik tombol EDIT pada kartu layanan yang sudah ada. Layanan yang statusnya "Hidden" tidak akan tampil di website.' },
                    { icon: 'work_history', q: 'Cara tambah project/pengalaman?', a: 'Buka menu Pengalaman → klik TAMBAH PROJECT → isi judul, nama klien, tahun, dan URL foto → klik SIMPAN. Klik EDIT PROJECT untuk mengubah data yang sudah ada.' },
                    { icon: 'mail', q: 'Cara lihat dan kelola pesan masuk?', a: 'Buka menu Pesan → semua pesan dari form kontak website akan muncul di sini. Klik ikon titik tiga (...) di tiap baris untuk melihat detail atau menghapus pesan.' },
                    { icon: 'perm_media', q: 'Cara kelola foto dan media?', a: 'Buka menu Media untuk melihat dan mengunggah aset gambar. URL gambar yang diunggah bisa langsung dipakai di form edit halaman atau layanan.' },
                    { icon: 'settings_suggest', q: 'Cara ubah informasi kontak perusahaan?', a: 'Buka menu Pengaturan → ubah nama website, tagline, email, nomor telepon, atau link YouTube → klik SIMPAN PERUBAHAN.' },
                    { icon: 'person', q: 'Cara ganti password akun admin?', a: 'Klik foto profil di pojok kanan atas header → pilih Pengaturan Profil. Fitur ganti password akan segera tersedia.' },
                  ].map((faq, i) => (
                    <div key={i} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <MaterialIcon name={faq.icon} className="text-lg text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{faq.q}</span>
                        <MaterialIcon name="expand_more" className={`text-lg text-gray-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
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
                            <p className="px-4 pb-4 pt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/50 dark:bg-gray-800/30">
                  <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                    Butuh bantuan lebih lanjut? Hubungi tim IT di{' '}
                    <a href="mailto:wahanadata@yahoo.com" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">wahanadata@yahoo.com</a>
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
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md relative z-10 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <MaterialIcon name="shield" className="text-lg" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Keamanan Akun</h2>
                  </div>
                  <button onClick={() => setShowSecurity(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-400">
                    <MaterialIcon name="close" className="text-lg" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Password Lama</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 h-10 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 dark:focus:border-emerald-700 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Password Baru</label>
                    <input type="password" placeholder="Minimal 8 karakter" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 h-10 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 dark:focus:border-emerald-700 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Konfirmasi Password Baru</label>
                    <input type="password" placeholder="Ulangi password baru" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 h-10 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 dark:focus:border-emerald-700 outline-none transition-all" />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 bg-gray-50/50 dark:bg-gray-800/30">
                  <button onClick={() => setShowSecurity(false)} className="flex-1 h-10 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Batal</button>
                  <button onClick={() => { setShowNotification('Password berhasil diperbarui (Simulasi)'); setShowSecurity(false); }} className="flex-[2] h-10 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm">Ganti Password</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
