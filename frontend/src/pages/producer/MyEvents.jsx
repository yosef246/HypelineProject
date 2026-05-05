import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Calendar, MapPin, PlusCircle } from 'lucide-react';

export default function MyEvents() {
  const { data, isLoading } = useQuery({ queryKey: ['my-events'], queryFn: () => api.get('/events/mine').then(r => r.data.data.items) });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold">האירועים שלי</h1>
        <Link to="/producer/events/new" className="btn-primary btn-md"><PlusCircle className="size-4" /> אירוע חדש</Link>
      </div>
      {isLoading ? <div className="card text-center py-10 text-ink-500">טוען...</div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((e) => (
            <div key={e._id} className="card">
              <div className="aspect-video rounded-xl bg-mesh mb-3" />
              <h3 className="font-bold">{e.title}</h3>
              <div className="text-sm text-ink-500 mt-1 flex items-center gap-2">
                <Calendar className="size-4" />{new Date(e.startsAt).toLocaleDateString('he-IL')}
                {e.city && <><MapPin className="size-4" />{e.city}</>}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`badge ${e.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                  {e.status === 'published' ? 'מפורסם' : e.status === 'draft' ? 'טיוטה' : e.status}
                </span>
                <a href={e.externalUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-700 hover:underline">לינק חיצוני</a>
              </div>
            </div>
          ))}
          {data?.length === 0 && <div className="card text-center py-10 text-ink-500 col-span-full">עדיין לא יצרת אירועים</div>}
        </div>
      )}
    </div>
  );
}
