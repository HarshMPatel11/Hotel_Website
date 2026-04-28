import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    caption: { type: String },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Gallery = mongoose.model('Gallery', gallerySchema);
