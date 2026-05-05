import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api, errorMessage } from '../../services/api';
import { toast } from '../../store/toastStore';
import { Wallet, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Earnings() {
  const qc = useQueryClient();
  const [requesting, setRequesting] = useState(false);

  const { data: comm, isLoading } = useQuery({
    queryKey: ['my-comm'], queryFn: () => api.get('/commissions/mine').then(r => r.data.data),
  });
  const { data: payouts } = useQuery({
    queryKey: ['my-payouts'], queryFn: () => api.get('/payouts/mine').then(r => r.data.data.items),
  });

  const summary = (comm?.summary || []).reduce((acc, s) => {
    acc[s._id] = { total: s.total, count: s.count };
    return acc;
  }, {});

  const requestPayout = async () => {
    setRequesting(true);
    try {
      await api.post('/payouts/request');
      toast.success('בקשת התשלום נשלחה ✅');
      qc.invalidateQueries({ queryKey: ['my-comm'] });
      qc.invalidateQueries({ queryKey: ['my-payouts'] });
    } catch (e) { toast.error(errorMessage(e)); } finally { setRequesting(false); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">הרווחים שלי</h1>

      <div className="grid sm:grid-cols-3 gap-4">
        <BalanceCard label="זמין למשיכה" value={summary.approved?.total || 0} accent="emerald" />
        <BalanceCard label="ממתין לאישור" value={summary.pending?.total || 0} accent="amber" />
        <BalanceCard label="שולם בעבר" value={summary.paid?.total || 0} accent="brand" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-lg">בקשת תשלום</h3>
            <p className="text-sm text-ink-500">סכום מינימלי למשיכה: ₪50. התשלום בהעברה בנקאית עד 7 ימי עסקים.</p>
          </div>
          <button onClick={requestPayout} disabled={requesting || !(summary.approved?.total >= 50)} className="btn-primary btn-md">
            {requesting ? <Loader2 className="size-4 animate-spin" /> : <><Wallet className="size-4" />בקש תשלום</>}
          </button>
        </div>
        {!(summary.approved?.total >= 50) && (
          <div className="mt-3 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <AlertCircle className="size-4 mt-0.5" />
            <span>לפני בקשת תשלום ראשונה, ודאו שמילאתם פרטי בנק ב<Link to="/marketer/profile" className="underline font-semibold">פרופיל</Link>.</span>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="font-bold mb-3">העמלות שלי</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-right text-ink-500 border-b border-ink-200">
              <tr><th className="py-2 px-3">תאריך</th><th className="py-2 px-3">אירוע</th><th className="py-2 px-3">קופון</th><th className="py-2 px-3">סכום מכירה</th><th className="py-2 px-3">עמלה</th><th className="py-2 px-3">סטטוס</th></tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6} className="py-8 text-center text-ink-500">טוען...</td></tr>}
              {comm?.items?.map((c) => (
                <tr key={c._id} className="border-b border-ink-100">
                  <td className="py-2 px-3">{new Date(c.createdAt).toLocaleDateString('he-IL')}</td>
                  <td className="py-2 px-3">{c.event?.title}</td>
                  <td className="py-2 px-3 font-mono">{c.couponCode}</td>
                  <td className="py-2 px-3">₪{c.saleAmount.toLocaleString('he-IL')}</td>
                  <td className="py-2 px-3 font-semibold text-emerald-700">₪{c.commissionAmount.toLocaleString('he-IL')}</td>
                  <td className="py-2 px-3"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
              {!isLoading && comm?.items?.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-ink-500">עדיין אין עמלות</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {payouts?.length > 0 && (
        <div className="card">
          <h3 className="font-bold mb-3">היסטוריית תשלומים</h3>
          <div className="space-y-2">
            {payouts.map((p) => (
              <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-ink-50">
                <div>
                  <div className="font-semibold">₪{p.amount.toLocaleString('he-IL')}</div>
                  <div className="text-xs text-ink-500">{new Date(p.createdAt).toLocaleDateString('he-IL')}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BalanceCard({ label, value, accent }) {
  const accents = {
    emerald: 'bg-gradient-to-bl from-emerald-100 to-emerald-50 text-emerald-900',
    amber: 'bg-gradient-to-bl from-amber-100 to-amber-50 text-amber-900',
    brand: 'bg-gradient-to-bl from-brand-100 to-brand-50 text-brand-900',
  };
  return (
    <div className={`card ${accents[accent]}`}>
      <div className="text-sm opacity-80">{label}</div>
      <div className="text-3xl font-extrabold mt-1">₪{value.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: ['badge-warning', 'ממתין'],
    processing: ['badge-warning', 'בתהליך'],
    approved: ['badge-success', 'אושר'],
    rejected: ['badge-danger', 'נדחה'],
    paid: ['badge-success', 'שולם'],
    failed: ['badge-danger', 'נכשל'],
  };
  const [cls, label] = map[status] || ['badge', status];
  return <span className={cls}>{label}</span>;
}
