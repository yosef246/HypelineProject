import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireMarketer, requireProducer } from '../middleware/rbac.js';
import {
  joinCampaign, myReferrals, myReferralBySlug,
  lookupReferral, campaignReferrals,
} from '../controllers/referralController.js';

const router = Router();

// Public lookup (used by /go/:slug page)
router.get('/lookup/:slug', lookupReferral);

// Marketer
router.post('/join', requireAuth, requireMarketer, joinCampaign);
router.get('/mine', requireAuth, requireMarketer, myReferrals);
router.get('/mine/:slug', requireAuth, requireMarketer, myReferralBySlug);

// Producer (referrals on a campaign)
router.get('/campaign/:campaignId', requireAuth, requireProducer, campaignReferrals);

export default router;
