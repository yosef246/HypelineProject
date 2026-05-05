import { logger } from '../utils/logger.js';

export const notFound = (req, res) => {
  res.status(404).json({ ok: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ ok: false, error: `הערך כבר קיים במערכת (${field})`, code: 'DUPLICATE' });
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ ok: false, error: 'נתונים לא תקינים', details });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ ok: false, error: 'טוקן לא תקין', code: 'INVALID_TOKEN' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ ok: false, error: 'פג תוקף הטוקן', code: 'TOKEN_EXPIRED' });
  }

  // Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      ok: false,
      error: 'נתונים לא תקינים',
      details: err.issues?.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }

  if (status >= 500) {
    logger.error(err);
  }

  res.status(status).json({
    ok: false,
    error: err.message || 'שגיאת שרת',
    code: err.code,
  });
};
