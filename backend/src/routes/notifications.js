import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Notification } from '../models/Notification.js';
import { asyncHandler, ok } from '../utils/helpers.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(async (req, res) => {
  const items = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50).lean();
  const unread = await Notification.countDocuments({ user: req.user._id, read: false });
  return ok(res, { items, unread });
}));

router.patch('/:id/read', asyncHandler(async (req, res) => {
  await Notification.updateOne({ _id: req.params.id, user: req.user._id }, { read: true, readAt: new Date() });
  return ok(res, {}, 'סומן כנקרא');
}));

router.patch('/read-all', asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true, readAt: new Date() });
  return ok(res, {}, 'הכול סומן כנקרא');
}));

export default router;
