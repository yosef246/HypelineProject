import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogoMark } from '../ui/Logo';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, Calendar, PlusCircle, Megaphone, BarChart3, User, Wallet,
  Link2, Search, LogOut, Menu, X, Users, Banknote, Shield,
} from 'lucide-react';

const NAVS = {
  producer: [
    { to: '/producer', label: 'דשבורד', icon: LayoutDashboard, end: true },
    { to: '/producer/events', label: 'האירועים שלי', icon: Calendar },
    { to: '/producer/events/new', label: 'יצירת אירוע', icon: PlusCircle },
    { to: '/producer/campaigns', label: 'קמפיינים', icon: Megaphone },
    { to: '/producer/reports', label: 'דוחות', icon: BarChart3 },
    { to: '/producer/profile', label: 'הפרופיל שלי', icon: User },
  ],
  marketer: [
    { to: '/marketer', label: 'דשבורד', icon: LayoutDashboard, end: true },
    { to: '/marketer/available', label: 'אירועים זמינים', icon: Search },
    { to: '/marketer/links', label: 'הלינקים שלי', icon: Link2 },
    { to: '/marketer/earnings', label: 'רווחים', icon: Wallet },
    { to: '/marketer/profile', label: 'הפרופיל שלי', icon: User },
  ],
  admin: [
    { to: '/admin', label: 'סקירה', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'משתמשים', icon: Users },
    { to: '/admin/payouts', label: 'תשלומים', icon: Banknote },
  ],
};

const TITLES = { producer: 'אזור המפיק', marketer: 'אזור המשווק', admin: 'אזור הניהול' };

export default function DashboardLayout({ area }) {
  const navs = NAVS[area] || [];
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 glass border-b border-ink-200 px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2"><LogoMark className="size-7" /><span className="font-bold">Hypeline</span></Link>
        <button onClick={() => setOpen(!open)} aria-label="תפריט" className="p-2"><Menu className="size-6" /></button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed md:sticky top-0 right-0 md:translate-x-0 h-screen w-72 bg-white border-l border-ink-200 z-40 transition-transform ${open ? '' : 'translate-x-full md:translate-x-0'}`}>
          <div className="h-16 px-5 flex items-center justify-between border-b border-ink-200">
            <Link to="/" className="flex items-center gap-2">
              <LogoMark className="size-8" />
              <div>
                <div className="font-extrabold text-lg leading-none">Hypeline</div>
                <div className="text-xs text-ink-500">{TITLES[area]}</div>
              </div>
            </Link>
            <button className="md:hidden" onClick={() => setOpen(false)} aria-label="סגור"><X className="size-5" /></button>
          </div>

          <nav className="p-3 space-y-1">
            {navs.map((n) => (
              <NavLink
                key={n.to} to={n.to} end={n.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50'
                  }`
                }
              >
                <n.icon className="size-5" />{n.label}
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-0 inset-x-0 p-3 border-t border-ink-200 bg-white">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="size-9 rounded-full bg-hero-gradient text-white grid place-items-center font-bold">
                {user?.fullName?.[0] || 'H'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{user?.fullName}</div>
                <div className="text-xs text-ink-500 truncate">{user?.email}</div>
              </div>
              <button onClick={logout} className="btn-ghost btn-md !p-2" aria-label="התנתק"><LogOut className="size-4" /></button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
