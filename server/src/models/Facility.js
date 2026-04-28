import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    hours: { type: String, required: true },
    image: { type: String, required: true },
    highlights: { type: [String], default: [] },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Facility = mongoose.model('Facility', facilitySchema);
