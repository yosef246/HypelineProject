import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { Calendar, MapPin } from 'lucide-react';

export default function Events() {
  const { data, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.get('/events').then((r) => r.data.data),
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold">אירועים קרובים</h1>
      <p className="mt-2 text-ink-600">בחרו אירוע ושתפו עם החברים</p>

      {isLoading && (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-44 bg-ink-100 rounded-xl mb-4" />
              <div className="h-5 bg-ink-100 rounded w-2/3 mb-2" />
              <div className="h-4 bg-ink-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && data?.items?.length === 0 && (
        <div className="mt-16 text-center text-ink-500">אין אירועים פעילים כרגע. חזרו בקרוב!</div>
      )}

      {!isLoading && data?.items?.length > 0 && (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((e, i) => (
            <motion.div key={e._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link to={`/events/${e.slug}`} className="card block hover:shadow-soft transition group">
                <div className="aspect-[16/10] rounded-xl bg-mesh mb-4 overflow-hidden">
                  {e.coverImage && <img src={e.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />}
                </div>
                <h3 className="font-bold text-lg group-hover:text-brand-700">{e.title}</h3>
                <div className="mt-2 text-sm text-ink-500 flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1"><Calendar className="size-4" />{new Date(e.startsAt).toLocaleDateString('he-IL')}</span>
                  {e.city && <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{e.city}</span>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
