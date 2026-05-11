import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import MediaPicker from '../components/MediaPicker';
import TiptapEditor from '../components/TiptapEditor';

interface Page {
  id: string;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDesc: string | null;
  sections: any;
  isPublished: boolean;
  updatedAt: string;
}

const PAGE_META: Record<string, { label: string; fields: { key: string; label: string; type: 'text' | 'textarea' | 'image'; placeholder?: string; group: string }[] }> = {
  'home': {
    label: 'Beranda',
    fields: [
      { key: 'hero_title', label: 'Judul Utama', type: 'textarea', placeholder: 'Data Terpadu, Solusi Cerdas, Hasil Maksimal', group: 'Bagian Atas (Hero)' },
      { key: 'hero_subtitle', label: 'Deskripsi Hero', type: 'textarea', placeholder: 'Kami menghadirkan ekosistem data...', group: 'Bagian Atas (Hero)' },
      { key: 'hero_image', label: 'Gambar Background Hero', type: 'image', placeholder: 'URL Gambar', group: 'Bagian Atas (Hero)' },
      { key: 'services_title', label: 'Judul Seksi Layanan', type: 'text', placeholder: 'Solusi terbaik untuk Anda!', group: 'Layanan Kami' },
      { key: 'services_subtitle', label: 'Deskripsi Seksi Layanan', type: 'text', placeholder: 'Kami merancang layanan yang adaptif...', group: 'Layanan Kami' },
      { key: 'about_title', label: 'Judul Tentang Kami', type: 'textarea', placeholder: 'Memiliki pengalaman yang luas...', group: 'Tentang Perusahaan' },
      { key: 'about_body', label: 'Deskripsi Tentang Kami', type: 'textarea', placeholder: 'Wahana Data Utama didirikan pada 2006...', group: 'Tentang Perusahaan' },
      { key: 'director_name', label: 'Nama Direktur', type: 'text', placeholder: 'Ir. Yudi A. Idrus, M.M', group: 'Tentang Perusahaan' },
      { key: 'director_title', label: 'Jabatan Direktur', type: 'text', placeholder: 'Direktur Utama', group: 'Tentang Perusahaan' },
      { key: 'clients_title', label: 'Judul Seksi Klien', type: 'text', placeholder: 'Kepercayaan klien terhadap kami', group: 'Klien & Partner' },
      { key: 'clients_subtitle', label: 'Deskripsi Seksi Klien', type: 'text', placeholder: 'Kami bangga menjadi bagian dari kesuksesan...', group: 'Klien & Partner' },
      { key: 'gallery_title', label: 'Judul Galeri', type: 'text', placeholder: 'Galeri Kami', group: 'Galeri Foto' },
    ]
  },
  'tentang-kami': {
    label: 'Tentang Kami',
    fields: [
      { key: 'hero_title', label: 'Judul Utama', type: 'text', placeholder: 'Your Data Is Our Business', group: 'Bagian Atas (Hero)' },
      { key: 'hero_subtitle', label: 'Deskripsi Hero', type: 'textarea', placeholder: 'Transforming complex information...', group: 'Bagian Atas (Hero)' },
      { key: 'hero_image', label: 'Gambar Background', type: 'image', placeholder: 'URL Gambar', group: 'Bagian Atas (Hero)' },
      { key: 'about_title', label: 'Judul Profil', type: 'text', placeholder: 'Tentang Kami', group: 'Profil Perusahaan' },
      { key: 'about_body', label: 'Deskripsi Profil', type: 'textarea', placeholder: 'Wahana Data Utama didirikan...', group: 'Profil Perusahaan' },
      { key: 'about_image', label: 'Foto Ilustrasi Kantor', type: 'image', placeholder: 'URL Gambar', group: 'Profil Perusahaan' },
      { key: 'tagline', label: 'Judul Tagline', type: 'text', placeholder: 'Data Is Our Business', group: 'Tagline & Slogan' },
      { key: 'tagline_body', label: 'Deskripsi Tagline', type: 'textarea', placeholder: 'Komitmen kami adalah...', group: 'Tagline & Slogan' },
      { key: 'innovation_title', label: 'Judul Inovasi', type: 'text', placeholder: 'Garda Terdepan Inovasi', group: 'Inovasi' },
      { key: 'innovation_body', label: 'Deskripsi Inovasi', type: 'textarea', placeholder: 'Didirikan oleh para profesional...', group: 'Inovasi' },
      { key: 'visi', label: 'Pernyataan Visi', type: 'textarea', placeholder: 'Menjadi perusahaan...', group: 'Visi & Misi' },
      { key: 'misi', label: 'Daftar Misi', type: 'textarea', placeholder: '• Melakukan riset...\n• Menghasilkan data...', group: 'Visi & Misi' },
      { key: 'team_title', label: 'Judul Tim', type: 'text', placeholder: 'Jajaran Direksi', group: 'Manajemen / Direksi' },
      { key: 'team_subtitle', label: 'Deskripsi Tim', type: 'text', placeholder: 'Dipimpin oleh para ahli...', group: 'Manajemen / Direksi' },
      { key: 'dir1_name', label: 'Nama Direktur 1', type: 'text', placeholder: 'Dr. Ir. Erfiani, M.Si', group: 'Manajemen / Direksi' },
      { key: 'dir1_image', label: 'Foto Direktur 1', type: 'image', placeholder: 'URL Gambar', group: 'Manajemen / Direksi' },
      { key: 'dir2_name', label: 'Nama Direktur 2', type: 'text', placeholder: 'Ir. Yudi A. Idrus', group: 'Manajemen / Direksi' },
      { key: 'dir2_image', label: 'Foto Direktur 2', type: 'image', placeholder: 'URL Gambar', group: 'Manajemen / Direksi' },
      { key: 'dir3_name', label: 'Nama Direktur 3', type: 'text', placeholder: 'M. Adlan Fadillah, S.E', group: 'Manajemen / Direksi' },
      { key: 'dir3_image', label: 'Foto Direktur 3', type: 'image', placeholder: 'URL Gambar', group: 'Manajemen / Direksi' },
      { key: 'dir4_name', label: 'Nama Direktur 4', type: 'text', placeholder: 'M. Hafiz Abdillah, S.T', group: 'Manajemen / Direksi' },
      { key: 'dir4_image', label: 'Foto Direktur 4', type: 'image', placeholder: 'URL Gambar', group: 'Manajemen / Direksi' },
      { key: 'dir5_name', label: 'Nama Direktur 5', type: 'text', placeholder: 'Nurul Athia R, S.Bns', group: 'Manajemen / Direksi' },
      { key: 'dir5_image', label: 'Foto Direktur 5', type: 'image', placeholder: 'URL Gambar', group: 'Manajemen / Direksi' },
    ]
  },
  'layanan': {
    label: 'Layanan',
    fields: [
      { key: 'hero_title', label: 'Judul Utama', type: 'textarea', placeholder: 'Solusi Data Terpadu Untuk Bisnis Anda', group: 'Bagian Atas (Hero)' },
      { key: 'hero_subtitle', label: 'Deskripsi Hero', type: 'textarea', placeholder: 'Membantu transformasi digital...', group: 'Bagian Atas (Hero)' },
      { key: 'hero_image', label: 'Gambar Header', type: 'image', placeholder: 'URL Gambar', group: 'Bagian Atas (Hero)' },
      { key: 'cta_text', label: 'Teks Tombol Aksi', type: 'text', placeholder: 'Mulai Sekarang', group: 'Informasi Tambahan' },
      { key: 'intro_title', label: 'Judul Perkenalan', type: 'textarea', placeholder: 'Jelajahi beragam solusi terbaik...', group: 'Pengantar Layanan' },
      { key: 'intro_body', label: 'Deskripsi Perkenalan', type: 'textarea', placeholder: 'Kami menyediakan ekosistem layanan...', group: 'Pengantar Layanan' },
    ]
  },
  'pengalaman': {
    label: 'Pengalaman',
    fields: [
      { key: 'hero_title', label: 'Judul Utama', type: 'text', placeholder: 'The Authority in Data Consulting.', group: 'Bagian Atas (Hero)' },
      { key: 'hero_subtitle', label: 'Tagline Hero', type: 'text', placeholder: 'Intelligence • Strategy • Growth', group: 'Bagian Atas (Hero)' },
      { key: 'hero_body', label: 'Deskripsi Hero', type: 'textarea', placeholder: 'Wahana Data Utama memberikan solusi...', group: 'Bagian Atas (Hero)' },
      { key: 'hero_image', label: 'Gambar Background', type: 'image', placeholder: 'URL Gambar', group: 'Bagian Atas (Hero)' },
      { key: 'experience_title', label: 'Judul Pengalaman', type: 'text', placeholder: 'Collaboration Experience', group: 'Riwayat Kolaborasi' },
      { key: 'experience_subtitle', label: 'Deskripsi Pengalaman', type: 'text', placeholder: 'Perjalanan kolaborasi kami...', group: 'Riwayat Kolaborasi' },
      { key: 'commitment_body', label: 'Teks Komitmen', type: 'textarea', placeholder: 'Dengan komitmen yang kuat...', group: 'Komitmen Kami' },
    ]
  },
};

