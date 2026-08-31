/**
 * Rooms Data Store
 * In-Memory Storage for Hotel Management System
 */

export let rooms = [
  {
    id: '1',
    roomNumber: '101',
    floor: 1,
    type: 'Standard',
    price: 10000,
    bedType: 'Queen Bed',
    capacity: 2,
    view: 'Garden View',
    amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Fridge'],
    status: 'Available',
    housekeepingStatus: 'Clean & Ready',
    currentGuest: null,
    assignedAttendant: 'Kamani Silva',
    lastCleaned: 'Today, 10:30 AM',
    notes: 'Ground floor, near front reception.',
    createdAt: '2026-01-15'
  },
  {
    id: '2',
    roomNumber: '102',
    floor: 1,
    type: 'Deluxe',
    price: 15000,
    bedType: 'King Bed',
    capacity: 2,
    view: 'Pool View',
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Balcony'],
    status: 'Occupied',
    housekeepingStatus: 'Clean & Ready',
    currentGuest: 'Danushka Senanayake',
    assignedAttendant: 'Roshan Bandara',
    lastCleaned: 'Today, 09:15 AM',
    notes: 'Guest requested extra towels.',
    createdAt: '2026-01-15'
  },
  {
    id: '3',
    roomNumber: '103',
    floor: 1,
    type: 'Suite',
    price: 25000,
    bedType: 'King + Sofa Bed',
    capacity: 4,
    view: 'Pool & Garden',
    amenities: ['Free WiFi', 'Jacuzzi', 'Espresso Machine', 'Smart TV', 'Living Room', 'Mini Bar'],
    status: 'Reserved',
    housekeepingStatus: 'Inspection Required',
    currentGuest: 'Maya Wickramasinghe (Arrival 3 PM)',
    assignedAttendant: 'Sunethra Perera',
    lastCleaned: 'Today, 11:45 AM',
    notes: 'VIP guest arrival at 15:00. Welcome fruit basket prepared.',
    createdAt: '2026-01-15'
  },
  {
    id: '4',
    roomNumber: '104',
    floor: 1,
    type: 'Deluxe',
    price: 15000,
    bedType: 'Twin Beds',
    capacity: 2,
    view: 'Garden View',
    amenities: ['Free WiFi', 'Air Conditioning', 'Work Desk', 'Mini Fridge'],
    status: 'Cleaning',
    housekeepingStatus: 'In Progress',
    currentGuest: null,
    assignedAttendant: 'Kamani Silva',
    lastCleaned: 'In progress',
    notes: 'Checkout cleaning in progress. Linen replacement done.',
    createdAt: '2026-01-15'
  },
  {
    id: '5',
    roomNumber: '105',
    floor: 1,
    type: 'Standard',
    price: 10000,
    bedType: 'Queen Bed',
    capacity: 2,
    view: 'Courtyard View',
    amenities: ['Free WiFi', 'Air Conditioning', 'TV'],
    status: 'Maintenance',
    housekeepingStatus: 'Out of Order',
    currentGuest: null,
    assignedAttendant: 'Nuwan Kumara',
    lastCleaned: 'Yesterday',
    notes: 'AC thermostat repair pending technician visit.',
    createdAt: '2026-01-15'
  },
  {
    id: '6',
    roomNumber: '106',
    floor: 1,
    type: 'Standard',
    price: 10500,
    bedType: 'Queen Bed',
    capacity: 2,
    view: 'Garden View',
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Coffee Maker'],
    status: 'Available',
    housekeepingStatus: 'Clean & Ready',
    currentGuest: null,
    assignedAttendant: 'Sunethra Perera',
    lastCleaned: 'Today, 08:30 AM',
    notes: 'Ready for instant check-in.',
    createdAt: '2026-01-15'
  },
  {
    id: '7',
    roomNumber: '201',
    floor: 2,
    type: 'Standard',
    price: 11000,
    bedType: 'Queen Bed',
    capacity: 2,
    view: 'City View',
    amenities: ['Free WiFi', 'Air Conditioning', 'Work Desk', 'Safe'],
    status: 'Available',
    housekeepingStatus: 'Clean & Ready',
    currentGuest: null,
    assignedAttendant: 'Roshan Bandara',
    lastCleaned: 'Today, 10:00 AM',
    notes: 'Corner room with quiet orientation.',
    createdAt: '2026-01-15'
  },
  {
    id: '8',
    roomNumber: '202',
    floor: 2,
    type: 'Deluxe',
    price: 16000,
    bedType: 'King Bed',
    capacity: 2,
    view: 'Ocean View',
    amenities: ['Free WiFi', 'Sea Facing Balcony', 'Smart TV', 'Mini Bar', 'Bathtub'],
    status: 'Occupied',
    housekeepingStatus: 'Dirty / Needs Clean',
    currentGuest: 'Ishara Dissanayake',
    assignedAttendant: 'Kamani Silva',
    lastCleaned: 'Yesterday, 02:00 PM',
    notes: 'Guest requested afternoon housekeeping service after 2 PM.',
    createdAt: '2026-01-15'
  },
  {
    id: '9',
    roomNumber: '203',
    floor: 2,
    type: 'Suite',
    price: 28000,
    bedType: 'Super King Bed',
    capacity: 3,
    view: 'Ocean & Sunset View',
    amenities: ['Free WiFi', 'Panoramic Balcony', 'Jacuzzi', 'Butler Service', 'Espresso Bar'],
    status: 'Reserved',
    housekeepingStatus: 'Clean & Ready',
    currentGuest: 'Hashan Gunasekara',
    assignedAttendant: 'Sunethra Perera',
    lastCleaned: 'Today, 11:00 AM',
    notes: 'Honeymoon setup with floral arrangement requested.',
    createdAt: '2026-01-15'
  },
  {
    id: '10',
    roomNumber: '204',
    floor: 2,
    type: 'Deluxe',
    price: 16500,
    bedType: 'Twin Beds',
    capacity: 2,
    view: 'Ocean View',
    amenities: ['Free WiFi', 'Balcony', 'Mini Fridge', 'Smart TV'],
    status: 'Cleaning',
    housekeepingStatus: 'In Progress',
    currentGuest: null,
    assignedAttendant: 'Roshan Bandara',
    lastCleaned: 'In progress',
    notes: 'Deep cleaning and sanitizing bathroom fixtures.',
    createdAt: '2026-01-15'
  },
  {
    id: '11',
    roomNumber: '301',
    floor: 3,
    type: 'Standard',
    price: 12000,
    bedType: 'Queen Bed',
    capacity: 2,
    view: 'Skyline View',
    amenities: ['Free WiFi', 'Air Conditioning', 'Work Desk', 'Soundproofing'],
    status: 'Available',
    housekeepingStatus: 'Clean & Ready',
    currentGuest: null,
    assignedAttendant: 'Kamani Silva',
    lastCleaned: 'Today, 09:45 AM',
    notes: 'High floor, panoramic city views.',
    createdAt: '2026-01-15'
  },
  {
    id: '12',
    roomNumber: '302',
    floor: 3,
    type: 'Deluxe',
    price: 17500,
    bedType: 'King Bed',
    capacity: 2,
    view: 'Ocean Panorama',
    amenities: ['Free WiFi', 'Private Balcony', 'Smart TV', 'Nespresso Machine', 'Robes'],
    status: 'Occupied',
    housekeepingStatus: 'Clean & Ready',
    currentGuest: 'Aisha Rahman',
    assignedAttendant: 'Sunethra Perera',
    lastCleaned: 'Today, 10:15 AM',
    notes: 'VIP Guest. Do not disturb until 11:00 AM.',
    createdAt: '2026-01-15'
  },
  {
    id: '13',
    roomNumber: '303',
    floor: 3,
    type: 'Suite',
    price: 32000,
    bedType: 'King + Twin Bed',
    capacity: 4,
    view: 'Ocean & Coastline',
    amenities: ['Free WiFi', 'Executive Lounge Access', 'Jacuzzi', 'Kitchenette', 'Dining Area'],
    status: 'Cleaning',
    housekeepingStatus: 'Dirty / Needs Clean',
    currentGuest: null,
    assignedAttendant: 'Nuwan Kumara',
    lastCleaned: 'Yesterday, 06:00 PM',
    notes: 'Checked out today at 11 AM. Needs complete turnover.',
    createdAt: '2026-01-15'
  },
  {
    id: '14',
    roomNumber: '304',
    floor: 3,
    type: 'Family Villa',
    price: 38000,
    bedType: '2 King Beds',
    capacity: 5,
    view: 'Ocean & Pool View',
    amenities: ['Free WiFi', 'Private Terrace', '2 En-suite Bathrooms', 'Smart Home Controls', 'Kids Area'],
    status: 'Occupied',
    housekeepingStatus: 'Clean & Ready',
    currentGuest: 'Chaminda Jayasuriya',
    assignedAttendant: 'Sunethra Perera',
    lastCleaned: 'Today, 08:45 AM',
    notes: 'Family with 2 children. Extra baby cot placed.',
    createdAt: '2026-01-15'
  },
  {
    id: '15',
    roomNumber: '401',
    floor: 4,
    type: 'Penthouse',
    price: 55000,
    bedType: 'Master King + Guest King',
    capacity: 4,
    view: '360 Top Floor Ocean View',
    amenities: ['Free WiFi', 'Private Rooftop Plunge Pool', 'Dedicated Butler', 'Wine Cellar', 'Sauna'],
    status: 'Occupied',
    housekeepingStatus: 'Clean & Ready',
    currentGuest: 'Nimal Perera',
    assignedAttendant: 'Roshan Bandara',
    lastCleaned: 'Today, 09:00 AM',
    notes: 'Top VIP suite. Special turndown service required at 7 PM.',
    createdAt: '2026-01-15'
  },
  {
    id: '16',
    roomNumber: '402',
    floor: 4,
    type: 'Penthouse',
    price: 55000,
    bedType: 'Master King + Guest King',
    capacity: 4,
    view: '360 Panoramic Ocean & Mountains',
    amenities: ['Free WiFi', 'Private Terrace', 'Jacuzzi', 'Chef Kitchen', 'Home Theater'],
    status: 'Maintenance',
    housekeepingStatus: 'Out of Order',
    currentGuest: null,
    assignedAttendant: 'Nuwan Kumara',
    lastCleaned: '3 days ago',
    notes: 'Plumbing fixture replacement scheduled with engineering.',
    createdAt: '2026-01-15'
  }
];

