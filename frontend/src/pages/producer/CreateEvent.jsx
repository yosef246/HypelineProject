import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FormField, Input, Textarea, Select } from '../../components/ui/FormField';
import { Loader2, Megaphone } from 'lucide-react';
import { api, errorMessage } from '../../services/api';
import { toast } from '../../store/toastStore';

const PLATFORMS = [
  { v: 'goout', l: 'GoOut' },
  { v: 'eventbrite', l: 'Eventbrite' },
  { v: 'lineup', l: 'LineUp' },
  { v: 'other', l: 'אחר' },
];

export default function CreateEvent() {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { externalPlatform: 'goout', currency: 'ILS' } });
  const [step, setStep] = useState(1); // 1=event 2=campaign
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitEvent = async (data) => {
    setLoading(true);
    try {
      const r = await api.post('/events', data);
      setEvent(r.data.data.event);
      toast.success('האירוע נוצר 🎉');
      setStep(2);
    } catch (e) { toast.error(errorMessage(e)); } finally { setLoading(false); }
  };

  const submitCampaign = async (data) => {
    setLoading(true);
    try {
      await api.post('/campaigns', { ...data, eventId: event._id });
      toast.success('הקמפיין נפתח! משווקים יכולים להצטרף עכשיו');
      navigate('/producer/campaigns');
    } catch (e) { toast.error(errorMessage(e)); } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold">אירוע חדש</h1>
      <p className="text-ink-600 mt-1">2 צעדים: יצירת אירוע ופתיחת קמפיין שיווק</p>

      <div className="mt-6 flex items-center gap-3 mb-6">
        <Step active={step >= 1} done={step > 1} num={1} label="פרטי אירוע" />
        <div className="flex-1 h-px bg-ink-200" />
        <Step active={step >= 2} done={false} num={2} label="קמפיין שיווק" />
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmit(submitEvent)} className="card grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="שם האירוע" required error={errors.title?.message} className="sm:col-span-2">
            <Input {...register('title', { required: 'שם חובה' })} />
          </FormField>
          <FormField label="תיאור" className="sm:col-span-2">
            <Textarea rows={4} {...register('description')} />
          </FormField>
          <FormField label="פלטפורמה חיצונית" required error={errors.externalPlatform?.message}>
            <Select {...register('externalPlatform', { required: true })}>
              {PLATFORMS.map((p) => <option key={p.v} value={p.v}>{p.l}</option>)}
            </Select>
          </FormField>
          <FormField label="לינק חיצוני לרכישה" required error={errors.externalUrl?.message} className="sm:col-span-1">
            <Input dir="ltr" placeholder="https://..." {...register('externalUrl', { required: 'לינק חובה' })} />
          </FormField>
          <FormField label="עיר" error={errors.city?.message}>
            <Input {...register('city')} />
          </FormField>
          <FormField label="מקום (venue)" error={errors.venue?.message}>
            <Input {...register('venue')} />
          </FormField>
          <FormField label="תאריך התחלה" required error={errors.startsAt?.message}>
            <Input type="datetime-local" {...register('startsAt', { required: 'תאריך חובה' })} />
          </FormField>
          <FormField label="תאריך סיום" error={errors.endsAt?.message}>
            <Input type="datetime-local" {...register('endsAt')} />
          </FormField>
          <FormField label="מחיר התחלתי" error={errors.priceFrom?.message}>
            <Input type="number" min="0" {...register('priceFrom', { valueAsNumber: true })} />
          </FormField>
          <FormField label="גיל מינימלי" error={errors.minAge?.message}>
            <Input type="number" min="0" max="100" {...register('minAge', { valueAsNumber: true })} />
          </FormField>
          <button disabled={loading} className="btn-primary btn-lg sm:col-span-2">
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'יצירת אירוע'}
          </button>
        </form>
      )}

      {step === 2 && event && <CampaignForm event={event} onSubmit={submitCampaign} loading={loading} />}
    </motion.div>
  );
}

function Step({ num, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`size-8 rounded-full grid place-items-center text-sm font-bold ${
        done ? 'bg-emerald-500 text-white' : active ? 'bg-hero-gradient text-white' : 'bg-ink-200 text-ink-500'
      }`}>{done ? '✓' : num}</div>
      <span className={`text-sm font-semibold ${active ? 'text-ink-900' : 'text-ink-500'}`}>{label}</span>
    </div>
  );
}

function CampaignForm({ event, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: `קמפיין: ${event.title}`, commissionType: 'percent', commissionValue: 10, discountPercent: 5 },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-brand-50 border border-brand-200">
        <Megaphone className="size-5 text-brand-700" />
        <span className="text-sm">קמפיין יקבל לינקים אישיים לכל משווק שמצטרף, עם קופון ייחודי</span>
      </div>
      <FormField label="שם הקמפיין" error={errors.name?.message} className="sm:col-span-2">
        <Input {...register('name', { required: 'שם חובה' })} />
      </FormField>
      <FormField label="סוג עמלה">
        <Select {...register('commissionType')}>
          <option value="percent">אחוזים</option>
          <option value="fixed">סכום קבוע ₪</option>
        </Select>
      </FormField>
      <FormField label="גובה עמלה" required error={errors.commissionValue?.message}>
        <Input type="number" step="0.5" min="0" max="100" {...register('commissionValue', { required: true, valueAsNumber: true })} />
      </FormField>
      <FormField label="הנחה ללקוח דרך הקופון (%)">
        <Input type="number" min="0" max="100" {...register('discountPercent', { valueAsNumber: true })} />
      </FormField>
      <FormField label="מקסימום משווקים (אופציונלי)">
        <Input type="number" min="1" {...register('maxMarketers', { valueAsNumber: true })} />
      </FormField>
      <button disabled={loading} className="btn-primary btn-lg sm:col-span-2">
        {loading ? <Loader2 className="size-4 animate-spin" /> : 'פתיחת קמפיין'}
      </button>
    </form>
  );
}
