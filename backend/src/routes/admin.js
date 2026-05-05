import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { Campaign } from '../models/Campaign.js';
import { Commission } from '../models/Commission.js';
import { PayoutRequest } from '../models/PayoutRequest.js';
import { asyncHandler, ok } from '../utils/helpers.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/stats', asyncHandler(async (_req, res) => {
  const [users, events, campaigns, commissionsAgg, payoutsAgg] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Campaign.countDocuments(),
    Commission.aggregate([{ $group: { _id: '$status', total: { $sum: '$commissionAmount' }, count: { $sum: 1 } } }]),
    PayoutRequest.aggregate([{ $group: { _id: '$status', total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
  ]);
  return ok(res, { users, events, campaigns, commissions: commissionsAgg, payouts: payoutsAgg });
}));

router.get('/users', asyncHandler(async (req, res) => {
  const { role, status, q } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (q) filter.$or = [
    { fullName: new RegExp(q, 'i') },
    { email: new RegExp(q, 'i') },
    { username: new RegExp(q, 'i') },
  ];
  const items = await User.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  return ok(res, { items });
}));

router.patch('/users/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body || {};
  if (!['pending', 'active', 'blocked', 'rejected'].includes(status)) {
    return res.status(400).json({ ok: false, error: 'status לא תקין' });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { status, $inc: { refreshTokenVersion: 1 } }, { new: true });
  return ok(res, { user: user.toPublicJSON() }, 'הסטטוס עודכן');
}));

export default router;
