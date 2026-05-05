import crypto from 'node:crypto';
import { UAParser } from 'ua-parser-js';
import { Referral } from '../models/Referral.js';
import { Campaign } from '../models/Campaign.js';
import { Coupon } from '../models/Coupon.js';
import { Commission } from '../models/Commission.js';
import { ClickLog } from '../models/ClickLog.js';
import { Notification } from '../models/Notification.js';
import { ApiError, asyncHandler, ok } from '../utils/helpers.js';

const hashIp = (ip = '') =>
  crypto.createHash('sha256').update(`${ip}::${process.env.COOKIE_SECRET || 'salt'}`).digest('hex').slice(0, 32);

const dayKey = () => new Date().toISOString().slice(0, 10);

// POST /api/track/click  { slug }
// Logs a click + bumps counters with anti-fraud dedup
export const trackClick = asyncHandler(async (req, res) => {
  const { slug } = req.body || {};
  if (!slug) throw new ApiError(400, 'slug חובה');

  const referral = await Referral.findOne({ slug, status: 'approved' });
  if (!referral) throw new ApiError(404, 'לינק לא נמצא');

  const ip = req.ip;
  const ipHash = hashIp(ip);
  const ua = new UAParser(req.headers['user-agent'] || '').getResult();
  const device = ua.device?.type || 'desktop';
  const dedupKey = `${ipHash}:${referral._id}:${dayKey()}`;

  const recent = await ClickLog.findOne({ dedupKey });
  const isUnique = !recent;

  await ClickLog.create({
    referral: referral._id,
    campaign: referral.campaign,
    marketer: referral.marketer,
    ipHash,
    userAgent: req.headers['user-agent']?.slice(0, 500),
    device, browser: ua.browser?.name, os: ua.os?.name,
    referrerHost: req.body.referrer || req.headers.referer,
    dedupKey, isUnique,
  });

  await Referral.updateOne(
    { _id: referral._id },
    {
      $inc: { 'stats.clicks': 1, ...(isUnique ? { 'stats.uniqueClicks': 1 } : {}) },
      $set: { lastClickAt: new Date() },
    }
  );
  await Campaign.updateOne({ _id: referral.campaign }, { $inc: { 'stats.clicks': 1 } });

  return ok(res, { logged: true, isUnique });
});

// POST /api/track/sale (called by producer's report / api / webhook)
// { couponCode, saleAmount, externalOrderId, source }
export const reportSale = asyncHandler(async (req, res) => {
  const { couponCode, saleAmount, quantity = 1, externalOrderId, source = 'producer-report' } = req.body || {};
  if (!couponCode) throw new ApiError(400, 'couponCode חובה');
  if (saleAmount == null || Number(saleAmount) < 0) throw new ApiError(400, 'saleAmount חובה');

  const coupon = await Coupon.findOne({ code: String(couponCode).toUpperCase() });
  if (!coupon) throw new ApiError(404, 'קופון לא נמצא');

  const referral = await Referral.findById(coupon.referral);
  const campaign = await Campaign.findById(coupon.campaign);
  if (!referral || !campaign) throw new ApiError(404, 'לינק/קמפיין לא נמצאו');

  // Authorization: producer owns campaign or admin
  if (req.user.role !== 'admin' && String(campaign.producer) !== String(req.user._id)) {
    throw new ApiError(403, 'אין הרשאה לדווח על מכירה לקמפיין זה');
  }

  // dedup by externalOrderId
  if (externalOrderId) {
    const dup = await Commission.findOne({ externalOrderId, campaign: campaign._id });
    if (dup) throw new ApiError(409, 'מכירה זו כבר דווחה במערכת');
  }

  const amt = Number(saleAmount);
  const commissionAmount = campaign.commissionType === 'percent'
    ? +(amt * (campaign.commissionValue / 100)).toFixed(2)
    : +Number(campaign.commissionValue).toFixed(2);

  const holdDays = Number(process.env.COMMISSION_HOLD_DAYS) || 14;
  const holdUntil = new Date(Date.now() + holdDays * 24 * 60 * 60 * 1000);

  const commission = await Commission.create({
    referral: referral._id,
    campaign: campaign._id,
    marketer: referral.marketer,
    producer: campaign.producer,
    event: campaign.event,
    couponCode: coupon.code,
    saleAmount: amt,
    quantity,
    externalOrderId,
    saleSource: source,
    commissionType: campaign.commissionType,
    commissionValue: campaign.commissionValue,
    commissionAmount,
    status: 'pending',
    holdUntil,
  });

  await Promise.all([
    Coupon.updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } }),
    Referral.updateOne(
      { _id: referral._id },
      {
        $inc: {
          'stats.sales': 1,
          'stats.revenue': amt,
          'stats.pending': commissionAmount,
        },
        $set: { lastSaleAt: new Date() },
      }
    ),
    Campaign.updateOne(
      { _id: campaign._id },
      { $inc: { 'stats.sales': 1, 'stats.revenue': amt } }
    ),
    Notification.create({
      user: referral.marketer,
      type: 'sale-converted',
      title: 'מכירה חדשה! 🎉',
      message: `קיבלת עמלה של ₪${commissionAmount} ממכירה חדשה`,
      data: { commissionId: commission._id },
      link: '/marketer/earnings',
    }),
  ]);

  return ok(res, { commission }, 'המכירה נרשמה והעמלה חושבה');
});
