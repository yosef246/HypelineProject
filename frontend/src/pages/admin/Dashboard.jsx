import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Stat } from '../../components/ui/Stat';
import { Users, Calendar, Megaphone, Wallet, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-stats'], queryFn: () => api.get('/admin/stats').then(r => r.data.data) });

  const totalCommissions = (data?.commissions || []).reduce((s, x) => s + (x.total || 0), 0);
  const pendingPayouts = (data?.payouts || []).find(p => p._id === 'pending')?.total || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">סקירת מערכת</h1>
        <p className="text-ink-600 mt-1">מבט-על על הפלטפורמה</p>
      </div>
      {isLoading ? <div className="card text-center py-10 text-ink-500">טוען...</div> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={Users} label="משתמשים" value={data?.users || 0} accent="brand" />
            <Stat icon={Calendar} label="אירועים" value={data?.events || 0} accent="pink" />
            <Stat icon={Megaphone} label="קמפיינים" value={data?.campaigns || 0} accent="amber" />
            <Stat icon={TrendingUp} label="עמלות סך הכל ₪" value={totalCommissions.toFixed(0)} accent="emerald" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-bold mb-3">פילוח עמלות</h3>
              <div className="space-y-2">
                {(data?.commissions || []).map(c => (
                  <div key={c._id} className="flex items-center justify-between p-3 rounded-xl bg-ink-50">
                    <span className="font-semibold">{c._id}</span>
                    <span>{c.count} עמלות · ₪{c.total.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</span>
                  </div>
                ))}
                {(!data?.commissions || data.commissions.length === 0) && <div className="text-ink-500 text-sm">אין נתונים עדיין</div>}
              </div>
            </div>
            <div className="card bg-hero-gradient text-white">
              <Wallet className="size-8" />
              <div className="mt-4 text-sm opacity-90">תשלומים ממתינים לעיבוד</div>
              <div className="text-4xl font-extrabold mt-1">₪{pendingPayouts.toLocaleString('he-IL', { maximumFractionDigits: 0 })}</div>
              <p className="opacity-80 text-sm mt-2">הפיקו קובץ מס"ב באזור התשלומים כדי להעביר את הכסף לכל המשווקים בבת אחת.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
