import { Dining, Facility, Gallery, Testimonial } from '../models/index.js';
import { serializeDining, serializeFacility, serializeGalleryItem, serializeTestimonial } from '../utils/serializers.js';

export async function listFacilities(req, res) {
  try {
    const rows = await Facility.find().sort({ sortOrder: 1 });
    res.json(rows.map(serializeFacility));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch facilities' });
  }
}

export async function listDining(req, res) {
  try {
    const rows = await Dining.find().sort({ sortOrder: 1 });
    res.json(rows.map(serializeDining));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dining options' });
  }
}

export async function listGallery(req, res) {
  try {
    const query = req.query.category ? { category: req.query.category } : {};
    const rows = await Gallery.find(query).sort({ sortOrder: 1 });
    res.json(rows.map(serializeGalleryItem));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
}

export async function listTestimonials(req, res) {
  try {
    const rows = await Testimonial.find().sort({ sortOrder: 1 });
    res.json(rows.map(serializeTestimonial));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
}
