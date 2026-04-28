import { Router } from 'express';
import { checkAvailability, getRoom, listFeaturedRooms, listRooms } from '../controllers/roomsController.js';

const router = Router();

router.get('/rooms', listRooms);
router.get('/rooms/featured', listFeaturedRooms);
router.get('/rooms/:id', getRoom);
router.get('/availability', checkAvailability);

export default router;
