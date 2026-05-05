import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Logo } from '../../components/ui/Logo';
import { FormField, Input } from '../../components/ui/FormField';
import { Loader2 } from 'lucide-react';
import { api, errorMessage } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import { phoneRule, passwordRule, emailRule } from '../../components/auth/registerHelpers';

export default function RegisterCustomer() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginSuccess } = useAuthStore();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const r = await api.post('/auth/register/customer', data);
      const { user, accessToken } = r.data.data;
      loginSuccess({ user, accessToken });
      toast.success('נרשמת בהצלחה! 🎉');
      navigate('/');
    } catch (e) { toast.error(errorMessage(e)); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
        <Logo className="h-9 mb-4 text-ink-900" />
        <h1 className="text-2xl font-bold">הרשמה</h1>
        <p className="text-ink-500 mt-1">צרו חשבון לקוח לטובת היסטוריית רכישות והנחות</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <FormField label="שם מלא" required error={errors.fullName?.message}>
            <Input {...register('fullName', { required: 'שם מלא חובה' })} />
          </FormField>
          <FormField label="אימייל" required error={errors.email?.message}>
            <Input type="email" dir="ltr" {...register('email', emailRule)} />
          </FormField>
          <FormField label="טלפון" required error={errors.phone?.message}>
            <Input type="tel" dir="ltr" {...register('phone', phoneRule)} />
          </FormField>
          <FormField label="סיסמה" required error={errors.password?.message}>
            <Input type="password" {...register('password', passwordRule)} />
          </FormField>
          <FormField label="אימות סיסמה" required error={errors.passwordConfirm?.message}>
            <Input type="password" {...register('passwordConfirm', { required: 'אימות חובה', validate: (v) => v === password || 'הסיסמאות לא תואמות' })} />
          </FormField>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" {...register('acceptTerms', { required: 'יש לאשר תנאים' })} className="mt-1" />
            <span>אני מאשר/ת את <a href="#" className="text-brand-700 underline">תנאי השימוש</a> ו<a href="#" className="text-brand-700 underline">מדיניות הפרטיות</a></span>
          </label>
          <input type="hidden" value="true" {...register('acceptPrivacy', { value: true })} />
          {errors.acceptTerms && <div className="field-error">{errors.acceptTerms.message}</div>}
          <button disabled={loading} className="btn-primary btn-lg w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'יצירת חשבון'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-ink-600">
          רוצה להרוויח? <Link to="/register/marketer" className="text-brand-700 font-semibold hover:underline">הירשם כמשווק</Link>
        </div>
      </motion.div>
    </div>
  );
}
