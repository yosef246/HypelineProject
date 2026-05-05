import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone, Wallet, ArrowLeft } from 'lucide-react';

export default function RegisterChoice() {
  const options = [
    { to: '/register/marketer', icon: Wallet, title: 'אני רוצה להרוויח', sub: 'הצטרפו כמשווקים, שתפו לינקים, קחו אחוז מכל מכירה', accent: 'bg-hero-gradient text-white' },
    { to: '/register/producer', icon: Megaphone, title: 'אני מפיק/ה אירועים', sub: 'הוסיפו את האירועים שלכם, פתחו קמפיינים, גייסו מאות משווקים', accent: 'bg-white text-ink-900 border border-ink-200' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center">בחרו את הסוג שלכם</h1>
      <p className="text-center text-ink-600 mt-2">בכל רגע תוכלו ליצור גם חשבון מהסוג השני</p>
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        {options.map((o, i) => (
          <motion.div key={o.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={o.to} className={`block rounded-3xl p-8 shadow-card hover:shadow-glow transition group ${o.accent}`}>
              <o.icon className="size-10 mb-4" />
              <h3 className="text-2xl font-bold">{o.title}</h3>
              <p className="mt-2 opacity-90">{o.sub}</p>
              <div className="mt-6 inline-flex items-center gap-2 font-semibold">
                להמשך הרשמה <ArrowLeft className="size-4 group-hover:-translate-x-1 transition" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
