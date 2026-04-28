import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Hotel, Room, Facility, Dining, Gallery, EventPackage, Testimonial } from './models/index.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aurelia-grand';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Seeding hotel data...');

    // Clear existing data
    await Hotel.deleteMany({});
    await Room.deleteMany({});
    await Facility.deleteMany({});
    await Dining.deleteMany({});
    await Gallery.deleteMany({});
    await EventPackage.deleteMany({});
    await Testimonial.deleteMany({});

    // Seed hotel info
    await Hotel.create({
      name: 'Aurelia Grand',
      tagline: 'A timeless seaside escape on the Amalfi coast',
      description:
        'Set on a private cliff overlooking the Tyrrhenian Sea, Aurelia Grand has welcomed travelers since 1924. Behind sun-bleached limestone walls you\'ll find sea-view suites, a Mediterranean spa, two acclaimed restaurants, and the kind of unhurried hospitality that has made guests return for generations.',
      starRating: 5,
      foundedYear: 1924,
      address: 'Via del Mare 18, 84017',
      city: 'Positano',
      country: 'Italy',
      phone: '+39 089 555 1924',
      email: 'reservations@aureliagrand.com',
      latitude: 40.628,
      longitude: 14.485,
      nearbyAttractions: [
        'Spiaggia Grande beach (5 min walk)',
        'Path of the Gods hiking trail (10 min drive)',
        'Capri ferry terminal (8 min walk)',
        'Ravello & Villa Cimbrone (35 min drive)',
        'Pompeii archaeological site (50 min drive)',
      ],
      awards: [
        'Condé Nast Gold List 2025',
        'Michelin Key Hotel 2024',
        'Travel + Leisure World\'s Best 2023',
        'Forbes Five-Star — 12 consecutive years',
      ],
      heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2400&q=85',
    });

    // Seed rooms
    const rooms = await Room.create([
      {
        name: 'Coastal Classic Room',
        slug: 'coastal-classic',
        category: 'Room',
        description:
          'A bright, airy room finished in soft limewash and natural linen, with a juliet balcony framing the bougainvillea-lined village rooftops.',
        sizeSqm: 32,
        capacity: 2,
        bedType: 'Queen',
        view: 'Village & garden',
        pricePerNight: 420,
        currency: 'EUR',
        amenities: ['King or twin beds', 'Marble bathroom', 'Nespresso bar', 'Frette linens', 'Smart TV', 'Air conditioning'],
        images: [
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80',
        ],
        featured: false,
        totalUnits: 12,
      },
      {
        name: 'Mare Junior Suite',
        slug: 'mare-junior-suite',
        category: 'Suite',
        description:
          'A serene one-bedroom retreat with a private terrace overlooking the Tyrrhenian Sea — perfect for slow mornings with espresso and the sound of waves.',
        sizeSqm: 52,
        capacity: 3,
        bedType: 'King',
        view: 'Sea',
        pricePerNight: 780,
        currency: 'EUR',
        amenities: [
          'Private sea-view terrace',
          'Soaking tub & rainfall shower',
          'Walk-in closet',
          'Living area',
          'Personal concierge',
          'Pillow menu',
        ],
        images: [
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1600&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
        ],
        featured: true,
        totalUnits: 8,
      },
      {
        name: 'Limonaia Suite',
        slug: 'limonaia-suite',
        category: 'Suite',
        description:
          'Tucked into the hotel\'s terraced lemon grove, this two-room suite blends old-world frescoed ceilings with a private outdoor soaking tub.',
        sizeSqm: 68,
        capacity: 3,
        bedType: 'King',
        view: 'Lemon grove & sea',
        pricePerNight: 1100,
        currency: 'EUR',
        amenities: [
          'Private outdoor soaking tub',
          'Frescoed ceilings',
          'Separate sitting room',
          'Espresso & wet bar',
          'Butler on call',
          'Aromatherapy menu',
        ],
        images: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=80',
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=80',
        ],
        featured: true,
        totalUnits: 4,
      },
      {
        name: 'Penthouse Aurelia',
        slug: 'penthouse-aurelia',
        category: 'Penthouse',
        description:
          'The top-floor crown of the hotel: a two-bedroom penthouse with a wraparound terrace, plunge pool, and uninterrupted views from Capri to Praiano.',
        sizeSqm: 145,
        capacity: 5,
        bedType: '2 King',
        view: 'Panoramic sea',
        pricePerNight: 2900,
        currency: 'EUR',
        amenities: [
          'Wraparound terrace',
          'Private plunge pool',
          'Two bedrooms',
          'Dining for 8',
          '24-hour butler',
          'Helipad transfer available',
        ],
        images: [
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=80',
          'https://images.unsplash.com/photo-1551776235-dde6d482980b?auto=format&fit=crop&w=1600&q=80',
        ],
        featured: true,
        totalUnits: 1,
      },
      {
        name: 'Garden Family Room',
        slug: 'garden-family',
        category: 'Room',
        description:
          'A spacious connecting room set off the citrus garden, designed for families who want quiet evenings and easy mornings by the pool.',
        sizeSqm: 44,
        capacity: 4,
        bedType: 'King + Sofa bed',
        view: 'Garden',
        pricePerNight: 560,
        currency: 'EUR',
        amenities: [
          'Connecting room option',
          'Children\'s amenities',
          'In-room dining',
          'Crib on request',
          'Pool access',
          'Game library',
        ],
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
        ],
        featured: false,
        totalUnits: 6,
      },
    ]);

    console.log(`Inserted ${rooms.length} rooms.`);

    // Seed facilities
    await Facility.create([
      {
        name: 'Cliffside Infinity Pool',
        category: 'Wellness',
        description:
          'Heated saltwater infinity pool perched on the cliff edge, with sun loungers, cabanas, and full poolside service from the bar.',
        icon: 'waves',
        hours: '7:00 — 21:00 daily',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80',
        highlights: ['Heated saltwater', 'Private cabanas', 'Poolside dining', 'Sea-view sun deck'],
        sortOrder: 1,
      },
      {
        name: 'Limonaia Spa',
        category: 'Wellness',
        description:
          'A six-room spa carved into the hillside featuring hammam, vitality pool, and treatments built around Mediterranean botanicals.',
        icon: 'leaf',
        hours: '9:00 — 20:00 daily',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
        highlights: ['Hammam & sauna', 'Vitality pool', 'Couples treatment suites', 'Citrus & olive oil rituals'],
        sortOrder: 2,
      },
      {
        name: 'Coastal Fitness Studio',
        category: 'Wellness',
        description:
          'Glass-walled gym with Technogym equipment, daily yoga and pilates classes overlooking the sea, and on-call personal trainers.',
        icon: 'dumbbell',
        hours: '24 hours',
        image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1600&q=80',
        highlights: ['Technogym equipment', 'Sea-view yoga & pilates', 'Personal trainers', 'Cold plunge & sauna'],
        sortOrder: 3,
      },
      {
        name: 'Salone Aurelia',
        category: 'Events',
        description:
          'A 220-square-meter ballroom with frescoed ceilings, opening onto a sea-view terrace — equipped for everything from board meetings to weddings.',
        icon: 'presentation',
        hours: 'By reservation',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80',
        highlights: ['Up to 180 guests', 'Frescoed ceilings', 'Full A/V & projection', 'Adjoining terrace'],
        sortOrder: 4,
      },
      {
        name: 'High-Speed Wi-Fi & Workspaces',
        category: 'Connectivity',
        description:
          'Complimentary fiber Wi-Fi throughout the property and a quiet library lounge with private workstations and printing services.',
        icon: 'wifi',
        hours: '24 hours',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
        highlights: ['Fiber-optic Wi-Fi', 'Private workstations', 'Print & scan services', 'Phone booths'],
        sortOrder: 5,
      },
      {
        name: 'Valet Parking & Transfers',
        category: 'Services',
        description:
          'Complimentary valet parking, private car transfers from Naples airport, and a curated fleet of vintage Fiats for cliffside excursions.',
        icon: 'car',
        hours: '24 hours',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
        highlights: ['Complimentary valet', 'Airport transfers', 'Vintage car rentals', 'EV charging stations'],
        sortOrder: 6,
      },
    ]);

    // Seed dining
    await Dining.create([
      {
        name: 'Ristorante Mareluce',
        cuisine: 'Coastal Italian — One Michelin Star',
        description:
          'Chef Elena Rossi\'s homage to Amalfi cuisine — line-caught fish, garden vegetables, and 1,400 wines, served on a sea-view terrace at sunset.',
        hours: 'Dinner 19:00 — 22:30, Tue – Sun',
        dressCode: 'Smart elegant',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80',
        signatureDishes: ['Spaghetti alle vongole, Aurelia style', 'Whole branzino al sale', 'Limoncello-glazed lamb', 'Sfogliatella with sea salt'],
        priceRange: '€€€€',
        sortOrder: 1,
      },
      {
        name: 'Trattoria del Giardino',
        cuisine: 'Garden-to-table',
        description:
          'All-day dining set among the lemon trees, with wood-fired pizzas, hand-rolled pastas, and Sunday family-style lunches.',
        hours: '12:30 — 22:00 daily',
        dressCode: 'Resort casual',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80',
        signatureDishes: ['Wood-fired margherita', 'Cacio e pepe, lemon zest', 'Grilled octopus with potato cream', 'Tiramisù del giorno'],
        priceRange: '€€',
        sortOrder: 2,
      },
      {
        name: 'Bar Aurelio',
        cuisine: 'Cocktails & small plates',
        description:
          'A glass-walled aperitivo bar with sea views, mid-century furniture, and a cocktail list built around regional amari and house-made syrups.',
        hours: '16:00 — 01:00 daily',
        dressCode: 'Smart casual',
        image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1600&q=80',
        signatureDishes: ['Negroni Aurelia', 'Limone spritz', 'Cured fish board', 'Marinated olives & focaccia'],
        priceRange: '€€€',
        sortOrder: 3,
      },
    ]);

    // Seed gallery
    await Gallery.create([
      {
        title: 'Sunset over the Tyrrhenian',
        category: 'Landscape',
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80',
        caption: 'Golden hour from the cliffside terrace',
        sortOrder: 1,
      },
      {
        title: 'Pool at dusk',
        category: 'Pool',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1600&q=80',
        caption: null,
        sortOrder: 2,
      },
      {
        title: 'Mare Suite balcony',
        category: 'Rooms',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
        caption: 'Slow mornings with espresso',
        sortOrder: 3,
      },
      {
        title: 'Mareluce table for two',
        category: 'Dining',
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1600&q=80',
        caption: 'Tasting menu by candlelight',
        sortOrder: 4,
      },
      {
        title: 'Wedding under the pergola',
        category: 'Events',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
        caption: null,
        sortOrder: 5,
      },
      {
        title: 'Citrus garden walkway',
        category: 'Landscape',
        image: 'https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=1600&q=80',
        caption: null,
        sortOrder: 6,
      },
      {
        title: 'Limonaia Suite tub',
        category: 'Rooms',
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80',
        caption: null,
        sortOrder: 7,
      },
      {
        title: 'Aperitivo at Bar Aurelio',
        category: 'Dining',
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80',
        caption: null,
        sortOrder: 8,
      },
      {
        title: 'Ballroom set for 100',
        category: 'Events',
        image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80',
        caption: null,
        sortOrder: 9,
      },
      {
        title: 'Cabana at the pool deck',
        category: 'Pool',
        image: 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?auto=format&fit=crop&w=1600&q=80',
        caption: null,
        sortOrder: 10,
      },
      {
        title: 'Façade in morning light',
        category: 'Landscape',
        image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=80',
        caption: null,
        sortOrder: 11,
      },
      {
        title: 'Penthouse plunge pool',
        category: 'Rooms',
        image: 'https://images.unsplash.com/photo-1551776235-dde6d482980b?auto=format&fit=crop&w=1600&q=80',
        caption: null,
        sortOrder: 12,
      },
    ]);

    // Seed event packages
    await EventPackage.create([
      {
        name: 'Cliffside Wedding',
        type: 'Wedding',
        description:
          'An intimate ceremony on the cliff terrace followed by a multi-course reception in the Salone Aurelia, fully styled by our in-house atelier.',
        capacity: 120,
        startingPrice: 32000,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
        inclusions: [
          'Cliff-terrace ceremony setup',
          '5-course tasting menu',
          'Floral & lighting design',
          'Bridal suite & hair/makeup',
          'Photographer coordination',
        ],
      },
      {
        name: 'Boardroom Retreat',
        type: 'Corporate',
        description:
          'A two-day executive offsite for up to 24 in our private library, with full A/V, dedicated chef, and curated downtime experiences.',
        capacity: 24,
        startingPrice: 9500,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
        inclusions: ['Private library suite', 'Full A/V package', 'Three meals daily', 'Sunset cocktail hour', 'Wellness break'],
      },
      {
        name: 'Anniversary in the Garden',
        type: 'Celebration',
        description:
          'A garden-table dinner for 30 under string lights and lemon trees, with a custom tasting menu and live trio.',
        capacity: 30,
        startingPrice: 6800,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=80',
        inclusions: ['Long-table garden setup', '5-course menu', 'Live trio (3 hours)', 'Florals & lighting', 'Custom cake'],
      },
    ]);

    // Seed testimonials
    await Testimonial.create([
      {
        guestName: 'Margaux & Henri Lambert',
        guestLocation: 'Paris, France',
        rating: 5,
        title: 'Our anniversary, made unforgettable',
        body: 'From the welcome on the terrace to the way the staff remembered our wine the next evening — Aurelia Grand has the kind of quiet attention that you can\'t choreograph.',
        stayedIn: 'Limonaia Suite',
        sortOrder: 1,
      },
      {
        guestName: 'James Whitford',
        guestLocation: 'London, UK',
        rating: 5,
        title: 'A working week that didn\'t feel like work',
        body: 'I came for a board offsite and left with a notebook full of ideas. The library suite, the food, the morning swims — every detail was considered.',
        stayedIn: 'Mare Junior Suite',
        sortOrder: 2,
      },
      {
        guestName: 'Aiko Tanaka',
        guestLocation: 'Tokyo, Japan',
        rating: 5,
        title: 'I keep finding excuses to come back',
        body: 'This is the rare hotel that improves on every visit. The garden trattoria at lunch is reason enough to fly across the world.',
        stayedIn: 'Coastal Classic Room',
        sortOrder: 3,
      },
    ]);

    console.log('✅ Database seeded successfully!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

export default seed;

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  seed().then(() => process.exit(0));
}
