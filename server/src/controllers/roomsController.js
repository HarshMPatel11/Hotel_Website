import { Booking, Room } from '../models/index.js';
import { serializeRoom } from '../utils/serializers.js';

function getDateOnly(value) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getNights(checkInDate, checkOutDate) {
  return Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
}

export async function listRooms(req, res) {
  try {
    const rooms = await Room.find().sort({ pricePerNight: 1 });
    res.json(rooms.map(serializeRoom));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
}

export async function listFeaturedRooms(req, res) {
  try {
    const rooms = await Room.find({ featured: true }).sort({ pricePerNight: 1 });
    res.json(rooms.map(serializeRoom));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch featured rooms' });
  }
}

export async function getRoom(req, res) {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(serializeRoom(room));
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid room id' });
  }
}

export async function checkAvailability(req, res) {
  try {
    const { checkIn, checkOut, guests } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ error: 'Invalid availability query' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime()) || checkOutDate <= checkInDate) {
      return res.status(400).json({ error: 'Check-out must be after check-in' });
    }

    const minCapacity = guests ? Number(guests) : 1;
    if (Number.isNaN(minCapacity) || minCapacity < 1) {
      return res.status(400).json({ error: 'Invalid availability query' });
    }

    const nights = getNights(checkInDate, checkOutDate);
    const checkInDateOnly = getDateOnly(checkInDate);
    const checkOutDateOnly = getDateOnly(checkOutDate);
    const allRooms = await Room.find().sort({ pricePerNight: 1 });

    const overlapping = await Booking.find({
      checkIn: { $lt: checkOutDateOnly },
      checkOut: { $gt: checkInDateOnly },
      status: 'confirmed',
    }).select('roomId');

    const bookedCounts = new Map();
    for (const booking of overlapping) {
      const roomId = booking.roomId.toString();
      bookedCounts.set(roomId, (bookedCounts.get(roomId) ?? 0) + 1);
    }

    const result = allRooms.map((room) => {
      const booked = bookedCounts.get(room._id.toString()) ?? 0;
      const hasInventory = booked < room.totalUnits;
      const fitsGuests = room.capacity >= minCapacity;

      return {
        room: serializeRoom(room),
        available: hasInventory && fitsGuests,
        nights,
        totalPrice: room.pricePerNight * nights,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
}
