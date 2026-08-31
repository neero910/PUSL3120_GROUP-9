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

/**
 * Filter reservations by status
 * @param {string} status - Reservation status (Confirmed, Pending, Completed, Cancelled)
 * @returns {Array} Filtered reservations
 */
export function filterReservationsByStatus(status) {
  if (!status) return reservations;
  return reservations.filter(r => 
    r.status.toLowerCase() === status.toLowerCase()
  );
}

/**
 * Filter reservations by date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Array} Filtered reservations
 */
export function filterReservationsByDateRange(startDate, endDate) {
  return reservations.filter(r => {
    const resStart = new Date(r.checkInDate);
    const resEnd = new Date(r.checkOutDate);
    const filterStart = new Date(startDate);
    const filterEnd = new Date(endDate);
    
    // Check if reservation overlaps with date range
    return !(resEnd < filterStart || resStart > filterEnd);
  });
}

/**
 * Search reservations by multiple criteria
 * @param {string} query - Search query (guest name, room number, reservation ID)
 * @param {object} filters - Optional filters { status, startDate, endDate }
 * @returns {Array} Matching reservations
 */
export function searchReservations(query, filters = {}) {
  import { findGuestById } from './guests.js';
  import { findRoomById } from './rooms.js';
  
  let results = reservations;

  // Apply date filter if provided
  if (filters.startDate && filters.endDate) {
    results = results.filter(r => {
      const resStart = new Date(r.checkInDate);
      const resEnd = new Date(r.checkOutDate);
      const filterStart = new Date(filters.startDate);
      const filterEnd = new Date(filters.endDate);
      return !(resEnd < filterStart || resStart > filterEnd);
    });
  }

  // Apply status filter if provided
  if (filters.status) {
    results = results.filter(r => 
      r.status.toLowerCase() === filters.status.toLowerCase()
    );
  }

  // Apply search query if provided
  if (query && query.trim()) {
    const searchTerm = query.toLowerCase();
    results = results.filter(r => {
      // Search by reservation ID
      if (r.id.toLowerCase().includes(searchTerm)) return true;
      
      // Search by room number
      if (r.roomId.toLowerCase().includes(searchTerm)) return true;
      
      // Search by guest ID
      if (r.guestId.toLowerCase().includes(searchTerm)) return true;
      
      // Search by special requests
      if (r.specialRequests && r.specialRequests.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      return false;
    });
  }

  return results;
}

/**
 * Get reservations with advanced filtering and pagination
 * @param {object} options - { status, startDate, endDate, page, limit, sortBy, sortOrder }
 * @returns {object} { data, pagination }
 */
export function getReservationsWithFilters(options = {}) {
  const {
    status,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  let filtered = reservations;

  // Apply status filter
  if (status) {
    filtered = filtered.filter(r => 
      r.status.toLowerCase() === status.toLowerCase()
    );
  }

  // Apply date range filter
  if (startDate && endDate) {
    filtered = filtered.filter(r => {
      const resStart = new Date(r.checkInDate);
      const resEnd = new Date(r.checkOutDate);
      const filterStart = new Date(startDate);
      const filterEnd = new Date(endDate);
      return !(resEnd < filterStart || resStart > filterEnd);
    });
  }

  // Sort results
  filtered.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });

  // Pagination
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
}
