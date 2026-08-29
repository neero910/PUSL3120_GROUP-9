# Check-In and Check-Out API Documentation

## Base URL
`{VITE_API_URL}` - Default: `http://localhost:3000/api`

## Check-In Endpoints

### 1. Search Reservation
**Endpoint:** `GET /check-in/search?query={searchQuery}`

**Description:** Search for a reservation by ID or guest name

**Query Parameters:**
- `query` (string, required): Reservation ID or guest name to search for

**Response:**
```json
{
  "id": "RES-1026",
  "guestId": "G-123",
  "guestName": "Ishara Dissanayake",
  "guestContact": "+94 77 111 2233",
  "guestEmail": "ishara@email.com",
  "roomId": "R-118",
  "roomNumber": "118",
  "roomType": "Standard",
  "roomRate": "LKR 10,000/night",
  "floor": 1,
  "checkInDate": "2026-08-22",
  "checkOutDate": "2026-08-25",
  "numberOfGuests": 1,
  "passportNumber": "N3321458",
  "totalAmount": "LKR 31,500",
  "status": "Confirmed",
  "specialRequests": "High floor preferred"
}
```

**Error Response:**
```json
{
  "error": true,
  "message": "Reservation not found"
}
```

---

### 2. Get Reservation Details
**Endpoint:** `GET /check-in/reservation/{reservationId}`

**Description:** Get full reservation details by reservation ID

**Path Parameters:**
- `reservationId` (string, required): The reservation ID

**Response:** Same as Search Reservation response

---

### 3. Get Guest Information
**Endpoint:** `GET /check-in/guest/{guestId}`

**Description:** Get guest information for check-in

**Path Parameters:**
- `guestId` (string, required): The guest ID

**Response:**
```json
{
  "guestId": "G-123",
  "name": "Ishara Dissanayake",
  "contact": "+94 77 111 2233",
  "email": "ishara@email.com",
  "passportNumber": "N3321458",
  "nationality": "Sri Lanka",
  "address": "123 Main Street, Colombo",
  "previousStays": 2
}
```

---

### 4. Get Room Information
**Endpoint:** `GET /check-in/room/{roomId}`

**Description:** Get room details for check-in

**Path Parameters:**
- `roomId` (string, required): The room ID

**Response:**
```json
{
  "roomId": "R-118",
  "roomNumber": "118",
  "type": "Standard",
  "floor": 1,
  "rate": "LKR 10,000/night",
  "amenities": ["AC", "WiFi", "TV", "Bathroom"],
  "status": "Clean",
  "notes": "Recently renovated"
}
```

---

### 5. Confirm Check-In
**Endpoint:** `POST /check-in/confirm`

**Description:** Confirm check-in for a guest and update reservation status

**Request Body:**
```json
{
  "reservationId": "RES-1026",
  "guestId": "G-123",
  "roomId": "R-118",
  "checkInTime": "2026-08-22T14:30:00Z",
  "notes": "Early arrival, informed front desk"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Check-in confirmed successfully",
  "checkInId": "CI-001",
  "reservationId": "RES-1026",
  "guestName": "Ishara Dissanayake",
  "roomNumber": "118",
  "checkInTime": "2026-08-22T14:30:00Z",
  "keyCard": "K-12345",
  "invoiceNumber": "INV-2026-001"
}
```

---

### 6. Get Pending Check-Ins
**Endpoint:** `GET /check-in/pending`

**Description:** Get list of reservations pending check-in

**Response:**
```json
{
  "data": [
    {
      "id": "RES-1026",
      "guestName": "Ishara Dissanayake",
      "roomNumber": "118",
      "checkInDate": "2026-08-22",
      "expectedCheckInTime": "14:00",
      "status": "Pending"
    }
  ],
  "total": 1
}
```

---

### 7. Update Check-In Status
**Endpoint:** `PUT /check-in/{checkInId}`

**Description:** Update check-in status or notes

**Path Parameters:**
- `checkInId` (string, required): The check-in ID

