import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireProducer } from '../middleware/rbac.js';
import {
  listPublicEvents, getEventBySlug, listMyEvents, createEvent,
  updateEvent, deleteEvent, eventCampaigns,
} from '../controllers/eventController.js';

const router = Router();

// Public
router.get('/', listPublicEvents);
router.get('/slug/:slug', getEventBySlug);

// Producer-only
router.get('/mine', requireAuth, requireProducer, listMyEvents);
router.post('/', requireAuth, requireProducer, createEvent);
router.patch('/:id', requireAuth, requireProducer, updateEvent);
router.delete('/:id', requireAuth, requireProducer, deleteEvent);
router.get('/:id/campaigns', requireAuth, requireProducer, eventCampaigns);

export default router;
