# Check-In and Check-Out API Services

This directory contains the API service layer for the Check-In and Check-Out modules of the Hotel Management System.

## Files

### `api.js`
Base API configuration and HTTP client utility.

**Exports:**
- `apiCall(endpoint, options)` - Main function for making API requests
- `API_BASE_URL` - Base URL for all API endpoints

**Usage:**
```javascript
import { apiCall } from './api';

const data = await apiCall('/endpoint', {
  method: 'GET',
  headers: {},
  body: null
});
```

### `checkInService.js`
Service for check-in related operations.

**Functions:**
- `searchReservation(searchQuery)` - Search for reservation by ID or guest name
- `getReservationDetails(reservationId)` - Get full reservation details
- `getGuestInfo(guestId)` - Get guest information
- `getRoomInfo(roomId)` - Get room information
- `confirmCheckIn(checkInData)` - Confirm guest check-in
- `getPendingCheckIns()` - Get list of pending check-ins
- `updateCheckInStatus(checkInId, updateData)` - Update check-in status

**Example:**
```javascript
import { searchReservation, confirmCheckIn } from './checkInService';

try {
  const reservation = await searchReservation('RES-1026');
  const confirmation = await confirmCheckIn({
    reservationId: reservation.id,
    guestId: reservation.guestId,
    roomId: reservation.roomId,
    checkInTime: new Date().toISOString(),
    notes: ''
  });
} catch (error) {
  console.error('Check-in failed:', error.message);
}
```

### `checkOutService.js`
Service for check-out related operations.

**Functions:**
- `searchActiveGuest(searchQuery)` - Search for active guest
- `getCheckOutDetails(guestId)` - Get check-out details including charges
- `getCheckOutDetailsByReservation(reservationId)` - Get by reservation ID
- `getChargesBreakdown(guestId)` - Get detailed charges breakdown
- `getPaymentMethods()` - Get available payment methods
- `processCheckOut(checkOutData)` - Process check-out and payment
- `applyDiscount(guestId, discountData)` - Apply discount to bill
- `getPendingCheckOuts()` - Get list of guests due for check-out
- `generateInvoice(guestId)` - Generate invoice for check-out

**Example:**
```javascript
import { searchActiveGuest, processCheckOut } from './checkOutService';

try {
  const guest = await searchActiveGuest('Chaminda');
  const result = await processCheckOut({
    guestId: guest.guestId,
    reservationId: guest.reservationId,
    checkOutTime: new Date().toISOString(),
    paymentMethod: 'Card',
    totalAmount: '50,500',
    paymentDetails: {
      method: 'Card',
      amount: '50,500',
      transactionId: 'TXN-123456'
    },
    notes: ''
  });
} catch (error) {
  console.error('Check-out failed:', error.message);
}
```

## Configuration

### Environment Variables

Create a `.env` file in the project root (or use `.env.example` as template):

```env
VITE_API_URL=http://localhost:3000/api
```

**Default Value:** `http://localhost:3000/api`

The API URL is loaded from environment variables at runtime, allowing different configurations for development, staging, and production.

## Error Handling

All service functions throw errors that can be caught and handled. The error messages are descriptive and indicate the operation that failed.

```javascript
import { searchReservation } from './checkInService';

try {
  const reservation = await searchReservation('RES-1026');
} catch (error) {
  // error.message = "Failed to search reservation: Reservation not found"
  console.error(error.message);
}
```

## Component Integration

The services are integrated into the Check-In and Check-Out pages:

### CheckIn.jsx
- Uses `searchReservation()` to find reservations
- Uses `getReservationDetails()` to load full details
- Uses `confirmCheckIn()` to confirm guest arrival
- Includes loading and error states
- Shows success messages on successful check-in

### CheckOut.jsx
- Uses `searchActiveGuest()` to find guests
- Uses `getCheckOutDetails()` to load bill information
- Uses `applyDiscount()` to apply discounts
- Uses `processCheckOut()` to complete check-out
- Supports multiple payment methods
- Includes loading and error states

## API Response Format

All API endpoints return JSON responses following a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "Operation completed successfully"
}
```

**Error Response:**
```json
{
  "error": true,
  "message": "Description of what went wrong",
  "code": "ERROR_CODE"
}
```

## Backend Requirements

The backend API should implement the following endpoints. Refer to `API_DOCUMENTATION.md` for detailed specifications:

### Check-In Endpoints
- `GET /check-in/search?query={query}`
- `GET /check-in/reservation/{reservationId}`
- `GET /check-in/guest/{guestId}`
- `GET /check-in/room/{roomId}`
- `POST /check-in/confirm`
- `GET /check-in/pending`
- `PUT /check-in/{checkInId}`

### Check-Out Endpoints
- `GET /check-out/search?query={query}`
- `GET /check-out/guest/{guestId}`
- `GET /check-out/reservation/{reservationId}`
- `GET /check-out/charges/{guestId}`
- `GET /check-out/payment-methods`
- `POST /check-out/process`
- `POST /check-out/discount/{guestId}`
- `GET /check-out/pending`
- `GET /check-out/invoice/{guestId}`

## Testing

To test the services during development:

1. Set up a local backend API server on `http://localhost:3000`
2. Implement the required endpoints as per `API_DOCUMENTATION.md`
3. Update the `VITE_API_URL` environment variable if needed
4. Run the frontend development server
5. Use the Check-In and Check-Out pages to test the services

## Future Enhancements

- Add authentication/authorization support
- Implement caching for frequently accessed data
- Add request/response interceptors for logging
- Add retry logic for failed requests
- Add request timeout configuration
- Implement offline mode with local storage
- Add request cancellation support
