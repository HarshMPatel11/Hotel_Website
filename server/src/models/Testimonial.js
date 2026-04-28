import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true },
    guestLocation: { type: String, required: true },
    rating: { type: Number, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    stayedIn: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
