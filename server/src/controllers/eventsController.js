import { ContactMessage, EventInquiry, EventPackage } from '../models/index.js';
import { serializeContactMessage, serializeEventInquiry, serializeEventPackage } from '../utils/serializers.js';

export async function listEventPackages(req, res) {
  try {
    const rows = await EventPackage.find().sort({ _id: 1 });
    res.json(rows.map(serializeEventPackage));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch event packages' });
  }
}

export async function createEventInquiry(req, res) {
  try {
    const { name, email, phone, eventType, eventDate, guestCount, message } = req.body;

    if (!name || !email || !phone || !eventType || !eventDate || !guestCount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const parsedEventDate = new Date(eventDate);
    if (Number.isNaN(parsedEventDate.getTime())) {
      return res.status(400).json({ error: 'Invalid event date' });
    }

    const inquiry = await EventInquiry.create({
      name,
      email,
      phone,
      eventType,
      eventDate: parsedEventDate,
      guestCount: Number(guestCount),
      message: message || null,
    });

    res.status(201).json(serializeEventInquiry(inquiry));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save inquiry' });
  }
}

export async function createContactMessage(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || null,
      subject,
      message,
    });

    res.status(201).json(serializeContactMessage(contactMessage));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save message' });
  }
}
