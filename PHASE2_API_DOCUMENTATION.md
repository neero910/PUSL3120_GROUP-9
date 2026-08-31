# PHASE 2 - API DOCUMENTATION

## Hotel Management System REST API

This document describes the REST API endpoints for the Hotel Management System Phase 2 (API Integration).

---

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Auth Endpoints

#### Register New User
**POST** `/auth/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "Receptionist"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Receptionist"
  }
}
```

#### Login User
**POST** `/auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "admin@hotel.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "Admin User",
    "email": "admin@hotel.com",
    "role": "Administrator"
  }
}
```

#### Get Current User
**GET** `/auth/me`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "name": "Admin User",
    "email": "admin@hotel.com",
    "role": "Administrator",
    "status": "Active"
  }
}
```

#### Verify Token
**POST** `/auth/verify`

**Authentication:** Not required (include token in header anyway)

**Response (200 OK):**
```json
{
  "success": true,
  "valid": true,
  "user": {
    "id": "1",
    "email": "admin@hotel.com",
    "name": "Admin User",
    "role": "Administrator"
  }
}
```

---

## Rooms Management

### Get All Rooms
**GET** `/rooms`

**Authentication:** Not required

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "101",
      "roomNumber": "101",
      "type": "Standard",
      "capacity": 2,
      "price": 10000,
      "status": "Available",
      "description": "Comfortable standard room",
      "amenities": ["WiFi", "AC", "TV"],
      "floor": 1,
      "createdAt": "2026-01-15"
    }
  ]
}
```

### Get Room by ID
**GET** `/rooms/:id`

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "101",
    "roomNumber": "101",
    "type": "Standard",
    "capacity": 2,
    "price": 10000,
    "status": "Available",
    "description": "Comfortable standard room",
    "amenities": ["WiFi", "AC", "TV"],
    "floor": 1,
    "createdAt": "2026-01-15"
  }
}
```

### Create Room
**POST** `/rooms`

**Authentication:** Required (Administrator, Manager only)

**Request Body:**
```json
{
  "roomNumber": "201",
  "type": "Deluxe",
  "capacity": 2,
  "price": 15000,
  "status": "Available",
  "description": "Spacious deluxe room",
  "amenities": ["WiFi", "AC", "TV", "Mini Bar"],
  "floor": 2
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "id": "201",
    "roomNumber": "201",
    "type": "Deluxe",
    "capacity": 2,
    "price": 15000,
    "status": "Available",
    "description": "Spacious deluxe room",
    "amenities": ["WiFi", "AC", "TV", "Mini Bar"],
    "floor": 2,
    "createdAt": "2026-08-30"
  }
}
```

### Update Room
**PUT** `/rooms/:id`

**Authentication:** Required (Administrator, Manager only)

**Request Body:**
```json
{
  "status": "Occupied",
  "price": 16000
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Room updated successfully",
  "data": { ... }
}
```

### Delete Room
**DELETE** `/rooms/:id`

**Authentication:** Required (Administrator, Manager only)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Room deleted successfully",
  "data": { ... }
}
```

### Quick Room Status Change
**PATCH** `/rooms/:id/status`

**Authentication:** Not required

**Request Body:**
```json
{
  "status": "Cleaning",
  "housekeepingStatus": "In Progress"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Room status updated to Cleaning",
  "data": {
    "id": "104",
    "roomNumber": "104",
    "status": "Cleaning",
    "housekeepingStatus": "In Progress"
  }
}
```

### Get Room Statistics
**GET** `/rooms/stats/summary`

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalRooms": 16,
    "availableRooms": 5,
    "occupiedRooms": 6,
    "reservedRooms": 2,
    "cleaningRooms": 2,
    "maintenanceRooms": 1,
    "occupancyRate": "37.50%"
  }
}
```

---

## Housekeeping Management

### Housekeeping Summary Statistics
**GET** `/housekeeping/stats/summary`

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalTasks": 7,
    "cleanCount": 1,
    "inProgressCount": 2,
    "dirtyCount": 2,
    "inspectionCount": 1,
    "oooCount": 1,
    "openMaintenanceCount": 2,
    "guestReadyPercentage": 14
  }
}
```

### Tasks Management

#### Get All Cleaning Tasks
**GET** `/housekeeping/tasks`

**Query Parameters:**
- `search`: Filter by room number, attendant, or task notes
- `stage`: Filter by stage (`Dirty / Needs Clean`, `In Progress`, `Inspection Required`, `Clean & Ready`, `Out of Order`)
- `floor`: Filter by floor (`1`, `2`, `3`, `4`)
- `priority`: Filter by priority (`Normal`, `High`, `Urgent`)
- `assignedTo`: Filter by assigned staff member

