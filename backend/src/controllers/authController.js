import { User } from '../models/User.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  cookieOptions,
  REFRESH_COOKIE_MS,
} from '../utils/token.js';
import { ApiError, asyncHandler, ok } from '../utils/helpers.js';

const REFRESH_COOKIE_NAME = 'hyp_rt';

const issueTokens = (user) => {
  const accessToken = signAccessToken({ sub: user._id, role: user.role });
  const refreshToken = signRefreshToken({
    sub: user._id,
    role: user.role,
    ver: user.refreshTokenVersion,
  });
  return { accessToken, refreshToken };
};

const setRefreshCookie = (res, token) => {
  res.cookie(REFRESH_COOKIE_NAME, token, cookieOptions(REFRESH_COOKIE_MS));
};

export const registerProducer = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, city, businessName, activityType } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'אימייל כבר קיים במערכת', 'DUPLICATE_EMAIL');

  const user = await User.create({
    role: 'producer',
    fullName,
    email,
    phone,
    password,
    city,
    businessName,
    activityType,
    status: 'active', // for MVP - auto-activate. In prod set to 'pending' for admin approval
    termsAcceptedAt: new Date(),
    privacyAcceptedAt: new Date(),
  });

  const { accessToken, refreshToken } = issueTokens(user);
  setRefreshCookie(res, refreshToken);
  return ok(res, { user: user.toPublicJSON(), accessToken }, 'הרשמה בוצעה בהצלחה');
});

export const registerMarketer = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, city, username } = req.body;

  const dup = await User.findOne({ $or: [{ email }, { username }] });
  if (dup) {
    const field = dup.email === email ? 'אימייל' : 'שם משתמש';
    throw new ApiError(409, `${field} כבר קיים במערכת`, 'DUPLICATE');
  }

  const user = await User.create({
    role: 'marketer',
    fullName,
    email,
    phone,
    password,
    city,
    username,
    status: 'active',
    termsAcceptedAt: new Date(),
    privacyAcceptedAt: new Date(),
  });

  const { accessToken, refreshToken } = issueTokens(user);
  setRefreshCookie(res, refreshToken);
  return ok(res, { user: user.toPublicJSON(), accessToken }, 'הרשמה בוצעה בהצלחה');
});

export const registerCustomer = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'אימייל כבר קיים במערכת', 'DUPLICATE_EMAIL');

  const user = await User.create({
    role: 'customer',
    fullName,
    email,
    phone,
    password,
    status: 'active',
    termsAcceptedAt: new Date(),
    privacyAcceptedAt: new Date(),
  });

  const { accessToken, refreshToken } = issueTokens(user);
  setRefreshCookie(res, refreshToken);
  return ok(res, { user: user.toPublicJSON(), accessToken }, 'הרשמה בוצעה בהצלחה');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'פרטי התחברות שגויים', 'INVALID_CREDENTIALS');

  const matches = await user.comparePassword(password);
  if (!matches) throw new ApiError(401, 'פרטי התחברות שגויים', 'INVALID_CREDENTIALS');

  if (user.status === 'blocked') throw new ApiError(403, 'החשבון חסום', 'BLOCKED');

  user.lastLoginAt = new Date();
  await user.save();

  const { accessToken, refreshToken } = issueTokens(user);
  setRefreshCookie(res, refreshToken);
  return ok(res, { user: user.toPublicJSON(), accessToken }, 'התחברת בהצלחה');
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.signedCookies?.[REFRESH_COOKIE_NAME];
  if (!token) throw new ApiError(401, 'אין סשן פעיל', 'NO_REFRESH');

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, 'סשן לא תקין', 'INVALID_REFRESH');
  }

  const user = await User.findById(payload.sub);
  if (!user || user.refreshTokenVersion !== payload.ver) {
    throw new ApiError(401, 'סשן לא תקין', 'INVALID_REFRESH');
  }

  const { accessToken, refreshToken } = issueTokens(user);
  setRefreshCookie(res, refreshToken);
  return ok(res, { accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { $inc: { refreshTokenVersion: 1 } });
  }
  res.clearCookie(REFRESH_COOKIE_NAME, { ...cookieOptions(0), maxAge: 0 });
  return ok(res, {}, 'התנתקת בהצלחה');
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return ok(res, { user: user.toPublicJSON() });
});
