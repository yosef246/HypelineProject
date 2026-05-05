# 🗺️ Hypeline - Roadmap

מה כבר נבנה ומה יבוא בעתיד.

---

## ✅ MVP (גרסה זו)

### Backend
- [x] Express server עם middleware מלא (Helmet, CORS, Rate Limiting, Compression)
- [x] חיבור MongoDB עם Mongoose
- [x] 9 מודלים: User, Event, Campaign, Referral, Coupon, ClickLog, Commission, PayoutRequest, Notification
- [x] JWT Access + Refresh Token rotation
- [x] HttpOnly cookies לאבטחה
- [x] bcrypt + סיסמאות חזקות
- [x] Zod validation
- [x] RBAC (Producer / Marketer / Customer / Admin)
- [x] קופונים ייחודיים (8 תווים) למשווק×קמפיין
- [x] מעקב קליקים עם anti-fraud (dedup, IP hashing)
- [x] חישוב עמלות אוטומטי (אחוזים / סכום קבוע)
- [x] Hold period להגנה (14 יום ברירת מחדל)
- [x] Masav CSV export להעברות בנקאיות מרוכזות
- [x] התראות פנימיות (Notifications model)

### Frontend
- [x] React 18 + Vite + Tailwind CSS + Framer Motion
- [x] React Query לניהול server state
- [x] Zustand לאוטנטיקציה ו-toasts
- [x] React Hook Form + validation
- [x] עברית RTL מלא
- [x] Hero section עם gradient mesh + אנימציות
- [x] Dashboard layouts ייחודיים לכל role
- [x] טפסי הרשמה דו-שלביים למפיקים
- [x] עמוד `/go/:slug` עם הצגת קופון ו-redirect אוטומטי
- [x] PWA installable + Service Worker (Vite PWA)
- [x] Manifest + אייקונים בכל הגדלים (72-512)
- [x] SEO: meta tags, Open Graph, Structured Data, robots.txt
- [x] Toast system עם 4 סוגים (success/error/info/loading)
- [x] Reduced motion support
- [x] Skeleton loaders

### Branding
- [x] לוגו SVG מקצועי עם gradient
- [x] Favicon
- [x] PWA icons (8 גדלים) + Apple touch icon + OG image
- [x] פלטת צבעים מלאה (brand violet, accent pink/amber)

---

## 🔜 Phase 2 (אחרי MVP)

- [ ] אינטגרציית API ל-GoOut / Eventbrite (webhook attribution אוטומטי)
- [ ] שליחת מיילים אמיתית (Resend / Brevo) - אישור חשבון, התראות, דוחות
- [ ] אימות SMS (Twilio / 019)
- [ ] העלאת תמונות אירועים (Cloudinary)
- [ ] חיפוש וסינון מתקדם (פאסט, ערים, גילאים)
- [ ] עמוד אנליטיקס מתקדם למפיקים (גרפים, ציר זמן)
- [ ] ייצוא דוחות (PDF / Excel)
- [ ] Customer dashboard - היסטוריית רכישות, כרטיסים שמורים
- [ ] Upsell popup אחרי רכישה (אינטגרציה עם הפלטפורמה החיצונית)
- [ ] Push Notifications דרך ה-PWA
- [ ] שיתוף ברשתות חברתיות עם תמונות מותאמות
- [ ] Multi-currency (USD, EUR)

---

## 🌟 Phase 3 (חברה אמיתית)

- [ ] Native iOS / Android (React Native)
- [ ] AI recommendations - קמפיינים מתאימים למשווק
- [ ] Chat בין מפיקים למשווקים
- [ ] Gamification (badges, leaderboards, achievements)
- [ ] Referral tree (משווקים מגייסים משווקים)
- [ ] Sub-affiliate networks
- [ ] סליקה פנימית (Tranzila / Meshulam) - לא רק linking חיצוני
- [ ] חשבוניות אוטומטיות (Green Invoice / EZcount)
- [ ] חוזי שיתוף פעולה דיגיטליים
- [ ] White-label ללקוחות עסקיים גדולים
- [ ] Webhooks לפלטפורמות חיצוניות
- [ ] שילוב עם CRM (HubSpot, Salesforce)