**Response (200 OK):**
```json
{
  "success": true,
  "count": 7,
  "data": [
    {
      "id": "HK-101",
      "roomNumber": "104",
      "roomType": "Deluxe",
      "floor": 1,
      "taskType": "Checkout Turnover",
      "priority": "High",
      "stage": "In Progress",
      "assignedTo": "Kamani Silva",
      "dueTime": "13:30",
      "startedAt": "12:15",
      "checklist": [
        { "id": "c1", "label": "Strip and replace bed linen & pillowcases", "completed": true },
        { "id": "c2", "label": "Sanitize and polish bathroom surfaces & mirrors", "completed": true }
      ],
      "notes": "New guest arriving at 14:00. Fast turnaround required."
    }
  ]
}
```

#### Get Task by ID
**GET** `/housekeeping/tasks/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": { "id": "HK-101", "roomNumber": "104", "stage": "In Progress" }
}
```

#### Create Cleaning Task
**POST** `/housekeeping/tasks`

**Request Body:**
```json
{
  "roomNumber": "106",
  "taskType": "Routine Clean",
  "priority": "Normal",
  "stage": "Dirty / Needs Clean",
  "assignedTo": "Kamani Silva",
  "dueTime": "15:00",
  "notes": "Routine stayover clean"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Cleaning task created for Room 106",
  "data": { ... }
}
```

#### Update Task Stage (Kanban Move)
**PATCH** `/housekeeping/tasks/:id/stage`

**Request Body:**
```json
{
  "stage": "In Progress"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task HK-101 moved to In Progress",
  "data": { ... }
}
```

#### Update Task Checklist & Certification
**PATCH** `/housekeeping/tasks/:id/checklist`

**Request Body:**
```json
{
  "checklist": [
    { "id": "c1", "label": "Strip and replace bed linen", "completed": true }
  ],
  "notes": "All items verified by supervisor",
  "isCleanAndReady": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Room 104 certified Clean & Ready!",
  "data": { ... }
}
```

#### Assign Staff Attendant
**PATCH** `/housekeeping/tasks/:id/assign`

**Request Body:**
```json
{
  "assignedTo": "Roshan Bandara",
  "priority": "High",
  "dueTime": "16:00"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Attendant Roshan Bandara assigned to Room 104",
  "data": { ... }
}
```

#### Delete Cleaning Task
**DELETE** `/housekeeping/tasks/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

### Staff Roster Management

#### Get All Housekeeping Staff
**GET** `/housekeeping/staff`

**Response (200 OK):**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": "1",
      "name": "Kamani Silva",
      "role": "Senior Housekeeper",
      "shift": "Morning (07:00 - 15:30)",
      "floor": "Floor 1 & 2",
      "status": "On Duty",
      "assignedRooms": ["101", "104", "202", "301"],
      "completedToday": 5,
      "avatar": "KS",
      "phone": "+94 77 234 5671"
    }
  ]
}
```

#### Create Staff Member
**POST** `/housekeeping/staff`

**Request Body:**
```json
{
  "name": "Anoma Wickrama",
  "role": "Housekeeping Attendant",
  "shift": "Morning (07:00 - 15:30)",
  "floor": "Floor 1 & 2",
  "phone": "+94 77 111 2233"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Staff member added successfully",
  "data": { ... }
}
```

---

### Maintenance & Damage Log

#### Get All Maintenance Tickets
**GET** `/housekeeping/maintenance`

**Query Parameters:**
- `status`: `Open`, `In Progress`, `Pending Parts`, `Resolved`
- `severity`: `Low`, `Normal`, `High`, `Urgent`
- `roomNumber`: Filter by room number
- `search`: Keyword search

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "MNT-401",
      "roomNumber": "105",
      "category": "HVAC / Air Conditioning",
      "title": "AC unit blowing lukewarm air",
      "severity": "High",
      "reportedBy": "Kamani Silva (Housekeeping)",
      "reportedAt": "Today, 08:30 AM",
      "assignedTechnician": "Nuwan Kumara (Engineering)",
      "status": "In Progress",
      "notes": "Compressor valve needs replacement."
    }
  ]
}
```

#### Log Repair Ticket
**POST** `/housekeeping/maintenance`

**Request Body:**
```json
{
  "roomNumber": "202",
  "category": "Electrical & Lighting",
  "title": "Balcony ambient spotlight flickering",
  "severity": "Low",
  "reportedBy": "Roshan Bandara",
  "assignedTechnician": "Nuwan Kumara",
  "notes": "Connector loose"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Maintenance ticket MNT-404 logged for Room 202",
  "data": { ... }
}
```

#### Resolve Repair Ticket
**PATCH** `/housekeeping/maintenance/:id/resolve`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Maintenance issue MNT-401 marked as Resolved",
  "data": { ... }
}
```

