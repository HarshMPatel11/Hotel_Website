import { Router } from 'express';
import healthRouter from './health.js';
import hotelRouter from './hotel.js';
import roomsRouter from './rooms.js';
import bookingsRouter from './bookings.js';
import facilitiesRouter from './facilities.js';
import eventsRouter from './events.js';

const router = Router();

router.use(healthRouter);
router.use(hotelRouter);
router.use(roomsRouter);
router.use(bookingsRouter);
router.use(facilitiesRouter);
router.use(eventsRouter);

export default router;
