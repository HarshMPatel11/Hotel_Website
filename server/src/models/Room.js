import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    sizeSqm: { type: Number, required: true },
    capacity: { type: Number, required: true },
    bedType: { type: String, required: true },
    view: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    totalUnits: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export const Room = mongoose.model('Room', roomSchema);
