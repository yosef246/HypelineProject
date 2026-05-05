import { motion } from 'framer-motion';
import clsx from 'clsx';

export function Stat({ icon: Icon, label, value, delta, accent = 'brand', currency }) {
  const accents = {
    brand: 'from-brand-500/10 to-brand-500/0 text-brand-700',
    pink: 'from-pink-500/10 to-pink-500/0 text-pink-700',
    amber: 'from-amber-500/10 to-amber-500/0 text-amber-700',
    emerald: 'from-emerald-500/10 to-emerald-500/0 text-emerald-700',
  };
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={clsx('relative overflow-hidden card flex items-center gap-4')}
    >
      <div className={clsx('absolute inset-0 bg-gradient-to-bl pointer-events-none', accents[accent])} />
      <div className={clsx('relative size-12 rounded-xl bg-white shadow-soft flex items-center justify-center', accents[accent])}>
        {Icon && <Icon className="size-6" />}
      </div>
      <div className="relative">
        <div className="text-sm text-ink-500">{label}</div>
        <div className="text-2xl font-bold tracking-tight">
          {currency && '₪'}{typeof value === 'number' ? value.toLocaleString('he-IL') : value}
        </div>
        {delta != null && (
          <div className={clsx('text-xs font-medium', delta >= 0 ? 'text-emerald-600' : 'text-red-600')}>
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
          </div>
        )}
      </div>
    </motion.div>
  );
}
