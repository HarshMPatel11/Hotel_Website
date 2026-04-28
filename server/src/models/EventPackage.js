import mongoose from 'mongoose';

const eventPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    capacity: { type: Number, required: true },
    startingPrice: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    image: { type: String, required: true },
    inclusions: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const EventPackage = mongoose.model('EventPackage', eventPackageSchema);
