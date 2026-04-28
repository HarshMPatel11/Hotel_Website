import { Router } from 'express';
import { createBooking, getBookingByCode } from '../controllers/bookingsController.js';

const router = Router();

router.post('/bookings', createBooking);
router.get('/bookings/:confirmationCode', getBookingByCode);

export default router;
