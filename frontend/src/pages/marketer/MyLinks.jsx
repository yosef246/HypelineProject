import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { toast } from '../../store/toastStore';
import { Copy, Share2, MousePointer, TrendingUp, Wallet } from 'lucide-react';

export default function MyLinks() {
  const { data, isLoading } = useQuery({ queryKey: ['my-refs'], queryFn: () => api.get('/referrals/mine').then(r => r.data.data.items) });
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} הועתק ללוח`);
  };

  const share = async (link, title) => {
    if (navigator.share) {
      try { await navigator.share({ title, url: link }); }
      catch { /* user cancelled */ }
    } else {
      copy(link, 'הלינק');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">הלינקים שלי</h1>
      {isLoading ? <div className="card text-center py-10 text-ink-500">טוען...</div> : (
        <div className="space-y-3">
          {data?.map((r) => {
            const link = `${baseUrl}/go/${r.slug}`;
            return (
              <div key={r._id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg">{r.event?.title}</h3>
                      <span className={`badge ${r.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span>
                    </div>
                    <div className="text-sm text-ink-500 mt-1">{new Date(r.event?.startsAt).toLocaleDateString('he-IL')}</div>
                  </div>
                  <div className="text-sm text-ink-700">
                    עמלה: <span className="font-bold">{r.campaign?.commissionType === 'percent' ? `${r.campaign?.commissionValue}%` : `₪${r.campaign?.commissionValue}`}</span>
                  </div>
                </div>

                <div className="mt-4 grid lg:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-ink-200 p-3 bg-ink-50">
                    <div className="text-xs text-ink-500 mb-1">הלינק שלך</div>
                    <div className="flex items-center gap-2">
                      <code dir="ltr" className="text-xs flex-1 truncate font-mono">{link}</code>
                      <button onClick={() => copy(link, 'הלינק')} className="btn-ghost btn-md !p-2"><Copy className="size-4" /></button>
                      <button onClick={() => share(link, r.event?.title)} className="btn-soft btn-md !p-2"><Share2 className="size-4" /></button>
                    </div>
                  </div>
                  <div className="rounded-xl border-2 border-dashed border-brand-300 p-3 bg-brand-50">
                    <div className="text-xs text-brand-600 mb-1">קוד הקופון שלך</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xl font-extrabold tracking-widest text-brand-700 flex-1">{r.couponCode}</code>
                      <button onClick={() => copy(r.couponCode, 'הקופון')} className="btn-soft btn-md !p-2"><Copy className="size-4" /></button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t border-ink-100">
                  <KV icon={MousePointer} label="קליקים" value={r.stats?.clicks || 0} />
                  <KV icon={TrendingUp} label="מכירות" value={r.stats?.sales || 0} />
                  <KV icon={Wallet} label="רווחים" value={`₪${(r.stats?.earnings || 0).toLocaleString('he-IL')}`} />
                </div>
              </div>
            );
          })}
          {data?.length === 0 && <div className="card text-center py-10 text-ink-500">עדיין לא הצטרפת לקמפיינים</div>}
        </div>
      )}
    </div>
  );
}

function KV({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-ink-400" />
      <div>
        <div className="text-xs text-ink-500">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}
