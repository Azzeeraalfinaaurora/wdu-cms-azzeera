import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'IMAGE' | 'DOC'>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  const fetchMedia = async () => {
    try {
      const res = await api.get('/media');
      setMedia(res.data);
    } catch {
      setToast('Gagal memuat media');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMedia(); }, []);

  useEffect(() => {
    let dragCounter = 0;
    const onDragEnter = () => { dragCounter++; if (dragCounter === 1) setIsDragOver(true); };
    const onDragLeave = () => { dragCounter--; if (dragCounter === 0) setIsDragOver(false); };
    const onDragOver = (e: DragEvent) => { e.preventDefault(); };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDragOver(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) uploadFile(file);
    };
    document.addEventListener('dragenter', onDragEnter);
    document.addEventListener('dragleave', onDragLeave);
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDrop);
    return () => {
      document.removeEventListener('dragenter', onDragEnter);
      document.removeEventListener('dragleave', onDragLeave);
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('drop', onDrop);
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);
    try {
      await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setToast('File berhasil diunggah!');
      fetchMedia();
    } catch {
      setToast('Gagal mengunggah file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
    if (event.target) event.target.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus file ini permanen?')) return;
    try {
      await api.delete(`/media/${id}`);
      setToast('File dihapus');
      if (selectedFile?.id === id) setSelectedFile(null);
      fetchMedia();
    } catch {
      setToast('Gagal menghapus file');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Hapus ${selectedIds.length} file terpilih?`)) return;
    try {
      await Promise.all(selectedIds.map(id => api.delete(`/media/${id}`)));
      setToast(`${selectedIds.length} file berhasil dihapus`);
      setSelectedIds([]);
      setIsBulkMode(false);
      fetchMedia();
    } catch {
      setToast('Beberapa file gagal dihapus');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredMedia.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMedia.map(f => f.id));
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setToast('URL disalin ke clipboard!');
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const filteredMedia = media.filter(file => {
    if (filter === 'ALL') return true;
    if (filter === 'IMAGE') return file.mimeType.includes('image');
    if (filter === 'DOC') return !file.mimeType.includes('image');
    return true;
  });

  const filterTabs = [
    { id: 'ALL' as const, label: 'Semua', icon: 'grid_view' },
    { id: 'IMAGE' as const, label: 'Gambar', icon: 'image' },
    { id: 'DOC' as const, label: 'Dokumen', icon: 'description' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-20 relative">
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-emerald-600/10 dark:bg-emerald-500/10 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-emerald-500">
          <div className="text-center -mt-20">
            <span className="material-symbols-outlined text-6xl text-emerald-500">cloud_upload</span>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-3">Lepaskan file di sini</p>
            <p className="text-xs text-emerald-500/70 mt-1">{isUploading ? 'Mengunggah...' : 'File akan langsung diupload'}</p>
          </div>
        </div>
      )}

      {/* Minimalist Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm sticky top-4 z-30">
        <div>
          <h1 className="text-xl font-black text-emerald-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">photo_library</span>
            Media Library
          </h1>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isBulkMode ? (
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-1.5 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
              <span className="text-[10px] font-black text-emerald-700 dark:text-primary px-3 uppercase tracking-widest">{selectedIds.length} Item</span>
              <button 
                onClick={handleSelectAll}
                className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-primary px-4 py-2 hover:bg-emerald-100 dark:hover:bg-primary/10 rounded-xl transition-all"
              >
                {selectedIds.length === filteredMedia.length ? 'Batal Semua' : 'Pilih Semua'}
              </button>
              <button 
                onClick={handleBulkDelete}
                disabled={selectedIds.length === 0}
                className="bg-red-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
              >
                Hapus
              </button>
              <button onClick={() => { setIsBulkMode(false); setSelectedIds([]); }} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsBulkMode(true)}
                className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-primary transition-colors px-4 py-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-primary/5"
              >
                Pilih
              </button>
              <label className="gradient-btn text-white px-5 py-2.5 rounded-xl font-black text-[10px] flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer uppercase">
                <span className="material-symbols-outlined text-sm">add</span>
                Upload
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs - Compact */}
      <div className="flex items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-2">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === tab.id 
                  ? 'bg-emerald-900 dark:bg-primary text-white shadow-md' 
                  : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">{filteredMedia.length} Item</span>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="col-span-full py-32 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Memuat Media Library...</div>
      ) : filteredMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl">
          <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-zinc-800 mb-4">folder_off</span>
          <p className="text-sm font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest">Belum ada file</p>
          <p className="text-xs text-gray-400 dark:text-zinc-600 mt-1">Upload file pertama Anda menggunakan tombol di atas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredMedia.map((file, i) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => isBulkMode ? toggleSelect(file.id) : setSelectedFile(file)}
              className={`group relative aspect-square rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer ${
                selectedIds.includes(file.id) ? 'ring-4 ring-primary ring-inset' : 
                selectedFile?.id === file.id ? 'ring-4 ring-emerald-500 ring-inset' :
                'hover:shadow-2xl hover:scale-[1.02]'
              }`}
            >
              {/* Image Preview - Pure Visual */}
              <div className="w-full h-full bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
                {file.mimeType.includes('image') ? (
                  <img src={file.url} alt={file.filename} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-4xl text-emerald-600 dark:text-primary">description</span>
                    <span className="text-[8px] font-black uppercase text-gray-400 dark:text-zinc-500">{file.filename.split('.').pop()}</span>
                  </div>
                )}

                {/* Selection Indicator - Subtle Overlay */}
                <div className={`absolute top-3 left-3 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                  selectedIds.includes(file.id) ? 'bg-primary border-primary' : 'bg-black/20 border-white/50 opacity-0 group-hover:opacity-100'
                }`}>
                  {selectedIds.includes(file.id) && <span className="material-symbols-outlined text-white text-[12px] font-black">check</span>}
                </div>

                {/* Info Overlay - Visible on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                  <p className="text-[10px] font-bold text-white truncate mb-1">{file.filename}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-medium text-gray-300 uppercase tracking-widest">{formatSize(file.size)}</span>
                    <div className="flex gap-1">
                       <button onClick={(e) => { e.stopPropagation(); copyToClipboard(file.url); }} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition-all">
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Panel Modal - Minimalist */}
      <AnimatePresence>
        {selectedFile && !isBulkMode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFile(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-lg relative z-10 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 flex flex-col"
            >
              {/* Image Preview - Full Width */}
              <div className="w-full aspect-video bg-gray-50 dark:bg-zinc-950 flex items-center justify-center relative group">
                {selectedFile.mimeType.includes('image') ? (
                  <img src={selectedFile.url} alt="" className="w-full h-full object-contain" />
                ) : (
                  <span className="material-symbols-outlined text-6xl text-emerald-600 dark:text-primary">description</span>
                )}
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all flex items-center justify-center"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-emerald-900 dark:text-white truncate" title={selectedFile.filename}>
                    {selectedFile.filename}
                  </h3>
                  <div className="flex gap-4 mt-2">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Ukuran</span>
                      <span className="text-xs font-bold text-gray-600 dark:text-zinc-400">{formatSize(selectedFile.size)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Tipe</span>
                      <span className="text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase">{selectedFile.mimeType.split('/')[1]}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Ditambah</span>
                      <span className="text-xs font-bold text-gray-600 dark:text-zinc-400">{formatDate(selectedFile.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* URL Field - Compact */}
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1">URL File</label>
                  <div className="flex gap-2">
                    <input 
                      readOnly 
                      value={selectedFile.url} 
                      className="flex-1 px-4 py-2.5 rounded-xl text-[10px] font-medium bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 text-gray-500 outline-none"
                    />
                    <button 
                      onClick={() => copyToClipboard(selectedFile.url)}
                      className="px-4 py-2.5 bg-emerald-50 dark:bg-primary/10 text-emerald-600 dark:text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => window.open(selectedFile.url, '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 dark:hover:bg-primary/10 hover:text-emerald-600 dark:hover:text-primary transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    Buka File
                  </button>
                  <button 
                    onClick={() => { handleDelete(selectedFile.id); }}
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-red-100 dark:border-red-900/30 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
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
