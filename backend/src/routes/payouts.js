import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireMarketer, requireAdmin } from '../middleware/rbac.js';
import { Commission } from '../models/Commission.js';
import { PayoutRequest } from '../models/PayoutRequest.js';
import { User } from '../models/User.js';
import { asyncHandler, ok, ApiError } from '../utils/helpers.js';
import { buildMasavCsv, buildMasavSummary } from '../services/masavService.js';

const router = Router();

const MIN_PAYOUT = 50;

// Marketer requests payout of all approved commissions
router.post('/request', requireAuth, requireMarketer, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.bankDetails?.accountNumber) {
    throw new ApiError(400, 'יש למלא קודם פרטי חשבון בנק בפרופיל');
  }

  const approved = await Commission.find({ marketer: user._id, status: 'approved' });
  if (!approved.length) throw new ApiError(400, 'אין עמלות מאושרות לתשלום');

  const amount = +approved.reduce((s, c) => s + c.commissionAmount, 0).toFixed(2);
  if (amount < MIN_PAYOUT) throw new ApiError(400, `הסכום המינימלי למשיכה הוא ${MIN_PAYOUT}₪`);

  const payout = await PayoutRequest.create({
    marketer: user._id, amount, currency: 'ILS',
    commissions: approved.map((c) => c._id),
    bankSnapshot: user.bankDetails,
    status: 'pending',
  });
  return ok(res, { payout }, 'בקשת התשלום נשלחה');
}));

// Marketer: my payouts
router.get('/mine', requireAuth, requireMarketer, asyncHandler(async (req, res) => {
  const items = await PayoutRequest.find({ marketer: req.user._id }).sort({ createdAt: -1 }).lean();
  return ok(res, { items });
}));

// Admin: list all payouts
router.get('/all', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const items = await PayoutRequest.find(filter).populate('marketer', 'fullName username email').sort({ createdAt: -1 }).lean();
  return ok(res, { items });
}));

// Admin: export Masav CSV for pending payouts
router.post('/masav/export', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const payouts = await PayoutRequest.find({ status: 'pending' });
  if (!payouts.length) throw new ApiError(400, 'אין בקשות תשלום פתוחות');

  const summary = buildMasavSummary(payouts);
  const csv = buildMasavCsv(payouts);
  const ids = payouts.map((p) => p._id);
  await PayoutRequest.updateMany(
    { _id: { $in: ids } },
    { $set: { status: 'processing', masavBatchId: summary.batchId, masavExportedAt: new Date() } }
  );
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${summary.batchId}.csv"`);
  res.send(csv);
}));

// Admin: mark payout as paid
router.patch('/:id/paid', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const p = await PayoutRequest.findById(req.params.id);
  if (!p) throw new ApiError(404, 'בקשת תשלום לא נמצאה');
  p.status = 'paid';
  p.paidAt = new Date();
  await p.save();
  await Commission.updateMany({ _id: { $in: p.commissions } }, { $set: { status: 'paid', paidAt: p.paidAt, payoutRequest: p._id } });
  return ok(res, { payout: p }, 'התשלום סומן כשולם');
}));

export default router;
