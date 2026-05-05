import { verifyAccessToken } from '../utils/token.js';
import { User } from '../models/User.js';
import { ApiError, asyncHandler } from '../utils/helpers.js';

// Required: throws if no/invalid token
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new ApiError(401, 'נדרשת התחברות', 'NO_TOKEN');

  const payload = verifyAccessToken(token);
  const user = await User.findById(payload.sub).lean();
  if (!user) throw new ApiError(401, 'משתמש לא נמצא', 'USER_NOT_FOUND');
  if (user.status === 'blocked') throw new ApiError(403, 'החשבון חסום', 'BLOCKED');

  req.user = user;
  req.userId = user._id;
  next();
});

// Optional: attach user if logged in, never throws
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).lean();
    if (user && user.status !== 'blocked') {
      req.user = user;
      req.userId = user._id;
    }
  } catch {
    /* ignore */
  }
  next();
});
