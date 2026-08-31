# Reservations API - Frontend Integration Guide

## Installation & Setup

### Prerequisites
- Node.js backend running on `http://localhost:3000`
- API endpoints documented in `RESERVATIONS_API_DOCUMENTATION.md`

---

## Frontend Service/Hook Implementation

### Example: React Fetch Service

```javascript
// services/reservationService.js

const BASE_URL = 'http://localhost:3000/api/reservations';

export const reservationService = {
  // CRUD Operations
  getAllReservations: async () => {
    const response = await fetch(`${BASE_URL}`);
    return response.json();
  },

  getReservationById: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`);
    return response.json();
  },

  createReservation: async (data, token) => {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  updateReservation: async (id, data, token) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  cancelReservation: async (id, token) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  // Guest Queries
  getGuestReservations: async (guestId) => {
    const response = await fetch(`${BASE_URL}/guest/${guestId}`);
    return response.json();
  },

  // Filtering
  filterByStatus: async (status) => {
    const response = await fetch(`${BASE_URL}/filter/status?status=${status}`);
    return response.json();
  },

  filterByDateRange: async (startDate, endDate) => {
    const response = await fetch(
      `${BASE_URL}/filter/date-range?startDate=${startDate}&endDate=${endDate}`
    );
    return response.json();
  },

  // Search
  search: async (query, filters = {}) => {
    const params = new URLSearchParams({ query, ...filters });
    const response = await fetch(`${BASE_URL}/search?${params}`);
    return response.json();
  },

  // Advanced Filtering with Pagination
  getFiltered: async (options = {}) => {
    const params = new URLSearchParams(options);
    const response = await fetch(`${BASE_URL}/filtered?${params}`);
    return response.json();
  },

  // Statistics
  getStatistics: async () => {
    const response = await fetch(`${BASE_URL}/stats/summary`);
    return response.json();
  },

  getStatisticsByStatus: async () => {
    const response = await fetch(`${BASE_URL}/stats/by-status`);
    return response.json();
  },

  // Availability
  checkAvailability: async (roomId, startDate, endDate) => {
    const response = await fetch(
      `${BASE_URL}/availability/room/${roomId}?startDate=${startDate}&endDate=${endDate}`
    );
    return response.json();
  }
};
```

---

## React Hook Example

```javascript
// hooks/useReservations.js

import { useState, useEffect } from 'react';
import { reservationService } from '../services/reservationService';

