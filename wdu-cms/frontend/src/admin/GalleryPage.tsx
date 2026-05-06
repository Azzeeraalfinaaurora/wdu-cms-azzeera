import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService, Gallery } from '../services/gallery';
import MediaPicker from '../components/MediaPicker';

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [formData, setFormData] = useState<Partial<Gallery>>({
    title: '', imageUrl: '', category: '', description: '', isActive: true
  });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchGalleries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await galleryService.getAll();
      console.log('Gallery data from API:', data);
      setGalleries(data);
      
      if (data.length === 0) {
        setToast('Galeri kosong. Silakan tambah galeri baru atau import dari website publik.');
      }
    } catch (error: any) {
      console.error('Failed to fetch gallery:', error);
      if (error?.response?.status === 401) {
        setError('Sesi login habis. Silakan login kembali.');
      } else {
        setError(error?.response?.data?.error || error?.message || 'Gagal memuat galeri');
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleOpenModal = (gallery: Gallery | null = null) => {
    if (gallery) {
      setEditingGallery(gallery);
      setFormData(gallery);
    } else {
      setEditingGallery(null);
      setFormData({ title: '', imageUrl: '', category: '', description: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGallery(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        title: formData.title?.trim() || 'Gallery Image',
      };

      if (editingGallery) {
        await galleryService.update(editingGallery.id, payload);
        setToast('Galeri berhasil diperbarui!');
      } else {
        await galleryService.create(payload as { title: string; imageUrl: string });
        setToast('Galeri baru berhasil ditambahkan!');
      }
      fetchGalleries();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save gallery:', error);
      setToast('Gagal menyimpan galeri');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus item galeri ini?')) {
      try {
        await galleryService.delete(id);
        setToast('Galeri berhasil dihapus');
        fetchGalleries();
      } catch (error) {
        console.error('Failed to delete gallery:', error);
      }
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const idx = galleries.findIndex(g => g.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === galleries.length - 1) return;

    const newGalleries = [...galleries];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newGalleries[idx], newGalleries[targetIdx]] = [newGalleries[targetIdx], newGalleries[idx]];

    const reordered = newGalleries.map((g, index) => ({ id: g.id, order: index + 1 }));
    setGalleries(newGalleries);

    try {
      await galleryService.reorder(reordered);
      setToast('Urutan berhasil diubah!');
    } catch {
      fetchGalleries();
      setToast('Gagal merubah urutan.');
    }
  };

  const handleImageSelect = (url: string) => {
    setFormData(p => ({ ...p, imageUrl: url }));
    setIsPickerOpen(false);
  };

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-[1600px] mx-auto pb-20">
        <div className="flex justify-between items-center bg-white dark:bg-emerald-900/10 p-8 rounded-2xl emerald-glow border border-outline-variant/10">
          <div>
            <h1 className="text-2xl font-extrabold text-emerald-900 dark:text-white">Galeri Kami</h1>
            <p className="text-sm text-outline font-medium mt-1">Kelola gambar galeri untuk website Anda.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleOpenModal()}
              className="gradient-btn text-white px-6 py-3 rounded-xl font-extrabold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase"
            >
              <span className="material-symbols-outlined">add_photo_alternate</span>
              Tambah Galeri
            </button>
          </div>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Memuat galeri...</div>
        ) : error ? (
          <div className="col-span-full py-20 text-center text-red-500 font-bold uppercase tracking-widest text-xs">{error}</div>
        ) : galleries.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-zinc-700">photo_library</span>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Belum ada galeri. Tambahkan galeri pertama Anda!</p>
          </div>
        ) : galleries.map((item, i) => (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800"
          >
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <button 
                onClick={() => handleOpenModal(item)} 
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-primary hover:bg-blue-600 dark:hover:bg-primary hover:text-white dark:hover:text-zinc-950 shadow-sm"
                title="Edit"
              >
                <span className="material-symbols-outlined text-base">edit</span>
              </button>
              <button 
                onClick={() => handleDelete(item.id)} 
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-red-50 dark:bg-zinc-800 text-red-600 dark:text-zinc-500 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white shadow-sm"
                title="Hapus"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            </div>


            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-full h-48 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            
            <div className="absolute top-3 left-3">
              <span className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-green-600' : 'bg-gray-300'}`}></span>
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
                <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">{editingGallery ? 'Edit Galeri' : 'Galeri Baru'}</h3>
                <button onClick={handleCloseModal} className="text-zinc-500 hover:text-zinc-300 transition-colors"><span className="material-symbols-outlined">close</span></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400 dark:text-zinc-500">Gambar</label>
                  <div className="relative flex gap-2">
                    <input 
                      required
                      placeholder="Masukkan URL gambar atau pilih dari media"
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 focus:border-green-500 dark:focus:border-primary text-gray-900 dark:text-white"
                      value={formData.imageUrl || ''}
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})}
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

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400 dark:text-zinc-500">Judul (Opsional)</label>
                  <input 
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 focus:border-green-500 dark:focus:border-primary text-gray-900 dark:text-white"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Contoh: Kegiatan Perusahaan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400 dark:text-zinc-500">Kategori (Opsional)</label>
                    <input 
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 focus:border-green-500 dark:focus:border-primary text-gray-900 dark:text-white"
                      value={formData.category || ''}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      placeholder="Event / Kantor"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input 
                      type="checkbox"
                      id="isGalleryActive"
                      checked={formData.isActive}
                      onChange={e => setFormData({...formData, isActive: e.target.checked})}
                      className="w-5 h-5 rounded-lg border-none transition-all bg-gray-100 dark:bg-zinc-800 accent-green-600 dark:accent-primary"
                    />
                    <label htmlFor="isGalleryActive" className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-zinc-500">Aktif</label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400 dark:text-zinc-500">Deskripsi (Opsional)</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 focus:border-green-500 dark:focus:border-primary text-gray-900 dark:text-white resize-none"
                    value={formData.description || ''}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="pt-6 flex justify-end gap-4">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-3 text-xs font-black uppercase text-zinc-500 hover:text-zinc-300 tracking-widest transition-colors">Batal</button>
                  <button type="submit" className="px-10 py-3 bg-primary text-zinc-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 dark:hover:bg-emerald-400 transition-all shadow-lg active:scale-95">Simpan</button>
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
        onSelect={handleImageSelect}
      />
    </div>
  );
}
