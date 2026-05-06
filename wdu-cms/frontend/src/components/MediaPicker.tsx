import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function MediaPicker({ isOpen, onClose, onSelect }: MediaPickerProps) {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/media');
      setMedia(res.data);
    } catch (err) {
      console.error('Failed to fetch media');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMedia = media.filter(file => 
    file.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-emerald-950 w-full max-w-5xl h-full max-h-[80vh] rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-outline-variant/20 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <span className="material-symbols-outlined text-2xl">image_search</span>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-on-surface">Pilih Media</h2>
                  <p className="text-[10px] text-outline font-black tracking-widest uppercase mt-0.5">Klik pada gambar untuk memilih</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                  <input 
                    type="text" 
                    placeholder="Cari file..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white dark:bg-emerald-900/10 border border-outline-variant/20 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-2xl hover:bg-surface-container-high transition-colors flex items-center justify-center text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-sm font-black text-outline animate-pulse tracking-widest uppercase">Memuat Galeri...</p>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-outline opacity-30">
                  <span className="material-symbols-outlined text-8xl mb-4">folder_off</span>
                  <p className="text-lg font-extrabold uppercase tracking-widest">Tidak ada file ditemukan</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredMedia.map((file) => (
                    <motion.div
                      key={file.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelect(file.url)}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-square bg-surface-container-low dark:bg-emerald-900/10 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-primary transition-all relative">
                        {file.mimeType.includes('image') ? (
                          <img 
                            src={file.url} 
                            alt={file.filename} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                             <span className="material-symbols-outlined text-4xl text-outline/50">description</span>
                             <span className="text-[10px] font-black uppercase tracking-tighter opacity-50 px-2 text-center truncate w-full">{file.filename}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all flex items-center justify-center">
                          <div className="bg-white text-primary p-2 rounded-xl scale-0 group-hover:scale-100 transition-transform shadow-xl">
                            <span className="material-symbols-outlined font-black">check_circle</span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-[10px] font-bold text-on-surface truncate px-1" title={file.filename}>
                        {file.filename}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-outline-variant/10 bg-surface-container-low/30 text-right">
               <button 
                onClick={onClose}
                className="px-8 py-3 bg-white dark:bg-emerald-900/20 border border-outline-variant/20 rounded-xl font-extrabold text-sm hover:bg-surface-container-high transition-colors tracking-widest"
               >
                BATAL
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