---

### Linen & Supply Inventory

#### Get All Supplies
**GET** `/housekeeping/inventory`

**Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "INV-01",
      "item": "Egyptian Cotton Bed Sheets (King)",
      "category": "Linen",
      "inStock": 64,
      "minRequired": 40,
      "unit": "Sets",
      "status": "In Stock"
    }
  ]
}
```

#### Restock Supply Item
**POST** `/housekeeping/inventory/:id/restock`

**Request Body:**
```json
{
  "quantity": 20
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Restocked Egyptian Cotton Bed Sheets (King) successfully",
  "data": {
    "id": "INV-01",
    "inStock": 84,
    "status": "In Stock"
  }
}
```

---

## Guests Management

### Get All Guests
**GET** `/guests`

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "G001",
      "firstName": "Kasun",
      "lastName": "Perera",
      "email": "kasun@example.com",
      "phone": "0712345678",
      "nicPassport": "NIC123456789",
      "address": "Colombo, Sri Lanka",
      "nationality": "Sri Lankan",
      "status": "Active",
      "createdAt": "2026-01-15"
    }
  ]
}
```

### Get Guest by ID
**GET** `/guests/:id`

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "success": true,
  "data": { ... }
}
```

### Create Guest
**POST** `/guests`

**Authentication:** Required (Receptionist and above)

**Request Body:**
```json
{
  "firstName": "Nirmala",
  "lastName": "Silva",
  "email": "nirmala@example.com",
  "phone": "0787654321",
  "nicPassport": "NIC987654321",
  "address": "Galle, Sri Lanka",
  "nationality": "Sri Lankan"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Guest created successfully",
  "data": { ... }
}
```

### Update Guest
**PUT** `/guests/:id`

**Authentication:** Required (Receptionist and above)

**Request Body:** (all fields optional)
```json
{
  "phone": "0712222222",
  "status": "Inactive"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Guest updated successfully",
  "data": { ... }
}
```

### Delete Guest
**DELETE** `/guests/:id`

**Authentication:** Required (Administrator, Manager only)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Guest deleted successfully",
  "data": { ... }
}
```

### Get Guest Statistics
**GET** `/guests/stats/summary`

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalGuests": 40,
    "activeGuests": 38,
    "inactiveGuests": 2
  }
}
```

---

## Reservations Management

### Get All Reservations
**GET** `/reservations`

**Authentication:** Not required

**Response (200 OK):**
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

### Get Reservation by ID
**GET** `/reservations/:id`

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "success": true,
  "data": { ... }
}
```

### Create Reservation
**POST** `/reservations`

**Authentication:** Required (Receptionist and above)

**Request Body:**
```json
{
  "guestId": "G001",
  "roomId": "101",
  "checkInDate": "2026-09-10",
  "checkOutDate": "2026-09-15",
  "adults": 2,
  "children": 0,
  "status": "Pending",
  "specialRequests": "Non-smoking room"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "id": "RES005",
    "guestId": "G001",
    "roomId": "101",
    "checkInDate": "2026-09-10",
    "checkOutDate": "2026-09-15",
    "adults": 2,
    "children": 0,
    "status": "Pending",
    "totalAmount": 50000,
    "specialRequests": "Non-smoking room",
    "createdAt": "2026-08-30"
  }
}
```

**Error Response (409 Conflict - Double Booking):**
```json
{
  "success": false,
  "message": "Room is already reserved for the selected dates"
}
```

### Update Reservation
**PUT** `/reservations/:id`

**Authentication:** Required (Receptionist and above)

**Request Body:**
```json
{
  "status": "Confirmed",
  "checkInDate": "2026-09-11"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Reservation updated successfully",
  "data": { ... }
}
```

### Delete/Cancel Reservation
**DELETE** `/reservations/:id`

**Authentication:** Required (Administrator, Manager only)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Reservation cancelled successfully",
  "data": {
    "id": "RES001",
    "status": "Cancelled",
    ...
  }
}
```

### Get Reservations by Guest
**GET** `/reservations/guest/:guestId`

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "success": true,
  "data": [ ... ]
}
```

