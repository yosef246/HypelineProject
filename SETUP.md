# 🚀 הוראות הפעלה - Hypeline MVP

מדריך שלב-אחר-שלב להפעלה מקומית ולפריסה לפרודקשן.

---

## 📋 דרישות מקדימות

| כלי | גרסה | הורדה |
|-----|------|--------|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | מגיע עם Node |
| Git | latest | https://git-scm.com |
| MongoDB | מקומי או Atlas | https://mongodb.com/atlas |

---

## 1️⃣ MongoDB Atlas (חינם)

1. נכנסו ל-https://www.mongodb.com/cloud/atlas/register וצרו חשבון
2. צרו Cluster חינמי (M0 Free)
3. תחת **Database Access** הוסיפו משתמש (שמרו סיסמה)
4. תחת **Network Access** הוסיפו `0.0.0.0/0` (לא מומלץ לפרודקשן)
5. לחצו **Connect → Drivers** והעתיקו את ה-Connection String
6. החליפו `<password>` בסיסמה שיצרתם, והוסיפו `/hypeline` בסוף לפני ה-`?`

דוגמה:
```
mongodb+srv://yosef:MyP@ssw0rd@cluster0.abcde.mongodb.net/hypeline?retryWrites=true&w=majority
```

---

## 2️⃣ הפעלת ה-Backend

```bash
cd hypeline/backend
npm install
cp .env.example .env
```

ערכו את הקובץ `.env`:
```bash
MONGODB_URI=mongodb+srv://...   # הכניסו את המחרוזת מ-Atlas
JWT_ACCESS_SECRET=<יצרו מחרוזת רנדומלית באורך 32+ תווים>
JWT_REFRESH_SECRET=<מחרוזת רנדומלית אחרת>
COOKIE_SECRET=<עוד מחרוזת רנדומלית>
```

💡 ליצירת מחרוזת אקראית מהירה:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

יצירת משתמש אדמין ראשון:
```bash
npm run seed
```
פלט: יודפסו פרטי כניסה - שמרו אותם!

הרצת השרת:
```bash
npm run dev
```

ה-API יהיה זמין ב-http://localhost:5000
בדיקה: http://localhost:5000/api/health

---

## 3️⃣ הפעלת ה-Frontend

טרמינל **חדש**:
```bash
cd hypeline/frontend
npm install
cp .env.example .env
npm run dev
```

האפליקציה תהיה זמינה ב-http://localhost:5173

---

## 4️⃣ זרימת בדיקה ראשונה

1. **כנסו לאתר** ב-http://localhost:5173
2. **הירשמו כמפיק** דרך `/register/producer`
3. **צרו אירוע ראשון** - הזינו לינק חיצוני (למשל ל-GoOut)
4. **פתחו קמפיין** עם 10% עמלה
5. **התנתקו** ו**הירשמו כמשווק** (טרמינל חדש / חלון פרטי)
6. **הצטרפו לקמפיין** ב-`/marketer/available`
7. **קבלו לינק וקופון** ב-`/marketer/links`
8. **לחצו על הלינק** מחלון פרטי - הקליק ירשם
9. **התנתקו וכנסו כמפיק** - לכו ל-`/producer/reports`
10. **דווחו על מכירה** עם הקופון של המשווק - העמלה תחושב אוטומטית

---

## 5️⃣ פריסה לפרודקשן (חינם)

### Frontend - Vercel
```bash
cd frontend
npm install -g vercel
vercel
```
הגדירו ב-Vercel את משתני הסביבה:
- `VITE_API_URL` = כתובת ה-Backend בפרודקשן

### Backend - Render
1. נכנסו ל-https://render.com והתחברו עם GitHub
2. New → Web Service → בחרו את ה-repo
3. הגדרות:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. הוסיפו את כל משתני הסביבה מ-`.env`
5. שנו `CLIENT_URL` לכתובת ה-Vercel שלכם

---

## 6️⃣ אבטחה לפני פרודקשן

חובה לפני העלאה אמיתית:

- [ ] שינוי סיסמת אדמין דיפולטיבית
- [ ] JWT secrets ארוכים (32+ תווים) ושונים זה מזה
- [ ] `NODE_ENV=production`
- [ ] צמצום `Network Access` ב-MongoDB ל-IP של Render בלבד
- [ ] חיבור Domain מותאם + SSL
- [ ] חיבור שירות מייל אמיתי (Resend/Brevo)
- [ ] הוספת Sentry/LogRocket לניטור שגיאות

---

## 🆘 פתרון תקלות נפוצות

| בעיה | פתרון |
|------|--------|
| `MongooseServerSelectionError` | בדקו Network Access ב-Atlas + Connection String |
| `CORS error` בדפדפן | הגדירו `CLIENT_URL` ב-`.env` של ה-Backend |
| `Cannot find module` | הריצו `npm install` בתיקייה הנכונה |
| Hebrew characters broken | ודאו שהקובץ נשמר ב-UTF-8 |
| התחברות ל-Mongo נכשלת | פתחו את הסיסמה ב-URL encode (`@` → `%40`, וכו') |

---

## 📚 מבנה הפרויקט

```
hypeline/
├── backend/
│   ├── server.js                # Entry point
│   └── src/
│       ├── app.js               # Express setup
│       ├── config/db.js         # MongoDB connection
│       ├── models/              # 9 Mongoose collections
│       ├── controllers/         # Business logic
│       ├── routes/              # API endpoints
│       ├── middleware/          # auth, rbac, validation, errors
│       ├── services/            # coupon, masav (bank file)
│       ├── validators/          # Zod schemas
│       ├── utils/               # logger, token, helpers
│       └── scripts/seed.js      # Initial admin
└── frontend/
    └── src/
        ├── App.jsx              # Router
        ├── main.jsx             # Entry
        ├── components/
        │   ├── ui/              # Button, Toast, Stat, Logo, FormField
        │   ├── layout/          # Public/Dashboard layouts
        │   └── auth/
        ├── pages/
        │   ├── public/          # Home, Events, GoRedirect, NotFound
        │   ├── auth/            # Login, Register*
        │   ├── producer/        # Dashboard, CreateEvent, MyEvents, Campaigns, Reports
        │   ├── marketer/        # Dashboard, AvailableEvents, MyLinks, Earnings
        │   ├── admin/           # Dashboard, Users, Payouts
        │   └── shared/          # Profile
        ├── store/               # Zustand: auth, toast
        └── services/api.js      # Axios + auto-refresh
```
