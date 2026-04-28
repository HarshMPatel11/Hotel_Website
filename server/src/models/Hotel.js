import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    starRating: { type: Number, required: true },
    foundedYear: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    nearbyAttractions: { type: [String], default: [] },
    awards: { type: [String], default: [] },
    heroImage: { type: String, required: true },
  },
  { timestamps: true }
);

export const Hotel = mongoose.model('Hotel', hotelSchema);
