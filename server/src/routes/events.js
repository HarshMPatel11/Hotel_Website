import { Router } from 'express';
import { createContactMessage, createEventInquiry, listEventPackages } from '../controllers/eventsController.js';

const router = Router();

router.get('/events/packages', listEventPackages);
router.post('/events/inquiries', createEventInquiry);
router.post('/contact/messages', createContactMessage);

export default router;
