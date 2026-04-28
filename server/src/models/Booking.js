import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    confirmationCode: { type: String, required: true, unique: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true },
    nights: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    specialRequests: { type: String },
    status: { type: String, default: 'confirmed' },
  },
  { timestamps: true }
);

export const Booking = mongoose.model('Booking', bookingSchema);
