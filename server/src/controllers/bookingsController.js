import { Booking, Room } from '../models/index.js';
import { serializeBooking } from '../utils/serializers.js';

function generateConfirmationCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `AG-${out}`;
}

function getDateOnly(value) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getNights(checkInDate, checkOutDate) {
  return Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
}

export async function createBooking(req, res) {
  try {
    const { checkIn, checkOut, guests, roomId, guestName, guestEmail, guestPhone, specialRequests } = req.body;

    if (!checkIn || !checkOut || !guests || !roomId || !guestName || !guestEmail || !guestPhone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime()) || checkOutDate <= checkInDate) {
      return res.status(400).json({ error: 'Check-out must be after check-in' });
    }

    const guestCount = Number(guests);
    if (Number.isNaN(guestCount) || guestCount < 1) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(400).json({ error: 'Room does not exist' });
    }

    if (guestCount > room.capacity) {
      return res.status(400).json({ error: 'Guest count exceeds room capacity' });
    }

    const checkInDateOnly = getDateOnly(checkInDate);
    const checkOutDateOnly = getDateOnly(checkOutDate);
    const overlapping = await Booking.countDocuments({
      roomId,
      checkIn: { $lt: checkOutDateOnly },
      checkOut: { $gt: checkInDateOnly },
      status: 'confirmed',
    });

    if (overlapping >= room.totalUnits) {
      return res.status(400).json({ error: 'No units of this room available for those dates' });
    }

    const booking = await Booking.create({
      confirmationCode: generateConfirmationCode(),
      roomId,
      guestName,
      guestEmail,
      guestPhone,
      checkIn: checkInDateOnly,
      checkOut: checkOutDateOnly,
      guests: guestCount,
      nights: getNights(checkInDate, checkOutDate),
      totalPrice: room.pricePerNight * getNights(checkInDate, checkOutDate),
      currency: room.currency,
      specialRequests: specialRequests || null,
      status: 'confirmed',
    });

    res.status(201).json(serializeBooking(booking, room.name));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
}

export async function getBookingByCode(req, res) {
  try {
    const booking = await Booking.findOne({ confirmationCode: req.params.confirmationCode });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const room = await Room.findById(booking.roomId);
    if (!room) {
      return res.status(404).json({ error: 'Associated room not found' });
    }

    res.json(serializeBooking(booking, room.name));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
}