### Get Reservation Statistics
**GET** `/reservations/stats/summary`

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalReservations": 20,
    "confirmedReservations": 18,
    "pendingReservations": 2,
    "completedReservations": 10,
    "cancelledReservations": 1,
    "totalRevenue": 500000
  }
}
```

---

## Dashboard

### Get Dashboard Summary
**GET** `/dashboard/summary`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "rooms": {
      "total": 30,
      "available": 12,
      "occupied": 15,
      "reserved": 2,
      "maintenance": 1,
      "occupancyRate": "50.00%"
    },
    "guests": {
      "total": 40,
      "active": 38
    },
    "reservations": {
      "total": 20,
      "confirmed": 18,
      "pending": 2
    },
    "revenue": {
      "today": 125000,
      "total": 1500000
    },
    "today": {
      "checkIns": 3,
      "checkOuts": 2
    },
    "recentReservations": [
      {
        "id": "RES001",
        "guestName": "Kasun Perera",
        "roomNumber": "103",
        "checkInDate": "2026-08-30",
        "checkOutDate": "2026-09-02",
        "status": "Confirmed",
        "totalAmount": 45000
      }
    ]
  }
}
```

### Get Occupancy Data
**GET** `/dashboard/occupancy`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "type": "Standard",
      "total": 10,
      "occupied": 5,
      "available": 5,
      "occupancyRate": "50.00"
    },
    {
      "type": "Deluxe",
      "total": 12,
      "occupied": 8,
      "available": 4,
      "occupancyRate": "66.67"
    },
    {
      "type": "Suite",
      "total": 8,
      "occupied": 2,
      "available": 6,
      "occupancyRate": "25.00"
    }
  ]
}
```

### Get Revenue Data
**GET** `/dashboard/revenue`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-08-24",
      "revenue": 120000
    },
    {
      "date": "2026-08-25",
      "revenue": 135000
    },
    {
      "date": "2026-08-26",
      "revenue": 110000
    },
    {
      "date": "2026-08-27",
      "revenue": 145000
    },
    {
      "date": "2026-08-28",
      "revenue": 125000
    },
    {
      "date": "2026-08-29",
      "revenue": 150000
    },
    {
      "date": "2026-08-30",
      "revenue": 125000
    }
  ]
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes

- **400 Bad Request** - Invalid request data or validation error
- **401 Unauthorized** - Missing or invalid authentication token
- **403 Forbidden** - Insufficient permissions for the action
- **404 Not Found** - Resource not found
- **409 Conflict** - Business rule violation (e.g., double-booking)
- **500 Internal Server Error** - Server error

---

## User Roles & Permissions

### Administrator
- Full access to all endpoints
- Can manage users, rooms, reservations, guests
- Can create, update, and delete all resources

### Manager
- Can manage rooms, reservations, and guests
- Cannot manage users
- Can view reports and dashboard

### Receptionist
- Can create and manage guests and reservations
- Can view rooms
- Cannot delete guests
- Can check availability

### Restaurant Staff
- Limited access
- Can view reservations
- Can manage restaurant-related features

---

## API Usage Examples

### Example 1: User Login Flow

1. **POST** `/auth/login`
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@hotel.com","password":"password123"}'
   ```

2. Store the returned token
   ```bash
   TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

3. Use token in subsequent requests
   ```bash
   curl -X GET http://localhost:5000/api/rooms \
     -H "Authorization: Bearer $TOKEN"
   ```

### Example 2: Create a Reservation

```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "guestId": "G001",
    "roomId": "101",
    "checkInDate": "2026-09-10",
    "checkOutDate": "2026-09-15",
    "adults": 2,
    "children": 0,
    "specialRequests": "Non-smoking"
  }'
```

### Example 3: Get Dashboard Summary

```bash
curl -X GET http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer $TOKEN"
```

---

## Notes

- All timestamps are in ISO 8601 format
- Prices are in the hotel's base currency (e.g., LKR)
- Dates are in YYYY-MM-DD format
- Double-booking prevention is automatically enforced at the API level
- All passwords are hashed using bcryptjs
- JWT tokens expire after 24 hours

---

## Phase 2 Limitations

This Phase 2 implementation uses temporary in-memory data storage:
- Data is not persisted to a database
- Data will be lost when the server restarts
- No concurrent user support
- No transaction handling

Phase 3 will implement MongoDB for persistent storage.
