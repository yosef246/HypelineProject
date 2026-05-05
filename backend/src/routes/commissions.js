import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireMarketer, requireProducer } from '../middleware/rbac.js';
import { Commission } from '../models/Commission.js';
import { asyncHandler, ok } from '../utils/helpers.js';

const router = Router();

// Marketer: my commissions
router.get('/mine', requireAuth, requireMarketer, asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { marketer: req.user._id };
  if (status) filter.status = status;
  const items = await Commission.find(filter)
    .populate('event', 'title startsAt')
    .populate('campaign', 'name')
    .sort({ createdAt: -1 })
    .lean();

  const summary = await Commission.aggregate([
    { $match: { marketer: req.user._id } },
    { $group: { _id: '$status', total: { $sum: '$commissionAmount' }, count: { $sum: 1 } } },
  ]);
  return ok(res, { items, summary });
}));

// Producer: commissions on their campaigns
router.get('/producer', requireAuth, requireProducer, asyncHandler(async (req, res) => {
  const items = await Commission.find({ producer: req.user._id })
    .populate('marketer', 'fullName username')
    .populate('event', 'title')
    .sort({ createdAt: -1 })
    .lean();
  return ok(res, { items });
}));

// Producer: approve/reject pending commission
router.patch('/:id/status', requireAuth, requireProducer, asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body || {};
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ ok: false, error: 'status חייב להיות approved או rejected' });
  }
  const c = await Commission.findOne({ _id: req.params.id, producer: req.user._id });
  if (!c) return res.status(404).json({ ok: false, error: 'עמלה לא נמצאה' });
  if (c.status !== 'pending') return res.status(400).json({ ok: false, error: 'ניתן לעדכן רק עמלות בסטטוס pending' });
  c.status = status;
  if (status === 'approved') c.approvedAt = new Date();
  if (status === 'rejected') c.rejectionReason = rejectionReason;
  await c.save();
  return ok(res, { commission: c }, status === 'approved' ? 'העמלה אושרה' : 'העמלה נדחתה');
}));

export default router;
