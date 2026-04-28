import mongoose from 'mongoose';

const diningSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    description: { type: String, required: true },
    hours: { type: String, required: true },
    dressCode: { type: String, required: true },
    image: { type: String, required: true },
    signatureDishes: { type: [String], default: [] },
    priceRange: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Dining = mongoose.model('Dining', diningSchema);
