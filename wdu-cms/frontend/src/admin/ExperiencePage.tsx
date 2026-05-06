import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import MediaPicker from '../components/MediaPicker';

interface Project {
  id: string;
  title: string;
  client: string;
  year: number;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  category: string;
}

export default function ExperiencePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '', client: '', category: '', year: new Date().getFullYear(), imageUrl: '', description: '', isActive: true
  });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | 'All'>('All');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const years = Array.from(new Set(projects.map(p => p.year))).sort((a, b) => b - a);
  const filteredProjects = selectedYear === 'All' 
    ? projects 
    : projects.filter(p => p.year === selectedYear);

  const openDrawer = (project: Project | null = null) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({
        title: '', client: '', category: '', year: new Date().getFullYear(), imageUrl: '', description: '', isActive: true
      });
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingProject(null);
    setFormData({
      title: '', client: '', category: '', year: new Date().getFullYear(), imageUrl: '', description: '', isActive: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, formData);
        setToast('Project berhasil diperbarui!');
      } else {
        await api.post('/projects', formData);
        setToast('Project baru berhasil dibuat!');
      }
      fetchProjects();
      closeDrawer();
    } catch (error) {
      console.error('Failed to save project:', error);
      setToast('Gagal menyimpan project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus project ini?')) {
      try {
        await api.delete(`/projects/${id}`);
        setToast('Project berhasil dihapus');
        fetchProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-[1600px] mx-auto pb-20">
      <div className="flex justify-between items-center bg-white dark:bg-emerald-900/10 p-8 rounded-2xl emerald-glow border border-outline-variant/10">
        <div>
          <h1 className="text-2xl font-extrabold text-emerald-900 dark:text-white">Projects</h1>
          <p className="text-sm text-outline font-medium mt-1">Daftar portfolio & kolaborasi project website Anda.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === 'All' ? 'All' : parseInt(e.target.value))}
              className="bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 px-6 py-3 pr-10 rounded-xl font-bold text-sm text-slate-700 dark:text-zinc-300 outline-none focus:outline-none focus:ring-0 transition-all cursor-pointer"
            >
              <option value="All">Semua Tahun</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => openDrawer()}
            className="gradient-btn text-white px-6 py-3 rounded-xl font-extrabold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Tambah Project
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Menyelaraskan Projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative p-8 rounded-[2.5rem] border transition-all duration-500 bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 dark:hover:border-primary/30"
            >
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                <button 
                  onClick={() => openDrawer(project)} 
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-primary hover:bg-blue-600 dark:hover:bg-primary hover:text-white dark:hover:text-zinc-950 shadow-sm"
                  title="Edit Project"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(project.id)} 
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-red-50 dark:bg-zinc-800 text-red-600 dark:text-zinc-500 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white shadow-sm"
                  title="Hapus Project"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>

              <div className="w-full h-40 bg-gray-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-start p-6 mb-8 overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="max-h-full max-w-[80%] object-contain drop-shadow-sm" />
                ) : (
                  <div className="flex flex-col items-start gap-2 text-gray-300 dark:text-zinc-800">
                    <span className="material-symbols-outlined text-4xl">image</span>
                    <span className="text-[8px] font-black uppercase tracking-widest">No Logo</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-black text-lg tracking-tight text-gray-900 dark:text-white leading-tight">{project.title}</h3>
                  <span className="text-[10px] font-black text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded flex-shrink-0">{project.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-black text-green-600 dark:text-primary uppercase tracking-[0.2em]">{project.client}</p>
                  <span className="text-[10px] text-gray-300 dark:text-zinc-700">•</span>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{project.category}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 dark:border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${project.isActive ? 'bg-green-600 dark:bg-primary' : 'bg-gray-300 dark:bg-zinc-700'}`}></span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${project.isActive ? 'text-green-600 dark:text-primary' : 'text-gray-400 dark:text-zinc-600'}`}>{project.isActive ? 'Aktif' : 'Non-aktif'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
              onClick={(e) => e.stopPropagation()}
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
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">{editingProject ? 'Edit Project' : 'Project Baru'}</h2>
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-0.5">{editingProject ? 'Perbarui informasi' : 'Tambah project baru'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
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
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Judul Project</label>
                  <input 
                    required
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Client / Instansi</label>
                    <input 
                      required
                      className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                      value={formData.client}
                      onChange={e => setFormData({...formData, client: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Tahun</label>
                    <input 
                      type="number"
                      required
                      className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                      value={formData.year}
                      onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Kategori</label>
                  <input 
                    required
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                    value={formData.category || ''}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    placeholder="Contoh: Web Development, Research, dll."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center justify-between">
                    Logo / Gambar Project
                    {formData.imageUrl && <span className="text-[8px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">Asset Media</span>}
                  </label>
                  <div className="relative flex gap-2">
                    <input 
                      required
                      className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all pr-14 dark:text-white"
                      value={formData.imageUrl || ''}
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setIsPickerOpen(true)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all shadow-sm active:scale-90"
                      title="Pilih Gambar dari Media"
                    >
                      <span className="material-symbols-outlined text-xl">image</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Deskripsi</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none dark:text-white"
                    value={formData.description || ''}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-3 py-1">
                  <input 
                    type="checkbox"
                    id="isProjectActive"
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="w-5 h-5 rounded-lg border-none transition-all bg-gray-100 dark:bg-zinc-800 accent-green-600 dark:accent-emerald-400"
                  />
                  <label htmlFor="isProjectActive" className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-zinc-500">Project Aktif / Tampilkan</label>
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
          setFormData(p => ({ ...p, imageUrl: url }));
          setIsPickerOpen(false);
        }}
      />
    </div>
  );
}
