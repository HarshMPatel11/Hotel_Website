import { Hotel } from '../models/index.js';
import { serializeHotel } from '../utils/serializers.js';

export async function getHotelInfo(req, res) {
  try {
    const info = await Hotel.findOne();
    if (!info) {
      return res.status(404).json({ error: 'Hotel info not configured' });
    }

    res.json(serializeHotel(info));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch hotel info' });
  }
}
