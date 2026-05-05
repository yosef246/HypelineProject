import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { api, errorMessage } from '../../services/api';
import { toast } from '../../store/toastStore';
import { FormField, Input, Select } from '../../components/ui/FormField';
import { Loader2, Save, Banknote } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [bankLoading, setBankLoading] = useState(false);
  const profileForm = useForm({ defaultValues: user });
  const bankForm = useForm({ defaultValues: user?.bankDetails || {} });

  useEffect(() => { profileForm.reset(user); bankForm.reset(user?.bankDetails || {}); }, [user]);

  const saveProfile = async (data) => {
    setLoading(true);
    try {
      const r = await api.patch('/me', data);
      setUser(r.data.data.user);
      toast.success('הפרופיל עודכן');
    } catch (e) { toast.error(errorMessage(e)); } finally { setLoading(false); }
  };

  const saveBank = async (data) => {
    setBankLoading(true);
    try {
      const r = await api.patch('/me/bank', data);
      setUser(r.data.data.user);
      toast.success('פרטי בנק נשמרו');
    } catch (e) { toast.error(errorMessage(e)); } finally { setBankLoading(false); }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold">הפרופיל שלי</h1>

      <form onSubmit={profileForm.handleSubmit(saveProfile)} className="card grid grid-cols-1 sm:grid-cols-2 gap-4">
        <h2 className="font-bold sm:col-span-2">פרטים אישיים</h2>
        <FormField label="שם מלא"><Input {...profileForm.register('fullName')} /></FormField>
        <FormField label="טלפון"><Input dir="ltr" {...profileForm.register('phone')} /></FormField>
        <FormField label="עיר"><Input {...profileForm.register('city')} /></FormField>
        {user?.role === 'producer' && (
          <>
            <FormField label="שם עסק"><Input {...profileForm.register('businessName')} /></FormField>
            <FormField label="סוג פעילות" className="sm:col-span-2"><Input {...profileForm.register('activityType')} /></FormField>
          </>
        )}
        <button disabled={loading} className="btn-primary btn-md sm:col-span-2">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4" />שמור פרטים</>}
        </button>
      </form>

      {user?.role === 'marketer' && (
        <form onSubmit={bankForm.handleSubmit(saveBank)} className="card grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 flex items-center gap-2">
            <Banknote className="size-5 text-brand-700" />
            <h2 className="font-bold">פרטי חשבון בנק לקבלת תשלומים</h2>
          </div>
          <p className="text-sm text-ink-500 sm:col-span-2">הפרטים נשמרים מוצפנים ומשמשים אך ורק להעברת עמלות בהעברה בנקאית.</p>
          <FormField label="שם בעל החשבון"><Input {...bankForm.register('accountHolder')} /></FormField>
          <FormField label='ת"ז (לחשבונית)'><Input dir="ltr" {...bankForm.register('idNumber')} /></FormField>
          <FormField label="קוד בנק"><Input dir="ltr" {...bankForm.register('bankCode')} /></FormField>
          <FormField label="מספר סניף"><Input dir="ltr" {...bankForm.register('branchCode')} /></FormField>
          <FormField label="מספר חשבון" className="sm:col-span-2"><Input dir="ltr" {...bankForm.register('accountNumber')} /></FormField>
          <button disabled={bankLoading} className="btn-primary btn-md sm:col-span-2">
            {bankLoading ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4" />שמור פרטי בנק</>}
          </button>
        </form>
      )}
    </div>
  );
}
