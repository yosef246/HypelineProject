import { Event } from '../models/Event.js';
import { Campaign } from '../models/Campaign.js';
import { ApiError, asyncHandler, ok, slugify } from '../utils/helpers.js';

export const listPublicEvents = asyncHandler(async (req, res) => {
  const { city, q, limit = 20, page = 1 } = req.query;
  const filter = { status: 'published', startsAt: { $gte: new Date() } };
  if (city) filter.city = city;
  if (q) filter.title = new RegExp(q, 'i');

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Event.find(filter).sort({ startsAt: 1 }).skip(skip).limit(Number(limit)).lean(),
    Event.countDocuments(filter),
  ]);
  return ok(res, { items, total, page: Number(page), limit: Number(limit) });
});

export const getEventBySlug = asyncHandler(async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug, status: 'published' }).lean();
  if (!event) throw new ApiError(404, 'אירוע לא נמצא');
  return ok(res, { event });
});

export const listMyEvents = asyncHandler(async (req, res) => {
  const items = await Event.find({ producer: req.user._id }).sort({ createdAt: -1 }).lean();
  return ok(res, { items });
});

export const createEvent = asyncHandler(async (req, res) => {
  const {
    title, description, coverImage, externalPlatform, externalUrl,
    venue, city, address, startsAt, endsAt, minAge, tags, priceFrom, currency,
    status = 'published',
  } = req.body || {};

  if (!title) throw new ApiError(400, 'כותרת חובה');
  if (!externalUrl) throw new ApiError(400, 'לינק חיצוני חובה');
  if (!startsAt) throw new ApiError(400, 'תאריך התחלה חובה');

  let slug = slugify(title) || `event-${Date.now()}`;
  // ensure unique slug
  let i = 0;
  while (await Event.exists({ slug })) {
    i += 1;
    slug = `${slugify(title)}-${i}`;
    if (i > 50) { slug = `${slug}-${Date.now()}`; break; }
  }

  const event = await Event.create({
    producer: req.user._id,
    title, slug, description, coverImage,
    externalPlatform, externalUrl,
    venue, city, address, startsAt, endsAt, minAge, tags, priceFrom, currency,
    status,
  });

  return ok(res, { event }, 'האירוע נוצר בהצלחה');
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOne({ _id: req.params.id, producer: req.user._id });
  if (!event) throw new ApiError(404, 'אירוע לא נמצא');
  Object.assign(event, req.body);
  await event.save();
  return ok(res, { event }, 'האירוע עודכן');
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, producer: req.user._id },
    { status: 'archived' },
    { new: true }
  );
  if (!event) throw new ApiError(404, 'אירוע לא נמצא');
  return ok(res, { event }, 'האירוע הועבר לארכיון');
});

export const eventCampaigns = asyncHandler(async (req, res) => {
  const items = await Campaign.find({
    event: req.params.id,
    producer: req.user._id,
  }).sort({ createdAt: -1 }).lean();
  return ok(res, { items });
});
