import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Calendar, MapPin, ExternalLink, Tag } from 'lucide-react';

export default function EventDetails() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => api.get(`/events/slug/${slug}`).then((r) => r.data.data.event),
  });

  if (isLoading) return <div className="max-w-4xl mx-auto px-6 py-20 text-center text-ink-500">טוען...</div>;
  if (isError || !data) return <div className="max-w-4xl mx-auto px-6 py-20 text-center text-ink-500">אירוע לא נמצא</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="aspect-[16/8] rounded-2xl bg-mesh overflow-hidden mb-8 shadow-soft">
        {data.coverImage && <img src={data.coverImage} alt="" className="w-full h-full object-cover" />}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold">{data.title}</h1>
      <div className="mt-3 flex flex-wrap gap-3 text-ink-500">
        <span className="inline-flex items-center gap-1"><Calendar className="size-4" />{new Date(data.startsAt).toLocaleString('he-IL')}</span>
        {data.city && <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{data.venue ? `${data.venue}, ` : ''}{data.city}</span>}
        {data.tags?.length > 0 && (
          <span className="inline-flex items-center gap-1"><Tag className="size-4" />{data.tags.join(' · ')}</span>
        )}
      </div>
      {data.description && (
        <p className="mt-6 text-ink-700 whitespace-pre-line leading-relaxed">{data.description}</p>
      )}
      <div className="mt-8 card bg-brand-50 border-brand-200">
        <h3 className="font-bold mb-2">רוצים להרוויח מהמסיבה הזאת?</h3>
        <p className="text-sm text-ink-600">הצטרפו כמשווקים ל-Hypeline, קבלו לינק אישי וקופון - והרוויחו מכל מי שתביאו.</p>
        <Link to="/register/marketer" className="mt-4 btn-primary btn-md inline-flex">הירשמו עכשיו</Link>
      </div>
      <a href={data.externalUrl} target="_blank" rel="noreferrer" className="mt-6 btn-ghost btn-md inline-flex">
        עברו לרכישה <ExternalLink className="size-4" />
      </a>
    </div>
  );
}
