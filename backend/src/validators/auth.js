import { z } from 'zod';

const phoneRegex = /^(\+?972|0)5\d{8}$/;
const passwordRule = z
  .string()
  .min(8, 'סיסמה חייבת להכיל לפחות 8 תווים')
  .regex(/[A-Za-z]/, 'הסיסמה חייבת להכיל אות לטינית')
  .regex(/\d/, 'הסיסמה חייבת להכיל ספרה');

const baseRegister = {
  fullName: z.string().min(2, 'שם מלא חובה').max(100),
  email: z.string().email('אימייל לא תקין').toLowerCase(),
  phone: z.string().regex(phoneRegex, 'מספר טלפון ישראלי לא תקין (לדוגמה: 050-1234567)'),
  password: passwordRule,
  passwordConfirm: z.string(),
  city: z.string().min(1, 'עיר חובה'),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'יש לאשר תנאי שימוש' }) }),
  acceptPrivacy: z.literal(true, { errorMap: () => ({ message: 'יש לאשר מדיניות פרטיות' }) }),
};

export const producerRegisterSchema = z
  .object({
    ...baseRegister,
    businessName: z.string().min(2, 'שם עסק חובה'),
    activityType: z.string().min(2, 'סוג פעילות חובה'),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: 'הסיסמאות אינן תואמות',
    path: ['passwordConfirm'],
  });

export const marketerRegisterSchema = z
  .object({
    ...baseRegister,
    username: z
      .string()
      .min(3, 'שם משתמש חייב להיות לפחות 3 תווים')
      .max(30)
      .regex(/^[a-z0-9_]+$/, 'שם משתמש: אותיות לטיניות קטנות, ספרות וקו תחתון בלבד')
      .toLowerCase(),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: 'הסיסמאות אינן תואמות',
    path: ['passwordConfirm'],
  });

export const customerRegisterSchema = z
  .object({
    fullName: baseRegister.fullName,
    email: baseRegister.email,
    phone: baseRegister.phone,
    password: passwordRule,
    passwordConfirm: z.string(),
    acceptTerms: baseRegister.acceptTerms,
    acceptPrivacy: baseRegister.acceptPrivacy,
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: 'הסיסמאות אינן תואמות',
    path: ['passwordConfirm'],
  });

export const loginSchema = z.object({
  email: z.string().email('אימייל לא תקין').toLowerCase(),
  password: z.string().min(1, 'סיסמה חובה'),
});
