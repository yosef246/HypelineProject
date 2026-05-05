import { customAlphabet } from 'nanoid';

const codeAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const generateCouponCode = customAlphabet(codeAlphabet, 8);
export const generateRefSlug = customAlphabet('abcdefghijkmnopqrstuvwxyz0123456789', 10);

export const ApiError = class extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
};

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const ok = (res, data = {}, message) =>
  res.json({ ok: true, message, data });

export const fail = (res, status, error, code) =>
  res.status(status).json({ ok: false, error, code });

export const slugify = (str) =>
  String(str)
    .toLowerCase()
    .replace(/[֐-׿]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
