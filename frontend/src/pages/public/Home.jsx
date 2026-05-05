import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Megaphone, Wallet, ArrowLeft, TrendingUp, Users, Zap } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 badge-brand text-sm">
              <Sparkles className="size-4" /> פלטפורמת השיווק החדשה לאירועים
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-balance">
              <span className="bg-hero-gradient bg-clip-text text-transparent">תהפכו</span>{' '}
              את האהבה שלכם למסיבות לכסף
            </h1>
            <p className="mt-6 text-lg md:text-xl text-ink-700 max-w-2xl mx-auto text-balance">
              Hypeline מחברת בין מפיקים שמחפשים קהל לבין משווקים שמבינים בקהל. פתחו קמפיין, שתפו לינק, הרוויחו עמלה.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to="/register/marketer" className="btn-primary btn-lg">
                התחילו להרוויח <ArrowLeft className="size-5" />
              </Link>
              <Link to="/register/producer" className="btn-ghost btn-lg">אני מפיק/ה</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {[
            { v: '10K+', l: 'משווקים פעילים' },
            { v: '₪0', l: 'דמי הצטרפות' },
            { v: '24/7', l: 'מעקב חי' },
          ].map((s, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="card text-center"
            >
              <div className="text-2xl md:text-3xl font-bold bg-hero-gradient bg-clip-text text-transparent">{s.v}</div>
              <div className="text-sm text-ink-500 mt-1">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">איך זה עובד?</h2>
          <p className="mt-3 text-ink-600">3 צעדים פשוטים מהרשמה לכסף בחשבון</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { i: Megaphone, t: '1. הצטרפו לקמפיין', d: 'בחרו מתוך עשרות אירועים פעילים את אלה שמתאימים לקהל שלכם' },
            { i: Zap, t: '2. שתפו את הלינק', d: 'נצרים לכם לינק אישי וקופון ייחודי. שתפו ברשתות, בקבוצות, באישי' },
            { i: Wallet, t: '3. תקבלו עמלה', d: 'על כל מכירה שתבוצע עם הקופון שלכם – אנחנו מזכים אתכם אוטומטית' },
          ].map((s, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="card"
            >
              <div className="size-12 rounded-2xl bg-hero-gradient text-white grid place-items-center mb-4">
                <s.i className="size-6" />
              </div>
              <h3 className="text-xl font-bold">{s.t}</h3>
              <p className="mt-2 text-ink-600">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-3xl bg-hero-gradient text-white p-10 md:p-16 text-center shadow-glow overflow-hidden relative">
          <div className="absolute inset-0 bg-mesh opacity-30" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold">מוכנים להתחיל?</h2>
            <p className="mt-3 opacity-90">חינם להירשם. אין דמי מנוי. אין הפתעות.</p>
            <Link to="/register" className="mt-8 inline-flex items-center gap-2 bg-white text-brand-700 px-7 py-3.5 rounded-xl font-bold shadow-soft hover:scale-105 transition">
              <Users className="size-5" /> הצטרפו לקהילה
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
