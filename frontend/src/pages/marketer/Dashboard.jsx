import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Stat } from '../../components/ui/Stat';
import { MousePointer, TrendingUp, Wallet, Link2, Search } from 'lucide-react';

export default function MarketerDashboard() {
  const { data: refs } = useQuery({ queryKey: ['my-refs'], queryFn: () => api.get('/referrals/mine').then(r => r.data.data.items) });
  const { data: comm } = useQuery({ queryKey: ['my-comm'], queryFn: () => api.get('/commissions/mine').then(r => r.data.data) });

  const totals = (refs || []).reduce((acc, r) => {
    acc.clicks += r.stats?.clicks || 0;
    acc.sales += r.stats?.sales || 0;
    return acc;
  }, { clicks: 0, sales: 0 });

  const earnings = (comm?.summary || []).reduce((acc, s) => {
    if (s._id === 'approved' || s._id === 'paid') acc.approved += s.total;
    if (s._id === 'pending') acc.pending += s.total;
    return acc;
  }, { approved: 0, pending: 0 });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">שלום! 👋</h1>
        <p className="text-ink-600 mt-1">מבט על הפעילות וההכנסות שלך</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Link2} label="לינקים פעילים" value={refs?.length || 0} accent="brand" />
        <Stat icon={MousePointer} label="קליקים" value={totals.clicks} accent="pink" />
        <Stat icon={TrendingUp} label="מכירות" value={totals.sales} accent="amber" />
        <Stat icon={Wallet} label="זמין למשיכה ₪" value={earnings.approved.toFixed(0)} accent="emerald" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">הלינקים הטובים שלי</h2>
            <Link to="/marketer/links" className="text-sm text-brand-700 hover:underline">לכל הלינקים ←</Link>
          </div>
          <div className="space-y-2">
            {(refs || []).slice(0, 5).map((r) => (
              <div key={r._id} className="p-3 rounded-xl bg-ink-50">
                <div className="font-semibold">{r.event?.title}</div>
                <div className="text-xs text-ink-500 mt-1">קליקים: {r.stats?.clicks || 0} · מכירות: {r.stats?.sales || 0} · רווחים: ₪{(r.stats?.earnings || 0).toLocaleString('he-IL')}</div>
              </div>
            ))}
            {(!refs || refs.length === 0) && (
              <div className="text-center py-8">
                <Search className="size-10 mx-auto text-ink-300" />
                <p className="mt-2 text-ink-500">עוד לא הצטרפת לקמפיינים</p>
                <Link to="/marketer/available" className="btn-primary btn-md mt-3 inline-flex">חפש קמפיינים</Link>
              </div>
            )}
          </div>
        </div>
        <div className="card bg-hero-gradient text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-30" />
          <div className="relative">
            <div className="text-sm opacity-90">סה"כ עמלות מאושרות</div>
            <div className="text-5xl font-extrabold mt-1">₪{(earnings.approved + earnings.pending).toLocaleString('he-IL', { maximumFractionDigits: 0 })}</div>
            <div className="text-sm opacity-90 mt-2">מתוכם ₪{earnings.pending.toLocaleString('he-IL', { maximumFractionDigits: 0 })} ממתין לאישור</div>
            <Link to="/marketer/earnings" className="mt-6 inline-flex items-center gap-2 bg-white text-brand-700 px-5 py-2.5 rounded-xl font-semibold">
              לצפייה בפרטי הרווחים <Wallet className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
