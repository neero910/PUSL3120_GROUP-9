/**
 * Temporary Reservations Data Store
 * Phase 2: In-Memory Storage (Will be replaced by MongoDB in Phase 3)
 */

export let reservations = [
  {
    id: 'RES001',
    guestId: 'G001',
    roomId: '103',
    checkInDate: '2026-08-30',
    checkOutDate: '2026-09-02',
    adults: 2,
    children: 0,
    status: 'Confirmed',
    totalAmount: 45000,
    specialRequests: 'Early check-in preferred',
    createdAt: '2026-01-15'
  },
  {
    id: 'RES002',
    guestId: 'G002',
    roomId: '201',
    checkInDate: '2026-09-05',
    checkOutDate: '2026-09-10',
    adults: 1,
    children: 1,
    status: 'Pending',
    totalAmount: 75000,
    specialRequests: 'Crib needed',
    createdAt: '2026-01-15'
  },
  {
    id: 'RES003',
    guestId: 'G003',
    roomId: '202',
    checkInDate: '2026-08-20',
    checkOutDate: '2026-08-25',
    adults: 2,
    children: 2,
    status: 'Completed',
    totalAmount: 125000,
    specialRequests: '',
    createdAt: '2026-01-15'
  },
  {
    id: 'RES004',
    guestId: 'G004',
    roomId: '101',
    checkInDate: '2026-09-15',
    checkOutDate: '2026-09-20',
    adults: 1,
    children: 0,
    status: 'Cancelled',
    totalAmount: 50000,
    specialRequests: 'Non-smoking room',
    createdAt: '2026-01-15'
  }
];

export function addReservation(reservation) {
  const newReservation = {
    id: `RES${String(reservations.length + 1).padStart(3, '0')}`,
    ...reservation,
    createdAt: new Date().toISOString().split('T')[0]
  };
  reservations.push(newReservation);
  return newReservation;
}

export function findReservationById(id) {
  return reservations.find(r => r.id === id);
}

export function findReservationsByGuestId(guestId) {
  return reservations.filter(r => r.guestId === guestId);
}

export function findReservationsByRoomId(roomId) {
  return reservations.filter(r => r.roomId === roomId);
}

export function findConflictingReservations(roomId, checkInDate, checkOutDate) {
  return reservations.filter(r => {
    if (r.roomId !== roomId || r.status === 'Cancelled') return false;
    const resStart = new Date(r.checkInDate);
    const resEnd = new Date(r.checkOutDate);
    const inStart = new Date(checkInDate);
    const inEnd = new Date(checkOutDate);
    
    return !(inEnd <= resStart || inStart >= resEnd);
  });
}

export function updateReservation(id, updates) {
  const reservation = reservations.find(r => r.id === id);
  if (reservation) {
    Object.assign(reservation, updates);
  }
  return reservation;
}

export function deleteReservation(id) {
  const index = reservations.findIndex(r => r.id === id);
  if (index > -1) {
    return reservations.splice(index, 1)[0];
  }
  return null;
}
