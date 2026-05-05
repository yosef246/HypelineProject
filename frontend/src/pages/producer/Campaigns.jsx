import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import { Megaphone, Users, TrendingUp, MousePointer } from 'lucide-react';

export default function Campaigns() {
  const { data, isLoading } = useQuery({ queryKey: ['my-campaigns'], queryFn: () => api.get('/campaigns/mine').then(r => r.data.data.items) });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">קמפיינים</h1>
      {isLoading ? <div className="card text-center py-10 text-ink-500">טוען...</div> : (
        <div className="space-y-3">
          {data?.map((c) => (
            <div key={c._id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{c.name}</h3>
                    <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{c.status}</span>
                  </div>
                  <div className="text-sm text-ink-500 mt-1">{c.event?.title}</div>
                </div>
                <div className="text-sm">
                  <span className="text-ink-500">עמלה:</span>{' '}
                  <span className="font-semibold">{c.commissionType === 'percent' ? `${c.commissionValue}%` : `₪${c.commissionValue}`}</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-ink-100">
                <KV icon={Users} label="משווקים" value={c.stats?.marketers || 0} />
                <KV icon={MousePointer} label="קליקים" value={c.stats?.clicks || 0} />
                <KV icon={TrendingUp} label="מכירות" value={c.stats?.sales || 0} />
                <KV icon={Megaphone} label="הכנסות" value={`₪${(c.stats?.revenue || 0).toLocaleString('he-IL')}`} />
              </div>
            </div>
          ))}
          {data?.length === 0 && <div className="card text-center py-10 text-ink-500">עדיין לא נפתחו קמפיינים</div>}
        </div>
      )}
    </div>
  );
}

function KV({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-ink-400" />
      <div className="text-sm">
        <div className="text-ink-500 text-xs">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}
