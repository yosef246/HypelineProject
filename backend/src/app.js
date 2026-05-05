import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';

import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import campaignRoutes from './routes/campaigns.js';
import referralRoutes from './routes/referrals.js';
import trackingRoutes from './routes/tracking.js';
import commissionRoutes from './routes/commissions.js';
import payoutRoutes from './routes/payouts.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import meRoutes from './routes/me.js';

export const app = express();

// Trust proxy (needed for correct IP behind nginx/render/etc.)
app.set('trust proxy', 1);

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(',') || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(mongoSanitize());
app.use(hpp());

// Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Performance & Logs
app.use(compression());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global rate limiter
app.use(
  '/api',
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, error: 'יותר מדי בקשות, נסה שוב בעוד מספר דקות' },
  })
);

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'hypeline-api', time: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/track', trackingRoutes);
app.use('/api/commissions', commissionRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// 404 + Error handlers
app.use(notFound);
app.use(errorHandler);
