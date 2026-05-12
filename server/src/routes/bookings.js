import { Router } from 'express';
import { cancelBookingByCode, createBooking, getBookingByCode, updateBookingByCode } from '../controllers/bookingsController.js';

const router = Router();

router.post('/bookings', createBooking);
router.get('/bookings/:confirmationCode', getBookingByCode);
router.put('/bookings/:confirmationCode', updateBookingByCode);
router.patch('/bookings/:confirmationCode/cancel', cancelBookingByCode);

export default router;