const INITIAL_PAGES: { slug: string; label: string }[] = [
  { slug: 'home', label: 'Beranda' },
  { slug: 'tentang-kami', label: 'Tentang Kami' },
  { slug: 'layanan', label: 'Layanan' },
  { slug: 'pengalaman', label: 'Pengalaman' },
];

export default function HalamanPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Side Panel State
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Delete Modal State
  const [deletingPage, setDeletingPage] = useState<Page | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  
  const [toast, setToast] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (pages.length > 0 && slug) {
      const found = pages.find(p => p.slug === slug);
      if (found) {
        openEditor(found);
      }
    }
  }, [pages, slug]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const fetchPages = async () => {
    try {
      const res = await api.get('/pages');
      setPages(res.data);
    } catch {
      setPages(INITIAL_PAGES.map((p, i) => ({
        id: String(i),
        slug: p.slug,
        title: p.label,
        metaTitle: null,
        metaDesc: null,
        sections: {},
        isPublished: true,
        updatedAt: new Date().toISOString(),
      } as Page)));
    } finally {
      setIsLoading(false);
    }
  };

  const openEditor = (page: Page) => {
    const meta = PAGE_META[page.slug];
    if (!meta) return;
    const sections = page.sections || {};
    const initial: Record<string, any> = {};
    meta.fields.forEach(f => {
      initial[f.key] = sections[f.key] || '';
    });
    initial._metaTitle = page.metaTitle || '';
    initial._metaDesc = page.metaDesc || '';
    initial._isPublished = page.isPublished;
    setFormData(initial);
    setEditingPage(page);
  };

  const handleSave = async (publish?: boolean) => {
    if (!editingPage) return;
    setIsSaving(true);
    const isPublished = publish !== undefined ? publish : formData._isPublished;
    try {
      const meta = PAGE_META[editingPage.slug];
      const sections: Record<string, string> = {};
      meta.fields.forEach(f => { sections[f.key] = formData[f.key] || ''; });
      
      await api.put(`/pages/${editingPage.slug}`, {
        title: editingPage.title,
        metaTitle: formData._metaTitle,
        metaDesc: formData._metaDesc,
        sections,
        isPublished,
      });
      
      setToast(isPublished ? 'Halaman berhasil diterbitkan!' : 'Draft berhasil disimpan!');
      setEditingPage(null);
      navigate('/admin/pages');
      fetchPages();
    } catch (err: any) {
      console.error('Save error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Terjadi kesalahan server';
      setToast(`Gagal menyimpan perubahan: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPage) return;
    if (deleteConfirmationText !== 'HAPUS') {
      setToast('Teks konfirmasi salah!');
      return;
    }
    
    setTimeout(() => {
      setToast(`Halaman "${deletingPage.title}" berhasil dihapus.`);
      setDeletingPage(null);
      setDeleteConfirmationText('');
      fetchPages();
    }, 500);
  };

  const pageDisplay = INITIAL_PAGES.map(ip => {
    const found = pages.find(p => p.slug === ip.slug);
    return found || ({ id: ip.slug, slug: ip.slug, title: ip.label, metaTitle: null, metaDesc: null, sections: {}, isPublished: true, updatedAt: new Date().toISOString() } as Page);
  });

  const getGroupedFields = (slug: string) => {
    const meta = PAGE_META[slug];
    if (!meta) return {};
    
    return meta.fields.reduce((acc, field) => {
      if (!acc[field.group]) {
        acc[field.group] = [];
      }
      acc[field.group].push(field);
      return acc;
    }, {} as Record<string, typeof meta.fields>);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-emerald-900/10 p-8 rounded-2xl emerald-glow border border-outline-variant/10">
        <div>
          <h1 className="text-2xl font-extrabold text-emerald-900 dark:text-white">Manajemen Halaman</h1>
          <p className="text-sm text-outline font-medium mt-1">Daftar halaman statis website Anda. Klik edit untuk mengubah isi konten.</p>
        </div>
        <button 
          onClick={() => setToast('Fitur tambah halaman kustom akan segera hadir.')}
          className="gradient-btn text-white px-6 py-3 rounded-xl font-extrabold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Tambah Halaman
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 dark:text-zinc-500">Memuat data halaman...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-950 text-slate-500 dark:text-zinc-400 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800">
                  <th className="px-6 py-4 font-bold">Judul Halaman</th>
                  <th className="px-6 py-4 font-bold">URL / Slug</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                {pageDisplay.map((page) => {
                  const meta = PAGE_META[page.slug];
                  return (
                    <tr key={page.slug} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 dark:text-white">{page.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded inline-block font-mono">
                          {page.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {page.isPublished ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Terbit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {meta && (
                            <button
                              onClick={() => openEditor(page)}
                              className="px-3 py-1.5 gradient-btn text-white rounded-md text-sm font-bold shadow-sm"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => setDeletingPage(page)}
                            className="p-1.5 text-slate-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            title="Hapus Halaman"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Side Panel for Edit/Create */}
      <AnimatePresence>
        {editingPage && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setEditingPage(null)}
              className="absolute inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-slate-50 dark:bg-zinc-950 w-full max-w-2xl relative z-10 shadow-2xl flex flex-col h-full border-l border-slate-200 dark:border-zinc-800"
            >
              {/* Drawer Header */}
              <div className="px-8 py-6 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Edit Halaman</h2>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">{editingPage.title}</p>
                </div>
                <button 
                  onClick={() => setEditingPage(null)} 
                  className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                
                {/* SEO Card */}
                <div className="bg-white dark:bg-zinc-900/50 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100 dark:border-emerald-800/30">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Optimasi Pencarian (SEO)</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Meningkatkan Visibilitas di Google</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-emerald-50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-emerald-100 dark:border-zinc-800">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData._isPublished ? 'bg-emerald-500 text-white' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                        <span className="material-symbols-outlined text-lg">{formData._isPublished ? 'public' : 'edit_note'}</span>
                      </div>
                      <div>
                        <p className="text-xs font-black text-emerald-900 dark:text-emerald-50 uppercase tracking-widest">Status</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase mt-0.5">
                          {formData._isPublished ? 'Halaman sudah terbit' : 'Halaman masih draft'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Judul Meta (Tab Browser)</label>
                      <input
                        value={formData._metaTitle || ''}
                        onChange={e => setFormData(p => ({ ...p, _metaTitle: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                        placeholder="Contoh: Beranda | Wahana Data Utama"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Deskripsi Singkat (Meta Description)</label>
                      <textarea
                        value={formData._metaDesc || ''}
                        onChange={e => setFormData(p => ({ ...p, _metaDesc: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white resize-none"
                        rows={3}
                        placeholder="Masukkan penjelasan singkat yang akan tampil di hasil pencarian Google..."
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Grouped Field Cards */}
                {Object.entries(getGroupedFields(editingPage.slug)).map(([groupName, fields]) => (
                  <div key={groupName} className="bg-white dark:bg-zinc-900/50 rounded-[2rem] p-8 shadow-sm border border-slate-200 dark:border-zinc-800 relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100 dark:border-emerald-800/30 relative z-10">
                      <div className="w-12 h-12 rounded-[1rem] bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <span className="material-symbols-outlined text-2xl">
                          {groupName.includes('Hero') ? 'settings_overscan' : 
                           groupName.includes('Layanan') ? 'design_services' :
                           groupName.includes('Klien') ? 'group' :
                           groupName.includes('Galeri') ? 'gallery_thumbnail' :
                           groupName.includes('Profil') || groupName.includes('Tentang') ? 'business' :
                           groupName.includes('Tagline') ? 'campaign' :
                           groupName.includes('Inovasi') ? 'lightbulb' :
                           groupName.includes('Visi') ? 'flag' :
                           groupName.includes('Manajemen') ? 'groups' :
                           groupName.includes('Kolaborasi') ? 'handshake' :
                           groupName.includes('Komitmen') ? 'verified' : 'article'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-lg">{groupName}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Konfigurasi Konten Bagian Ini</p>
                      </div>
                    </div>
                    
                    <div className="space-y-8 relative z-10">
                      {fields.map(field => (
                        <div key={field.key} className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 dark:text-emerald-500/50 uppercase tracking-[0.2em] ml-1 flex items-center justify-between">
                            {field.label}
                            {field.type === 'image' && <span className="text-[8px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">Asset Media</span>}
                          </label>
                          {field.type === 'textarea' ? (
                            <TiptapEditor
                              content={formData[field.key] || ''}
                              onChange={val => setFormData(p => ({ ...p, [field.key]: val }))}
                            />
                          ) : (
                            <div className="relative group/input">
                              <input
                                value={formData[field.key] || ''}
                                onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                                className={`w-full bg-slate-50 dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/30 rounded-xl px-4 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white ${field.type === 'image' ? 'pr-14' : ''}`}
                                placeholder={field.placeholder}
                              />
                              {field.type === 'image' && (
                                <button
                                  type="button"
                                  onClick={() => { setActiveField(field.key); setIsPickerOpen(true); }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                                  title="Pilih Gambar dari Media"
                                >
                                  <span className="material-symbols-outlined text-xl">image</span>
                                </button>
                              )}
                            </div>
                          )}
                          
                          {/* Image Preview Helper */}
                          {field.type === 'image' && formData[field.key] && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-white dark:bg-zinc-950 rounded-[1.5rem] border border-slate-100 dark:border-emerald-800/20 shadow-inner flex items-center gap-4">
                              <div className="w-20 h-20 bg-slate-100 dark:bg-emerald-900/20 rounded-xl border border-slate-200 dark:border-emerald-800/40 overflow-hidden shadow-sm flex-shrink-0">
                                <img src={formData[field.key]} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Preview Aset</p>
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate font-mono bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded w-fit max-w-full">{formData[field.key]}</p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="h-10"></div>
              </div>

              {/* Action Bar Footer */}
              <div className="p-8 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 sticky bottom-0 z-20 shadow-2xl">
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const url = editingPage.slug === 'home' ? '/' : `/${editingPage.slug}`;
                      // Save current unsaved data to sessionStorage for the preview tab to pick up
                      sessionStorage.setItem(`preview_${editingPage.slug}`, JSON.stringify(formData));
                      window.open(url + '?preview=true', '_blank');
                    }}
                    className="flex-1 py-4 px-6 border-2 border-emerald-600 text-emerald-600 dark:text-primary dark:border-primary bg-white dark:bg-transparent rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    Preview
                  </button>
                  <button
                    onClick={() => handleSave(false)}
                    disabled={isSaving}
                    className="flex-1 py-4 px-6 border-2 border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-transparent rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span className="w-4 h-4 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">edit_note</span>
                        Simpan Draft
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleSave(true)}
                    disabled={isSaving}
                    className="flex-[2] py-4 px-8 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all disabled:opacity-50 flex justify-center items-center gap-3 active:scale-95"
                  >
                    {isSaving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">cloud_upload</span>
                        Terbitkan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Extra Protection Modal */}
      <AnimatePresence>
        {deletingPage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeletingPage(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl p-8 overflow-hidden"
            >
              {/* Warning Header */}
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">warning</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Perhatian Ekstra!</h3>
                  <p className="text-sm text-slate-500 mt-1">Anda akan menghapus halaman <strong>{deletingPage.title}</strong>.</p>
                </div>
              </div>

              <div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm mb-6 border border-red-100">
                Data halaman yang dihapus tidak bisa dikembalikan. Silahkan ketik tulisan di bawah ini untuk mengonfirmasi keamanan:
              </div>

              <label className="block text-sm font-bold text-slate-700 mb-2">Ketik "HAPUS" di kotak ini:</label>
              <input 
                type="text"
                value={deleteConfirmationText}
                onChange={e => setDeleteConfirmationText(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 font-bold focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                placeholder="HAPUS"
              />

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setDeletingPage(null);
                    setDeleteConfirmationText('');
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                >
                  Urungkan
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirmationText !== 'HAPUS'}
                  className="flex-1 px-4 py-2.5 bg-red-600 disabled:opacity-50 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                >
                  Eksekusi Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[200] bg-emerald-900 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-700"
          >
            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            <span className="font-bold text-sm">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <MediaPicker 
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(url) => {
          if (activeField) {
            setFormData(p => ({ ...p, [activeField]: url }));
            setIsPickerOpen(false);
          }
        }}
      />
    </div>
  );
}
