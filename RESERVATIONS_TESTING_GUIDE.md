# Reservations API - Testing Guide

## Testing the API Endpoints

This guide provides step-by-step instructions for testing all Reservations API endpoints.

---

## Prerequisites

1. Backend server running on `http://localhost:3000`
2. One of the following tools:
   - **curl** (command line)
   - **Postman** (GUI)
   - **Thunder Client** (VS Code extension)
   - **Insomnia** (GUI)

---

## Test Data

The API comes pre-populated with 4 test reservations:

| ID | Guest | Room | Check-in | Check-out | Status |
|----|-------|------|----------|-----------|--------|
| RES001 | G001 | 103 | 2026-08-30 | 2026-09-02 | Confirmed |
| RES002 | G002 | 201 | 2026-09-05 | 2026-09-10 | Pending |
| RES003 | G003 | 202 | 2026-08-20 | 2026-08-25 | Completed |
| RES004 | G004 | 101 | 2026-09-15 | 2026-09-20 | Cancelled |

---

## Testing with curl

### 1. Get All Reservations
```bash
curl http://localhost:3000/api/reservations
```
**Expected**: 4 reservations returned

---

### 2. Get Single Reservation
```bash
curl http://localhost:3000/api/reservations/RES001
```
**Expected**: Single reservation with ID RES001

---

### 3. Create Reservation (POST)
```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "guestId": "G005",
    "roomId": "301",
    "checkInDate": "2026-09-25",
    "checkOutDate": "2026-09-30",
    "adults": 2,
    "children": 1,
    "status": "Pending",
    "specialRequests": "Late check-in needed"
  }'
```
**Expected**: New reservation created with ID RES005

---

### 4. Update Reservation (PUT)
```bash
curl -X PUT http://localhost:3000/api/reservations/RES001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "Completed",
    "specialRequests": "Updated request"
  }'
```
**Expected**: Reservation updated successfully

---

### 5. Cancel Reservation (DELETE)
```bash
curl -X DELETE http://localhost:3000/api/reservations/RES005 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
**Expected**: Reservation status changed to "Cancelled"

---

### 6. Get Guest Reservations
```bash
curl http://localhost:3000/api/reservations/guest/G001
```
**Expected**: All reservations for guest G001

---

### 7. Filter by Status - Confirmed
```bash
curl "http://localhost:3000/api/reservations/filter/status?status=Confirmed"
```
**Expected**: 1 reservation (RES001)

---

### 8. Filter by Status - Pending
```bash
curl "http://localhost:3000/api/reservations/filter/status?status=Pending"
```
**Expected**: 1 reservation (RES002)

---

### 9. Filter by Date Range
```bash
curl "http://localhost:3000/api/reservations/filter/date-range?startDate=2026-09-01&endDate=2026-09-30"
```
**Expected**: 2 reservations (RES002 and RES004)

---

### 10. Search by Reservation ID
```bash
curl "http://localhost:3000/api/reservations/search?query=RES001"
```
**Expected**: 1 reservation (RES001)

---

### 11. Search by Room Number
```bash
curl "http://localhost:3000/api/reservations/search?query=103"
```
**Expected**: 1 reservation (RES001 in room 103)

---

### 12. Search with Status Filter
```bash
curl "http://localhost:3000/api/reservations/search?query=crib&status=Pending"
```
**Expected**: 1 reservation (RES002 with "Crib needed" special request)

---

### 13. Get Filtered Reservations (Paginated)
```bash
curl "http://localhost:3000/api/reservations/filtered?page=1&limit=2&sortBy=id&sortOrder=asc"
```
**Expected**: 2 reservations per page, sorted by ID ascending

---

### 14. Get Statistics Summary
```bash
curl http://localhost:3000/api/reservations/stats/summary
```
**Expected Output**:
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

### 15. Get Statistics by Status
```bash
curl http://localhost:3000/api/reservations/stats/by-status
```
**Expected Output**:
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

### 16. Check Room Availability - Available
```bash
curl "http://localhost:3000/api/reservations/availability/room/301?startDate=2026-09-10&endDate=2026-09-15"
```
**Expected**: 
```json
{
  "success": true,
  "data": {
    "roomId": "301",
    "isAvailable": true,
    "conflictingReservations": [],
    "totalReservations": 0
  }
}
```

---

### 17. Check Room Availability - Booked
```bash
curl "http://localhost:3000/api/reservations/availability/room/103?startDate=2026-08-30&endDate=2026-09-02"
```
**Expected**: 
```json
{
  "success": true,
  "data": {
    "roomId": "103",
    "isAvailable": false,
    "conflictingReservations": [
      {
        "id": "RES001",
        "checkInDate": "2026-08-30",
        "checkOutDate": "2026-09-02",
        "status": "Confirmed"
      }
    ]
  }
}
```

---

## Testing with Postman

### Setup
1. Open Postman
2. Import `SyncBoard-API.postman_collection.json` from `backend/` folder
3. Select "Reservations" collection
4. Set Authorization token in collection settings

### Test Order
1. Run "Get All Reservations" (should return 4 items)
2. Run "Get Single Reservation" with ID RES001
3. Run "Create Reservation" with test data
4. Run "Update Reservation" to modify the created reservation
5. Run "Filter by Status" tests
6. Run "Search" tests
7. Run "Get Statistics" tests
8. Run "Check Availability" tests

---

## Testing with Thunder Client (VS Code)

1. Install Thunder Client extension
2. Click "Thunder Client" in left sidebar
3. Click "Import" and select `SyncBoard-API.postman_collection.json`
4. Run tests in order

---

## Error Testing

### Test Invalid Status
```bash
curl "http://localhost:3000/api/reservations/filter/status"
```
**Expected**: 400 Bad Request - "Status parameter is required"

---

### Test Invalid Date Format
```bash
curl "http://localhost:3000/api/reservations/filter/date-range?startDate=2026/09/01&endDate=2026/09/30"
```
**Expected**: 400 Bad Request - "Invalid date format"

---

### Test Non-existent Reservation
```bash
curl http://localhost:3000/api/reservations/INVALID999
```
**Expected**: 404 Not Found - "Reservation not found"

---

### Test Conflicting Dates on Create
```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "guestId": "G001",
    "roomId": "103",
    "checkInDate": "2026-08-31",
    "checkOutDate": "2026-09-01",
    "adults": 1,
    "children": 0,
    "status": "Pending"
  }'
