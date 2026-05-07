import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import MediaPicker from '../components/MediaPicker';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  isActive: boolean;
  order: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '', description: '', icon: 'analytics', isActive: true
  });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => { fetchServices(); }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/services');
      setServices(res.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDrawer = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    } else {
      setEditingService(null);
      setFormData({ title: '', description: '', icon: 'analytics', isActive: true });
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingService(null);
    setFormData({ title: '', description: '', icon: 'analytics', isActive: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, formData);
        setToast('Layanan berhasil diperbarui!');
      } else {
        await api.post('/services', formData);
        setToast('Layanan baru berhasil dibuat!');
      }
      fetchServices();
      closeDrawer();
    } catch (error) {
      console.error('Failed to save service:', error);
      setToast('Gagal menyimpan layanan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus layanan ini?')) {
      try {
        await api.delete(`/services/${id}`);
        setToast('Layanan berhasil dihapus');
        fetchServices();
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
    }
  };

  const handleReorder = async (draggedId: string, targetId: string) => {
    const draggedIndex = services.findIndex(s => s.id === draggedId);
    const targetIndex = services.findIndex(s => s.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newServices = [...services];
    const [draggedItem] = newServices.splice(draggedIndex, 1);
    newServices.splice(targetIndex, 0, draggedItem);
    
    // Update order values
    const orders = newServices.map((service, index) => ({
      id: service.id,
      order: index + 1
    }));
    
    setServices(newServices);
    
    try {
      await api.patch('/services/reorder', { orders });
      setToast('Urutan layanan diperbarui');
    } catch (error) {
      console.error('Failed to reorder services:', error);
      setToast('Gagal mengubah urutan');
      fetchServices(); // Revert on error
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-[1600px] mx-auto pb-20">
      <div className="flex justify-between items-center bg-white dark:bg-emerald-900/10 p-8 rounded-2xl emerald-glow border border-outline-variant/10">
        <div>
          <h1 className="text-2xl font-extrabold text-emerald-900 dark:text-white">Layanan</h1>
          <p className="text-sm text-outline font-medium mt-1">Manajemen solusi & kapabilitas untuk website Anda.</p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">drag_indicator</span>
            Drag & Drop untuk mengatur urutan
          </p>
        </div>
        <button 
          onClick={() => openDrawer()}
          className="gradient-btn text-white px-6 py-3 rounded-xl font-extrabold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Tambah Layanan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Menyelaraskan Portofolio Layanan...</div>
        ) : services.map((service, i) => (
          <motion.div 
            key={service.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            draggable
            onDragStart={() => setDragId(service.id)}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverId(service.id);
            }}
            onDragLeave={() => setDragOverId(null)}
            onDrop={() => {
              if (dragId && dragId !== service.id) {
                handleReorder(dragId, service.id);
              }
              setDragId(null);
              setDragOverId(null);
            }}
            onDragEnd={() => {
              setDragId(null);
              setDragOverId(null);
            }}
            className={`p-8 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 dark:hover:border-primary/30 ${dragOverId === service.id ? 'border-primary border-2 scale-105' : ''} ${dragId === service.id ? 'opacity-50' : ''}`}
          >
            <div className="absolute top-6 left-6 cursor-grab active:cursor-grabbing z-20">
              <span className="material-symbols-outlined text-zinc-300 dark:text-zinc-600 hover:text-primary transition-colors">drag_indicator</span>
            </div>
            
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <button 
                onClick={() => openDrawer(service)} 
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-primary hover:bg-blue-600 dark:hover:bg-primary hover:text-white dark:hover:text-zinc-950 shadow-sm"
                title="Edit Layanan"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
              </button>
              <button 
                onClick={() => handleDelete(service.id)} 
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-red-50 dark:bg-zinc-800 text-red-600 dark:text-zinc-500 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white shadow-sm"
                title="Hapus Layanan"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>

            <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-110 pointer-events-none">
              {(service.icon?.startsWith('http') || service.icon?.startsWith('/')) ? (
                <img src={service.icon} alt="" className="w-40 h-40 object-contain grayscale" />
              ) : (
                <span className="material-symbols-outlined text-[150px] text-green-700 dark:text-primary">{service.icon || 'analytics'}</span>
              )}
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-green-50 dark:bg-zinc-800/50 text-green-700 dark:text-primary group-hover:scale-110 transition-transform duration-500 shadow-inner">
                {(service.icon?.startsWith('http') || service.icon?.startsWith('/')) ? (
                  <img src={service.icon} alt="" className="w-8 h-8 object-contain" />
                ) : (
                  <span className="material-symbols-outlined text-4xl">{service.icon || 'analytics'}</span>
                )}
              </div>
             
              <h3 className="font-black text-xl mb-3 tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-sm line-clamp-3 leading-relaxed mb-8 font-medium text-gray-500 dark:text-zinc-500">{service.description}</p>
             
              <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${service.isActive ? 'bg-green-600 dark:bg-primary' : 'bg-gray-300 dark:bg-zinc-700'}`}></span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${service.isActive ? 'text-green-600 dark:text-primary' : 'text-gray-400 dark:text-zinc-600'}`}>{service.isActive ? 'Aktif' : 'Non-aktif'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Side Panel Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm cursor-pointer"
            />
            
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-slate-50 dark:bg-zinc-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-zinc-800"
            >
              {/* Drawer Header */}
              <div className="px-8 py-6 bg-white dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-white"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">{editingService ? 'Edit Layanan' : 'Layanan Baru'}</h2>
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-0.5">{editingService ? 'Perbarui informasi' : 'Tambah layanan baru'}</p>
                  </div>
                </div>
                <button
                  type="submit"
                  form="service-form"
                  disabled={isSaving}
                  className="px-4 py-2 bg-primary text-zinc-950 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-green-700 dark:hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm active:scale-95"
                >
                  {isSaving ? (
                    <>
                        <span className="w-3 h-3 border-2 border-zinc-950/40 border-t-zinc-950 rounded-full animate-spin"></span>
                        Menyimpan...
                      </>
                  ) : (
                    <>
                        <span className="material-symbols-outlined text-base">cloud_upload</span>
                        Simpan
                      </>
                  )}
                </button>
              </div>

              {/* Drawer Content */}
              <form id="service-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Nama Layanan</label>
                  <input 
                    required
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center justify-between">
                    Ikon (Material Symbol / URL)
                    {formData.icon && (formData.icon.startsWith('http') || formData.icon.startsWith('/')) && (
                      <span className="text-[8px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">Asset Media</span>
                    )}
                  </label>
                  <div className="relative flex gap-2">
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 dark:text-zinc-600">
                        {(formData.icon?.startsWith('http') || formData.icon?.startsWith('/')) ? 'image' : (formData.icon || 'analytics')}
                      </span>
                      <input 
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all text-sm font-medium bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-900 dark:text-white"
                        placeholder="e.g. analytics"
                        value={formData.icon || ''}
                        onChange={e => setFormData({...formData, icon: e.target.value})}
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsPickerOpen(true)}
                      className="p-3 bg-green-50 dark:bg-zinc-800 text-green-700 dark:text-emerald-400 rounded-xl hover:bg-green-700 dark:hover:bg-emerald-400 hover:text-white dark:hover:text-zinc-950 transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined">image</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Deskripsi</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none dark:text-white"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input 
                    type="checkbox"
                    id="isServiceActive"
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="w-5 h-5 rounded-lg border-none transition-all bg-gray-100 dark:bg-zinc-800 accent-green-600 dark:accent-emerald-400"
                  />
                  <label htmlFor="isServiceActive" className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-zinc-500">Layanan Aktif</label>
                </div>

                <div className="h-10"></div>
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
          setFormData(p => ({ ...p, icon: url }));
          setIsPickerOpen(false);
        }}
      />
    </div>
  );
}
