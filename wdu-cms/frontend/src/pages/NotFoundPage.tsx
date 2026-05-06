import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* Subtle 404 Text */}
        <h1 className="text-9xl font-black text-slate-50 mb-4 select-none tracking-tight">
          404
        </h1>

        <div className="relative -mt-16 mb-8">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-emerald-600 text-4xl">
              search_off
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Maaf, kami tidak dapat menemukan halaman yang Anda cari. 
            Mungkin ada kesalahan pengetikan atau halaman telah dipindahkan.
          </p>
        </div>

        {/* Minimalist Buttons */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm transition-all hover:bg-emerald-700 active:scale-[0.98]"
          >
            Kembali ke Beranda
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
          >
            Halaman Sebelumnya
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-12">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Wahana Data Utama. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

