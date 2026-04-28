import mongoose from 'mongoose';

const eventInquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    eventType: { type: String, required: true },
    eventDate: { type: Date, required: true },
    guestCount: { type: Number, required: true },
    message: { type: String },
  },
  { timestamps: true }
);

export const EventInquiry = mongoose.model('EventInquiry', eventInquirySchema);
