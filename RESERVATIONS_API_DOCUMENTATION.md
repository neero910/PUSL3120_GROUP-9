# Reservations Module API Documentation

## Overview
This document provides comprehensive documentation for the Reservations API endpoints, including filtering, search, and advanced query capabilities.

---

## Base URL
```
http://localhost:3000/api/reservations
```

---

## Authentication
Protected endpoints require authentication middleware and role-based authorization:
- **Roles**: Administrator, Manager, Receptionist (for most operations)
- **Header**: `Authorization: Bearer <token>`

---

## API Endpoints

### 1. Get All Reservations
**Endpoint**: `GET /api/reservations`  
**Authentication**: Not required  
**Description**: Retrieve all reservations

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "RES001",
      "guestId": "G001",
      "roomId": "103",
      "checkInDate": "2026-08-30",
      "checkOutDate": "2026-09-02",
      "adults": 2,
      "children": 0,
      "status": "Confirmed",
      "totalAmount": 45000,
      "specialRequests": "Early check-in preferred",
      "createdAt": "2026-01-15"
    }
  ]
}
```

---

### 2. Get Single Reservation
**Endpoint**: `GET /api/reservations/:id`  
**Authentication**: Not required  
**Description**: Retrieve a specific reservation by ID

**Parameters**:
- `id` (URL path): Reservation ID (e.g., RES001)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "RES001",
    "guestId": "G001",
    "roomId": "103",
    "checkInDate": "2026-08-30",
    "checkOutDate": "2026-09-02",
    "adults": 2,
    "children": 0,
    "status": "Confirmed",
    "totalAmount": 45000,
    "specialRequests": "Early check-in preferred",
    "createdAt": "2026-01-15"
  }
}
```

---

### 3. Create Reservation
**Endpoint**: `POST /api/reservations`  
**Authentication**: Required (Administrator, Manager, Receptionist)  
**Description**: Create a new reservation

**Request Body**:
```json
{
  "guestId": "G001",
  "roomId": "103",
  "checkInDate": "2026-09-10",
  "checkOutDate": "2026-09-15",
  "adults": 2,
  "children": 1,
  "status": "Pending",
  "specialRequests": "High floor preferred"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "id": "RES005",
    "guestId": "G001",
    "roomId": "103",
    "checkInDate": "2026-09-10",
    "checkOutDate": "2026-09-15",
    "adults": 2,
    "children": 1,
    "status": "Pending",
    "totalAmount": 225000,
    "specialRequests": "High floor preferred",
    "createdAt": "2026-08-31"
  }
}
```

---

### 4. Update Reservation
**Endpoint**: `PUT /api/reservations/:id`  
**Authentication**: Required (Administrator, Manager, Receptionist)  
**Description**: Update an existing reservation

**Request Body** (all fields optional):
```json
{
  "checkInDate": "2026-09-11",
  "checkOutDate": "2026-09-16",
  "adults": 3,
  "children": 0,
  "status": "Confirmed",
  "specialRequests": "High floor preferred, non-smoking"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Reservation updated successfully",
  "data": {
    "id": "RES005",
    "guestId": "G001",
    "roomId": "103",
    "checkInDate": "2026-09-11",
    "checkOutDate": "2026-09-16",
    "adults": 3,
    "children": 0,
    "status": "Confirmed",
    "totalAmount": 250000,
    "specialRequests": "High floor preferred, non-smoking",
    "createdAt": "2026-08-31"
  }
}
```

---

### 5. Delete/Cancel Reservation
**Endpoint**: `DELETE /api/reservations/:id`  
**Authentication**: Required (Administrator, Manager)  
**Description**: Cancel a reservation (soft delete)

**Response**:
```json
{
  "success": true,
  "message": "Reservation cancelled successfully",
  "data": {
    "id": "RES005",
    "status": "Cancelled"
  }
}
```

---

### 6. Get Reservations by Guest
**Endpoint**: `GET /api/reservations/guest/:guestId`  
**Authentication**: Not required  
**Description**: Retrieve all reservations for a specific guest

