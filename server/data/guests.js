/**
 * Temporary Guests Data Store
 * Phase 2: In-Memory Storage (Will be replaced by MongoDB in Phase 3)
 */

export let guests = [
  {
    id: 'G001',
    firstName: 'Kasun',
    lastName: 'Perera',
    email: 'kasun.perera@email.com',
    phone: '0712345678',
    nicPassport: 'NIC123456789',
    address: 'Colombo, Sri Lanka',
    nationality: 'Sri Lankan',
    status: 'Active',
    createdAt: '2026-01-15'
  },
  {
    id: 'G002',
    firstName: 'Nirmala',
    lastName: 'Silva',
    email: 'nirmala.silva@email.com',
    phone: '0787654321',
    nicPassport: 'NIC987654321',
    address: 'Galle, Sri Lanka',
    nationality: 'Sri Lankan',
    status: 'Active',
    createdAt: '2026-01-15'
  },
  {
    id: 'G003',
    firstName: 'John',
    lastName: 'Anderson',
    email: 'john.anderson@email.com',
    phone: '+14155552368',
    nicPassport: 'PASS001',
    address: 'New York, USA',
    nationality: 'American',
    status: 'Active',
    createdAt: '2026-01-15'
  },
  {
    id: 'G004',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@email.com',
    phone: '+34912345678',
    nicPassport: 'PASS002',
    address: 'Madrid, Spain',
    nationality: 'Spanish',
    status: 'Inactive',
    createdAt: '2026-01-15'
  }
];

export function addGuest(guest) {
  const newGuest = {
    id: `G${String(guests.length + 1).padStart(3, '0')}`,
    ...guest,
    createdAt: new Date().toISOString().split('T')[0]
  };
  guests.push(newGuest);
  return newGuest;
}

export function findGuestById(id) {
  return guests.find(g => g.id === id);
}

export function findGuestByEmail(email) {
  return guests.find(g => g.email === email);
}

export function updateGuest(id, updates) {
  const guest = guests.find(g => g.id === id);
  if (guest) {
    Object.assign(guest, updates);
  }
  return guest;
}

export function deleteGuest(id) {
  const index = guests.findIndex(g => g.id === id);
  if (index > -1) {
    return guests.splice(index, 1)[0];
  }
  return null;
}
