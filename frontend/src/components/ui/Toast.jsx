import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, Loader2, X } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  loading: Loader2,
};
const STYLES = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  error: 'bg-red-50 border-red-200 text-red-900',
  info: 'bg-brand-50 border-brand-200 text-brand-900',
  loading: 'bg-ink-50 border-ink-200 text-ink-900',
};

export const ToastViewport = () => {
  const { toasts, remove } = useToastStore();
  return (
    <div className="pointer-events-none fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[90%] max-w-md">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.variant] || Info;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-soft glass ${STYLES[t.variant]}`}
            >
              <Icon className={`size-5 shrink-0 mt-0.5 ${t.variant === 'loading' ? 'animate-spin' : ''}`} />
              <div className="flex-1 text-sm font-medium leading-5">{t.message}</div>
              <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100 transition" aria-label="סגור">
                <X className="size-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
