import { Campaign } from '../models/Campaign.js';
import { Event } from '../models/Event.js';
import { Referral } from '../models/Referral.js';
import { ApiError, asyncHandler, ok } from '../utils/helpers.js';

export const createCampaign = asyncHandler(async (req, res) => {
  const { eventId, name, description, commissionType, commissionValue,
    discountPercent, startsAt, endsAt, maxMarketers, requireApproval } = req.body || {};

  const event = await Event.findOne({ _id: eventId, producer: req.user._id });
  if (!event) throw new ApiError(404, 'אירוע לא נמצא');
  if (commissionValue == null) throw new ApiError(400, 'אחוז עמלה חובה');
  if (commissionType === 'percent' && (commissionValue < 0 || commissionValue > 100)) {
    throw new ApiError(400, 'אחוז עמלה חייב להיות בין 0 ל-100');
  }

  const campaign = await Campaign.create({
    event: event._id,
    producer: req.user._id,
    name: name || `קמפיין: ${event.title}`,
    description, commissionType, commissionValue,
    discountPercent, startsAt, endsAt, maxMarketers, requireApproval,
    status: 'active',
  });
  return ok(res, { campaign }, 'הקמפיין נפתח');
});

export const listMyCampaigns = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'producer' ? { producer: req.user._id } : {};
  const items = await Campaign.find(filter)
    .populate('event', 'title slug coverImage startsAt city')
    .sort({ createdAt: -1 })
    .lean();
  return ok(res, { items });
});

// Available campaigns for marketers to join
export const listAvailableCampaigns = asyncHandler(async (req, res) => {
  const items = await Campaign.find({ status: 'active' })
    .populate('event', 'title slug coverImage startsAt city externalPlatform')
    .sort({ createdAt: -1 })
    .lean();
  // hide ones the marketer already joined
  if (req.user) {
    const joined = await Referral.find({ marketer: req.user._id }).select('campaign').lean();
    const joinedIds = new Set(joined.map((r) => String(r.campaign)));
    return ok(res, { items: items.filter((c) => !joinedIds.has(String(c._id))) });
  }
  return ok(res, { items });
});

export const getCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate('event', 'title slug coverImage startsAt city externalPlatform externalUrl')
    .lean();
  if (!campaign) throw new ApiError(404, 'קמפיין לא נמצא');
  return ok(res, { campaign });
});

export const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOne({ _id: req.params.id, producer: req.user._id });
  if (!campaign) throw new ApiError(404, 'קמפיין לא נמצא');
  const allowed = ['name', 'description', 'commissionValue', 'discountPercent', 'endsAt', 'status', 'maxMarketers', 'requireApproval'];
  for (const k of allowed) if (k in req.body) campaign[k] = req.body[k];
  await campaign.save();
  return ok(res, { campaign }, 'הקמפיין עודכן');
});
