import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.js';
import { requireProducer } from '../middleware/rbac.js';
import { trackClick, reportSale } from '../controllers/trackingController.js';

const router = Router();

const clickLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { ok: false, error: 'יותר מדי קליקים בזמן קצר' },
});

router.post('/click', clickLimiter, trackClick);
router.post('/sale', requireAuth, requireProducer, reportSale);

export default router;