**Request Body:**
```json
{
  "status": "Completed",
  "notes": "Guest provided additional information",
  "keyCardNumber": "K-12345"
}
```

---

## Check-Out Endpoints

### 1. Search Active Guest
**Endpoint:** `GET /check-out/search?query={searchQuery}`

**Description:** Search for an active guest for check-out

**Query Parameters:**
- `query` (string, required): Guest name or room number

**Response:**
```json
{
  "guestId": "G-456",
  "guestName": "Chaminda Jayasuriya",
  "roomNumber": "402",
  "reservationId": "RES-1025",
  "checkInDate": "2026-08-22",
  "expectedCheckOutDate": "2026-08-25"
}
```

---

### 2. Get Check-Out Details
**Endpoint:** `GET /check-out/guest/{guestId}`

**Description:** Get full check-out details including charges

**Path Parameters:**
- `guestId` (string, required): The guest ID

**Response:**
```json
{
  "guestId": "G-456",
  "guestName": "Chaminda Jayasuriya",
  "roomNumber": "402",
  "reservationId": "RES-1025",
  "checkInDate": "2026-08-22",
  "checkOutDate": "2026-08-25",
  "numberOfNights": 3,
  "roomCharges": "LKR 45,000",
  "restaurantCharges": "LKR 6,200",
  "additionalCharges": "LKR 1,800",
  "subtotal": "LKR 53,000",
  "discount": "LKR 2,500",
  "totalCharges": "LKR 50,500"
}
```

---

### 3. Get Check-Out Details by Reservation
**Endpoint:** `GET /check-out/reservation/{reservationId}`

**Description:** Get check-out details by reservation ID

**Path Parameters:**
- `reservationId` (string, required): The reservation ID

**Response:** Same as Get Check-Out Details response

---

### 4. Get Charges Breakdown
**Endpoint:** `GET /check-out/charges/{guestId}`

**Description:** Get detailed charges breakdown for a stay

**Path Parameters:**
- `guestId` (string, required): The guest ID

**Response:**
```json
{
  "guestId": "G-456",
  "roomCharges": {
    "perNight": "LKR 15,000",
    "numberOfNights": 3,
    "total": "LKR 45,000"
  },
  "restaurantCharges": [
    {
      "date": "2026-08-22",
      "amount": "LKR 2,100",
      "items": ["Breakfast", "Dinner"]
    },
    {
      "date": "2026-08-23",
      "amount": "LKR 2,050",
      "items": ["Breakfast", "Lunch", "Dinner"]
    },
    {
      "date": "2026-08-24",
      "amount": "LKR 2,050",
      "items": ["Breakfast", "Lunch"]
    }
  ],
  "additionalCharges": [
    {
      "description": "Late Checkout Fee",
      "amount": "LKR 1,800"
    }
  ],
  "discounts": [],
  "totalCharges": "LKR 53,000"
}
```

---

### 5. Get Payment Methods
**Endpoint:** `GET /check-out/payment-methods`

**Description:** Get available payment methods

**Response:**
```json
{
  "paymentMethods": [
    {
      "id": "cash",
      "name": "Cash",
      "enabled": true
    },
    {
      "id": "card",
      "name": "Card",
      "enabled": true,
      "cardTypes": ["Visa", "Mastercard", "AmEx"]
    },
    {
      "id": "bank_transfer",
      "name": "Bank Transfer",
      "enabled": true
    },
    {
      "id": "check",
      "name": "Check",
      "enabled": true
    }
  ]
}
```

---

### 6. Process Check-Out
**Endpoint:** `POST /check-out/process`

**Description:** Process check-out and payment

