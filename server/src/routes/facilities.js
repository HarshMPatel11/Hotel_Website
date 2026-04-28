import { Router } from 'express';
import { listDining, listFacilities, listGallery, listTestimonials } from '../controllers/facilitiesController.js';

const router = Router();

router.get('/facilities', listFacilities);
router.get('/dining', listDining);
router.get('/gallery', listGallery);
router.get('/testimonials', listTestimonials);

export default router;