```
**Expected**: 409 Conflict - "Room is already reserved for the selected dates"

---

## Performance Testing

### Test Large Offset Pagination
```bash
curl "http://localhost:3000/api/reservations/filtered?page=1000&limit=10"
```
**Expected**: Empty results for page beyond total pages

---

### Test Sorting Performance
```bash
curl "http://localhost:3000/api/reservations/filtered?sortBy=totalAmount&sortOrder=desc"
```
**Expected**: Results sorted by total amount descending

---

## Comprehensive Test Scenarios

### Scenario 1: Book a Room
1. Check availability: `GET /availability/room/301?startDate=2026-10-01&endDate=2026-10-05`
2. If available, create reservation with those dates
3. Verify creation with GET request

### Scenario 2: Search and Filter
1. Search by guest: `GET /search?query=G001`
2. Filter by status: `GET /filter/status?status=Confirmed`
3. Filter by date: `GET /filter/date-range?startDate=2026-09-01&endDate=2026-09-30`
4. Combine filters: `GET /search?query=room&status=Confirmed`

### Scenario 3: Generate Report
1. Get all statistics: `GET /stats/summary`
2. Get status breakdown: `GET /stats/by-status`
3. Export results to CSV (client-side)

### Scenario 4: Update Booking
1. Find reservation: `GET /RES001`
2. Check new dates availability: `GET /availability/room/103?startDate=2026-09-10&endDate=2026-09-15`
3. Update if available: `PUT /RES001` with new dates
4. Verify update: `GET /RES001`

---

## Automation Script

### Bash Script for Automated Testing
```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api/reservations"
TOKEN="your-token-here"

echo "Testing Reservations API..."

# Test 1: Get all
echo "1. Getting all reservations..."
curl -s "$BASE_URL" | jq '.data | length'

# Test 2: Get single
echo "2. Getting single reservation..."
curl -s "$BASE_URL/RES001" | jq '.data.id'

# Test 3: Filter by status
echo "3. Filtering by status (Confirmed)..."
curl -s "$BASE_URL/filter/status?status=Confirmed" | jq '.count'

# Test 4: Get stats
echo "4. Getting statistics..."
curl -s "$BASE_URL/stats/summary" | jq '.data.totalReservations'

# Test 5: Check availability
echo "5. Checking room availability..."
curl -s "$BASE_URL/availability/room/103?startDate=2026-10-01&endDate=2026-10-05" | jq '.data.isAvailable'

echo "All tests completed!"
```

Save as `test_reservations.sh` and run: `bash test_reservations.sh`

---

## Response Validation Checklist

- [ ] Status code is 200 or 201 for success
- [ ] `success` field is `true`
- [ ] `data` field contains expected results
- [ ] Pagination includes `pagination` object when applicable
- [ ] Count matches number of results
- [ ] Date formats are YYYY-MM-DD
- [ ] Timestamps are ISO format
- [ ] Total amounts are calculated correctly
- [ ] Status values are valid (Confirmed, Pending, Completed, Cancelled)

---

## Troubleshooting Test Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check token is valid, update TOKEN variable |
| Connection refused | Ensure backend server is running on port 3000 |
| Empty results | Verify test data exists, check filter parameters |
| Dates don't match | Verify dates in YYYY-MM-DD format |
| Wrong response | Check URL path is correct, no typos |

---

## Next Steps

1. ✅ Test all endpoints manually
2. ✅ Verify error handling
3. ✅ Check response formats
4. ✅ Validate pagination
5. ✅ Test search functionality
6. ✅ Confirm availability logic
7. ⏭️ Integrate with frontend
8. ⏭️ Set up automated tests
9. ⏭️ Performance testing
10. ⏭️ Deploy to production

---

## Resources

- API Documentation: `RESERVATIONS_API_DOCUMENTATION.md`
- Quick Reference: `RESERVATIONS_API_QUICK_REFERENCE.md`
- Postman Collection: `backend/SyncBoard-API.postman_collection.json`
- Frontend Integration: `RESERVATIONS_FRONTEND_INTEGRATION.md`
