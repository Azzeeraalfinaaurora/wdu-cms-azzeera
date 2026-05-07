import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Alamat email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    try {
      const res = await api.post('/auth/login', data);
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      setAuth(res.data.user, res.data.accessToken);
      navigate('/admin');
    } catch (err: any) {
      const serverError = err.response?.data?.error || 'Email atau password salah';
      setError(serverError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-emerald-950 dark:via-slate-900 dark:to-emerald-900 p-4 transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-emerald-950/50 rounded-2xl shadow-2xl shadow-emerald-500/20 overflow-hidden border border-emerald-100 dark:border-emerald-800 backdrop-blur-sm">
            <div className="p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="h-28 w-auto mb-6 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl">
                  <img src="https://wahanadata.co.id/img/wdu-ijo.png" alt="WDU Logo" className="h-full object-contain" />
                </div>
                <h1 className="text-3xl font-extrabold text-emerald-900 dark:text-white tracking-tight">Admin Portal</h1>
                <p className="text-emerald-600 dark:text-emerald-400 mt-2 font-medium">Silakan masuk untuk mengelola konten</p>
              </div>

            <AnimatePresence mode="wait">
              {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="nama@wahanadata.com"
                    className={`w-full pl-11 pr-4 py-3 bg-emerald-50/50 dark:bg-emerald-900/20 border ${
                      errors.email ? 'border-red-500' : 'border-emerald-200 dark:border-emerald-800'
                    } rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-4 py-3 bg-emerald-50/50 dark:bg-emerald-900/20 border ${
                      errors.password ? 'border-red-500' : 'border-emerald-200 dark:border-emerald-800'
                    } rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full gradient-btn text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk ke Dashboard'
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 border-t border-emerald-100 dark:border-emerald-800 text-center text-xs text-emerald-600 dark:text-emerald-400">
            &copy; 2026 Wahana Data Utama. All rights reserved.
          </div>
        </div>
      </motion.div>
    </div>
  );
}