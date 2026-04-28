import { Router } from 'express';
import { getHotelInfo } from '../controllers/hotelController.js';

const router = Router();

router.get('/hotel', getHotelInfo);

export default router;
