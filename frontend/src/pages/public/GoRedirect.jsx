import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Logo } from '../../components/ui/Logo';
import { Sparkles, Copy, ExternalLink } from 'lucide-react';
import { toast } from '../../store/toastStore';

const baseURL = import.meta.env.VITE_API_URL || '';

export default function GoRedirect() {
  const { slug } = useParams();
  const [referral, setReferral] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // log click
        axios.post(baseURL + '/api/track/click', { slug, referrer: document.referrer }).catch(() => {});
        const r = await axios.get(baseURL + '/api/referrals/lookup/' + slug);
        if (cancelled) return;
        const ref = r.data?.data?.referral;
        setReferral(ref);
        // auto redirect after 4 seconds
        setTimeout(() => {
          if (ref?.event?.externalUrl) window.location.href = ref.event.externalUrl;
        }, 4500);
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.error || 'הלינק לא נמצא');
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const copy = () => {
    if (!referral?.couponCode) return;
    navigator.clipboard.writeText(referral.couponCode);
    setCopied(true);
    toast.success('הקופון הועתק! 🎉');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card max-w-md w-full text-center">
        <Logo className="h-10 mx-auto mb-6 text-ink-900" />
        {error ? (
          <>
            <div className="text-red-600 font-bold text-lg">{error}</div>
            <p className="mt-2 text-ink-500">אנא בדקו את הלינק ונסו שוב</p>
          </>
        ) : !referral ? (
          <div className="py-8 text-ink-500">טוען...</div>
        ) : (
          <>
            <div className="badge-brand mx-auto"><Sparkles className="size-4 ms-1" /> הקופון שלך מוכן</div>
            <h1 className="mt-4 text-2xl font-bold">{referral.event.title}</h1>
            <p className="mt-2 text-ink-600 text-sm">תועברו לרכישה תוך מספר שניות. השתמשו בקופון לקבלת ההנחה:</p>

            <button onClick={copy} className="mt-5 mx-auto group block w-full">
              <div className="rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50 p-5 hover:bg-brand-100 transition">
                <div className="text-xs text-brand-600 font-semibold mb-1">קוד קופון</div>
                <div className="text-3xl font-extrabold tracking-widest text-brand-700">{referral.couponCode}</div>
                <div className="mt-2 text-xs text-brand-600 inline-flex items-center gap-1"><Copy className="size-3" />{copied ? 'הועתק!' : 'לחצו להעתקה'}</div>
              </div>
            </button>

            <a href={referral.event.externalUrl} className="btn-primary btn-lg w-full mt-5">
              עברו עכשיו לרכישה <ExternalLink className="size-4" />
            </a>
            <div className="mt-3 text-xs text-ink-500">תופנו אוטומטית בעוד מספר שניות...</div>
          </>
        )}
      </motion.div>
    </div>
  );
}
