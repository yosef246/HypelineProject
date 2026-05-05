import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Logo } from '../../components/ui/Logo';
import { FormField, Input, Select } from '../../components/ui/FormField';
import { Loader2 } from 'lucide-react';
import { api, errorMessage } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import { phoneRule, passwordRule, emailRule } from '../../components/auth/registerHelpers';

const ACTIVITY_TYPES = ['קלאב/בר', 'אירוע פרטי', 'פסטיבל', 'הופעה/קונצרט', 'אירועי חברה', 'אחר'];

export default function RegisterProducer() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginSuccess } = useAuthStore();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const r = await api.post('/auth/register/producer', data);
      const { user, accessToken } = r.data.data;
      loginSuccess({ user, accessToken });
      toast.success('ברוכים הבאים ל-Hypeline! 🎉');
      navigate('/producer');
    } catch (e) {
      toast.error(errorMessage(e));
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
        <Logo className="h-9 mb-4 text-ink-900" />
        <h1 className="text-2xl font-bold">הרשמה כמפיק/ה</h1>
        <p className="text-ink-500 mt-1">פתחו אירועים, גייסו משווקים, מקסמו את ההכנסות</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="שם מלא" required error={errors.fullName?.message} className="sm:col-span-2">
            <Input {...register('fullName', { required: 'שם מלא חובה', minLength: { value: 2, message: 'קצר מדי' } })} />
          </FormField>
          <FormField label="אימייל" required error={errors.email?.message}>
            <Input type="email" dir="ltr" {...register('email', emailRule)} />
          </FormField>
          <FormField label="טלפון" required error={errors.phone?.message}>
            <Input type="tel" dir="ltr" placeholder="050-1234567" {...register('phone', phoneRule)} />
          </FormField>
          <FormField label="סיסמה" required error={errors.password?.message} hint="לפחות 8 תווים, אות וספרה">
            <Input type="password" {...register('password', passwordRule)} />
          </FormField>
          <FormField label="אימות סיסמה" required error={errors.passwordConfirm?.message}>
            <Input type="password" {...register('passwordConfirm', { required: 'אימות חובה', validate: (v) => v === password || 'הסיסמאות לא תואמות' })} />
          </FormField>
          <FormField label="שם עסק/ליין" required error={errors.businessName?.message}>
            <Input {...register('businessName', { required: 'שם עסק חובה' })} />
          </FormField>
          <FormField label="סוג פעילות" required error={errors.activityType?.message}>
            <Select {...register('activityType', { required: 'סוג פעילות חובה' })}>
              <option value="">בחרו...</option>
              {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </FormField>
          <FormField label="עיר" required error={errors.city?.message}>
            <Input {...register('city', { required: 'עיר חובה' })} />
          </FormField>

          <div className="sm:col-span-2 space-y-2">
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" {...register('acceptTerms', { required: 'יש לאשר תנאי שימוש' })} className="mt-1" />
              <span>קראתי ואני מאשר/ת את <a href="#" className="text-brand-700 underline">תנאי השימוש</a></span>
            </label>
            {errors.acceptTerms && <div className="field-error">{errors.acceptTerms.message}</div>}
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" {...register('acceptPrivacy', { required: 'יש לאשר מדיניות פרטיות' })} className="mt-1" />
              <span>קראתי ואני מאשר/ת את <a href="#" className="text-brand-700 underline">מדיניות הפרטיות</a></span>
            </label>
            {errors.acceptPrivacy && <div className="field-error">{errors.acceptPrivacy.message}</div>}
          </div>

          <button disabled={loading} className="btn-primary btn-lg sm:col-span-2 mt-2">
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'יצירת חשבון'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-ink-600">
          כבר יש לך חשבון? <Link to="/login" className="text-brand-700 font-semibold hover:underline">התחבר</Link>
        </div>
      </motion.div>
    </div>
  );
}
