import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Logo } from '../../components/ui/Logo';
import { FormField, Input } from '../../components/ui/FormField';
import { Loader2, Mail, Lock } from 'lucide-react';
import { api, errorMessage } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginSuccess } = useAuthStore();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const r = await api.post('/auth/login', data);
      const { user, accessToken } = r.data.data;
      loginSuccess({ user, accessToken });
      toast.success('התחברת בהצלחה 👋');
      const target = user.role === 'producer' ? '/producer' :
                     user.role === 'marketer' ? '/marketer' :
                     user.role === 'admin' ? '/admin' : '/';
      navigate(target);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-mesh px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card max-w-md w-full">
        <Logo className="h-9 mx-auto mb-6 text-ink-900" />
        <h1 className="text-2xl font-bold text-center">ברוכים השבים</h1>
        <p className="text-center text-ink-500 mt-1">התחברו לחשבון שלכם</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <FormField label="אימייל" required error={errors.email?.message}>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-ink-400" />
              <Input
                type="email" autoComplete="email" dir="ltr" className="pe-10"
                {...register('email', { required: 'אימייל חובה' })}
              />
            </div>
          </FormField>
          <FormField label="סיסמה" required error={errors.password?.message}>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-ink-400" />
              <Input
                type="password" autoComplete="current-password" className="pe-10"
                {...register('password', { required: 'סיסמה חובה' })}
              />
            </div>
          </FormField>
          <button disabled={loading} className="btn-primary btn-lg w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'התחברות'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-ink-600">
          אין לך חשבון? <Link to="/register" className="text-brand-700 font-semibold hover:underline">הירשם עכשיו</Link>
        </div>
      </motion.div>
    </div>
  );
}
