# Reservations API - Quick Reference Guide

## Base URL
```
http://localhost:3000/api/reservations
```

## Quick Endpoints Summary

### CRUD Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all reservations |
| GET | `/:id` | Get single reservation |
| POST | `/` | Create reservation |
| PUT | `/:id` | Update reservation |
| DELETE | `/:id` | Cancel reservation |
| GET | `/guest/:guestId` | Get guest's reservations |

### Filtering
| Method | Endpoint | Query Parameters |
|--------|----------|------------------|
| GET | `/filter/status` | `status` |
| GET | `/filter/date-range` | `startDate`, `endDate` |
| GET | `/filtered` | `status`, `startDate`, `endDate`, `page`, `limit`, `sortBy`, `sortOrder` |

### Search
| Method | Endpoint | Query Parameters |
|--------|----------|------------------|
| GET | `/search` | `query`, `status`, `startDate`, `endDate` |

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats/summary` | Overall statistics |
| GET | `/stats/by-status` | Count and percentage by status |

### Availability
| Method | Endpoint | Query Parameters |
|--------|----------|------------------|
| GET | `/availability/room/:roomId` | `startDate`, `endDate` |

---

## Commonly Used Queries

### Get all confirmed reservations (paginated)
```
GET /api/reservations/filtered?status=Confirmed&page=1&limit=20
```

### Search for a reservation
```
GET /api/reservations/search?query=RES001
```

### Find pending reservations for September
```
GET /api/reservations/filter/status?status=Pending
(then filter by date on frontend OR use /filtered endpoint)
```

### Check room availability
```
GET /api/reservations/availability/room/103?startDate=2026-09-15&endDate=2026-09-20
```

### Get statistics
```
GET /api/reservations/stats/summary
GET /api/reservations/stats/by-status
```

---

## Request/Response Examples

### Create Reservation
```javascript
fetch('http://localhost:3000/api/reservations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    guestId: 'G001',
    roomId: '103',
    checkInDate: '2026-09-10',
    checkOutDate: '2026-09-15',
    adults: 2,
    children: 0,
    status: 'Pending',
    specialRequests: 'High floor'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Search with Filters
```javascript
const query = 'room 103';
const status = 'Confirmed';
const startDate = '2026-09-01';
const endDate = '2026-09-30';

fetch(`http://localhost:3000/api/reservations/search?query=${query}&status=${status}&startDate=${startDate}&endDate=${endDate}`)
  .then(res => res.json())
  .then(data => console.log(data));
```

### Get Paginated Results
```javascript
const status = 'Confirmed';
const page = 1;
const limit = 10;
const sortBy = 'checkInDate';
const sortOrder = 'asc';

fetch(`http://localhost:3000/api/reservations/filtered?status=${status}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`)
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Statuses
- `Confirmed` - Reservation is confirmed
- `Pending` - Awaiting confirmation
- `Completed` - Guest checked out
- `Cancelled` - Reservation cancelled

---

## Date Format
All dates must be in `YYYY-MM-DD` format (ISO format)

---

## Sortable Fields
- `id` - Reservation ID
- `status` - Reservation status
- `checkInDate` - Check-in date
- `checkOutDate` - Check-out date
- `totalAmount` - Total amount
- `createdAt` - Creation date

---

## Common Response Pattern
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

All successful responses include a `success: true` field and a `data` field with the actual response payload.

---

## Frontend Integration Tips

1. **Always pass Authorization header for POST/PUT/DELETE requests**
2. **Use `/filtered` endpoint for pagination and advanced queries**
3. **Use `/search` endpoint for user-facing search functionality**
4. **Check room availability before creating a reservation**
5. **Display statistics from `/stats/summary` on dashboard**
6. **Use `/stats/by-status` to show status distribution**

---

## Testing the API

Use Postman or Thunder Client with the provided API collection:
- File: `backend/SyncBoard-API.postman_collection.json`
- Import into Postman and run requests
- Make sure backend server is running on port 3000