**Parameters**:
- `guestId` (URL path): Guest ID (e.g., G001)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "RES001",
      "guestId": "G001",
      "roomId": "103",
      "checkInDate": "2026-08-30",
      "checkOutDate": "2026-09-02",
      "status": "Confirmed"
    }
  ]
}
```

---

## Filtering & Search Endpoints

### 7. Filter by Status
**Endpoint**: `GET /api/reservations/filter/status`  
**Authentication**: Not required  
**Description**: Get all reservations with a specific status

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | Yes | Status filter: `Confirmed`, `Pending`, `Completed`, `Cancelled` |

**Example**: 
```
GET /api/reservations/filter/status?status=Confirmed
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "RES001",
      "guestId": "G001",
      "roomId": "103",
      "status": "Confirmed",
      "checkInDate": "2026-08-30",
      "checkOutDate": "2026-09-02"
    }
  ],
  "count": 2
}
```

---

### 8. Filter by Date Range
**Endpoint**: `GET /api/reservations/filter/date-range`  
**Authentication**: Not required  
**Description**: Get reservations within a specific date range

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | string | Yes | Start date (YYYY-MM-DD format) |
| endDate | string | Yes | End date (YYYY-MM-DD format) |

**Example**: 
```
GET /api/reservations/filter/date-range?startDate=2026-09-01&endDate=2026-09-30
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "RES002",
      "guestId": "G002",
      "roomId": "201",
      "checkInDate": "2026-09-05",
      "checkOutDate": "2026-09-10",
      "status": "Pending"
    }
  ],
  "count": 1,
  "dateRange": {
    "startDate": "2026-09-01",
    "endDate": "2026-09-30"
  }
}
```

---

### 9. Search Reservations
**Endpoint**: `GET /api/reservations/search`  
**Authentication**: Not required  
**Description**: Search reservations by query and optional filters

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | No | Search term (searches: Reservation ID, Room ID, Guest ID, Special Requests) |
| status | string | No | Filter by status |
| startDate | string | No | Filter by start date (YYYY-MM-DD) |
| endDate | string | No | Filter by end date (YYYY-MM-DD) |

**Examples**:

Search by Reservation ID:
```
GET /api/reservations/search?query=RES001
```

Search by Room ID with status filter:
```
GET /api/reservations/search?query=103&status=Confirmed
```

Search by date range:
```
GET /api/reservations/search?query=crib&startDate=2026-09-01&endDate=2026-09-30&status=Pending
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "RES002",
      "guestId": "G002",
      "roomId": "201",
      "checkInDate": "2026-09-05",
      "checkOutDate": "2026-09-10",
      "specialRequests": "Crib needed",
      "status": "Pending"
    }
  ],
  "count": 1,
  "query": "crib",
  "appliedFilters": {
    "status": "Pending",
    "startDate": "2026-09-01",
    "endDate": "2026-09-30"
  }
}
```

---

### 10. Get Filtered Reservations with Pagination
**Endpoint**: `GET /api/reservations/filtered`  
**Authentication**: Not required  
**Description**: Get reservations with advanced filtering, sorting, and pagination

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | string | - | Filter by status |
| startDate | string | - | Filter by start date (YYYY-MM-DD) |
| endDate | string | - | Filter by end date (YYYY-MM-DD) |
| page | number | 1 | Page number for pagination |
| limit | number | 10 | Number of results per page |
| sortBy | string | createdAt | Field to sort by: `id`, `status`, `checkInDate`, `checkOutDate`, `totalAmount`, `createdAt` |
| sortOrder | string | desc | Sort order: `asc` or `desc` |

**Example**:
```
GET /api/reservations/filtered?status=Confirmed&page=1&limit=10&sortBy=checkInDate&sortOrder=asc
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "RES001",
      "guestId": "G001",
      "roomId": "103",
      "checkInDate": "2026-08-30",
      "checkOutDate": "2026-09-02",
      "status": "Confirmed",
      "totalAmount": 45000,
      "createdAt": "2026-01-15"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalCount": 2,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

## Statistics Endpoints

### 11. Get Reservation Summary Statistics
**Endpoint**: `GET /api/reservations/stats/summary`  
**Authentication**: Not required  
**Description**: Get overall reservation statistics

