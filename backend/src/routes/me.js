import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { me } from '../controllers/authController.js';
import { User } from '../models/User.js';
import { asyncHandler, ok } from '../utils/helpers.js';

const router = Router();

router.use(requireAuth);

router.get('/', me);

router.patch(
  '/',
  asyncHandler(async (req, res) => {
    const allowed = ['fullName', 'phone', 'city', 'businessName', 'activityType'];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true });
    return ok(res, { user: user.toPublicJSON() }, 'הפרופיל עודכן');
  })
);

router.patch(
  '/bank',
  asyncHandler(async (req, res) => {
    if (req.user.role !== 'marketer' && req.user.role !== 'admin') {
      return res.status(403).json({ ok: false, error: 'רק משווקים יכולים לעדכן פרטי בנק' });
    }
    const { accountHolder, bankCode, branchCode, accountNumber, idNumber } = req.body || {};
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bankDetails: { accountHolder, bankCode, branchCode, accountNumber, idNumber } },
      { new: true }
    );
    return ok(res, { user: user.toPublicJSON() }, 'פרטי הבנק נשמרו');
  })
);

export default router;