export function addRoom(room) {
  const numericIds = rooms.map(r => parseInt(r.id, 10)).filter(n => !isNaN(n));
  const nextId = numericIds.length ? String(Math.max(...numericIds) + 1) : '1';
  
  const newRoom = {
    id: room.id ? String(room.id) : nextId,
    roomNumber: String(room.roomNumber),
    floor: Number(room.floor) || 1,
    type: room.type || 'Standard',
    price: Number(room.price) || 10000,
    bedType: room.bedType || 'Queen Bed',
    capacity: Number(room.capacity) || 2,
    view: room.view || 'Standard View',
    amenities: Array.isArray(room.amenities) ? room.amenities : ['Free WiFi', 'Air Conditioning'],
    status: room.status || 'Available',
    housekeepingStatus: room.housekeepingStatus || 'Clean & Ready',
    currentGuest: room.currentGuest || null,
    assignedAttendant: room.assignedAttendant || 'Kamani Silva',
    lastCleaned: room.lastCleaned || 'Just now',
    notes: room.notes || '',
    createdAt: room.createdAt || new Date().toISOString().split('T')[0]
  };

  rooms.push(newRoom);
  return newRoom;
}

export function findRoomById(id) {
  if (!id) return null;
  const strId = String(id).trim();
  return rooms.find(r => String(r.id) === strId || String(r.roomNumber) === strId);
}

export function findRoomByNumber(roomNumber) {
  if (!roomNumber) return null;
  const strNum = String(roomNumber).trim();
  return rooms.find(r => String(r.roomNumber) === strNum);
}

export function updateRoom(id, updates) {
  const room = findRoomById(id);
  if (room) {
    if (updates.id !== undefined) delete updates.id;
    if (updates.floor !== undefined) updates.floor = Number(updates.floor);
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.capacity !== undefined) updates.capacity = Number(updates.capacity);
    Object.assign(room, updates);
  }
  return room;
}

export function deleteRoom(id) {
  const index = rooms.findIndex(r => String(r.id) === String(id) || String(r.roomNumber) === String(id));
  if (index > -1) {
    return rooms.splice(index, 1)[0];
  }
  return null;
}
