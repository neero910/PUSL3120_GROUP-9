/**
 * Temporary Rooms Data Store
 * Phase 2: In-Memory Storage (Will be replaced by MongoDB in Phase 3)
 */

export let rooms = [
  {
    id: '101',
    roomNumber: '101',
    type: 'Standard',
    capacity: 2,
    price: 10000,
    status: 'Available',
    description: 'Comfortable standard room with basic amenities',
    amenities: ['WiFi', 'AC', 'TV'],
    floor: 1,
    createdAt: '2026-01-15'
  },
  {
    id: '102',
    roomNumber: '102',
    type: 'Standard',
    capacity: 2,
    price: 10000,
    status: 'Available',
    description: 'Comfortable standard room with basic amenities',
    amenities: ['WiFi', 'AC', 'TV'],
    floor: 1,
    createdAt: '2026-01-15'
  },
  {
    id: '103',
    roomNumber: '103',
    type: 'Deluxe',
    capacity: 2,
    price: 15000,
    status: 'Occupied',
    description: 'Spacious deluxe room with premium amenities',
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Bathrobe'],
    floor: 1,
    createdAt: '2026-01-15'
  },
  {
    id: '201',
    roomNumber: '201',
    type: 'Deluxe',
    capacity: 2,
    price: 15000,
    status: 'Available',
    description: 'Spacious deluxe room with premium amenities',
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Bathrobe'],
    floor: 2,
    createdAt: '2026-01-15'
  },
  {
    id: '202',
    roomNumber: '202',
    type: 'Suite',
    capacity: 4,
    price: 25000,
    status: 'Available',
    description: 'Luxurious suite with separate living area',
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Living Area'],
    floor: 2,
    createdAt: '2026-01-15'
  },
  {
    id: '301',
    roomNumber: '301',
    type: 'Suite',
    capacity: 4,
    price: 25000,
    status: 'Maintenance',
    description: 'Luxurious suite with separate living area',
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Living Area'],
    floor: 3,
    createdAt: '2026-01-15'
  }
];

export function addRoom(room) {
  const newRoom = {
    id: String(parseInt(Math.max(...rooms.map(r => parseInt(r.id.substring(1)) || 0))) + 1),
    ...room,
    createdAt: new Date().toISOString().split('T')[0]
  };
  rooms.push(newRoom);
  return newRoom;
}

export function findRoomById(id) {
  return rooms.find(r => r.id === id);
}

export function findRoomByNumber(roomNumber) {
  return rooms.find(r => r.roomNumber === roomNumber);
}

export function updateRoom(id, updates) {
  const room = rooms.find(r => r.id === id);
  if (room) {
    Object.assign(room, updates);
  }
  return room;
}

export function deleteRoom(id) {
  const index = rooms.findIndex(r => r.id === id);
  if (index > -1) {
    return rooms.splice(index, 1)[0];
  }
  return null;
}
