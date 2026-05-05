import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorMessage } from '../../services/api';
import { useForm } from 'react-hook-form';
import { FormField, Input } from '../../components/ui/FormField';
import { toast } from '../../store/toastStore';
import { Loader2, Plus } from 'lucide-react';

export default function Reports() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: ['producer-comm'], queryFn: () => api.get('/commissions/producer').then(r => r.data.data.items) });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">דוחות מכירות</h1>
          <p className="text-ink-600 mt-1">דוווח על מכירה לפי קופון - והעמלה מחושבת אוטומטית</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary btn-md"><Plus className="size-4" />דווח על מכירה</button>
      </div>

      {showForm && <ReportForm onDone={() => { setShowForm(false); qc.invalidateQueries({ queryKey: ['producer-comm'] }); }} />}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-right text-ink-500 border-b border-ink-200">
              <th className="py-2 px-3">תאריך</th>
              <th className="py-2 px-3">משווק</th>
              <th className="py-2 px-3">אירוע</th>
              <th className="py-2 px-3">קופון</th>
              <th className="py-2 px-3">סכום מכירה</th>
              <th className="py-2 px-3">עמלה</th>
              <th className="py-2 px-3">סטטוס</th>
              <th className="py-2 px-3">פעולה</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={8} className="py-8 text-center text-ink-500">טוען...</td></tr>}
            {data?.map((c) => (
              <tr key={c._id} className="border-b border-ink-100">
                <td className="py-2 px-3">{new Date(c.createdAt).toLocaleDateString('he-IL')}</td>
                <td className="py-2 px-3">{c.marketer?.fullName} <span className="text-ink-400">@{c.marketer?.username}</span></td>
                <td className="py-2 px-3">{c.event?.title}</td>
                <td className="py-2 px-3 font-mono">{c.couponCode}</td>
                <td className="py-2 px-3">₪{c.saleAmount.toLocaleString('he-IL')}</td>
                <td className="py-2 px-3 font-semibold text-emerald-700">₪{c.commissionAmount.toLocaleString('he-IL')}</td>
                <td className="py-2 px-3"><StatusBadge status={c.status} /></td>
                <td className="py-2 px-3"><ActionButtons commission={c} /></td>
              </tr>
            ))}
            {!isLoading && data?.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-ink-500">אין מכירות עדיין</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: ['badge-warning', 'ממתין'],
    approved: ['badge-success', 'אושר'],
    rejected: ['badge-danger', 'נדחה'],
    paid: ['badge-success', 'שולם'],
  };
  const [cls, label] = map[status] || ['badge', status];
  return <span className={cls}>{label}</span>;
}

function ActionButtons({ commission }) {
  const qc = useQueryClient();
  if (commission.status !== 'pending') return null;
  const update = async (status) => {
    try {
      await api.patch(`/commissions/${commission._id}/status`, { status });
      toast.success(status === 'approved' ? 'העמלה אושרה' : 'העמלה נדחתה');
      qc.invalidateQueries({ queryKey: ['producer-comm'] });
    } catch (e) { toast.error(errorMessage(e)); }
  };
  return (
    <div className="flex gap-1">
      <button onClick={() => update('approved')} className="text-xs text-emerald-700 hover:underline">אשר</button>
      <span className="text-ink-300">·</span>
      <button onClick={() => update('rejected')} className="text-xs text-red-600 hover:underline">דחה</button>
    </div>
  );
}

function ReportForm({ onDone }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/track/sale', data);
      toast.success('המכירה נרשמה והעמלה חושבה');
      reset();
      onDone();
    } catch (e) { toast.error(errorMessage(e)); } finally { setLoading(false); }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card grid grid-cols-1 sm:grid-cols-4 gap-3">
      <FormField label="קוד קופון" required error={errors.couponCode?.message}>
        <Input dir="ltr" {...register('couponCode', { required: 'קופון חובה' })} />
      </FormField>
      <FormField label="סכום מכירה" required error={errors.saleAmount?.message}>
        <Input type="number" min="0" step="0.5" {...register('saleAmount', { required: 'סכום חובה', valueAsNumber: true })} />
      </FormField>
      <FormField label="כמות">
        <Input type="number" min="1" defaultValue="1" {...register('quantity', { valueAsNumber: true })} />
      </FormField>
      <FormField label="מזהה הזמנה (אופציונלי)">
        <Input dir="ltr" {...register('externalOrderId')} />
      </FormField>
      <button disabled={loading} className="btn-primary btn-md sm:col-span-4">
        {loading ? <Loader2 className="size-4 animate-spin" /> : 'דווח על מכירה'}
      </button>
    </form>
  );
}
