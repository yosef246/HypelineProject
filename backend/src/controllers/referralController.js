import { Referral } from '../models/Referral.js';
import { Campaign } from '../models/Campaign.js';
import { Coupon } from '../models/Coupon.js';
import { createUniqueCoupon } from '../services/couponService.js';
import { ApiError, asyncHandler, ok, generateRefSlug } from '../utils/helpers.js';

// Marketer joins a campaign → gets a personal slug + coupon
export const joinCampaign = asyncHandler(async (req, res) => {
  const { campaignId } = req.body || {};
  const campaign = await Campaign.findById(campaignId).populate('event');
  if (!campaign) throw new ApiError(404, 'קמפיין לא נמצא');
  if (campaign.status !== 'active') throw new ApiError(400, 'הקמפיין אינו פעיל');

  const exists = await Referral.findOne({ campaign: campaign._id, marketer: req.user._id });
  if (exists) throw new ApiError(409, 'כבר הצטרפת לקמפיין זה');

  if (campaign.maxMarketers && campaign.stats.marketers >= campaign.maxMarketers) {
    throw new ApiError(400, 'הקמפיין הגיע למכסת המשווקים המקסימלית');
  }

  // unique slug
  let slug = generateRefSlug();
  while (await Referral.exists({ slug })) slug = generateRefSlug();

  // Pre-create referral with placeholder coupon, then attach real coupon
  const referral = await Referral.create({
    campaign: campaign._id,
    marketer: req.user._id,
    event: campaign.event._id,
    slug,
    couponCode: 'TEMP-' + slug, // temp value until coupon is created (unique still)
    status: campaign.requireApproval ? 'pending' : 'approved',
  });

  const coupon = await createUniqueCoupon({
    referral, campaign, marketer: req.user,
    discountPercent: campaign.discountPercent,
  });

  referral.couponCode = coupon.code;
  await referral.save();

  await Campaign.updateOne({ _id: campaign._id }, { $inc: { 'stats.marketers': 1 } });

  return ok(res, { referral, coupon }, 'הצטרפת לקמפיין! הלינק והקופון שלך מוכנים');
});

export const myReferrals = asyncHandler(async (req, res) => {
  const items = await Referral.find({ marketer: req.user._id })
    .populate('event', 'title slug coverImage startsAt city externalUrl')
    .populate('campaign', 'name commissionType commissionValue discountPercent status')
    .sort({ createdAt: -1 })
    .lean();
  return ok(res, { items });
});

export const myReferralBySlug = asyncHandler(async (req, res) => {
  const referral = await Referral.findOne({ slug: req.params.slug, marketer: req.user._id })
    .populate('event campaign')
    .lean();
  if (!referral) throw new ApiError(404);
  return ok(res, { referral });
});

// Public lookup of referral by slug → returns redirect target + coupon for tracker
export const lookupReferral = asyncHandler(async (req, res) => {
  const referral = await Referral.findOne({ slug: req.params.slug, status: 'approved' })
    .populate('event', 'title slug coverImage externalUrl externalPlatform startsAt city')
    .populate('campaign', 'name discountPercent status')
    .lean();
  if (!referral) throw new ApiError(404, 'הלינק לא נמצא או אינו פעיל');
  return ok(res, { referral });
});

// Producer view of referrals on their campaigns
export const campaignReferrals = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOne({ _id: req.params.campaignId, producer: req.user._id });
  if (!campaign) throw new ApiError(404, 'קמפיין לא נמצא');
  const items = await Referral.find({ campaign: campaign._id })
    .populate('marketer', 'fullName username email phone city')
    .sort({ 'stats.sales': -1 })
    .lean();
  return ok(res, { items });
});
