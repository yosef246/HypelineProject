import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Stat } from '../../components/ui/Stat';
import { Calendar, Megaphone, Wallet, TrendingUp, PlusCircle } from 'lucide-react';

export default function ProducerDashboard() {
  const { data: events } = useQuery({ queryKey: ['my-events'], queryFn: () => api.get('/events/mine').then(r => r.data.data.items) });
  const { data: campaigns } = useQuery({ queryKey: ['my-campaigns'], queryFn: () => api.get('/campaigns/mine').then(r => r.data.data.items) });
  const { data: commissions } = useQuery({ queryKey: ['producer-comm'], queryFn: () => api.get('/commissions/producer').then(r => r.data.data.items) });

  const totalRevenue = commissions?.reduce((s, c) => s + c.saleAmount, 0) || 0;
  const totalCommission = commissions?.reduce((s, c) => s + c.commissionAmount, 0) || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">שלום, מפיק 👋</h1>
          <p className="text-ink-600 mt-1">סקירה מהירה של הפעילות שלך</p>
        </div>
        <Link to="/producer/events/new" className="btn-primary btn-md"><PlusCircle className="size-4" /> אירוע חדש</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Calendar}  label="אירועים" value={events?.length || 0} accent="brand" />
        <Stat icon={Megaphone} label="קמפיינים פעילים" value={campaigns?.filter(c => c.status === 'active').length || 0} accent="pink" />
        <Stat icon={TrendingUp} label="מכירות" value={commissions?.length || 0} accent="amber" />
        <Stat icon={Wallet} label='סה"כ הכנסות' value={totalRevenue.toFixed(0)} currency accent="emerald" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">האירועים האחרונים שלך</h2>
            <Link to="/producer/events" className="text-sm text-brand-700 hover:underline">לכל האירועים ←</Link>
          </div>
          <div className="space-y-2">
            {events?.slice(0, 5).map((e) => (
              <Link key={e._id} to={`/producer/events`} className="flex items-center justify-between p-3 rounded-xl hover:bg-ink-50">
                <div>
                  <div className="font-semibold">{e.title}</div>
                  <div className="text-xs text-ink-500">{new Date(e.startsAt).toLocaleDateString('he-IL')}</div>
                </div>
                <span className={`badge ${e.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                  {e.status === 'published' ? 'מפורסם' : 'טיוטה'}
                </span>
              </Link>
            ))}
            {(!events || events.length === 0) && (
              <div className="text-center text-ink-500 py-8">אין אירועים עדיין</div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="font-bold mb-4">סך עמלות ששולמו למשווקים</h2>
          <div className="text-4xl font-extrabold bg-hero-gradient bg-clip-text text-transparent">
            ₪{totalCommission.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-sm text-ink-500 mt-2">סך כל העמלות לאורך זמן</p>
        </div>
      </div>
    </div>
  );
}
