import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api, errorMessage } from '../../services/api';
import { toast } from '../../store/toastStore';
import { Loader2, Calendar, Sparkles } from 'lucide-react';

export default function AvailableEvents() {
  const qc = useQueryClient();
  const [busyId, setBusyId] = useState(null);
  const { data, isLoading } = useQuery({
    queryKey: ['available-campaigns'],
    queryFn: () => api.get('/campaigns/available').then(r => r.data.data.items),
  });

  const join = async (campaignId) => {
    setBusyId(campaignId);
    try {
      await api.post('/referrals/join', { campaignId });
      toast.success('הצטרפת! הלינק והקופון מוכנים בעמוד "הלינקים שלי"');
      qc.invalidateQueries({ queryKey: ['available-campaigns'] });
      qc.invalidateQueries({ queryKey: ['my-refs'] });
    } catch (e) { toast.error(errorMessage(e)); } finally { setBusyId(null); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">קמפיינים פעילים</h1>
        <p className="text-ink-600 mt-1">בחר קמפיין שמתאים לקהל שלך והצטרף בלחיצה</p>
      </div>
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card h-52 animate-pulse bg-ink-100" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((c) => (
            <div key={c._id} className="card flex flex-col">
              <div className="aspect-video rounded-xl bg-mesh mb-3" />
              <h3 className="font-bold">{c.event?.title}</h3>
              <div className="text-sm text-ink-500 mt-1 flex items-center gap-2">
                <Calendar className="size-4" />{new Date(c.event?.startsAt).toLocaleDateString('he-IL')}
                {c.event?.city && <>· {c.event.city}</>}
              </div>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="badge-brand">
                  עמלה: {c.commissionType === 'percent' ? `${c.commissionValue}%` : `₪${c.commissionValue}`}
                </span>
                {c.discountPercent > 0 && <span className="badge-success">{c.discountPercent}% הנחה ללקוח</span>}
              </div>
              <button disabled={busyId === c._id} onClick={() => join(c._id)} className="btn-primary btn-md mt-4">
                {busyId === c._id ? <Loader2 className="size-4 animate-spin" /> : <><Sparkles className="size-4" />הצטרף לקמפיין</>}
              </button>
            </div>
          ))}
          {data?.length === 0 && <div className="card col-span-full text-center py-10 text-ink-500">אין קמפיינים זמינים כרגע. חזור בקרוב!</div>}
        </div>
      )}
    </div>
  );
}