export function useReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservations = async (filters = {}) => {
    setLoading(true);
    try {
      const result = await reservationService.getFiltered(filters);
      if (result.success) {
        setReservations(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchReservations = async (query, filters = {}) => {
    setLoading(true);
    try {
      const result = await reservationService.search(query, filters);
      if (result.success) {
        setReservations(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (data, token) => {
    setLoading(true);
    try {
      const result = await reservationService.createReservation(data, token);
      if (result.success) {
        return result.data;
      } else {
        setError(result.message);
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReservation = async (id, data, token) => {
    setLoading(true);
    try {
      const result = await reservationService.updateReservation(id, data, token);
      if (result.success) {
        return result.data;
      } else {
        setError(result.message);
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    reservations,
    loading,
    error,
    fetchReservations,
    searchReservations,
    createReservation,
    updateReservation
  };
}
```

---

## React Component Examples

### Reservations List with Filters

```javascript
// components/ReservationsList.jsx

import React, { useState, useEffect } from 'react';
import { useReservations } from '../hooks/useReservations';

export function ReservationsList() {
  const { reservations, loading, error, fetchReservations } = useReservations();
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchReservations(filters);
  }, [filters]);

  const handleStatusChange = (e) => {
    setFilters({ ...filters, status: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="filters">
        <select value={filters.status} onChange={handleStatusChange}>
          <option value="">All Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Guest ID</th>
            <th>Room</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(res => (
            <tr key={res.id}>
              <td>{res.id}</td>
              <td>{res.guestId}</td>
              <td>{res.roomId}</td>
              <td>{res.checkInDate}</td>
              <td>{res.checkOutDate}</td>
              <td>{res.status}</td>
              <td>{res.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => handlePageChange(filters.page - 1)}>Prev</button>
        <span>Page {filters.page}</span>
        <button onClick={() => handlePageChange(filters.page + 1)}>Next</button>
      </div>
    </div>
  );
}
```

---

### Reservation Search Component

```javascript
// components/ReservationSearch.jsx

import React, { useState } from 'react';
import { useReservations } from '../hooks/useReservations';

export function ReservationSearch() {
  const { reservations, loading, error, searchReservations } = useReservations();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm) {
      await searchReservations(searchTerm, filters);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by ID, Room, Guest..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />

        <button type="submit">Search</button>
      </form>

      {loading && <div>Searching...</div>}
      {error && <div>Error: {error}</div>}

      <div>
        <h3>Results ({reservations.length})</h3>
        {reservations.map(res => (
          <div key={res.id} className="reservation-card">
            <h4>{res.id}</h4>
            <p>Guest: {res.guestId} | Room: {res.roomId}</p>
            <p>{res.checkInDate} to {res.checkOutDate}</p>
            <p>Status: <strong>{res.status}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Room Availability Checker

```javascript
// components/RoomAvailability.jsx

import React, { useState } from 'react';
import { reservationService } from '../services/reservationService';

export function RoomAvailability() {
  const [roomId, setRoomId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    try {
      const result = await reservationService.checkAvailability(
        roomId,
        startDate,
        endDate
      );
      setAvailability(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Check Room Availability</h2>
      
      <div>
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        
        <button onClick={handleCheck}>Check Availability</button>
      </div>

      {loading && <div>Checking...</div>}

      {availability && (
        <div>
          <h3>
            {availability.isAvailable ? '✓ Room is Available' : '✗ Room is Booked'}
          </h3>
          
          {!availability.isAvailable && (
            <div>
              <h4>Conflicting Reservations:</h4>
              <ul>
                {availability.conflictingReservations.map(res => (
                  <li key={res.id}>
                    {res.id}: {res.checkInDate} to {res.checkOutDate}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Best Practices

1. **Always handle loading and error states** in your UI
2. **Store authentication token** in secure storage (not localStorage for sensitive apps)
3. **Validate dates** before making requests
4. **Use pagination** for large datasets
5. **Cache results** when appropriate to reduce API calls
6. **Implement debouncing** for search inputs
7. **Show user-friendly error messages**
8. **Use loading spinners** for better UX

---

## Testing

### Manual Testing with curl

```bash
# Get all reservations
curl http://localhost:3000/api/reservations

# Search for a reservation
curl "http://localhost:3000/api/reservations/search?query=RES001"

# Filter by status
curl "http://localhost:3000/api/reservations/filter/status?status=Confirmed"

# Check availability
curl "http://localhost:3000/api/reservations/availability/room/103?startDate=2026-09-15&endDate=2026-09-20"

# Get paginated results
curl "http://localhost:3000/api/reservations/filtered?page=1&limit=10&status=Confirmed"
```

### Using Postman

1. Import `SyncBoard-API.postman_collection.json` into Postman
2. Select the Reservations collection
3. Set authorization token in the collection settings
4. Run individual requests or use the collection runner

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check if token is valid and passed in Authorization header |
| 404 Not Found | Verify resource ID exists and endpoint URL is correct |
| 409 Conflict | Room is already booked for dates - check availability first |
| 400 Bad Request | Check query parameters and request body format |
| Date format errors | Use YYYY-MM-DD format for all dates |

---

## Performance Tips

1. Use `/filtered` endpoint instead of fetching all data
2. Implement pagination for large datasets
3. Use search for user-entered queries
4. Cache statistics results
5. Limit results with `limit` parameter (default 10)
6. Use appropriate sort fields to reduce client-side processing

---

## Additional Resources

- Full API Documentation: `RESERVATIONS_API_DOCUMENTATION.md`
- Quick Reference: `RESERVATIONS_API_QUICK_REFERENCE.md`
- Postman Collection: `backend/SyncBoard-API.postman_collection.json`
