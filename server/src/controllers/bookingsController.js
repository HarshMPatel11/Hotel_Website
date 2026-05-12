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

function normalizePhones(guestPhone, guestPhones) {
  return Array.isArray(guestPhones)
    ? guestPhones.map((phone) => String(phone).trim()).filter(Boolean)
    : [guestPhone].map((phone) => String(phone ?? '').trim()).filter(Boolean);
}

function validateGuestCounts(guests, adults, children) {
  const guestCount = Number(guests);
  if (Number.isNaN(guestCount) || guestCount < 1) {
    return null;
  }

  const adultCount = adults === undefined ? guestCount : Number(adults);
  const childCount = children === undefined ? 0 : Number(children);
  if (Number.isNaN(adultCount) || adultCount < 1 || Number.isNaN(childCount) || childCount < 0 || adultCount + childCount !== guestCount) {
    return null;
  }

  return { guestCount, adultCount, childCount };
}

async function findRoomAvailabilityConflict({ roomId, checkInDateOnly, checkOutDateOnly, bookingId }) {
  const room = await Room.findById(roomId);
  if (!room) {
    return { error: 'Room does not exist' };
  }

  const query = {
    roomId,
    checkIn: { $lt: checkOutDateOnly },
    checkOut: { $gt: checkInDateOnly },
    status: 'confirmed',
  };

  if (bookingId) {
    query._id = { $ne: bookingId };
  }

  const overlapping = await Booking.countDocuments(query);
  if (overlapping >= room.totalUnits) {
    return { error: 'No units of this room available for those dates' };
  }

  return { room };
}

export async function createBooking(req, res) {
  try {
    const { checkIn, checkOut, guests, adults, children, roomId, guestName, guestEmail, guestPhone, guestPhones, specialRequests } = req.body;
    const phoneNumbers = normalizePhones(guestPhone, guestPhones);

    if (!checkIn || !checkOut || !guests || !roomId || !guestName || !guestEmail || phoneNumbers.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime()) || checkOutDate <= checkInDate) {
      return res.status(400).json({ error: 'Check-out must be after check-in' });
    }

    const counts = validateGuestCounts(guests, adults, children);
    if (!counts) {
      return res.status(400).json({ error: 'Guest details are invalid' });
    }
    const { guestCount, adultCount, childCount } = counts;

    const checkInDateOnly = getDateOnly(checkInDate);
    const checkOutDateOnly = getDateOnly(checkOutDate);
    const availability = await findRoomAvailabilityConflict({ roomId, checkInDateOnly, checkOutDateOnly });
    if (availability.error) {
      return res.status(400).json({ error: availability.error });
    }

    const { room } = availability;
    if (guestCount > room.capacity) {
      return res.status(400).json({ error: 'Guest count exceeds room capacity' });
    }

    const booking = await Booking.create({
      confirmationCode: generateConfirmationCode(),
      roomId,
      guestName,
      guestEmail,
      guestPhone: phoneNumbers[0],
      guestPhones: phoneNumbers,
      checkIn: checkInDateOnly,
      checkOut: checkOutDateOnly,
      guests: guestCount,
      adults: adultCount,
      children: childCount,
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

export async function updateBookingByCode(req, res) {
  try {
    const booking = await Booking.findOne({ confirmationCode: req.params.confirmationCode });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Cancelled bookings cannot be modified' });
    }

    const { checkIn, checkOut, guests, adults, children, roomId, guestName, guestEmail, guestPhone, guestPhones, specialRequests } = req.body;
    const phoneNumbers = normalizePhones(guestPhone, guestPhones);

    if (!checkIn || !checkOut || !guests || !roomId || !guestName || !guestEmail || phoneNumbers.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime()) || checkOutDate <= checkInDate) {
      return res.status(400).json({ error: 'Check-out must be after check-in' });
    }

    const counts = validateGuestCounts(guests, adults, children);
    if (!counts) {
      return res.status(400).json({ error: 'Guest details are invalid' });
    }
    const { guestCount, adultCount, childCount } = counts;

    const checkInDateOnly = getDateOnly(checkInDate);
    const checkOutDateOnly = getDateOnly(checkOutDate);
    const availability = await findRoomAvailabilityConflict({
      roomId,
      checkInDateOnly,
      checkOutDateOnly,
      bookingId: booking._id,
    });
    if (availability.error) {
      return res.status(400).json({ error: availability.error });
    }

    const { room } = availability;
    if (guestCount > room.capacity) {
      return res.status(400).json({ error: 'Guest count exceeds room capacity' });
    }

    booking.roomId = roomId;
    booking.guestName = guestName;
    booking.guestEmail = guestEmail;
    booking.guestPhone = phoneNumbers[0];
    booking.guestPhones = phoneNumbers;
    booking.checkIn = checkInDateOnly;
    booking.checkOut = checkOutDateOnly;
    booking.guests = guestCount;
    booking.adults = adultCount;
    booking.children = childCount;
    booking.nights = getNights(checkInDate, checkOutDate);
    booking.totalPrice = room.pricePerNight * booking.nights;
    booking.currency = room.currency;
    booking.specialRequests = specialRequests || null;

    await booking.save();

    res.json(serializeBooking(booking, room.name));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
}

export async function cancelBookingByCode(req, res) {
  try {
    const booking = await Booking.findOne({ confirmationCode: req.params.confirmationCode });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      const room = await Room.findById(booking.roomId);
      return res.json(serializeBooking(booking, room?.name ?? 'Room'));
    }

    booking.status = 'cancelled';
    await booking.save();

    const room = await Room.findById(booking.roomId);
    res.json(serializeBooking(booking, room?.name ?? 'Room'));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
}
