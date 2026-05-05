// Shared registration utilities
export const phoneRule = {
  required: 'טלפון חובה',
  pattern: { value: /^(\+?972|0)5\d{8}$/, message: 'מספר טלפון ישראלי לא תקין' },
};

export const passwordRule = {
  required: 'סיסמה חובה',
  minLength: { value: 8, message: 'לפחות 8 תווים' },
  validate: {
    hasLetter: (v) => /[A-Za-z]/.test(v) || 'הסיסמה חייבת להכיל אות לטינית',
    hasDigit: (v) => /\d/.test(v) || 'הסיסמה חייבת להכיל ספרה',
  },
};

export const emailRule = {
  required: 'אימייל חובה',
  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'אימייל לא תקין' },
};
