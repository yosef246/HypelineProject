import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../ui/Logo';
import { Sparkles, LogOut } from 'lucide-react';

export default function PublicLayout() {
  const { user, logout } = useAuthStore();
  const dashLink =
    user?.role === 'producer' ? '/producer' :
    user?.role === 'marketer' ? '/marketer' :
    user?.role === 'admin'    ? '/admin'    : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-30 glass border-b border-ink-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" aria-label="דף הבית" className="text-ink-900">
            <Logo className="h-9" />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'text-brand-700 bg-brand-50' : 'text-ink-700 hover:bg-ink-100'}`}>בית</NavLink>
            <NavLink to="/events" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'text-brand-700 bg-brand-50' : 'text-ink-700 hover:bg-ink-100'}`}>אירועים</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {dashLink && <Link to={dashLink} className="btn-soft btn-md"><Sparkles className="size-4" />הדשבורד שלי</Link>}
                <button onClick={logout} className="btn-ghost btn-md" aria-label="התנתק"><LogOut className="size-4" /></button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost btn-md">כניסה</Link>
                <Link to="/register" className="btn-primary btn-md">הרשמה</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-ink-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <Logo className="h-8 text-ink-900 mb-3" />
            <p className="text-ink-500 leading-relaxed">פלטפורמת שיווק שותפים לאירועים ומסיבות. מפיקים פותחים, משווקים מרוויחים, כולם רוקדים.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">למפיקים</h4>
            <ul className="space-y-2 text-ink-600">
              <li><Link to="/register/producer" className="hover:text-brand-700">הרשמת מפיק</Link></li>
              <li><Link to="/events" className="hover:text-brand-700">אירועים</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">למשווקים</h4>
            <ul className="space-y-2 text-ink-600">
              <li><Link to="/register/marketer" className="hover:text-brand-700">הרשמת משווק</Link></li>
              <li><Link to="/login" className="hover:text-brand-700">התחברות</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ink-200 py-4 text-center text-xs text-ink-500">
          © {new Date().getFullYear()} Hypeline. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
