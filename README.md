# Hypeline 🎉

> פלטפורמת שיווק שותפים (Affiliate) לאירועים ומסיבות

**Hypeline** היא שכבת שיווק מעל פלטפורמות חיצוניות (כמו GoOut, Eventbrite). מפיקים יוצרים קמפיינים, משווקים מקבלים לינקים אישיים עם קופונים ייחודיים, ומרוויחים עמלה על כל מכירה מאומתת.

---

## 🧱 סטאק טכנולוגי

| שכבה | טכנולוגיה |
|------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| State | Zustand + React Query |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (Access + Refresh) + bcrypt |
| Security | Helmet + Rate Limiting + Validation (Zod) |
| Email | Nodemailer (Resend / SMTP) |
| PWA | Vite PWA Plugin |

---

## 👥 סוגי משתמשים

1. **מפיק (Producer)** - יוצר אירועים וקמפיינים
2. **משווק (Marketer)** - מצטרף לקמפיינים, מקבל לינק אישי, מרוויח עמלות
3. **לקוח (Customer)** - לוחץ על לינק, רוכש באתר חיצוני
4. **אדמין (SuperAdmin)** - שולט בכל המערכת

---

## 📂 מבנה פרויקט

```
hypeline/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite SPA
├── branding/         # לוגו, אייקונים, נכסי מותג
├── docs/             # תיעוד נוסף
└── README.md
```

---

## 🚀 התחלה מהירה

### דרישות מקדימות
- Node.js 18+
- חשבון MongoDB Atlas (חינם)
- חשבון Resend / Brevo לאימיילים (חינם)

### התקנה

```bash
# Backend
cd backend
npm install
cp .env.example .env
# ערוך את .env עם הפרטים שלך
npm run dev

# Frontend (טרמינל נפרד)
cd frontend
npm install
cp .env.example .env
npm run dev
```

ה-Backend ירוץ על `http://localhost:5000`
ה-Frontend ירוץ על `http://localhost:5173`

---

## 🔐 אבטחה

- ✅ JWT Access Token (15 דק') + Refresh Token (7 ימים)
- ✅ bcrypt לסיסמאות (10 rounds)
- ✅ Helmet + CORS + Rate Limiting
- ✅ Validation עם Zod
- ✅ MongoDB Sanitization
- ✅ Role-based Authorization
- ✅ HttpOnly Cookies לטוקנים

---

## 💸 מודל עסקי

המערכת תומכת ב:
- אחוז עמלה משתנה לכל קמפיין (נקבע ע"י המפיק)
- שיוך מכירות אוטומטי דרך **קופונים ייחודיים**
- חישוב עמלות אוטומטי
- ייצוא קובץ **מס"ב (Masav)** להעברות בנקאיות מרוכזות

---

## 📱 PWA

- Add to Home Screen (Android + iOS)
- Splash Screen
- Standalone Mode
- Offline Fallback
- Push Notifications (עתידי)

---

## 📜 רישיון

Private - All rights reserved © Hypeline 2026
