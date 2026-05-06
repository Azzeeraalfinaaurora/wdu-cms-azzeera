import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { userService, User } from '../services/user';
import { useAuthStore } from '../store/authStore';

export default function UsersPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<'add' | 'edit' | 'reset' | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'EDITOR' as 'EDITOR' | 'SUPER_ADMIN' });
  const [error, setError] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'SUPER_ADMIN') {
      navigate('/admin/dashboard');
      return;
    }
    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await userService.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type: 'add' | 'edit' | 'reset', user?: User) => {
    setError('');
    setSelectedUser(user || null);
    if (type === 'edit' && user) {
      setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    } else if (type === 'add') {
      setFormData({ name: '', email: '', password: '', role: 'EDITOR' });
    } else if (type === 'reset') {
      setFormData({ ...formData, password: '' });
    }
    setShowModal(type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (showModal === 'add') {
        await userService.create(formData);
      } else if (showModal === 'edit' && selectedUser) {
        await userService.update(selectedUser.id, { name: formData.name, email: formData.email, role: formData.role });
      } else if (showModal === 'reset' && selectedUser) {
        await userService.resetPassword(selectedUser.id, formData.password);
      }
      setShowModal(null);
      setToast(showModal === 'add' ? 'User berhasil ditambahkan!' : showModal === 'edit' ? 'User berhasil diperbarui!' : 'Password berhasil direset!');
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Terjadi kesalahan sistem');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        await userService.delete(id);
        setToast('User berhasil dihapus');
        fetchUsers();
      } catch (err) {
        setToast('Gagal menghapus user');
      }
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center bg-white dark:bg-emerald-900/10 p-8 rounded-2xl emerald-glow border border-outline-variant/10">
        <div>
          <h1 className="text-2xl font-extrabold text-emerald-900 dark:text-white uppercase tracking-tight">Manajemen Admin</h1>
          <p className="text-sm text-outline font-medium mt-1">Kelola akun yang memiliki akses ke dashboard CMS ini.</p>
        </div>
        <button 
          onClick={() => handleOpenModal('add')}
          className="gradient-btn text-white px-6 py-3 rounded-xl font-extrabold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">person_add</span>
          TAMBAH ADMIN
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-emerald-950/20 rounded-2xl emerald-glow overflow-hidden border border-outline-variant/10"
      >
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low dark:bg-emerald-900/30 text-outline text-[10px] uppercase tracking-widest font-extrabold">
              <th className="px-8 py-4">Nama Pengguna</th>
              <th className="px-8 py-4">Role / Akses</th>
              <th className="px-8 py-4">Terdaftar Pada</th>
              <th className="px-8 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high dark:divide-emerald-900/30">
            {loading ? (
               <tr><td colSpan={4} className="p-8 text-center text-outline font-bold">Memuat data...</td></tr>
            ) : users.length === 0 ? (
               <tr><td colSpan={4} className="p-8 text-center text-outline font-bold">Tidak ada data admin.</td></tr>
            ) : users.map((user) => (
              <tr key={user.id} className="hover:bg-emerald-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-on-surface">{user.name}</p>
                      <p className="text-[10px] text-outline font-bold">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 text-[10px] font-extrabold rounded-md shadow-sm ${
                    user.role === 'SUPER_ADMIN' ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm font-bold text-on-surface-variant opacity-70">
                  {new Date(user.createdAt!).toLocaleDateString('id-ID')}
                </td>
                <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                  <button 
                    onClick={() => handleOpenModal('reset', user)}
                    className="p-2 text-outline hover:text-primary transition-all" title="Reset Password"
                  >
                    <span className="material-symbols-outlined font-bold">lock_reset</span>
                  </button>
                  <button 
                    onClick={() => handleOpenModal('edit', user)}
                    className="p-2 text-outline hover:text-tertiary transition-all" title="Edit Admin"
                  >
                    <span className="material-symbols-outlined font-bold">edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-2 text-outline hover:text-error transition-all" title="Hapus Admin"
                  >
                    <span className="material-symbols-outlined font-bold">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Modal Add / Edit / Reset */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-emerald-950 rounded-3xl w-full max-w-md relative z-10 border border-outline-variant/20 shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSubmit}>
                <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-emerald-50/30">
                  <h3 className="text-lg font-extrabold text-emerald-900 dark:text-white uppercase tracking-tight">
                    {showModal === 'add' ? 'Tambah Admin Baru' : showModal === 'edit' ? 'Edit Admin' : 'Reset Password'}
                  </h3>
                  <button type="button" onClick={() => setShowModal(null)} className="text-outline hover:text-on-surface">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {error && (
                    <div className="p-3 bg-error/10 text-error text-xs font-bold rounded-xl border border-error/20">
                      {error}
                    </div>
                  )}

                  {showModal !== 'reset' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-extrabold text-outline uppercase tracking-widest mb-1 ml-1">Nama Lengkap</label>
                        <input 
                          required
                          type="text" 
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-outline uppercase tracking-widest mb-1 ml-1">Email</label>
                        <input 
                          required
                          type="email" 
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-outline uppercase tracking-widest mb-1 ml-1">Role / Hak Akses</label>
                        <select 
                          value={formData.role}
                          onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                          className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                        >
                          <option value="EDITOR">EDITOR</option>
                          <option value="SUPER_ADMIN">SUPER ADMIN</option>
                        </select>
                      </div>
                    </>
                  )}

                  {(showModal === 'add' || showModal === 'reset') && (
                    <div>
                      <label className="block text-[10px] font-extrabold text-outline uppercase tracking-widest mb-1 ml-1">
                        {showModal === 'add' ? 'Password' : 'Password Baru'}
                      </label>
                      <input 
                        required
                        type="password" 
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                      />
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-outline-variant/10 flex gap-3 bg-surface-container-low/30">
                  <button 
                    type="button"
                    onClick={() => setShowModal(null)} 
                    className="flex-1 py-3 text-sm font-bold text-outline hover:bg-white dark:hover:bg-emerald-900 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-3 text-sm font-bold text-white gradient-btn rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {showModal === 'add' ? 'Simpan Admin' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
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
