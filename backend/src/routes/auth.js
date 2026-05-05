import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  registerProducer,
  registerMarketer,
  registerCustomer,
  login,
  refresh,
  logout,
} from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import {
  producerRegisterSchema,
  marketerRegisterSchema,
  customerRegisterSchema,
  loginSchema,
} from '../validators/auth.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { ok: false, error: 'יותר מדי ניסיונות, נסה שוב בעוד 15 דקות' },
});

router.post('/register/producer', authLimiter, validate({ body: producerRegisterSchema }), registerProducer);
router.post('/register/marketer', authLimiter, validate({ body: marketerRegisterSchema }), registerMarketer);
router.post('/register/customer', authLimiter, validate({ body: customerRegisterSchema }), registerCustomer);
router.post('/login', authLimiter, validate({ body: loginSchema }), login);
router.post('/refresh', refresh);
router.post('/logout', requireAuth, logout);

export default router;
