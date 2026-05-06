import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clientService, Client } from '../services/client';
import MediaPicker from '../components/MediaPicker';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '', logoUrl: '', isActive: true
  });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const { data } = await clientService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (client: Client | null = null) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({ name: '', logoUrl: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await clientService.update(editingClient.id, formData);
        setToast('Klien berhasil diperbarui!');
      } else {
        await clientService.create(formData as { name: string; logoUrl: string });
        setToast('Klien baru berhasil ditambahkan!');
      }
      fetchClients();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save client:', error);
      setToast('Gagal menyimpan klien');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus klien ini?')) {
      try {
        await clientService.delete(id);
        setToast('Klien berhasil dihapus');
        fetchClients();
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-[1600px] mx-auto pb-20">
      <div className="flex justify-between items-center bg-white dark:bg-emerald-900/10 p-8 rounded-2xl emerald-glow border border-outline-variant/10">
        <div>
          <h1 className="text-2xl font-extrabold text-emerald-900 dark:text-white">Klien Kami</h1>
          <p className="text-sm text-outline font-medium mt-1">Manajemen logo klien untuk website Anda.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="gradient-btn text-white px-6 py-3 rounded-xl font-extrabold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Tambah Klien
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Memuat data klien...</div>
        ) : clients.map((client, i) => (
          <motion.div 
            key={client.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-2xl border transition-all duration-500 group relative overflow-hidden bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 dark:hover:border-primary/30"
          >
            {/* Actions - Top Right Hover Only */}
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0 z-20">
              <button 
                onClick={() => handleOpenModal(client)} 
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-primary hover:bg-blue-600 dark:hover:bg-primary hover:text-white dark:hover:text-zinc-950 shadow-sm"
                title="Edit Klien"
              >
                <span className="material-symbols-outlined text-base">edit</span>
              </button>
              <button 
                onClick={() => handleDelete(client.id)} 
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-red-50 dark:bg-zinc-800 text-red-600 dark:text-zinc-500 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white shadow-sm"
                title="Hapus Klien"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            </div>

            {/* Client Logo */}
            <div className="w-full h-24 flex items-center justify-center p-4 mb-4 bg-gray-50 dark:bg-zinc-950 rounded-xl">
              <img 
                src={client.logoUrl} 
                alt={client.name}
                className="max-h-full max-w-full object-contain transition-all duration-500" 
              />
            </div>

            <div className="text-center">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{client.name}</h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`w-2 h-2 rounded-full ${client.isActive ? 'bg-green-600 dark:bg-primary' : 'bg-gray-300 dark:bg-zinc-700'}`}></span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${client.isActive ? 'text-green-600 dark:text-primary' : 'text-gray-400 dark:text-zinc-600'}`}>{client.isActive ? 'Aktif' : 'Non-aktif'}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto pt-20 pb-20">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 my-auto"
            >
              <div className="px-10 py-8 border-b border-gray-50 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/50">
                <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">{editingClient ? 'Edit Klien' : 'Klien Baru'}</h3>
                <button onClick={handleCloseModal} className="text-zinc-500 hover:text-zinc-300 transition-colors"><span className="material-symbols-outlined">close</span></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400 dark:text-zinc-500">Nama Klien</label>
                  <input 
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 focus:border-green-500 dark:focus:border-primary text-gray-900 dark:text-white"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400 dark:text-zinc-500">Logo URL</label>
                  <div className="relative flex gap-2">
                    <input 
                      required
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 focus:border-green-500 dark:focus:border-primary text-gray-900 dark:text-white"
                      value={formData.logoUrl || ''}
                      onChange={e => setFormData({...formData, logoUrl: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setIsPickerOpen(true)}
                      className="p-3 bg-green-50 dark:bg-zinc-800 text-green-700 dark:text-primary rounded-xl hover:bg-green-700 dark:hover:bg-primary hover:text-white dark:hover:text-zinc-950 transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined">image</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2">
                  <input 
                    type="checkbox"
                    id="isClientActive"
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="w-5 h-5 rounded-lg border-none transition-all bg-gray-100 dark:bg-zinc-800 accent-green-600 dark:accent-primary"
                  />
                  <label htmlFor="isClientActive" className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-zinc-500">Klien Aktif / Tampilkan</label>
                </div>
                <div className="pt-6 flex justify-end gap-4">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-3 text-xs font-black uppercase text-zinc-500 hover:text-zinc-300 tracking-widest transition-colors">Batal</button>
                  <button type="submit" className="px-10 py-3 bg-primary text-zinc-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 dark:hover:bg-emerald-400 transition-all shadow-lg active:scale-95">Simpan Klien</button>
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

      <MediaPicker 
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(url) => {
          setFormData(p => ({ ...p, logoUrl: url }));
          setIsPickerOpen(false);
        }}
      />
    </div>
  );
}
