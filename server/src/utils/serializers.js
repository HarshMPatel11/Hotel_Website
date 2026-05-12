export function serializeHotel(info) {
  return {
    name: info.name,
    tagline: info.tagline,
    description: info.description,
    starRating: info.starRating,
    foundedYear: info.foundedYear,
    address: info.address,
    city: info.city,
    country: info.country,
    phone: info.phone,
    email: info.email,
    latitude: info.latitude,
    longitude: info.longitude,
    nearbyAttractions: info.nearbyAttractions,
    awards: info.awards,
    heroImage: info.heroImage,
  };
}

export function serializeRoom(room) {
  return {
    id: room._id.toString(),
    name: room.name,
    slug: room.slug,
    category: room.category,
    description: room.description,
    sizeSqm: room.sizeSqm,
    capacity: room.capacity,
    bedType: room.bedType,
    view: room.view,
    pricePerNight: room.pricePerNight,
    currency: room.currency,
    amenities: room.amenities,
    images: room.images,
    featured: room.featured,
  };
}

export function serializeBooking(booking, roomName) {
  return {
    id: booking._id.toString(),
    confirmationCode: booking.confirmationCode,
    roomId: booking.roomId.toString(),
    roomName,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    guestPhones: booking.guestPhones?.length ? booking.guestPhones : [booking.guestPhone],
    checkIn: booking.checkIn.toISOString().slice(0, 10),
    checkOut: booking.checkOut.toISOString().slice(0, 10),
    guests: booking.guests,
    adults: booking.adults ?? booking.guests,
    children: booking.children ?? 0,
    nights: booking.nights,
    totalPrice: booking.totalPrice,
    currency: booking.currency,
    specialRequests: booking.specialRequests ?? null,
    status: booking.status,
    createdAt: booking.createdAt.toISOString(),
  };
}

export function serializeFacility(facility) {
  return {
    id: facility._id.toString(),
    name: facility.name,
    category: facility.category,
    description: facility.description,
    icon: facility.icon,
    hours: facility.hours,
    image: facility.image,
    highlights: facility.highlights,
  };
}

export function serializeDining(dining) {
  return {
    id: dining._id.toString(),
    name: dining.name,
    cuisine: dining.cuisine,
    description: dining.description,
    hours: dining.hours,
    dressCode: dining.dressCode,
    image: dining.image,
    signatureDishes: dining.signatureDishes,
    priceRange: dining.priceRange,
  };
}

export function serializeGalleryItem(item) {
  return {
    id: item._id.toString(),
    title: item.title,
    category: item.category,
    image: item.image,
    caption: item.caption ?? null,
  };
}

export function serializeEventPackage(pkg) {
  return {
    id: pkg._id.toString(),
    name: pkg.name,
    type: pkg.type,
    description: pkg.description,
    capacity: pkg.capacity,
    startingPrice: pkg.startingPrice,
    currency: pkg.currency,
    image: pkg.image,
    inclusions: pkg.inclusions,
  };
}

export function serializeEventInquiry(inquiry) {
  return {
    id: inquiry._id.toString(),
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    eventType: inquiry.eventType,
    eventDate: inquiry.eventDate.toISOString().slice(0, 10),
    guestCount: inquiry.guestCount,
    message: inquiry.message ?? null,
    createdAt: inquiry.createdAt.toISOString(),
  };
}

export function serializeContactMessage(message) {
  return {
    id: message._id.toString(),
    name: message.name,
    email: message.email,
    phone: message.phone ?? null,
    subject: message.subject,
    message: message.message,
    createdAt: message.createdAt.toISOString(),
  };
}

export function serializeTestimonial(testimonial) {
  return {
    id: testimonial._id.toString(),
    guestName: testimonial.guestName,
    guestLocation: testimonial.guestLocation,
    rating: testimonial.rating,
    title: testimonial.title,
    body: testimonial.body,
    stayedIn: testimonial.stayedIn,
  };
}
