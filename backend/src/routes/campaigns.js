import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireProducer, requireMarketer } from '../middleware/rbac.js';
import {
  createCampaign, listMyCampaigns, listAvailableCampaigns, getCampaign, updateCampaign,
} from '../controllers/campaignController.js';

const router = Router();

router.post('/', requireAuth, requireProducer, createCampaign);
router.get('/mine', requireAuth, requireProducer, listMyCampaigns);
router.get('/available', requireAuth, requireMarketer, listAvailableCampaigns);
router.get('/:id', requireAuth, getCampaign);
router.patch('/:id', requireAuth, requireProducer, updateCampaign);

export default router;