**Request Body:**
```json
{
  "guestId": "G-456",
  "reservationId": "RES-1025",
  "checkOutTime": "2026-08-25T10:30:00Z",
  "paymentMethod": "Card",
  "totalAmount": "LKR 50,500",
  "paymentDetails": {
    "method": "Card",
    "amount": "LKR 50,500",
    "transactionId": "TXN-123456",
    "reference": "VISA-****1234",
    "authCode": "123456"
  },
  "notes": "Guest satisfied with stay"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Check-out completed successfully",
  "checkOutId": "CO-001",
  "guestName": "Chaminda Jayasuriya",
  "roomNumber": "402",
  "checkOutTime": "2026-08-25T10:30:00Z",
  "totalPaid": "LKR 50,500",
  "paymentMethod": "Card",
  "invoiceNumber": "INV-2026-002",
  "receiptNumber": "REC-2026-001"
}
```

---

### 7. Apply Discount
**Endpoint:** `POST /check-out/discount/{guestId}`

**Description:** Apply discount to guest bill

**Path Parameters:**
- `guestId` (string, required): The guest ID

**Request Body:**
```json
{
  "amount": 2500,
  "reason": "Loyalty Member Discount",
  "approvedBy": "Manager - John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Discount applied successfully",
  "discountAmount": "LKR 2,500",
  "previousTotal": "LKR 53,000",
  "newTotal": "LKR 50,500",
  "discount": {
    "amount": "LKR 2,500",
    "reason": "Loyalty Member Discount",
    "approvedBy": "Manager - John Doe",
    "appliedAt": "2026-08-25T09:15:00Z"
  }
}
```

---

### 8. Get Pending Check-Outs
**Endpoint:** `GET /check-out/pending`

**Description:** Get list of guests due for check-out today or overdue

**Response:**
```json
{
  "data": [
    {
      "guestId": "G-456",
      "guestName": "Chaminda Jayasuriya",
      "roomNumber": "402",
      "checkOutDate": "2026-08-25",
      "expectedCheckOutTime": "11:00",
      "status": "Pending",
      "estimatedTotal": "LKR 50,500"
    }
  ],
  "total": 1
}
```

---

### 9. Generate Invoice
**Endpoint:** `GET /check-out/invoice/{guestId}`

**Description:** Generate invoice for check-out

**Path Parameters:**
- `guestId` (string, required): The guest ID

**Response:**
```json
{
  "invoiceNumber": "INV-2026-002",
  "date": "2026-08-25",
  "guestName": "Chaminda Jayasuriya",
  "guestAddress": "Colombo, Sri Lanka",
  "checkInDate": "2026-08-22",
  "checkOutDate": "2026-08-25",
  "roomNumber": "402",
  "roomCharges": "LKR 45,000",
  "restaurantCharges": "LKR 6,200",
  "additionalCharges": "LKR 1,800",
  "subtotal": "LKR 53,000",
  "discount": "LKR 2,500",
  "totalCharges": "LKR 50,500",
  "paymentMethod": "Card",
  "transactionId": "TXN-123456",
  "notes": "Thank you for staying with us!"
}
```

---

## Error Handling

All endpoints follow this error response format:

**Error Response (400 - Bad Request):**
```json
{
  "error": true,
  "message": "Invalid request parameters",
  "code": "INVALID_REQUEST"
}
```

**Error Response (404 - Not Found):**
```json
{
  "error": true,
  "message": "Reservation not found",
  "code": "NOT_FOUND"
}
```

**Error Response (500 - Server Error):**
```json
{
  "error": true,
  "message": "Internal server error",
  "code": "SERVER_ERROR"
}
```

---

## Status Codes

- `200`: Successful GET/PUT request
- `201`: Successful POST request (resource created)
- `400`: Bad request
- `401`: Unauthorized
- `404`: Resource not found
- `500`: Server error

---

## Authentication

Currently, the API endpoints do not require authentication. This should be added in the backend implementation based on your security requirements.

## Implementation Notes

- All date/time values should be in ISO 8601 format (e.g., `2026-08-25T10:30:00Z`)
- Currency amounts are returned as strings with currency prefix (e.g., "LKR 50,500")
- All endpoints should support CORS for frontend consumption
- Implement proper error logging on the backend
- Consider rate limiting for production environments
