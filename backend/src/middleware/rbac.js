import { ApiError } from '../utils/helpers.js';

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) return next(new ApiError(401, 'נדרשת התחברות', 'NO_USER'));
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'אין לך הרשאה לגשת למשאב זה', 'FORBIDDEN'));
  }
  next();
};

export const requireProducer = requireRole('producer', 'admin');
export const requireMarketer = requireRole('marketer', 'admin');
export const requireAdmin = requireRole('admin');
export const requireActive = (req, _res, next) => {
  if (!req.user) return next(new ApiError(401, 'נדרשת התחברות', 'NO_USER'));
  if (req.user.status !== 'active') {
    return next(new ApiError(403, 'החשבון עדיין לא הופעל', 'NOT_ACTIVE'));
  }
  next();
};