**Response**:
```json
{
  "success": true,
  "data": {
    "totalReservations": 4,
    "confirmedReservations": 1,
    "pendingReservations": 1,
    "completedReservations": 1,
    "cancelledReservations": 1,
    "totalRevenue": 220000
  }
}
```

---

### 12. Get Statistics by Status
**Endpoint**: `GET /api/reservations/stats/by-status`  
**Authentication**: Not required  
**Description**: Get reservation count and percentages by status

**Response**:
```json
{
  "success": true,
  "data": {
    "confirmed": 1,
    "pending": 1,
    "completed": 1,
    "cancelled": 1,
    "total": 4,
    "percentage": {
      "confirmed": "25.00",
      "pending": "25.00",
      "completed": "25.00",
      "cancelled": "25.00"
    }
  }
}
```

---

## Availability Endpoints

### 13. Check Room Availability
**Endpoint**: `GET /api/reservations/availability/room/:roomId`  
**Authentication**: Not required  
**Description**: Check if a room is available during a specific date range

**Parameters**:
- `roomId` (URL path): Room ID (e.g., 103)

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | string | Yes | Check-in date (YYYY-MM-DD) |
| endDate | string | Yes | Check-out date (YYYY-MM-DD) |

**Example**:
```
GET /api/reservations/availability/room/103?startDate=2026-09-05&endDate=2026-09-10
```

**Response**:
```json
{
  "success": true,
  "data": {
    "roomId": "103",
    "isAvailable": true,
    "conflictingReservations": [],
    "totalReservations": 1,
    "dateRange": {
      "startDate": "2026-09-05",
      "endDate": "2026-09-10"
    }
  }
}
```

When conflicts exist:
```json
{
  "success": true,
  "data": {
    "roomId": "103",
    "isAvailable": false,
    "conflictingReservations": [
      {
        "id": "RES001",
        "guestId": "G001",
        "checkInDate": "2026-08-30",
        "checkOutDate": "2026-09-02",
        "status": "Confirmed"
      }
    ],
    "totalReservations": 2,
    "dateRange": {
      "startDate": "2026-09-01",
      "endDate": "2026-09-05"
    }
  }
}
```

---

## Reservation Statuses
The following statuses are supported:
- **Confirmed**: Reservation is confirmed
- **Pending**: Reservation is awaiting confirmation
- **Completed**: Guest has checked out
- **Cancelled**: Reservation has been cancelled

---

## Error Responses

### Bad Request (400)
```json
{
  "success": false,
  "message": "Status parameter is required"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Reservation not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "Room is already reserved for the selected dates"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Usage Examples

### Example 1: Find Confirmed Reservations for September
```bash
curl "http://localhost:3000/api/reservations/filtered?status=Confirmed&startDate=2026-09-01&endDate=2026-09-30"
```

### Example 2: Search for a specific reservation
```bash
curl "http://localhost:3000/api/reservations/search?query=RES001"
```

### Example 3: Get available rooms for a date range
```bash
curl "http://localhost:3000/api/reservations/availability/room/103?startDate=2026-09-10&endDate=2026-09-15"
```

### Example 4: Create a new reservation
```bash
curl -X POST "http://localhost:3000/api/reservations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token-here" \
  -d '{
    "guestId": "G005",
    "roomId": "301",
    "checkInDate": "2026-09-20",
    "checkOutDate": "2026-09-25",
    "adults": 2,
    "children": 0,
    "status": "Pending",
    "specialRequests": "Late check-in"
  }'
```

### Example 5: Get paginated reservations with sorting
```bash
curl "http://localhost:3000/api/reservations/filtered?page=2&limit=5&sortBy=totalAmount&sortOrder=desc"
```

---

## Notes
- All dates should be in `YYYY-MM-DD` format
- Date range filtering checks for overlapping reservations
- Cancelled reservations are excluded from availability checks
- Pagination pages are 1-indexed
- The `totalAmount` is automatically calculated based on room price and number of nights
- When updating a reservation with new dates, conflicts are automatically checked

---

## Implementation Status
✅ All endpoints implemented and tested  
✅ Status filtering  
✅ Date range filtering  
✅ Advanced search  
✅ Pagination support  
✅ Sorting capabilities  
✅ Availability checking  
✅ Statistics aggregation
